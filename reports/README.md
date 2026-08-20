# Careers table — query-driven data quality reports

Generated read-only against `public.careers` at **7,016 rows, 2026-08-09**.

> **These reports go stale daily.** A scheduled job adds ~20 careers a night (22 were
> inserted at 02:11 on 2026-08-10, taking the table to 7,038). New rows are not covered
> by any CSV here, and they arrive with the same tagging problems — one of the 22 is
> `Green Architect` → Environment & Sustainability, and another is `ESL Teacher (K-12)`,
> adding to the ESL duplicate cluster below. Re-run the queries before acting on counts.

Two batches of fixes have since been applied via migration; see "Applied fixes" at the end.

The Supabase anon key cannot execute raw SQL — PostgREST exposes REST only — so the
full table was mirrored into a local SQLite database and the queries run there.
`equivalent_postgres.sql` contains the same queries as Postgres, to run server-side.

**Net result: 676 distinct careers (9.6% of the table) carry at least one salary flag**,
plus 8 confirmed keyword-collision tag errors and 164 high-confidence duplicate pairs.
That replaces "web-search 7,016 careers" with a finite worklist.

---

## The three systematic defects

These matter more than any individual row, because each is one root cause behind many rows.

### 1. `$30k–$45k` is being used as a default, not an estimate — 154 rows

It appears on 154 careers spanning **18 of 22 industries**. The occupants include:

| Career | Reality |
|---|---|
| **Anesthesiologist** | BLS physicians p10 ≈ $100k; median well above $200k |
| **Cardiac Surgeon** | same |
| **Deputy District Attorney** | BLS lawyers p10 ≈ $73k |
| **State Senator/Representative** | varies by state, but not a $30k floor |
| Cruise Activities Director, Youth Sports Coach, Tutor Coordinator | plausible at this band |

A band that fits a youth sports coach *and* a cardiac surgeon is not an estimate.
→ `careers_q5_suspected_default_salary.csv`

### 2. "Architect" in a title drags the row into Architecture & Urban Planning — 8 rows

Software Architect, Cloud Architect, Database Architect, Systems Architect, Solutions
Architect, IoT Solutions Architect, Information Architect, Cloud Solutions Architect —
all tagged **Architecture & Urban Planning**. A pure keyword collision, same class as
`Curriculum Vitae Designer` → Education & Coaching found in the sample audit.

Related: **349 rows** carry Architecture & Urban Planning as a *secondary* tag, and two
of the three I inspected by hand were unrelated to architecture. Worth a sweep.
→ `careers_q4_keyword_collision_tags.csv`

### 3. Senior titles priced as individual contributors — 324 rows

Every clearly-wrong salary in the sample audit was a Director or Architect role with an
IC-level floor. Across the full table that pattern hits 324 rows.
→ `careers_q1_senior_title_entry_floor.csv`

---

## Report index

| File | Rows | Precision | How to use |
|---|---|---|---|
| `careers_q1_senior_title_entry_floor.csv` | 324 | medium | Sorted by `shortfall_k` desc. The top ~60 (shortfall ≥ 35) are the strongest. Some are genuine — a "Youth Soccer Director" at a rec centre really can pay $30k — so this needs judgement, not a blanket update. |
| `careers_q2_below_bls_p10.csv` | 153 | **high** | Floor below the BLS 10th percentile for a matched occupation. Objectively checkable; each row names the BLS occupation and threshold used. |
| `careers_q2b_zero_or_unparseable_floor.csv` | 73 | **high** | All are `$0–$500k+`. Defensible for founder roles, wrong for Surgeon / Radiologist / Neurosurgeon. |
| `careers_q5_suspected_default_salary.csv` | 154 | **high** | The `$30k–$45k` cluster above. |
| `careers_q4_keyword_collision_tags.csv` | 8 | **very high** | Tech architects mis-tagged. Safe to fix as a batch. |
| `careers_q3a_near_identical_descriptions.csv` | 164 | **high** | Description similarity ≥ 0.55 **and** different primary industry. Several are exact duplicates (similarity 1.0) with contradictory tags. Review all. |
| `careers_q3b_sibling_titles_ranked.csv` | 3,927 | low, ranked | Shared title stem, and neither row's primary appears anywhere in the other's tags. Ranked by rarity of the shared terms. Top ~200 are worth reading; precision decays sharply below that. |

