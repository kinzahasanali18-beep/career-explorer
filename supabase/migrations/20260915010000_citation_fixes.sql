-- Replace 81 fabricated/dead citations with real O*NET links.
--
-- Source: reports/PHASE4C_STRONG_CANDIDATE_REVIEW_2026-09-15.csv, rows where
-- classification = CONFIRMED. Each was reviewed on meaning against the
-- career's own description/requirements, not on string similarity: 203 of
-- the 313 strong-tier candidates were rejected as false matches and 29 more
-- (including 6 pulled back out of an initial CONFIRMED pass for internal
-- inconsistency with sibling rows — see scripts/phase4c_reclassify_6.mjs)
-- left for a human. None of those are in this migration.
--
-- Only source_url changes. primary_industry, requirements, reviewed and
-- every other column are untouched. reviewed is NOT set to true. No rows
-- are hidden or deleted.
--
-- Rows: 81 across 50 statements (careers sharing one
-- occupation are grouped).
--
-- Each statement is guarded twice: by the exact reviewed ids, and by the
-- exact prior source_url, so a row whose citation changed in the meantime
-- is skipped rather than overwritten. Re-running is a no-op.
--
-- Prior values: reports/phase4c_citation_fixes_backup_before.csv
-- Revert:       reports/phase4c_citation_fixes_revert.sql

begin;

--  9 rows -> 27-3023.00 News Analysts, Reporters, and Journalists
--    Corrections Journalist
--    Grant Reporter
--    Tech Reporter
--    Investigative Journalist
--    Documentary Journalist
--    Travel Journalist
--    News Correspondent
--    Community News Reporter
--    Freelance Journalist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  '0fa5ce48-8833-486b-965f-e179833cca73',
  '13ebd229-b98d-4bf2-a9a8-549fc3a807b7',
  '29df0e82-ff26-4895-97ca-5a7e9eb7d2ce',
  '929c4575-4558-43c5-bf92-2e482123dc97',
  'b9feef08-8079-48df-8791-6306101b8e0e',
  'ba613049-49db-4627-8b93-702086e4e5c5',
  'd1ecea5f-0843-4f68-b33c-103b7004d88f',
  'e45fe45c-e06e-489b-8f1a-a980e9c5cf8f',
  'f62523e5-fd2a-4da1-b9cb-f975648cd7a9'
);

--  6 rows -> 27-4032.00 Film and Video Editors
--    Digital Video Editor
--    Assistant Film Editor
--    Performance Video Editor
--    Streaming Video Editor
--    Long-Form Video Editor
--    Senior Video Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4008.00' and id in (
  '05a1f0e0-58f4-4433-ae46-dade34894c3e',
  '188cbd49-26ab-467f-ae1b-fa8a1b242376',
  '192e7620-0820-4a63-a5e4-38917d8c112c',
  '1b5fa13d-133b-41ef-8249-3d5af8242a68',
  '1d51a567-ac74-4a0a-bacd-a331a4cbc607',
  '37955160-cf48-4e31-9a42-56aabdedcf82'
);

--  5 rows -> 15-1253.00 Software Quality Assurance Analysts and Testers
--    Quality Assurance Automation Tester
--    Quality Assurance Automation Engineer
--    Quality Assurance Engineer (Software)
--    Quality Assurance Engineer
--    Software Quality Assurance Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '22ae346a-0942-4450-9a8c-317384ea61c3',
  '3f740066-bc7b-44c1-a4b1-0a91efcd582c',
  'c978c25c-fd07-42e8-84fc-8c5fb5b3e541',
  'd3ef55b2-1209-4b65-9461-e642697c937b',
  'f1f49d00-dad3-4b72-a0cb-5a53266dfed6'
);

--  5 rows -> 19-2031.00 Chemists
--    Polymer Chemist
--    Pharmaceutical Chemist
--    Beauty Chemist
--    Organic Chemist
--    Medicinal Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '46195c3d-c921-4d62-8ea8-06040f2bdb18',
  '569ce2bf-403b-4365-805e-a132285e9e40',
  'de2f269e-d8d1-43e4-b843-492b8b27868a',
  'de7bfe85-416c-4cf8-b5ef-95b17c3dc42c',
  'e5ebc79d-f5aa-4f71-a9de-50805be419f1'
);

--  4 rows -> 29-1229.06 Sports Medicine Physicians
--    Sports Medicine Specialist
--    Orthopedic Sports Medicine Physician
--    Sports Medicine Doctor
--    Occupational Sports Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '05f4bee2-85c3-445c-af41-d7085bd1d365',
  '5bbf7750-631a-46e3-abd2-b37c568ab8df',
  '9969fd3f-26b9-4810-b532-5fc050c7ef4f',
  'e985178d-2f68-4187-9e74-624dbb57f71d'
);

