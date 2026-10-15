-- Apply the 78 approved Phase 4c decisions from reports/PHASE4C_DECISIONS_FINAL.csv.
--
-- 69 rows: source_url -> the recommended O*NET occupation, source_type = 'related'.
-- 8 rows: source_type = 'emerging', source_url = null -- each of these 8
--   already carried a fabricated or dead-SOC citation (see
--   reports/PHASE4C_DECISIONS_EMERGING_SOURCE_URLS.csv for the prior values,
--   also captured in the backup/manifest and restored by the revert script).
-- 1 row: visible = false only.
--
-- Requires supabase/migrations/20261016000000_add_decision_columns.sql to
-- already be applied (adds source_type and visible).
--
-- Only source_url, source_type, and visible are ever touched.
-- primary_industry, secondary_industries, reviewed and every other column
-- are untouched and captured in the backup/manifest as witness columns.
--
-- Every statement is guarded by exact id and exact prior source_url, so a
-- row whose source_url changed in the meantime is skipped rather than
-- overwritten. Re-running is a no-op.
--
-- Prior values: reports/phase4c_decisions_backup_before.csv
-- Revert:       reports/phase4c_decisions_revert.sql

begin;

-- 8 rows -> 27-3099.00 Media and Communication Workers, All Other
--    Fact Checker (Digital Media)
--    Fact-Checker (Online)
--    Food Blogger (Paid Media)
--    Fact Checker (Online)
--    Fact Checker (Media Verification)
--    Fashion Blogger (Sustainable)
--    Social Media Manager (Creator Economy)
--    Fact-Checker (Misinformation Specialist)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3099.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  '1c4675c2-0c81-41de-bb0c-9e6d1ffc48c4',
  '1c5cdf49-0212-45f1-bc94-c3f486074154',
  '23b6e158-4e24-4243-9d8b-5d1666341031',
  '79d1b24f-90fd-4838-85d1-40ed7439a7d1',
  'af903556-9dbe-4953-9554-37de39d58a4e',
  'b0131114-b9c9-41fc-a955-34ad346ef991',
  'efe95e2a-8b4d-4c5a-bd24-df6adc6a4257',
  'f6bdceb7-a544-4044-8141-e9ca1c1f58ce'
);

-- 3 rows -> 29-1218.00 Obstetricians and Gynecologists
--    Reproductive Specialist
--    Perinatology Specialist
--    Fertility Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1218.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '4f4e989a-d4ba-477f-b161-c97ae81983e2',
  '5116dd85-3d60-4231-b474-cbde7b288b9b',
  'd3597d9d-59c3-4663-820c-69e50f412f18'
);

-- 2 rows -> 11-1011.00 Chief Executives
--    Mental Health App Entrepreneur
--    Mental Health App Founder
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1011.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/entrepreneurs.htm' and id in (
  '24882b55-0541-473d-bf69-bedbc4139136',
  '32160937-2538-4ac6-92c0-eb6eb3cec84c'
);

-- 2 rows -> 19-4099.01 Quality Control Analysts
--    Quality Assurance Specialist (Research)
--    Fabric Analyst
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '0a514c7a-488b-4b97-8287-bcfcb47edc5c',
  '75d75950-7262-4558-a64c-106ab93136b6'
);

-- 2 rows -> 25-3021.00 Self-Enrichment Teachers
--    Music Theory Teacher
--    Illustration Instructor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3021.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '04b72835-4538-4c55-87c0-ddc733ccedce',
  '2ebdc668-abc6-43b2-8ebb-98bac2f773bb'
);

-- 2 rows -> 25-9099.00 Educational Instruction and Library Workers, All Other
--    Museum Educator (STEM)
--    Science Educator (Museum/Zoo)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9099.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-9041.00' and id in (
  '4ecdabfa-6034-4bc0-9d6b-66393c57ffe3',
  'bc227fa7-040e-4803-8fe3-978fe5962dae'
);

-- 2 rows -> 27-3041.00 Editors
--    Content Strategist (News Organization)
--    Content Strategist (News Media)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3041.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  '8568a7b9-1702-4e2b-b8cc-3a439529820c',
  'b8ca7452-8c49-4687-bce1-37f417355430'
);

