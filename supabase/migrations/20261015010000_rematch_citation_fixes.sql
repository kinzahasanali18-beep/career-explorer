-- Replace 116 wrong-but-valid O*NET citations with the rematched SOC.
--
-- Source: reports/PHASE4C_FALSE_MATCH_REMATCH.csv, rows where confidence =
-- HIGH. These are the 203 FALSE MATCH careers from the Phase 4c strong-tier
-- review, each independently rematched to a correct O*NET occupation using
-- the career's own description/requirements as evidence, then re-checked a
-- second time for generic/umbrella title collisions (Analyst, Specialist,
-- Technician, Coordinator, Educator, Manager, Operator, Instructor) where
-- more than one occupation could reasonably fit -- those were downgraded to
-- MEDIUM and are NOT in this migration. MEDIUM (69), LOW (8) and NONE (8)
-- rows are all left alone.
--
-- Only source_url changes. primary_industry, secondary_industries,
-- requirements, reviewed and every other column are untouched. reviewed is
-- NOT set to true. No rows are hidden or deleted.
--
-- Rows: 116 across 94 statements (careers sharing one
-- rematched occupation are grouped).
--
-- Each statement is guarded twice: by the exact reviewed ids, and by the
-- exact prior source_url (the fabricated/dead citation already on the row),
-- so a row whose citation changed in the meantime is skipped rather than
-- overwritten. Re-running is a no-op.
--
-- Prior values: reports/phase4c_rematch_citation_fixes_backup_before.csv
-- Revert:       reports/phase4c_rematch_citation_fixes_revert.sql

begin;

--  10 rows -> 27-3023.00 News Analysts, Reporters, and Journalists
--    Investigative Researcher (Journalism)
--    Video Journalist
--    Staff Writer
--    Video Journalist (Documentary)
--    Digital Journalist
--    Sports Journalist
--    Environmental Reporter
--    Technology Reporter
--    Video Columnist
--    Science Journalist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  '47e016e0-dddd-4cb1-a0bb-f31699cb1a48',
  '5c05267b-e782-4671-bce5-0f4e42d94cf6',
  '7186a48b-565c-4869-b08c-abfa4c2c370c',
  '849addb7-bcb6-41b6-beda-35737768d568',
  '9ff5c444-9590-434d-9461-60aaa4a94c13',
  'a76063ab-ebc3-4456-b6ef-b7cc51755cc3',
  'c271786f-442a-4059-abf1-d8ceb0bac69b',
  'cc380a76-8962-49db-9a78-88ad4858f7dd',
  'f41a2f15-5408-4b19-a2f5-9f9cda16f8b6',
  'f94e04e4-28c4-4b1d-b4f3-4a2d51b308c4'
);

--  6 rows -> 25-2031.00 Secondary School Teachers, Except Special and Career/Technical Education
--    High School Science Teacher
--    Language Arts Teacher
--    High School History Teacher
--    High School Teacher
--    Language Arts Teacher (Secondary)
--    K-12 Math Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2031.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '209e4f3f-95f4-44fd-b3d1-ee6a96d32625',
  '4b42c163-cc8a-4539-830d-e714ffb99313',
  '6642e935-49e6-49fc-bc84-329feed05f36',
  '66e97033-37a3-4a37-842c-f5320b93b5b5',
  '69b5237e-b5f7-4ce7-9b9c-cdb14954645d',
  'b328e72d-89a0-4538-b9fb-ae5d5879ea19'
);

--  4 rows -> 25-3011.00 
--    English as a Second Language (ESL) Instructor
--    English as Second Language (ESL) Teacher
--    ESL/ESOL Specialist
--    ESL/ESOL Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3011.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '13195332-20ce-46d0-89df-01631c538869',
  '2c8a3f2d-036e-4fff-b8e0-db98464fd371',
  '8a8dd900-5968-4186-b913-74e63d066bde',
  'd4f04120-d851-4d3e-82c7-1090c0c26c24'
);

