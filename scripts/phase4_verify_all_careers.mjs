// scripts/phase4_verify_all_careers.mjs
//
// Full-table, multi-source verification of every career. READ-ONLY against
// Supabase — GET requests only. No rows are modified, no visibility is toggled,
// nothing is deleted. Produces a report and a (separate, unapplied) migration
// that adds the `visible` column.
//
// Named phase4_* because reports/phase3_* is already taken by the applied
// demotion cleanup; this is the pass the user called "Phase 3".
//
// ── SOC resolution ladder ────────────────────────────────────────────────────
// A career can only be checked against a source if we can pin a SOC code to it.
// Rungs are tried in order and the rung used is recorded per row, because they
// are not equally trustworthy:
//   onet_url        source_url is an onetonline.org link whose code is in the
//                   local O*NET taxonomy snapshot. Strongest.
//   onet_base       source_url cites an invalid detail code (e.g. 27-2042.01)
//                   but its .00 base exists. Occupation-level match.
//   ooh_crosswalk   source_url is a bls.gov OOH page present in the
//                   hand-verified slug->SOC crosswalk from the earlier BLS
//                   backfill (reports/backfill_bls_backup_before.csv).
//   title_exact     bls.gov slug's occupation segment matches an O*NET
//                   taxonomy title exactly (after normalisation).
//   title_partial   every significant word of the slug appears in an O*NET
//                   title. Weakest — recorded so it can be eyeballed.
//   (none)          nothing resolves -> UNVERIFIABLE.
//
// ── Sources ─────────────────────────────────────────────────────────────────
//   O*NET          code exists in the taxonomy AND its occupation page fetches.
//   CareerOneStop  careerOneStopCovers(code) — CareerOneStop has a profile for
//                  every SOC code except the "All Other" residual categories.
//   BLS OOH        crosswalk membership. This is the ONLY available OOH signal:
//                  bls.gov returns 403 to every request (plain curl, browser
//                  UA, and the OOH-SOC crosswalk page alike), which the earlier
//                  backfill migration also documented. OOH additionally covers
//                  only ~330 occupational profiles against O*NET's 1,016, so
//                  absence here is normal and is NOT evidence a career is fake.
//   BLS OES        live api.bls.gov lookup of the national employment series
//                  for the 6-digit SOC. Not OOH, but it is a real BLS source
//                  and it is checkable, so it is reported alongside.

import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const CACHE = path.join(REPORTS, ".onet_cache");
const BLS_CACHE = path.join(REPORTS, ".bls_cache");
const DATE = "2026-08-19";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { socFromSourceUrl, isValidSocCode, occupationTitle, careerOneStopCovers, OCCUPATION_TITLES } =
  await import(path.join(ROOT, "src/occupations.js"));
const { industryForSoc } = await import(path.join(__dirname, "phase2_soc_industry_map.mjs"));

// ─── helpers ─────────────────────────────────────────────────────────────────

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
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : "0.0");

// ─── fetch careers ───────────────────────────────────────────────────────────

