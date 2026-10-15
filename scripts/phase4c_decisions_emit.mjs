// scripts/phase4c_decisions_emit.mjs
//
// Emits apply/revert artifacts for the 78 approved rows in
// reports/PHASE4C_DECISIONS_FINAL.csv -- the human-reviewed MEDIUM/LOW/NONE
// decisions from the Phase 4c false-match rematch. Reads Supabase with GET
// only and writes files -- this script never modifies the database.
//
// Requires the new source_type and visible columns from
// supabase/migrations/20261016000000_add_decision_columns.sql to already
// exist (apply that migration first).
//
// Four actions, by the `action` column:
//   LINK              -- set source_url to the O*NET summary link for the
//                         recommended occupation, and source_type = 'related'
//   KEEP AS RELATED   -- same as LINK (same column changes, different
//                         confidence tier the recommendation came from)
//   KEEP AS EMERGING  -- set source_type = 'emerging' and source_url = NULL.
//                         Every one of these 8 rows carries an already-broken
//                         citation (fabricated bls.gov link or a retired
//                         pre-2018 SOC code), so nulling it is a no-op for
//                         what the app renders (resolveCitation() already
//                         returns null for all of them) and leaves no stale
//                         dead data sitting in the column. The prior value is
//                         still captured in the backup/manifest and restored
//                         by the revert script.
//   HIDE              -- set visible = false. No other column changes.
//
// Only source_url, source_type, and visible are ever touched.
// primary_industry, secondary_industries, reviewed, requirements and every
// other column are untouched and captured in the backup/manifest purely as
// witness columns.
//
//   node scripts/phase4c_decisions_emit.mjs [stamp] [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const STAMP = process.argv[2] || "20261016010000";
const SLUG = process.argv[3] || "decisions";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { isValidSocCode, occupationTitle, onetUrl, OCCUPATION_TITLES } = await import(path.join(ROOT, "src/occupations.js"));

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

// title -> SOC, built from the same taxonomy snapshot used throughout Phase 4
const TITLE_TO_SOC = {};
for (const [soc, title] of Object.entries(OCCUPATION_TITLES)) {
  if (title) TITLE_TO_SOC[title] = soc;
}

// ─── load the approved decisions ─────────────────────────────────────────────

const decisions = parseCsv(fs.readFileSync(path.join(REPORTS, "PHASE4C_DECISIONS_FINAL.csv"), "utf8"));
if (decisions.length !== 78) {
  console.error(`ABORT: expected 78 approved rows, found ${decisions.length}.`);
  process.exit(1);
}

for (const r of decisions) {
  if (r.action === "LINK" || r.action === "KEEP AS RELATED") {
    const soc = TITLE_TO_SOC[r.recommended];
    if (!soc) { console.error(`ABORT: no SOC mapping for recommended occupation "${r.recommended}" (${r.name})`); process.exit(1); }
    if (!isValidSocCode(soc)) { console.error(`ABORT: invalid SOC ${soc} for ${r.name}`); process.exit(1); }
    r._soc = soc;
    r._url = onetUrl(soc);
  }
}
const tally = {};
for (const r of decisions) tally[r.action] = (tally[r.action] || 0) + 1;
console.log("Action counts:", tally);

// ─── re-read live values ─────────────────────────────────────────────────────