--  3 rows -> 11-9051.00 Food Service Managers
--    Coffee Shop Owner
--    Coffee Shop Franchise Owner
--    Franchise Operator (Food & Beverage)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  '0d66f43b-3a92-4980-ab00-1c6d437f15e0',
  'bac095a8-8ca4-448d-96e2-6a36919915e4',
  'f30281cb-0688-4580-84b7-08f6a038276a'
);

--  2 rows -> 19-4099.01 Quality Control Analysts
--    Pharmaceutical Quality Assurance Analyst
--    Quality Assurance Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '835063b8-6896-424f-9429-b4e095f45899',
  'cdadaf75-79b4-46b4-8205-3ce0f61db3af'
);

--  2 rows -> 27-3023.00 News Analysts, Reporters, and Journalists
--    Podcast Host (News)
--    Broadcast Journalist (Radio)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '030c1cf0-2e24-4ce3-b289-175ae319a4c3',
  'ef24fb2c-e153-4765-a888-555150d7b4de'
);

--  2 rows -> 29-2072.00 Medical Records Specialists
--    Medical Coder (ICD-10 Specialist)
--    Medical Coder (Remote Specialist)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.onetonline.org/link/summary/29-2071.00' and id in (
  '6062b780-e7a8-4622-9229-be2aaaba1d6a',
  '8c9979d8-6105-4461-af29-0447479ad036'
);

--  1 row -> 11-2021.00 Marketing Managers
--    Makeup Artist Manager (Beauty Brand)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/advertising-promotions-and-marketing-managers.htm' and id in (
  '61b58425-1520-42db-ac8e-924c53db551f'
);

--  1 row -> 11-2021.00 Marketing Managers
--    Social Media Strategy Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  'b80585b6-25f1-486a-ac02-af93070416a9'
);

--  1 row -> 11-3021.00 Computer and Information Systems Managers
--    Security Operations Center Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9999.01' and id in (
  '32cd69c5-f73f-45ab-b25d-30ce1ebe09b9'
);

--  1 row -> 11-3061.00 Purchasing Managers
--    Procurement Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3061.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-procurement-specialists.htm' and id in (
  '4fc2d9da-37c6-4638-a556-41dbd6f51a62'
);

--  1 row -> 11-9039.00 Education Administrators, All Other
--    Adult Education Program Director
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9039.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' and id in (
  '5311bf30-fa45-4561-bbcc-414c052140fc'
);

--  1 row -> 11-9051.00 Food Service Managers
--    Coffee Shop Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm' and id in (
  'c0818e9e-ebab-4587-9fa3-aae1d9268e1c'
);

--  1 row -> 11-9051.00 Food Service Managers
--    Independent Coffee Shop Owner
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'd8cb2c4a-c70d-44c7-a793-63816e5e5186'
);

--  1 row -> 11-9081.00 Lodging Managers
--    Hotel Front Desk Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/hotel-receptionists-and-concierges.htm' and id in (
  '38fcb2e4-e1d6-4949-ada0-010fe96d3624'
);

--  1 row -> 11-9081.00 Lodging Managers
--    Resort Guest Services Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where source_url = 'https://www.onetonline.org/link/summary/39-1011.00' and id in (
  'fd46ce0a-65ca-4df9-b502-db38b2918d77'
);

--  1 row -> 11-9111.00 Medical and Health Services Managers
--    Clinical Laboratory Director
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  '0fbcacdc-c297-4fa6-8ff2-e514c0c30ff7'
);

--  1 row -> 11-9111.00 Medical and Health Services Managers
--    Clinical Lab Director
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '2a4ddd63-f191-4fba-a2bc-0bc3f635248d'
);

--  1 row -> 11-9111.00 Medical and Health Services Managers
--    Hospital Lab Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '7bf2c4f3-10dc-4076-bcd1-0f1c69a1bc81'
);

--  1 row -> 11-9111.00 Medical and Health Services Managers
--    Medical Laboratory Director
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  'ef3e745e-a01f-4b5b-abee-c2a734d4aa5b'
);