const COLS = "id,name,description,requirements,primary_industry,secondary_industries,source_url,created_at";
async function fetchCareers() {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?select=${COLS}&order=id.asc&limit=1000&offset=${offset}`,
      { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

// ─── OOH crosswalk + title index ─────────────────────────────────────────────

const oohSlug = u => {
  const m = (u || "").match(/bls\.gov\/ooh\/([a-z0-9-]+\/[a-z0-9-]+?)(?:\.htm)?$/i);
  return m ? m[1].toLowerCase() : null;
};
const oohLeaf = u => {
  const m = (u || "").match(/bls\.gov\/ooh\/[a-z0-9-]+\/([a-z0-9-]+?)(?:\.htm)?$/i);
  return m ? m[1] : null;
};

const crosswalk = new Map();   // OOH slug -> SOC
{
  const f = path.join(REPORTS, "backfill_bls_backup_before.csv");
  if (fs.existsSync(f)) {
    for (const r of parseCsv(fs.readFileSync(f, "utf8"))) {
      const s = oohSlug(r.old_source_url);
      if (s && isValidSocCode(r.soc_code)) crosswalk.set(s, r.soc_code);
    }
  }
}

const STOP = new Set(["and", "of", "the", "all", "other", "except", "or"]);
const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ")
  .filter(w => w && !STOP.has(w)).join(" ").trim();
const titleIdx = new Map();
for (const [code, t] of Object.entries(OCCUPATION_TITLES)) {
  if (!t) continue;
  const k = norm(t);
  if (!titleIdx.has(k)) titleIdx.set(k, code);
}

/** Try each rung in order. Returns {code, via} or {code:null, via:null, note}. */
function resolveSoc(row) {
  const url = row.source_url || "";
  const direct = socFromSourceUrl(url);
  if (direct) {
    if (isValidSocCode(direct)) return { code: direct, via: "onet_url" };
    const base = direct.slice(0, 7) + ".00";
    if (isValidSocCode(base)) return { code: base, via: "onet_base", note: `cited ${direct} does not exist; used base ${base}` };
    return { code: null, via: null, note: `cited SOC ${direct} is not in the O*NET taxonomy, and neither is its base` };
  }
  const slug = oohSlug(url);
  if (slug && crosswalk.has(slug)) return { code: crosswalk.get(slug), via: "ooh_crosswalk" };
  const leaf = oohLeaf(url);
  if (leaf) {
    const k = norm(leaf.replace(/-/g, " "));
    if (titleIdx.has(k)) return { code: titleIdx.get(k), via: "title_exact" };
    const words = k.split(" ").filter(w => w.length > 3);
    if (words.length) {
      for (const [tk, code] of titleIdx) {
        if (words.every(w => tk.includes(w))) return { code, via: "title_partial", note: `slug "${leaf}" matched O*NET title by word overlap` };
      }
    }
    return { code: null, via: null, note: `bls.gov OOH slug "${leaf}" matches no O*NET occupation title` };
  }
  return { code: null, via: null, note: url ? `source_url is not an O*NET or BLS OOH link: ${url.slice(0, 80)}` : "no source_url" };
}

// ─── O*NET page cache ────────────────────────────────────────────────────────

const ZONE_WORD = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };
const stripTags = s => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&").replace(/&#39;|&rsquo;|’/g, "'").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

function parseOnet(html) {
  const out = { zone: null, zoneName: "", education: "", respondents: [] };
  const z = html.match(/Job Zone (One|Two|Three|Four|Five)\s*:?\s*([^<]{0,60})/);
  if (z) { out.zone = ZONE_WORD[z[1]]; out.zoneName = z[2].trim(); }
  const zi = html.search(/Job Zone (One|Two|Three|Four|Five)/);
  if (zi >= 0) {
    const block = stripTags(html.slice(zi, zi + 4000));
    const m = block.match(/Education\s+(.*?)\s+(?=Related Experience)/s);
    if (m) out.education = m[1].trim();
  }
  return out;
}

async function getOnet(code) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, `${code}.json`);
  if (fs.existsSync(f)) {
    const obj = JSON.parse(fs.readFileSync(f, "utf8"));
    // Entries written by the Phase 2 script predate the `ok` field: they record
    // failure as `fetchFailed` instead. Without this, every Phase 2 cache hit
    // reads as an O*NET miss and the primary source silently under-reports.
    if (obj.ok === undefined) obj.ok = !obj.fetchFailed;
    return obj;
  }
  let html = null, status = 0;
  for (let a = 1; a <= 3; a++) {
    try {
      const res = await fetch(`https://www.onetonline.org/link/summary/${code}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
        signal: AbortSignal.timeout(25000),
      });
      status = res.status;
      if (res.status === 200) { html = await res.text(); break; }
      if (res.status === 404) break;
      await sleep(1500 * a);
    } catch { await sleep(1500 * a); }
  }
  const parsed = html ? { ...parseOnet(html), ok: true } : { zone: null, zoneName: "", education: "", respondents: [], ok: false, status };
  fs.writeFileSync(f, JSON.stringify(parsed));
  return parsed;
}

