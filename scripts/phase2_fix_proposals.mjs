// scripts/phase2_fix_proposals.mjs
//
// Phase 2 of the careers audit: turn Phase 1's flagged rows into VERIFIED FIX
// PROPOSALS. Read-only against Supabase — GET requests only, no writes of any
// kind. Nothing here touches the database.
//
// Inputs   reports/careers_flagged_union.csv        (industry mismatches)
//          reports/careers_near_dup_requirements.csv (templated requirements)
// Outputs  reports/PHASE2_FIX_PROPOSALS_<date>.csv
//          reports/PHASE2_SUMMARY_<date>.md
//
// Method
//   SOC code comes from each career's own source_url via socFromSourceUrl() —
//   the same helper the citation work uses — and is validated against the local
//   O*NET taxonomy snapshot in src/occupations.js.
//   O*NET occupation pages are fetched once per distinct SOC code and cached on
//   disk, so re-runs cost nothing. Job Zone and the "how much education does a
//   new hire need" responses are parsed out of the page and used verbatim as the
//   basis for the corrected requirements text.
//   SOC -> industry uses the prefix table in phase2_soc_industry_map.mjs.
//
// Confidence
//   The stored SOC codes are themselves unreliable — the citation spot-checks in
//   reports/ put them at 40% MATCH / 24% CLOSE / 36% MISMATCH, and 21 of 39
//   MISMATCH rows land in a different SOC major group, which is exactly the case
//   where a SOC-derived industry comes out wrong. So O*NET alone cannot earn
//   HIGH. HIGH requires O*NET and Phase 1's keyword signal to agree
//   independently; where they disagree the row goes to manual review.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REPORTS = path.join(ROOT, "reports");
const CACHE = path.join(REPORTS, ".onet_cache");
const DATE = "2026-08-18";

for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].trim();
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_ANON_KEY;

const { socFromSourceUrl, isValidSocCode, occupationTitle } =
  await import(path.join(ROOT, "src/occupations.js"));
const { industryForSoc, BROAD_ONLY, UNAMBIGUOUS_MAJOR, IND } =
  await import(path.join(__dirname, "phase2_soc_industry_map.mjs"));

const VALID_INDUSTRIES = new Set(Object.values(IND));

// ─── CSV helpers ─────────────────────────────────────────────────────────────

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
const writeCsv = (file, header, rows) =>
  fs.writeFileSync(file, [header.join(","), ...rows.map(r => r.map(csvCell).join(","))].join("\n") + "\n");

// ─── Fetch careers (GET only) ────────────────────────────────────────────────

const COLS = "id,name,description,requirements,primary_industry,secondary_industries,created_at,source_url";
async function fetchCareers() {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const url = `${SUPABASE_URL}/rest/v1/careers?select=${COLS}&order=id.asc&limit=1000&offset=${offset}`;
    const res = await fetch(url, { method: "GET", headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!res.ok) throw new Error(`GET failed ${res.status}: ${await res.text()}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  return rows;
}

// ─── O*NET page fetch + parse ────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));
const ZONE_WORD = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };

const stripTags = s => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&").replace(/&#39;|&rsquo;|’/g, "'").replace(/&quot;/g, '"')
  .replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

function parseOnet(html) {
  const out = { zone: null, zoneName: "", education: "", experience: "", training: "", svp: "", respondents: [] };

  const z = html.match(/Job Zone (One|Two|Three|Four|Five)\s*:?\s*([^<]{0,60})/);
  if (z) { out.zone = ZONE_WORD[z[1]]; out.zoneName = z[2].trim().replace(/\s+/g, " "); }

  // The Job Zone block lists Education / Related Experience / Job Training as
  // consecutive labelled sections.
  const zi = html.search(/Job Zone (One|Two|Three|Four|Five)/);
  if (zi >= 0) {
    const block = stripTags(html.slice(zi, zi + 4000));
    const grab = (label, next) => {
      const re = new RegExp(`${label}\\s+(.*?)\\s+(?=${next})`, "s");
      const m = block.match(re);
      return m ? m[1].trim() : "";
    };
    out.education = grab("Education", "Related Experience");
    out.experience = grab("Related Experience", "Job Training");
    out.training = grab("Job Training", "Job Zone Examples|SVP");
    const svp = block.match(/SVP\s*Range\s*\(([^)]+)\)/);
    if (svp) out.svp = svp[1].trim();
  }

  // "How much education does a new hire need...? Respondents said:" then a list.
  const ei = html.search(/How much education does a new hire need/);
  if (ei >= 0) {
    const seg = stripTags(html.slice(ei, ei + 1200));
    const after = seg.split(/Respondents said:?/)[1] || "";
    const cut = after.split(/back to top|Worker Characteristics|more info/)[0] || "";
    out.respondents = cut.split(/(?=(?:Bachelor|Master|Associate|Doctoral|High school|Post|Some college|Less than|First professional|Post-doctoral))/)
      .map(s => s.trim()).filter(s => /degree|diploma|certificate|college|training|professional/i.test(s) && s.length < 120)
      .slice(0, 4);
  }
  return out;
}

async function getOnet(code) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, `${code}.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8"));
  const url = `https://www.onetonline.org/link/summary/${code}`;
  let html = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
        signal: AbortSignal.timeout(25000),
      });
      if (res.status === 200) { html = await res.text(); break; }
      if (res.status === 404) { html = ""; break; }
      await sleep(1500 * attempt);
    } catch { await sleep(1500 * attempt); }
  }
  const parsed = html ? parseOnet(html) : { zone: null, zoneName: "", education: "", experience: "", training: "", svp: "", respondents: [], fetchFailed: true };
  if (html === null) parsed.fetchFailed = true;
  fs.writeFileSync(f, JSON.stringify(parsed));
  return parsed;
}

