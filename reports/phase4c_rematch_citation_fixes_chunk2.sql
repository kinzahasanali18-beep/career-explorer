-- Phase 4c rematch citation fixes, chunk 2 of 4 — 29 rows, 29 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 11-2021.00 Marketing Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/advertising-promotions-and-marketing-managers.htm' and id in (
  '61b58425-1520-42db-ac8e-924c53db551f'
);

-- 11-2021.00 Marketing Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-2031.00' and id in (
  'b80585b6-25f1-486a-ac02-af93070416a9'
);

-- 11-3021.00 Computer and Information Systems Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3021.00'
where source_url = 'https://www.onetonline.org/link/summary/11-9999.01' and id in (
  '32cd69c5-f73f-45ab-b25d-30ce1ebe09b9'
);

-- 11-3061.00 Purchasing Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-3061.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-procurement-specialists.htm' and id in (
  '4fc2d9da-37c6-4638-a556-41dbd6f51a62'
);

-- 11-9039.00 Education Administrators, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9039.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/instructional-coordinators-and-curriculum-specialists.htm' and id in (
  '5311bf30-fa45-4561-bbcc-414c052140fc'
);

-- 11-9051.00 Food Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm' and id in (
  'c0818e9e-ebab-4587-9fa3-aae1d9268e1c'
);

-- 11-9051.00 Food Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'd8cb2c4a-c70d-44c7-a793-63816e5e5186'
);

-- 11-9081.00 Lodging Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/hotel-receptionists-and-concierges.htm' and id in (
  '38fcb2e4-e1d6-4949-ada0-010fe96d3624'
);

-- 11-9081.00 Lodging Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9081.00'
where source_url = 'https://www.onetonline.org/link/summary/39-1011.00' and id in (
  'fd46ce0a-65ca-4df9-b502-db38b2918d77'
);

-- 11-9111.00 Medical and Health Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  '0fbcacdc-c297-4fa6-8ff2-e514c0c30ff7'
);

-- 11-9111.00 Medical and Health Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '2a4ddd63-f191-4fba-a2bc-0bc3f635248d'
);

-- 11-9111.00 Medical and Health Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '7bf2c4f3-10dc-4076-bcd1-0f1c69a1bc81'
);

-- 11-9111.00 Medical and Health Services Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9111.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-and-clinical-laboratory-technologists-and-technicians.htm' and id in (
  'ef3e745e-a01f-4b5b-abee-c2a734d4aa5b'
);

-- 11-9121.00 Natural Sciences Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  '4a290184-dbaf-4e2e-96fe-6ff023b37e9b'
);

-- 11-9121.00 Natural Sciences Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  'e2344d18-99ff-4719-8662-89b4cb242902'
);

-- 11-9121.00 Natural Sciences Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'f5f07eec-33be-4c1b-a574-2448e6be1c8a'
);

-- 11-9151.00 Social and Community Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9151.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '14fa81b7-ed94-4dcb-b3b6-9802f800393e'
);

-- 13-1023.00 Purchasing Agents, Except Wholesale, Retail, and Farm Products
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1023.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/purchasing-managers-buyers-and-purchasing-agents.htm' and id in (
  '31b84804-c9d2-4a3b-805b-05b936a9555b'
);

-- 13-1121.00 Meeting, Convention, and Event Planners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1121.00'
where source_url = 'https://www.onetonline.org/link/summary/39-1011.00' and id in (
  'fe04d74b-7417-49e6-8d44-f544ccc94e62'
);

-- 13-1199.05 Sustainability Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1199.05'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'a2480a1f-022b-4bf1-b188-68ca437aeabf'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/entrepreneurs.htm' and id in (
  '16a97f8b-0dc9-486e-80b8-9a9bef3a86f2'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial/entrepreneurs.htm' and id in (
  '55048691-54aa-4053-b664-d30d8de7bae4'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1132.00' and id in (
  'b20c96d6-8178-429d-9295-2e8ed91564d8'
);

-- 15-1253.00 Software Quality Assurance Analysts and Testers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '728dbbb3-031c-42b9-b503-b8caaa9d2f1b'
);

-- 15-1299.08 Computer Systems Engineers/Architects
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.08'
where source_url = 'https://www.onetonline.org/link/summary/15-1199.09' and id in (
  '809b1d04-1613-4c45-a228-7bd3bd6ef82d'
);

-- 17-3011.00 Architectural and Civil Drafters
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-3011.00'
where source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/architectural-technologists.htm' and id in (
  'a0c7c78e-a10f-4afa-bb18-b0173dc2ed78'
);

-- 19-1013.00 Soil and Plant Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1013.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/agricultural-scientists.htm' and id in (
  '0ba231ee-0d93-443b-987f-2c16b2589ccc'
);

-- 19-1042.00 Medical Scientists, Except Epidemiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1042.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '8f30f380-426b-4684-94eb-4cf03cc9100d'
);

-- 19-1042.00 Medical Scientists, Except Epidemiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1042.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/pharmacologists.htm' and id in (
  'b73ce9d0-38a6-4484-a71c-ad3461c1de06'
);

commit;