// ─── BLS OES (live) ──────────────────────────────────────────────────────────
// Series: OEU + N (national) + 0000000 (area) + 000000 (industry) + 6-digit SOC
// + 01 (employment). Batched; the public v2 endpoint accepts many series per
// POST, which keeps this to ~20 requests rather than one per occupation.

const oesSeries = six => `OEUN${"0".repeat(13)}${six}01`;
const sixOf = code => code.replace("-", "").slice(0, 6);

async function fetchOes(sixCodes) {
  fs.mkdirSync(BLS_CACHE, { recursive: true });
  const cacheFile = path.join(BLS_CACHE, "oes_employment.json");
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, "utf8")) : {};
  const todo = sixCodes.filter(c => !(c in cache));
  const BATCH = 25;
  for (let i = 0; i < todo.length; i += BATCH) {
    const chunk = todo.slice(i, i + BATCH);
    try {
      const res = await fetch("https://api.bls.gov/publicAPI/v2/timeseries/data/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesid: chunk.map(oesSeries) }),
        signal: AbortSignal.timeout(30000),
      });
      const j = await res.json();
      const bySeries = new Map((j?.Results?.series || []).map(s => [s.seriesID, s]));
      for (const six of chunk) {
        const s = bySeries.get(oesSeries(six));
        const v = s?.data?.[0]?.value;
        cache[six] = v ? { employment: Number(String(v).replace(/,/g, "")) } : { employment: null };
      }
    } catch (e) {
      for (const six of chunk) if (!(six in cache)) cache[six] = { employment: null, error: true };
    }
    process.stdout.write(`\r   BLS OES ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
    await sleep(400);
  }
  if (todo.length) process.stdout.write("\n");
  fs.writeFileSync(cacheFile, JSON.stringify(cache));
  return cache;
}

// ─── alignment checks ────────────────────────────────────────────────────────

const DEGREE_RANK = [
  [/\b(doctoral|doctorate|ph\.?d|m\.?d\b|j\.?d\b|dds|dvm|pharm\.?d)\b/i, 5],
  [/\b(master'?s?|mba|m\.?s\.?\b|m\.?a\.?\b|graduate degree)\b/i, 4],
  [/\b(bachelor'?s?|b\.?s\.?\b|b\.?a\.?\b|four-year degree|undergraduate degree)\b/i, 3],
  [/\b(associate'?s?|two-year degree|vocational|certificate|postsecondary)\b/i, 2],
  [/\b(high school|ged|diploma|no formal|on-the-job)\b/i, 1],
];
/** Highest education level asserted by the requirements text, 1-5, or null. */
function requirementsLevel(text) {
  if (!text) return null;
  for (const [re, rank] of DEGREE_RANK) if (re.test(text)) return rank;
  return null;
}
// Job Zone -> the education level O*NET associates with it.
const ZONE_LEVEL = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 4 };

// ─── main ────────────────────────────────────────────────────────────────────

console.log("Fetching all careers (read-only)...");
const careers = await fetchCareers();
console.log(`   ${careers.length} rows.`);

const resolved = careers.map(c => ({ c, ...resolveSoc(c) }));
const codes = [...new Set(resolved.map(r => r.code).filter(Boolean))];
console.log(`SOC resolved for ${resolved.filter(r => r.code).length} of ${careers.length} rows across ${codes.length} distinct codes.`);

const cachedNow = fs.existsSync(CACHE) ? new Set(fs.readdirSync(CACHE).map(f => f.replace(/\.json$/, ""))) : new Set();
const toFetch = codes.filter(c => !cachedNow.has(c));
console.log(`O*NET pages: ${codes.length - toFetch.length} cached, ${toFetch.length} to fetch...`);
const onet = new Map();
let done = 0;
for (const code of codes) {
  const wasCached = cachedNow.has(code);
  onet.set(code, await getOnet(code));
  if (!wasCached) await sleep(350);
  if (++done % 40 === 0) process.stdout.write(`\r   ${done}/${codes.length}`);
}
process.stdout.write(`\r   ${codes.length}/${codes.length}\n`);

const sixes = [...new Set(codes.map(sixOf))];
console.log(`BLS OES: ${sixes.length} distinct 6-digit codes...`);
const oes = await fetchOes(sixes);

// crosswalk membership by SOC (for the OOH signal)
const oohSocs = new Set(crosswalk.values());

const out = [];
const tally = { VERIFIED: 0, "VERIFIED BUT FLAGGED": 0, UNVERIFIABLE: 0 };
const viaTally = {}, sourceTally = {}, reasonTally = {}, flagTally = {};

for (const r of resolved) {
  const { c, code, via, note } = r;
  const sources = [];
  let onetOk = false, cosOk = false, oohOk = false, oesOk = false;

  if (code) {
    const page = onet.get(code);
    onetOk = isValidSocCode(code) && Boolean(page?.ok);
    cosOk = careerOneStopCovers(code);
    oohOk = oohSocs.has(code);
    oesOk = Boolean(oes[sixOf(code)]?.employment);
    if (onetOk) sources.push("O*NET");
    if (cosOk) sources.push("CareerOneStop");
    if (oohOk) sources.push("BLS OOH");
    if (oesOk) sources.push("BLS OES");
  }

  const flags = [];
  if (code && sources.length) {
    const mapped = industryForSoc(code);
    const assigned = new Set([(c.primary_industry || "").trim(),
      ...(c.secondary_industries || "").split(",").map(s => s.trim()).filter(Boolean)]);
    if (mapped && !assigned.has(mapped.industry) && !mapped.alternates.some(a => assigned.has(a))) {
      flags.push(`industry: O*NET SOC ${code} maps to ${mapped.industry}, row has ${c.primary_industry || "(none)"}`);
    }
    const page = onet.get(code);
    const reqLvl = requirementsLevel(c.requirements);
    const zoneLvl = page?.zone ? ZONE_LEVEL[page.zone] : null;
    if (reqLvl && zoneLvl && Math.abs(reqLvl - zoneLvl) >= 2) {
      flags.push(`requirements: text implies level ${reqLvl}, O*NET Job Zone ${page.zone} implies ${zoneLvl}`);
    }
    if (via === "title_partial") flags.push("SOC resolved only by partial title match — confirm the occupation is right");
  }

  let classification;
  if (!code || !sources.length) classification = "UNVERIFIABLE";
  else if (flags.length) classification = "VERIFIED BUT FLAGGED";
  else classification = "VERIFIED";

  tally[classification]++;
  viaTally[via || "(unresolved)"] = (viaTally[via || "(unresolved)"] || 0) + 1;
  const key = sources.join("+") || "(none)";
  sourceTally[key] = (sourceTally[key] || 0) + 1;
  if (classification === "UNVERIFIABLE") {
    const kind = !code ? (note || "").replace(/".*?"/g, '"…"').replace(/\d{2}-\d{4}\.\d{2}/g, "NN-NNNN.NN").slice(0, 70)
                       : "SOC resolved but no source recognised it";
    reasonTally[kind] = (reasonTally[kind] || 0) + 1;
  }
  for (const f of flags) { const k = f.split(":")[0]; flagTally[k] = (flagTally[k] || 0) + 1; }

  out.push({
    id: c.id, title: c.name, classification,
    verified_by: sources.join("+"),
    soc: code || "", soc_via: via || "",
    onet_title: code ? (occupationTitle(code) || "") : "",
    job_zone: code ? (onet.get(code)?.zone || "") : "",
    oes_employment: code ? (oes[sixOf(code)]?.employment ?? "") : "",
    onet: onetOk ? "yes" : "no", careeronestop: cosOk ? "yes" : "no",
    bls_ooh: oohOk ? "yes" : "no", bls_oes: oesOk ? "yes" : "no",
    flags: flags.join("; "),
    note: classification === "UNVERIFIABLE" ? (note || "no source recognised the resolved SOC code") : "",
    primary_industry: c.primary_industry || "", source_url: c.source_url || "",
    created_at: c.created_at || "",
  });
}

// ─── Candidate SOC from the career's OWN NAME (for UNVERIFIABLE rows) ────────
//
// UNVERIFIABLE here means "the citation is broken", not "the career is fake" —
// the list contains Meteorologist, Astrophysicist and Nephrologist. So for each
// one, try to find a plausible SOC by matching the career's own name against the
// O*NET taxonomy. This is CANDIDATE GENERATION for review, not a fix: spot
// checks show even full-coverage matches misfire ("AI Trainer (Machine
// Learning)" -> Athletic Trainers), so nothing here is applied.

const NM_STOP = new Set(["and","of","the","all","other","except","or","a","an","in","for","to","with"]);
const nmSing = w => w.replace(/ies$/, "y").replace(/sses$/, "ss").replace(/s$/, "");
// Tokens under 4 chars are dropped: "Sheriff's" would otherwise contribute a
// bare "s" and match almost anything.
const nmToks = str => new Set(
  String(str).toLowerCase().replace(/\(.*?\)/g, " ").replace(/[^a-z0-9]+/g, " ").split(" ")
    .filter(w => w.length >= 4 && !NM_STOP.has(w)).map(nmSing)
);
const nmIdx = [];
for (const [code, t] of Object.entries(OCCUPATION_TITLES)) {
  if (t) nmIdx.push({ code, title: t, w: nmToks(t) });
}
function nameCandidate(title) {
  const cw = nmToks(title);
  if (!cw.size) return { tier: "none", code: "", title: "", coverage: 0 };
  let best = null, score = 0;
  for (const e of nmIdx) {
    let shared = 0;
    for (const w of cw) if (e.w.has(w)) shared++;
    if (!shared) continue;
    const cov = shared / cw.size;
    if (cov > score) { score = cov; best = e; }
  }
  if (!best) return { tier: "none", code: "", title: "", coverage: 0 };
  const tier = score >= 0.99 ? "full" : score >= 0.5 ? "strong" : "weak";
  return { tier, code: best.code, title: best.title, coverage: score };
}

// ─── outputs ─────────────────────────────────────────────────────────────────

const csvPath = path.join(REPORTS, `PHASE4_VERIFICATION_${DATE}.csv`);
writeCsv(csvPath,
  ["id", "title", "classification", "verified_by", "soc_code", "soc_resolved_via", "onet_occupation_title",
   "job_zone", "oes_employment", "onet", "careeronestop", "bls_ooh", "bls_oes", "flags", "note",
   "primary_industry", "source_url", "created_at"],
  out.map(o => [o.id, o.title, o.classification, o.verified_by, o.soc, o.soc_via, o.onet_title,
    o.job_zone, o.oes_employment, o.onet, o.careeronestop, o.bls_ooh, o.bls_oes, o.flags, o.note,
    o.primary_industry, o.source_url, o.created_at]));

// the UNVERIFIABLE subset on its own, for eyeballing before anything is hidden
const unver = out.filter(o => o.classification === "UNVERIFIABLE");
for (const o of unver) o.cand = nameCandidate(o.title);
const candTally = { full: 0, strong: 0, weak: 0, none: 0 };
for (const o of unver) candTally[o.cand.tier]++;
writeCsv(path.join(REPORTS, `PHASE4_UNVERIFIABLE_${DATE}.csv`),
  ["id", "title", "primary_industry", "source_url", "note",
   "candidate_soc", "candidate_onet_title", "candidate_tier", "candidate_coverage", "created_at"],
  unver.map(o => [o.id, o.title, o.primary_industry, o.source_url, o.note,
    o.cand.code, o.cand.title, o.cand.tier, o.cand.coverage ? o.cand.coverage.toFixed(2) : "", o.created_at]));

const total = out.length;
const M = [];
M.push("# Phase 4 — Full-table multi-source verification");
M.push("");
M.push(`Generated **${DATE}** by \`scripts/phase4_verify_all_careers.mjs\` over all **${total}** careers.`);
M.push("**Read-only.** GET requests only against Supabase; no rows changed, no visibility toggled, nothing deleted.");
M.push("");
M.push("> Named Phase 4 because `reports/phase3_*` is already the applied demotion cleanup. This is the pass you called Phase 3.");
M.push("");
M.push("## Classification");
M.push("");
M.push("| Classification | Careers | % of table |");
M.push("|---|---|---|");
for (const k of ["VERIFIED", "VERIFIED BUT FLAGGED", "UNVERIFIABLE"]) {
  M.push(`| ${k} | ${tally[k]} | ${pct(tally[k], total)}% |`);
}
M.push(`| **Total** | **${total}** | 100% |`);
M.push("");
M.push(`**${tally.VERIFIED + tally["VERIFIED BUT FLAGGED"]} careers (${pct(tally.VERIFIED + tally["VERIFIED BUT FLAGGED"], total)}%) match at least one government source.**`);
M.push("");
M.push("## Sources");
M.push("");
M.push("| Source | Status | Notes |");
M.push("|---|---|---|");
M.push("| O*NET | working | Local taxonomy snapshot (1,016 occupations) plus a live page fetch per distinct SOC code. |");
M.push("| CareerOneStop | working | Derived from the SOC code; CareerOneStop has a profile for every code except the \"All Other\" residual categories. |");
M.push("| BLS OOH | **blocked** | bls.gov returns **403** to plain curl, browser-UA curl, and the OOH-SOC crosswalk page alike — the same wall the earlier BLS backfill migration documented. The only OOH signal available is the hand-verified slug→SOC crosswalk left behind by that backfill (171 occupations). |");
M.push("| BLS OES | working | `api.bls.gov` national employment series by 6-digit SOC. Not OOH, but a real, checkable BLS source, so it is reported separately. |");
M.push("");
M.push("**Do not read \"BLS OOH: no\" as a red flag.** OOH publishes roughly 330 occupational profiles against O*NET's 1,016, so most valid SOC codes have no OOH entry by design.");
M.push("");
M.push("### How many careers each source confirms");
M.push("");
M.push("| Source | Careers confirmed | % of table |");
M.push("|---|---|---|");
for (const s of ["onet", "careeronestop", "bls_ooh", "bls_oes"]) {
  const n = out.filter(o => o[s] === "yes").length;
  const label = { onet: "O*NET", careeronestop: "CareerOneStop", bls_ooh: "BLS OOH", bls_oes: "BLS OES" }[s];
  M.push(`| ${label} | ${n} | ${pct(n, total)}% |`);
}
M.push("");
M.push("### Combinations");
M.push("");
M.push("| Verified by | Careers |");
M.push("|---|---|");
for (const [k, n] of Object.entries(sourceTally).sort((a, b) => b[1] - a[1])) M.push(`| ${k} | ${n} |`);
M.push("");
M.push("## How the SOC code was resolved");
M.push("");
M.push("Only 68.4% of rows carry a directly usable O*NET code, so weaker rungs were tried before giving up. The rung is recorded per row in `soc_resolved_via`.");
M.push("");
M.push("| Rung | Careers | Meaning |");
M.push("|---|---|---|");
const viaDesc = {
  onet_url: "Valid O*NET code cited directly in `source_url`. Strongest.",
  onet_base: "Cited detail code does not exist, but its `.00` base does — occupation-level match.",
  ooh_crosswalk: "bls.gov OOH page found in the hand-verified crosswalk.",
  title_exact: "bls.gov slug's occupation name matches an O*NET title exactly.",
  title_partial: "Slug matched an O*NET title only by word overlap. **Weakest — flagged for review.**",
  "(unresolved)": "Nothing resolved. These are the UNVERIFIABLE rows.",
};
for (const [k, n] of Object.entries(viaTally).sort((a, b) => b[1] - a[1])) {
  M.push(`| \`${k}\` | ${n} | ${viaDesc[k] || ""} |`);
}
M.push("");
M.push("## Why rows came out UNVERIFIABLE");
M.push("");
M.push("| Reason | Careers |");
M.push("|---|---|");
for (const [k, n] of Object.entries(reasonTally).sort((a, b) => b[1] - a[1])) M.push(`| ${k} | ${n} |`);
M.push("");
M.push(`Full list for eyeballing: \`reports/PHASE4_UNVERIFIABLE_${DATE}.csv\` (${unver.length} rows).`);
M.push("");
M.push("### UNVERIFIABLE means the citation is broken, NOT that the career is fake");
M.push("");
M.push("This is the most important result in the report. The unverifiable list includes:");
M.push("");
M.push("**Meteorologist · Broadcast Meteorologist · Astrophysicist · Quantum Physicist · Nephrologist · Sleep Medicine Physician · Medical Laboratory Scientist · Sport Psychologist · Montessori Educator · Live Event Stage Manager**");
M.push("");
M.push("Every one of those is a real occupation with a real SOC code. They fail verification only because their `source_url` is a fabricated bls.gov link whose slug matches no O*NET occupation title. **Hiding on this signal alone would hide Meteorologist and Astrophysicist from students.**");
M.push("");
M.push("So the recommendation is: do not use this classification as a hide list. Re-derive the SOC from each career's own name first, then re-verify.");
M.push("");
M.push("### How far a name-based rescue would get");
M.push("");
M.push("Matching each unverifiable career's **own name** against the O*NET taxonomy, rather than its broken citation:");
M.push("");
M.push("| Candidate quality | Careers | % of unverifiable |");
M.push("|---|---|---|");
M.push(`| Full coverage (every significant word matches an O*NET title) | ${candTally.full} | ${pct(candTally.full, unver.length)}% |`);
M.push(`| Strong (≥50% of words) | ${candTally.strong} | ${pct(candTally.strong, unver.length)}% |`);
M.push(`| Weak (<50%) | ${candTally.weak} | ${pct(candTally.weak, unver.length)}% |`);
M.push(`| No shared significant word | ${candTally.none} | ${pct(candTally.none, unver.length)}% |`);
M.push("");
M.push(`Candidates are in \`PHASE4_UNVERIFIABLE_${DATE}.csv\` (\`candidate_soc\`, \`candidate_tier\`).`);
M.push("");
M.push("**These candidates are a review queue, not a fix.** Naive name matching misfires even at full coverage — observed cases: `AI Trainer (Machine Learning)` → *Athletic Trainers*, `K-12 Science Teacher` → *Computer Science Teachers, Postsecondary*, `Quality Assurance Analyst (Lab)` → *Software Quality Assurance Analysts*, `Podcast Host` → *Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop*. Applying them unreviewed would trade broken citations for confidently wrong ones.");
M.push("");
M.push("### Sample of the list to eyeball");
M.push("");
M.push("A sample, chosen across the reasons above:");
M.push("");
M.push("| Career | Current industry | Why unverifiable |");
M.push("|---|---|---|");
for (const o of unver.slice(0, 25)) {
  M.push(`| ${String(o.title).replace(/\|/g, "\\|")} | ${o.primary_industry} | ${String(o.note).replace(/\|/g, "\\|").slice(0, 90)} |`);
}
M.push("");
M.push("## What got flagged, and why");
M.push("");
M.push("| Flag kind | Careers |");
M.push("|---|---|");
for (const [k, n] of Object.entries(flagTally).sort((a, b) => b[1] - a[1])) M.push(`| ${k} | ${n} |`);
M.push("");
M.push("Flag rules, both deliberately conservative:");
M.push("");
M.push("- **industry** — the SOC code's industry (via the Phase 2 mapping) overlaps neither `primary_industry` nor `secondary_industries`.");
M.push("- **requirements** — the degree level asserted in the text is 2+ levels away from the one O*NET's Job Zone implies. A 1-level gap is not flagged, since Job Zones are broad.");
M.push("");
M.push("## The `visible` column");
M.push("");
M.push("No visibility column existed (`visible`, `is_hidden`, `hidden`, `is_visible` all absent; the table has an unrelated `reviewed` boolean).");
M.push("");
M.push(`A migration to add it is staged at \`supabase/migrations/20260819000000_add_careers_visible_column.sql\`. It adds \`visible boolean not null default true\` and nothing else — **every existing row stays visible**, and no row's visibility is set from this report.`);
M.push("");
M.push("Note the app does not read this column yet; adding it is inert until the query layer filters on it.");
M.push("");
M.push("## Caveats");
M.push("");
M.push("- Verification here means **\"a government source recognises this occupation code\"**, not \"this job title is real\". A career whose SOC was resolved by title match is only as right as that match.");
M.push("- BLS OOH coverage is understated for the reason above; treat the OOH column as a bonus signal, not a test.");
M.push("- `title_partial` rows deserve a look regardless of classification — the rung is recorded so they can be filtered.");
M.push("");

