-- Age-inappropriate hide migration, chunk 1 of 4 — 10 statements.
-- Guarded on exact id and visible = true; idempotent.

begin;

-- Casino Hospitality Manager
update public.careers set visible = false
where id = '3256fb0c-68ee-48dc-8f70-c37b7776ba61' and visible = true;

-- Casino Floor Manager
update public.careers set visible = false
where id = '694859d9-e9f4-470c-874d-6899034ded6a' and visible = true;

-- Casino Gaming Manager
update public.careers set visible = false
where id = '6fb9fbd4-d282-4845-a32e-ac8c0b7232f5' and visible = true;

-- Casino Manager
update public.careers set visible = false
where id = '75a8bb65-20de-411f-b872-7fe48abf8870' and visible = true;

-- Casino Host Manager
update public.careers set visible = false
where id = '86b5ca31-41ca-43df-814c-840e29719e1e' and visible = true;

-- Casino Operations Manager
update public.careers set visible = false
where id = 'e505baa9-22e6-4744-a82c-675b9febf708' and visible = true;

-- Casino Host
update public.careers set visible = false
where id = 'f5b35226-1278-4ce7-bcb7-c73f4c2968c0' and visible = true;

-- Restaurant Sommelier
update public.careers set visible = false
where id = '0257d979-8d0e-4c56-8973-f2d8e4d930dc' and visible = true;

-- Hotel Sommelier
update public.careers set visible = false
where id = '0a999900-d202-48b4-8da2-5e9dde473fc0' and visible = true;

-- Sommelier Event Coordinator
update public.careers set visible = false
where id = '0cffd08f-878e-430e-a0e9-cc17ba1c3aa7' and visible = true;

commit;
