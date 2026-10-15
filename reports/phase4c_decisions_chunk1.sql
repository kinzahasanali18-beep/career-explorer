-- Phase 4c decisions migration, chunk 1 of 4 — 16 statements.
-- Guarded on exact id and exact prior source_url; idempotent.

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

commit;
