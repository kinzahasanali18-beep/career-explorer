# Phase 2 — Verified Fix Proposals

Generated **2026-08-18** by `scripts/phase2_fix_proposals.mjs`.
**No database writes.** Supabase was read with GET requests only; this pass produces proposals for review.

## Input set

`careers_flagged_union.csv` holds **495** rows — the industry-mismatch flags only. Phase 1 deliberately kept near-duplicate templated requirements out of that headline union, and exact-duplicate requirements came back at zero, so that file alone would leave step 2 with nothing to work on. The input set here is therefore the combination described in the request:

| Source | Rows |
|---|---|
| Industry mismatches (`careers_flagged_industry_mismatch.csv`) | 495 |
| Templated requirements (`careers_near_dup_requirements.csv`) | 1124 |
| **Unique careers processed** | **1527** |

## Confidence breakdown

| Confidence | Rows | % | Meaning |
|---|---|---|---|
| **HIGH** | 17 | 1.1% | O*NET and the Phase 1 keyword signal agree independently, from a specific (non-major-group) SOC mapping. Safe to bulk-apply. |
| MEDIUM | 322 | 21.1% | One usable signal, or the two signals conflict. Manual review. |
| LOW | 733 | 48.0% | No valid SOC, or the SOC maps only at major-group level. Manual review. |
| NO CHANGE | 455 | 29.8% | O*NET agrees with the stored industry — Phase 1's flag was a false positive. No fix needed. |

**Safe to bulk-apply: 17 industry corrections.** Needs manual review: 1055. Cleared as false positives: 455.

### Why HIGH requires two agreeing signals

The stored SOC codes cannot carry a confidence rating on their own. The citation spot-checks already in `reports/` scored them at **40% MATCH / 24% CLOSE / 36% MISMATCH**, and of the 39 MISMATCH rows with a suggested correction, **21 sit in a different SOC major group** — precisely the case where a SOC-derived industry comes out wrong. A SOC-only proposal would therefore be wrong for roughly one row in five.

On top of that, only **1037 of 1527** rows (67.9%) carry a structurally valid O*NET SOC code at all; the other 490 have a hallucinated code or a non-O*NET citation URL and cannot be verified this way.

So HIGH is reserved for rows where O*NET's classification and Phase 1's title keyword independently point at the same industry. Everything else is surfaced for a human.

## Requirements rewrites

- Rows flagged as templated: **1124**
- Rewrites generated from real O*NET data: **730** (64.9% of templated rows)
- No rewrite possible (no valid SOC / no O*NET data): **394**

### This step only half works, and the CSV flags which half

O*NET data is per-**occupation**; this table is per-**career**. Many distinct career titles legitimately share one SOC code, so a rewrite sourced purely from O*NET is only as specific as the SOC code is rare. Across 730 rewrites there are only **137 distinct texts**.

That means **587 of 730 rewrites (80.4%) would be byte-identical on more than 3 careers — they would trip Phase 1's own templating rule.** The worst case is 74 careers receiving the same paragraph, all sharing one SOC code. Applying those would replace near-duplicate text with *exact*-duplicate text: measurably worse than today.

| Rewrite | Rows | Verdict |
|---|---|---|
| Career-specific (SOC shared by ≤3 careers) | 143 | Safe to apply |
| Collapses onto >3 careers | 587 | **Do not bulk-apply** — needs per-career wording |
| No O*NET data available | 394 | No proposal |

Filter on `requirements_rewrite_career_specific = yes` to get the applicable subset. Genuinely fixing the rest needs per-career generation, which O*NET cannot supply — that is a Phase 3 task.

Each rewrite is built from that occupation's own Job Zone prose, its own survey responses on education needed, and its own SVP range. Example:

**Exhibition Graphic Designer** — SOC 27-1024.00 (Graphic Designers), Job Zone 4

Current (templated):

> A portfolio demonstrating design skills is essential; a degree in graphic design, fine arts, or related field is often preferred but not always required if you have strong experience.

Proposed (from O*NET):

> O*NET classifies this work under Graphic Designers (SOC 27-1024.00), Job Zone 4 — Considerable Preparation Needed. Most of these occupations require a four-year bachelor's degree, but some do not. Survey respondents reported: Bachelor's degree required 15% </. A considerable amount of work-related skill, knowledge, or experience is needed for these occupations. For example, an accountant must complete four years of college and work for several years in accounting to be considered qualified. O*NET SVP range 7.0 to 8.0.

