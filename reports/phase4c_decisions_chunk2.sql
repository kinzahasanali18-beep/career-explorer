-- Phase 4c decisions migration, chunk 2 of 4 — 16 statements.
-- Guarded on exact id and exact prior source_url; idempotent.

begin;

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

commit;
