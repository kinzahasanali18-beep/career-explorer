# Phase 4b — Review of the 115 full-coverage name-match candidates

Generated **2026-08-19** by `scripts/phase4b_review_full_candidates.mjs`.
**No database writes.** Verification and proposals only.

Each candidate was judged on meaning, using the career's own description as evidence — not on string similarity.

| Classification | Careers | % of 115 |
|---|---|---|
| CONFIRMED | 72 | 62.6% |
| FALSE MATCH | 33 | 28.7% |
| STILL UNCERTAIN | 10 | 8.7% |

**72 are safe to fix.** Each gets a real `source_url` built from its verified SOC code, replacing the fabricated bls.gov link.

## FALSE MATCH — the string matched, the job did not

33 of 115. These are **real careers**; only the candidate was wrong. They must not be fixed to the candidate code, and must not be hidden either.

| Career | Bad candidate | Why it is wrong |
|---|---|---|
| Quality Assurance Analyst (Lab) | Software Quality Assurance Analysts and Testers | Lab sample testing, not software QA; description is about instruments and scientific rigour |
| K-12 Science Teacher | Computer Science Teachers, Postsecondary | K-12 science teaching matched a postsecondary Computer Science code |
| AI Trainer (Machine Learning) | Athletic Trainers | Labels data and tunes ML models; matched Athletic Trainers on the word 'trainer' |
| Quality Assurance Analyst (Science) | Software Quality Assurance Analysts and Testers | Validates scientific experiments and data, not software |
| Sports Writer | Gambling and Sports Book Writers and Runners | Sports journalism matched Gambling and Sports Book Writers, a betting-desk role |
| Chemistry Teacher (High School) | Chemistry Teachers, Postsecondary | Explicitly high school; candidate is the Postsecondary chemistry code |
| Special Education Teacher (Inclusive Design) | Preschool Teachers, Except Special Education | Candidate is Preschool Teachers, Except Special Education — the code explicitly excludes this job |
| QA Engineer | Logistics Engineers | Software testing matched Logistics Engineers on 'engineer' |
| Lab Analyst | Logistics Analysts | Clinical/scientific sample analysis matched Logistics Analysts on 'analyst' |
| Physics Teacher (High School) | Physics Teachers, Postsecondary | Explicitly high school; candidate is the Postsecondary physics code |
| Science Teacher (Secondary) | Computer Science Teachers, Postsecondary | Secondary science teaching matched a postsecondary Computer Science code |
| Drama Teacher (K-12) | Art, Drama, and Music Teachers, Postsecondary | Explicitly K-12; candidate is the Postsecondary art/drama/music code |
| Science Teacher | Computer Science Teachers, Postsecondary | General science teaching matched a postsecondary Computer Science code |
| Music Teacher (Private) | Art, Drama, and Music Teachers, Postsecondary | Private one-to-one instruction; candidate is the Postsecondary code |
| Quality Assurance Analyst (Pharma) | Software Quality Assurance Analysts and Testers | Tests medications, not software |
| ESL Teacher (International Schools) | Business Teachers, Postsecondary | English-language teaching matched Business Teachers, Postsecondary |
| Radio DJ | Radio Frequency Identification Device Specialists | Matched Radio Frequency Identification Device Specialists on 'radio' |
| ESL Teacher (K-12) | Business Teachers, Postsecondary | English-language teaching matched Business Teachers, Postsecondary |
| Ski Instructor | Nursing Instructors and Teachers, Postsecondary | Matched Nursing Instructors and Teachers, Postsecondary on 'instructor' |
| AI Trainer | Athletic Trainers | Same 'trainer' collision as AI Trainer (Machine Learning) — matched Athletic Trainers |
| Science Teacher (High School) | Computer Science Teachers, Postsecondary | High school science matched a postsecondary Computer Science code |
| Surgeon (Orthopedic) | Oral and Maxillofacial Surgeons | Orthopedic surgery matched Oral and Maxillofacial Surgeons — a different specialty |
| Pathologist | Speech-Language Pathologists | Diagnostic tissue pathology matched Speech-Language Pathologists on 'pathologist' |
| ESL (English as Second Language) Teacher | Business Teachers, Postsecondary | English-language teaching matched Business Teachers, Postsecondary |
| Lab Technician (Healthcare) | Geographic Information Systems Technologists and Technicians | Clinical lab work matched Geographic Information Systems Technologists on 'technician' |
| Music Teacher (K-12) | Art, Drama, and Music Teachers, Postsecondary | Explicitly K-12; candidate is the Postsecondary code |
| VFX Supervisor | First-Line Supervisors of Correctional Officers | Visual effects matched First-Line Supervisors of Correctional Officers on 'supervisor' |
| Physics Teacher (K-12) | Physics Teachers, Postsecondary | Explicitly K-12; candidate is the Postsecondary physics code |
| GIS Analyst (Environmental) | Logistics Analysts | Geospatial analysis matched Logistics Analysts on 'analyst' |
| Special Education Teacher (ESL) | Preschool Teachers, Except Special Education | Candidate is Preschool Teachers, Except Special Education — the code explicitly excludes this job |
| Lab Technician (Clinical) | Geographic Information Systems Technologists and Technicians | Clinical lab work matched Geographic Information Systems Technologists on 'technician' |
| ML Ops Engineer | Logistics Engineers | Machine-learning infrastructure matched Logistics Engineers on 'engineer' |
| ESL Teacher | Business Teachers, Postsecondary | English-language teaching matched Business Teachers, Postsecondary |

