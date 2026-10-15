// scripts/phase4c_age_hide_emit.mjs
//
// Emits apply/revert artifacts for the 38 HIDE rows from
// reports/AGE_APPROPRIATE_REVIEW_2026-10-15.csv -- careers whose core
// function is gambling, alcohol, or cannabis, reviewed against the career's
// own description/requirements (not just a keyword match) for age
// appropriateness on a platform aimed at students 14-22. The 4 BORDERLINE
// rows from that review are explicitly NOT touched here.
//
// Reads Supabase with GET only and writes files -- this script never
// modifies the database.
//
// Only `visible` is ever touched, set false. primary_industry,
// secondary_industries, reviewed, source_url, and source_type are
// untouched and captured in the backup/manifest purely as witness columns.
//
// Every statement is guarded by exact id AND visible = true (not by
// source_url -- this migration has nothing to do with citations), so a row
// already hidden by some other process is skipped rather than redundantly
// touched, and the guard is meaningful on re-run (idempotent).
//
//   node scripts/phase4c_age_hide_emit.mjs [stamp] [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const STAMP = process.argv[2] || "20261015020000";
const SLUG = process.argv[3] || "age_inappropriate_hide";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

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
const sq = s => `'${String(s).replace(/'/g, "''")}'`;

// ─── load the approved HIDE set ──────────────────────────────────────────────

const review = parseCsv(fs.readFileSync(path.join(REPORTS, "AGE_APPROPRIATE_REVIEW_2026-10-15.csv"), "utf8"));
const hide = review.filter(r => r.recommendation === "HIDE");
if (hide.length !== 38) {
  console.error(`ABORT: expected 38 HIDE rows, found ${hide.length}.`);
  process.exit(1);
}
console.log(`${hide.length} HIDE rows found in AGE_APPROPRIATE_REVIEW_2026-10-15.csv.`);

// ─── re-read live values ─────────────────────────────────────────────────────

const ids = hide.map(r => r.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 40) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?select=id,name,visible,primary_industry,secondary_industries,reviewed,source_url,source_type&id=in.(${ids.slice(i, i + 40).join(",")})`,
    { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const ready = [], drifted = [];
for (const r of hide) {
  const cur = live.get(r.id);
  if (!cur) { drifted.push({ r, why: "row missing" }); continue; }
  if (cur.visible !== true) { drifted.push({ r, why: `already visible=${cur.visible}, not true` }); continue; }
  ready.push({ ...r, liveIndustry: cur.primary_industry, liveSecondary: cur.secondary_industries,
    liveReviewed: cur.reviewed, liveSourceUrl: cur.source_url, liveSourceType: cur.source_type });
}
console.log(`   ${ready.length} ready, ${drifted.length} excluded.`);
for (const d of drifted) console.log(`     ${d.r.name}: ${d.why}`);
if (!ready.length) { console.log("Nothing to do."); process.exit(0); }

// ─── artifacts ───────────────────────────────────────────────────────────────

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_manifest.csv`),
  ["id", "name", "matched_term", "age_rule", "from_visible", "to_visible", "primary_industry", "secondary_industries", "reviewed", "source_url", "source_type"],
  ready.map(r => [r.id, r.name, r.matched_term, r.age_rule, "true", "false", r.liveIndustry, r.liveSecondary, r.liveReviewed, r.liveSourceUrl, r.liveSourceType]));

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_backup_before.csv`),
  ["id", "name", "visible", "primary_industry", "secondary_industries", "reviewed", "source_url", "source_type"],
  ready.map(r => [r.id, r.name, "true", r.liveIndustry, r.liveSecondary, r.liveReviewed, r.liveSourceUrl, r.liveSourceType]));

const header = [
  `-- Hide ${ready.length} age-inappropriate careers (gambling, alcohol, cannabis).`,
  "--",
  "-- Source: reports/AGE_APPROPRIATE_REVIEW_2026-10-15.csv, rows where",
  "-- recommendation = HIDE. Each was reviewed on meaning against the career's",
  "-- own description/requirements, not on keyword match alone -- 6 raw keyword",
  "-- hits (metaphorical 'weapon', film distributors, a law-enforcement 21+",
  "-- hiring floor, an elected-office age minimum) were reviewed and excluded",
  "-- as false positives, and are not in this migration. The 4 BORDERLINE rows",
  "-- (alcohol incidental to a general F&B/hospitality role) are also NOT in",
  "-- this migration and remain visible.",
  "--",
  "-- Only visible changes, to false. primary_industry, secondary_industries,",
  "-- reviewed, source_url, and source_type are untouched and captured in the",
  "-- backup/manifest as witness columns.",
  "--",
  `-- Rows: ${ready.length}, one statement each.`,
  "--",
  "-- Each statement is guarded by exact id AND visible = true, so a row",
  "-- already hidden by some other process is skipped rather than",
  "-- redundantly touched. Re-running is a no-op.",
  "--",
  `-- Prior values: reports/phase4c_${SLUG}_backup_before.csv`,
  `-- Revert:       reports/phase4c_${SLUG}_revert.sql`,
  "",
];

function hideStatement(r) {
  return [
    `-- ${r.name}`,
    `update public.careers set visible = false`,
    `where id = ${sq(r.id)} and visible = true;`,
    "",
  ].join("\n");
}

const body = ready.map(hideStatement);
const migrationPath = path.join(ROOT, "supabase/migrations", `${STAMP}_${SLUG}.sql`);
fs.writeFileSync(migrationPath, [...header, "begin;", "", ...body, "commit;", ""].join("\n"));

const rev = [
  `-- Revert ${STAMP}_${SLUG}.sql — restores visible = true for ${ready.length} rows.`,
  "",
  "begin;",
  "",
  ...ready.map(r => `update public.careers set visible = true where id = ${sq(r.id)};  -- ${r.name}`),
  "",
  "commit;",
  "",
];
fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_revert.sql`), rev.join("\n"));

// ─── chunks ──────────────────────────────────────────────────────────────────

const CHUNKS = 4;
const per = Math.ceil(body.length / CHUNKS);
let chunks = [];
for (let i = 0; i < body.length; i += per) chunks.push(body.slice(i, i + per));
chunks.forEach((cg, i) => {
  const L = [`-- Age-inappropriate hide migration, chunk ${i + 1} of ${chunks.length} — ${cg.length} statements.`,
    "-- Guarded on exact id and visible = true; idempotent.", "", "begin;", "", ...cg, "commit;", ""];
  const text = L.join("\n");
  fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_chunk${i + 1}.sql`), text);
  console.log(`   chunk ${i + 1}: ${cg.length} statements, ${text.length} chars`);
});

console.log("");
console.log(`Rows: ${ready.length}`);
console.log(`  ${migrationPath}`);
console.log(`  reports/phase4c_${SLUG}_manifest.csv`);
console.log(`  reports/phase4c_${SLUG}_backup_before.csv`);
console.log(`  reports/phase4c_${SLUG}_revert.sql`);
console.log(`  reports/phase4c_${SLUG}_chunk1..${chunks.length}.sql`);
console.log("\nNothing has been written to the database. Migration file is staged, not applied.");