-- 2 rows -> 27-3099.00 Media and Communication Workers, All Other
--    Podcast Host
--    Podcast Host (Independent)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcasters-and-sound-engineering-technicians.htm' and id in (
  '08cb6860-2041-4cb3-83b9-527110f4214e',
  '50fb9bd9-76c0-4eb0-8898-05bee93314dd'
);

-- 2 rows -> 39-7012.00 Travel Guides
--    Eco-Tourism Operator
--    Tour Operator (Adventure Travel)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-7012.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/39-6032.00' and id in (
  '403f75c4-e0b9-44f6-8743-8a1587b1c628',
  'c64393bb-0d91-4859-8229-3c8d955a5740'
);

-- 1 row -> 11-1011.00 Chief Executives
--    Wellness App Developer (Founder)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1011.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/entrepreneurs-and-self-employed-workers.htm' and id in (
  '100b14dc-4661-4434-8525-b3c0695c591d'
);

-- 1 row -> 11-1011.00 Chief Executives
--    Wellness App Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-1011.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/management/entrepreneurs-and-self-employed-workers.htm' and id in (
  'cc08b2d6-edf8-448c-98c1-a4108fc79c89'
);

-- 1 row -> 11-3021.00 Computer and Information Systems Managers
--    Data Governance Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3021.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-1121.00' and id in (
  'a7d15094-1706-4b3a-86a4-8cf12c0fe93f'
);

-- 1 row -> 11-3131.00 Training and Development Managers
--    DEI Program Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3131.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '480a7cc0-be60-4699-b87d-bf344bc900d9'
);

-- 1 row -> 13-1082.00 Project Management Specialists
--    Circular Economy Project Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1082.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'ef01c0e3-bb9d-4db1-a159-0d6325f9f378'
);

-- 1 row -> 15-1252.00 Software Developers
--    AI/ML Operations Engineer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '3289f063-f03c-496c-8eb8-dcc37877aa29'
);

-- 1 row -> 17-2031.00 Bioengineers and Biomedical Engineers
--    Medical Device Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2031.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '66d25eaf-c976-43ae-8899-34729042189e'
);

-- 1 row -> 17-2111.00 Health and Safety Engineers, Except Mining Safety Engineers and Inspectors
--    Health Physicist (Nuclear Regulation)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-2111.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  '7cde0e21-13dc-45bd-b7d7-d3baae68a38a'
);

-- 1 row -> 19-1013.00 Soil and Plant Scientists
--    Soil Health Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1013.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.02' and id in (
  '50696e3e-1b71-4dc8-9288-6d25068a136d'
);

-- 1 row -> 19-1031.03 Park Naturalists
--    Environmental Educator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1031.03', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-9045.00' and id in (
  'ee27a3b5-f174-4df0-819e-9349ff5a3055'
);

-- 1 row -> 19-2032.00 Materials Scientists
--    Archaeometry Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2032.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '80628838-7292-48ee-9482-14c5c86d425d'
);

-- 1 row -> 19-2041.00 Environmental Scientists and Specialists, Including Health
--    Environmental Chemist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2041.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '0d28065c-08a6-418d-b0a8-a5189b472cbe'
);

-- 1 row -> 19-3039.00 Psychologists, All Other
--    Sport Psychologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3039.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/27-3033.00' and id in (
  '6fa373b7-b283-4a99-83dd-6cdeb6680ce2'
);

-- 1 row -> 19-3094.00 Political Scientists
--    Policy Advocate (Advocacy Organization)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-3094.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  'a5dbe805-8e72-4245-bb20-ec1516f294fa'
);

-- 1 row -> 19-4031.00 Chemical Technicians
--    Laboratory Analyst
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4031.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  'a9b9d9dc-c10b-4c99-969f-fc3f91935ce3'
);

-- 1 row -> 19-4042.00 Environmental Science and Protection Technicians, Including Health
--    Ecosystem Monitoring Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4042.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  '42cdf183-6446-4537-bf46-c78bb6cfcdb3'
);

-- 1 row -> 19-4099.01 Quality Control Analysts
--    Quality Assurance Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/production/quality-assurance-inspectors.htm' and id in (
  '9f963181-de1f-4545-9c22-1095ce41d88e'
);