--  1 row -> 11-9121.00 Natural Sciences Managers
--    Research Lab Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  '4a290184-dbaf-4e2e-96fe-6ff023b37e9b'
);

--  1 row -> 11-9121.00 Natural Sciences Managers
--    Chemistry Lab Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  'e2344d18-99ff-4719-8662-89b4cb242902'
);

--  1 row -> 11-9121.00 Natural Sciences Managers
--    Laboratory Operations Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'f5f07eec-33be-4c1b-a574-2448e6be1c8a'
);

--  1 row -> 11-9151.00 Social and Community Service Managers
--    Program Manager (Nonprofits)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9151.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '14fa81b7-ed94-4dcb-b3b6-9802f800393e'
);

--  1 row -> 13-1023.00 Purchasing Agents, Except Wholesale, Retail, and Farm Products
--    Procurement Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1023.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-purchasing-agents.htm' and id in (
  '31b84804-c9d2-4a3b-805b-05b936a9555b'
);

--  1 row -> 13-1121.00 Meeting, Convention, and Event Planners
--    Hotel Convention Services Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1121.00'
where source_url = 'https://www.onetonline.org/link/summary/39-1011.00' and id in (
  'fe04d74b-7417-49e6-8d44-f544ccc94e62'
);

--  1 row -> 13-1199.05 Sustainability Specialists
--    Sustainability Analyst (Corporate)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1199.05'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'a2480a1f-022b-4bf1-b188-68ca437aeabf'
);

--  1 row -> 15-1252.00 Software Developers
--    API-as-a-Service Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/entrepreneurs.htm' and id in (
  '16a97f8b-0dc9-486e-80b8-9a9bef3a86f2'
);

--  1 row -> 15-1252.00 Software Developers
--    Real Estate Tech Founder
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/entrepreneurs.htm' and id in (
  '55048691-54aa-4053-b664-d30d8de7bae4'
);

--  1 row -> 15-1252.00 Software Developers
--    Fitness App Developer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1132.00' and id in (
  'b20c96d6-8178-429d-9295-2e8ed91564d8'
);

--  1 row -> 15-1253.00 Software Quality Assurance Analysts and Testers
--    QA Automation Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '728dbbb3-031c-42b9-b503-b8caaa9d2f1b'
);

--  1 row -> 15-1299.08 Computer Systems Engineers/Architects
--    Software Architect (Enterprise Systems)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.08'
where source_url = 'https://www.onetonline.org/link/summary/15-1199.09' and id in (
  '809b1d04-1613-4c45-a228-7bd3bd6ef82d'
);

--  1 row -> 17-3011.00 Architectural and Civil Drafters
--    Architectural Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-3011.00'
where source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/architectural-technologists.htm' and id in (
  'a0c7c78e-a10f-4afa-bb18-b0173dc2ed78'
);

--  1 row -> 19-1013.00 Soil and Plant Scientists
--    Agricultural Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1013.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/agricultural-scientists.htm' and id in (
  '0ba231ee-0d93-443b-987f-2c16b2589ccc'
);

--  1 row -> 19-1042.00 Medical Scientists, Except Epidemiologists
--    Pharmaceutical Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1042.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '8f30f380-426b-4684-94eb-4cf03cc9100d'
);

--  1 row -> 19-1042.00 Medical Scientists, Except Epidemiologists
--    Clinical Pharmacologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1042.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/pharmacologists.htm' and id in (
  'b73ce9d0-38a6-4484-a71c-ad3461c1de06'
);

--  1 row -> 19-2021.00 Atmospheric and Space Scientists
--    Climate Modeler
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-hydrologists.htm' and id in (
  '658bac2b-7c38-41d6-b4a7-ba8b74921dae'
);

--  1 row -> 19-2021.00 Atmospheric and Space Scientists
--    Climate Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' and id in (
  '9c96cb69-45b4-4123-a603-2449dbc790f4'
);

--  1 row -> 19-2021.00 Atmospheric and Space Scientists
--    Climate Modeler (Atmospheric Science)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' and id in (
  'f7f3fc68-82f6-4897-87bd-dc79069b7c6a'
);

