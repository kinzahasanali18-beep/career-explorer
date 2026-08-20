-- Phase 4b citation fixes, chunk 1 of 3 — 24 rows, 8 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 27-4032.00 Film and Video Editors
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

-- 19-2031.00 Chemists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '666a3382-126f-4bdb-8ff7-6e8cbf70f595',
  'b02cd8b4-a370-481d-85bb-aaed32ba9976',
  'ef440bc2-ec6a-46c9-881a-41979b4ec6d5'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '3b0b8dd4-26b7-4212-b761-81e9a1f2d176',
  '5e1f4361-6262-4bad-8a05-cd731c384cc3',
  'd97506d1-6942-4c1d-82b7-eb32e86d5b2a'
);

-- 15-1244.00 Network and Computer Systems Administrators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1244.00'
where source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects-and-administrators.htm' and id in (
  '1dac1327-4bb6-4ae9-af80-3b6cc82e3e0d',
  '8d7a7933-64a1-436e-9a8f-dfe79340b000'
);

-- 19-2012.00 Physicists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  '0f4714e5-e12a-4b6a-8b99-3cf6a916e796',
  '88e2bab9-98d4-47a9-b28f-d36ffa205a9d'
);

-- 19-4099.01 Quality Control Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '344aa5f0-9bde-4c06-b132-1c6d8f2ed5f5',
  '78900236-642e-4a22-b78e-54d4ff1e1fec'
);

-- 25-2021.00 Elementary School Teachers, Except Special Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2021.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/kindergarten-and-elementary-school-teachers.htm' and id in (
  '470ca10e-b238-4977-a5e6-ad21f1c1eb44',
  '95a08cbc-f7d3-4b65-9b83-afa16657b787'
);

-- 29-1229.06 Sports Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '315fdacd-41ec-4076-9b48-1b9ec4b35eff',
  'a0b1d9ff-d3f0-426e-a70e-70041c2bc374'
);

commit;
