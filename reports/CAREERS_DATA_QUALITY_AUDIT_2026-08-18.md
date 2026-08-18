# Careers Table — Rule-Based Data-Quality Audit

Generated **2026-08-18** by `scripts/audit_data_quality.cjs` against the full `careers` table.
**Read-only:** GET requests only — no rows were created, updated, or deleted.
**No AI, no web lookups** — pure string/regex rules, every row scanned (no sampling).

- Rows scanned: **7391**
- Timestamp column available: `created_at` only (no `updated_at` on this table)
- Title field is `name`; industry fields are `primary_industry` + `secondary_industries` (comma-separated string)

---

## 1. Duplicate / templated `requirements` text

Exact-match grouping on trimmed `requirements`. Threshold: shared by **more than 3** careers.

- Distinct `requirements` values overall: **7384**
- Values shared by >3 careers: **0**
- Careers sitting on one of those values: **0** (0.0% of table)

**No `requirements` value is shared by more than 3 careers.** This is a real result, not an empty query — verified independently: the most any single value is shared by is **2** careers, and only 7 values are shared by more than one career at all. Normalizing case, punctuation and whitespace does not change this.

### 1b. Near-duplicate `requirements` (supplementary)

Exact matching answers the question as asked, but it cannot see this pair, which is plainly the same template:

> Bachelor's degree in journalism, communications, or related field preferred; strong research skills and famili…
> A bachelor's degree in journalism, communications, or a related field is preferred; strong research skills and…

So the same grouping was re-run on a normalized signature — the first 8 content words after dropping punctuation and stopwords — to catch templates that differ only in phrasing. Threshold is still >3 careers.

- Near-duplicate groups (>3 careers sharing an opening): **161**
- Careers involved: **1124** (15.2% of table)

| Careers sharing | Normalized opening (first 8 content words) | Sample titles |
|---|---|---|
| 32 | bachelor s degree journalism communications related field preferred | Fact-Checking Journalist; Data Journalism Reporter; Grant Reporter |
| 26 | portfolio demonstrating design skills essential degree graphic design | Publication Designer (Print & Digital); Package Labeling Designer; Art Director (Publishing) |
| 20 | earn bachelor s degree complete law school j | Deputy District Attorney; Tax Law Specialist; Municipal Bond Lawyer |
| 19 | bachelor s degree business finance related field preferred | Revenue Operations Manager; Franchise Development Manager; Nonprofit Risk Manager |
| 18 | bachelor s degree finance business economics required mba | Merger and Acquisition Specialist; Private Equity Analyst; Mergers and Acquisitions Specialist |
| 18 | bachelor s degree education instructional design related field | Blended Learning Specialist; Online Learning Specialist; Online Curriculum Designer |
| 18 | bachelor s degree computer science related field common | Software Engineer (Full Stack); Full-Stack Developer; Software Engineer Manager |
| 17 | bachelor s degree computer science engineering related field | Computer Vision Engineer; Data Pipeline Engineer; Payment Systems Architect |
| 16 | high school diploma minimum bachelor s degree hospitality | Resort Operations Manager; Wedding Planner (Destination Events); Conference Planner (Corporate) |
| 15 | bachelor s degree business entrepreneurship related field preferred | Franchise Architect; Business Incubator Mentor; Business Incubator Director |
| 15 | bachelor s degree nonprofit management business related field | Grant Administration Manager; Volunteer Coordinator (Nonprofit); Nonprofit Board Development Director |
| 15 | bachelor s degree journalism communications related field common | Corrections Journalist; Social Media Manager (News Organizations); Investigative Researcher |
| 14 | bachelor s degree business nonprofit management related field | Grant Manager (Nonprofit); Equitable Procurement Specialist; Nonprofit Board Secretary |
| 14 | bachelor s degree computer science related field preferred | DevOps Engineer; Platform Engineer; Quality Assurance Automation Tester |
| 13 | bachelor s degree chemistry chemical engineering cosmetic science | Skincare Formulation Chemist; Cosmetics Formulation Scientist; Skincare Chemist |
| 13 | bachelor s degree accounting finance required cpa certified | Audit Manager; Corporate Comptroller; Accounting Manager |
| 12 | earn bachelor s degree complete law school 3 | Defense Attorney; Copyright Lawyer; Contract Attorney |
| 12 | bachelor s degree environmental science engineering related field | Water Conservation Specialist; Environmental Compliance Manager; Renewable Energy Consultant |
| 12 | bachelor s degree computer science software engineering related | Fitness Technology Developer; Insurance Technology Developer; Civic Tech Developer |
| 11 | bachelor s degree accounting finance related field cpa | Corporate Finance Controller; Forensic Accountant; Government Auditor |
| 11 | earn bachelor s degree complete law school jd | Environmental Compliance Attorney; Patent Lawyer; Corporate Tax Attorney |
| 11 | bachelor s degree life sciences chemistry related field | Regulatory Affairs Specialist (Science); Research Protocol Specialist; Medical Writer (Clinical Trials) |
| 11 | bachelor s degree nonprofit management social work public | Social Justice Program Director; Social Justice Program Coordinator; Community Benefit Specialist |
| 11 | bachelor s degree computer science cybersecurity related field | Product Security Engineer; Vulnerability Researcher; Biometric Security Specialist |
| 10 | bachelor s degree education business related field preferred | Tutoring Program Director; Professional Development Trainer; Tutoring Center Director |