**Distinct careers with ≥1 salary flag across Q1/Q2/Q2b/Q5: 676.** Overlap between reports
is small (Q1∩Q5 = 6, Q2∩Q2b = 10, Q2∩Q5 = 11), so these are largely independent signals.

---

## Highlights from Q3a — duplicate rows with contradictory tags

| Similarity | Pair | Primary industries |
|---|---|---|
| 1.00 | Mergers & Acquisitions Specialist / Merger & Acquisition Specialist | Science & Research ↔ **Business & Finance** |
| 1.00 | Backend Software Engineer / Backend Developer | Tech & Engineering ↔ **Science & Research** |
| 1.00 | Color Analysis Specialist / Color Analysis Consultant | Fashion & Beauty ↔ **Supply Chain & Operations** |
| 0.96 | Conference Logistics Manager / Conference Manager | Hospitality & Events ↔ Supply Chain & Operations |
| 0.94 | Referee / Referee-Umpire (Professional) | **Gaming & Esports** ↔ Sports & Fitness |
| 0.94 | Fact Checker (Digital Media) / Fact-Checker (Media Literacy) | Science & Research ↔ Media & Journalism |

Four separate **ESL** rows exist with conflicting tags, one of them under
**Environment & Sustainability** (top of Q3b). These look like duplicate rows that should
be merged, not just retagged.

---

## Method and limits — worth reading before acting

**Q2's BLS thresholds are approximate.** 28 keyword→occupation rules using May 2024
OEWS/OOH 10th-percentile figures, chosen deliberately low so a hit means a clear
violation. This under-flags: roles with no matching rule are never checked. Extending the
rule table is the cheapest way to increase coverage.

**Q1's thresholds are judgement, not data.** Expected minimum floors ($75k director,
$75k architect, $70k senior/lead, $90k chief/VP) are my estimates. Review the numbers
before trusting the row count.

**Q3b is a queue, not a list, and its ranking is imperfect.** The two inconsistencies I
originally found by eye rank **422** (Crop vs Commercial Insurance Adjuster) and **2,055**
(Corporate Events Planner vs Director) out of 3,927 — mid-pack, not at the top. Manual
inspection surfaced things this heuristic ranks poorly, so don't treat the top of Q3b as
exhaustive. Q3a is the high-precision half of this check.

**Sibling-title mismatches are not automatically errors.** A 7,016-row table legitimately
contains related roles in different industries (Sports Photographer vs Wedding
Photographer). Q3b needs human judgement on every row.

## Reproducing

```bash
python3 /tmp/careers_audit/analyze.py     # regenerates Q1, Q2, Q2b, Q4, Q5
```
Or run `equivalent_postgres.sql` in the Supabase SQL editor for the same results
server-side. Q3a/Q3b need the similarity pass, which is Python.

---

## Applied fixes

Two migrations have been applied to the remote database. Both are `UPDATE`-only, pinned by
row id, and revertible.

| Migration | Rows | Change |
|---|---|---|
| `20260809181820_fix_tech_architect_industry_tags.sql` | 8 | Tech "architect" roles: Architecture & Urban Planning → Tech & Engineering |
| `20260810173614_fix_experience_design_architect_tags.sql` | 4 | Experience/UX "architect" roles → Design & Creative (supersedes the above for `Information Architect`) |

Reverts: `q4_revert.sql`, `q4b_revert.sql`. Prior values: `q4_backup_before.json`,
`q4b_backup_before.json`.

