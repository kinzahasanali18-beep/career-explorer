-- Hide 38 age-inappropriate careers (gambling, alcohol, cannabis).
--
-- Source: reports/AGE_APPROPRIATE_REVIEW_2026-10-15.csv, rows where
-- recommendation = HIDE. Each was reviewed on meaning against the career's
-- own description/requirements, not on keyword match alone -- 6 raw keyword
-- hits (metaphorical 'weapon', film distributors, a law-enforcement 21+
-- hiring floor, an elected-office age minimum) were reviewed and excluded
-- as false positives, and are not in this migration. The 4 BORDERLINE rows
-- (alcohol incidental to a general F&B/hospitality role) are also NOT in
-- this migration and remain visible.
--
-- Only visible changes, to false. primary_industry, secondary_industries,
-- reviewed, source_url, and source_type are untouched and captured in the
-- backup/manifest as witness columns.
--
-- Rows: 38, one statement each.
--
-- Each statement is guarded by exact id AND visible = true, so a row
-- already hidden by some other process is skipped rather than
-- redundantly touched. Re-running is a no-op.
--
-- Prior values: reports/phase4c_age_inappropriate_hide_backup_before.csv
-- Revert:       reports/phase4c_age_inappropriate_hide_revert.sql

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