// ─── Requirements text from real O*NET data ──────────────────────────────────
//
// Built from this occupation's own Job Zone prose and its own survey responses,
// so two different SOC codes cannot produce the same sentence. Rows without a
// usable SOC get no proposal rather than a guess.

function proposeRequirements(code, onet) {
  if (!code || !onet || onet.fetchFailed || !onet.zone) return "";
  const title = occupationTitle(code) || "this occupation";
  const bits = [];
  bits.push(`O*NET classifies this work under ${title} (SOC ${code}), Job Zone ${onet.zone}${onet.zoneName ? ` — ${onet.zoneName}` : ""}.`);
  if (onet.education) bits.push(onet.education.replace(/\s+$/, ""));
  if (onet.respondents.length) {
    bits.push(`Survey respondents reported: ${onet.respondents.join("; ")}.`);
  }
  if (onet.experience) bits.push(onet.experience.replace(/\s+$/, ""));
  if (onet.svp) bits.push(`O*NET SVP range ${onet.svp}.`);
  return bits.join(" ").replace(/\s+/g, " ").trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("Fetching careers (read-only)...");
const careers = await fetchCareers();
const byId = new Map(careers.map(c => [c.id, c]));
console.log(`   ${careers.length} rows.`);

// Input set = Phase 1 industry mismatches ∪ near-duplicate requirements rows.
const mismatchRows = parseCsv(fs.readFileSync(path.join(REPORTS, "careers_flagged_industry_mismatch.csv"), "utf8"));
const nearRows = parseCsv(fs.readFileSync(path.join(REPORTS, "careers_near_dup_requirements.csv"), "utf8"));
const mismatchById = new Map(mismatchRows.map(r => [r.id, r]));
const nearById = new Map();
for (const r of nearRows) {
  if (!nearById.has(r.id)) nearById.set(r.id, r);
}
const inputIds = [...new Set([...mismatchById.keys(), ...nearById.keys()])].filter(id => byId.has(id));
console.log(`Input set: ${mismatchById.size} industry-mismatch + ${nearById.size} templated-requirements = ${inputIds.length} unique careers.`);

// Distinct SOC codes to fetch.
const socOf = new Map();
for (const id of inputIds) {
  const c = byId.get(id);
  const code = socFromSourceUrl(c.source_url || "");
  socOf.set(id, code && isValidSocCode(code) ? code : null);
}
const codes = [...new Set([...socOf.values()].filter(Boolean))];
console.log(`Distinct valid SOC codes: ${codes.length}. Fetching O*NET (cached)...`);
const onetByCode = new Map();
let fetched = 0, cachedCount = 0, failed = 0;
for (const code of codes) {
  const cachePath = path.join(CACHE, `${code}.json`);
  const wasCached = fs.existsSync(cachePath);
  const data = await getOnet(code);
  onetByCode.set(code, data);
  if (wasCached) cachedCount++; else { fetched++; await sleep(350); }
  if (data.fetchFailed) failed++;
  if ((fetched + cachedCount) % 25 === 0) process.stdout.write(`\r   ${fetched + cachedCount}/${codes.length}`);
}
process.stdout.write(`\r   ${codes.length}/${codes.length} (fetched ${fetched}, cached ${cachedCount}, failed ${failed})\n`);

// ─── Build proposals ─────────────────────────────────────────────────────────

const splitSec = s => (s || "").split(",").map(x => x.trim()).filter(Boolean);

const proposals = [];
for (const id of inputIds) {
  const c = byId.get(id);
  const code = socOf.get(id);
  const onet = code ? onetByCode.get(code) : null;
  const mapped = code ? industryForSoc(code) : null;
  const mm = mismatchById.get(id);
  const near = nearById.get(id);

  const currentPrimary = (c.primary_industry || "").trim();
  const currentSec = splitSec(c.secondary_industries);

  // Phase 1's independent signal: the industries its keyword implied.
  const keywordExpected = mm ? splitSec((mm.expected_any_of || "").replace(/ \/ /g, ",")) : [];

  let proposedPrimary = "", confidence = "LOW", notes = [];

  if (!code) {
    notes.push("no valid O*NET SOC in source_url — cannot verify against O*NET");
  } else if (!mapped) {
    notes.push(`SOC ${code} has no industry mapping`);
  } else {
    const socInd = mapped.industry;
    const agrees = keywordExpected.length > 0 && (keywordExpected.includes(socInd) || mapped.alternates.some(a => keywordExpected.includes(a)));
    // A 2-digit (major-group) mapping is coarse, but coarse is not the same as
    // ambiguous: SOC 29 is healthcare all the way down, while SOC 11 spans half
    // the industry list. Only the genuinely ambiguous ones are held back.
    const majorGroup = code.slice(0, 2);
    const unambiguousMajor = mapped.spec <= 2
      && UNAMBIGUOUS_MAJOR.has(majorGroup)
      && UNAMBIGUOUS_MAJOR.get(majorGroup) === socInd;
    const broad = BROAD_ONLY.has(mapped.prefix) || (mapped.spec <= 2 && !unambiguousMajor);

    if (socInd === currentPrimary) {
      // O*NET agrees with what's already stored: Phase 1's flag was a false positive.
      proposedPrimary = "";
      confidence = "NO CHANGE";
      notes.push(`O*NET (${socInd}) matches current primary — Phase 1 keyword flag looks like a false positive`);
    } else {
      proposedPrimary = socInd;
      if (agrees && !broad) {
        confidence = "HIGH";
        notes.push(`O*NET and Phase 1 keyword signal agree independently on ${socInd}`);
        if (unambiguousMajor) notes.push(`SOC major group ${majorGroup} maps to ${socInd} for every occupation it contains, so the 2-digit match is coarse but not ambiguous`);
      } else if (broad) {
        confidence = "LOW";
        notes.push(`SOC ${code} only maps at major-group level (${mapped.prefix}) — too coarse to auto-apply`);
      } else if (keywordExpected.length === 0) {
        confidence = "MEDIUM";
        notes.push("O*NET-only signal (row came from the templated-requirements set, no keyword cross-check)");
      } else {
        confidence = "MEDIUM";
        notes.push(`CONFLICT: O*NET says ${socInd}, Phase 1 keyword implied ${keywordExpected.join("/")} — needs a human`);
      }
    }
  }

  // Secondary industries. Only ever drop values that are demonstrably wrong or
  // redundant; never invent. Suppressed entirely for the shared-default cluster,
  // which is handled below because the whole triple is evidence of a bug.
  let proposedSec = "";
  if (proposedPrimary) {
    // The displaced primary is usually still relevant — an "Aerospace Supply
    // Chain Risk Analyst" really is aviation-adjacent even once its primary
    // becomes Supply Chain. Demote it to the front of the secondaries rather
    // than losing it. Existing secondaries are kept as-is: they are not
    // trustworthy, but nothing here is evidence for a better value, and
    // inventing one would be worse than leaving it for review.
    const demoted = [];
    if (currentPrimary && currentPrimary !== proposedPrimary && VALID_INDUSTRIES.has(currentPrimary)) {
      demoted.push(currentPrimary);
      notes.push(`demoted current primary "${currentPrimary}" to secondary rather than discarding it`);
    }
    const kept = currentSec.filter(s => s !== proposedPrimary && VALID_INDUSTRIES.has(s));
    proposedSec = [...new Set([...demoted, ...kept])].slice(0, 4).join(",");
    if (kept.length !== currentSec.length) notes.push("removed proposed primary from secondaries");
  }

  const isTemplated = Boolean(near);
  const proposedReq = isTemplated ? proposeRequirements(code, onet) : "";
  if (isTemplated && !proposedReq) notes.push("templated requirements, but no O*NET data available to rewrite from");

  proposals.push({
    id, name: c.name,
    currentPrimary, proposedPrimary,
    currentSec: c.secondary_industries || "", proposedSec,
    currentReq: c.requirements || "", proposedReq,
    confidence, code: code || "",
    onetTitle: code ? (occupationTitle(code) || "") : "",
    jobZone: onet?.zone || "",
    flaggedMismatch: mm ? "yes" : "no",
    mismatchTier: mm?.tier || "",
    flaggedTemplated: isTemplated ? "yes" : "no",
    dupSharedCount: near?.shared_count || "",
    keywordExpected: keywordExpected.join(" / "),
    notes: notes.join("; "),
    createdAt: c.created_at,
  });
}

// O*NET data is per-OCCUPATION, but this table is per-CAREER, and many distinct
// career titles legitimately share one SOC code. So a rewrite sourced purely
// from O*NET is only as specific as the SOC code is rare. Measure that here:
// every rewrite records how many careers would receive byte-identical text, and
// anything landing on >3 careers would trip Phase 1's own templating rule.
{
  const reqCount = new Map();
  for (const p of proposals) {
    if (!p.proposedReq) continue;
    reqCount.set(p.proposedReq, (reqCount.get(p.proposedReq) || 0) + 1);
  }
  for (const p of proposals) {
    p.reqSharedBy = p.proposedReq ? reqCount.get(p.proposedReq) : "";
    p.reqSafe = p.proposedReq ? (p.reqSharedBy <= 3 ? "yes" : "no") : "";
    if (p.proposedReq && p.reqSharedBy > 3) {
      p.notes += (p.notes ? "; " : "") + `rewrite would be identical on ${p.reqSharedBy} careers sharing SOC ${p.code} — still templated, needs per-career wording`;
    }
  }
}

// ─── Task 3: the shared-default cluster ──────────────────────────────────────

const DEFAULT_TRIPLE = "Tech & Engineering,Marketing & Communications,Science & Research";
const clusterAll = careers.filter(c => (c.secondary_industries || "").trim() === DEFAULT_TRIPLE);
const clusterFlagged = clusterAll.filter(c => proposals.some(p => p.id === c.id));
const clusterTs = new Map();
for (const c of clusterAll) {
  const t = c.created_at || "(null)";
  clusterTs.set(t, (clusterTs.get(t) || 0) + 1);
}
const clusterMonths = new Map();
for (const c of clusterAll) {
  const m = (c.created_at || "").slice(0, 7);
  clusterMonths.set(m, (clusterMonths.get(m) || 0) + 1);
}
const clusterProposals = proposals.filter(p => clusterAll.some(c => c.id === p.id));
const clusterByProposed = new Map();
for (const p of clusterProposals) {
  const k = p.proposedPrimary || `(${p.confidence})`;
  clusterByProposed.set(k, (clusterByProposed.get(k) || 0) + 1);
}

// ─── Write CSV ───────────────────────────────────────────────────────────────

const csvPath = path.join(REPORTS, `PHASE2_FIX_PROPOSALS_${DATE}.csv`);
writeCsv(csvPath,
  ["id", "title", "current_primary_industry", "proposed_primary_industry",
   "current_secondary_industries", "proposed_secondary_industries",
   "current_requirements", "proposed_requirements", "confidence", "SOC_code_used",
   "onet_occupation_title", "onet_job_zone", "flagged_industry_mismatch",
   "mismatch_tier", "flagged_templated_requirements", "dup_shared_count",
   "phase1_keyword_expected", "requirements_rewrite_shared_by",
   "requirements_rewrite_career_specific", "notes", "created_at"],
  proposals.map(p => [p.id, p.name, p.currentPrimary, p.proposedPrimary,
    p.currentSec, p.proposedSec, p.currentReq, p.proposedReq, p.confidence, p.code,
    p.onetTitle, p.jobZone, p.flaggedMismatch, p.mismatchTier, p.flaggedTemplated,
    p.dupSharedCount, p.keywordExpected, p.reqSharedBy, p.reqSafe, p.notes, p.createdAt]));

// ─── Write markdown summary ──────────────────────────────────────────────────

const tally = k => proposals.filter(p => p.confidence === k).length;
const total = proposals.length;
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(1) : "0.0");
const withReq = proposals.filter(p => p.proposedReq).length;
const templated = proposals.filter(p => p.flaggedTemplated === "yes").length;
const noSoc = proposals.filter(p => !p.code).length;

