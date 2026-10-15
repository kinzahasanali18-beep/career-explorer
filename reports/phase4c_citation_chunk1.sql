-- Phase 4c citation fixes, chunk 1 of 4 — 25 rows, 4 statements.
-- Guarded on the exact prior source_url; idempotent.

begin;

-- 27-3023.00 News Analysts, Reporters, and Journalists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-3023.00'
where source_url = 'https://www.bls.gov/ooh/media-and-communication/reporters-and-correspondents.htm' and id in (
  '0fa5ce48-8833-486b-965f-e179833cca73',
  '13ebd229-b98d-4bf2-a9a8-549fc3a807b7',
  '29df0e82-ff26-4895-97ca-5a7e9eb7d2ce',
  '929c4575-4558-43c5-bf92-2e482123dc97',
  'b9feef08-8079-48df-8791-6306101b8e0e',
  'ba613049-49db-4627-8b93-702086e4e5c5',
  'd1ecea5f-0843-4f68-b33c-103b7004d88f',
  'e45fe45c-e06e-489b-8f1a-a980e9c5cf8f',
  'f62523e5-fd2a-4da1-b9cb-f975648cd7a9'
);

-- 27-4032.00 Film and Video Editors
update public.careers set source_url = 'https://www.onetonline.org/link/summary/27-4032.00'
where source_url = 'https://www.onetonline.org/link/summary/27-4008.00' and id in (
  '05a1f0e0-58f4-4433-ae46-dade34894c3e',
  '188cbd49-26ab-467f-ae1b-fa8a1b242376',
  '192e7620-0820-4a63-a5e4-38917d8c112c',
  '1b5fa13d-133b-41ef-8249-3d5af8242a68',
  '1d51a567-ac74-4a0a-bacd-a331a4cbc607',
  '37955160-cf48-4e31-9a42-56aabdedcf82'
);

-- 15-1253.00 Software Quality Assurance Analysts and Testers
update public.careers set source_url = 'https://www.onetonline.org/link/summary/15-1253.00'
where source_url = 'https://www.onetonline.org/link/summary/15-1256.00' and id in (
  '22ae346a-0942-4450-9a8c-317384ea61c3',
  '3f740066-bc7b-44c1-a4b1-0a91efcd582c',
  'c978c25c-fd07-42e8-84fc-8c5fb5b3e541',
  'd3ef55b2-1209-4b65-9461-e642697c937b',
  'f1f49d00-dad3-4b72-a0cb-5a53266dfed6'
);

-- 19-2031.00 Chemists
update public.careers set source_url = 'https://www.onetonline.org/link/summary/19-2031.00'
where source_url = 'https://www.bls.gov/ooh/life-physical-social-science/chemists-and-materials-scientists.htm' and id in (
  '46195c3d-c921-4d62-8ea8-06040f2bdb18',
  '569ce2bf-403b-4365-805e-a132285e9e40',
  'de2f269e-d8d1-43e4-b843-492b8b27868a',
  'de7bfe85-416c-4cf8-b5ef-95b17c3dc42c',
  'e5ebc79d-f5aa-4f71-a9de-50805be419f1'
);

commit;
