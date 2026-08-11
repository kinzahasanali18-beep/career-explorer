# Careers table — data quality audit

**Scope:** industry-tag accuracy and early-career salary accuracy.
**Sample:** 75 of 7,016 rows — 25 uniformly at random (seed `20260809`, drawn from the 6,966 rows outside the recent bucket) plus the 50 most recently created.
**Database was not modified.** All access was read-only `GET` via PostgREST.

---

## Method and its limits — read this before the numbers

**Industry tags: full coverage.** All 75 were assessed by reading each record's title, description and tag list together. No external source is needed to judge whether "Gaming & Esports" fits an adaptive-sports coach.

**Salaries: partial coverage, and deliberately biased.** 22 of 75 roles were checked against 2–3 real sources. I triaged — searching roles whose floors looked suspicious plus a set of controls to calibrate. That is efficient for *finding* errors but means **the salary hit-rate cannot be extrapolated**, because the denominator isn't random. Every salary row below cites what was actually checked. The other 53 were compared against known BLS occupational ranges without an individual search, and are not claimed as verified.

**The two buckets are not interchangeable.** They turned out to be structurally different populations:

| | `recent50` | `random25` |
|---|---|---|
| created | 2026-08-07 → 08-09 | 2026-04-22 → 08-06 |
| secondary tags | 48/50 have exactly 2 | mixed: 18×2, 7×3 |
| industry issues found | **2 / 50 (4%)** | **9 / 25 (36%)** |

Rows created on/after 2026-08-07 number just **131 of 7,016 (1.9%)**, so `recent50` samples 38% of one small, recent, uniform batch. `random25` is the only bucket that represents the table. All extrapolation below uses `random25` alone.

**Table age distribution:** April 3,219 · May 1,391 · June 1,182 · July 913 · August 311. Roughly 46% of the table came from one April bulk import.

---

# Clearly wrong

## Industry tags

| Career | Current tags | What's wrong | Suggested correction |
|---|---|---|---|
| **Disability Sports Specialist** | primary **Gaming & Esports**; secondary Tech & Engineering, Marketing & Communications, Science & Research | All four tags are wrong. Description: *"design and deliver adaptive sports programs… tailored coaching and equipment modifications."* Nothing to do with gaming, marketing or research. Reads as tags lifted from an unrelated record. | primary **Sports & Fitness**; secondary Healthcare & Medicine, Education & Coaching |
| **Corporate Events Director** | primary **Supply Chain & Operations**; secondary Business & Finance, Tech & Engineering, Science & Research | Description is verbatim event management: *"corporate conferences, galas… venue selection to vendor coordination."* **Direct contradiction inside the table:** `Corporate Events Planner` — near-identical description — is correctly `Hospitality & Events`. | primary **Hospitality & Events**; secondary Business & Finance, Design & Creative (mirroring the Planner record) |
| **Commercial Insurance Adjuster** | primary **Healthcare & Medicine**; secondary Science & Research, Tech & Engineering | Insurance claims work is a finance occupation (BLS classifies it under Business and Financial Operations). The description's passing mention of *"reviewing medical records"* is the likely cause of the mis-tag. **Direct contradiction:** `Crop Insurance Adjuster` is correctly `Business & Finance`. | primary **Business & Finance**; secondary Law & Government, Healthcare & Medicine |
| **Sustainable Fashion Brand Founder** | primary **Marketing & Communications**; secondary Business & Finance, Design & Creative, Science & Research | Description is *"design and launch eco-friendly clothing lines… manage production partnerships."* That's fashion and entrepreneurship; marketing is at most incidental, and Science & Research doesn't apply. Notably **Environment & Sustainability is missing** from a role defined by it. | primary **Fashion & Beauty**; secondary Entrepreneurship, Environment & Sustainability, Design & Creative |
| **Gifted Education Coordinator** | primary **Social Impact & Nonprofit**; secondary Education & Coaching, Law & Government, Science & Research | This is a K-12 school role — *"design advanced learning programs… coaching teachers."* Education is demoted to secondary while a nonprofit tag leads. Law & Government and Science & Research are unsupported. | primary **Education & Coaching**; secondary Social Impact & Nonprofit |

## Early-career salary

