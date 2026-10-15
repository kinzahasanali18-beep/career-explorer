-- Age-inappropriate hide migration, chunk 2 of 4 — 10 statements.
-- Guarded on exact id and visible = true; idempotent.

begin;

-- Wine Service Manager
update public.careers set visible = false
where id = '1446b801-ed93-4789-a165-31322f4730df' and visible = true;

-- Sommelier (Wine Expert)
update public.careers set visible = false
where id = '293977c6-715e-44b1-b6e6-1ea0c7371541' and visible = true;

-- Sommelelier
update public.careers set visible = false
where id = '2e7c5a55-515b-46e3-a790-87d483add69a' and visible = true;

-- Sommelier Educator
update public.careers set visible = false
where id = '65eef333-96e4-4e85-9154-d65b1b5e134e' and visible = true;

-- Wine and Beverage Director
update public.careers set visible = false
where id = '7515fac5-2780-426e-b8fe-76d907d89a38' and visible = true;

-- Sommelier (Fine Dining)
update public.careers set visible = false
where id = '7a4f70cb-6f08-40f8-9220-3908ec4277a9' and visible = true;

-- Sommelier
update public.careers set visible = false
where id = '7e96ff76-bd51-4fd1-8580-dd99c1d99364' and visible = true;

-- Wine Sommelier
update public.careers set visible = false
where id = '8031f21e-1689-449c-8eb2-250f5c18d05a' and visible = true;

-- Sommelier (Wine Professional)
update public.careers set visible = false
where id = '8215aa3a-522d-4e58-8489-081c71d7fec9' and visible = true;

-- Certified Sommelier
update public.careers set visible = false
where id = '8f237be5-7427-428e-a154-0a79d9bda0f9' and visible = true;

commit;
