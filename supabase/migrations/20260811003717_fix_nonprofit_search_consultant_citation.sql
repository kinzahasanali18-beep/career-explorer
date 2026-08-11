-- One-row correction, from re-checking the previous migration's output.
--
-- My rule ordering put the nonprofit rule ahead of the recruiting rule, so
-- "Nonprofit Executive Director Search Consultant" was mapped to Social and
-- Community Service Managers. Executive search is recruiting, not service
-- management. Better than the Chief Sustainability Officers code it started on,
-- but still wrong.
--
-- Only one row in the table hits this ordering flaw.

begin;

update public.careers
set source_url = 'https://www.onetonline.org/link/summary/13-1071.00'  -- Human Resources Specialists
where id = '951525b2-8552-43fe-9cdc-68b8fc29af9f'
  and source_url = 'https://www.onetonline.org/link/summary/11-9151.00';

commit;
