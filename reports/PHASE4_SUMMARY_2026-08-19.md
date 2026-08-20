# Phase 4 — Full-table multi-source verification

Generated **2026-08-19** by `scripts/phase4_verify_all_careers.mjs` over all **7391** careers.
**Read-only.** GET requests only against Supabase; no rows changed, no visibility toggled, nothing deleted.

> Named Phase 4 because `reports/phase3_*` is already the applied demotion cleanup. This is the pass you called Phase 3.

## Classification

| Classification | Careers | % of table |
|---|---|---|
| VERIFIED | 4249 | 57.5% |
| VERIFIED BUT FLAGGED | 2248 | 30.4% |
| UNVERIFIABLE | 894 | 12.1% |
| **Total** | **7391** | 100% |

**6497 careers (87.9%) match at least one government source.**

## Sources

| Source | Status | Notes |
|---|---|---|
| O*NET | working | Local taxonomy snapshot (1,016 occupations) plus a live page fetch per distinct SOC code. |
| CareerOneStop | working | Derived from the SOC code; CareerOneStop has a profile for every code except the "All Other" residual categories. |
| BLS OOH | **blocked** | bls.gov returns **403** to plain curl, browser-UA curl, and the OOH-SOC crosswalk page alike — the same wall the earlier BLS backfill migration documented. The only OOH signal available is the hand-verified slug→SOC crosswalk left behind by that backfill (171 occupations). |
| BLS OES | working | `api.bls.gov` national employment series by 6-digit SOC. Not OOH, but a real, checkable BLS source, so it is reported separately. |

**Do not read "BLS OOH: no" as a red flag.** OOH publishes roughly 330 occupational profiles against O*NET's 1,016, so most valid SOC codes have no OOH entry by design.

### How many careers each source confirms

| Source | Careers confirmed | % of table |
|---|---|---|
| O*NET | 6497 | 87.9% |
| CareerOneStop | 6174 | 83.5% |
| BLS OOH | 4179 | 56.5% |
| BLS OES | 6416 | 86.8% |

### Combinations

| Verified by | Careers |
|---|---|
| O*NET+CareerOneStop+BLS OOH+BLS OES | 4043 |
| O*NET+CareerOneStop+BLS OES | 2055 |
| (none) | 894 |
| O*NET+BLS OES | 208 |
| O*NET+BLS OOH+BLS OES | 110 |
| O*NET+CareerOneStop | 52 |
| O*NET+CareerOneStop+BLS OOH | 24 |
| O*NET | 3 |
| O*NET+BLS OOH | 2 |

## How the SOC code was resolved

Only 68.4% of rows carry a directly usable O*NET code, so weaker rungs were tried before giving up. The rung is recorded per row in `soc_resolved_via`.

| Rung | Careers | Meaning |
|---|---|---|
| `onet_url` | 5054 | Valid O*NET code cited directly in `source_url`. Strongest. |
| `(unresolved)` | 894 | Nothing resolved. These are the UNVERIFIABLE rows. |
| `title_exact` | 825 | bls.gov slug's occupation name matches an O*NET title exactly. |
| `onet_base` | 321 | Cited detail code does not exist, but its `.00` base does — occupation-level match. |
| `title_partial` | 292 | Slug matched an O*NET title only by word overlap. **Weakest — flagged for review.** |
| `ooh_crosswalk` | 5 | bls.gov OOH page found in the hand-verified crosswalk. |

## Why rows came out UNVERIFIABLE

| Reason | Careers |
|---|---|
| bls.gov OOH slug "…" matches no O*NET occupation title | 573 |
| cited SOC NN-NNNN.NN is not in the O*NET taxonomy, and neither is its  | 307 |
| source_url is not an O*NET or BLS OOH link: https://www.bls.gov/ooh/ed | 10 |
| source_url is not an O*NET or BLS OOH link: https://www.bls.gov/ooh/se | 3 |
| source_url is not an O*NET or BLS OOH link: https://www.bls.gov/ooh/ma | 1 |

Full list for eyeballing: `reports/PHASE4_UNVERIFIABLE_2026-08-19.csv` (894 rows).

### UNVERIFIABLE means the citation is broken, NOT that the career is fake

This is the most important result in the report. The unverifiable list includes:

**Meteorologist · Broadcast Meteorologist · Astrophysicist · Quantum Physicist · Nephrologist · Sleep Medicine Physician · Medical Laboratory Scientist · Sport Psychologist · Montessori Educator · Live Event Stage Manager**

Every one of those is a real occupation with a real SOC code. They fail verification only because their `source_url` is a fabricated bls.gov link whose slug matches no O*NET occupation title. **Hiding on this signal alone would hide Meteorologist and Astrophysicist from students.**

So the recommendation is: do not use this classification as a hide list. Re-derive the SOC from each career's own name first, then re-verify.

### How far a name-based rescue would get

Matching each unverifiable career's **own name** against the O*NET taxonomy, rather than its broken citation:

| Candidate quality | Careers | % of unverifiable |
|---|---|---|
| Full coverage (every significant word matches an O*NET title) | 115 | 12.9% |
| Strong (≥50% of words) | 313 | 35.0% |
| Weak (<50%) | 363 | 40.6% |
| No shared significant word | 103 | 11.5% |

Candidates are in `PHASE4_UNVERIFIABLE_2026-08-19.csv` (`candidate_soc`, `candidate_tier`).