Two patterns account for most of them:

1. **Teaching level (15 rows).** O*NET's subject-specific teacher codes are all *Postsecondary*; K-12 teachers live under generic codes like 25-2031.00 Secondary School Teachers. So every "Chemistry Teacher (High School)" style row matched a university code.
2. **Single-word collisions (18 rows).** "trainer", "analyst", "engineer", "technician", "supervisor", "pathologist", "radio" — e.g. Radio DJ → *Radio Frequency Identification Device Specialists*, VFX Supervisor → *First-Line Supervisors of Correctional Officers*.

## STILL UNCERTAIN — needs a human

| Career | Candidate | What is unresolved |
|---|---|---|
| Music Teacher | Art, Drama, and Music Teachers, Postsecondary | Candidate is the Postsecondary music code; description does not state the level, and K-12 or private instruction are equally likely |
| VIP Services Manager | Administrative Services Managers | Luxury hospitality/events role matched Administrative Services Managers; event planning or lodging management may fit better |
| Quality Assurance Analyst | Software Quality Assurance Analysts and Testers | Description spans scientific experiments, software and products at once, so the intended occupation is genuinely unclear |
| Emergency Medical Technician (Paramedic) | Emergency Medical Technicians | O*NET separates EMTs (29-2042.00) from Paramedics (29-2043.00); the title names both and the description does not settle it |
| Physics Teacher | Physics Teachers, Postsecondary | Candidate is the Postsecondary physics code; the description does not state the teaching level |
| Chemistry Teacher | Chemistry Teachers, Postsecondary | Candidate is the Postsecondary chemistry code; the description does not state the teaching level |
| UGC (User-Generated Content) Producer | Producers and Directors | Social-content creation matched Producers and Directors, which O*NET scopes to film, stage and broadcast production |
| Drama Teacher | Art, Drama, and Music Teachers, Postsecondary | Candidate is the Postsecondary art/drama/music code; the description does not state the teaching level |
| Research Analyst | Market Research Analysts and Marketing Specialists | Generic research role matched Market Research Analysts; the description points at scientific rather than market research |
| Gym Manager | General and Operations Managers | Matched the catch-all General and Operations Managers; a recreation-supervisor or fitness code may fit better |

## CONFIRMED — proposed citation fixes

`source_url` gets the O*NET summary link for the verified code. That is the existing convention: the app stores the O*NET URL and `resolveCitation()` derives the student-facing CareerOneStop link from the same code.

