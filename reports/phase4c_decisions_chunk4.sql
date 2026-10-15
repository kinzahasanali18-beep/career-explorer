-- Phase 4c decisions migration, chunk 4 of 4 — 14 statements.
-- Guarded on exact id and exact prior source_url; idempotent.

begin;

-- 1 row -> 39-3099.00 Entertainment Attendants and Related Workers, All Other
--    Casino Host
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3099.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/personal-care-and-service/gaming-services-workers.htm' and id in (
  'f5b35226-1278-4ce7-bcb7-c73f4c2968c0'
);

-- 1 row -> 41-1011.00 First-Line Supervisors of Retail Sales Workers
--    Pop-Up Retail Owner
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-1011.00', source_type = 'related'
where source_url = 'https://www.onetonline.org/link/summary/11-3011.00' and id in (
  '931ec5dc-ee9c-4c4b-b950-cd81de15cbed'
);

-- 1 row -> 41-9022.00 Real Estate Sales Agents
--    Real Estate Wholesale Entrepreneur
update public.careers set source_url = 'https://www.onetonline.org/link/summary/41-9022.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/sales/real-estate-sales-agents-and-brokers.htm' and id in (
  '87e54e34-064e-40ae-ab29-e6c5ab22ed4b'
);

-- 1 row -> 53-3033.00 Light Truck Drivers
--    Local Delivery Service Operator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/53-3033.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/transportation-and-material-moving/delivery-and-stockroom-associates.htm' and id in (
  '100e52b4-df60-48d7-bc8d-445df9f6b7df'
);

-- 1 row -> 53-3033.00 Light Truck Drivers
--    Delivery Service Operator
update public.careers set source_url = 'https://www.onetonline.org/link/summary/53-3033.00', source_type = 'related'
where source_url = 'https://www.bls.gov/ooh/transportation-and-material-moving/delivery-and-logistics-workers.htm' and id in (
  'de3916da-79a2-4cfe-8ea2-33196b1d1062'
);

-- Sports Analyst (prior source_url: https://www.onetonline.org/link/summary/27-3022.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '1174f284-9985-48de-9df1-8b74879ffc92' and source_url = 'https://www.onetonline.org/link/summary/27-3022.00';

-- Performance Analyst (Sports) (prior source_url: https://www.onetonline.org/link/summary/19-4011.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '3322b430-dcc3-4c44-b781-74162ea5199f' and source_url = 'https://www.onetonline.org/link/summary/19-4011.00';

-- Sports Analyst (Stats and Broadcasting) (prior source_url: https://www.bls.gov/ooh/media-and-communication/broadcasters-and-sound-engineering-technicians.htm)
update public.careers set source_type = 'emerging', source_url = null
where id = '38a00a0f-2ab3-40b4-add2-43688d59dbc2' and source_url = 'https://www.bls.gov/ooh/media-and-communication/broadcasters-and-sound-engineering-technicians.htm';

-- Vending Machine Route Owner (prior source_url: https://www.bls.gov/ooh/management/self-employed-workers.htm)
update public.careers set source_type = 'emerging', source_url = null
where id = '3dfc9fca-13de-4238-8fee-8c6b6bc7c35c' and source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm';

-- Personal Stylist (Sustainable Fashion) (prior source_url: https://www.onetonline.org/link/summary/39-3094.00)
update public.careers set source_type = 'emerging', source_url = null
where id = '67082acb-03e4-4a9b-a2e1-8acf0238ee2e' and source_url = 'https://www.onetonline.org/link/summary/39-3094.00';

-- Cultural Attaché (prior source_url: https://www.onetonline.org/link/summary/11-3011.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'a53d0a1d-7bcd-4f45-81d4-eec2c7b6a511' and source_url = 'https://www.onetonline.org/link/summary/11-3011.00';

-- Wine Distributor (prior source_url: https://www.onetonline.org/link/summary/41-4081.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'b9c4b8e7-19ae-4579-8660-1b5a5ab0244f' and source_url = 'https://www.onetonline.org/link/summary/41-4081.00';

-- AI Prompt Engineer (prior source_url: https://www.onetonline.org/link/summary/15-1257.00)
update public.careers set source_type = 'emerging', source_url = null
where id = 'dabeb9c9-a02d-4aa7-89d7-b547bb78264d' and source_url = 'https://www.onetonline.org/link/summary/15-1257.00';

-- Local Service Business Operator
update public.careers set visible = false
where id = 'd4f1382e-6cdc-469d-bd92-64a68fd47155' and source_url = 'https://www.bls.gov/ooh/management/self-employed-workers.htm';

commit;