--  1 row -> 19-2031.00 Chemists
--    Research Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '0c3d356f-a33b-4bb1-ad4f-c132c3286f36'
);

--  1 row -> 19-2032.00 Materials Scientists
--    Textile Innovator (Lab-Grown Fibers)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2032.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '07ff5018-2f4d-4697-a9ef-b3b9d70f593e'
);

--  1 row -> 19-2032.00 Materials Scientists
--    Materials Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2032.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '610b8982-655d-4aec-92a9-c8f14174d157'
);

--  1 row -> 19-3034.00 School Psychologists
--    Educational Diagnostician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3034.00'
where source_url = 'https://www.onetonline.org/link/summary/19-3031.02' and id in (
  '4c33c8b6-6536-4e90-bad7-11a5bce8691f'
);

--  1 row -> 19-4099.00 Life, Physical, and Social Science Technicians, All Other
--    Physics Laboratory Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  'dbcc38a0-92ed-4254-ac43-5a5aa8f4f014'
);

--  1 row -> 19-4099.00 Life, Physical, and Social Science Technicians, All Other
--    Physics Lab Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  'e6675317-35f5-4ce0-b7ec-48b2e8329c76'
);

--  1 row -> 19-4099.01 Quality Control Analysts
--    Cosmetics Quality Assurance Tester
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  '55038fc1-7ad8-412e-ab8d-b79c1aa9e45c'
);

--  1 row -> 19-5011.00 Occupational Health and Safety Specialists
--    Lab Safety Officer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-5011.00'
where source_url = 'https://www.onetonline.org/link/summary/29-9011.00' and id in (
  'c8502392-2529-4b90-a6e7-e07d8be13842'
);

--  1 row -> 23-1011.00 Lawyers
--    Municipal Prosecutor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1011.00'
where source_url = 'https://www.bls.gov/ooh/legal/judges-and-prosecutors.htm' and id in (
  'ad7ea8ca-6955-48a8-b6a4-d55d1c354bd7'
);

--  1 row -> 25-1194.00 Career/Technical Education Teachers, Postsecondary
--    Hairstyle Educator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.onetonline.org/link/summary/25-1191.00' and id in (
  '0e42bfb9-1eca-430a-8175-027735879d42'
);

--  1 row -> 25-1194.00 Career/Technical Education Teachers, Postsecondary
--    Vocational Instructor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/vocational-education-teachers.html' and id in (
  '2350aa25-566a-4252-9448-c7b11fa40fd9'
);

--  1 row -> 25-1194.00 Career/Technical Education Teachers, Postsecondary
--    Cosmetology Instructor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-1194.00'
where source_url = 'https://www.onetonline.org/link/summary/25-3091.00' and id in (
  '6a8e9d52-bff5-4b52-9d43-fd2bf56f3c70'
);

--  1 row -> 25-2059.00 Special Education Teachers, All Other
--    Special Needs Teacher (Inclusive Education)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2059.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/special-education-teachers.html' and id in (
  '3ef1e70d-53fa-42f5-bdd9-65c9577add14'
);

--  1 row -> 25-3021.00 Self-Enrichment Teachers
--    Dance Instructor (Classical Ballet)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3021.00'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/dancers-and-choreographers.htm' and id in (
  '13ce55ad-ca4d-4143-a010-0aecbdd3e563'
);

--  1 row -> 25-3041.00 Tutors
--    Language Tutor (ESL)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '9013d1dc-fd12-4fb7-99af-dca18c983f61'
);

--  1 row -> 25-4013.00 Museum Technicians and Conservators
--    Museum Conservation Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-4013.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.02' and id in (
  '960ced69-816b-480a-a7f5-cd91a06a27e4'
);

--  1 row -> 25-9031.00 Instructional Coordinators
--    Curriculum Specialist (Gifted Programs)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9031.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' and id in (
  'eae9cb72-8143-4907-ab49-2d2aaa776104'
);

