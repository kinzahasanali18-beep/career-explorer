// scripts/phase4b_emit_citation_fixes.mjs
//
// Emits apply/revert artifacts for the 72 CONFIRMED citation fixes from the
// Phase 4b review. Reads Supabase with GET only and writes files — this script
// never modifies the database.
//
// Each fix replaces a fabricated bls.gov OOH URL with the real O*NET summary
// link for the verified SOC code. Only `source_url` changes; industry,
// requirements and everything else are untouched.
//
// Statements are grouped by target URL (many careers legitimately share one
// occupation — seven Video Editors all map to 27-4032.00) and guarded two ways:
//   id in (...)                                  the exact reviewed rows, and
//   source_url like 'https://www.bls.gov/ooh/%'  so a row whose citation has
//                                                since been fixed properly is
//                                                skipped rather than overwritten.
//
//   node scripts/phase4b_emit_citation_fixes.mjs [stamp] [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const DATE = "2026-08-19";
const STAMP = process.argv[2] || "20260819010000";
const SLUG = process.argv[3] || "citation_fixes";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { isValidSocCode, occupationTitle, socFromSourceUrl } = await import(path.join(ROOT, "src/occupations.js"));

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

// ─── load the CONFIRMED set ──────────────────────────────────────────────────

const review = parseCsv(fs.readFileSync(path.join(REPORTS, `PHASE4B_FULL_CANDIDATE_REVIEW_${DATE}.csv`), "utf8"));
const confirmed = review.filter(r => r.classification === "CONFIRMED");
if (!confirmed.length) { console.error("No CONFIRMED rows."); process.exit(1); }

for (const r of confirmed) {
  if (!isValidSocCode(r.candidate_soc)) { console.error(`ABORT: invalid SOC ${r.candidate_soc} for ${r.title}`); process.exit(1); }
  if (!r.proposed_source_url) { console.error(`ABORT: no proposed URL for ${r.title}`); process.exit(1); }
  if (socFromSourceUrl(r.proposed_source_url) !== r.candidate_soc) {
    console.error(`ABORT: proposed URL does not round-trip to its SOC for ${r.title}`); process.exit(1);
  }
}
console.log(`${confirmed.length} CONFIRMED rows; all SOC codes valid and all URLs round-trip.`);

// ─── re-read live values ─────────────────────────────────────────────────────

