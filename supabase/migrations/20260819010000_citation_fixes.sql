-- Replace 72 fabricated bls.gov citations with real O*NET links.
--
-- Source: reports/PHASE4B_FULL_CANDIDATE_REVIEW_2026-08-19.csv, rows where
-- classification = CONFIRMED. Each was reviewed on meaning against the career's
-- own description, not on string similarity: 33 of the 115 candidates were
-- rejected as false matches (Radio DJ -> Radio Frequency Identification Device
-- Specialists, VFX Supervisor -> Supervisors of Correctional Officers) and 10
-- more left for a human. None of those are in this migration.
--
-- Only source_url changes. primary_industry, requirements and every other
-- column are untouched. No rows are hidden or deleted.
--
-- Rows: 72 across 55 statements (careers sharing one
-- occupation are grouped; seven Video Editors all map to 27-4032.00).
--
-- Each statement is guarded twice: by the exact reviewed ids, and by the exact
-- prior source_url, so a row whose citation changed in the meantime is skipped
-- rather than overwritten. Re-running is a no-op.
--
-- Prior values: reports/phase4b_citation_fixes_backup_before.csv
-- Revert:       reports/phase4b_citation_fixes_revert.sql

begin;

--  8 rows -> 27-4032.00 Film and Video Editors
--    Video Editor (Freelance)
--    Video Editor (Media)
--    Video Editor (Documentary)
--    Video Editor (Media Production)
--    Video Editor (Broadcast)
--    Video Editor (Content Creator)
--    Video Editor (Content Creation)
--    Video Editor (Post-Production)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4008.00' and id in (
  '0d1fe05b-3845-4197-917f-da94cc7841ed',
  '1239ef70-78de-4645-881f-06b03f04c3f6',
  '149b4016-44a1-4a69-bd39-5182c7539f15',
  '31a440f1-e78d-4474-9dd5-0390a42635ff',
  '33555605-b24d-46be-bb12-d5aaa56f86bb',
  '983ea7c3-4560-4cb0-8330-7dc3a67d0063',
  'bd4cedc4-0e2a-4fc0-ad8d-3477bf4f8b7b',
  'd1df8f5a-290f-4e83-8caa-8dd0c9d97a35'
);

--  3 rows -> 19-2031.00 Chemists
--    Chemist (Pharmaceutical)
--    Chemist (Industrial)
--    Chemist (R&D)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '666a3382-126f-4bdb-8ff7-6e8cbf70f595',
  'b02cd8b4-a370-481d-85bb-aaed32ba9976',
  'ef440bc2-ec6a-46c9-881a-41979b4ec6d5'
);

--  3 rows -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Medical Lab Technologist
--    Medical Technologist
--    Laboratory Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '3b0b8dd4-26b7-4212-b761-81e9a1f2d176',
  '5e1f4361-6262-4bad-8a05-cd731c384cc3',
  'd97506d1-6942-4c1d-82b7-eb32e86d5b2a'
);

--  2 rows -> 15-1244.00 Network and Computer Systems Administrators
--    System Administrator
--    IT Systems Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1244.00'
where source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects-and-administrators.htm' and id in (
  '1dac1327-4bb6-4ae9-af80-3b6cc82e3e0d',
  '8d7a7933-64a1-436e-9a8f-dfe79340b000'
);

--  2 rows -> 19-2012.00 Physicists
--    Physicist (Research)
--    Physicist (Particle Physics)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  '0f4714e5-e12a-4b6a-8b99-3cf6a916e796',
  '88e2bab9-98d4-47a9-b28f-d36ffa205a9d'
);

--  2 rows -> 19-4099.01 Quality Control Analysts
--    Quality Control Analyst (Laboratory)
--    Quality Control Analyst (Pharma)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '344aa5f0-9bde-4c06-b132-1c6d8f2ed5f5',
  '78900236-642e-4a22-b78e-54d4ff1e1fec'
);

--  2 rows -> 25-2021.00 Elementary School Teachers, Except Special Education
--    Elementary School Teacher (STEM)
--    Elementary School Teacher (Science)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2021.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/kindergarten-and-elementary-school-teachers.htm' and id in (
  '470ca10e-b238-4977-a5e6-ad21f1c1eb44',
  '95a08cbc-f7d3-4b65-9b83-afa16657b787'
);

--  2 rows -> 29-1229.06 Sports Medicine Physicians
--    Sports Physician
--    Sports Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '315fdacd-41ec-4076-9b48-1b9ec4b35eff',
  'a0b1d9ff-d3f0-426e-a70e-70041c2bc374'
);

--  2 rows -> 29-2032.00 Diagnostic Medical Sonographers
--    Sonographer (Ultrasound Technician)
--    Medical Sonographer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2032.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/diagnostic-medical-sonographers-and-cardiovascular-technologists-and-technicians.htm' and id in (
  'a4b5fb63-37af-4ccc-b8c2-198a4712acaa',
  'ea047698-9ca8-4020-a7ea-a71f1b14333f'
);

