// scripts/phase4c_rematch_emit_citation_fixes.mjs
//
// Emits apply/revert artifacts for the HIGH-confidence rows from the Phase 4c
// false-match rematch (reports/PHASE4C_FALSE_MATCH_REMATCH.csv) -- the 203
// FALSE MATCH careers from the strong-tier review, each rematched to a correct
// O*NET occupation and reviewed a second time to catch generic/umbrella title
// collisions (Analyst, Specialist, Technician, Coordinator, Educator, Manager,
// Operator, Instructor) where more than one occupation could reasonably fit.
// Only HIGH survives that second pass goes into this migration; MEDIUM, LOW
// and NONE rows are left alone entirely.
//
// Reads Supabase with GET only and writes files -- this script never modifies
// the database.
//
// Each fix replaces a wrong-but-valid O*NET citation (the strong-tier name
// matcher's candidate) with the real O*NET summary link for the rematched SOC
// code. Only `source_url` changes; primary_industry, secondary_industries,
// reviewed, requirements and every other column are untouched. `reviewed` is
// explicitly NOT set to true.
//
// These 203 FALSE MATCH careers all came from Phase 4's UNVERIFIABLE pool, so
// their *live* source_url is the same kind of broken citation the original
// Phase 4c citation-fix script handled -- a fabricated bls.gov OOH link, or an
// onetonline.org link carrying a retired pre-2018 SOC code. The matcher's
// `wrong_soc`/`wrong_occupation` was never written to the row; it was only
// ever the candidate replacement this review rejected. So the guard here is
// the same as Phase 4c's: accept a row only if its live source_url is
// fabricated or dead, and skip (never overwrite) anything that already
// resolves to a valid SOC code, in case it was fixed by something else since.
//
//   node scripts/phase4c_rematch_emit_citation_fixes.mjs [stamp] [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const STAMP = process.argv[2] || "20261015010000";
const SLUG = process.argv[3] || "rematch_citation_fixes";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { isValidSocCode, occupationTitle, socFromSourceUrl, onetUrl } = await import(path.join(ROOT, "src/occupations.js"));

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

// ─── load the HIGH set ───────────────────────────────────────────────────────

const rematch = parseCsv(fs.readFileSync(path.join(REPORTS, "PHASE4C_FALSE_MATCH_REMATCH.csv"), "utf8"));
const high = rematch.filter(r => r.confidence === "HIGH");
if (!high.length) { console.error("No HIGH rows."); process.exit(1); }
console.log(`${high.length} HIGH rows found in PHASE4C_FALSE_MATCH_REMATCH.csv.`);

for (const r of high) {
  if (!isValidSocCode(r.wrong_soc)) { console.error(`ABORT: invalid wrong_soc ${r.wrong_soc} for ${r.name}`); process.exit(1); }
  if (!isValidSocCode(r.proposed_soc)) { console.error(`ABORT: invalid proposed_soc ${r.proposed_soc} for ${r.name}`); process.exit(1); }
  const proposed = onetUrl(r.proposed_soc);
  if (socFromSourceUrl(proposed) !== r.proposed_soc) {
    console.error(`ABORT: proposed URL does not round-trip to its SOC for ${r.name}`); process.exit(1);
  }
  r._proposed = proposed;
}
console.log("All wrong_soc and proposed_soc codes valid; all proposed URLs round-trip.");

// ─── re-read live values ─────────────────────────────────────────────────────

