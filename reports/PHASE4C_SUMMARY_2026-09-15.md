# Phase 4c — Review of the 313 strong-tier name-match candidates

Generated **2026-09-15** by `scripts/phase4c_review_strong_candidates.mjs`.
**No database writes.** Verification and proposals only.

Each candidate was judged on meaning, using the career's own description and requirements as evidence -- not on string similarity. Same standard as Phase 4b's review of the 115 full-coverage candidates.

| Classification | Careers | % of 313 |
|---|---|---|
| CONFIRMED | 81 | 25.9% |
| FALSE MATCH | 203 | 64.9% |
| STILL UNCERTAIN | 29 | 9.3% |

**81 are safe to fix.** Each gets a real `source_url` built from its verified SOC code, replacing the fabricated bls.gov link.

## FALSE MATCH — the string matched, the job did not

203 of 313. These are **real careers**; only the candidate was wrong. They must not be fixed to the candidate code, and must not be hidden either.

Dominant patterns, most of which repeat the Phase 4b findings at larger scale:

- **'Specialist' -> Water Resource Specialists (11-9121.02)** (12 rows)
- **Software/industrial QA -> Software Quality Assurance Analysts and Testers (15-1253.00)** (5 rows)
- **Generic manager catch-all -> General and Operations Managers (11-1021.00)** (10 rows)
- **'Clinical' -> Clinical Research Coordinators (11-9121.01)** (6 rows)
- **'Analyst' -> Logistics Analysts (13-1081.02)** (5 rows)
- **'Engineer' -> Logistics Engineers (13-1081.01)** (4 rows)
- **'Checker' -> Credit Authorizers, Checkers, and Clerks (43-4041.00)** (5 rows)
- **'Educator' -> Farm and Home Management Educators (25-9021.00)** (4 rows)
- **'Instructor' -> Nursing Instructors and Teachers, Postsecondary (25-1072.00)** (5 rows)
- **'Host' -> Hosts and Hostesses, Restaurant, Lounge, and Coffee Shop (35-9031.00)** (8 rows)
- **'Technician' -> Geographic Information Systems Technologists (15-1299.02)** (5 rows)
- **'Video' -> Video Game Designers (15-1255.01)** (4 rows)
- **'Radio'/'Device' -> Radio Frequency Identification Device Specialists (17-2072.01)** (3 rows)
- **Teaching level -> a Postsecondary-only teacher code** (18 rows)

A few word-overlap clusters turned out to be genuine matches rather than collisions, and are CONFIRMED almost across the board: **Film and Video Editors**, **Chemists**, **Sports Medicine Physicians**, **Physical Medicine and Rehabilitation Physicians**, and **News Analysts, Reporters, and Journalists** (the last of these because the career names really are journalist/reporter titles, not because the matcher is reliable in general).

Full list with reasons: `reports/PHASE4C_STRONG_CANDIDATE_REVIEW_2026-09-15.csv`.

## STILL UNCERTAIN — needs a human

| Career | Candidate | What is unresolved |
|---|---|---|
| Nuclear Physicist | Nuclear Engineers | A nuclear physicist is a physicist, not an engineer; Quantum Physicist in the same CONFIRMED batch correctly went to Physicists (19-2012.00) — inconsistent with that sibling row |
| Medical Coder (ICD/CPT) | Medical and Health Services Managers | Coding is not management; Medical Coding Specialist and Medical Records Administrator in the same batch correctly went to Medical Records Specialists (29-2072.00) — inconsistent with those sibling rows |
| Broadcast Meteorologist | Broadcast Announcers and Radio Disc Jockeys | Matched on 'broadcast'; a meteorologist belongs under Atmospheric and Space Scientists (19-2021.00), which Atmospheric Chemist in the same batch correctly uses |
| Laboratory Animal Technician | Medical and Clinical Laboratory Technicians | Lab *animal* work belongs under Veterinary Assistants and Laboratory Animal Caretakers (31-9096.00), which two other rows in this batch correctly use |
| Forest Conservation Manager | Forest and Conservation Technicians | Manager-level title matched a technician-level code; job-zone mismatch |
| Physics Teacher Researcher | Physics Teachers, Postsecondary | Near-identical title 'Physics Teacher/Researcher' sits in STILL UNCERTAIN for exactly this teaching-level ambiguity; this row should not have been scored differently |
| Resort Operations Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the resort-specific code |
| Publishing Executive | Chief Executives | Publishing-house executive matched the generic Chief Executives code; plausible but not specific |
| Payroll Manager | General and Operations Managers | Payroll-specific management has no exact O*NET code; GenOps catch-all is unconfirmed |
| Luxury Resort General Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the resort-specific code |
| Sustainability Auditor | Chief Sustainability Officers | Sustainability auditing matched the C-suite Chief Sustainability Officers code, a level mismatch |
| Theater Operations Manager | General and Operations Managers | Theater/venue operations matched the generic manager catch-all; Entertainment and Recreation Managers may fit better |
| Resort General Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the resort-specific code |
| Hotel Manager (Boutique) | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the hotel-specific code |
| Venue Manager (Concert Hall) | General and Operations Managers | Concert-hall operations matched the generic manager catch-all; Entertainment and Recreation Managers may fit better |
| Hotel General Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the hotel-specific code |
| Physics Teacher/Researcher | Physics Teachers, Postsecondary | Requirements list state teaching certification OR research credentials for university roles; level is genuinely ambiguous |
| Contracts Manager (Government) | General and Operations Managers | Government-contract negotiation matched the generic manager catch-all; Purchasing Managers is a plausible alternative |
| Climate Science Data Analyst | Climate Change Policy Analysts | Core work is data analysis, but candidate title's policy framing may still fit given the stated policy-informing purpose |
| Climbing Gym Manager | General and Operations Managers | Recreation-facility management matched the generic manager catch-all; a recreation-specific code may fit better |
| Government Relations Manager | Public Relations Managers | Legislative/lobbying relationship-building matched Public Relations Managers; overlap is partial |
| Payroll Services Manager | Administrative Services Managers | Payroll-specific management has no exact O*NET code; Administrative Services Managers catch-all is unconfirmed |
| Climate Change Scientist | Climate Change Policy Analysts | Core work is climate research, but candidate title matches the career name almost exactly except 'Scientist' vs 'Policy Analyst' |
| Hotel Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the hotel-specific code |
| Social Entrepreneur | Social and Community Service Managers | Social-venture entrepreneurship spans many possible occupations depending on the venture |
| Luxury Hotel General Manager | General and Operations Managers | Generic catch-all manager code; Lodging Managers (11-9081.00) is the hotel-specific code |
| Youth Mental Health Coach | Mental Health Counselors | Requirements describe a coaching certification, not the licensed-counselor credential the candidate implies |
| Photography Editor | Editors | No exact 'photo editor' code exists; text-editor code is a stretch but the curation function overlaps |
| Research Operations Manager | General and Operations Managers | Research-operations coordination matched the generic manager catch-all; Project Management Specialists is a plausible alternative |