These are data-faithful rather than stylistically polished — they read like O*NET, not like the app's voice. Worth a copy pass before they go in front of students.

## The shared-default cluster (task 3)

Phase 1 section 3c reported 47 flagged rows sharing the exact secondary triple `Tech & Engineering,Marketing & Communications,Science & Research`. Checking that across the whole table:

- Rows table-wide carrying this exact triple: **92**
- Of those, flagged by Phase 1: **40**

**Does it trace to one import batch?**

| `created_at` month | Rows with the triple |
|---|---|
| 2026-04 | 92 |

Distinct exact `created_at` timestamps among these rows: **26**. Largest single-timestamp group: **11** rows.

**Partly confirmed.** Your hypothesis was right about the origin: all 92 of these rows were created in **2026-04**, the Airtable migration month, and none have appeared since. But it is not *one* insert — the triple is spread across **26** separate insert timestamps within that migration, the largest carrying only 11 rows.

The useful part of that: because the nightly generator has not re-emitted this triple since April, it is a bounded historical defect rather than an ongoing leak. Fixing these rows does not require fixing the generator first.

**Can it be fixed as one batch UPDATE?**

No — not as a single value. The 40 cluster rows in the input set need **12** different proposed primary industries:

| Proposed primary | Rows |
|---|---|
| (LOW) | 18 |
| Business & Finance | 5 |
| Marketing & Communications | 3 |
| Education & Coaching | 3 |
| Hospitality & Events | 2 |
| Healthcare & Medicine | 2 |
| Social Impact & Nonprofit | 2 |
| Media & Journalism | 1 |
| Tech & Engineering | 1 |
| Law & Government | 1 |
| Arts & Performance | 1 |
| Environment & Sustainability | 1 |

Each was verified individually against its own SOC code, as asked.

**The premise needs correcting, though.** This triple is not a distinctive bad default. Across the whole table there are only **417 distinct `secondary_industries` values for 7391 rows**, and this triple ranks **19th** by frequency. The most common value, `Tech & Engineering,Business & Finance`, sits on **259** rows — more than double this one.

| Rank | `secondary_industries` value | Rows |
|---|---|---|
| 1 | Tech & Engineering,Business & Finance | 259 |
| 2 | Business & Finance,Social Impact & Nonprofit | 164 |
| 3 | Healthcare & Medicine,Education & Coaching | 158 |
| 4 | Business & Finance,Tech & Engineering,Science & Research | 157 |
| 5 | Healthcare & Medicine,Tech & Engineering | 151 |
| 6 | Science & Research,Tech & Engineering | 144 |
| 19 | **Tech & Engineering,Marketing & Communications,Science & Research** | **92** |

So the 47 rows are one visible corner of a table-wide low-cardinality problem, not one corrupted import. Two consequences:

1. **Do not clear secondaries by frequency.** A rule like "repeated on >20 rows means bogus" would wipe the secondaries on 5922 rows, most of them legitimate. With 22 industries in 2–3 slots, heavy repetition is expected combinatorially.
2. **There is no batch UPDATE here.** Not for the primary (14 different values needed) and not for the secondary (frequency does not establish wrongness). What is batchable is the *demotion* rule applied throughout this CSV: when a primary is corrected, the old primary moves into the secondaries instead of being dropped. That is uniform logic, not a uniform value.

## Caveats

- Proposals are derived from each career's **stored** SOC code. Where that code is wrong, the proposal inherits the error — which is why only two-signal agreement earns HIGH.
- 490 rows cannot be verified against O*NET at all and carry no proposal.
- The SOC→industry table maps O*NET's occupational structure onto the app's 22 industries. Some O*NET groups genuinely straddle two of ours; those map at major-group level and are rated LOW by design.
- Nothing here has been written to the database.

## Files

- `reports/PHASE2_FIX_PROPOSALS_2026-08-18.csv` — one row per flagged career
- `reports/PHASE2_SUMMARY_2026-08-18.md` — this summary
- `reports/.onet_cache/` — cached O*NET pages (213 codes), so re-runs are free