--  1 row -> 27-1012.00 Craft Artists
--    Fiber Artist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1012.00'
where source_url = 'https://www.onetonline.org/link/summary/27-2499.00' and id in (
  '1f63f0f8-b185-4aa0-a5b3-e7bb549f85a1'
);

--  1 row -> 27-1014.00 Special Effects Artists and Animators
--    Performance Capture Artist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-1014.00'
where source_url = 'https://www.onetonline.org/link/summary/27-2014.00' and id in (
  'fc962015-0bc2-4512-a8c7-3352700cb42c'
);

--  1 row -> 27-2012.00 Producers and Directors
--    Video Producer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' and id in (
  '2678f49f-6778-4150-84f3-a82f684b1bea'
);

--  1 row -> 27-2012.00 Producers and Directors
--    Radio Producer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '56ef0650-defc-4ef5-90c4-ff23d1902b74'
);

--  1 row -> 27-2022.00 Coaches and Scouts
--    Youth Development Specialist (Sports)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/recreation-and-fitness-workers.htm' and id in (
  '5ea1eec0-a56a-4667-94e7-ee3a867f959d'
);

--  1 row -> 27-2022.00 Coaches and Scouts
--    Robotics Coach (STEM)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00'
where source_url = 'https://www.onetonline.org/link/summary/25-2099.00' and id in (
  '84120952-326b-4ac9-a496-021e10bd506e'
);

--  1 row -> 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
--    Radio Host
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '1257e7af-4351-4465-8ad3-caea767aaa72'
);

--  1 row -> 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
--    Sports Announcer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' and id in (
  'e5e0a77b-dab2-4c55-a0de-0c69913e8f90'
);

--  1 row -> 27-3023.00 News Analysts, Reporters, and Journalists
--    Broadcast Journalist (TV/Radio News)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcast-news-analysts.htm' and id in (
  '3e9e6b98-28fd-4472-bbad-fbaf34a5147c'
);

--  1 row -> 27-3031.00 Public Relations Specialists
--    Beauty PR Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3031.00'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  '664e6bb2-c842-45f4-9a39-4a27a677a790'
);

--  1 row -> 27-4012.00 Broadcast Technicians
--    Transmission Technician (Broadcasting)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4012.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4013.00' and id in (
  '2cab1e72-c8b9-4a40-991c-1a8af6f78861'
);

--  1 row -> 27-4012.00 Broadcast Technicians
--    Broadcasting Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4012.00'
where source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/broadcast-and-sound-engineering-technicians.htm' and id in (
  'e64de3c9-8f36-4cf3-b31a-3ec7253ec460'
);

--  1 row -> 27-4014.00 Sound Engineering Technicians
--    Audio Engineer (Broadcasting)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4014.00'
where source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/broadcast-and-sound-engineering-technicians.htm' and id in (
  '689a4ee7-3d65-44d1-9592-2660df3e209b'
);

--  1 row -> 27-4032.00 Film and Video Editors
--    Motion Picture Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/film-and-video-editors-and-camera-operators.htm' and id in (
  '26bfe83b-6744-4df4-b885-e452f908d6ec'
);

--  1 row -> 27-4032.00 Film and Video Editors
--    Documentary Editor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4008.00' and id in (
  '8b1f8e8d-eb0b-4d32-b525-8a3754cf74d9'
);

--  1 row -> 29-1141.00 Registered Nurses
--    Occupational Health Nurse
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1141.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/occupational-health-and-safety-specialists-and-technicians.htm' and id in (
  '65288c4f-1689-4dd5-8ec1-1ead67a24ede'
);

--  1 row -> 29-1161.00 Nurse Midwives
--    Nurse Midwife
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1161.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-midwives-and-nurse-anesthetists.htm' and id in (
  'f965b091-436f-4187-aca9-eb8247c3d0d4'
);

--  1 row -> 29-1217.00 Neurologists
--    Clinical Neurologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1217.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '315e726f-5656-4f7f-a052-c9ca084efd71'
);