-- 1 row -> 25-9099.00 Educational Instruction and Library Workers, All Other
--    Science Educator (Museum)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9099.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-2041.00' and id in (
  '187909e5-26a5-4c76-a5d6-f9c63e4dab2f'
);

-- 1 row -> 25-9099.00 Educational Instruction and Library Workers, All Other
--    Astronomy Educator (Planetarium)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/museum-and-archives-workers.htm' and id in (
  '6d0241be-baee-4b77-b5dd-82e92e604554'
);

-- 1 row -> 25-9099.00 Educational Instruction and Library Workers, All Other
--    Museum Educator (Interactive Programs)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9099.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-9011.00' and id in (
  'b28a8b95-0a15-4130-b446-d440375334c6'
);

-- 1 row -> 25-9099.00 Educational Instruction and Library Workers, All Other
--    STEM Education Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-9099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  'b792ffb3-2a85-49c9-92a5-3c3698ab6b91'
);

-- 1 row -> 27-2022.00 Coaches and Scouts
--    Robotics Instructor
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '12ddf53d-cb64-41c2-bffc-91d2b37fa220'
);

-- 1 row -> 27-2022.00 Coaches and Scouts
--    Chess Instructor (Youth)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-9041.00' and id in (
  '78898092-8d04-4f94-934d-0d238bdaf8eb'
);

-- 1 row -> 27-2022.00 Coaches and Scouts
--    Barista Champion (Competition Coach)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2022.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/25-3098.00' and id in (
  '886c6b82-4240-4d42-b386-77496505edcf'
);

-- 1 row -> 27-3031.00 Public Relations Specialists
--    Government Relations Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3031.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '10fa0bd8-8fc9-4995-a94f-417623b6b592'
);

-- 1 row -> 27-3031.00 Public Relations Specialists
--    Government Affairs Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3031.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/lobbyists.htm' and id in (
  'e4dae8ff-4300-4abf-a44b-d1ee8089d7ca'
);

-- 1 row -> 27-3041.00 Editors
--    Editorial Strategist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3041.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  'd4d8e30b-4242-49c6-adb8-6f4630e26daa'
);

-- 1 row -> 27-3043.00 Writers and Authors
--    Travel Writer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3043.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  'eddf16ff-aa71-4d0b-813e-ba28eb76e92e'
);

-- 1 row -> 29-1128.00 Exercise Physiologists
--    Biomechanics Research Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1128.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  'cb02dae1-720e-42ba-82a2-798c1afa5d67'
);

-- 1 row -> 29-1129.01 Art Therapists
--    Puppetry Therapist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1129.01', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/21-1018.00' and id in (
  '4d629951-f876-4f7a-a358-8812b95af6de'
);

-- 1 row -> 29-1215.00 Family Medicine Physicians
--    Telemedicine Specialist (Rural Health)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1215.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'e8b22186-ee59-4e3b-9337-5852a5b42d7e'
);

-- 1 row -> 29-1218.00 Obstetricians and Gynecologists
--    Fertility Specialist (Reproductive Endocrinologist)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1218.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '620e306d-d80e-4845-a852-9ab57b369bb2'
);

-- 1 row -> 29-2012.00 Medical and Clinical Laboratory Technicians
--    Microbiology Lab Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2012.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  '1aff9aca-7b4f-449b-b063-51b61b22ca71'
);

-- 1 row -> 29-2042.00 Emergency Medical Technicians
--    Emergency Medicine Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/emergency-medical-technicians-and-paramedics.htm' and id in (
  '6d7f5747-5e56-4b8c-af12-b01ba344587a'
);

-- 1 row -> 29-2053.00 Psychiatric Technicians
--    Behavioral Health Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2053.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/psychiatric-technicians-and-aides.htm' and id in (
  '13293349-5e2c-480f-8e44-740154b49662'
);

-- 1 row -> 29-2099.00 Health Technologists and Technicians, All Other
--    Nephrology Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/dialysis-technicians.htm' and id in (
  '39e2c6a8-1cd8-4837-95e7-f268df57e5e6'
);

-- 1 row -> 29-2099.00 Health Technologists and Technicians, All Other
--    Dialysis Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2099.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/29-2039.00' and id in (
  '44aad279-7dff-432c-a85d-6cee2fea140e'
);

