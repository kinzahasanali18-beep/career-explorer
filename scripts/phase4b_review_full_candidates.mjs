// scripts/phase4b_review_full_candidates.mjs
//
// Review of the 115 "full-coverage" name-match candidates from Phase 4.
// READ-ONLY: reads the Phase 4 CSV and the careers table with GET, writes two
// report files. No database writes, no visibility changes.
//
// Each of the 115 was judged on MEANING, not string similarity, using the
// career's own description as evidence. Judgments are encoded below as data,
// keyed by the career id, so the output is reproducible and every call can be
// audited against the reason text.
//
//   CONFIRMED       the candidate O*NET occupation is genuinely the same job.
//                   A corrected source_url is proposed, built the same way the
//                   citation work builds them: onetonline.org/link/summary/<SOC>.
//                   The app derives the CareerOneStop link from that via
//                   resolveCitation(), so storing the O*NET URL is the
//                   convention already in use.
//   FALSE MATCH     the words overlapped but the job is different. No fix, and
//                   explicitly NOT a hide either — most of these are real jobs
//                   whose correct SOC is simply a different code.
//   STILL UNCERTAIN plausible but not safe to assert without a human. The most
//                   common cause is teaching level: O*NET's subject-specific
//                   teacher codes are all "Postsecondary", so a bare "Physics
//                   Teacher" could be that or a K-12 code (25-2031).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const DATE = "2026-08-19";
const SRC = path.join(REPORTS, `PHASE4_UNVERIFIABLE_${DATE}.csv`);

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

