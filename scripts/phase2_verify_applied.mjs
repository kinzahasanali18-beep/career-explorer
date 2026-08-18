// scripts/phase2_verify_applied.mjs
//
// Read-only verification that the Phase 2 HIGH-confidence migration landed.
// GET requests only — this script cannot modify anything.
//
// For each of the 89 rows it compares the live values against what the migration
// intended and sorts them into: applied, not-yet-applied (still at the old
// value), or unexpected (something else entirely). Safe to run before the
// migration too — it will simply report all 89 as pending.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");

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

// node scripts/phase2_verify_applied.mjs <slug>
const SLUG = process.argv[2] || "high_confidence";
const manifestPath = path.join(REPORTS, `phase2_${SLUG}_manifest.csv`);
if (!fs.existsSync(manifestPath)) {
  console.error(`No manifest at ${manifestPath}`);
  process.exit(1);
}
const high = parseCsv(fs.readFileSync(manifestPath, "utf8")).map(m => ({
  id: m.id, title: m.title,
  current_primary_industry: m.from_primary, current_secondary_industries: m.from_secondary,
  proposed_primary_industry: m.to_primary, proposed_secondary_industries: m.to_secondary,
}));
console.log(`Batch: ${SLUG} (${high.length} rows)`);

const live = new Map();
const ids = high.map(p => p.id);
for (let i = 0; i < ids.length; i += 50) {
  const chunk = ids.slice(i, i + 50);
  const url = `${SUPABASE_URL}/rest/v1/careers?select=id,name,primary_industry,secondary_industries&id=in.(${chunk.join(",")})`;
  const res = await fetch(url, { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

// A later pass may legitimately have changed secondary_industries — the Phase 3
// demotion cleanup did exactly that on 91 of these rows. So primary and
// secondary are judged separately: a row whose primary is correct but whose
// secondaries were since edited by a known later batch is NOT "partially
// applied", it is applied and then superseded.
const supersededIds = new Set();
for (const f of fs.readdirSync(REPORTS)) {
  if (/^phase3_.*_manifest\.csv$/.test(f)) {
    for (const m of parseCsv(fs.readFileSync(path.join(REPORTS, f), "utf8"))) supersededIds.add(m.id);
  }
}

const applied = [], pending = [], unexpected = [], gone = [], superseded = [];
for (const p of high) {
  const cur = live.get(p.id);
  if (!cur) { gone.push(p); continue; }
  const nowPrim = cur.primary_industry || "";
  const nowSec = cur.secondary_industries || "";
  const primOk = nowPrim === p.proposed_primary_industry;
  const secOk = nowSec === p.proposed_secondary_industries;
  if (primOk && secOk) applied.push(p);
  else if (primOk && supersededIds.has(p.id)) superseded.push(p);
  else if (nowPrim === p.current_primary_industry && nowSec === p.current_secondary_industries) pending.push(p);
  else unexpected.push({ p, nowPrim, nowSec });
}

console.log(`Verifying ${high.length} rows against the frozen manifest (read-only)\n`);
console.log(`  applied as proposed : ${applied.length}`);
console.log(`  applied, secondaries since superseded by a Phase 3 batch : ${superseded.length}`);
console.log(`  still pending       : ${pending.length}`);
console.log(`  unexpected value    : ${unexpected.length}`);
console.log(`  row missing         : ${gone.length}`);

if (unexpected.length) {
  console.log("\nUnexpected — neither the old nor the proposed value:");
  for (const { p, nowPrim, nowSec } of unexpected.slice(0, 20)) {
    console.log(`  ${p.title}`);
    console.log(`    expected: ${p.proposed_primary_industry} | ${p.proposed_secondary_industries}`);
    console.log(`    found   : ${nowPrim} | ${nowSec}`);
  }
}
if (gone.length) {
  console.log("\nMissing rows:");
  for (const p of gone) console.log(`  ${p.id} ${p.title}`);
}

const good = applied.length + superseded.length;
if (good === high.length) {
  console.log(`\nAll ${high.length} primary corrections are live${superseded.length ? ` (${superseded.length} had secondaries further cleaned by Phase 3)` : " and match the manifest exactly"}.`);
} else if (pending.length === high.length) {
  console.log("\nNothing applied yet — every row is still at its pre-migration value.");
} else {
  console.log(`\nPartially applied: ${good} of ${high.length} correct.`);
  console.log(`Revert with reports/phase2_${SLUG}_revert.sql (id-scoped, safe to run on the applied subset).`);
}