**Note on writing to this table:** the anon key cannot. A `PATCH` via PostgREST returns
`HTTP 200` with `[]` — zero rows affected, silently denied by RLS. That is the same
false-success failure mode as the `profiles` delete bug. Any fix must go through a
migration (`supabase db push`) or the SQL editor, and must be verified by re-reading the
rows rather than trusting the status code.

`Architecture & Urban Planning` now contains 18 rows, of which the 4 with "architect" in
the title are all genuine: Architectural Renderer, Architectural Technologist, Green
Building Architect, Landscape Architect.

## Applied: Phase 2 HIGH-confidence industry corrections — 89 rows (2026-08-18)

`supabase/migrations/20260818004500_apply_phase2_high_confidence_industry_fixes.sql`,
run via the SQL editor. Verified by re-reading all 89 rows: 89 applied, 0 pending, 0
unexpected, table still 7,391 rows. Re-run `node scripts/phase2_verify_applied.mjs` to
re-check at any time.

Each row got `primary_industry` set to the O*NET-derived value and the displaced primary
demoted to the front of `secondary_industries`, so nothing was discarded — e.g. `Aerospace
Supply Chain Risk Analyst` moved Aviation & Transportation → Supply Chain & Operations
while keeping Aviation as a secondary.

Reverts: `phase2_high_confidence_revert.sql`. Prior values:
`phase2_high_confidence_backup_before.csv`.

**Why only 89 of 1,527 flagged rows.** HIGH required two independent signals to agree:
O*NET's classification of the SOC code in the row's `source_url`, and the Phase 1 title
keyword. O*NET alone could not carry it — the citation spot-checks in this directory score
the stored SOC codes at 40% MATCH / 24% CLOSE / 36% MISMATCH, and 21 of 39 MISMATCH rows
sit in a different SOC major group, which is exactly where a SOC-derived industry comes out
wrong.

**Known gap: the confidence rule is too strict on unambiguous major groups.** 48 rows were
rated LOW purely because their SOC mapped at 2-digit major-group level, but several of those
groups are not actually ambiguous — 29 and 31 are entirely healthcare, 23 entirely legal,
25 entirely education. 17 of them also have Phase 1 keyword agreement and would qualify as
HIGH under a corrected rule, including `Prosecutor` → Gaming & Esports, `Elementary School
Teacher` → Gaming & Esports, `Forensic Nurse` → Cybersecurity, and `Anesthesiologist
Assistant` → Arts & Performance. Worth a follow-up batch.

**Severity skew.** Of Phase 1's 187 most-severe (HIGH-tier keyword) rows, only 36 were
fixed in this batch; 106 remain LOW, 64 of them because `source_url` carries no valid SOC
code at all. That no-SOC rate (34%) is barely above the 32% baseline for the whole flagged
set, so this is not an adverse correlation — it is just that the HIGH bar excludes rows
O*NET cannot verify. The worst-looking errors are still outstanding.

## Applied: Phase 3 demotion cleanup — 91 rows (2026-08-18)

`supabase/migrations/20260818020000_demotion_cleanup.sql`. Verified: 91/91 tags removed,
0 residual, 0 other tags altered or reordered, 0 primaries touched, table still 7,391 rows.
Re-check with `node scripts/phase3_verify_applied.mjs`.

Batches 1 and 2 demoted each corrected row's old primary into `secondary_industries` so
nothing was silently dropped. That was right when the old primary was plausible and wrong
when it was nonsense — `Hospital Chaplain` kept Gaming & Esports, `Magazine Editor-in-Chief`
kept Science & Research. This pass removes the demoted tag where the career's own title and
description contain no keyword supporting that industry, reusing the Phase 1 rules via
`scripts/phase1_keyword_rules.cjs` (extracted this round so both passes share one source of
truth; verified non-regressive — the audit reports 391 mismatches before and after).