// ── Judgments, keyed by career title as printed in the Phase 4 candidate list ──
// value: [classification, reason, betterSoc?]
// betterSoc is a suggestion only — recorded to make a later fix pass cheaper,
// never applied here.
const J = {
  "Quality Assurance Analyst (Lab)": ["FALSE MATCH", "Lab sample testing, not software QA; description is about instruments and scientific rigour", "19-4099.01"],
  "Emergency Medical Technician": ["CONFIRMED", ""],
  "Tutor (Private Mathematics)": ["CONFIRMED", ""],
  "Clinical Laboratory Technologist": ["CONFIRMED", ""],
  "K-12 Science Teacher": ["FALSE MATCH", "K-12 science teaching matched a postsecondary Computer Science code", "25-2031.00"],
  "Video Editor (Freelance)": ["CONFIRMED", ""],
  "AI Trainer (Machine Learning)": ["FALSE MATCH", "Labels data and tunes ML models; matched Athletic Trainers on the word 'trainer'", "15-2051.00"],
  "Physicist (Research)": ["CONFIRMED", ""],
  "Cardiologist": ["CONFIRMED", ""],
  "Video Editor (Media)": ["CONFIRMED", ""],
  "Quality Assurance Analyst (Science)": ["FALSE MATCH", "Validates scientific experiments and data, not software", "19-4099.01"],
  "Video Editor (Documentary)": ["CONFIRMED", ""],
  "Sports Writer": ["FALSE MATCH", "Sports journalism matched Gambling and Sports Book Writers, a betting-desk role", "27-3023.00"],
  "Music Teacher": ["STILL UNCERTAIN", "Candidate is the Postsecondary music code; description does not state the level, and K-12 or private instruction are equally likely"],
  "Chemistry Teacher (High School)": ["FALSE MATCH", "Explicitly high school; candidate is the Postsecondary chemistry code", "25-2031.00"],
  "Special Education Teacher (Inclusive Design)": ["FALSE MATCH", "Candidate is Preschool Teachers, Except Special Education — the code explicitly excludes this job", "25-2059.00"],
  "System Administrator": ["CONFIRMED", ""],
  "QA Engineer": ["FALSE MATCH", "Software testing matched Logistics Engineers on 'engineer'", "15-1253.00"],
  "Lab Analyst": ["FALSE MATCH", "Clinical/scientific sample analysis matched Logistics Analysts on 'analyst'", "29-2011.00"],
  "Physics Teacher (High School)": ["FALSE MATCH", "Explicitly high school; candidate is the Postsecondary physics code", "25-2031.00"],
  "Barista (Specialty Coffee)": ["CONFIRMED", ""],
  "Radio Announcer": ["CONFIRMED", ""],
  "Science Teacher (Secondary)": ["FALSE MATCH", "Secondary science teaching matched a postsecondary Computer Science code", "25-2031.00"],
  "Sports Physician": ["CONFIRMED", ""],
  "Video Editor (Media Production)": ["CONFIRMED", ""],
  "Conservation Scientist": ["CONFIRMED", ""],
  "Video Editor (Broadcast)": ["CONFIRMED", ""],
  "Physical Therapist Assistant": ["CONFIRMED", ""],
  "Quality Control Analyst (Laboratory)": ["CONFIRMED", ""],
  "Drama Teacher (K-12)": ["FALSE MATCH", "Explicitly K-12; candidate is the Postsecondary art/drama/music code", "25-2031.00"],
  "Dermatologist": ["CONFIRMED", ""],
  "Medical Lab Technologist": ["CONFIRMED", ""],
  "Substitute Teacher": ["CONFIRMED", ""],
  "Neurologist": ["CONFIRMED", ""],
  "VIP Services Manager": ["STILL UNCERTAIN", "Luxury hospitality/events role matched Administrative Services Managers; event planning or lodging management may fit better"],
  "Elementary School Teacher (STEM)": ["CONFIRMED", ""],
  "Lab Animal Scientist": ["CONFIRMED", ""],
  "Science Teacher": ["FALSE MATCH", "General science teaching matched a postsecondary Computer Science code", "25-2031.00"],
  "Quality Assurance Analyst": ["STILL UNCERTAIN", "Description spans scientific experiments, software and products at once, so the intended occupation is genuinely unclear"],
  "Medical Technologist (Laboratory)": ["CONFIRMED", ""],
  "Music Teacher (Private)": ["FALSE MATCH", "Private one-to-one instruction; candidate is the Postsecondary code", "25-3021.00"],
  "Quality Assurance Analyst (Pharma)": ["FALSE MATCH", "Tests medications, not software", "19-4099.01"],
  "Athletic Trainer (College Sports)": ["CONFIRMED", ""],
  "ESL Teacher (International Schools)": ["FALSE MATCH", "English-language teaching matched Business Teachers, Postsecondary", "25-3011.00"],
  "Physical Medicine and Rehabilitation Physician": ["CONFIRMED", ""],
  "Medical Technologist": ["CONFIRMED", ""],
  "Radio DJ": ["FALSE MATCH", "Matched Radio Frequency Identification Device Specialists on 'radio'", "27-3011.00"],
  "Speech Pathology Assistant": ["CONFIRMED", ""],
  "Chemist (Pharmaceutical)": ["CONFIRMED", ""],
  "Video Editor (Broadcasting)": ["CONFIRMED", ""],
  "ESL Teacher (K-12)": ["FALSE MATCH", "English-language teaching matched Business Teachers, Postsecondary", "25-3011.00"],
  "Pediatrician": ["CONFIRMED", ""],
  "Quality Control Analyst (Pharma)": ["CONFIRMED", ""],
  "Emergency Medicine Physician": ["CONFIRMED", ""],
  "Ski Instructor": ["FALSE MATCH", "Matched Nursing Instructors and Teachers, Postsecondary on 'instructor'", "39-9031.00"],
  "AI Trainer": ["FALSE MATCH", "Same 'trainer' collision as AI Trainer (Machine Learning) — matched Athletic Trainers", "15-2051.00"],
  "Database Administrator": ["CONFIRMED", ""],
  "Emergency Medical Technician (Paramedic)": ["STILL UNCERTAIN", "O*NET separates EMTs (29-2042.00) from Paramedics (29-2043.00); the title names both and the description does not settle it"],
  "Physics Teacher": ["STILL UNCERTAIN", "Candidate is the Postsecondary physics code; the description does not state the teaching level"],
  "Emergency Medical Technician (EMT)": ["CONFIRMED", ""],
  "Science Teacher (High School)": ["FALSE MATCH", "High school science matched a postsecondary Computer Science code", "25-2031.00"],
  "Chemistry Teacher": ["STILL UNCERTAIN", "Candidate is the Postsecondary chemistry code; the description does not state the teaching level"],
  "Physicist (Particle Physics)": ["CONFIRMED", ""],
  "Lab Animal Caretaker": ["CONFIRMED", ""],
  "IT Systems Administrator": ["CONFIRMED", ""],
  "Surgeon (Orthopedic)": ["FALSE MATCH", "Orthopedic surgery matched Oral and Maxillofacial Surgeons — a different specialty", "29-1242.00"],
  "Pathologist": ["FALSE MATCH", "Diagnostic tissue pathology matched Speech-Language Pathologists on 'pathologist'", "29-1222.00"],
  "Elementary School Teacher (Science)": ["CONFIRMED", ""],
  "Law Clerk (Judge)": ["CONFIRMED", ""],
  "Video Editor (Content Creator)": ["CONFIRMED", ""],
  "Systems Architect": ["CONFIRMED", ""],
  "Physical Medicine & Rehabilitation Physician": ["CONFIRMED", ""],
  "ESL (English as Second Language) Teacher": ["FALSE MATCH", "English-language teaching matched Business Teachers, Postsecondary", "25-3011.00"],
  "UGC (User-Generated Content) Producer": ["STILL UNCERTAIN", "Social-content creation matched Producers and Directors, which O*NET scopes to film, stage and broadcast production"],
  "Lab Technician (Healthcare)": ["FALSE MATCH", "Clinical lab work matched Geographic Information Systems Technologists on 'technician'", "29-2012.00"],
  "Sports Medicine Physician": ["CONFIRMED", ""],
  "Acupuncturist": ["CONFIRMED", ""],
  "Drama Teacher": ["STILL UNCERTAIN", "Candidate is the Postsecondary art/drama/music code; the description does not state the teaching level"],
  "Laboratory Technician (Clinical)": ["CONFIRMED", ""],
  "Sonographer (Ultrasound Technician)": ["CONFIRMED", ""],
  "Tour Guide (Adventure Tourism)": ["CONFIRMED", ""],
  "Music Teacher (K-12)": ["FALSE MATCH", "Explicitly K-12; candidate is the Postsecondary code", "25-2031.00"],
  "Food Science Technician": ["CONFIRMED", ""],
  "VFX Supervisor": ["FALSE MATCH", "Visual effects matched First-Line Supervisors of Correctional Officers on 'supervisor'", "27-1014.00"],
  "Ophthalmologist": ["CONFIRMED", ""],
  "Atmospheric Scientist": ["CONFIRMED", ""],
  "Chemist (Industrial)": ["CONFIRMED", ""],
  "Nurse Anesthetist": ["CONFIRMED", ""],
  "Clinical Research Coordinator": ["CONFIRMED", ""],
  "Urologist": ["CONFIRMED", ""],
  "Psychiatrist": ["CONFIRMED", ""],
  "Physics Teacher (K-12)": ["FALSE MATCH", "Explicitly K-12; candidate is the Postsecondary physics code", "25-2031.00"],
  "Video Editor (Content Creation)": ["CONFIRMED", ""],
  "Claims Investigator": ["CONFIRMED", ""],
  "Research Analyst": ["STILL UNCERTAIN", "Generic research role matched Market Research Analysts; the description points at scientific rather than market research"],
  "iOS App Developer": ["CONFIRMED", ""],
  "GIS Analyst (Environmental)": ["FALSE MATCH", "Geospatial analysis matched Logistics Analysts on 'analyst'", "15-1299.02"],
  "Video Editor (Post-Production)": ["CONFIRMED", ""],
  "Medical Records Specialist": ["CONFIRMED", ""],
  "Paramedic": ["CONFIRMED", ""],
  "Special Education Teacher (ESL)": ["FALSE MATCH", "Candidate is Preschool Teachers, Except Special Education — the code explicitly excludes this job", "25-2059.00"],
  "Lab Technician (Clinical)": ["FALSE MATCH", "Clinical lab work matched Geographic Information Systems Technologists on 'technician'", "29-2012.00"],
  "Laboratory Technologist": ["CONFIRMED", ""],
  "Quality Assurance Tester (Software)": ["CONFIRMED", ""],
  "ML Ops Engineer": ["FALSE MATCH", "Machine-learning infrastructure matched Logistics Engineers on 'engineer'", "15-1299.09"],
  "Gym Manager": ["STILL UNCERTAIN", "Matched the catch-all General and Operations Managers; a recreation-supervisor or fitness code may fit better"],
  "Reporter (Specialized Beat)": ["CONFIRMED", ""],
  "ESL Teacher": ["FALSE MATCH", "English-language teaching matched Business Teachers, Postsecondary", "25-3011.00"],
  "Orthopedic Surgeon": ["CONFIRMED", ""],
  "Medical Sonographer": ["CONFIRMED", ""],
  "Occupational Therapy Assistant": ["CONFIRMED", ""],
  "Chemist (R&D)": ["CONFIRMED", ""],
  "Home Health Aide": ["CONFIRMED", ""],
  "Court Reporter (CART)": ["CONFIRMED", ""],
  "Athlete Agent": ["CONFIRMED", ""],
};