_…and 136 more groups (see `careers_near_dup_requirements.csv`)._

These are **not** counted in the headline flagged total below, which stays faithful to the exact-match definition in the original request. Treat 1b as the more realistic estimate of templating.

---

## 2. Industry / title keyword mismatch

159 keyword rules across the 22 industries. Each keyword lists every industry that would make it consistent; a row is flagged only when the **strongest** matching keyword overlaps **none** of `primary_industry` ∪ `secondary_industries`.

Confidence tiers:

| Tier | Meaning |
|---|---|
| HIGH | Strong keyword (weight ≥8) matched in the **title** |
| MEDIUM | Weaker/ambiguous keyword matched in the **title** |
| LOW | Keyword matched only in the **description** |

- Total rows flagged: **495** (6.7% of table)
- HIGH: **187** · MEDIUM: **34** · LOW: **274**

Top offenders by match strength (full list in `careers_flagged_industry_mismatch.csv`):

| Tier | Career (`name`) | Keyword | Found in | Assigned primary | Assigned secondary | Expected any of |
|---|---|---|---|---|---|---|
| HIGH | Aerospace Supply Chain Risk Analyst | `Supply Chain` | title | Aviation & Transportation | Business & Finance,Tech & Engineering | Supply Chain & Operations |
| HIGH | Anesthesiologist Assistant | `Anesthesiologist` | title | Arts & Performance | Media & Journalism,Design & Creative,Science & Research | Healthcare & Medicine |
| HIGH | Artisanal Bread Baker | `Baker` | title | Entrepreneurship | Hospitality & Events,Design & Creative | Food & Culinary |
| HIGH | Baker (Specialty/Artisanal) | `Baker` | title | Hospitality & Events | Entrepreneurship,Design & Creative | Food & Culinary |
| HIGH | Boutique Hotel Owner | `Hotel` | title | Marketing & Communications | Business & Finance,Design & Creative,Science & Research | Hospitality & Events |
| HIGH | Brewery Operations Manager | `Brewery` | title | Entrepreneurship | Business & Finance,Hospitality & Events | Food & Culinary |
| HIGH | Cinematographer | `Cinematograph` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Marketing & Commun… | Media & Journalism / Arts & Performance |
| HIGH | Commercial Pilot | `Pilot` | title | Business & Finance | Tech & Engineering,Law & Government | Aviation & Transportation / Sports & Fitness |
| HIGH | Commercial Underwriter | `Underwriter` | title | Media & Journalism | Marketing & Communications,Arts & Performance,Science & Res… | Business & Finance |
| HIGH | Community Health Nurse | `Nurse` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Education & C… | Healthcare & Medicine |
| HIGH | Cosmetologist | `Cosmetolog` | title | Supply Chain & Operations | Business & Finance,Tech & Engineering,Science & Research | Fashion & Beauty / Healthcare & Medicine |
| HIGH | Cosmetology Salon Owner | `Cosmetolog` | title | Entrepreneurship | Business & Finance,Tech & Engineering,Architecture & Urban … | Fashion & Beauty / Healthcare & Medicine |
| HIGH | Cost Accountant | `Accountant` | title | Arts & Performance | Media & Journalism,Design & Creative,Science & Research | Business & Finance |
| HIGH | Craft Beer Brewery Owner | `Brewery` | title | Entrepreneurship | Business & Finance,Hospitality & Events | Food & Culinary |
| HIGH | Craft Brewery Owner | `Brewery` | title | Marketing & Communications | Business & Finance,Design & Creative,Media & Journalism | Food & Culinary |
| HIGH | Elementary School Teacher | `Teacher` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Architecture … | Education & Coaching |
| HIGH | Emergency Room Physician | `Physician` | title | Cybersecurity | Tech & Engineering,Law & Government,Science & Research | Healthcare & Medicine |
| HIGH | Environmental Graphic Designer (Interior) | `Graphic Design` | title | Environment & Sustainability | Science & Research,Law & Government,Tech & Engineering | Design & Creative / Marketing & Communications / Media & Journalism |
| HIGH | ESL (English as Second Language) Teacher | `Teacher` | title | Environment & Sustainability | Science & Research,Law & Government,Architecture & Urban Pl… | Education & Coaching |
| HIGH | Event Planner | `Event Planner` | title | Supply Chain & Operations | Business & Finance,Tech & Engineering,Science & Research | Hospitality & Events / Marketing & Communications |
| HIGH | Exhibition Graphic Designer | `Graphic Design` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Architecture & Urb… | Design & Creative / Marketing & Communications / Media & Journalism |
| HIGH | Financial Analyst | `Financial Analyst` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Arts & Performance | Business & Finance |
| HIGH | Forensic Accountant | `Accountant` | title | Cybersecurity | Tech & Engineering,Law & Government,Science & Research | Business & Finance |
| HIGH | Forensic Nurse | `Nurse` | title | Cybersecurity | Tech & Engineering,Law & Government,Science & Research | Healthcare & Medicine |
| HIGH | Hairstylist (Specialty Cuts) | `Hairstylist` | title | Environment & Sustainability | Science & Research,Law & Government,Tech & Engineering | Fashion & Beauty |
| HIGH | Hotel Digital Marketing Manager | `Hotel` | title | Marketing & Communications | Business & Finance,Design & Creative,Science & Research | Hospitality & Events |
| HIGH | Hotel Event Manager | `Hotel` | title | Supply Chain & Operations | Business & Finance,Tech & Engineering,Science & Research | Hospitality & Events |
| HIGH | Hotel Sustainability Coordinator | `Hotel` | title | Supply Chain & Operations | Business & Finance,Tech & Engineering,Science & Research | Hospitality & Events |
| HIGH | Insurance Risk Underwriter | `Underwriter` | title | Media & Journalism | Marketing & Communications,Arts & Performance,Science & Res… | Business & Finance |
| HIGH | Insurance Underwriter | `Underwriter` | title | Media & Journalism | Marketing & Communications,Arts & Performance,Science & Res… | Business & Finance |
| HIGH | Investigative Journalist | `Journalist` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Arts & Performance | Media & Journalism |
| HIGH | Large Animal Veterinarian | `Veterinarian` | title | Hospitality & Events | Food & Culinary,Marketing & Communications | Healthcare & Medicine / Science & Research |
| HIGH | Local Food Supply Chain Founder | `Supply Chain` | title | Entrepreneurship | Environment & Sustainability,Business & Finance | Supply Chain & Operations |
| HIGH | Music Journalist | `Journalist` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Arts & Performance | Media & Journalism |
| HIGH | Nonprofit Accountant | `Accountant` | title | Social Impact & Nonprofit | Education & Coaching,Law & Government,Science & Research | Business & Finance |
| HIGH | Nonprofit Financial Analyst | `Financial Analyst` | title | Social Impact & Nonprofit | Education & Coaching,Law & Government,Science & Research | Business & Finance |
| HIGH | Occupational Health Nurse | `Nurse` | title | Hospitality & Events | Food & Culinary,Marketing & Communications | Healthcare & Medicine |
| HIGH | Occupational Health Physician | `Physician` | title | Hospitality & Events | Food & Culinary,Marketing & Communications | Healthcare & Medicine |
| HIGH | Occupational Sports Medicine Physician | `Physician` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Media & Journ… | Healthcare & Medicine |
| HIGH | Performance Coach for Musicians | `Musician` | title | Sports & Fitness | Healthcare & Medicine,Marketing & Communications,Science & … | Arts & Performance |
| HIGH | Performer Coach | `Performer` | title | Supply Chain & Operations | Business & Finance,Tech & Engineering,Architecture & Urban … | Arts & Performance / Sports & Fitness |
| HIGH | Pipe Organ Builder | `Organ Builder` | title | Tech & Engineering | Business & Finance,Design & Creative | Arts & Performance |
| HIGH | Prosecutor | `Prosecutor` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Social Impact… | Law & Government |
| HIGH | Public Health Nurse | `Nurse` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Science & Res… | Healthcare & Medicine |
| HIGH | Referee | `Referee` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Science & Res… | Sports & Fitness |
| HIGH | Referee and Umpire Coordinator | `Referee` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Science & Res… | Sports & Fitness |
| HIGH | Referee/Umpire | `Referee` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Science & Res… | Sports & Fitness |
| HIGH | Regenerative Supply Chain Manager | `Supply Chain` | title | Environment & Sustainability | Business & Finance,Science & Research | Supply Chain & Operations |
| HIGH | Reinsurance Underwriter | `Underwriter` | title | Science & Research | Healthcare & Medicine,Tech & Engineering | Business & Finance |
| HIGH | Renewable Energy Supply Chain Manager | `Supply Chain` | title | Environment & Sustainability | Business & Finance,Tech & Engineering | Supply Chain & Operations |
| HIGH | Research Pilot (Flight Testing) | `Pilot` | title | Science & Research | Tech & Engineering,Entrepreneurship | Aviation & Transportation / Sports & Fitness |
| HIGH | Social Impact Journalist | `Journalist` | title | Social Impact & Nonprofit | Education & Coaching,Law & Government,Science & Research | Media & Journalism |
| HIGH | Sound Designer (Live Theater) | `Sound Designer` | title | Science & Research | Healthcare & Medicine,Tech & Engineering,Architecture & Urb… | Arts & Performance / Media & Journalism / Gaming & Esports |
| HIGH | Sound Designer (Theater) | `Sound Designer` | title | Sports & Fitness | Healthcare & Medicine,Marketing & Communications,Architectu… | Arts & Performance / Media & Journalism / Gaming & Esports |
| HIGH | Sports Medicine Physician | `Physician` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Media & Journ… | Healthcare & Medicine |
| HIGH | Sports Physician | `Physician` | title | Gaming & Esports | Tech & Engineering,Marketing & Communications,Media & Journ… | Healthcare & Medicine |
| HIGH | Supply Chain Finance Analyst | `Supply Chain` | title | Business & Finance | Tech & Engineering,Entrepreneurship | Supply Chain & Operations |
| HIGH | Supply Chain Finance Specialist | `Supply Chain` | title | Business & Finance | Tech & Engineering,Entrepreneurship | Supply Chain & Operations |
| HIGH | Supply Chain Financing Specialist | `Supply Chain` | title | Business & Finance | Entrepreneurship,Tech & Engineering | Supply Chain & Operations |
| HIGH | Supply Chain Manager | `Supply Chain` | title | Business & Finance | Entrepreneurship,Tech & Engineering | Supply Chain & Operations |