// Part 1 (source_type, visible) is staged but not applied yet, so those
// columns do not exist live. Only select columns that exist today; the
// "from" side of source_type/visible is recorded as not-yet-added rather
// than queried.
const ids = decisions.map(r => r.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 40) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?select=id,name,source_url,primary_industry,secondary_industries,reviewed&id=in.(${ids.slice(i, i + 40).join(",")})`,
    { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const ready = [], missing = [];
for (const r of decisions) {
  const cur = live.get(r.id);
  if (!cur) { missing.push(r); continue; }
  ready.push({ ...r, liveUrl: cur.source_url, liveSourceType: null, liveVisible: "true",
    liveIndustry: cur.primary_industry, liveSecondary: cur.secondary_industries, liveReviewed: cur.reviewed });
}
if (missing.length) { console.error(`ABORT: ${missing.length} id(s) not found live:`, missing.map(r => r.name)); process.exit(1); }
console.log(`${ready.length} rows confirmed live.`);

// ─── artifacts ───────────────────────────────────────────────────────────────

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_manifest.csv`),
  ["id", "name", "action", "from_source_url", "to_source_url", "from_source_type", "to_source_type",
   "from_visible", "to_visible", "primary_industry", "secondary_industries", "reviewed"],
  ready.map(r => {
    const isLink = r.action === "LINK" || r.action === "KEEP AS RELATED";
    const isEmerging = r.action === "KEEP AS EMERGING";
    const toSourceType = isEmerging ? "emerging" : isLink ? "related" : r.liveSourceType;
    const toSourceUrl = isLink ? r._url : isEmerging ? "" : r.liveUrl;
    const toVisible = r.action === "HIDE" ? "false" : r.liveVisible;
    return [r.id, r.name, r.action,
      r.liveUrl, toSourceUrl,
      r.liveSourceType, toSourceType,
      r.liveVisible, toVisible,
      r.liveIndustry, r.liveSecondary, r.liveReviewed];
  }));

writeCsv(path.join(REPORTS, `phase4c_${SLUG}_backup_before.csv`),
  ["id", "name", "source_url", "source_type", "visible", "primary_industry", "secondary_industries", "reviewed"],
  ready.map(r => [r.id, r.name, r.liveUrl, r.liveSourceType, r.liveVisible, r.liveIndustry, r.liveSecondary, r.liveReviewed]));

// ─── build per-action UPDATE groups ──────────────────────────────────────────

const linkRows = ready.filter(r => r.action === "LINK" || r.action === "KEEP AS RELATED");
const emergingRows = ready.filter(r => r.action === "KEEP AS EMERGING");
const hideRows = ready.filter(r => r.action === "HIDE");

// LINK / KEEP AS RELATED: group by (old url, new url) like prior citation migrations
const linkGroups = new Map();
for (const r of linkRows) {
  const k = JSON.stringify([r.liveUrl, r._url]);
  if (!linkGroups.has(k)) linkGroups.set(k, { from: r.liveUrl, url: r._url, soc: r._soc, rows: [] });
  linkGroups.get(k).rows.push(r);
}
const linkGs = [...linkGroups.values()].sort((a, b) => b.rows.length - a.rows.length || a.soc.localeCompare(b.soc));

function linkStatement(g) {
  const L = [`-- ${g.rows.length} row${g.rows.length > 1 ? "s" : ""} -> ${g.soc} ${occupationTitle(g.soc)}`];
  for (const r of g.rows) L.push(`--    ${r.name}`);
  L.push(`update public.careers set source_url = ${sq(g.url)}, source_type = 'related'`);
  L.push(`where source_url = ${sq(g.from)} and id in (`);
  L.push(g.rows.map(r => `  ${sq(r.id)}`).join(",\n"));
  L.push(");", "");
  return L.join("\n");
}

// KEEP AS EMERGING: source_type = 'emerging', source_url = NULL (every one of
// these already carries a fabricated/dead citation, so this clears it rather
// than leaving stale dead data). Guard on id AND the exact prior source_url
// so a row that has drifted since this was staged is skipped, not silently
// reclassified under stale assumptions.
function emergingStatement(r) {
  return [
    `-- ${r.name} (prior source_url: ${r.liveUrl})`,
    `update public.careers set source_type = 'emerging', source_url = null`,
    `where id = ${sq(r.id)} and source_url = ${sq(r.liveUrl)};`,
    "",
  ].join("\n");
}

// HIDE: visible only.
function hideStatement(r) {
  return [
    `-- ${r.name}`,
    `update public.careers set visible = false`,
    `where id = ${sq(r.id)} and source_url = ${sq(r.liveUrl)};`,
    "",
  ].join("\n");
}

const allStatements = [
  ...linkGs.map(linkStatement),
  ...emergingRows.map(emergingStatement),
  ...hideRows.map(hideStatement),
];