// ── build ────────────────────────────────────────────────────────────────────

const rows = parseCsv(fs.readFileSync(SRC, "utf8")).filter(r => r.candidate_tier === "full");
const missing = rows.filter(r => !J[r.title]);
const extra = Object.keys(J).filter(t => !rows.some(r => r.title === t));
if (missing.length || extra.length) {
  console.error(`Judgment coverage mismatch: ${missing.length} unjudged rows, ${extra.length} stale judgments.`);
  for (const m of missing.slice(0, 10)) console.error(`  unjudged: ${m.title}`);
  for (const e of extra.slice(0, 10)) console.error(`  stale:    ${e}`);
  if (missing.length) process.exit(1);
}

const out = rows.map(r => {
  const [cls, reason, better] = J[r.title];
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
    // A valid code can carry a blank title — occupations.js notes that some codes
    // validate but could not be labelled from the source page. So absence of a
    // title is NOT evidence the code is wrong; validity is asserted separately
    // below and a blank is rendered explicitly rather than looking like a miss.
    suggested_occupation: better ? (occupationTitle(better) || "(valid code; title not captured in the taxonomy snapshot)") : "",
    primary_industry: r.primary_industry,
  };
});

// Fail loudly if any suggested code is not in the taxonomy — a silently blank
// suggestion would look reviewed when it is not.
const badSuggestions = out.filter(o => o.suggested_soc_not_applied && !isValidSocCode(o.suggested_soc_not_applied));
if (badSuggestions.length) {
  console.error(`${badSuggestions.length} suggested SOC code(s) are not in the O*NET taxonomy:`);
  for (const b of badSuggestions) console.error(`  ${b.title} -> ${b.suggested_soc_not_applied}`);
  process.exit(1);
}