## CONFIRMED — proposed citation fixes

`source_url` gets the O*NET summary link for the verified code. That is the existing convention: the app stores the O*NET URL and `resolveCitation()` derives the student-facing CareerOneStop link from the same code.

Full list (87 rows) is in the CSV. A representative sample:

| Career | O*NET occupation | SOC | Proposed `source_url` |
|---|---|---|---|
| Water Conservation Specialist | Water Resource Specialists | 11-9121.02 | `https://www.onetonline.org/link/summary/11-9121.02` |
| Grant Reporter | News Analysts, Reporters, and Journalists | 27-3023.00 | `https://www.onetonline.org/link/summary/27-3023.00` |
| Long-Form Video Editor | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Nuclear Physicist | Nuclear Engineers | 17-2161.00 | `https://www.onetonline.org/link/summary/17-2161.00` |
| Physical Medicine & Rehabilitation Specialist | Physical Medicine and Rehabilitation Physicians | 29-1229.04 | `https://www.onetonline.org/link/summary/29-1229.04` |
| Climate Data Scientist | Data Scientists | 15-2051.00 | `https://www.onetonline.org/link/summary/15-2051.00` |
| Software as a Service (SaaS) Developer | Software Developers | 15-1252.00 | `https://www.onetonline.org/link/summary/15-1252.00` |
| Polymer Chemist | Chemists | 19-2031.00 | `https://www.onetonline.org/link/summary/19-2031.00` |
| Pharmaceutical Chemist | Chemists | 19-2031.00 | `https://www.onetonline.org/link/summary/19-2031.00` |
| Insurance Claims Adjuster | Claims Adjusters, Examiners, and Investigators | 13-1031.00 | `https://www.onetonline.org/link/summary/13-1031.00` |
| AI-Powered App Developer | Software Developers | 15-1252.00 | `https://www.onetonline.org/link/summary/15-1252.00` |
| Emergency Room Physician | Emergency Medicine Physicians | 29-1214.00 | `https://www.onetonline.org/link/summary/29-1214.00` |
| Physics Teacher Researcher | Physics Teachers, Postsecondary | 25-1054.00 | `https://www.onetonline.org/link/summary/25-1054.00` |
| Atmospheric Chemist | Atmospheric and Space Scientists | 19-2021.00 | `https://www.onetonline.org/link/summary/19-2021.00` |
| Travel Journalist | News Analysts, Reporters, and Journalists | 27-3023.00 | `https://www.onetonline.org/link/summary/27-3023.00` |
| Quantum Physicist | Physicists | 19-2012.00 | `https://www.onetonline.org/link/summary/19-2012.00` |
| High School Guidance Counselor | Educational, Guidance, and Career Counselors and Advisors | 21-1012.00 | `https://www.onetonline.org/link/summary/21-1012.00` |
| Quality Assurance Engineer | Software Quality Assurance Analysts and Testers | 15-1253.00 | `https://www.onetonline.org/link/summary/15-1253.00` |
| Renewable Energy Auditor | Energy Auditors | 47-4011.01 | `https://www.onetonline.org/link/summary/47-4011.01` |
| High School Career Counselor | Educational, Guidance, and Career Counselors and Advisors | 21-1012.00 | `https://www.onetonline.org/link/summary/21-1012.00` |
| Game Developer (Indie) | Software Developers | 15-1252.00 | `https://www.onetonline.org/link/summary/15-1252.00` |
| Freelance Journalist | News Analysts, Reporters, and Journalists | 27-3023.00 | `https://www.onetonline.org/link/summary/27-3023.00` |

## Notes

- `suggested_soc_not_applied` in the CSV carries a better code for most FALSE MATCH rows. It is a starting point for a later pass, **not** reviewed to the standard of the CONFIRMED column, and nothing uses it.
- This covers only the 313 strong-tier candidates. The 363 weak-tier and 103 no-shared-word rows from Phase 4 are untouched, and would need the same treatment before any bulk action.
- The false-match rate here (64.9%) is higher than the full-coverage tier's 28.7% (Phase 4b), confirming the prediction that weaker word-overlap tiers misfire more often. Do not auto-apply this tier or any weaker one.
- A handful of CONFIRMED and FALSE MATCH rows also carry an obviously mismatched `primary_industry` tag (e.g. a physician tagged 'Cybersecurity', an app developer tagged 'Aviation & Transportation') -- separate from citation accuracy, and not corrected by this pass.
