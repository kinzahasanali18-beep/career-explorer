-- Phase 4b citation fixes, chunk 2 of 3 — 24 rows, 23 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 29-2032.00 Diagnostic Medical Sonographers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2032.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-support/diagnostic-medical-sonographers-and-cardiovascular-technologists-and-technicians.htm' and id in (
  'a4b5fb63-37af-4ccc-b8c2-198a4712acaa',
  'ea047698-9ca8-4020-a7ea-a71f1b14333f'
);

-- 11-9121.01 Clinical Research Coordinators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9121.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4091.00' and id in (
  'b6dc7d0f-8fcd-4940-94c6-d3b1424bae32'
);

-- 13-1011.00 Agents and Business Managers of Artists, Performers, and Athletes
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1011.00'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  'fbc170df-5639-4952-8517-864823f5802e'
);

-- 13-1031.00 Claims Adjusters, Examiners, and Investigators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/13-1031.00'
where source_url = 'https://www.bls.gov/ooh/business-and-financial-operations/claims-adjusters-appraisers-examiners-and-investigators.htm' and id in (
  'be7e7fa0-e5e4-4b26-b326-a0ebb4478697'
);

-- 15-1242.00 Database Administrators
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1242.00'
where source_url = 'https://www.bls.gov/ooh/computer-and-information-technology/database-administrators-and-architects.htm' and id in (
  '81ec9725-3131-4b87-93e7-1e246d4d859b'
);

-- 15-1252.00 Software Developers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1252.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  'cdd84a78-75f4-47f6-8718-c2756beaa17a'
);

-- 15-1253.00 Software Quality Assurance Analysts and Testers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  'd9d954bb-6216-4138-931c-67e4a126d85a'
);

-- 15-1299.08 Computer Systems Engineers/Architects
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1299.08'
where source_url = 'https://www.onetonline.org/link/summary/15-1199.09' and id in (
  '99c58209-cc00-4940-a62b-ac89ff737a1b'
);

-- 19-1011.00 Animal Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1011.00'
where source_url = 'https://www.onetonline.org/link/summary/25-3093.00' and id in (
  '498ecb55-c136-492b-a034-32455a8c716e'
);

-- 19-1031.00 Conservation Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-1031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-and-social-science/conservation-scientists-and-foresters.htm' and id in (
  '32dcff21-4d05-463f-a5d1-332fa0e25a6a'
);

-- 19-2021.00 Atmospheric and Space Scientists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2021.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/atmospheric-scientists-and-geoscientists.htm' and id in (
  'aed40ffa-5144-4270-be1f-d5e8beb5964c'
);

-- 19-4013.00 Food Science Technicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4013.00'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.02' and id in (
  'ad6a86b6-1c88-434b-bf80-9771a097bbcd'
);

-- 23-1012.00 Judicial Law Clerks
update public.careers set source_url = 'https://www.onetonline.org/link/summary/23-1012.00'
where source_url = 'https://www.onetonline.org/link/summary/23-2092.00' and id in (
  '9761b636-41ea-4ae8-97d3-087a6931eeb0'
);

-- 25-3031.00 Substitute Teachers, Short-Term
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3031.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/teachers-kindergarten-and-elementary-school.htm' and id in (
  '43b74c51-2136-4b76-864c-76a033c573c2'
);

-- 25-3041.00 Tutors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3041.00'
where source_url = 'https://www.bls.gov/ooh/education-training-and-library/tutors-and-teachers.html' and id in (
  '0815d925-a3b4-4bec-8f72-ea2a7fbc2448'
);

-- 27-3011.00 Broadcast Announcers and Radio Disc Jockeys
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3011.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '2e10f388-89a7-4622-991a-cf8bf84f9e39'
);

-- 27-3023.00 News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  'e0f19af4-5ab0-47d2-a715-5e758ae3909b'
);

-- 27-3092.00 Court Reporters and Simultaneous Captioners
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3092.00'
where source_url = 'https://www.onetonline.org/link/summary/23-2091.00' and id in (
  'f835712c-fb54-49f5-ac6b-591531cd71e8'
);

-- 27-4032.00 Film and Video Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/multimedia-artists-and-animators.htm' and id in (
  '667305da-6861-4aa2-92be-0d022614723c'
);

-- 29-1151.00 Nurse Anesthetists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1151.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-occupations/anesthesiologists-and-nurse-anesthetists.htm' and id in (
  'b3843afc-483a-44d3-a6ae-18e324192488'
);

-- 29-1212.00 Cardiologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1212.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' and id in (
  '10fc9ed0-3b28-45d7-b0cc-2007f05d800a'
);

-- 29-1213.00 Dermatologists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1213.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-and-social-assistance/physicians-and-surgeons.htm' and id in (
  '395614dc-ee4f-43d7-a02a-e480e88ee0cd'
);

-- 29-1214.00 Emergency Medicine Physicians
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-1214.00'
where source_url = 'https://www.bls.gov/ooh/healthcare-practitioners-and-technical-occupations/physicians-and-surgeons.htm' and id in (
  '7bbd5f38-70da-4e99-bb55-31375e3b4387'
);

commit;
