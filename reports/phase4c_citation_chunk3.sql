-- Phase 4c citation fixes, chunk 3 of 4 — 27 rows, 27 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 11-9199.02 Compliance Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9199.02'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/payroll-specialists.htm' and id in (
  '3787dbd9-395b-4f72-b80f-0b6532aeabe0'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1257.00' and id in (
  'e6fac05a-1dcd-41f6-bfe2-11872487348f'
);

-- 15-1299.05 Information Security Engineers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.05'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '27e334c1-43db-4650-8068-fe49bde58b6b'
);

-- 15-2051.00 Data Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-2051.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/atmospheric-scientists-and-hydrologists.htm' and id in (
  '3433d1ed-7798-4f96-b99b-09fe8598b5a9'
);

-- 17-3025.00 Environmental Engineering Technologists and Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/17-3025.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  '5dacd8d9-c201-4d43-9727-7cf22b4fadda'
);

-- 19-1041.00 Epidemiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1041.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '95e0633e-3bc1-40ea-bdfc-3a4a304dbd4e'
);

-- 19-2012.00 Physicists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/physicists-and-astronomers.htm' and id in (
  'c0410a07-dafc-47ec-80bf-6df69518bf46'
);

-- 19-2021.00 Atmospheric and Space Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-including-meteorologists.htm' and id in (
  'a30ee8fc-d0ba-41c0-b917-f41e8c2b6b25'
);

-- 19-4071.00 Forest and Conservation Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4071.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' and id in (
  'fb5b42aa-58aa-4661-a0b9-474991e3c1f5'
);

-- 19-4099.01 Quality Control Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  'da807d6c-5815-4ad2-8a0b-942534e32889'
);

-- 25-3041.00 Tutors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' and id in (
  'bcaa1b68-38ec-4c70-8004-7acf9151de39'
);

-- 27-2012.00 Producers and Directors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-2012.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '52f26cde-7982-4797-8e0c-abd822bfa6b6'
);

-- 27-4032.00 Film and Video Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/arts-and-design/film-and-video-editors-and-camera-operators.htm' and id in (
  '4cf4641b-be3f-4161-8dec-237fb7c85070'
);

-- 29-1141.02 Advanced Practice Psychiatric Nurses
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1141.02'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm' and id in (
  'c97d80e0-d374-47a4-8111-aab29f23de13'
);

-- 29-1213.00 Dermatologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1213.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '243a90f3-43ed-4a1e-8f2b-69916814f830'
);

-- 29-1214.00 Emergency Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1214.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '8e436142-8831-4949-b5f7-dfd7ecad1e1f'
);

-- 29-1299.01 Naturopathic Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1299.01'
where source_url = 'https://www.onetonline.org/link/summary/29-1069.00' and id in (
  '95e51c7f-2c8a-4a10-bbd8-465896bd97e9'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '418d66dd-8a27-4e20-8a66-c571b5a01dec'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-laboratory-technologists-and-technicians.htm' and id in (
  '81dfe359-ab31-4420-9caa-6e9fbc3a7f1f'
);

-- 29-2012.00 Medical and Clinical Laboratory Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2012.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/medical-laboratory-technologists-and-technicians.htm' and id in (
  '6a200c0f-2cad-4cb4-99a1-05608994c919'
);

-- 29-2042.00 Emergency Medical Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2042.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/emergency-medical-technicians-and-paramedics.htm' and id in (
  'cbf748b1-95c8-40d0-b5be-2273f16db6ca'
);

-- 29-2072.00 Medical Records Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/medical-records-and-health-information-technicians.htm' and id in (
  '2670ee81-3613-41da-bf47-2031972bc70a'
);

-- 29-2072.00 Medical Records Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-health-information-technicians.htm' and id in (
  '4ea7b552-585e-4c11-913f-3e87e42e4829'
);

-- 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1104.00' and id in (
  'bc335dee-6db5-4ee0-b0df-27b0ca92c75e'
);

-- 31-9096.00 Veterinary Assistants and Laboratory Animal Caretakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-9096.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1011.00' and id in (
  'd22eb87f-3643-476b-9b0a-e5c359364950'
);

-- 33-3051.00 Police and Sheriff's Patrol Officers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3051.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/sheriffs-and-detectives.htm' and id in (
  'fe31a8bf-cb41-4332-a126-0271f136154a'
);

-- 41-4011.00 Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-4011.00'
where source_url = 'https://www.bls.gov/ooh/sales/pharmaceutical-sales-representatives.htm' and id in (
  '9476bb49-7394-4f34-a6ce-87ad2f22cefd'
);

commit;
