// scripts/phase2_emit_high_confidence_migration.mjs
//
// Emits the apply/revert artifacts for the HIGH-confidence industry
// corrections from PHASE2_FIX_PROPOSALS_2026-08-18.csv. Follows the pattern the
// earlier fix batches in reports/ already use: a backup of the prior values, a
// forward migration, and a revert script keyed by id.
//
// This script itself writes NOTHING to the database. It reads the proposals CSV,
// re-reads current values from Supabase with GET to confirm they still match
// what Phase 2 saw, and writes three files to disk. Applying the migration is a
// separate, explicit step.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const DATE = "2026-08-18";
// Batch label keeps each emitted batch's artifacts separate, so re-running for a
// later batch cannot overwrite an earlier batch's backup or revert script.
//   node scripts/phase2_emit_high_confidence_migration.mjs <stamp> <slug>
const STAMP = process.argv[2] || "20260818004500";
const SLUG = process.argv[3] || "high_confidence";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const header = rows.shift();
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}
const csvCell = v => {
  const s = v === null || v === undefined ? "" : String(v).replace(/\r?\n/g, " ");
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const sq = s => `'${String(s).replace(/'/g, "''")}'`;

// ─── Load proposals, take the HIGH set ───────────────────────────────────────

const all = parseCsv(fs.readFileSync(path.join(REPORTS, `PHASE2_FIX_PROPOSALS_${DATE}.csv`), "utf8"));
const high = all.filter(p => p.confidence === "HIGH");
if (!high.length) { console.error("No HIGH rows found."); process.exit(1); }

// Every HIGH row must actually carry a proposed primary; a blank would silently
// null out a live column.
const blank = high.filter(p => !p.proposed_primary_industry.trim());
if (blank.length) {
  console.error(`ABORT: ${blank.length} HIGH rows have an empty proposed_primary_industry.`);
  process.exit(1);
}

// ─── Re-read current values (GET) and confirm they still match ───────────────

console.log(`Re-reading ${high.length} rows from Supabase to confirm no drift...`);
const ids = high.map(p => p.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const chunk = ids.slice(i, i + 50);
  const url = `${SUPABASE_URL}/rest/v1/careers?select=id,name,primary_industry,secondary_industries&id=in.(${chunk.join(",")})`;
  const res = await fetch(url, { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const missing = [], drifted = [], ready = [];
for (const p of high) {
  const cur = live.get(p.id);
  if (!cur) { missing.push(p); continue; }
  if ((cur.primary_industry || "") !== p.current_primary_industry ||
      (cur.secondary_industries || "") !== p.current_secondary_industries) {
    drifted.push({ p, cur });
    continue;
  }
  ready.push(p);
}
console.log(`   ${ready.length} unchanged since the audit, ${drifted.length} drifted, ${missing.length} missing.`);
if (drifted.length) {
  console.log("   Drifted rows are EXCLUDED from the migration:");
  for (const { p, cur } of drifted.slice(0, 10)) {
    console.log(`     ${p.title}: expected "${p.current_primary_industry}" / "${p.current_secondary_industries}"`);
    console.log(`       but found "${cur.primary_industry}" / "${cur.secondary_industries}"`);
  }
}
if (missing.length) for (const p of missing) console.log(`     MISSING id ${p.id} (${p.title}) — row deleted since the audit`);

// ─── 1. Backup of prior values ───────────────────────────────────────────────

const backupPath = path.join(REPORTS, `phase2_${SLUG}_backup_before.csv`);
fs.writeFileSync(backupPath,
  ["id,name,primary_industry,secondary_industries",
   ...ready.map(p => [p.id, p.title, p.current_primary_industry, p.current_secondary_industries].map(csvCell).join(","))
  ].join("\n") + "\n");

// Manifest: the exact from -> to for this batch. The proposals CSV is
// regenerated on every audit run (and rows already fixed drop to NO CHANGE), so
// verification reads this frozen file instead.
fs.writeFileSync(path.join(REPORTS, `phase2_${SLUG}_manifest.csv`),
  ["id,title,from_primary,from_secondary,to_primary,to_secondary",
   ...ready.map(p => [p.id, p.title, p.current_primary_industry, p.current_secondary_industries,
     p.proposed_primary_industry, p.proposed_secondary_industries].map(csvCell).join(","))
  ].join("\n") + "\n");

// ─── 2. Forward migration ────────────────────────────────────────────────────

// Group rows sharing BOTH target values into one statement. The key is
// JSON-encoded rather than built by joining the two values with a separator:
// industry names contain spaces, commas and "&", and an earlier version used a
// NUL byte to dodge that, which worked but made this file unsearchable by grep.
// The values ride on the group so they never have to be recovered from the key.
const byPair = new Map();
for (const p of ready) {
  const k = JSON.stringify([p.proposed_primary_industry, p.proposed_secondary_industries]);
  if (!byPair.has(k)) {
    byPair.set(k, { prim: p.proposed_primary_industry, sec: p.proposed_secondary_industries, rows: [] });
  }
  byPair.get(k).rows.push(p);
}

const mig = [];
mig.push(`-- Apply ${ready.length} HIGH-confidence industry corrections from the Phase 2 audit.`);
mig.push("--");
mig.push("-- Source: reports/PHASE2_FIX_PROPOSALS_2026-08-18.csv, rows where confidence = HIGH.");
mig.push("-- HIGH means two independent signals agreed on the industry: O*NET's own");
mig.push("-- classification of the SOC code in the row's source_url, and the title-keyword");
mig.push("-- rule from Phase 1. Rows where only one signal was available, or where the two");
mig.push("-- disagreed, are deliberately NOT in this migration.");
mig.push("--");
mig.push("-- Each row gets two changes:");
mig.push("--   primary_industry     -> the O*NET-derived industry");
mig.push("--   secondary_industries -> the previous primary demoted to the front, so the");
mig.push("--                           displaced value is preserved rather than discarded");
mig.push("--");
mig.push(`-- Rows: ${ready.length}${drifted.length || missing.length ? `  (${drifted.length} drifted + ${missing.length} missing rows excluded)` : ""}`);
mig.push(`-- Prior values: reports/phase2_${SLUG}_backup_before.csv`);
mig.push(`-- Revert:       reports/phase2_${SLUG}_revert.sql`);
mig.push("--");
mig.push("-- Every statement is id-scoped and guarded on the current value, so re-running");
mig.push("-- is a no-op and a row edited in the meantime is skipped rather than overwritten.");
mig.push("");
mig.push("begin;");
mig.push("");
for (const { prim, sec, rows: group } of byPair.values()) {
  mig.push(`--  ${group.length} row${group.length > 1 ? "s" : ""} -> ${prim}`);
  for (const p of group) {
    mig.push(`--    ${p.title}  (was ${p.current_primary_industry}; SOC ${p.SOC_code_used} ${p.onet_occupation_title})`);
  }
  mig.push(`update public.careers set primary_industry = ${sq(prim)}, secondary_industries = ${sq(sec)}`);
  mig.push(`where id in (`);
  mig.push(group.map(p => `    ${sq(p.id)}`).join(",\n"));
  mig.push(`) and primary_industry = ${sq(group[0].current_primary_industry)};`);
  mig.push("");
}
// Guard: the per-group current-value check above uses group[0]'s current primary,
// which is only valid when the whole group shares it. Split any group that does not.
const badGroups = [...byPair.values()].filter(g => new Set(g.rows.map(p => p.current_primary_industry)).size > 1);
if (badGroups.length) {
  console.error(`ABORT: ${badGroups.length} groups mix different current primaries; the guard would be wrong.`);
  process.exit(1);
}
mig.push("commit;");
mig.push("");

const migPath = path.join(ROOT, "supabase/migrations", `${STAMP}_apply_phase2_${SLUG}_industry_fixes.sql`);
fs.writeFileSync(migPath, mig.join("\n"));

// ─── 3. Revert ───────────────────────────────────────────────────────────────

const rev = [];
rev.push("-- Revert the Phase 2 HIGH-confidence industry corrections.");
rev.push(`-- Restores primary_industry and secondary_industries for the ${ready.length} rows changed by`);
rev.push(`-- supabase/migrations/${STAMP}_apply_phase2_${SLUG}_industry_fixes.sql`);
rev.push("-- Values below are the pre-migration values read from the table on 2026-08-18.");
rev.push("");
rev.push("begin;");
rev.push("");
for (const p of ready) {
  rev.push(`update public.careers set primary_industry = ${sq(p.current_primary_industry)}, secondary_industries = ${sq(p.current_secondary_industries)} where id = ${sq(p.id)};  -- ${p.title}`);
}
rev.push("");
rev.push("commit;");
rev.push("");
fs.writeFileSync(path.join(REPORTS, `phase2_${SLUG}_revert.sql`), rev.join("\n"));

console.log("");
console.log(`Rows in migration:  ${ready.length}`);
console.log(`Distinct target industries: ${new Set(ready.map(p => p.proposed_primary_industry)).size}`);
console.log(`UPDATE statements:  ${byPair.size}`);
console.log("");
console.log(`  supabase/migrations/${STAMP}_apply_phase2_${SLUG}_industry_fixes.sql`);
console.log(`  reports/phase2_${SLUG}_backup_before.csv`);
console.log(`  reports/phase2_${SLUG}_revert.sql`);
console.log(`  reports/phase2_${SLUG}_manifest.csv`);
console.log("");
console.log("Nothing has been written to the database.");