**These candidates are a review queue, not a fix.** Naive name matching misfires even at full coverage — observed cases: `AI Trainer (Machine Learning)` → *Athletic Trainers*, `K-12 Science Teacher` → *Computer Science Teachers, Postsecondary*, `Quality Assurance Analyst (Lab)` → *Software Quality Assurance Analysts*, `Podcast Host` → *Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop*. Applying them unreviewed would trade broken citations for confidently wrong ones.

### Sample of the list to eyeball

A sample, chosen across the reasons above:

| Career | Current industry | Why unverifiable |
|---|---|---|
| Language Immersion Teacher | Education & Coaching | bls.gov OOH slug "high-school-teachers" matches no O*NET occupation title |
| Pharmacologist | Healthcare & Medicine | bls.gov OOH slug "pharmacologists-and-toxicologists" matches no O*NET occupation title |
| Water Conservation Specialist | Gaming & Esports | cited SOC 19-4091.00 is not in the O*NET taxonomy, and neither is its base |
| Outdoor Adventure Educator | Education & Coaching | cited SOC 27-3121.00 is not in the O*NET taxonomy, and neither is its base |
| Resort Operations Manager | Hospitality & Events | bls.gov OOH slug "general-managers-and-top-executives" matches no O*NET occupation title |
| Tourist Information Center Manager | Hospitality & Events | cited SOC 41-2081.00 is not in the O*NET taxonomy, and neither is its base |
| Indie Game Developer (Solo) | Entrepreneurship | cited SOC 15-1256.00 is not in the O*NET taxonomy, and neither is its base |
| Digital Course Creator (Standalone) | Entrepreneurship | cited SOC 27-3022.00 is not in the O*NET taxonomy, and neither is its base |
| Quality Assurance Analyst (Lab) | Science & Research | cited SOC 19-4011.00 is not in the O*NET taxonomy, and neither is its base |
| Emergency Medical Technician | Healthcare & Medicine | bls.gov OOH slug "emergency-medical-technicians-and-paramedics" matches no O*NET occupatio |
| Podcast Host (News) | Media & Journalism | bls.gov OOH slug "radio-and-television-broadcasters" matches no O*NET occupation title |
| Custom Manufacturing Startup Owner | Entrepreneurship | bls.gov OOH slug "self-employed-workers" matches no O*NET occupation title |
| AI Content Generation Entrepreneur | Entrepreneurship | bls.gov OOH slug "self-employed-workers" matches no O*NET occupation title |
| Convention & Visitors Bureau Director | Gaming & Esports | cited SOC 11-2031.00 is not in the O*NET taxonomy, and neither is its base |
| Craft Beverages Educator | Education & Coaching | cited SOC 25-1191.00 is not in the O*NET taxonomy, and neither is its base |
| Music Theory Teacher | Education & Coaching | bls.gov OOH slug "high-school-teachers" matches no O*NET occupation title |
| Content Creator (YouTube) | Marketing & Communications | bls.gov OOH slug "multimedia-artists-and-animators" matches no O*NET occupation title |
| Convention and Visitors Bureau Director | Hospitality & Events | cited SOC 11-2031.00 is not in the O*NET taxonomy, and neither is its base |
| Certified Nurse Midwife | Healthcare & Medicine | bls.gov OOH slug "nurse-midwives-and-nurse-anesthetists" matches no O*NET occupation title |
| Niche E-commerce Founder | Marketing & Communications | bls.gov OOH slug "general-managers-and-top-executives" matches no O*NET occupation title |
| Title Company Manager | Law & Government | bls.gov OOH slug "property-appraisers-and-assessors" matches no O*NET occupation title |
| Digital Video Editor | Media & Journalism | cited SOC 27-4008.00 is not in the O*NET taxonomy, and neither is its base |
| Otolaryngologist | Social Impact & Nonprofit | bls.gov OOH slug "physicians-and-surgeons" matches no O*NET occupation title |
| Sports Medicine Specialist | Sports & Fitness | bls.gov OOH slug "physicians-and-surgeons" matches no O*NET occupation title |
| Obstacle Course Race Director | Sports & Fitness | bls.gov OOH slug "sports-competitors-and-related-workers" matches no O*NET occupation titl |

## What got flagged, and why

| Flag kind | Careers |
|---|---|
| industry | 1561 |
| requirements | 628 |
| SOC resolved only by partial title match — confirm the occupation is right | 292 |

Flag rules, both deliberately conservative:

- **industry** — the SOC code's industry (via the Phase 2 mapping) overlaps neither `primary_industry` nor `secondary_industries`.
- **requirements** — the degree level asserted in the text is 2+ levels away from the one O*NET's Job Zone implies. A 1-level gap is not flagged, since Job Zones are broad.

## The `visible` column

No visibility column existed (`visible`, `is_hidden`, `hidden`, `is_visible` all absent; the table has an unrelated `reviewed` boolean).

A migration to add it is staged at `supabase/migrations/20260819000000_add_careers_visible_column.sql`. It adds `visible boolean not null default true` and nothing else — **every existing row stays visible**, and no row's visibility is set from this report.

Note the app does not read this column yet; adding it is inert until the query layer filters on it.

## Caveats

- Verification here means **"a government source recognises this occupation code"**, not "this job title is real". A career whose SOC was resolved by title match is only as right as that match.
- BLS OOH coverage is understated for the reason above; treat the OOH column as a bonus signal, not a test.
- `title_partial` rows deserve a look regardless of classification — the rung is recorded so they can be filtered.
