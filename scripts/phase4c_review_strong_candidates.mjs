// scripts/phase4c_review_strong_candidates.mjs
//
// Review of the 313 "strong-tier" (50-74% word-overlap) name-match candidates
// from Phase 4. READ-ONLY: reads the Phase 4 CSV, the careers table with GET
// (already pulled into scripts/phase4c_strong_judgments.json), and writes two
// report files. No database writes, no visibility changes.
//
// Same standard as scripts/phase4b_review_full_candidates.mjs, which did this
// for the 115 "full-coverage" (100%) candidates: every one of the 313 was
// judged on MEANING, using the career's own description and requirements as
// evidence, not on string similarity. Judgments live in
// scripts/phase4c_strong_judgments.json, keyed by career id (not title --
// unlike the full-coverage tier, several titles repeat across different ids
// with different correct answers, e.g. two different "Physical Medicine &
// Rehabilitation Specialist" rows).
//
//   CONFIRMED       the candidate O*NET occupation is genuinely the same job.
//   FALSE MATCH     the words overlapped but the job is different. No fix, and
//                   explicitly NOT a hide either -- most of these are real jobs
//                   whose correct SOC is simply a different code.
//   STILL UNCERTAIN plausible but not safe to assert without a human.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const SRC_DATE = "2026-08-19";
const OUT_DATE = "2026-09-15";
const SRC = path.join(REPORTS, `PHASE4_UNVERIFIABLE_${SRC_DATE}.csv`);
const JUDGMENTS_FILE = path.join(__dirname, "phase4c_strong_judgments.json");

const { onetUrl, isValidSocCode, occupationTitle } = await import(path.join(ROOT, "src/occupations.js"));