--  3 rows -> 29-1229.04 Physical Medicine and Rehabilitation Physicians
--    Physical Medicine & Rehabilitation Specialist
--    Physical Medicine and Rehabilitation Specialist
--    Physical Medicine and Rehabilitation Doctor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '2ab6f41e-93df-4a28-9840-ebeeef84ef54',
  '7f728ce0-e860-4cd3-862b-58a151cd9a41',
  'df7c9071-876b-45a5-89c5-0fa1771715aa'
);

--  2 rows -> 13-1031.00 Claims Adjusters, Examiners, and Investigators
--    Insurance Claims Adjuster
--    Insurance Adjuster
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1031.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' and id in (
  '64874d86-edb3-415e-869e-f673008cd8bf',
  'd227822f-fceb-4e95-bb10-722f0b091e73'
);

--  2 rows -> 15-1252.00 Software Developers
--    Software as a Service (SaaS) Developer
--    Backend API Developer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1132.00' and id in (
  '38184007-ba58-47a6-9f70-c9b697847790',
  '7aaeb4e3-e00c-4911-a244-31bb2f21965a'
);

--  2 rows -> 15-1252.00 Software Developers
--    AI-Powered App Developer
--    Mobile App Developer (iOS/Android)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '6f4e9c3f-4c4b-45ca-8d3b-22410a46acfb',
  'da5157a8-eca9-426a-b786-396808f70533'
);

--  2 rows -> 21-1012.00 Educational, Guidance, and Career Counselors and Advisors
--    High School Guidance Counselor
--    High School Career Counselor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/21-1012.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/school-counselors.htm' and id in (
  'cd8d2362-af0a-4ff6-ab76-42345ecba330',
  'e045b607-5251-4ab0-b2bf-23973d7166fa'
);

--  2 rows -> 27-4015.00 Lighting Technicians
--    Live Event Lighting Technician
--    Theater Lighting Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4015.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4013.00' and id in (
  '2c8ba597-96d5-4ba8-a1f6-2b257859ca84',
  '900a4b22-69da-407f-bdb9-d65a2d200ce8'
);

--  1 row -> 11-1021.00 General and Operations Managers
--    Franchise Operations Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1021.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  'be196e5d-d106-474e-a5a0-5a021992430e'
);

--  1 row -> 11-2021.00 Marketing Managers
--    Influencer Marketing Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  '6a2da00b-e125-4959-9da6-36ba347d7b4e'
);

--  1 row -> 11-2033.00 Fundraising Managers
--    Fundraising Consultant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2033.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  '3741ed20-8b75-408f-be36-942f02bf673e'
);

--  1 row -> 11-3013.00 Facilities Managers
--    Fitness Facility Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3013.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'ac023d5e-65d8-4211-bbaf-d3bada1b5ed8'
);

--  1 row -> 11-3051.00 Industrial Production Managers
--    Print Production Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3051.00'
where source_url = 'https://www.onetonline.org/link/summary/51-5061.00' and id in (
  'b9529660-7e6b-4ea3-a26b-a5b1757b70c3'
);

--  1 row -> 11-3051.01 Quality Control Systems Managers
--    Quality Assurance Manager (Manufacturing)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3051.01'
where source_url = 'https://www.bls.gov/ooh/production/quality-assurance-inspectors.htm' and id in (
  '3e561acc-2263-470f-b2b9-3c500b9720c1'
);

--  1 row -> 11-9051.00 Food Service Managers
--    Food Safety Manager (Hospitality)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9011.03' and id in (
  'ea921b74-303b-4986-bfaa-30f1525bbfb3'
);

--  1 row -> 11-9072.00 Entertainment and Recreation Managers, Except Gambling
--    Parks and Recreation Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9072.00'
where source_url = 'https://www.bls.gov/ooh/management/park-recreation-managers.htm' and id in (
  'e5591c48-e0fa-4a62-bfd1-75dda84e801a'
);

--  1 row -> 11-9121.02 Water Resource Specialists
--    Water Conservation Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.02'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  '01a01cd2-d74c-4992-be47-9034e3ff8f2c'
);

--  1 row -> 11-9141.00 Property, Real Estate, and Community Association Managers
--    Real Estate Development Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9141.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9061.00' and id in (
  '66746713-bd85-4fa7-aaca-de118d4c38b5'
);

--  1 row -> 11-9199.02 Compliance Managers
--    Payroll Compliance Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9199.02'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/payroll-specialists.htm' and id in (
  '3787dbd9-395b-4f72-b80f-0b6532aeabe0'
);

--  1 row -> 15-1252.00 Software Developers
--    Game Developer (Indie)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1257.00' and id in (
  'e6fac05a-1dcd-41f6-bfe2-11872487348f'
);

--  1 row -> 15-1299.05 Information Security Engineers
--    Product Security Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.05'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '27e334c1-43db-4650-8068-fe49bde58b6b'
);

--  1 row -> 15-2051.00 Data Scientists
--    Climate Data Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-2051.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/atmospheric-scientists-and-hydrologists.htm' and id in (
  '3433d1ed-7798-4f96-b99b-09fe8598b5a9'
);