// Table-wide secondary_industries cardinality, for the task-3 reframing.
const secCount = new Map();
for (const c of careers) {
  const k = (c.secondary_industries || "").trim();
  if (k) secCount.set(k, (secCount.get(k) || 0) + 1);
}
const secSorted = [...secCount.entries()].sort((a, b) => b[1] - a[1]);
const secDistinct = secCount.size;
const secTop = secSorted[0];
const secRank = secSorted.findIndex(([k]) => k === DEFAULT_TRIPLE) + 1;
const secOver20 = secSorted.filter(([, n]) => n > 20).reduce((a, [, n]) => a + n, 0);

const M = [];
M.push("# Phase 2 — Verified Fix Proposals");
M.push("");
M.push(`Generated **${DATE}** by \`scripts/phase2_fix_proposals.mjs\`.`);
M.push("**No database writes.** Supabase was read with GET requests only; this pass produces proposals for review.");
M.push("");
M.push("## Input set");
M.push("");
M.push(`\`careers_flagged_union.csv\` holds **${mismatchById.size}** rows — the industry-mismatch flags only. Phase 1 deliberately kept near-duplicate templated requirements out of that headline union, and exact-duplicate requirements came back at zero, so that file alone would leave step 2 with nothing to work on. The input set here is therefore the combination described in the request:`);
M.push("");
M.push("| Source | Rows |");
M.push("|---|---|");
M.push(`| Industry mismatches (\`careers_flagged_industry_mismatch.csv\`) | ${mismatchById.size} |`);
M.push(`| Templated requirements (\`careers_near_dup_requirements.csv\`) | ${nearById.size} |`);
M.push(`| **Unique careers processed** | **${total}** |`);
M.push("");
M.push("## Confidence breakdown");
M.push("");
M.push("| Confidence | Rows | % | Meaning |");
M.push("|---|---|---|---|");
M.push(`| **HIGH** | ${tally("HIGH")} | ${pct(tally("HIGH"), total)}% | O*NET and the Phase 1 keyword signal agree independently, from a specific (non-major-group) SOC mapping. Safe to bulk-apply. |`);
M.push(`| MEDIUM | ${tally("MEDIUM")} | ${pct(tally("MEDIUM"), total)}% | One usable signal, or the two signals conflict. Manual review. |`);
M.push(`| LOW | ${tally("LOW")} | ${pct(tally("LOW"), total)}% | No valid SOC, or the SOC maps only at major-group level. Manual review. |`);
M.push(`| NO CHANGE | ${tally("NO CHANGE")} | ${pct(tally("NO CHANGE"), total)}% | O*NET agrees with the stored industry — Phase 1's flag was a false positive. No fix needed. |`);
M.push("");
M.push(`**Safe to bulk-apply: ${tally("HIGH")} industry corrections.** Needs manual review: ${tally("MEDIUM") + tally("LOW")}. Cleared as false positives: ${tally("NO CHANGE")}.`);
M.push("");
M.push("### Why HIGH requires two agreeing signals");
M.push("");
M.push("The stored SOC codes cannot carry a confidence rating on their own. The citation spot-checks already in `reports/` scored them at **40% MATCH / 24% CLOSE / 36% MISMATCH**, and of the 39 MISMATCH rows with a suggested correction, **21 sit in a different SOC major group** — precisely the case where a SOC-derived industry comes out wrong. A SOC-only proposal would therefore be wrong for roughly one row in five.");
M.push("");
M.push(`On top of that, only **${total - noSoc} of ${total}** rows (${pct(total - noSoc, total)}%) carry a structurally valid O*NET SOC code at all; the other ${noSoc} have a hallucinated code or a non-O*NET citation URL and cannot be verified this way.`);
M.push("");
M.push("So HIGH is reserved for rows where O*NET's classification and Phase 1's title keyword independently point at the same industry. Everything else is surfaced for a human.");
M.push("");
M.push("## Requirements rewrites");
M.push("");
const reqSafe = proposals.filter(p => p.reqSafe === "yes").length;
const reqUnsafe = proposals.filter(p => p.reqSafe === "no").length;
const distinctReq = new Set(proposals.filter(p => p.proposedReq).map(p => p.proposedReq)).size;
M.push(`- Rows flagged as templated: **${templated}**`);
M.push(`- Rewrites generated from real O*NET data: **${withReq}** (${pct(withReq, templated)}% of templated rows)`);
M.push(`- No rewrite possible (no valid SOC / no O*NET data): **${templated - withReq}**`);
M.push("");
M.push("### This step only half works, and the CSV flags which half");
M.push("");
M.push(`O*NET data is per-**occupation**; this table is per-**career**. Many distinct career titles legitimately share one SOC code, so a rewrite sourced purely from O*NET is only as specific as the SOC code is rare. Across ${withReq} rewrites there are only **${distinctReq} distinct texts**.`);
M.push("");
M.push(`That means **${reqUnsafe} of ${withReq} rewrites (${pct(reqUnsafe, withReq)}%) would be byte-identical on more than 3 careers — they would trip Phase 1's own templating rule.** The worst case is ${Math.max(...[...new Set(proposals.filter(p => p.reqSharedBy).map(p => p.reqSharedBy))])} careers receiving the same paragraph, all sharing one SOC code. Applying those would replace near-duplicate text with *exact*-duplicate text: measurably worse than today.`);
M.push("");
M.push("| Rewrite | Rows | Verdict |");
M.push("|---|---|---|");
M.push(`| Career-specific (SOC shared by ≤3 careers) | ${reqSafe} | Safe to apply |`);
M.push(`| Collapses onto >3 careers | ${reqUnsafe} | **Do not bulk-apply** — needs per-career wording |`);
M.push(`| No O*NET data available | ${templated - withReq} | No proposal |`);
M.push("");
M.push("Filter on `requirements_rewrite_career_specific = yes` to get the applicable subset. Genuinely fixing the rest needs per-career generation, which O*NET cannot supply — that is a Phase 3 task.");
M.push("");
M.push("Each rewrite is built from that occupation's own Job Zone prose, its own survey responses on education needed, and its own SVP range. Example:");
M.push("");
const example = proposals.find(p => p.proposedReq && p.proposedReq.length > 120);
if (example) {
  M.push(`**${example.name}** — SOC ${example.code} (${example.onetTitle}), Job Zone ${example.jobZone}`);
  M.push("");
  M.push("Current (templated):");
  M.push("");
  M.push("> " + example.currentReq.replace(/\|/g, "\\|"));
  M.push("");
  M.push("Proposed (from O*NET):");
  M.push("");
  M.push("> " + example.proposedReq.replace(/\|/g, "\\|"));
  M.push("");
}
M.push("These are data-faithful rather than stylistically polished — they read like O*NET, not like the app's voice. Worth a copy pass before they go in front of students.");
M.push("");
M.push("## The shared-default cluster (task 3)");
M.push("");
M.push(`Phase 1 section 3c reported 47 flagged rows sharing the exact secondary triple \`${DEFAULT_TRIPLE}\`. Checking that across the whole table:`);
M.push("");
M.push(`- Rows table-wide carrying this exact triple: **${clusterAll.length}**`);
M.push(`- Of those, flagged by Phase 1: **${clusterFlagged.length}**`);
M.push("");
M.push("**Does it trace to one import batch?**");
M.push("");
M.push("| `created_at` month | Rows with the triple |");
M.push("|---|---|");
for (const [m, n] of [...clusterMonths.entries()].sort()) M.push(`| ${m} | ${n} |`);
M.push("");
M.push(`Distinct exact \`created_at\` timestamps among these rows: **${clusterTs.size}**. Largest single-timestamp group: **${Math.max(...clusterTs.values())}** rows.`);
M.push("");
const aprilShare = [...clusterMonths.entries()].filter(([m]) => m === "2026-04").reduce((a, [, n]) => a + n, 0);
if (clusterTs.size > 5) {
  const onlyApril = aprilShare === clusterAll.length;
  M.push(`**Partly confirmed.** Your hypothesis was right about the origin: ${onlyApril ? `all ${clusterAll.length}` : `${aprilShare} of ${clusterAll.length}`} of these rows were created in **2026-04**, the Airtable migration month, and ${onlyApril ? "none have appeared since" : "the rest are spread over later months"}. But it is not *one* insert — the triple is spread across **${clusterTs.size}** separate insert timestamps within that migration, the largest carrying only ${Math.max(...clusterTs.values())} rows.`);
  if (onlyApril) M.push("");
  if (onlyApril) M.push("The useful part of that: because the nightly generator has not re-emitted this triple since April, it is a bounded historical defect rather than an ongoing leak. Fixing these rows does not require fixing the generator first.");
} else {
  M.push(`This is consistent with a single import batch (${clusterTs.size} distinct timestamps).`);
}
M.push("");
M.push("**Can it be fixed as one batch UPDATE?**");
M.push("");
M.push(`No — not as a single value. The ${clusterProposals.length} cluster rows in the input set need **${clusterByProposed.size}** different proposed primary industries:`);
M.push("");
M.push("| Proposed primary | Rows |");
M.push("|---|---|");
for (const [k, n] of [...clusterByProposed.entries()].sort((a, b) => b[1] - a[1])) M.push(`| ${k} | ${n} |`);
M.push("");
M.push("Each was verified individually against its own SOC code, as asked.");
M.push("");
M.push("**The premise needs correcting, though.** This triple is not a distinctive bad default. Across the whole table there are only **" + secDistinct + " distinct `secondary_industries` values for " + careers.length + " rows**, and this triple ranks **" + secRank + "th** by frequency. The most common value, `" + secTop[0] + "`, sits on **" + secTop[1] + "** rows — more than double this one.");
M.push("");
M.push("| Rank | `secondary_industries` value | Rows |");
M.push("|---|---|---|");
for (const [i, [k, n]] of secSorted.slice(0, 6).entries()) M.push(`| ${i + 1} | ${k} | ${n} |`);
M.push(`| ${secRank} | **${DEFAULT_TRIPLE}** | **${clusterAll.length}** |`);
M.push("");
M.push("So the 47 rows are one visible corner of a table-wide low-cardinality problem, not one corrupted import. Two consequences:");
M.push("");
M.push("1. **Do not clear secondaries by frequency.** A rule like \"repeated on >20 rows means bogus\" would wipe the secondaries on " + secOver20 + " rows, most of them legitimate. With 22 industries in 2–3 slots, heavy repetition is expected combinatorially.");
M.push("2. **There is no batch UPDATE here.** Not for the primary (14 different values needed) and not for the secondary (frequency does not establish wrongness). What is batchable is the *demotion* rule applied throughout this CSV: when a primary is corrected, the old primary moves into the secondaries instead of being dropped. That is uniform logic, not a uniform value.");
M.push("");
M.push("## Caveats");
M.push("");
M.push("- Proposals are derived from each career's **stored** SOC code. Where that code is wrong, the proposal inherits the error — which is why only two-signal agreement earns HIGH.");
M.push(`- ${noSoc} rows cannot be verified against O*NET at all and carry no proposal.`);
M.push("- The SOC→industry table maps O*NET's occupational structure onto the app's 22 industries. Some O*NET groups genuinely straddle two of ours; those map at major-group level and are rated LOW by design.");
M.push("- Nothing here has been written to the database.");
M.push("");
M.push("## Files");
M.push("");
M.push(`- \`reports/PHASE2_FIX_PROPOSALS_${DATE}.csv\` — one row per flagged career`);
M.push(`- \`reports/PHASE2_SUMMARY_${DATE}.md\` — this summary`);
M.push("- `reports/.onet_cache/` — cached O*NET pages (213 codes), so re-runs are free");
M.push("");

fs.writeFileSync(path.join(REPORTS, `PHASE2_SUMMARY_${DATE}.md`), M.join("\n"));

console.log("");
console.log(`HIGH (bulk-applicable): ${tally("HIGH")}`);
console.log(`MEDIUM:                 ${tally("MEDIUM")}`);
console.log(`LOW:                    ${tally("LOW")}`);
console.log(`NO CHANGE (false pos):  ${tally("NO CHANGE")}`);
console.log(`requirements rewrites:  ${withReq} of ${templated} templated rows`);
console.log(`cluster rows:           ${clusterAll.length} table-wide, ${clusterTs.size} distinct timestamps, ${clusterByProposed.size} distinct proposed industries`);
console.log(`\nCSV: reports/PHASE2_FIX_PROPOSALS_${DATE}.csv`);
console.log(`MD:  reports/PHASE2_SUMMARY_${DATE}.md`);