_…and 435 more (see CSV)._

Which keywords drive the flags (a big count here can mean a real systematic mistag **or** an over-broad rule — worth checking first in the follow-up):

| Keyword | Rows flagged |
|---|---|
| `Logistics` | 93 |
| `Developer` | 30 |
| `Supply Chain` | 25 |
| `Investment` | 20 |
| `Nonprofit` | 19 |
| `Theater` | 19 |
| `Marketing` | 15 |
| `Patient` | 13 |
| `Fashion` | 12 |
| `Coach` | 11 |
| `Hospital` | 11 |
| `Fitness` | 10 |
| `Sustainability` | 10 |
| `Performer` | 9 |
| `Software` | 9 |
| `Hotel` | 8 |
| `Journalist` | 8 |
| `Auditor` | 8 |
| `Broadcast` | 8 |
| `Medical` | 8 |
| `Programmer` | 7 |
| `Actor` | 7 |
| `Inspector` | 7 |
| `Athletic` | 6 |
| `Makeup` | 6 |
| `Underwriter` | 5 |
| `Nurse` | 5 |
| `Accountant` | 5 |
| `Physician` | 5 |
| `Editor` | 5 |

---

## 3. Import batch / date correlation

Flagged = union of #1 and #2, deduplicated by `id`. Bucketed by `created_at` month.

