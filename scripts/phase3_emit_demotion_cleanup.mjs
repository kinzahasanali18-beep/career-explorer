// scripts/phase3_emit_demotion_cleanup.mjs
//
// Batches 1 and 2 corrected primary_industry and demoted the displaced primary
// into secondary_industries so the old value would not be lost. That was right
// when the old primary was plausible — "Aerospace Supply Chain Risk Analyst"
// really is aviation-adjacent. It was wrong when the old primary was nonsense:
// "Hospital Chaplain" kept Gaming & Esports.
//
// This pass proposes removing the demoted value where the career itself provides
// no evidence for it. The test is evidence-based rather than a hand-picked list
// of bad industry pairs: using the SAME keyword rules Phase 1 used (shared via
// phase1_keyword_rules.cjs), does any keyword supporting that industry appear in
// the career's title or description? If yes, the tag stays. If no, it goes.
//
// Read-only against Supabase — GET requests only. Emits SQL for review; applying
// it is a separate, explicit step.
//
//   node scripts/phase3_emit_demotion_cleanup.mjs <stamp> <slug>

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");

const STAMP = process.argv[2] || "20260818020000";
const SLUG = process.argv[3] || "demotion_cleanup";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { KEYWORDS_BY_INDUSTRY, compileRules } = require("./phase1_keyword_rules.cjs");
compileRules();

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

// ─── Everything applied so far ───────────────────────────────────────────────

const applied = [];
for (const slug of ["high_confidence", "unambiguous_major_group"]) {
  const f = path.join(REPORTS, `phase2_${slug}_manifest.csv`);
  if (fs.existsSync(f)) for (const r of parseCsv(f && fs.readFileSync(f, "utf8"))) applied.push({ ...r, batch: slug });
}
console.log(`Applied rows to review: ${applied.length}`);

