// scripts/phase3_verify_applied.mjs
//
// Read-only verification of the Phase 3 demotion cleanup. GET requests only.
// Compares live secondary_industries against the frozen manifest and confirms
// primary_industry was NOT touched.
//
//   node scripts/phase3_verify_applied.mjs [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const SLUG = process.argv[2] || "demotion_cleanup";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.VITE_SUPABASE_URL, K = process.env.VITE_SUPABASE_ANON_KEY;

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

const man = parseCsv(fs.readFileSync(path.join(REPORTS, `phase3_${SLUG}_manifest.csv`), "utf8"));
const ids = man.map(m => m.id), live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const res = await fetch(`${U}/rest/v1/careers?select=id,name,primary_industry,secondary_industries&id=in.(${ids.slice(i, i+50).join(",")})`,
    { method: "GET", headers: { apikey: K, Authorization: `Bearer ${K}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const applied = [], pending = [], unexpected = [], primaryChanged = [];
for (const m of man) {
  const cur = live.get(m.id);
  if (!cur) { unexpected.push({ m, why: "row missing" }); continue; }
  if ((cur.primary_industry || "") !== m.primary_industry) primaryChanged.push({ m, now: cur.primary_industry });
  const now = cur.secondary_industries || "";
  if (now === m.to_secondary) applied.push(m);
  else if (now === m.from_secondary) pending.push(m);
  else unexpected.push({ m, why: `secondary is "${now}"` });
}

console.log(`Phase 3 batch: ${SLUG} (${man.length} rows)\n`);
console.log(`  tag removed as proposed : ${applied.length}`);
console.log(`  still pending           : ${pending.length}`);
console.log(`  unexpected              : ${unexpected.length}`);
console.log(`  primary_industry changed: ${primaryChanged.length}  (must be 0 — this pass is subtractive only)`);
for (const u of unexpected.slice(0, 10)) console.log(`    ${u.m.title}: ${u.why}`);
for (const p of primaryChanged.slice(0, 10)) console.log(`    ${p.m.title}: primary now "${p.now}", expected "${p.m.primary_industry}"`);

// Confirm the removed industry is genuinely gone and nothing else shifted.
let residual = 0, collateral = 0;
for (const m of applied) {
  const now = (live.get(m.id).secondary_industries || "").split(",").map(s => s.trim()).filter(Boolean);
  if (now.includes(m.removed_industry)) residual++;
  const expected = m.from_secondary.split(",").map(s => s.trim()).filter(Boolean).filter(s => s !== m.removed_industry);
  if (now.join("|") !== expected.join("|")) collateral++;
}
console.log(`\n  removed tag still present: ${residual}  (must be 0)`);
console.log(`  other tags altered/reordered: ${collateral}  (must be 0)`);
console.log(applied.length === man.length && !residual && !collateral && !primaryChanged.length
  ? `\nAll ${man.length} tags removed cleanly; primaries and remaining tags untouched.`
  : `\nReview the discrepancies above.`);