| Career | Listed | What's wrong | Suggested correction | Sources checked |
|---|---|---|---|---|
| **UX Writing Director** | `$95k–$150k` | Floor is roughly **40% below** market for a director-level content design role, and the ceiling is below the *median*. Director-level content design runs $160k–$250k+; a Google L4 content designer alone is $180–210k total comp. | `$150k–$250k` | [UX Writing Hub Content Design Salary Report 2026](https://uxwritinghub.com/content-design-salary-report-2026/); [Levels.fyi](https://www.levels.fyi/companies/linkedin/salaries/product-designer/title/ux-designer); [2026 UX Salary Report, User Interviews](https://www.userinterviews.com/ux-salary-report) |
| **Corporate Events Director** | `$45k–$75k` | Floor is **~50% below** reality and the ceiling sits below every source's average. Glassdoor puts Corporate Events Director at $114,184 average; Indeed's Director of Events $87,477; Salary.com's Director, Events $125,138. The `$45k–$75k` band matches an events *coordinator*, not a director. | `$75k–$140k` | [Glassdoor](https://www.glassdoor.com/Salaries/corporate-events-director-salary-SRCH_KO0,25.htm); [Indeed](https://www.indeed.com/career/director-of-events/salaries); [Salary.com](https://www.salary.com/research/salary/listing/director-events-salary) |
| **Research Data Architect** | `$70k–$130k` | Floor is **below the BLS 10th percentile** ($81,630) for database architects, whose median is $135,980. Entry-level data architect median is $87,690. The listed ceiling is roughly the occupation's median. | `$85k–$170k` | [BLS OOH, database architects](https://www.bls.gov/ooh/); [Salary.com, entry data architect](https://www.salary.com/research/salary/alternate/entry-data-architect-salary); [Coursera 2026 guide](https://www.coursera.org/articles/data-architect-salary) |
| **Parole Officer** | `$35k–$65k` | Floor is **below the BLS 10th percentile** (~$42k) against a median of $61,800 — meaning the listed floor is beneath what the bottom-earning 10% of the occupation makes. The listed ceiling is barely above the median. | `$42k–$95k` | [BLS OES, probation officers](https://www.bls.gov/oes/); [Salary.com](https://www.salary.com/research/salary/benchmark/parole-officer-salary); [Glassdoor](https://www.glassdoor.com/Salaries/probation-and-parole-officer-salary-SRCH_KO0,28.htm) |

---

# Worth a second look

## Industry tags

| Career | Current tags | Concern | Suggested correction |
|---|---|---|---|
| **Telemedicine Platform Engineer** | primary Healthcare & Medicine; secondary Science & Research, Tech & Engineering, **Architecture & Urban Planning** | Architecture & Urban Planning is unrelated to a software role. Arguable that Tech & Engineering should lead, given the description is *"design and maintain the digital platforms."* | Drop Architecture; consider promoting Tech & Engineering to primary |
| **Visualization Designer** | primary Science & Research; secondary Healthcare & Medicine, Tech & Engineering, **Architecture & Urban Planning** | Same stray Architecture tag. Description — *"transform complex data into stunning visual stories"* — is design-led, yet Design & Creative is absent entirely. | primary Design & Creative; secondary Science & Research, Tech & Engineering |
| **Curriculum Vitae Designer** | primary Education & Coaching; secondary Design & Creative, Business & Finance | A résumé/CV design service is a design or career-services business. "Curriculum" in the title may have driven an automated match to Education. | primary Design & Creative; secondary Business & Finance |
| **Performance Rights Lawyer** | primary Arts & Performance; secondary Business & Finance, **Law & Government** | The role is practising law — negotiating licensing, defending copyright infringement — but Law & Government is ranked third. Defensible as sector-first tagging; inconsistent with how other legal roles in the table are tagged. | Promote Law & Government to primary; keep Arts & Performance secondary |
| **Immigration Caseworker** | primary Social Impact & Nonprofit; secondary Law & Government, **Healthcare & Medicine** | Healthcare is a stretch for a role described as guiding clients through legal processes and connecting them to resources. | Replace Healthcare with Education & Coaching, or drop to two tags |
| **University Professor (Adjunct)** | primary Education & Coaching; secondary Science & Research, **Media & Journalism** | Media & Journalism doesn't follow from the description. Adjuncts teach across all disciplines, so a single field tag is arbitrary. | Drop Media & Journalism |

## Early-career salary

| Career | Listed | Concern | Suggested correction | Sources checked |
|---|---|---|---|---|
| **Acoustic Environment Designer** | `$50k–$85k` | Floor sits **$10k below** the entry-level base range for acoustical engineers ($60k–$71k, average $67,289). Overall averages run $86k–$107k. | `$62k–$110k` | [PayScale, entry-level acoustical engineer](https://www.payscale.com/research/US/Job=Acoustical_Engineer/Salary/2347ddf7/Entry-Level); [Salary.com](https://www.salary.com/research/salary/listing/acoustical-engineer-salary); [ZipRecruiter](https://www.ziprecruiter.com/Salaries/Acoustical-Consultant-Salary) |
| **Solar Installation Inspector** | `$50k–$85k` | Floor is **below the BLS 25th percentile** ($57,300) for construction and building inspectors, median $72,120. No solar-specific BLS category exists, so this is the closest proxy. | `$57k–$95k` | [BLS OOH, construction and building inspectors](https://www.bls.gov/ooh/construction-and-extraction/construction-and-building-inspectors.htm); [US News Best Jobs](https://careers.usnews.com/best-jobs/construction-and-building-inspector/salary) |
| **Fashion Forecast Analyst** | `$48k–$85k` | Floor is below every entry-level figure found: $50k–$60k median entry from one source, $58k–$79k base from another, against a $66,891 overall average. | `$55k–$95k` | [Salary.com, fashion trend analyst](https://www.salary.com/research/salary/hiring/fashion-trend-analyst-salary); [JobCannon](https://jobcannon.io/careers/fashion-forecaster-trend-analyst); [Yellowbrick](https://www.yellowbrick.co/blog/fashion-business/fashion-trend-forecaster-salary-how-much-do-they-earn) |
| **Crisis Communications Manager** | `$65k–$120k` | Ambiguous, which is why it's here rather than above. Against BLS *PR managers* (median $132,870, 10th pct $73,700) the floor is too low and the ceiling well short. Against *communications managers* (median $84,058, 10th pct $60,000) it's about right. Depends which level the entry is meant to describe. | Decide the seniority, then either `$74k–$180k` (manager) or leave as-is (specialist) | [BLS via Research.com, PR managers](https://research.com/advice/highest-paying-jobs-you-can-get-with-a-public-relations-degree); [Daybook, communications manager](https://www.daybook.com/career-research/communications/communications-manager) |
| **Commercial Lender** | `$55k–$95k` | Sources disagree sharply — PayScale entry $54,666 supports the floor, while Salary.com's Commercial Loan Officer I is $65,715 and ZipRecruiter's entry-level figure is $102,331. Likely low, but not clear-cut. | Verify against a fourth source before changing | [Salary.com](https://www.salary.com/research/salary/benchmark/commercial-loan-officer-i-salary); [PayScale](https://www.payscale.com/research/US/Job=Loan_Officer%2C_Commercial/Salary/c1baff1a/Entry-Level); [ZipRecruiter](https://www.ziprecruiter.com/Salaries/Entry-Level-Commercial-Loan-Officer-Salary) |

### One error in the opposite direction

| Career | Listed | Concern | Sources checked |
|---|---|---|---|
| **University Professor (Adjunct)** | `$35k–$65k` | The floor looks **too high**, not too low. Adjuncts are paid per course — median ~$4,998 per term for a light load — and many earn $20k–$30k a year in total. Aggregator averages ($49k–$140k) are inflated because they blend adjuncts with full-time and tenure-track faculty. A student reading `$35k` as the floor would be misled about the worst case. | [PayScale](https://www.payscale.com/research/US/Job=Adjunct_Professor/Salary); [Salary.com](https://www.salary.com/research/salary/hiring/part-time-adjunct-professor-salary); [OpenLecture analysis](https://www.openlecture.com/blog/adjunct-professor-salary) |

---

## Checked and found accurate

Verified against sources and **not** flagged, listed so the negative results are visible:

Film Editor (`$55k–$95k` vs BLS median $70,980, 10th pct $39,170) · Biomechanist, Sports (`$50k–$85k` vs $50,654 average, 25th pct $40k) · Textile Engineer (`$55k–$90k` vs entry range $51.5k–$78.5k) · Casino Hospitality Manager (`$40k–$65k` vs 25th pct $35k, median ~$58k) · Laboratory Animal Care Specialist (`$30k–$45k` vs entry $30k–$40k) · Gallery Installation Director (`$40k–$75k` vs entry preparator $40,879) · Curator, Digital Collections (`$45k–$75k` vs entry archivist $40k–$55k) · Commercial Insurance Adjuster salary (`$55k–$85k` vs BLS 10th pct $47,810, entry $50k–$65k) · Pension Plan Consultant (`$65k–$120k` vs entry $56,725, 25th pct $62k) · Fact-Checker (`$48k–$77k` vs entry $51,732) · Performance Rights Lawyer (`$70k–$150k` vs entry entertainment law $65k–$85k)

---

## Structural patterns worth acting on

**1. Newer records are dramatically cleaner.** 4% industry-issue rate in the August batch versus 36% in the random sample. The August rows also have a uniform shape (48/50 with exactly two secondary tags) while older rows scatter between two and three. Whatever changed in the generation process between April and August worked — but it only covers 131 rows.

**2. Two pairs of near-identical careers are tagged differently.** `Corporate Events Planner` → Hospitality & Events, but `Corporate Events Director` → Supply Chain & Operations. `Crop Insurance Adjuster` → Business & Finance, but `Commercial Insurance Adjuster` → Healthcare & Medicine. Both pairs can be found automatically, and they're strong evidence the tags were machine-assigned without a consistency pass.

**3. Two records carry a stray "Architecture & Urban Planning" tag** on unrelated roles (Telemedicine Platform Engineer, Visualization Designer) — both 3-tag records. Worth checking whether the third tag is systematically noisier than the first two across the whole table; if so, older 3-tag rows are the cheapest place to look for more.

**4. Senior job titles carry junior salary bands.** Every clearly-wrong salary was a "Director" or "Architect" role priced as an individual contributor: UX Writing Director, Corporate Events Director, Research Data Architect. A query for rows whose title contains Director/Head/Chief/Architect/Principal with a floor under ~$70k would likely surface most of the remaining cases cheaply.

**5. Salary floors below the BLS 10th percentile** are objectively checkable without human judgement, and two of the four clear errors were exactly that.

---

## Counts

| | `recent50` | `random25` | Total (of 75) |
|---|---|---|---|
| Industry tag issues | 2 | 9 | **11** |
| — clearly wrong | 0 | 5 | 5 |
| — worth a second look | 2 | 4 | 6 |
| Salary issues | 5 | 4 | **9** |
| — clearly wrong | 2 | 2 | 4 |
| — worth a second look | 3 | 2 | 5 |
| Rows with at least one issue | 6 | 12 | **18** |

Industry counts cover all 75. Salary counts cover the 22 roles individually source-checked; the remaining 53 were not verified and may contain further errors.

## Extrapolation to the full table

**Only `random25` supports extrapolation** — `recent50` samples a 131-row batch that is 1.9% of the table and demonstrably higher quality.

**Industry tags — reasonably supported.** 9/25 = 36% with at least one questionable tag; 5/25 = 20% clearly wrong.

| | point estimate | 95% CI (Wilson) | rows of 7,016 |
|---|---|---|---|
| at least one questionable tag | 36% | 20.2% – 55.5% | **~2,530** (1,420 – 3,890) |
| clearly wrong | 20% | 8.9% – 39.1% | **~1,400** (620 – 2,750) |

The intervals are wide because n=25. Treat "roughly 1,400–3,900 rows need a tag review, of which perhaps 600–2,700 are outright wrong" as the honest reading. A follow-up sample of 100–150 random rows would narrow this enough to plan against.

**Salaries — not safely extrapolable.** My searches were triaged toward suspicious rows, so the 9-in-22 hit rate is inflated by design. What the evidence does support: the failures are **not random**, they cluster in a findable pattern (senior titles with IC-level floors, and floors under the BLS 10th percentile). Rather than sampling further, I'd query the table for those two patterns directly — that converts an unbounded audit into a finite worklist.

**Caveat on both numbers:** since 46% of the table came from one April import and quality has clearly improved since, the overall rate is dominated by that early batch. Re-running the current generation process over the April rows may be cheaper than fixing them individually.