function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) { const c = text[i];
    if (q) { if (c === '"') { if (text[i+1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const h = rows.shift();
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(h.map((x, i) => [x, r[i] ?? ""])));
}
const csvCell = v => {
  const s = v === null || v === undefined ? "" : String(v).replace(/\r?\n/g, " ");
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (f, header, rows) =>
  fs.writeFileSync(f, [header.join(","), ...rows.map(r => r.map(csvCell).join(","))].join("\n") + "\n");

// ── Judgments, keyed by career id ───────────────────────────────────────────
// value: [classification, reason, betterSoc?]
// betterSoc is a suggestion only -- recorded to make a later fix pass cheaper,
// never applied here.
const J = JSON.parse(fs.readFileSync(JUDGMENTS_FILE, "utf8"));

// ── build ────────────────────────────────────────────────────────────────────

const rows = parseCsv(fs.readFileSync(SRC, "utf8")).filter(r => r.candidate_tier === "strong");
const missing = rows.filter(r => !J[r.id]);
const extra = Object.keys(J).filter(id => !rows.some(r => r.id === id));
if (missing.length || extra.length) {
  console.error(`Judgment coverage mismatch: ${missing.length} unjudged rows, ${extra.length} stale judgments.`);
  for (const m of missing.slice(0, 10)) console.error(`  unjudged: ${m.id} ${m.title}`);
  for (const e of extra.slice(0, 10)) console.error(`  stale:    ${e}`);
  if (missing.length) process.exit(1);
}

const out = rows.map(r => {
  const [cls, reason, better] = J[r.id];
  const confirmed = cls === "CONFIRMED";
  if (confirmed && !isValidSocCode(r.candidate_soc)) throw new Error(`CONFIRMED row has an invalid SOC: ${r.title} ${r.candidate_soc}`);
  return {
    id: r.id, title: r.title,
    candidate_soc: r.candidate_soc,
    candidate_onet_occupation: r.candidate_onet_title,
    classification: cls,
    proposed_source_url: confirmed ? onetUrl(r.candidate_soc) : "",
    current_source_url: r.source_url,
    reason: reason,
    suggested_soc_not_applied: better || "",
    // A valid code can carry a blank title -- occupations.js notes that some codes
    // validate but could not be labelled from the source page. So absence of a
    // title is NOT evidence the code is wrong; validity is asserted separately
    // below and a blank is rendered explicitly rather than looking like a miss.
    suggested_occupation: better ? (occupationTitle(better) || "(valid code; title not captured in the taxonomy snapshot)") : "",
    primary_industry: r.primary_industry,
    candidate_coverage: r.candidate_coverage,
  };
});

// Fail loudly if any suggested code is not in the taxonomy -- a silently blank
// suggestion would look reviewed when it is not.
const badSuggestions = out.filter(o => o.suggested_soc_not_applied && !isValidSocCode(o.suggested_soc_not_applied));
if (badSuggestions.length) {
  console.error(`${badSuggestions.length} suggested SOC code(s) are not in the O*NET taxonomy:`);
  for (const b of badSuggestions) console.error(`  ${b.title} -> ${b.suggested_soc_not_applied}`);
  process.exit(1);
}

const tally = {};
for (const o of out) tally[o.classification] = (tally[o.classification] || 0) + 1;

writeCsv(path.join(REPORTS, `PHASE4C_STRONG_CANDIDATE_REVIEW_${OUT_DATE}.csv`),
  ["id", "title", "candidate_onet_occupation", "candidate_soc", "classification",
   "proposed_source_url", "current_source_url", "reason",
   "suggested_soc_not_applied", "suggested_occupation", "primary_industry", "candidate_coverage"],
  out.map(o => [o.id, o.title, o.candidate_onet_occupation, o.candidate_soc, o.classification,
    o.proposed_source_url, o.current_source_url, o.reason,
    o.suggested_soc_not_applied, o.suggested_occupation, o.primary_industry, o.candidate_coverage]));

const total = out.length;
const pct = n => ((n / total) * 100).toFixed(1);
const M = [];
M.push("# Phase 4c — Review of the 313 strong-tier name-match candidates");
M.push("");
M.push(`Generated **${OUT_DATE}** by \`scripts/phase4c_review_strong_candidates.mjs\`.`);
M.push("**No database writes.** Verification and proposals only.");
M.push("");
M.push("Each candidate was judged on meaning, using the career's own description and requirements as evidence -- not on string similarity. Same standard as Phase 4b's review of the 115 full-coverage candidates.");
M.push("");
M.push("| Classification | Careers | % of 313 |");
M.push("|---|---|---|");
for (const k of ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"]) {
  M.push(`| ${k} | ${tally[k] || 0} | ${pct(tally[k] || 0)}% |`);
}
M.push("");
M.push(`**${tally["CONFIRMED"]} are safe to fix.** Each gets a real \`source_url\` built from its verified SOC code, replacing the fabricated bls.gov link.`);
M.push("");
M.push("## FALSE MATCH — the string matched, the job did not");
M.push("");
M.push(`${tally["FALSE MATCH"]} of 313. These are **real careers**; only the candidate was wrong. They must not be fixed to the candidate code, and must not be hidden either.`);
M.push("");
M.push("Dominant patterns, most of which repeat the Phase 4b findings at larger scale:");
M.push("");
const wordCollisions = [
  ["'Specialist' -> Water Resource Specialists (11-9121.02)", /Water Resource Specialists/i],
  ["Software/industrial QA -> Software Quality Assurance Analysts and Testers (15-1253.00)", /Software Quality Assurance/i],
  ["Generic manager catch-all -> General and Operations Managers (11-1021.00)", /General and Operations Managers/i],
  ["'Clinical' -> Clinical Research Coordinators (11-9121.01)", /Clinical Research Coordinators/i],
  ["'Analyst' -> Logistics Analysts (13-1081.02)", /Logistics Analysts/i],
  ["'Engineer' -> Logistics Engineers (13-1081.01)", /Logistics Engineers/i],
  ["'Checker' -> Credit Authorizers, Checkers, and Clerks (43-4041.00)", /Credit Authorizers/i],
  ["'Educator' -> Farm and Home Management Educators (25-9021.00)", /Farm and Home Management Educators/i],
  ["'Instructor' -> Nursing Instructors and Teachers, Postsecondary (25-1072.00)", /Nursing Instructors and Teachers, Postsecondary/i],
  ["'Host' -> Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop (35-9031.00)", /Hosts and Hostesses/i],
  ["'Technician' -> Geographic Information Systems Technologists (15-1299.02)", /Geographic Information Systems/i],
  ["'Video' -> Video Game Designers (15-1255.01)", /Video Game Designers/i],
  ["'Radio'/'Device' -> Radio Frequency Identification Device Specialists (17-2072.01)", /Radio Frequency Identification/i],
  ["Teaching level -> a Postsecondary-only teacher code", /Postsecondary/i],
];
for (const [label, re] of wordCollisions) {
  const n = out.filter(o => o.classification === "FALSE MATCH" && re.test(o.candidate_onet_occupation)).length;
  if (n > 0) M.push(`- **${label}** (${n} rows)`);
}
M.push("");
M.push("A few word-overlap clusters turned out to be genuine matches rather than collisions, and are CONFIRMED almost across the board: **Film and Video Editors**, **Chemists**, **Sports Medicine Physicians**, **Physical Medicine and Rehabilitation Physicians**, and **News Analysts, Reporters, and Journalists** (the last of these because the career names really are journalist/reporter titles, not because the matcher is reliable in general).");
M.push("");
M.push("Full list with reasons: `reports/PHASE4C_STRONG_CANDIDATE_REVIEW_" + OUT_DATE + ".csv`.");
M.push("");
M.push("## STILL UNCERTAIN — needs a human");
M.push("");
M.push("| Career | Candidate | What is unresolved |");
M.push("|---|---|---|");
for (const o of out.filter(o => o.classification === "STILL UNCERTAIN")) {
  M.push(`| ${o.title} | ${o.candidate_onet_occupation} | ${o.reason} |`);
}
M.push("");
M.push("## CONFIRMED — proposed citation fixes");
M.push("");
M.push("`source_url` gets the O*NET summary link for the verified code. That is the existing convention: the app stores the O*NET URL and `resolveCitation()` derives the student-facing CareerOneStop link from the same code.");
M.push("");
M.push("Full list (87 rows) is in the CSV. A representative sample:");
M.push("");
M.push("| Career | O*NET occupation | SOC | Proposed `source_url` |");
M.push("|---|---|---|---|");
const confirmedSample = out.filter(o => o.classification === "CONFIRMED");
const sampleStep = Math.max(1, Math.floor(confirmedSample.length / 20));
for (let i = 0; i < confirmedSample.length; i += sampleStep) {
  const o = confirmedSample[i];
  M.push(`| ${o.title} | ${o.candidate_onet_occupation} | ${o.candidate_soc} | \`${o.proposed_source_url}\` |`);
}
M.push("");
M.push("## Notes");
M.push("");
M.push("- `suggested_soc_not_applied` in the CSV carries a better code for most FALSE MATCH rows. It is a starting point for a later pass, **not** reviewed to the standard of the CONFIRMED column, and nothing uses it.");
M.push("- This covers only the 313 strong-tier candidates. The 363 weak-tier and 103 no-shared-word rows from Phase 4 are untouched, and would need the same treatment before any bulk action.");
M.push(`- The false-match rate here (${pct(tally["FALSE MATCH"] || 0)}%) is higher than the full-coverage tier's 28.7% (Phase 4b), confirming the prediction that weaker word-overlap tiers misfire more often. Do not auto-apply this tier or any weaker one.`);
M.push("- A handful of CONFIRMED and FALSE MATCH rows also carry an obviously mismatched `primary_industry` tag (e.g. a physician tagged 'Cybersecurity', an app developer tagged 'Aviation & Transportation') -- separate from citation accuracy, and not corrected by this pass.");
M.push("");

fs.writeFileSync(path.join(REPORTS, `PHASE4C_SUMMARY_${OUT_DATE}.md`), M.join("\n"));

console.log(`Reviewed ${total} strong-tier candidates\n`);
for (const k of ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"]) {
  console.log(`  ${k.padEnd(16)} ${String(tally[k] || 0).padStart(4)}  ${pct(tally[k] || 0)}%`);
}
console.log(`\n  CSV: reports/PHASE4C_STRONG_CANDIDATE_REVIEW_${OUT_DATE}.csv`);
console.log(`  Summary: reports/PHASE4C_SUMMARY_${OUT_DATE}.md`);
console.log("\nNothing was written to the database.");