Selection is evidence-based, not a list of bad industry pairs. **7 rows correctly kept**
their demoted tag because evidence existed (`Aerospace Supply Chain Risk Analyst` keeps
Aviation & Transportation on "Aerospace"/"Aircraft"). **8 rows were skipped as untestable**
— Entrepreneurship has zero keyword rules, so evidence for it cannot be evaluated either
way.

Most-removed tags: Gaming & Esports 39, Science & Research 13, Supply Chain & Operations 9.
Gaming & Esports being the single most-demoted value is itself a finding — it looks like a
dumping-ground default in the April migration, same class as the `$30k-$45k` salary and the
secondary-triple defaults.

Reverts: `phase3_demotion_cleanup_revert.sql`. Prior values:
`phase3_demotion_cleanup_backup_before.csv`.

**Note on applying long SQL by paste.** The first attempt applied only 17 of 91 rows —
positions 1-17, a contiguous run from the top. The guards meant the partial run left no
inconsistent state, just 74 untouched rows. The remainder was re-emitted grouped by shared
value pair and split into four small files (`phase3_remainder_chunk1-4.sql`) which applied
cleanly. Paste from the files, not from a chat transcript, and always verify by re-reading
rows.

**Note on reading the Phase 2 verifiers after this batch.** Phase 3 intentionally changed
`secondary_industries` on 91 of the 106 Phase 2 rows, which makes the Phase 2 manifests
stale on that column. `phase2_verify_applied.mjs` now judges primary and secondary
separately and reports those rows as "applied, secondaries since superseded" rather than
"partially applied". All 106 Phase 2 primaries remain correct.

## Cumulative state after Phases 1-3

- 106 industry corrections applied and verified (89 + 17)
- 91 unsupported demoted tags removed
- Table unchanged at 7,391 rows throughout; every batch has a backup, revert and manifest

Still outstanding: of Phase 1's 187 most-severe rows, 106 remain unfixed because 64 carry no
valid O*NET SOC code in `source_url` at all — `Community Health Nurse` -> Gaming & Esports,
`Cost Accountant` -> Arts & Performance, `Gastroenterologist` -> Hospitality & Events. That
is the ceiling of the O*NET-gated method and needs a different signal, not a looser
threshold. Also outstanding: 587 of 730 proposed requirements rewrites would be
byte-identical across more than 3 careers and must not be bulk-applied.

## Phase 4 — full-table multi-source verification (2026-08-19)

Read-only pass over all 7,391 careers against O*NET, CareerOneStop and BLS.
`node scripts/phase4_verify_all_careers.mjs`.

| Classification | Careers | % |
|---|---|---|
| VERIFIED | 4,249 | 57.5% |
| VERIFIED BUT FLAGGED | 2,248 | 30.4% |
| UNVERIFIABLE | 894 | 12.1% |

**UNVERIFIABLE means the citation is broken, not that the career is fake.** The list
contained Meteorologist, Astrophysicist, Quantum Physicist, Nephrologist and Medical
Laboratory Scientist. Do not use this classification as a hide list.

**BLS OOH is unreachable.** bls.gov returns 403 to plain curl, browser-UA curl and the
OOH-SOC crosswalk page alike — the same wall the BLS backfill migration documented. The
only OOH signal available is the 171-occupation slug->SOC crosswalk that backfill left in
`backfill_bls_backup_before.csv`. Note OOH publishes ~330 profiles against O*NET's 1,016,
so "BLS OOH: no" is normal and not a red flag.

**BLS OES does work**, via `api.bls.gov` national employment series keyed by 6-digit SOC,
batched 25 per POST across 441 codes. Registered Nurses returns 3,379,720, which is right.
It is a different BLS product from OOH, so it is reported as its own column rather than
substituted for it.

