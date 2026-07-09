-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Creates and seeds the hidden_gems table used by the Hidden Gems page.

create table if not exists public.hidden_gems (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  industry      text not null,               -- matches World tag values used elsewhere
  age_range     text not null,               -- display string, e.g. "HS", "13+", "18-23"
  wow_line      text not null,               -- punchy one-sentence hook shown on the card
  description   text not null,               -- 2-4 sentence explanation shown on expand
  status        text not null,               -- neutral phrasing only
  url           text not null,               -- official program page
  cost_note     text,                        -- e.g. "Free", "$65 application fee"
  verified_date date not null default current_date,
  created_at    timestamp with time zone default now()
);

alter table public.hidden_gems enable row level security;

-- Public read access (page fetches with the anon key)
drop policy if exists "Anyone can read hidden gems" on public.hidden_gems;
create policy "Anyone can read hidden gems"
  on public.hidden_gems for select
  using ( true );

-- ─── Seed data — 18 Tech & Engineering records (verified_date = today) ─────────
insert into public.hidden_gems (name, industry, age_range, wow_line, description, status, url, cost_note, verified_date) values
('Regeneron Science Talent Search', 'Tech & Engineering', 'HS', 'Present your research in DC to a room that includes Nobel laureates.', 'Top 40 finalists are flown to Washington, DC and present research to thousands of visitors, including government and scientific leaders. Over $1.8 million awarded collectively. Selected from ~2,600 applicants.', 'Active — fall deadline (Nov 5, 2026)', 'https://www.societyforscience.org/regeneron-sts/', 'Free', '2026-07-09'),
('Congressional App Challenge', 'Tech & Engineering', 'MS + HS', 'Win your district and get your app displayed in the U.S. Capitol for a year.', 'Build an app, win your congressional district''s challenge, and get invited to Capitol Hill for the #HouseOfCode reception. Free to enter, no elite-school gatekeeping.', 'Active — summer/fall window', 'https://www.congressionalappchallenge.us/', 'Free', '2026-07-09'),
('Thiel Fellowship', 'Tech & Engineering', '22 and under', '$200,000 to skip or drop out of college and build your idea full-time.', 'Direct funding plus access to a network of Silicon Valley founders and investors. No degree required — that''s the whole point.', 'Active — rolling', 'https://thielfellowship.org/', 'Free (you get paid)', '2026-07-09'),
('Interact Fellowship', 'Tech & Engineering', '18-23', 'Fully-sponsored retreats twice a year, and under 10% get in.', 'A tight-knit, largely word-of-mouth fellowship. Fellows attend two fully-sponsored retreats a year (lodging, meals, travel covered).', 'Active — winter deadline', 'https://interactfellowship.com/', 'Free', '2026-07-09'),
('SPARC', 'Tech & Engineering', 'HS', 'Free program where you get to talk one-on-one with CEOs and academics who fly in just to meet you.', 'Originally built for elite math competitors (IMO-level), but open beyond that. Discovered almost entirely through word of mouth in online communities.', 'Active — spring deadline', 'https://www.sparc-camp.org/', 'Free', '2026-07-09'),
('Hack Club', 'Tech & Engineering', 'HS', 'Free hardware grants, global hackathons, and once, a chartered train across America ending at SpaceX.', 'A worldwide teen hacker network. Entry point is just joining their free Slack. Known for extreme, all-expenses-paid events (train hackathons, HQ tours at Figma/GitHub/SpaceX).', 'Active — rolling', 'https://hackclub.com/', 'Free', '2026-07-09'),
('Genes in Space', 'Tech & Engineering', 'Grades 7-12', 'Design a DNA experiment — and if you win, astronauts run it for you on the ISS.', 'No lab access needed to enter, just the idea. Winners watch their experiment performed live on the International Space Station.', 'Active — spring deadline', 'https://www.genesinspace.org/', 'Free', '2026-07-09'),
('Rise', 'Tech & Engineering', '15-17', '100 Global Winners get a lifetime of benefits: a funded summit, a 4-year scholarship, and lifetime funding access.', 'Backed by a $1B commitment from Schmidt Futures and the Rhodes Trust. Formally partnered with the Congressional App Challenge. NOTE: verify current application cycle before publishing — Schmidt Futures has been restructuring.', 'Verify current status', 'https://www.risefortheworld.org/', 'Free', '2026-07-09'),
('Emergent Ventures', 'Tech & Engineering', '13+', 'One of the world''s top economists personally reviews your idea and can fund it within days.', 'Run by Tyler Cowen. Grants of $1,000-$50,000, rolling applications, famously fast decisions — no committee, no bureaucracy.', 'Active — rolling', 'https://www.mercatus.org/emergent-ventures', 'Free (you get paid)', '2026-07-09'),
('NASA App Development Challenge', 'Tech & Engineering', 'MS/HS', 'Top teams tour NASA''s Mission Control and present to real astronauts.', 'Teams solve real technical problems for deep space missions. Currently paused — NASA says check back in August 2027.', 'Paused for 2026', 'https://www.nasa.gov/', 'Free', '2026-07-09'),
('Zero Robotics', 'Tech & Engineering', 'HS', 'Your code runs on real satellites aboard the International Space Station.', 'A programming competition where finalists compete in a live championship using SPHERES satellites on the ISS. NOTE: verify current program status before publishing.', 'Verify current status', 'https://zerorobotics.mit.edu/', 'Free', '2026-07-09'),
('NASA OSTEM High School Internship', 'Tech & Engineering', 'HS 16+', 'Get paid to work on real NASA missions with a NASA scientist as your mentor — while still in high school.', 'Paid internships across NASA field centers, some remote. Requires US citizenship and 3.0 GPA. Three sessions a year (fall, spring, summer).', 'Active — Summer 2027 deadline Feb 26, 2027', 'https://www.nasa.gov/learning-resources/internship-programs/', 'Free (paid stipend)', '2026-07-09'),
('MIT PRIMES', 'Tech & Engineering', 'HS juniors/sophomores', 'Do real MIT-mentored math research for a year — some projects get published.', 'Free, year-long research program. MIT PRIMES (local) requires living near Boston for in-person meetings; PRIMES-USA is fully remote for students elsewhere. As of 2025, focused on Math and Computational Biology only (no new CS admissions).', 'Active — fall deadline (~Nov 30)', 'https://math.mit.edu/research/highschool/primes/', 'Free', '2026-07-09'),
('Google Code Next', 'Tech & Engineering', 'HS 9-12', 'A free, multi-year CS program run by Google, with real Googlers as mentors.', 'Designed for Black and Latinx high schoolers. In-person labs in Oakland, NYC, Detroit, Inglewood; a virtual ''Code Next Connect'' track is open nationally to students 13+.', 'Active — check current window', 'https://codenext.withgoogle.com/', 'Free', '2026-07-09'),
('Girls Who Code Summer Immersion Program', 'Tech & Engineering', 'HS 9-11 (girls/non-binary)', 'A free 2-week virtual coding program with a real tech-company partner — no experience required.', 'Open to girls and non-binary students, no GPA/transcript/recommendation letters needed. $300 need-based grant available for US students.', 'Active — winter/spring deadline (Feb-Apr)', 'https://girlswhocode.com/programs/summer-immersion-program', 'Free', '2026-07-09'),
('Research Science Institute (RSI)', 'Tech & Engineering', 'HS juniors', '100 students picked from thousands get 6 fully-funded weeks doing real research at MIT.', 'Covers tuition, room, and board. One of the most selective HS research programs in the world. Only current juniors eligible — seniors cannot apply.', 'Active — winter deadline (~Dec 10)', 'https://www.cee.org/programs/research-science-institute', '$65 application fee', '2026-07-09'),
('Conrad Challenge', 'Tech & Engineering', '13-18 (teams)', 'Invent a product solving a global problem — finalists pitch at Space Center Houston like a real startup.', 'Teams of 2-5 progress through stages culminating in an in-person summit near NASA''s Johnson Space Center. Winners get an all-expenses-paid trip and scholarships up to $88,000.', 'Active — fall registration (Aug-Oct)', 'https://conrad.spacecenter.org/', 'Free through stage 2, $499 entry fee from stage 3', '2026-07-09'),
('NASA SEES (UT Austin)', 'Tech & Engineering', 'HS sophomores/juniors', 'Work with NASA scientists on real satellite data through UT Austin — on campus or virtual.', 'NASA-funded, hosted by UT Austin''s Center for Space Research. On-site housing/meals/transportation covered. Only current sophomores/juniors eligible.', 'Active — winter deadline (~Feb 22)', 'https://csr.utexas.edu/education-outreach/high-school-internships/sees/', 'Free', '2026-07-09');
