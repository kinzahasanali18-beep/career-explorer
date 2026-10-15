-- Phase 4c rematch citation fixes, chunk 4 of 4 — 29 rows, 29 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 27-3031.00 Public Relations Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3031.00'
where source_url = 'https://www.onetonline.org/link/summary/27-3022.00' and id in (
  '664e6bb2-c842-45f4-9a39-4a27a677a790'
);

-- 27-4012.00 Broadcast Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4012.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4013.00' and id in (
  '2cab1e72-c8b9-4a40-991c-1a8af6f78861'
);

-- 27-4012.00 Broadcast Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4012.00'
where source_url = 'https://www.bls.gov/ooh/architecture-and-engineering/broadcast-and-sound-engineering-technicians.htm' and id in (
  'e64de3c9-8f36-4cf3-b31a-3ec7253ec460'
);

-- 27-4014.00 Sound Engineering Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4014.00'
where source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/broadcast-and-sound-engineering-technicians.htm' and id in (
  '689a4ee7-3d65-44d1-9592-2660df3e209b'
);

-- 27-4032.00 Film and Video Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/entertainment-and-sports/film-and-video-editors-and-camera-operators.htm' and id in (
  '26bfe83b-6744-4df4-b885-e452f908d6ec'
);

-- 27-4032.00 Film and Video Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4008.00' and id in (
  '8b1f8e8d-eb0b-4d32-b525-8a3754cf74d9'
);

-- 29-1141.00 Registered Nurses
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1141.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/occupational-health-and-safety-specialists-and-technicians.htm' and id in (
  '65288c4f-1689-4dd5-8ec1-1ead67a24ede'
);

-- 29-1161.00 Nurse Midwives
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1161.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/nurse-midwives-and-nurse-anesthetists.htm' and id in (
  'f965b091-436f-4187-aca9-eb8247c3d0d4'
);

-- 29-1217.00 Neurologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1217.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '315e726f-5656-4f7f-a052-c9ca084efd71'
);

-- 29-1229.00 Physicians, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1061.00' and id in (
  '9f2e47e3-9079-434b-8fa6-92dd89f7f53a'
);

-- 29-1229.00 Physicians, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  'afd84ea5-ba22-4cd2-9168-701c14bfecd5'
);

-- 29-1229.00 Physicians, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-support/physicians-and-surgeons.htm' and id in (
  'd0318652-53ab-48ce-ab52-7637ab84940a'
);

-- 29-1229.03 Urologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.03'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-technical/physicians-and-surgeons.htm' and id in (
  '477c6fd2-f01d-4570-9d15-6538b922908f'
);

-- 29-1229.05 Preventive Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.05'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioner-and-technical/physicians-and-surgeons.htm' and id in (
  '8057c561-ba98-4b32-8b7e-1a773d19e8b0'
);

-- 29-1229.06 Sports Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1229.06'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/physicians-and-surgeons.htm' and id in (
  '865e0b28-1f08-4580-b45a-cb46982ff0cf'
);

-- 29-1249.00 Surgeons, All Other
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1249.00'
where source_url = 'https://www.onetonline.org/link/summary/29-1641.00' and id in (
  '2e2c3006-782b-455a-a2dd-fbac264fca98'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/clinical-laboratory-technologists-and-technicians.htm' and id in (
  '9cd44ccd-72c1-4211-8741-605a9c088dc1'
);

-- 29-2011.00 Medical and Clinical Laboratory Technologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2011.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/clinical-laboratory-technologists-and-technicians.htm' and id in (
  'cef58e2d-b748-4830-a6ee-3583d293b95a'
);

-- 29-2072.00 Medical Records Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/medical-records-and-health-information-technicians.htm' and id in (
  'dbceb025-710f-492e-b4f0-b7278d2e5d7a'
);

-- 31-2021.00 Physical Therapist Assistants
update public.careers set source_url = 'https://www.onetonline.org/link/summary/31-2021.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physical-therapist-assistants-and-aides.htm' and id in (
  '837df378-4b7e-4edb-9667-dfacba71a4fe'
);

-- 33-3021.00 Detectives and Criminal Investigators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3021.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents.htm' and id in (
  '678268b8-38a0-4a76-9732-717d6d648185'
);

-- 33-3021.00 Detectives and Criminal Investigators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/33-3021.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/federal-agents-and-special-agents.htm' and id in (
  '86d0bab2-ea66-482e-be4e-1e35064574b8'
);

-- 37-1011.00 First-Line Supervisors of Housekeeping and Janitorial Workers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/37-1011.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  '64a85153-fe30-4a8a-b2a7-392bab2f8d0c'
);

-- 39-2021.00 Animal Caretakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1100.00' and id in (
  'a6c5d501-acc1-41a9-9257-986891deb762'
);

-- 39-2021.00 Animal Caretakers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-2021.00'
where source_url = 'https://www.onetonline.org/link/summary/31-1099.00' and id in (
  'ff8daad8-e29f-4f81-a5e9-9410663587c2'
);

-- 41-3021.00 Insurance Sales Agents
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-3021.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/insurance-brokers-and-agents.htm' and id in (
  '138e08c1-f5a3-44e4-b2fd-fd7937c1f8b6'
);

-- 43-3051.00 Payroll and Timekeeping Clerks
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-3051.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/payroll-specialists.htm' and id in (
  'ab451db8-3ac2-411c-acc9-a9e20c46e914'
);

-- 43-4031.00 Court, Municipal, and License Clerks
update public.careers set source_url = 'https://www.onetonline.org/link/summary/43-4031.00'
where source_url = 'https://www.bls.gov/ooh/office-and-administrative-support/court-clerks-and-bailiffs.htm' and id in (
  '928466fe-3214-4a18-8874-452d527025ca'
);

-- 47-4011.00 Construction and Building Inspectors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/47-4011.00'
where source_url = 'https://www.bls.gov/ooh/protective-service/building-fire-and-code-inspectors.htm' and id in (
  '0b94ffc1-4b27-47c4-a66e-fdf1e616d464'
);

commit;