| Career | O*NET occupation | SOC | Proposed `source_url` |
|---|---|---|---|
| Emergency Medical Technician | Emergency Medical Technicians | 29-2042.00 | `https://www.onetonline.org/link/summary/29-2042.00` |
| Tutor (Private Mathematics) | Tutors | 25-3041.00 | `https://www.onetonline.org/link/summary/25-3041.00` |
| Clinical Laboratory Technologist | Medical and Clinical Laboratory Technologists | 29-2011.00 | `https://www.onetonline.org/link/summary/29-2011.00` |
| Video Editor (Freelance) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Physicist (Research) | Physicists | 19-2012.00 | `https://www.onetonline.org/link/summary/19-2012.00` |
| Cardiologist | Cardiologists | 29-1212.00 | `https://www.onetonline.org/link/summary/29-1212.00` |
| Video Editor (Media) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Video Editor (Documentary) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| System Administrator | Network and Computer Systems Administrators | 15-1244.00 | `https://www.onetonline.org/link/summary/15-1244.00` |
| Barista (Specialty Coffee) | Baristas | 35-3023.01 | `https://www.onetonline.org/link/summary/35-3023.01` |
| Radio Announcer | Broadcast Announcers and Radio Disc Jockeys | 27-3011.00 | `https://www.onetonline.org/link/summary/27-3011.00` |
| Sports Physician | Sports Medicine Physicians | 29-1229.06 | `https://www.onetonline.org/link/summary/29-1229.06` |
| Video Editor (Media Production) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Conservation Scientist | Conservation Scientists | 19-1031.00 | `https://www.onetonline.org/link/summary/19-1031.00` |
| Video Editor (Broadcast) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Physical Therapist Assistant | Physical Therapist Assistants | 31-2021.00 | `https://www.onetonline.org/link/summary/31-2021.00` |
| Quality Control Analyst (Laboratory) | Quality Control Analysts | 19-4099.01 | `https://www.onetonline.org/link/summary/19-4099.01` |
| Dermatologist | Dermatologists | 29-1213.00 | `https://www.onetonline.org/link/summary/29-1213.00` |
| Medical Lab Technologist | Medical and Clinical Laboratory Technologists | 29-2011.00 | `https://www.onetonline.org/link/summary/29-2011.00` |
| Substitute Teacher | Substitute Teachers, Short-Term | 25-3031.00 | `https://www.onetonline.org/link/summary/25-3031.00` |
| Neurologist | Neurologists | 29-1217.00 | `https://www.onetonline.org/link/summary/29-1217.00` |
| Elementary School Teacher (STEM) | Elementary School Teachers, Except Special Education | 25-2021.00 | `https://www.onetonline.org/link/summary/25-2021.00` |
| Lab Animal Scientist | Animal Scientists | 19-1011.00 | `https://www.onetonline.org/link/summary/19-1011.00` |
| Medical Technologist (Laboratory) | Medical and Clinical Laboratory Technologists | 29-2011.00 | `https://www.onetonline.org/link/summary/29-2011.00` |
| Athletic Trainer (College Sports) | Athletic Trainers | 29-9091.00 | `https://www.onetonline.org/link/summary/29-9091.00` |
| Physical Medicine and Rehabilitation Physician | Physical Medicine and Rehabilitation Physicians | 29-1229.04 | `https://www.onetonline.org/link/summary/29-1229.04` |
| Medical Technologist | Medical and Clinical Laboratory Technologists | 29-2011.00 | `https://www.onetonline.org/link/summary/29-2011.00` |
| Speech Pathology Assistant | Speech-Language Pathology Assistants | 31-9099.01 | `https://www.onetonline.org/link/summary/31-9099.01` |
| Chemist (Pharmaceutical) | Chemists | 19-2031.00 | `https://www.onetonline.org/link/summary/19-2031.00` |
| Video Editor (Broadcasting) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Pediatrician | Pediatricians, General | 29-1221.00 | `https://www.onetonline.org/link/summary/29-1221.00` |
| Quality Control Analyst (Pharma) | Quality Control Analysts | 19-4099.01 | `https://www.onetonline.org/link/summary/19-4099.01` |
| Emergency Medicine Physician | Emergency Medicine Physicians | 29-1214.00 | `https://www.onetonline.org/link/summary/29-1214.00` |
| Database Administrator | Database Administrators | 15-1242.00 | `https://www.onetonline.org/link/summary/15-1242.00` |
| Emergency Medical Technician (EMT) | Emergency Medical Technicians | 29-2042.00 | `https://www.onetonline.org/link/summary/29-2042.00` |
| Physicist (Particle Physics) | Physicists | 19-2012.00 | `https://www.onetonline.org/link/summary/19-2012.00` |
| Lab Animal Caretaker | Veterinary Assistants and Laboratory Animal Caretakers | 31-9096.00 | `https://www.onetonline.org/link/summary/31-9096.00` |
| IT Systems Administrator | Network and Computer Systems Administrators | 15-1244.00 | `https://www.onetonline.org/link/summary/15-1244.00` |
| Elementary School Teacher (Science) | Elementary School Teachers, Except Special Education | 25-2021.00 | `https://www.onetonline.org/link/summary/25-2021.00` |
| Law Clerk (Judge) | Judicial Law Clerks | 23-1012.00 | `https://www.onetonline.org/link/summary/23-1012.00` |
| Video Editor (Content Creator) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Systems Architect | Computer Systems Engineers/Architects | 15-1299.08 | `https://www.onetonline.org/link/summary/15-1299.08` |
| Physical Medicine & Rehabilitation Physician | Physical Medicine and Rehabilitation Physicians | 29-1229.04 | `https://www.onetonline.org/link/summary/29-1229.04` |
| Sports Medicine Physician | Sports Medicine Physicians | 29-1229.06 | `https://www.onetonline.org/link/summary/29-1229.06` |
| Acupuncturist | Acupuncturists | 29-1291.00 | `https://www.onetonline.org/link/summary/29-1291.00` |
| Laboratory Technician (Clinical) | Medical and Clinical Laboratory Technicians | 29-2012.00 | `https://www.onetonline.org/link/summary/29-2012.00` |
| Sonographer (Ultrasound Technician) | Diagnostic Medical Sonographers | 29-2032.00 | `https://www.onetonline.org/link/summary/29-2032.00` |
| Tour Guide (Adventure Tourism) | Tour Guides and Escorts | 39-7011.00 | `https://www.onetonline.org/link/summary/39-7011.00` |
| Food Science Technician | Food Science Technicians | 19-4013.00 | `https://www.onetonline.org/link/summary/19-4013.00` |
| Ophthalmologist | Ophthalmologists, Except Pediatric | 29-1241.00 | `https://www.onetonline.org/link/summary/29-1241.00` |
| Atmospheric Scientist | Atmospheric and Space Scientists | 19-2021.00 | `https://www.onetonline.org/link/summary/19-2021.00` |
| Chemist (Industrial) | Chemists | 19-2031.00 | `https://www.onetonline.org/link/summary/19-2031.00` |
| Nurse Anesthetist | Nurse Anesthetists | 29-1151.00 | `https://www.onetonline.org/link/summary/29-1151.00` |
| Clinical Research Coordinator | Clinical Research Coordinators | 11-9121.01 | `https://www.onetonline.org/link/summary/11-9121.01` |
| Urologist | Urologists | 29-1229.03 | `https://www.onetonline.org/link/summary/29-1229.03` |
| Psychiatrist | Psychiatrists | 29-1223.00 | `https://www.onetonline.org/link/summary/29-1223.00` |
| Video Editor (Content Creation) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Claims Investigator | Claims Adjusters, Examiners, and Investigators | 13-1031.00 | `https://www.onetonline.org/link/summary/13-1031.00` |
| iOS App Developer | Software Developers | 15-1252.00 | `https://www.onetonline.org/link/summary/15-1252.00` |
| Video Editor (Post-Production) | Film and Video Editors | 27-4032.00 | `https://www.onetonline.org/link/summary/27-4032.00` |
| Medical Records Specialist | Medical Records Specialists | 29-2072.00 | `https://www.onetonline.org/link/summary/29-2072.00` |
| Paramedic | Paramedics | 29-2043.00 | `https://www.onetonline.org/link/summary/29-2043.00` |
| Laboratory Technologist | Medical and Clinical Laboratory Technologists | 29-2011.00 | `https://www.onetonline.org/link/summary/29-2011.00` |
| Quality Assurance Tester (Software) | Software Quality Assurance Analysts and Testers | 15-1253.00 | `https://www.onetonline.org/link/summary/15-1253.00` |
| Reporter (Specialized Beat) | News Analysts, Reporters, and Journalists | 27-3023.00 | `https://www.onetonline.org/link/summary/27-3023.00` |
| Orthopedic Surgeon | Orthopedic Surgeons, Except Pediatric | 29-1242.00 | `https://www.onetonline.org/link/summary/29-1242.00` |
| Medical Sonographer | Diagnostic Medical Sonographers | 29-2032.00 | `https://www.onetonline.org/link/summary/29-2032.00` |
| Occupational Therapy Assistant | Occupational Therapy Assistants | 31-2011.00 | `https://www.onetonline.org/link/summary/31-2011.00` |
| Chemist (R&D) | Chemists | 19-2031.00 | `https://www.onetonline.org/link/summary/19-2031.00` |
| Home Health Aide | Home Health Aides | 31-1121.00 | `https://www.onetonline.org/link/summary/31-1121.00` |
| Court Reporter (CART) | Court Reporters and Simultaneous Captioners | 27-3092.00 | `https://www.onetonline.org/link/summary/27-3092.00` |
| Athlete Agent | Agents and Business Managers of Artists, Performers, and Athletes | 13-1011.00 | `https://www.onetonline.org/link/summary/13-1011.00` |

## Notes

- `suggested_soc_not_applied` in the CSV carries a better code for most FALSE MATCH rows. It is a starting point for a later pass, **not** reviewed to the standard of the CONFIRMED column, and nothing uses it.
- This covers only the 115 full-coverage candidates. The 313 strong / 363 weak / 103 unmatched rows from Phase 4 are untouched.
- Even at full coverage the naive matcher was wrong 37.4% of the time, which is why the lower tiers should not be auto-applied at all.