const ids = high.map(r => r.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?select=id,name,source_url,primary_industry,secondary_industries,reviewed&id=in.(${ids.slice(i, i + 50).join(",")})`,
    { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const ready = [], drifted = [];
for (const r of high) {
  const cur = live.get(r.id);
  if (!cur) { drifted.push({ r, why: "row missing" }); continue; }
  const url = cur.source_url || "";
  if (url === r._proposed) { drifted.push({ r, why: "already fixed" }); continue; }
  const isFabricatedBls = /^https:\/\/www\.bls\.gov\/ooh\//i.test(url);
  const citedCode = socFromSourceUrl(url);
  const isDeadOnet = Boolean(citedCode) && !isValidSocCode(citedCode);
  if (!isFabricatedBls && !isDeadOnet) {
    drifted.push({ r, why: `source_url already resolves, leaving it alone: ${url.slice(0, 70)}` });
    continue;
  }
  ready.push({ ...r, liveUrl: url, liveIndustry: cur.primary_industry, liveSecondary: cur.secondary_industries, liveReviewed: cur.reviewed });
}
console.log(`   ${ready.length} ready, ${drifted.length} excluded.`);
for (const d of drifted.slice(0, 10)) console.log(`     ${d.r.name}: ${d.why}`);
if (!ready.length) { console.log("Nothing to do."); process.exit(0); }

// ─── artifacts ───────────────────────────────────────────────────────────────

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_manifest.csv`),
  ["id", "name", "wrong_soc", "wrong_occupation", "proposed_soc", "proposed_occupation", "from_source_url", "to_source_url", "primary_industry", "secondary_industries", "reviewed"],
  ready.map(r => [r.id, r.name, r.wrong_soc, occupationTitle(r.wrong_soc), r.proposed_soc, occupationTitle(r.proposed_soc), r.liveUrl, r._proposed, r.liveIndustry, r.liveSecondary, r.liveReviewed]));

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_backup_before.csv`),
  ["id", "name", "source_url", "primary_industry", "secondary_industries", "reviewed"],
  ready.map(r => [r.id, r.name, r.liveUrl, r.liveIndustry, r.liveSecondary, r.liveReviewed]));

// group by (old value, new value). Rows sharing an occupation usually share
// the same wrong URL too, so this compresses well.
const groups = new Map();
for (const r of ready) {
  const k = JSON.stringify([r.liveUrl, r._proposed]);
  if (!groups.has(k)) groups.set(k, { from: r.liveUrl, url: r._proposed, soc: r.proposed_soc, rows: [] });
  groups.get(k).rows.push(r);
}
const gs = [...groups.values()].sort((a, b) => b.rows.length - a.rows.length || a.soc.localeCompare(b.soc));

const header = [
  `-- Replace ${ready.length} wrong-but-valid O*NET citations with the rematched SOC.`,
  "--",
  "-- Source: reports/PHASE4C_FALSE_MATCH_REMATCH.csv, rows where confidence =",
  "-- HIGH. These are the 203 FALSE MATCH careers from the Phase 4c strong-tier",
  "-- review, each independently rematched to a correct O*NET occupation using",
  "-- the career's own description/requirements as evidence, then re-checked a",
  "-- second time for generic/umbrella title collisions (Analyst, Specialist,",
  "-- Technician, Coordinator, Educator, Manager, Operator, Instructor) where",
  "-- more than one occupation could reasonably fit -- those were downgraded to",
  "-- MEDIUM and are NOT in this migration. MEDIUM (69), LOW (8) and NONE (8)",
  "-- rows are all left alone.",
  "--",
  "-- Only source_url changes. primary_industry, secondary_industries,",
  "-- requirements, reviewed and every other column are untouched. reviewed is",
  "-- NOT set to true. No rows are hidden or deleted.",
  "--",
  `-- Rows: ${ready.length} across ${gs.length} statements (careers sharing one`,
  "-- rematched occupation are grouped).",
  "--",
  "-- Each statement is guarded twice: by the exact reviewed ids, and by the",
  "-- exact prior source_url (the fabricated/dead citation already on the row),",
  "-- so a row whose citation changed in the meantime is skipped rather than",
  "-- overwritten. Re-running is a no-op.",
  "--",
  `-- Prior values: reports/phase4c_${SLUG}_backup_before.csv`,
  `-- Revert:       reports/phase4c_${SLUG}_revert.sql`,
  "",
];

const body = [];
for (const g of gs) {
  body.push(`--  ${g.rows.length} row${g.rows.length > 1 ? "s" : ""} -> ${g.soc} ${occupationTitle(g.soc)}`);
  for (const r of g.rows) body.push(`--    ${r.name}`);
  body.push(`update public.careers set source_url = ${sq(g.url)}`);
  body.push(`where source_url = ${sq(g.from)} and id in (`);
  body.push(g.rows.map(r => `  ${sq(r.id)}`).join(",\n"));
  body.push(");", "");
}

const migrationPath = path.join(ROOT, "supabase/migrations", `${STAMP}_${SLUG}.sql`);
fs.writeFileSync(migrationPath, [...header, "begin;", "", ...body, "commit;", ""].join("\n"));

const rev = [
  `-- Revert ${STAMP}_${SLUG}.sql — restores the previous source_url for ${ready.length} rows.`,
  "-- Note: the previous values are the wrong-but-valid citations this migration",
  "-- fixes. This exists to undo the migration exactly, not because those URLs",
  "-- were good.",
  "",
  "begin;",
  "",
  ...ready.map(r => `update public.careers set source_url = ${sq(r.liveUrl)} where id = ${sq(r.id)};  -- ${r.name}`),
  "",
  "commit;",
  "",
];
fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_revert.sql`), rev.join("\n"));

// chunked copies, same guard against silent paste-truncation as phase4b/4c
const CHUNKS = 4;
const per = Math.ceil(ready.length / CHUNKS);
let cur = [], chunks = [], count = 0;
for (const g of gs) {
  if (count && count + g.rows.length > per) { chunks.push(cur); cur = []; count = 0; }
  cur.push(g); count += g.rows.length;
}
if (cur.length) chunks.push(cur);
chunks.forEach((cg, i) => {
  const n = cg.reduce((a, g) => a + g.rows.length, 0);
  const L = [`-- Phase 4c rematch citation fixes, chunk ${i + 1} of ${chunks.length} — ${n} rows, ${cg.length} statements.`,
    "-- Guarded on the exact prior source_url; idempotent.", "", "begin;", ""];
  for (const g of cg) {
    L.push(`-- ${g.soc} ${occupationTitle(g.soc)}`);
    L.push(`update public.careers set source_url = ${sq(g.url)}`);
    L.push(`where source_url = ${sq(g.from)} and id in (`);
    L.push(g.rows.map(r => `  ${sq(r.id)}`).join(",\n"));
    L.push(");", "");
  }
  L.push("commit;", "");
  const text = L.join("\n");
  fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_chunk${i + 1}.sql`), text);
  console.log(`   chunk ${i + 1}: ${n} rows, ${cg.length} statements, ${text.length} chars`);
});

console.log("");
console.log(`Rows: ${ready.length}   statements: ${gs.length}   distinct occupations: ${gs.length}`);
console.log(`  ${migrationPath}`);
console.log(`  reports/phase4c_${SLUG}_manifest.csv`);
console.log(`  reports/phase4c_${SLUG}_backup_before.csv`);
console.log(`  reports/phase4c_${SLUG}_revert.sql`);
console.log(`  reports/phase4c_${SLUG}_chunk1..${chunks.length}.sql`);
console.log("\nNothing has been written to the database. Migration file is staged, not applied.");
