-- Age-inappropriate hide migration, chunk 3 of 4 — 10 statements.
-- Guarded on exact id and visible = true; idempotent.

begin;

-- Sommelier (Hotel/Event)
update public.careers set visible = false
where id = '934d0b94-9a44-4774-8819-83a1809bf0cb' and visible = true;

-- Sommelier (Restaurant)
update public.careers set visible = false
where id = '95b07fb3-d67c-4331-9fb9-70fd7f67600b' and visible = true;

-- Beverage Director
update public.careers set visible = false
where id = 'afa0d50f-cb50-424a-b2ff-f0d8a60efeb2' and visible = true;

-- Wine Distributor
update public.careers set visible = false
where id = 'b9c4b8e7-19ae-4579-8660-1b5a5ab0244f' and visible = true;

-- Craft Brewery Owner
update public.careers set visible = false
where id = 'ba263731-3ac7-42c1-8267-0225dda1aae0' and visible = true;

-- Sommelier (Wine Specialist)
update public.careers set visible = false
where id = 'bc3b107a-e12e-4c3a-bab6-7d571ab6ed82' and visible = true;

-- Sommelier (Wine Director)
update public.careers set visible = false
where id = 'c68f5396-a01c-44f6-8651-f361285dbed4' and visible = true;

-- Wine Bar Manager
update public.careers set visible = false
where id = 'c9b412f4-660b-40fd-a3c1-9f64ab03b39a' and visible = true;

-- Sommelier (Hotel/Restaurant)
update public.careers set visible = false
where id = 'f1f6ebb0-c753-4dfe-b75e-21247a216ba9' and visible = true;

-- Licensed Premises Owner (Bar/Pub)
update public.careers set visible = false
where id = '4fd2c2bb-a5b7-461e-839a-665243c9a8b5' and visible = true;

commit;
