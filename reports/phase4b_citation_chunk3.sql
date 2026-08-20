-- Phase 4b citation fixes, chunk 3 of 3 — 24 rows, 24 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 29-1217.00 Neurologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1217.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '43c925a8-cf0a-4f5a-80fe-3c1917635e6a'
);

-- 29-1221.00 Pediatricians, General
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1221.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '74bdd8b9-124d-492c-ae1e-7cc4252afd7f'
);

-- 29-1223.00 Psychiatrists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1223.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'bb0e4da1-2508-487d-8de5-a850e7297e81'
);

-- 29-1229.03 Urologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.03'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'ba09bfc6-0de7-4a59-9eed-ee1343aacb30'
);

-- 29-1229.04 Physical Medicine and Rehabilitation Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '5df0e8df-71b5-4061-994c-ce71b7fe33b3'
);

-- 29-1229.04 Physical Medicine and Rehabilitation Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.04'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '9b26d9d5-39da-48d8-9c99-881bc23a492c'
);

-- 29-1241.00 Ophthalmologists, Except Pediatric
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1241.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'ae88cdda-6be0-4956-86ee-75f2fb11d3cc'
);

-- 29-1242.00 Orthopedic Surgeons, Except Pediatric
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1242.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  'e8f0552d-e07d-45fd-8fb5-5b6621e2eccb'
);

-- 29-1291.00 Acupuncturists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1291.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1199.03' and id in (
  'a1e4fa31-9bed-4b41-9154-1e90be722f2b'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '093d0ab1-2c1e-4154-8f2f-84d1c657b599'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '53d86ab4-1c26-4efa-850e-087c957410cf'
);

-- 29-2012.00 Medical and Clinical Laboratory Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2012.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/clinical-laboratory-technologists-and-technicians.htm' and id in (
  'a3037ace-2a33-482d-b000-938ecc26ffd1'
);

-- 29-2042.00 Emergency Medical Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' and id in (
  '02fa8c04-94e9-47b4-9e49-48cfc7e5c4a4'
);

-- 29-2042.00 Emergency Medical Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/emergency-medical-technicians-and-paramedics.htm' and id in (
  '83ee3265-e692-4cf4-99c8-c1f0f4da878d'
);

-- 29-2043.00 Paramedics
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2043.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emts-and-paramedics.htm' and id in (
  'd30517f2-fab0-45bb-9d6f-be2226bf891c'
);

-- 29-2072.00 Medical Records Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' and id in (
  'd2bc8681-e8db-490f-8d0f-b7a02634e832'
);

-- 29-9091.00 Athletic Trainers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-9091.00'
where source_url = 'https://www.onetonline.org/link/summary/29-2071.00' and id in (
  '5c0d722c-b8db-4187-afa9-a634377fd7f6'
);

-- 31-1121.00 Home Health Aides
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-1121.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/home-health-aides-and-personal-care-aides.htm' and id in (
  'f557259c-3dd3-471b-bfb3-aa07ef5bad3e'
);

-- 31-2011.00 Occupational Therapy Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/occupational-therapy-assistants-and-aides.htm' and id in (
  'ed4ef5d7-49f6-4396-9d38-7699dae98f71'
);

-- 31-2021.00 Physical Therapist Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2021.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/physical-therapist-assistants-and-aides.htm' and id in (
  '3416965f-3b3c-4a2a-928e-6ff0b3f0c775'
);

-- 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1011.00' and id in (
  '8b2fa566-d4e3-4bf9-a6c7-c0166ec4d470'
);

-- 31-9099.01 Speech-Language Pathology Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9099.01'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/speech-language-pathology-assistants-and-aides.htm' and id in (
  '656efb27-2e00-4015-a5cb-8d00fc845b38'
);

-- 35-3023.01 Baristas
update public.careers set source_url = 'https://www.onetonline.org/link/summary/35-3023.01'
where source_url = 'https://www.bls.gov/ooh/food-preparation-and-serving-related/food-and-beverage-servers.htm' and id in (
  '2b322872-2c36-46b3-a1a2-bdb4bc1409d6'
);

-- 39-7011.00 Tour Guides and Escorts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-7011.00'
where source_url = 'https://www.onetonline.org/link/summary/39-6031.00' and id in (
  'a6753a83-3fe5-4ebb-92a4-9f9225fe022e'
);

commit;