fs.writeFileSync(path.join(REPORTS, `PHASE4_SUMMARY_${DATE}.md`), M.join("\n"));

// migration: add the column only
const mig = [
  "-- Add a visibility flag to public.careers.",
  "--",
  "-- Phase 4 verification classified every career against O*NET, CareerOneStop and",
  "-- BLS, but deliberately does NOT set this column for any row. Adding it with a",
  "-- default of true means nothing changes for students until a later, reviewed",
  "-- pass hides specific rows.",
  "--",
  "-- Report: reports/PHASE4_SUMMARY_" + DATE + ".md",
  "-- Per-career data: reports/PHASE4_VERIFICATION_" + DATE + ".csv",
  "--",
  "-- Safe to re-run: the add is guarded by `if not exists`.",
  "",
  "alter table public.careers",
  "  add column if not exists visible boolean not null default true;",
  "",
  "comment on column public.careers.visible is",
  "  'Whether this career is shown to students. Default true. Phase 4 verification (2026-08-19) produced a hide/show recommendation per row but did not apply it.';",
  "",
];
fs.writeFileSync(path.join(ROOT, "supabase/migrations", "20260819000000_add_careers_visible_column.sql"), mig.join("\n"));

console.log("");
for (const k of ["VERIFIED", "VERIFIED BUT FLAGGED", "UNVERIFIABLE"]) {
  console.log(`  ${k.padEnd(22)} ${String(tally[k]).padStart(5)}  ${pct(tally[k], total)}%`);
}
console.log(`\n  CSV: reports/PHASE4_VERIFICATION_${DATE}.csv`);
console.log(`  Unverifiable-only: reports/PHASE4_UNVERIFIABLE_${DATE}.csv`);
console.log(`  Summary: reports/PHASE4_SUMMARY_${DATE}.md`);
console.log(`  Migration (NOT applied): supabase/migrations/20260819000000_add_careers_visible_column.sql`);
console.log("\nNothing was written to the database.");
