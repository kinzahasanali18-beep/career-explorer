-- Age-inappropriate hide migration, chunk 4 of 4 — 8 statements.
-- Guarded on exact id and visible = true; idempotent.

begin;

-- Licensed Cannabis Operator
update public.careers set visible = false
where id = '1e78b99b-fa37-4558-91a4-a5c5f622b659' and visible = true;

-- Cannabis Agronomist
update public.careers set visible = false
where id = '25c6ebe1-c0b6-4803-9c60-907563ae4192' and visible = true;

-- Cannabis Lawyer
update public.careers set visible = false
where id = '26cc0dbe-0ed4-4967-b004-91ba570683cb' and visible = true;

-- Medical Cannabis Counselor
update public.careers set visible = false
where id = '68cd3da0-52c2-49e3-a38e-41696a9f1136' and visible = true;

-- Licensed Cannabis Producer
update public.careers set visible = false
where id = '927be0f9-8c55-4517-8267-486611232c1c' and visible = true;

-- Cannabis Industry Compliance Attorney
update public.careers set visible = false
where id = '94f56993-2af9-4f5e-91f9-087f27b1542f' and visible = true;

-- Medical Cannabis Specialist
update public.careers set visible = false
where id = '985e0877-42b1-46bc-9552-c038f81f9083' and visible = true;

-- Cannabis Compliance Attorney
update public.careers set visible = false
where id = '99a65443-bbb3-4bdd-b5e5-34163146d260' and visible = true;

commit;