| Month | Total careers | Flagged (any) | Flagged % | #1 dup requirements | #2 industry mismatch |
|---|---|---|---|---|---|
| 2026-04 | 3219 | 317 | 9.8% | 0 | 317 |
| 2026-05 | 1391 | 52 | 3.7% | 0 | 52 |
| 2026-06 | 1182 | 60 | 5.1% | 0 | 60 |
| 2026-07 | 913 | 41 | 4.5% | 0 | 41 |
| 2026-08 | 686 | 25 | 3.6% | 0 | 25 |
| **All** | **7391** | **495** | **6.7%** | **0** | **495** |

Highest flag rates (months with ≥20 rows, so a tiny batch can't top the list on one bad row):

- **2026-04** — 9.8% (317/3219)
- **2026-06** — 5.1% (60/1182)
- **2026-07** — 4.5% (41/913)
- **2026-05** — 3.7% (52/1391)
- **2026-08** — 3.6% (25/686)

Largest absolute contributors of flagged rows:

- **2026-04** — 317 flagged rows (9.8% of that month's 3219)
- **2026-06** — 60 flagged rows (5.1% of that month's 1182)
- **2026-05** — 52 flagged rows (3.7% of that month's 1391)
- **2026-07** — 41 flagged rows (4.5% of that month's 913)
- **2026-08** — 25 flagged rows (3.6% of that month's 686)

### 3b. Insert batches (exact `created_at` timestamps)

Month buckets are coarse, so the same grouping was run on the exact `created_at` value — rows sharing a microsecond-precision timestamp were written by one insert call.

- Distinct `created_at` timestamps: **4883** across 7391 rows
- Insert batches of ≥50 rows sharing one timestamp: **25**

Those large batches carry flag rates from **6.0%** to **16.0%** — the damage is spread across the batches, not isolated to one bad insert.

| `created_at` | Rows in batch | Flagged | Flagged % |
|---|---|---|---|
| 2026-04-22T02:52:29.206458+00:00 | 100 | 6 | 6.0% |
| 2026-04-22T02:52:29.422718+00:00 | 100 | 11 | 11.0% |
| 2026-04-22T02:52:29.646164+00:00 | 100 | 10 | 10.0% |
| 2026-04-22T02:52:29.856816+00:00 | 100 | 7 | 7.0% |
| 2026-04-22T02:52:30.082186+00:00 | 100 | 11 | 11.0% |
| 2026-04-22T02:52:30.264317+00:00 | 100 | 9 | 9.0% |
| 2026-04-22T02:52:30.47108+00:00 | 100 | 13 | 13.0% |
| 2026-04-22T02:52:30.655222+00:00 | 100 | 11 | 11.0% |
| 2026-04-22T02:52:31.20659+00:00 | 100 | 14 | 14.0% |
| 2026-04-22T02:52:31.392704+00:00 | 100 | 8 | 8.0% |
| 2026-04-22T02:52:31.660242+00:00 | 100 | 15 | 15.0% |
| 2026-04-22T02:52:31.845128+00:00 | 100 | 14 | 14.0% |
| 2026-04-22T02:52:32.086589+00:00 | 100 | 9 | 9.0% |
| 2026-04-22T02:52:32.271017+00:00 | 100 | 13 | 13.0% |
| 2026-04-22T02:52:32.496342+00:00 | 100 | 7 | 7.0% |
| 2026-04-22T02:52:32.680575+00:00 | 100 | 11 | 11.0% |
| 2026-04-22T02:52:32.905098+00:00 | 100 | 16 | 16.0% |
| 2026-04-22T02:52:33.087307+00:00 | 100 | 11 | 11.0% |
| 2026-04-22T02:52:33.295118+00:00 | 100 | 10 | 10.0% |
| 2026-04-22T02:52:33.477982+00:00 | 100 | 12 | 12.0% |

_…and 5 more large batches (see `careers_flagged_by_insert_batch.csv`)._

### 3c. Repeated `secondary_industries` strings among mismatched rows

If industries had been chosen per career, the secondary tags on mismatched rows would vary. They don't — the same exact triples recur, which points at a systematic default rather than per-career error:

| Times repeated | `secondary_industries` value |
|---|---|
| 47 | Tech & Engineering,Marketing & Communications,Science & Research |
| 22 | Business & Finance,Tech & Engineering,Science & Research |
| 19 | Healthcare & Medicine,Tech & Engineering,Architecture & Urban Planning |
| 17 | Business & Finance,Tech & Engineering |
| 17 | Business & Finance,Design & Creative |
| 16 | Tech & Engineering,Marketing & Communications,Architecture & Urban Planning |
| 12 | Tech & Engineering,Business & Finance |
| 11 | Business & Finance,Design & Creative,Science & Research |

---

## Summary

| Metric | Value |
|---|---|
| Total careers in table | **7391** |
| Flagged by #1 (templated requirements) | 0 |
| Flagged by #2 (industry mismatch) | 495 |
| Flagged by both | 0 |
| **Unique careers flagged by #1 or #2** | **495** |
| **% of table flagged** | **6.7%** |
| _(supplementary)_ near-duplicate requirements — §1b, not in the total above | 1124 (15.2%) |
| _(supplementary)_ union incl. near-duplicates | 1527 (20.7%) |

**Highest-concentration period:** 2026-04 at 9.8% flagged (317/3219).

### Caveats

- Section 1 is exact-match only. Near-duplicate `requirements` that differ by a word or two are **not** counted here, so the true templating rate is higher than the number above.
- Section 2 is keyword heuristics, not judgment. LOW-tier rows especially will contain legitimate careers whose description merely mentions a keyword. Treat the tiers as a triage order for the AI-verified pass, not as confirmed errors.
- A row can be flagged in section 2 for a keyword that is genuinely peripheral to the job; conversely a mistag with no keyword signal is invisible to this pass.

### Files written

- `reports/CAREERS_DATA_QUALITY_AUDIT_2026-08-18.md` — this report
- `reports/careers_dup_requirements_groups.csv` — one row per duplicated `requirements` value
- `reports/careers_flagged_dup_requirements.csv` — every career sharing a duplicated value
- `reports/careers_flagged_industry_mismatch.csv` — every keyword-mismatch flag
- `reports/careers_flagged_union.csv` — deduplicated flagged subset for the follow-up pass
- `reports/careers_near_dup_requirements.csv` — section 1b near-duplicate groups
- `reports/careers_flagged_by_insert_batch.csv` — section 3b per-insert-batch flag rates
- `reports/careers_flagged_by_month.csv` — section 3 table as data
