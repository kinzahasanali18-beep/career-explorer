// scripts/phase4b_verify_citation_fixes.mjs
//
// Read-only verification of the Phase 4b citation fixes. GET requests only.
//
// Checks three things, not just the one:
//   1. source_url now equals the manifest's target for all 72 rows
//   2. the new URL actually RESOLVES — socFromSourceUrl + isValidSocCode — which
//      is the whole point of the fix, not merely that a string changed
//   3. primary_industry did not move, since this pass was citation-only
//
//   node scripts/phase4b_verify_citation_fixes.mjs [slug]

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const SLUG = process.argv[2] || "citation_fixes";
const DATE = "2026-08-19";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.VITE_SUPABASE_URL, K = process.env.VITE_SUPABASE_ANON_KEY;
const { socFromSourceUrl, isValidSocCode, occupationTitle, careerOneStopCovers, resolveCitation } =
  await import(path.join(ROOT, "src/occupations.js"));

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

const man = parseCsv(fs.readFileSync(path.join(REPORTS, `phase4b_${SLUG}_manifest.csv`), "utf8"));
// prior industry values, to confirm this pass really was citation-only
const review = new Map(parseCsv(fs.readFileSync(path.join(REPORTS, `PHASE4B_FULL_CANDIDATE_REVIEW_${DATE}.csv`), "utf8"))
  .map(r => [r.id, r.primary_industry]));

const ids = man.map(m => m.id), live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const res = await fetch(`${U}/rest/v1/careers?select=id,name,source_url,primary_industry&id=in.(${ids.slice(i, i+50).join(",")})`,
    { method: "GET", headers: { apikey: K, Authorization: `Bearer ${K}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}`);
  for (const r of await res.json()) live.set(r.id, r);
}

const applied = [], pending = [], unexpected = [], gone = [];
let resolves = 0, cosLinks = 0, industryMoved = [];
for (const m of man) {
  const cur = live.get(m.id);
  if (!cur) { gone.push(m); continue; }
  const now = cur.source_url || "";
  if (now === m.to_source_url) applied.push(m);
  else if (now === m.from_source_url) pending.push(m);
  else unexpected.push({ m, now });

  const code = socFromSourceUrl(now);
  if (code && isValidSocCode(code)) {
    resolves++;
    if (resolveCitation(now)) cosLinks++;
  }
  const was = review.get(m.id);
  if (was !== undefined && was !== (cur.primary_industry || "")) {
    industryMoved.push({ m, was, now: cur.primary_industry });
  }
}

console.log(`Phase 4b citation fixes — ${man.length} rows (read-only)\n`);
console.log(`  source_url updated as proposed : ${applied.length}`);
console.log(`  still pending                  : ${pending.length}`);
console.log(`  unexpected value               : ${unexpected.length}`);
console.log(`  row missing                    : ${gone.length}`);
console.log("");
console.log(`  new URL resolves to a real SOC : ${resolves} / ${man.length}`);
console.log(`  renders a citation for students : ${cosLinks} / ${man.length}`);
console.log(`  primary_industry moved          : ${industryMoved.length}  (must be 0 — citation-only pass)`);

for (const u of unexpected.slice(0, 10)) console.log(`    ${u.m.title}: found ${u.now}`);
for (const g of gone) console.log(`    MISSING ${g.id} ${g.title}`);
for (const i of industryMoved.slice(0, 10)) console.log(`    ${i.m.title}: "${i.was}" -> "${i.now}"`);

const ok = applied.length === man.length && resolves === man.length && !industryMoved.length && !unexpected.length && !gone.length;
console.log(ok
  ? `\nAll ${man.length} citations now point at a real O*NET occupation; industries untouched.`
  : `\nReview the discrepancies above.`);