const header = [
  `-- Apply the 78 approved Phase 4c decisions from reports/PHASE4C_DECISIONS_FINAL.csv.`,
  "--",
  `-- ${linkRows.length} rows: source_url -> the recommended O*NET occupation, source_type = 'related'.`,
  `-- ${emergingRows.length} rows: source_type = 'emerging', source_url = null -- each of these 8`,
  "--   already carried a fabricated or dead-SOC citation (see",
  "--   reports/PHASE4C_DECISIONS_EMERGING_SOURCE_URLS.csv for the prior values,",
  "--   also captured in the backup/manifest and restored by the revert script).",
  `-- ${hideRows.length} row: visible = false only.`,
  "--",
  "-- Requires supabase/migrations/20261016000000_add_decision_columns.sql to",
  "-- already be applied (adds source_type and visible).",
  "--",
  "-- Only source_url, source_type, and visible are ever touched.",
  "-- primary_industry, secondary_industries, reviewed and every other column",
  "-- are untouched and captured in the backup/manifest as witness columns.",
  "--",
  "-- Every statement is guarded by exact id and exact prior source_url, so a",
  "-- row whose source_url changed in the meantime is skipped rather than",
  "-- overwritten. Re-running is a no-op.",
  "--",
  `-- Prior values: reports/phase4c_${SLUG}_backup_before.csv`,
  `-- Revert:       reports/phase4c_${SLUG}_revert.sql`,
  "",
];

const migrationPath = path.join(ROOT, "supabase/migrations", `${STAMP}_${SLUG}.sql`);
fs.writeFileSync(migrationPath, [...header, "begin;", "", ...allStatements, "commit;", ""].join("\n"));

// ─── revert ──────────────────────────────────────────────────────────────────

const rev = [
  `-- Revert ${STAMP}_${SLUG}.sql — restores source_url, source_type, and visible`,
  `-- for ${ready.length} rows to their pre-migration values.`,
  "",
  "begin;",
  "",
  ...ready.map(r =>
    `update public.careers set source_url = ${sq(r.liveUrl)}, source_type = ${r.liveSourceType ? sq(r.liveSourceType) : "null"}, visible = ${r.liveVisible} where id = ${sq(r.id)};  -- ${r.name}`),
  "",
  "commit;",
  "",
];
fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_revert.sql`), rev.join("\n"));

// ─── chunks (same guard against paste-truncation as prior phases) ───────────

const CHUNKS = 4;
const per = Math.ceil(allStatements.length / CHUNKS);
let chunks = [];
for (let i = 0; i < allStatements.length; i += per) chunks.push(allStatements.slice(i, i + per));
chunks.forEach((cg, i) => {
  const L = [`-- Phase 4c decisions migration, chunk ${i + 1} of ${chunks.length} — ${cg.length} statements.`,
    "-- Guarded on exact id and exact prior source_url; idempotent.", "", "begin;", "", ...cg, "commit;", ""];
  const text = L.join("\n");
  fs.writeFileSync(path.join(REPORTS, `phase4c_${SLUG}_chunk${i + 1}.sql`), text);
  console.log(`   chunk ${i + 1}: ${cg.length} statements, ${text.length} chars`);
});

// ─── record of what the 8 EMERGING rows' source_url is being nulled from ───

writeCsv(path.join(REPORTS, "PHASE4C_DECISIONS_EMERGING_SOURCE_URLS.csv"),
  ["id", "name", "source_url_before_null"],
  emergingRows.map(r => [r.id, r.name, r.liveUrl]));

console.log("");
console.log(`LINK/RELATED rows: ${linkRows.length} across ${linkGs.length} statements`);
console.log(`EMERGING rows: ${emergingRows.length} (source_type = 'emerging', source_url -> null)`);
console.log(`HIDE rows: ${hideRows.length} (visible only)`);
console.log(`  ${migrationPath}`);
console.log(`  reports/phase4c_${SLUG}_manifest.csv`);
console.log(`  reports/phase4c_${SLUG}_backup_before.csv`);
console.log(`  reports/phase4c_${SLUG}_revert.sql`);
console.log(`  reports/phase4c_${SLUG}_chunk1..${chunks.length}.sql`);
console.log(`  reports/PHASE4C_DECISIONS_EMERGING_SOURCE_URLS.csv`);
console.log("\nNothing has been written to the database. Migration file is staged, not applied.");