--  1 row -> 17-3025.00 Environmental Engineering Technologists and Technicians
--    Environmental Test Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-3025.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  '5dacd8d9-c201-4d43-9727-7cf22b4fadda'
);

--  1 row -> 19-1041.00 Epidemiologists
--    Hospital Epidemiologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1041.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '95e0633e-3bc1-40ea-bdfc-3a4a304dbd4e'
);

--  1 row -> 19-2012.00 Physicists
--    Quantum Physicist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  'c0410a07-dafc-47ec-80bf-6df69518bf46'
);

--  1 row -> 19-2021.00 Atmospheric and Space Scientists
--    Atmospheric Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' and id in (
  'a30ee8fc-d0ba-41c0-b917-f41e8c2b6b25'
);

--  1 row -> 19-4071.00 Forest and Conservation Technicians
--    Forest Restoration Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4071.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' and id in (
  'fb5b42aa-58aa-4661-a0b9-474991e3c1f5'
);

--  1 row -> 19-4099.01 Quality Control Analysts
--    Cosmetics Quality Control Analyst
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  'da807d6c-5815-4ad2-8a0b-942534e32889'
);

--  1 row -> 25-3041.00 Tutors
--    Academic Tutor (Specialized Subjects)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' and id in (
  'bcaa1b68-38ec-4c70-8004-7acf9151de39'
);

--  1 row -> 27-2012.00 Producers and Directors
--    News Producer (Broadcast)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '52f26cde-7982-4797-8e0c-abd822bfa6b6'
);

--  1 row -> 27-4032.00 Film and Video Editors
--    Video News Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' and id in (
  '4cf4641b-be3f-4161-8dec-237fb7c85070'
);

--  1 row -> 29-1141.02 Advanced Practice Psychiatric Nurses
--    Psychiatric Nurse Practitioner
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1141.02'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm' and id in (
  'c97d80e0-d374-47a4-8111-aab29f23de13'
);

--  1 row -> 29-1213.00 Dermatologists
--    Cosmetic Dermatologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1213.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '243a90f3-43ed-4a1e-8f2b-69916814f830'
);

--  1 row -> 29-1214.00 Emergency Medicine Physicians
--    Emergency Room Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1214.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '8e436142-8831-4949-b5f7-dfd7ecad1e1f'
);

--  1 row -> 29-1299.01 Naturopathic Physicians
--    Naturopathic Doctor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1299.01'
where source_url = 'https://www.onetonline.org/link/summary/29-1069.00' and id in (
  '95e51c7f-2c8a-4a10-bbd8-465896bd97e9'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Clinical Laboratory Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '418d66dd-8a27-4e20-8a66-c571b5a01dec'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Genetic Laboratory Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-laboratory-technologists-and-technicians.htm' and id in (
  '81dfe359-ab31-4420-9caa-6e9fbc3a7f1f'
);

--  1 row -> 29-2012.00 Medical and Clinical Laboratory Technicians
--    Genetic Laboratory Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/medical-laboratory-technologists-and-technicians.htm' and id in (
  '6a200c0f-2cad-4cb4-99a1-05608994c919'
);

--  1 row -> 29-2042.00 Emergency Medical Technicians
--    Emergency Room Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' and id in (
  'cbf748b1-95c8-40d0-b5be-2273f16db6ca'
);

--  1 row -> 29-2072.00 Medical Records Specialists
--    Medical Records Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' and id in (
  '2670ee81-3613-41da-bf47-2031972bc70a'
);

--  1 row -> 29-2072.00 Medical Records Specialists
--    Medical Coding Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-health-information-technicians.htm' and id in (
  '4ea7b552-585e-4c11-913f-3e87e42e4829'
);

--  1 row -> 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
--    Laboratory Animal Care Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1104.00' and id in (
  'bc335dee-6db5-4ee0-b0df-27b0ca92c75e'
);

--  1 row -> 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
--    Laboratory Animal Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1011.00' and id in (
  'd22eb87f-3643-476b-9b0a-e5c359364950'
);

--  1 row -> 33-3051.00 Police and Sheriff's Patrol Officers
--    Deputy Sheriff
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3051.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/sheriffs-and-detectives.htm' and id in (
  'fe31a8bf-cb41-4332-a126-0271f136154a'
);

--  1 row -> 41-4011.00 Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products
--    Pharmaceutical Sales Representative
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-4011.00'
where source_url = 'https://www.bls.gov/ooh/sales/pharmaceutical-sales-representatives.htm' and id in (
  '9476bb49-7394-4f34-a6ce-87ad2f22cefd'
);

--  1 row -> 47-4011.01 Energy Auditors
--    Energy Efficiency Auditor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.01'
where source_url = 'https://www.onetonline.org/link/summary/17-2211.00' and id in (
  'd59a3a38-cef6-4488-a65e-faa83880ff30'
);

--  1 row -> 47-4011.01 Energy Auditors
--    Renewable Energy Auditor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'dd4cbeb9-615e-46c7-8875-2cf56e4ed814'
);

commit;