--  1 row -> 11-9121.01 Clinical Research Coordinators
--    Clinical Research Coordinator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'b6dc7d0f-8fcd-4940-94c6-d3b1424bae32'
);

--  1 row -> 13-1011.00 Agents and Business Managers of Artists, Performers, and Athletes
--    Athlete Agent
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1011.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'fbc170df-5639-4952-8517-864823f5802e'
);

--  1 row -> 13-1031.00 Claims Adjusters, Examiners, and Investigators
--    Claims Investigator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1031.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' and id in (
  'be7e7fa0-e5e4-4b26-b326-a0ebb4478697'
);

--  1 row -> 15-1242.00 Database Administrators
--    Database Administrator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1242.00'
where source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/database-administrators-and-architects.htm' and id in (
  '81ec9725-3131-4b87-93e7-1e246d4d859b'
);

--  1 row -> 15-1252.00 Software Developers
--    iOS App Developer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  'cdd84a78-75f4-47f6-8718-c2756beaa17a'
);

--  1 row -> 15-1253.00 Software Quality Assurance Analysts and Testers
--    Quality Assurance Tester (Software)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  'd9d954bb-6216-4138-931c-67e4a126d85a'
);

--  1 row -> 15-1299.08 Computer Systems Engineers/Architects
--    Systems Architect
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.08'
where source_url = 'https://www.onetonline.org/link/summary/15-1199.09' and id in (
  '99c58209-cc00-4940-a62b-ac89ff737a1b'
);

--  1 row -> 19-1011.00 Animal Scientists
--    Lab Animal Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1011.00'
where source_url = 'https://www.onetonline.org/link/summary/25-3093.00' and id in (
  '498ecb55-c136-492b-a034-32455a8c716e'
);

--  1 row -> 19-1031.00 Conservation Scientists
--    Conservation Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' and id in (
  '32dcff21-4d05-463f-a5d1-332fa0e25a6a'
);

--  1 row -> 19-2021.00 Atmospheric and Space Scientists
--    Atmospheric Scientist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' and id in (
  'aed40ffa-5144-4270-be1f-d5e8beb5964c'
);

--  1 row -> 19-4013.00 Food Science Technicians
--    Food Science Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4013.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  'ad6a86b6-1c88-434b-bf80-9771a097bbcd'
);

--  1 row -> 23-1012.00 Judicial Law Clerks
--    Law Clerk (Judge)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1012.00'
where source_url = 'https://www.onetonline.org/link/summary/23-2092.00' and id in (
  '9761b636-41ea-4ae8-97d3-087a6931eeb0'
);

--  1 row -> 25-3031.00 Substitute Teachers, Short-Term
--    Substitute Teacher
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3031.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/teachers-kindergarten-and-elementary-school.htm' and id in (
  '43b74c51-2136-4b76-864c-76a033c573c2'
);

--  1 row -> 25-3041.00 Tutors
--    Tutor (Private Mathematics)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' and id in (
  '0815d925-a3b4-4bec-8f72-ea2a7fbc2448'
);

--  1 row -> 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
--    Radio Announcer
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '2e10f388-89a7-4622-991a-cf8bf84f9e39'
);

--  1 row -> 27-3023.00 News Analysts, Reporters, and Journalists
--    Reporter (Specialized Beat)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  'e0f19af4-5ab0-47d2-a715-5e758ae3909b'
);

--  1 row -> 27-3092.00 Court Reporters and Simultaneous Captioners
--    Court Reporter (CART)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3092.00'
where source_url = 'https://www.onetonline.org/link/summary/23-2091.00' and id in (
  'f835712c-fb54-49f5-ac6b-591531cd71e8'
);

--  1 row -> 27-4032.00 Film and Video Editors
--    Video Editor (Broadcasting)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/multimedia-artists-and-animators.htm' and id in (
  '667305da-6861-4aa2-92be-0d022614723c'
);

--  1 row -> 29-1151.00 Nurse Anesthetists
--    Nurse Anesthetist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1151.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/anesthesiologists-and-nurse-anesthetists.htm' and id in (
  'b3843afc-483a-44d3-a6ae-18e324192488'
);

--  1 row -> 29-1212.00 Cardiologists
--    Cardiologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1212.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' and id in (
  '10fc9ed0-3b28-45d7-b0cc-2007f05d800a'
);

--  1 row -> 29-1213.00 Dermatologists
--    Dermatologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1213.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' and id in (
  '395614dc-ee4f-43d7-a02a-e480e88ee0cd'
);

--  1 row -> 29-1214.00 Emergency Medicine Physicians
--    Emergency Medicine Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1214.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '7bbd5f38-70da-4e99-bb55-31375e3b4387'
);

--  1 row -> 29-1217.00 Neurologists
--    Neurologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1217.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '43c925a8-cf0a-4f5a-80fe-3c1917635e6a'
);

--  1 row -> 29-1221.00 Pediatricians, General
--    Pediatrician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1221.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '74bdd8b9-124d-492c-ae1e-7cc4252afd7f'
);