const tally = {};
for (const o of out) tally[o.classification] = (tally[o.classification] || 0) + 1;

writeCsv(path.join(REPORTS, `PHASE4B_FULL_CANDIDATE_REVIEW_${DATE}.csv`),
  ["id", "title", "candidate_onet_occupation", "candidate_soc", "classification",
   "proposed_source_url", "current_source_url", "reason",
   "suggested_soc_not_applied", "suggested_occupation", "primary_industry"],
  out.map(o => [o.id, o.title, o.candidate_onet_occupation, o.candidate_soc, o.classification,
    o.proposed_source_url, o.current_source_url, o.reason,
    o.suggested_soc_not_applied, o.suggested_occupation, o.primary_industry]));

const total = out.length;
const pct = n => ((n / total) * 100).toFixed(1);
const M = [];
M.push("# Phase 4b — Review of the 115 full-coverage name-match candidates");
M.push("");
M.push(`Generated **${DATE}** by \`scripts/phase4b_review_full_candidates.mjs\`.`);
M.push("**No database writes.** Verification and proposals only.");
M.push("");
M.push("Each candidate was judged on meaning, using the career's own description as evidence — not on string similarity.");
M.push("");
M.push("| Classification | Careers | % of 115 |");
M.push("|---|---|---|");
for (const k of ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"]) {
  M.push(`| ${k} | ${tally[k] || 0} | ${pct(tally[k] || 0)}% |`);
}
M.push("");
M.push(`**${tally["CONFIRMED"]} are safe to fix.** Each gets a real \`source_url\` built from its verified SOC code, replacing the fabricated bls.gov link.`);
M.push("");
M.push("## FALSE MATCH — the string matched, the job did not");
M.push("");
M.push(`${tally["FALSE MATCH"]} of 115. These are **real careers**; only the candidate was wrong. They must not be fixed to the candidate code, and must not be hidden either.`);
M.push("");
M.push("| Career | Bad candidate | Why it is wrong |");
M.push("|---|---|---|");
for (const o of out.filter(o => o.classification === "FALSE MATCH")) {
  M.push(`| ${o.title} | ${o.candidate_onet_occupation} | ${o.reason} |`);
}
M.push("");
M.push("Two patterns account for most of them:");
M.push("");
const teacherish = out.filter(o => o.classification === "FALSE MATCH" && /Postsecondary/i.test(o.candidate_onet_occupation)).length;
const wordColl = (tally["FALSE MATCH"] || 0) - teacherish;
M.push(`1. **Teaching level (${teacherish} rows).** O*NET's subject-specific teacher codes are all *Postsecondary*; K-12 teachers live under generic codes like 25-2031.00 Secondary School Teachers. So every "Chemistry Teacher (High School)" style row matched a university code.`);
M.push(`2. **Single-word collisions (${wordColl} rows).** "trainer", "analyst", "engineer", "technician", "supervisor", "pathologist", "radio" — e.g. Radio DJ → *Radio Frequency Identification Device Specialists*, VFX Supervisor → *First-Line Supervisors of Correctional Officers*.`);
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
M.push("| Career | O*NET occupation | SOC | Proposed `source_url` |");
M.push("|---|---|---|---|");
for (const o of out.filter(o => o.classification === "CONFIRMED")) {
  M.push(`| ${o.title} | ${o.candidate_onet_occupation} | ${o.candidate_soc} | \`${o.proposed_source_url}\` |`);
}
M.push("");
M.push("## Notes");
M.push("");
M.push("- `suggested_soc_not_applied` in the CSV carries a better code for most FALSE MATCH rows. It is a starting point for a later pass, **not** reviewed to the standard of the CONFIRMED column, and nothing uses it.");
M.push("- This covers only the 115 full-coverage candidates. The 313 strong / 363 weak / 103 unmatched rows from Phase 4 are untouched.");
M.push(`- Even at full coverage the naive matcher was wrong ${pct((tally["FALSE MATCH"] || 0) + (tally["STILL UNCERTAIN"] || 0))}% of the time, which is why the lower tiers should not be auto-applied at all.`);
M.push("");

fs.writeFileSync(path.join(REPORTS, `PHASE4B_SUMMARY_${DATE}.md`), M.join("\n"));

console.log(`Reviewed ${total} full-coverage candidates\n`);
for (const k of ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"]) {
  console.log(`  ${k.padEnd(16)} ${String(tally[k] || 0).padStart(4)}  ${pct(tally[k] || 0)}%`);
}
console.log(`\n  CSV: reports/PHASE4B_FULL_CANDIDATE_REVIEW_${DATE}.csv`);
console.log(`  Summary: reports/PHASE4B_SUMMARY_${DATE}.md`);
console.log("\nNothing was written to the database.");
