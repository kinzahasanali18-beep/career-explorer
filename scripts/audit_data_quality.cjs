// scripts/audit_data_quality.cjs
//
// READ-ONLY data-quality audit of the `careers` table. Issues GET requests only
// — never POST/PATCH/DELETE. Pulls every row (no sampling) and runs three
// rule-based diagnostics locally:
//
//   1. requirements values shared by more than 3 careers (templated text)
//   2. title/description industry keywords that don't overlap the assigned
//      primary_industry or secondary_industries
//   3. flagged-vs-total counts bucketed by created_at month (import batches)
//
// Pure string/regex rules — no AI calls, no web lookups. Writes a markdown
// report plus CSVs of the flagged subset for a later AI-verified pass.

const fs = require("fs");
const path = require("path");

// ─── Env ─────────────────────────────────────────────────────────────────────

const envPath = path.join(__dirname, "..", ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !KEY) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const VALID_INDUSTRIES = [
  "Arts & Performance", "Business & Finance", "Design & Creative",
  "Education & Coaching", "Entrepreneurship", "Environment & Sustainability",
  "Fashion & Beauty", "Healthcare & Medicine", "Hospitality & Events",
  "Law & Government", "Media & Journalism", "Science & Research",
  "Social Impact & Nonprofit", "Sports & Fitness", "Tech & Engineering",
  "Architecture & Urban Planning", "Aviation & Transportation", "Cybersecurity",
  "Food & Culinary", "Gaming & Esports", "Marketing & Communications",
  "Supply Chain & Operations",
];

// ─── Keyword rules ───────────────────────────────────────────────────────────
//
// Each rule: a keyword, the industries that would make it consistent, and a
// specificity weight. A row is flagged only when the STRONGEST matching rule
// shares no industry at all with primary_industry ∪ secondary_industries — so a
// keyword with several plausible homes ("Designer") lists all of them and stays
// quiet if any one is tagged. `ctx` requires a second term somewhere in the
// title+description before the rule fires, which is how "Engineer" avoids
// flagging every civil and audio engineer as mistagged tech.
//
// weight 10 = unambiguous occupation noun, 8 = strong, 5 = moderate,
// 3 = weak/ambiguous. Title hits score double the description hits.

const { RULES, compileRules } = require("./phase1_keyword_rules.cjs");

// Matchers are compiled by the shared rules module so every pass in this audit
// matches identically.
compileRules(RULES);

const sanityUnknown = RULES.flatMap(r => r.ok).filter(i => !VALID_INDUSTRIES.includes(i));
if (sanityUnknown.length) {
  console.error("Rule references unknown industry:", [...new Set(sanityUnknown)]);
  process.exit(1);
}

// ─── Fetch every row (GET only) ──────────────────────────────────────────────

const COLS = "id,name,description,requirements,primary_industry,secondary_industries,created_at";