--  1 row -> 29-1223.00 Psychiatrists
--    Psychiatrist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1223.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'bb0e4da1-2508-487d-8de5-a850e7297e81'
);

--  1 row -> 29-1229.03 Urologists
--    Urologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.03'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'ba09bfc6-0de7-4a59-9eed-ee1343aacb30'
);

--  1 row -> 29-1229.04 Physical Medicine and Rehabilitation Physicians
--    Physical Medicine and Rehabilitation Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '5df0e8df-71b5-4061-994c-ce71b7fe33b3'
);

--  1 row -> 29-1229.04 Physical Medicine and Rehabilitation Physicians
--    Physical Medicine & Rehabilitation Physician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '9b26d9d5-39da-48d8-9c99-881bc23a492c'
);

--  1 row -> 29-1241.00 Ophthalmologists, Except Pediatric
--    Ophthalmologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1241.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'ae88cdda-6be0-4956-86ee-75f2fb11d3cc'
);

--  1 row -> 29-1242.00 Orthopedic Surgeons, Except Pediatric
--    Orthopedic Surgeon
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1242.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  'e8f0552d-e07d-45fd-8fb5-5b6621e2eccb'
);

--  1 row -> 29-1291.00 Acupuncturists
--    Acupuncturist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1291.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1199.03' and id in (
  'a1e4fa31-9bed-4b41-9154-1e90be722f2b'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Clinical Laboratory Technologist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '093d0ab1-2c1e-4154-8f2f-84d1c657b599'
);

--  1 row -> 29-2011.00 Medical and Clinical Laboratory Technologists
--    Medical Technologist (Laboratory)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '53d86ab4-1c26-4efa-850e-087c957410cf'
);

--  1 row -> 29-2012.00 Medical and Clinical Laboratory Technicians
--    Laboratory Technician (Clinical)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2012.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/clinical-laboratory-technologists-and-technicians.htm' and id in (
  'a3037ace-2a33-482d-b000-938ecc26ffd1'
);

--  1 row -> 29-2042.00 Emergency Medical Technicians
--    Emergency Medical Technician
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' and id in (
  '02fa8c04-94e9-47b4-9e49-48cfc7e5c4a4'
);

--  1 row -> 29-2042.00 Emergency Medical Technicians
--    Emergency Medical Technician (EMT)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/emergency-medical-technicians-and-paramedics.htm' and id in (
  '83ee3265-e692-4cf4-99c8-c1f0f4da878d'
);

--  1 row -> 29-2043.00 Paramedics
--    Paramedic
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2043.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emts-and-paramedics.htm' and id in (
  'd30517f2-fab0-45bb-9d6f-be2226bf891c'
);

--  1 row -> 29-2072.00 Medical Records Specialists
--    Medical Records Specialist
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' and id in (
  'd2bc8681-e8db-490f-8d0f-b7a02634e832'
);

--  1 row -> 29-9091.00 Athletic Trainers
--    Athletic Trainer (College Sports)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9091.00'
where source_url = 'https://www.onetonline.org/link/summary/29-2071.00' and id in (
  '5c0d722c-b8db-4187-afa9-a634377fd7f6'
);

--  1 row -> 31-1121.00 Home Health Aides
--    Home Health Aide
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1121.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/home-health-aides-and-personal-care-aides.htm' and id in (
  'f557259c-3dd3-471b-bfb3-aa07ef5bad3e'
);

--  1 row -> 31-2011.00 Occupational Therapy Assistants
--    Occupational Therapy Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/occupational-therapy-assistants-and-aides.htm' and id in (
  'ed4ef5d7-49f6-4396-9d38-7699dae98f71'
);

--  1 row -> 31-2021.00 Physical Therapist Assistants
--    Physical Therapist Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2021.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/physical-therapist-assistants-and-aides.htm' and id in (
  '3416965f-3b3c-4a2a-928e-6ff0b3f0c775'
);

--  1 row -> 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
--    Lab Animal Caretaker
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1011.00' and id in (
  '8b2fa566-d4e3-4bf9-a6c7-c0166ec4d470'
);

--  1 row -> 31-9099.01 Speech-Language Pathology Assistants
--    Speech Pathology Assistant
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9099.01'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/speech-language-pathology-assistants-and-aides.htm' and id in (
  '656efb27-2e00-4015-a5cb-8d00fc845b38'
);

--  1 row -> 35-3023.01 Baristas
--    Barista (Specialty Coffee)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/35-3023.01'
where source_url = 'https://www.bls.gov/ooh/food-preparation-and-serving-related/food-and-beverage-servers.htm' and id in (
  '2b322872-2c36-46b3-a1a2-bdb4bc1409d6'
);

--  1 row -> 39-7011.00 Tour Guides and Escorts
--    Tour Guide (Adventure Tourism)
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-7011.00'
where source_url = 'https://www.onetonline.org/link/summary/39-6031.00' and id in (
  'a6753a83-3fe5-4ebb-92a4-9f9225fe022e'
);

commit;
