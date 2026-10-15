-- Phase 4c decisions migration, chunk 3 of 4 — 16 statements.
-- Guarded on exact id and exact prior source_url; idempotent.

begin;

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

commit;