const ids = confirmed.map(r => r.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?select=id,name,source_url,primary_industry&id=in.(${ids.slice(i, i + 50).join(",")})`,
    { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const ready = [], drifted = [];
for (const r of confirmed) {
  const cur = live.get(r.id);
  if (!cur) { drifted.push({ r, why: "row missing" }); continue; }
  const url = cur.source_url || "";
  if (url === r.proposed_source_url) { drifted.push({ r, why: "already fixed" }); continue; }
  // Phase 4 produced UNVERIFIABLE rows two ways, and both are represented here:
  // a fabricated bls.gov OOH link, or an onetonline.org link carrying a code
  // that is not in the current taxonomy (several are retired pre-2018 SOC codes
  // such as 29-2071.00 for Medical Records). Accept either, and reject anything
  // that already resolves — that would mean the citation is fine and this fix is
  // stale.
  const isFabricatedBls = /^https:\/\/www\.bls\.gov\/ooh\//i.test(url);
  const citedCode = socFromSourceUrl(url);
  const isDeadOnet = Boolean(citedCode) && !isValidSocCode(citedCode);
  if (!isFabricatedBls && !isDeadOnet) {
    drifted.push({ r, why: `source_url already resolves, leaving it alone: ${url.slice(0, 70)}` });
    continue;
  }
  ready.push({ ...r, liveUrl: url });
}
console.log(`   ${ready.length} ready, ${drifted.length} excluded.`);
for (const d of drifted.slice(0, 10)) console.log(`     ${d.r.title}: ${d.why}`);
if (!ready.length) { console.log("Nothing to do."); process.exit(0); }

// ─── artifacts ───────────────────────────────────────────────────────────────

writeCsv(path.join(REPORTS, `phase4b_${SLUG}_manifest.csv`),
  ["id", "title", "soc_code", "onet_occupation", "from_source_url", "to_source_url"],
  ready.map(r => [r.id, r.title, r.candidate_soc, occupationTitle(r.candidate_soc), r.liveUrl, r.proposed_source_url]));

writeCsv(path.join(REPORTS, `phase4b_${SLUG}_backup_before.csv`),
  ["id", "title", "source_url"],
  ready.map(r => [r.id, r.title, r.liveUrl]));

// group by target URL
// Group by (old value, new value). Guarding on the exact old string is precise
// for both broken-citation shapes, and rows sharing an occupation usually share
// the same bad URL too, so this still compresses well.
const groups = new Map();
for (const r of ready) {
  const k = JSON.stringify([r.liveUrl, r.proposed_source_url]);
  if (!groups.has(k)) groups.set(k, { from: r.liveUrl, url: r.proposed_source_url, soc: r.candidate_soc, rows: [] });
  groups.get(k).rows.push(r);
}
const gs = [...groups.values()].sort((a, b) => b.rows.length - a.rows.length || a.soc.localeCompare(b.soc));

const header = [
  `-- Replace ${ready.length} fabricated bls.gov citations with real O*NET links.`,
  "--",
  "-- Source: reports/PHASE4B_FULL_CANDIDATE_REVIEW_2026-08-19.csv, rows where",
  "-- classification = CONFIRMED. Each was reviewed on meaning against the career's",
  "-- own description, not on string similarity: 33 of the 115 candidates were",
  "-- rejected as false matches (Radio DJ -> Radio Frequency Identification Device",
  "-- Specialists, VFX Supervisor -> Supervisors of Correctional Officers) and 10",
  "-- more left for a human. None of those are in this migration.",
  "--",
  "-- Only source_url changes. primary_industry, requirements and every other",
  "-- column are untouched. No rows are hidden or deleted.",
  "--",
  `-- Rows: ${ready.length} across ${gs.length} statements (careers sharing one`,
  "-- occupation are grouped; seven Video Editors all map to 27-4032.00).",
  "--",
  "-- Each statement is guarded twice: by the exact reviewed ids, and by the exact",
  "-- prior source_url, so a row whose citation changed in the meantime is skipped",
  "-- rather than overwritten. Re-running is a no-op.",
  "--",
  `-- Prior values: reports/phase4b_${SLUG}_backup_before.csv`,
  `-- Revert:       reports/phase4b_${SLUG}_revert.sql`,
  "",
];

const body = [];
for (const g of gs) {
  body.push(`--  ${g.rows.length} row${g.rows.length > 1 ? "s" : ""} -> ${g.soc} ${occupationTitle(g.soc)}`);
  for (const r of g.rows) body.push(`--    ${r.title}`);
  body.push(`update public.careers set source_url = ${sq(g.url)}`);
  body.push(`where source_url = ${sq(g.from)} and id in (`);
  body.push(g.rows.map(r => `  ${sq(r.id)}`).join(",\n"));
  body.push(");", "");
}

fs.writeFileSync(path.join(ROOT, "supabase/migrations", `${STAMP}_${SLUG}.sql`),
  [...header, "begin;", "", ...body, "commit;", ""].join("\n"));

const rev = [
  `-- Revert ${STAMP}_${SLUG}.sql — restores the previous source_url for ${ready.length} rows.`,
  "-- Note: the previous values are the fabricated bls.gov URLs. This exists to undo",
  "-- the migration exactly, not because those URLs were good.",
  "",
  "begin;",
  "",
  ...ready.map(r => `update public.careers set source_url = ${sq(r.liveUrl)} where id = ${sq(r.id)};  -- ${r.title}`),
  "",
  "commit;",
  "",
];
fs.writeFileSync(path.join(REPORTS, `phase4b_${SLUG}_revert.sql`), rev.join("\n"));

// chunked copies — a 72-row paste truncated silently last time
const CHUNKS = 3;
const per = Math.ceil(ready.length / CHUNKS);
let cur = [], chunks = [], count = 0;
for (const g of gs) {
  if (count && count + g.rows.length > per) { chunks.push(cur); cur = []; count = 0; }
  cur.push(g); count += g.rows.length;
}
if (cur.length) chunks.push(cur);
chunks.forEach((cg, i) => {
  const n = cg.reduce((a, g) => a + g.rows.length, 0);
  const L = [`-- Phase 4b citation fixes, chunk ${i + 1} of ${chunks.length} — ${n} rows, ${cg.length} statements.`,
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
  fs.writeFileSync(path.join(REPORTS, `phase4b_citation_chunk${i + 1}.sql`), text);
  console.log(`   chunk ${i + 1}: ${n} rows, ${cg.length} statements, ${text.length} chars`);
});

console.log("");
console.log(`Rows: ${ready.length}   statements: ${gs.length}   distinct occupations: ${gs.length}`);
console.log(`  supabase/migrations/${STAMP}_${SLUG}.sql`);
console.log(`  reports/phase4b_${SLUG}_manifest.csv`);
console.log(`  reports/phase4b_${SLUG}_backup_before.csv`);
console.log(`  reports/phase4b_${SLUG}_revert.sql`);
console.log(`  reports/phase4b_citation_chunk1..${chunks.length}.sql`);
console.log("\nNothing has been written to the database.");