const ids = applied.map(r => r.id);
const live = new Map();
for (let i = 0; i < ids.length; i += 50) {
  const url = `${SUPABASE_URL}/rest/v1/careers?select=id,name,description,primary_industry,secondary_industries&id=in.(${ids.slice(i, i + 50).join(",")})`;
  const res = await fetch(url, { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
  for (const r of await res.json()) live.set(r.id, r);
}

// ─── Evidence test ───────────────────────────────────────────────────────────

/** Does the career's own text support this industry, by Phase 1's rules? */
function evidenceFor(industry, title, description) {
  const rules = KEYWORDS_BY_INDUSTRY.get(industry);
  if (!rules || !rules.length) return { evaluable: false, hits: [] };
  const haystack = `${title} ${description}`;
  const hits = [];
  for (const r of rules) {
    if (r.ctx && !r.ctx.test(haystack)) continue;   // same context gate as Phase 1
    if (r.re.test(title) || r.re.test(description)) hits.push(r.kw);
  }
  return { evaluable: true, hits };
}

const strip = [], keep = [], skipped = [], drift = [];
for (const a of applied) {
  const cur = live.get(a.id);
  if (!cur) { drift.push({ a, why: "row missing" }); continue; }

  const demoted = a.from_primary;
  const sec = (cur.secondary_industries || "").split(",").map(s => s.trim()).filter(Boolean);

  if (!sec.includes(demoted)) { drift.push({ a, why: `demoted value "${demoted}" no longer in secondaries` }); continue; }
  if (cur.primary_industry !== a.to_primary) { drift.push({ a, why: `primary is "${cur.primary_industry}", expected "${a.to_primary}"` }); continue; }

  const ev = evidenceFor(demoted, cur.name || "", cur.description || "");
  if (!ev.evaluable) {
    skipped.push({ a, demoted, reason: `no keyword rules exist for "${demoted}" — cannot test for evidence, left untouched` });
    continue;
  }
  if (ev.hits.length) {
    keep.push({ a, demoted, hits: ev.hits });
    continue;
  }
  strip.push({
    a, demoted, cur,
    newSec: sec.filter(s => s !== demoted).join(","),
    oldSec: cur.secondary_industries || "",
  });
}

console.log(`  strip (no supporting evidence): ${strip.length}`);
console.log(`  keep  (evidence found)        : ${keep.length}`);
console.log(`  skipped (not evaluable)       : ${skipped.length}`);
console.log(`  drifted                       : ${drift.length}`);

if (keep.length) {
  console.log("\nKept, with the keyword that justified it:");
  for (const k of keep.slice(0, 12)) console.log(`  ${k.a.title.slice(0, 34).padEnd(34)} keeps ${k.demoted} (matched: ${k.hits.slice(0, 3).join(", ")})`);
}
if (skipped.length) {
  const by = new Map();
  for (const s of skipped) by.set(s.demoted, (by.get(s.demoted) || 0) + 1);
  console.log("\nSkipped as not evaluable:");
  for (const [k, n] of by) console.log(`  ${n} rows — ${k}`);
}
if (drift.length) {
  console.log("\nDrifted (excluded):");
  for (const d of drift.slice(0, 10)) console.log(`  ${d.a.title}: ${d.why}`);
}

if (!strip.length) { console.log("\nNothing to strip."); process.exit(0); }

// ─── Emit ────────────────────────────────────────────────────────────────────

fs.writeFileSync(path.join(REPORTS, `phase3_${SLUG}_manifest.csv`),
  ["id,title,primary_industry,removed_industry,from_secondary,to_secondary",
   ...strip.map(s => [s.a.id, s.a.title, s.cur.primary_industry, s.demoted, s.oldSec, s.newSec].map(csvCell).join(","))
  ].join("\n") + "\n");

fs.writeFileSync(path.join(REPORTS, `phase3_${SLUG}_backup_before.csv`),
  ["id,title,primary_industry,secondary_industries",
   ...strip.map(s => [s.a.id, s.a.title, s.cur.primary_industry, s.oldSec].map(csvCell).join(","))
  ].join("\n") + "\n");

const mig = [];
mig.push(`-- Remove ${strip.length} demoted industry tags that the career's own text does not support.`);
mig.push("--");
mig.push("-- Batches 1 and 2 moved each corrected row's previous primary_industry into");
mig.push("-- secondary_industries so nothing was silently dropped. Where the previous primary");
mig.push("-- was plausible that was correct and those rows are left alone. Where it was not,");
mig.push("-- the demotion preserved a wrong tag — e.g. Hospital Chaplain kept Gaming & Esports.");
mig.push("--");
mig.push("-- Selection is evidence-based, not a list of bad industry pairs: using the same");
mig.push("-- keyword rules as the Phase 1 audit (scripts/phase1_keyword_rules.cjs), a tag is");
mig.push("-- removed only when NO keyword supporting that industry appears in the career's");
mig.push("-- title or description. Rows where a keyword did appear keep the tag.");
mig.push("--");
mig.push(`-- Industries with no keyword rules cannot be tested and were left untouched (${skipped.length} rows).`);
mig.push("--");
mig.push("-- This migration only ever REMOVES one value from secondary_industries.");
mig.push("-- primary_industry is not touched.");
mig.push("--");
mig.push(`-- Rows: ${strip.length}`);
mig.push(`-- Prior values: reports/phase3_${SLUG}_backup_before.csv`);
mig.push(`-- Revert:       reports/phase3_${SLUG}_revert.sql`);
mig.push("--");
mig.push("-- Each statement is id-scoped and guarded on the exact current secondary_industries");
mig.push("-- string, so re-running is a no-op and any row edited meanwhile is skipped.");
mig.push("");
mig.push("begin;");
mig.push("");
for (const s of strip) {
  mig.push(`--  ${s.a.title}  (${s.cur.primary_industry}) — drop ${s.demoted}`);
  mig.push(`update public.careers set secondary_industries = ${sq(s.newSec)}`);
  mig.push(`where id = ${sq(s.a.id)} and secondary_industries = ${sq(s.oldSec)};`);
  mig.push("");
}
mig.push("commit;");
mig.push("");
fs.writeFileSync(path.join(ROOT, "supabase/migrations", `${STAMP}_${SLUG}.sql`), mig.join("\n"));

const rev = [];
rev.push(`-- Revert ${STAMP}_${SLUG}.sql — restores secondary_industries for ${strip.length} rows.`);
rev.push("");
rev.push("begin;");
rev.push("");
for (const s of strip) rev.push(`update public.careers set secondary_industries = ${sq(s.oldSec)} where id = ${sq(s.a.id)};  -- ${s.a.title}`);
rev.push("");
rev.push("commit;");
rev.push("");
fs.writeFileSync(path.join(REPORTS, `phase3_${SLUG}_revert.sql`), rev.join("\n"));

const removedBy = new Map();
for (const s of strip) removedBy.set(s.demoted, (removedBy.get(s.demoted) || 0) + 1);
console.log("\nTags to be removed, by industry:");
for (const [k, n] of [...removedBy.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${k}`);

console.log("");
console.log(`  supabase/migrations/${STAMP}_${SLUG}.sql`);
console.log(`  reports/phase3_${SLUG}_backup_before.csv`);
console.log(`  reports/phase3_${SLUG}_revert.sql`);
console.log(`  reports/phase3_${SLUG}_manifest.csv`);
console.log("");
console.log("Nothing has been written to the database.");