-- 1 row -> 29-9021.00 Health Information Technologists and Medical Registrars
--    Health Information Manager
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9021.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-and-health-information-technicians.htm' and id in (
  'a0e724e9-35aa-4308-87af-d2a1e7d81f66'
);

-- 1 row -> 29-9091.00 Athletic Trainers
--    Rehabilitation Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9091.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/athletic-trainers-and-orthotic-and-prosthetic-technicians.htm' and id in (
  '96af6168-f530-4908-bc66-767dd82483c5'
);

-- 1 row -> 39-3099.00 Entertainment Attendants and Related Workers, All Other
--    Casino Host
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/gaming-services-workers.htm' and id in (
  'f5b35226-1278-4ce7-bcb7-c73f4c2968c0'
);

-- 1 row -> 41-1011.00 First-Line Supervisors of Retail Sales Workers
--    Pop-Up Retail Owner
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-1011.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '931ec5dc-ee9c-4c4b-b950-cd81de15cbed'
);

-- 1 row -> 41-9022.00 Real Estate Sales Agents
--    Real Estate Wholesale Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-9022.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/sales/real-estate-sales-agents-and-brokers.htm' and id in (
  '87e54e34-064e-40ae-ab29-e6c5ab22ed4b'
);

-- 1 row -> 53-3033.00 Light Truck Drivers
--    Local Delivery Service Operator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/53-3033.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/transportation-and-material-moving/delivery-and-stockroom-associates.htm' and id in (
  '100e52b4-df60-48d7-bc8d-445df9f6b7df'
);

-- 1 row -> 53-3033.00 Light Truck Drivers
--    Delivery Service Operator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/53-3033.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/transportation-and-material-moving/delivery-and-logistics-workers.htm' and id in (
  'de3916da-79a2-4cfe-8ea2-33196b1d1062'
);

-- Sports Analyst (prior source_url: https://www.onetonline.org/link/summary/27-3022.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '1174f284-9985-48de-9df1-8b74879ffc92' and source_url = 'https://www.onetonline.org/link/summary/27-3022.00';

-- Performance Analyst (Sports) (prior source_url: https://www.onetonline.org/link/summary/19-4011.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '3322b430-dcc3-4c44-b781-74162ea5199f' and source_url = 'https://www.onetonline.org/link/summary/19-4011.00';

-- Sports Analyst (Stats and Broadcasting) (prior source_url: https://www.bls.gov/ooh/media-and-communication/broadcasters-and-sound-engineering-technicians.htm)
update public.careers set source_type = 'emerging', source_url = null
where id = '38a00a0f-2ab3-40b4-add2-43688d59dbc2' and source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcasters-and-sound-engineering-technicians.htm';

-- Vending Machine Route Owner (prior source_url: https://www.bls.gov/ooh/management/self-employed-workers.htm)
update public.careers set source_type = 'emerging', source_url = null
where id = '3dfc9fca-13de-4238-8fee-8c6b6bc7c35c' and source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm';

-- Personal Stylist (Sustainable Fashion) (prior source_url: https://www.onetonline.org/link/summary/39-3094.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '67082acb-03e4-4a9b-a2e1-8acf0238ee2e' and source_url = 'https://www.onetonline.org/link/summary/39-3094.00';

-- Cultural Attaché (prior source_url: https://www.onetonline.org/link/summary/11-3011.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'a53d0a1d-7bcd-4f45-81d4-eec2c7b6a511' and source_url = 'https://www.onetonline.org/link/summary/11-3011.00';

-- Wine Distributor (prior source_url: https://www.onetonline.org/link/summary/41-4081.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'b9c4b8e7-19ae-4579-8660-1b5a5ab0244f' and source_url = 'https://www.onetonline.org/link/summary/41-4081.00';

-- AI Prompt Engineer (prior source_url: https://www.onetonline.org/link/summary/15-1257.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'dabeb9c9-a02d-4aa7-89d7-b547bb78264d' and source_url = 'https://www.onetonline.org/link/summary/15-1257.00';

-- Local Service Business Operator
update public.careers set visible = false
where id = 'd4f1382e-6cdc-469d-bd92-64a68fd47155' and source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm';

commit;