--  1 row -> 29-1229.00 Physicians, All Other
--    Clinical Geneticist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1061.00' and id in (
  '9f2e47e3-9079-434b-8fa6-92dd89f7f53a'
);

--  1 row -> 29-1229.00 Physicians, All Other
--    Addiction Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'afd84ea5-ba22-4cd2-9168-701c14bfecd5'
);

--  1 row -> 29-1229.00 Physicians, All Other
--    Sleep Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-support/physicians-and-surgeons.htm' and id in (
  'd0318652-53ab-48ce-ab52-7637ab84940a'
);

--  1 row -> 29-1229.03 Urologists
--    Urologic Surgeon
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.03'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '477c6fd2-f01d-4570-9d15-6538b922908f'
);

--  1 row -> 29-1229.05 Preventive Medicine Physicians
--    Occupational Health Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.05'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '8057c561-ba98-4b32-8b7e-1a773d19e8b0'
);

--  1 row -> 29-1229.06 Sports Medicine Physicians
--    Team Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/physicians-and-surgeons.htm' and id in (
  '865e0b28-1f08-4580-b45a-cb46982ff0cf'
);

--  1 row -> 29-1249.00 Surgeons, All Other
--    Cardiac Surgeon
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1249.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1641.00' and id in (
  '2e2c3006-782b-455a-a2dd-fbac264fca98'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Medical Laboratory Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '9cd44ccd-72c1-4211-8741-605a9c088dc1'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Clinical Lab Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  'cef58e2d-b748-4830-a6ee-3583d293b95a'
);

--  1 row -> 29-2072.00 Medical Records Specialists
--    Medical Coder
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-and-health-information-technicians.htm' and id in (
  'dbceb025-710f-492e-b4f0-b7278d2e5d7a'
);

--  1 row -> 31-2021.00 Physical Therapist Assistants
--    Physical Therapy Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2021.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physical-therapist-assistants-and-aides.htm' and id in (
  '837df378-4b7e-4edb-9667-dfacba71a4fe'
);

--  1 row -> 33-3021.00 Detectives and Criminal Investigators
--    FBI Special Agent
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3021.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents.htm' and id in (
  '678268b8-38a0-4a76-9732-717d6d648185'
);

--  1 row -> 33-3021.00 Detectives and Criminal Investigators
--    Federal Investigator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3021.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents-and-special-agents.htm' and id in (
  '86d0bab2-ea66-482e-be4e-1e35064574b8'
);

--  1 row -> 37-1011.00 First-Line Supervisors of Housekeeping and Janitorial Workers
--    Housekeeping Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/37-1011.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  '64a85153-fe30-4a8a-b2a7-392bab2f8d0c'
);

--  1 row -> 39-2021.00 Animal Caretakers
--    Wildlife Rehabilitator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1100.00' and id in (
  'a6c5d501-acc1-41a9-9257-986891deb762'
);

--  1 row -> 39-2021.00 Animal Caretakers
--    Wildlife Rehabber
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1099.00' and id in (
  'ff8daad8-e29f-4f81-a5e9-9410663587c2'
);

--  1 row -> 41-3021.00 Insurance Sales Agents
--    Insurance Broker
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-3021.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/insurance-brokers-and-agents.htm' and id in (
  '138e08c1-f5a3-44e4-b2fd-fd7937c1f8b6'
);

--  1 row -> 43-3051.00 Payroll and Timekeeping Clerks
--    Payroll Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-3051.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/payroll-specialists.htm' and id in (
  'ab451db8-3ac2-411c-acc9-a9e20c46e914'
);

--  1 row -> 43-4031.00 Court, Municipal, and License Clerks
--    Court Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-4031.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/court-clerks-and-bailiffs.htm' and id in (
  '928466fe-3214-4a18-8874-452d527025ca'
);

--  1 row -> 47-4011.00 Construction and Building Inspectors
--    Municipal Compliance Officer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/building-fire-and-code-inspectors.htm' and id in (
  '0b94ffc1-4b27-47c4-a66e-fdf1e616d464'
);

commit;