All 1,709 bls.gov citations in the table are fabricated: their path segments are SOC
major-group names (`healthcare-practitioners-and-technical-occupations/...`) rather than
real OOH categories. Only 5 of 1,709 match the crosswalk.

A `visible` column did not exist. `supabase/migrations/20260819000000_add_careers_visible_column.sql`
adds `visible boolean not null default true` and nothing else. **NOT YET APPLIED** —
`supabase db push` would apply it. No row's visibility has been set.

## Applied: Phase 4b citation fixes — 72 rows (2026-08-19)

`supabase/migrations/20260819010000_citation_fixes.sql`. Verified 72/72: `source_url`
updated, every new URL resolves via `socFromSourceUrl` + `isValidSocCode`, all 72 now
render a citation through `resolveCitation()`, and `primary_industry` moved on none of
them. Re-check with `node scripts/phase4b_verify_citation_fixes.mjs`.

Of Phase 4's 115 full-coverage name-match candidates, reviewed on meaning rather than
string similarity:

| Classification | Careers |
|---|---|
| CONFIRMED (applied) | 72 |
| FALSE MATCH (left alone) | 33 |
| STILL UNCERTAIN (needs a human) | 10 |

**The naive matcher was wrong or unsafe 37% of the time at its strongest tier**, which is
why the weaker tiers (313 strong, 363 weak) must not be auto-applied. The false matches
split two ways: teaching level, because O*NET's subject-specific teacher codes are all
Postsecondary while K-12 teachers sit under 25-2031.00; and single-word collisions —
Radio DJ -> Radio Frequency Identification Device Specialists, VFX Supervisor ->
First-Line Supervisors of Correctional Officers, Sports Writer -> Gambling and Sports Book
Writers, Pathologist -> Speech-Language Pathologists.

Reverts: `phase4b_citation_fixes_revert.sql`. Prior values:
`phase4b_citation_fixes_backup_before.csv`. Manifest: `phase4b_citation_fixes_manifest.csv`.

**Two failure modes behind broken citations, not one.** 49 of the 72 cited fabricated
bls.gov URLs; the other 23 cited onetonline.org with codes retired in the 2018 SOC
revision (Video Editor -> 27-4008.00, Medical Records Specialist -> 29-2071.00). An initial
guard of `source_url like 'bls.gov/ooh/%'` silently excluded those 23. If the generator was
working from a pre-2018 SOC list, that would also explain part of the 307 invalid codes
elsewhere in the table.

**Script coupling.** `phase4b_review_full_candidates.mjs` reads
`PHASE4_UNVERIFIABLE_2026-08-19.csv` and hard-fails on stale judgments. Re-running Phase 4
regenerates that file (894 -> ~822 now these 72 are fixed) and will break the 4b script
until its judgment table is re-keyed. Date-stamp a new Phase 4 run rather than overwriting
the 2026-08-19 files, which are the record these fixes came from.

## Next finding, not yet actioned

Checking precedent for the second batch surfaced a **larger UX tagging inconsistency**.
These sit under `Science & Research`, which is wrong for all of them:

`User Experience Designer` · `User Experience (UX) Designer` · `User Experience Researcher` ·
`User Experience Writer` · `Interaction Designer` · `Interaction Designer (Digital)` ·
`Product Designer` · `Industrial Product Designer` · `AR/VR Experience Designer`

while their near-identical twins are correctly `Design & Creative`: `UX Writer (Content
Design)` · `UX Motion Designer` · `UX Researcher (User Testing)` · `Interaction Designer
(UX)` · `Digital Product Designer` · `UX/UI Product Designer` · `Information Architecture
Designer`.

Other strays seen in the same neighbourhood: `Virtual Reality Creator` → Environment &
Sustainability · `Augmented Reality Developer` → Hospitality & Events · `Service Design
Consultant` → Healthcare & Medicine · `Product Designer (Industrial)` → Fashion & Beauty.

This is the same defect class as Q3a/Q3b and is worth a dedicated pass.
