-- Revert the second batch of Q4 primary_industry changes.
-- Generated before any write.
begin;
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = 'e54734bf-cbb9-4d58-a2d7-9e94d63aa77d';  -- Experience Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = '1bd40894-8a80-441f-9fba-1a00c3025c6e';  -- Metaverse Architect
update public.careers set primary_industry = 'Architecture & Urban Planning' where id = 'ace61410-e798-44af-9266-5228db32d3e6';  -- Virtual Reality Architect
update public.careers set primary_industry = 'Tech & Engineering' where id = '1e385456-6895-46cf-af1c-5f17705d94d4';  -- Information Architect
commit;