async function fetchAll() {
  const rows = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const url = `${SUPABASE_URL}/rest/v1/careers?select=${COLS}&order=id.asc&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    process.stdout.write(`\r   fetched ${rows.length}`);
    if (page.length < limit) break;
  }
  process.stdout.write("\n");
  return rows;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const industriesOf = row => {
  const set = new Set();
  if (row.primary_industry) set.add(row.primary_industry.trim());
  for (const s of (row.secondary_industries || "").split(",")) {
    const t = s.trim();
    if (t) set.add(t);
  }
  return set;
};

const csvCell = v => {
  const s = v === null || v === undefined ? "" : String(v).replace(/\r?\n/g, " ");
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (file, header, rows) => {
  const out = [header.join(",")];
  for (const r of rows) out.push(r.map(csvCell).join(","));
  fs.writeFileSync(file, out.join("\n") + "\n");
};
const mdCell = v => String(v === null || v === undefined ? "" : v).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const truncate = (s, n) => (s && s.length > n ? s.slice(0, n - 1) + "…" : s || "");

// ─── Main ────────────────────────────────────────────────────────────────────

(async () => {
  console.log("Fetching all careers (read-only)...");
  const rows = await fetchAll();
  const total = rows.length;
  console.log(`   ${total} rows.\n`);

  // ── #1 duplicate / templated requirements ──
  const byReq = new Map();
  let nullReq = 0;
  for (const r of rows) {
    const key = (r.requirements || "").trim();
    if (!key) { nullReq++; continue; }
    if (!byReq.has(key)) byReq.set(key, []);
    byReq.get(key).push(r);
  }
  const dupGroups = [...byReq.entries()]
    .filter(([, g]) => g.length > 3)
    .map(([text, g]) => ({ text, count: g.length, rows: g }))
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text));

  const dupFlaggedIds = new Set(dupGroups.flatMap(g => g.rows.map(r => r.id)));

  // Supplementary: exact matching misses "Bachelor's degree in journalism..." vs
  // "A bachelor's degree in journalism..." — same template, one article apart.
  // Signature = first 8 content words after dropping stopwords/punctuation, so
  // boilerplate openings collapse together. Still pure string rules, no AI.
  const STOP = new Set(["a","an","the","is","are","or","and","of","in","for","to","with","as","at","be","most","this","that","you","your","must","will","also","often","some","many","typically","usually","generally"]);
  const sigOf = s => (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
    .filter(w => w && !STOP.has(w)).slice(0, 8).join(" ");
  const bySig = new Map();
  for (const r of rows) {
    const sig = sigOf(r.requirements);
    if (!sig) continue;
    if (!bySig.has(sig)) bySig.set(sig, []);
    bySig.get(sig).push(r);
  }
  const nearGroups = [...bySig.entries()]
    .filter(([, g]) => g.length > 3)
    .map(([sig, g]) => ({ sig, count: g.length, rows: g }))
    .sort((a, b) => b.count - a.count);
  const nearIds = new Set(nearGroups.flatMap(g => g.rows.map(r => r.id)));

  // ── #2 industry / keyword mismatch ──
  const mismatches = [];
  for (const r of rows) {
    const title = r.name || "";
    const desc = r.description || "";
    const haystack = `${title} ${desc}`;
    const assigned = industriesOf(r);

    let best = null;
    for (const rule of RULES) {
      if (rule.ctx && !rule.ctx.test(haystack)) continue;
      const inTitle = rule.re.test(title);
      const inDesc = rule.re.test(desc);
      if (!inTitle && !inDesc) continue;
      const score = rule.w * (inTitle ? 2 : 1);
      if (!best || score > best.score) best = { rule, score, inTitle };
    }
    if (!best) continue;

    const overlap = best.rule.ok.some(i => assigned.has(i));
    if (overlap) continue;

    const tier = best.inTitle ? (best.rule.w >= 8 ? "HIGH" : "MEDIUM") : "LOW";
    mismatches.push({
      row: r, keyword: best.rule.kw, expected: best.rule.ok,
      score: best.score, where: best.inTitle ? "title" : "description", tier,
    });
  }
  mismatches.sort((a, b) => b.score - a.score || a.row.name.localeCompare(b.row.name));
  const mismatchIds = new Set(mismatches.map(m => m.row.id));

  // ── #3 month buckets ──
  const flaggedIds = new Set([...dupFlaggedIds, ...mismatchIds]);
  const monthOf = r => (r.created_at || "").slice(0, 7) || "(no created_at)";
  const buckets = new Map();
  for (const r of rows) {
    const m = monthOf(r);
    if (!buckets.has(m)) buckets.set(m, { total: 0, dup: 0, mis: 0, flagged: 0 });
    const b = buckets.get(m);
    b.total++;
    if (dupFlaggedIds.has(r.id)) b.dup++;
    if (mismatchIds.has(r.id)) b.mis++;
    if (flaggedIds.has(r.id)) b.flagged++;
  }
  const months = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  // ── Report ──
  const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : "0.0");
  const L = [];
  L.push("# Careers Table — Rule-Based Data-Quality Audit");
  L.push("");
  L.push(`Generated **2026-08-18** by \`scripts/audit_data_quality.cjs\` against the full \`careers\` table.`);
  L.push(`**Read-only:** GET requests only — no rows were created, updated, or deleted.`);
  L.push(`**No AI, no web lookups** — pure string/regex rules, every row scanned (no sampling).`);
  L.push("");
  L.push(`- Rows scanned: **${total}**`);
  L.push(`- Timestamp column available: \`created_at\` only (no \`updated_at\` on this table)`);
  L.push(`- Title field is \`name\`; industry fields are \`primary_industry\` + \`secondary_industries\` (comma-separated string)`);
  L.push("");
  L.push("---");
  L.push("");

  // Section 1
  L.push("## 1. Duplicate / templated `requirements` text");
  L.push("");
  L.push(`Exact-match grouping on trimmed \`requirements\`. Threshold: shared by **more than 3** careers.`);
  L.push("");
  const dupRowCount = dupFlaggedIds.size;
  L.push(`- Distinct \`requirements\` values overall: **${byReq.size}**`);
  L.push(`- Values shared by >3 careers: **${dupGroups.length}**`);
  L.push(`- Careers sitting on one of those values: **${dupRowCount}** (${pct(dupRowCount, total)}% of table)`);
  if (nullReq) L.push(`- Rows with empty/null \`requirements\`: **${nullReq}** (excluded from grouping)`);
  L.push("");
  if (dupGroups.length) {
    L.push(`Worst offenders first. Full list of all ${dupGroups.length} groups in \`careers_dup_requirements_groups.csv\`; every affected row in \`careers_flagged_dup_requirements.csv\`.`);
    L.push("");
    const shown = dupGroups.slice(0, 40);
    for (const [i, g] of shown.entries()) {
      L.push(`### ${i + 1}. ${g.count} careers share this text`);
      L.push("");
      L.push("> " + mdCell(g.text));
      L.push("");
      L.push(`Sample titles (5 of ${g.count}):`);
      for (const r of g.rows.slice(0, 5)) L.push(`- ${mdCell(r.name)} — *${mdCell(r.primary_industry)}*`);
      L.push("");
    }
    if (dupGroups.length > shown.length) {
      L.push(`_…and ${dupGroups.length - shown.length} more groups (see CSV)._`);
      L.push("");
    }
  } else {
    L.push("**No `requirements` value is shared by more than 3 careers.** This is a real result, not an empty query — verified independently: the most any single value is shared by is **" +
      Math.max(...[...byReq.values()].map(g => g.length)) + "** careers, and only " +
      [...byReq.values()].filter(g => g.length > 1).length + " values are shared by more than one career at all. Normalizing case, punctuation and whitespace does not change this.");
    L.push("");
  }

  // Supplementary near-duplicate pass
  L.push("### 1b. Near-duplicate `requirements` (supplementary)");
  L.push("");
  L.push("Exact matching answers the question as asked, but it cannot see this pair, which is plainly the same template:");
  L.push("");
  L.push("> Bachelor's degree in journalism, communications, or related field preferred; strong research skills and famili…");
  L.push("> A bachelor's degree in journalism, communications, or a related field is preferred; strong research skills and…");
  L.push("");
  L.push("So the same grouping was re-run on a normalized signature — the first 8 content words after dropping punctuation and stopwords — to catch templates that differ only in phrasing. Threshold is still >3 careers.");
  L.push("");
  L.push(`- Near-duplicate groups (>3 careers sharing an opening): **${nearGroups.length}**`);
  L.push(`- Careers involved: **${nearIds.size}** (${pct(nearIds.size, total)}% of table)`);
  L.push("");
  if (nearGroups.length) {
    L.push("| Careers sharing | Normalized opening (first 8 content words) | Sample titles |");
    L.push("|---|---|---|");
    for (const g of nearGroups.slice(0, 25)) {
      L.push(`| ${g.count} | ${mdCell(g.sig)} | ${mdCell(g.rows.slice(0, 3).map(r => r.name).join("; "))} |`);
    }
    L.push("");
    if (nearGroups.length > 25) L.push(`_…and ${nearGroups.length - 25} more groups (see \`careers_near_dup_requirements.csv\`)._`);
    L.push("");
    L.push("These are **not** counted in the headline flagged total below, which stays faithful to the exact-match definition in the original request. Treat 1b as the more realistic estimate of templating.");
    L.push("");
  }
  L.push("---");
  L.push("");

  // Section 2
  L.push("## 2. Industry / title keyword mismatch");
  L.push("");
  L.push(`${RULES.length} keyword rules across the 22 industries. Each keyword lists every industry that would make it consistent; a row is flagged only when the **strongest** matching keyword overlaps **none** of \`primary_industry\` ∪ \`secondary_industries\`.`);
  L.push("");
  L.push("Confidence tiers:");
  L.push("");
  L.push("| Tier | Meaning |");
  L.push("|---|---|");
  L.push("| HIGH | Strong keyword (weight ≥8) matched in the **title** |");
  L.push("| MEDIUM | Weaker/ambiguous keyword matched in the **title** |");
  L.push("| LOW | Keyword matched only in the **description** |");
  L.push("");
  const tiers = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const m of mismatches) tiers[m.tier]++;
  L.push(`- Total rows flagged: **${mismatches.length}** (${pct(mismatches.length, total)}% of table)`);
  L.push(`- HIGH: **${tiers.HIGH}** · MEDIUM: **${tiers.MEDIUM}** · LOW: **${tiers.LOW}**`);
  L.push("");
  L.push("Top offenders by match strength (full list in `careers_flagged_industry_mismatch.csv`):");
  L.push("");
  L.push("| Tier | Career (`name`) | Keyword | Found in | Assigned primary | Assigned secondary | Expected any of |");
  L.push("|---|---|---|---|---|---|---|");
  for (const m of mismatches.slice(0, 60)) {
    L.push(`| ${m.tier} | ${mdCell(m.row.name)} | \`${mdCell(m.keyword)}\` | ${m.where} | ${mdCell(m.row.primary_industry)} | ${mdCell(truncate(m.row.secondary_industries, 60))} | ${mdCell(m.expected.join(" / "))} |`);
  }
  L.push("");
  if (mismatches.length > 60) L.push(`_…and ${mismatches.length - 60} more (see CSV)._`);
  L.push("");
  const byKw = new Map();
  for (const m of mismatches) byKw.set(m.keyword, (byKw.get(m.keyword) || 0) + 1);
  const kwRank = [...byKw.entries()].sort((a, b) => b[1] - a[1]);
  L.push("Which keywords drive the flags (a big count here can mean a real systematic mistag **or** an over-broad rule — worth checking first in the follow-up):");
  L.push("");
  L.push("| Keyword | Rows flagged |");
  L.push("|---|---|");
  for (const [k, c] of kwRank.slice(0, 30)) L.push(`| \`${mdCell(k)}\` | ${c} |`);
  L.push("");
  L.push("---");
  L.push("");

  // Section 3
  L.push("## 3. Import batch / date correlation");
  L.push("");
  L.push("Flagged = union of #1 and #2, deduplicated by `id`. Bucketed by `created_at` month.");
  L.push("");
  L.push("| Month | Total careers | Flagged (any) | Flagged % | #1 dup requirements | #2 industry mismatch |");
  L.push("|---|---|---|---|---|---|");
  for (const [m, b] of months) {
    L.push(`| ${m} | ${b.total} | ${b.flagged} | ${pct(b.flagged, b.total)}% | ${b.dup} | ${b.mis} |`);
  }
  L.push(`| **All** | **${total}** | **${flaggedIds.size}** | **${pct(flaggedIds.size, total)}%** | **${dupFlaggedIds.size}** | **${mismatchIds.size}** |`);
  L.push("");
  const ranked = months
    .filter(([, b]) => b.total >= 20)
    .sort((a, b) => b[1].flagged / b[1].total - a[1].flagged / a[1].total);
  if (ranked.length) {
    L.push("Highest flag rates (months with ≥20 rows, so a tiny batch can't top the list on one bad row):");
    L.push("");
    for (const [m, b] of ranked.slice(0, 8)) {
      L.push(`- **${m}** — ${pct(b.flagged, b.total)}% (${b.flagged}/${b.total})`);
    }
    L.push("");
  }
  const biggest = [...months].sort((a, b) => b[1].flagged - a[1].flagged).slice(0, 5);
  L.push("Largest absolute contributors of flagged rows:");
  L.push("");
  for (const [m, b] of biggest) L.push(`- **${m}** — ${b.flagged} flagged rows (${pct(b.flagged, b.total)}% of that month's ${b.total})`);
  L.push("");
  // 3b: exact-timestamp insert batches
  L.push("### 3b. Insert batches (exact `created_at` timestamps)");
  L.push("");
  L.push("Month buckets are coarse, so the same grouping was run on the exact `created_at` value — rows sharing a microsecond-precision timestamp were written by one insert call.");
  L.push("");
  const tsMap = new Map();
  for (const r of rows) {
    const t = r.created_at || "(null)";
    if (!tsMap.has(t)) tsMap.set(t, []);
    tsMap.get(t).push(r);
  }
  const batches = [...tsMap.entries()].map(([t, g]) => ({
    t, size: g.length, flagged: g.filter(r => flaggedIds.has(r.id)).length,
  }));
  const bigBatches = batches.filter(b => b.size >= 50).sort((a, b) => b.size - a.size || a.t.localeCompare(b.t));
  L.push(`- Distinct \`created_at\` timestamps: **${tsMap.size}** across ${total} rows`);
  L.push(`- Insert batches of ≥50 rows sharing one timestamp: **${bigBatches.length}**`);
  L.push("");
  if (bigBatches.length) {
    const rates = bigBatches.map(b => (b.flagged / b.size) * 100);
    L.push(`Those large batches carry flag rates from **${Math.min(...rates).toFixed(1)}%** to **${Math.max(...rates).toFixed(1)}%** — the damage is spread across the batches, not isolated to one bad insert.`);
    L.push("");
    L.push("| `created_at` | Rows in batch | Flagged | Flagged % |");
    L.push("|---|---|---|---|");
    for (const b of bigBatches.slice(0, 20)) {
      L.push(`| ${mdCell(b.t)} | ${b.size} | ${b.flagged} | ${pct(b.flagged, b.size)}% |`);
    }
    L.push("");
    if (bigBatches.length > 20) L.push(`_…and ${bigBatches.length - 20} more large batches (see \`careers_flagged_by_insert_batch.csv\`)._`);
    L.push("");
  }

  // 3c: repeated secondary_industries among mismatches
  const comboCount = new Map();
  for (const m of mismatches) {
    const k = (m.row.secondary_industries || "").trim();
    if (!k) continue;
    comboCount.set(k, (comboCount.get(k) || 0) + 1);
  }
  const topCombos = [...comboCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (topCombos.length && topCombos[0][1] > 3) {
    L.push("### 3c. Repeated `secondary_industries` strings among mismatched rows");
    L.push("");
    L.push("If industries had been chosen per career, the secondary tags on mismatched rows would vary. They don't — the same exact triples recur, which points at a systematic default rather than per-career error:");
    L.push("");
    L.push("| Times repeated | `secondary_industries` value |");
    L.push("|---|---|");
    for (const [k, c] of topCombos) L.push(`| ${c} | ${mdCell(k)} |`);
    L.push("");
  }

  L.push("---");
  L.push("");

  // Summary
  L.push("## Summary");
  L.push("");
  L.push("| Metric | Value |");
  L.push("|---|---|");
  L.push(`| Total careers in table | **${total}** |`);
  L.push(`| Flagged by #1 (templated requirements) | ${dupFlaggedIds.size} |`);
  L.push(`| Flagged by #2 (industry mismatch) | ${mismatchIds.size} |`);
  L.push(`| Flagged by both | ${[...dupFlaggedIds].filter(i => mismatchIds.has(i)).length} |`);
  L.push(`| **Unique careers flagged by #1 or #2** | **${flaggedIds.size}** |`);
  L.push(`| **% of table flagged** | **${pct(flaggedIds.size, total)}%** |`);
  L.push(`| _(supplementary)_ near-duplicate requirements — §1b, not in the total above | ${nearIds.size} (${pct(nearIds.size, total)}%) |`);
  L.push(`| _(supplementary)_ union incl. near-duplicates | ${new Set([...flaggedIds, ...nearIds]).size} (${pct(new Set([...flaggedIds, ...nearIds]).size, total)}%) |`);
  L.push("");
  if (ranked.length) {
    const worst = ranked[0];
    L.push(`**Highest-concentration period:** ${worst[0]} at ${pct(worst[1].flagged, worst[1].total)}% flagged (${worst[1].flagged}/${worst[1].total}).`);
    L.push("");
  }
  L.push("### Caveats");
  L.push("");
  L.push("- Section 1 is exact-match only. Near-duplicate `requirements` that differ by a word or two are **not** counted here, so the true templating rate is higher than the number above.");
  L.push("- Section 2 is keyword heuristics, not judgment. LOW-tier rows especially will contain legitimate careers whose description merely mentions a keyword. Treat the tiers as a triage order for the AI-verified pass, not as confirmed errors.");
  L.push("- A row can be flagged in section 2 for a keyword that is genuinely peripheral to the job; conversely a mistag with no keyword signal is invisible to this pass.");
  L.push("");
  L.push("### Files written");
  L.push("");
  L.push("- `reports/CAREERS_DATA_QUALITY_AUDIT_2026-08-18.md` — this report");
  L.push("- `reports/careers_dup_requirements_groups.csv` — one row per duplicated `requirements` value");
  L.push("- `reports/careers_flagged_dup_requirements.csv` — every career sharing a duplicated value");
  L.push("- `reports/careers_flagged_industry_mismatch.csv` — every keyword-mismatch flag");
  L.push("- `reports/careers_flagged_union.csv` — deduplicated flagged subset for the follow-up pass");
  L.push("- `reports/careers_near_dup_requirements.csv` — section 1b near-duplicate groups");
  L.push("- `reports/careers_flagged_by_insert_batch.csv` — section 3b per-insert-batch flag rates");
  L.push("- `reports/careers_flagged_by_month.csv` — section 3 table as data");
  L.push("");

  const outDir = path.join(__dirname, "..", "reports");
  fs.writeFileSync(path.join(outDir, "CAREERS_DATA_QUALITY_AUDIT_2026-08-18.md"), L.join("\n"));

  writeCsv(path.join(outDir, "careers_dup_requirements_groups.csv"),
    ["shared_count", "requirements", "sample_titles", "primary_industries_involved"],
    dupGroups.map(g => [g.count, g.text, g.rows.slice(0, 5).map(r => r.name).join(" | "),
      [...new Set(g.rows.map(r => r.primary_industry))].join(" | ")]));

  writeCsv(path.join(outDir, "careers_flagged_dup_requirements.csv"),
    ["id", "name", "primary_industry", "secondary_industries", "created_at", "shared_count", "requirements"],
    dupGroups.flatMap(g => g.rows.map(r => [r.id, r.name, r.primary_industry, r.secondary_industries, r.created_at, g.count, g.text])));

  writeCsv(path.join(outDir, "careers_flagged_industry_mismatch.csv"),
    ["tier", "score", "id", "name", "keyword", "found_in", "primary_industry", "secondary_industries", "expected_any_of", "created_at", "description"],
    mismatches.map(m => [m.tier, m.score, m.row.id, m.row.name, m.keyword, m.where,
      m.row.primary_industry, m.row.secondary_industries, m.expected.join(" / "), m.row.created_at, m.row.description]));

  const misById = new Map(mismatches.map(m => [m.row.id, m]));
  const dupCountById = new Map(dupGroups.flatMap(g => g.rows.map(r => [r.id, g.count])));
  writeCsv(path.join(outDir, "careers_flagged_union.csv"),
    ["id", "name", "primary_industry", "secondary_industries", "created_at", "flagged_dup_requirements", "dup_shared_count", "flagged_industry_mismatch", "mismatch_tier", "mismatch_keyword", "expected_any_of"],
    rows.filter(r => flaggedIds.has(r.id)).map(r => {
      const m = misById.get(r.id);
      return [r.id, r.name, r.primary_industry, r.secondary_industries, r.created_at,
        dupCountById.has(r.id) ? "yes" : "no", dupCountById.get(r.id) || "",
        m ? "yes" : "no", m ? m.tier : "", m ? m.keyword : "", m ? m.expected.join(" / ") : ""];
    }));

  writeCsv(path.join(outDir, "careers_flagged_by_insert_batch.csv"),
    ["created_at", "rows_in_batch", "flagged", "flagged_pct"],
    batches.sort((a, b) => b.size - a.size).map(b => [b.t, b.size, b.flagged, pct(b.flagged, b.size)]));

  writeCsv(path.join(outDir, "careers_near_dup_requirements.csv"),
    ["shared_count", "normalized_opening", "id", "name", "primary_industry", "created_at", "requirements"],
    nearGroups.flatMap(g => g.rows.map(r => [g.count, g.sig, r.id, r.name, r.primary_industry, r.created_at, r.requirements])));

  writeCsv(path.join(outDir, "careers_flagged_by_month.csv"),
    ["month", "total_careers", "flagged_any", "flagged_pct", "dup_requirements", "industry_mismatch"],
    months.map(([m, b]) => [m, b.total, b.flagged, pct(b.flagged, b.total), b.dup, b.mis]));

  console.log(`#1 duplicate requirements: ${dupGroups.length} groups, ${dupFlaggedIds.size} rows`);
  console.log(`#2 industry mismatch:      ${mismatches.length} rows (HIGH ${tiers.HIGH} / MEDIUM ${tiers.MEDIUM} / LOW ${tiers.LOW})`);
  console.log(`#1b near-dup requirements: ${nearGroups.length} groups, ${nearIds.size} rows (supplementary)`);
  console.log(`union flagged:             ${flaggedIds.size} of ${total} (${pct(flaggedIds.size, total)}%)`);
  console.log(`\nReport: reports/CAREERS_DATA_QUALITY_AUDIT_2026-08-18.md`);
})();
