// scripts/phase4c_reclassify_6.mjs
//
// Moves 6 rows out of CONFIRMED into STILL UNCERTAIN, per human review after
// the Phase 4c semantic pass: each one's candidate SOC was internally
// inconsistent with a sibling row in the same CONFIRMED set (e.g. Nuclear
// Physicist -> Nuclear Engineers, while Quantum Physicist in the same batch
// correctly went to Physicists), so the automated judgment is overturned here
// rather than trusted.
//
// READ-ONLY. Rewrites reports/PHASE4C_STRONG_CANDIDATE_REVIEW_2026-09-15.csv
// and reports/PHASE4C_SUMMARY_2026-09-15.md on disk only. No Supabase calls.
//
//   node scripts/phase4c_reclassify_6.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const DATE = "2026-09-15";
const CSV = path.join(REPORTS, `PHASE4C_STRONG_CANDIDATE_REVIEW_${DATE}.csv`);
const MD = path.join(REPORTS, `PHASE4C_SUMMARY_${DATE}.md`);

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
  return { header: h, rows: rows.filter(r => r.length > 1).map(r => Object.fromEntries(h.map((x, i) => [x, r[i] ?? ""]))) };
}
const csvCell = v => {
  const s = v === null || v === undefined ? "" : String(v).replace(/\r?\n/g, " ");
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (f, header, rows) =>
  fs.writeFileSync(f, [header.join(","), ...rows.map(r => r.map(csvCell).join(","))].join("\n") + "\n");

// id -> reason the human override gave, for the "what is unresolved" column
const OVERRIDE = {
  "24d81937-881f-478d-b6d3-0e15c757ca31": ["Nuclear Physicist", "Nuclear Engineers", "A nuclear physicist is a physicist, not an engineer; Quantum Physicist in the same CONFIRMED batch correctly went to Physicists (19-2012.00) — inconsistent with that sibling row"],
  "2ef66e04-1bbf-4b41-9b14-dac36340c769": ["Medical Coder (ICD/CPT)", "Medical and Health Services Managers", "Coding is not management; Medical Coding Specialist and Medical Records Administrator in the same batch correctly went to Medical Records Specialists (29-2072.00) — inconsistent with those sibling rows"],
  "32a39b86-e5ee-479e-8e7f-2e51023327fc": ["Broadcast Meteorologist", "Broadcast Announcers and Radio Disc Jockeys", "Matched on 'broadcast'; a meteorologist belongs under Atmospheric and Space Scientists (19-2021.00), which Atmospheric Chemist in the same batch correctly uses"],
  "5d2829cc-1b93-4619-a104-16ac5a42c74c": ["Laboratory Animal Technician", "Medical and Clinical Laboratory Technicians", "Lab *animal* work belongs under Veterinary Assistants and Laboratory Animal Caretakers (31-9096.00), which two other rows in this batch correctly use"],
  "22a85874-12d2-4c58-a37b-5d0665a058bc": ["Forest Conservation Manager", "Forest and Conservation Technicians", "Manager-level title matched a technician-level code; job-zone mismatch"],
  "9489852c-6e64-41b5-940d-15aa19dee894": ["Physics Teacher Researcher", "Physics Teachers, Postsecondary", "Near-identical title 'Physics Teacher/Researcher' sits in STILL UNCERTAIN for exactly this teaching-level ambiguity; this row should not have been scored differently"],
};
const EXCLUDE_IDS = new Set(Object.keys(OVERRIDE));

// ── rewrite the CSV ──────────────────────────────────────────────────────────

const { header, rows } = parseCsv(fs.readFileSync(CSV, "utf8"));
let moved = 0;
for (const r of rows) {
  if (EXCLUDE_IDS.has(r.id)) {
    if (r.classification !== "CONFIRMED") throw new Error(`${r.title} (${r.id}) was expected to be CONFIRMED, found ${r.classification}`);
    const [title, , reason] = OVERRIDE[r.id];
    if (r.title !== title) throw new Error(`id ${r.id} title mismatch: expected "${title}", found "${r.title}"`);
    r.classification = "STILL UNCERTAIN";
    r.reason = reason;
    r.proposed_source_url = "";
    moved++;
  }
}
if (moved !== EXCLUDE_IDS.size) throw new Error(`Expected to move ${EXCLUDE_IDS.size} rows, moved ${moved}`);
writeCsv(CSV, header, rows.map(r => header.map(h => r[h])));

// ── tally + rewrite the classification table and STILL UNCERTAIN table in the MD ──

const tally = {};
for (const r of rows) tally[r.classification] = (tally[r.classification] || 0) + 1;
const total = rows.length;
const pct = n => ((n / total) * 100).toFixed(1);

let md = fs.readFileSync(MD, "utf8");

md = md.replace(
  /\| Classification \| Careers \| % of 313 \|\n\|---\|---\|---\|\n(?:\|.*\|\n)+/,
  "| Classification | Careers | % of 313 |\n|---|---|---|\n" +
  ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"].map(k => `| ${k} | ${tally[k] || 0} | ${pct(tally[k] || 0)}% |`).join("\n") + "\n"
);
md = md.replace(/\*\*\d+ are safe to fix\.\*\*/, `**${tally["CONFIRMED"]} are safe to fix.**`);

const newRows = Object.entries(OVERRIDE)
  .map(([id, [title, candidate]]) => `| ${title} | ${candidate} | ${rows.find(r => r.id === id).reason} |`)
  .join("\n");
md = md.replace(
  /(## STILL UNCERTAIN — needs a human\n\n\| Career \| Candidate \| What is unresolved \|\n\|---\|---\|---\|\n)/,
  `$1${newRows}\n`
);

fs.writeFileSync(MD, md);

console.log(`Moved ${moved} rows from CONFIRMED to STILL UNCERTAIN:`);
for (const [id, [title]] of Object.entries(OVERRIDE)) console.log(`  ${title}  (${id})`);
console.log("");
console.log("New tally:");
for (const k of ["CONFIRMED", "FALSE MATCH", "STILL UNCERTAIN"]) console.log(`  ${k.padEnd(16)} ${String(tally[k] || 0).padStart(4)}  ${pct(tally[k] || 0)}%`);
console.log(`\nRewrote:\n  ${CSV}\n  ${MD}`);
