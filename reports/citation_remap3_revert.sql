-- Revert the follow-up coach corrections.
begin;
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = '16ef0fed-1c94-41e9-b7d3-e989c5c99171';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = '3736357a-06b4-41ca-9406-ccf9c86ba5f9';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = '5df62117-dc2a-43e7-9798-6f164c644103';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = '6e09eaac-9092-4bda-b77e-c7e51b0a9ad4';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = '7aedb14b-46aa-4b0e-8398-12511345bc05';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-9032.00' where id = '9993df73-749a-4dc6-bcc7-a3412532e3ec';
update public.careers set source_url = 'https://www.onetonline.org/link/summary/39-3091.00' where id = 'bc231d75-a28f-45f5-a917-144b51065d77';
commit;
