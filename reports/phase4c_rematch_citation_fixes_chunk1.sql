-- Phase 4c rematch citation fixes, chunk 1 of 4 — 29 rows, 7 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 27-3023.00 News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  '47e016e0-dddd-4cb1-a0bb-f31699cb1a48',
  '5c05267b-e782-4671-bce5-0f4e42d94cf6',
  '7186a48b-565c-4869-b08c-abfa4c2c370c',
  '849addb7-bcb6-41b6-beda-35737768d568',
  '9ff5c444-9590-434d-9461-60aaa4a94c13',
  'a76063ab-ebc3-4456-b6ef-b7cc51755cc3',
  'c271786f-442a-4059-abf1-d8ceb0bac69b',
  'cc380a76-8962-49db-9a78-88ad4858f7dd',
  'f41a2f15-5408-4b19-a2f5-9f9cda16f8b6',
  'f94e04e4-28c4-4b1d-b4f3-4a2d51b308c4'
);

-- 25-2031.00 Secondary School Teachers, Except Special and Career/Technical Education
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-2031.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '209e4f3f-95f4-44fd-b3d1-ee6a96d32625',
  '4b42c163-cc8a-4539-830d-e714ffb99313',
  '6642e935-49e6-49fc-bc84-329feed05f36',
  '66e97033-37a3-4a37-842c-f5320b93b5b5',
  '69b5237e-b5f7-4ce7-9b9c-cdb14954645d',
  'b328e72d-89a0-4538-b9fb-ae5d5879ea19'
);

-- 25-3011.00 
update public.careers set source_url = 'https://www.onetonline.org/link/summary/25-3011.00'
where source_url = 'https://www.bls.gov/ooh/education-and-training/high-school-teachers.htm' and id in (
  '13195332-20ce-46d0-89df-01631c538869',
  '2c8a3f2d-036e-4fff-b8e0-db98464fd371',
  '8a8dd900-5968-4186-b913-74e63d066bde',
  'd4f04120-d851-4d3e-82c7-1090c0c26c24'
);

-- 11-9051.00 Food Service Managers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/11-9051.00'
where source_url = 'https://www.bls.gov/ooh/management/general-managers-and-top-executives.htm' and id in (
  '0d66f43b-3a92-4980-ab00-1c6d437f15e0',
  'bac095a8-8ca4-448d-96e2-6a36919915e4',
  'f30281cb-0688-4580-84b7-08f6a038276a'
);

-- 19-4099.01 Quality Control Analysts
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-4099.01'
where source_url = 'https://www.onetonline.org/link/summary/19-4011.00' and id in (
  '835063b8-6896-424f-9429-b4e095f45899',
  'cdadaf75-79b4-46b4-8205-3ce0f61db3af'
);

-- 27-3023.00 News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/radio-and-television-broadcasters.htm' and id in (
  '030c1cf0-2e24-4ce3-b289-175ae319a4c3',
  'ef24fb2c-e153-4765-a888-555150d7b4de'
);

-- 29-2072.00 Medical Records Specialists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/29-2072.00'
where source_url = 'https://www.onetonline.org/link/summary/29-2071.00' and id in (
  '6062b780-e7a8-4622-9229-be2aaaba1d6a',
  '8c9979d8-6105-4461-af29-0447479ad036'
);

commit;
