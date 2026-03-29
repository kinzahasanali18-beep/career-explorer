import { useState, useEffect, useRef } from "react";

// ─── INDUSTRY + CAREER DATA ───────────────────────────────────────────────────

const industries = [
  {
    id: "tech", name: "Tech & AI", icon: "◈", color: "#7F77DD", bg: "#EEEDFE",
    hints: ["...for storytellers", "...for activists", "...for athletes", "...for artists", "...for healers"],
    careers: [
      { title: "Machine Learning Engineer", salary: "$140–200k", school: "CS/Math degree or bootcamp", desc: "Train AI systems that learn from data. You sit at the center of the AI revolution.", day: "Running experiments, reviewing model performance, collaborating with product teams.", growth: [{ role: "Junior ML Engineer", salary: "$95k", years: "Now" }, { role: "ML Engineer", salary: "$140k", years: "2 yrs" }, { role: "Senior ML Engineer", salary: "$175k", years: "5 yrs" }, { role: "Staff / AI Lead", salary: "$230k+", years: "10 yrs" }] },
      { title: "AI Product Manager", salary: "$130–190k", school: "Any degree + PM experience", desc: "Bridge the gap between AI engineers and real users.", day: "Writing product specs, running user research, coordinating engineering and design sprints.", growth: [{ role: "Associate PM", salary: "$90k", years: "Now" }, { role: "Product Manager", salary: "$130k", years: "2 yrs" }, { role: "Senior PM", salary: "$160k", years: "5 yrs" }, { role: "Director of Product", salary: "$210k+", years: "10 yrs" }] },
      { title: "AI Ethics Researcher", salary: "$90–150k", school: "Philosophy, Law, or CS", desc: "One of the most important jobs of the next 50 years. Ensure AI is fair and safe.", day: "Auditing models for bias, writing policy briefs, collaborating with legal and engineering.", growth: [{ role: "Research Assistant", salary: "$70k", years: "Now" }, { role: "Ethics Researcher", salary: "$110k", years: "2 yrs" }, { role: "Senior Researcher", salary: "$145k", years: "5 yrs" }, { role: "Head of AI Ethics", salary: "$200k+", years: "10 yrs" }] },
      { title: "Creative Technologist", salary: "$85–140k", school: "Design, CS, or Fine Arts", desc: "Sit at the intersection of art and code. Build experiences that feel like magic.", day: "Prototyping interactive installations, pitching ideas to creative directors, coding in unusual environments.", growth: [{ role: "Jr Creative Tech", salary: "$65k", years: "Now" }, { role: "Creative Technologist", salary: "$95k", years: "2 yrs" }, { role: "Senior Creative Tech", salary: "$130k", years: "5 yrs" }, { role: "Creative Tech Director", salary: "$180k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "health", name: "Healthcare & Science", icon: "◎", color: "#1D9E75", bg: "#E1F5EE",
    hints: ["...without med school", "...for tech people", "...for the curious", "...at the frontier", "...for policy nerds"],
    careers: [
      { title: "Health Informatics Manager", salary: "$95–145k", school: "Health Informatics or CS degree", desc: "Manage how hospitals use data to save lives.", day: "Meeting with clinical staff, overseeing EHR systems, analyzing patient outcome data.", growth: [{ role: "Data Analyst", salary: "$65k", years: "Now" }, { role: "Informatics Specialist", salary: "$90k", years: "2 yrs" }, { role: "Informatics Manager", salary: "$120k", years: "5 yrs" }, { role: "Chief Informatics Officer", salary: "$180k+", years: "10 yrs" }] },
      { title: "Clinical AI Researcher", salary: "$110–170k", school: "Biology + CS or MD/PhD", desc: "Build AI that helps doctors diagnose diseases earlier and more accurately.", day: "Training models on medical imaging, presenting findings to clinicians, writing research papers.", growth: [{ role: "Research Assistant", salary: "$70k", years: "Now" }, { role: "Clinical AI Researcher", salary: "$115k", years: "2 yrs" }, { role: "Senior Researcher", salary: "$155k", years: "5 yrs" }, { role: "Research Director", salary: "$220k+", years: "10 yrs" }] },
      { title: "Bioethicist", salary: "$80–130k", school: "Philosophy, Medicine, or Law", desc: "Navigate the moral questions that come with medical advances.", day: "Consulting on hospital ethics committees, writing policy, teaching medical students.", growth: [{ role: "Ethics Coordinator", salary: "$60k", years: "Now" }, { role: "Bioethicist", salary: "$85k", years: "2 yrs" }, { role: "Senior Bioethicist", salary: "$115k", years: "5 yrs" }, { role: "Director of Ethics", salary: "$160k+", years: "10 yrs" }] },
      { title: "Digital Therapeutics PM", salary: "$120–175k", school: "Business, Health, or CS", desc: "Build FDA-approved apps that treat real medical conditions.", day: "Working with clinical teams, managing regulatory submissions, running product sprints.", growth: [{ role: "Associate PM", salary: "$85k", years: "Now" }, { role: "Product Manager", salary: "$125k", years: "2 yrs" }, { role: "Senior PM", salary: "$155k", years: "5 yrs" }, { role: "VP of Product", salary: "$210k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "biz", name: "Business & Finance", icon: "◉", color: "#BA7517", bg: "#FAEEDA",
    hints: ["...that changes lives", "...for creatives", "...at startups", "...in emerging markets", "...for risk-takers"],
    careers: [
      { title: "Venture Capitalist", salary: "$150–400k+", school: "Finance, Business, or top MBA", desc: "Evaluate startups and help decide which companies get funded.", day: "Taking founder meetings, conducting due diligence, attending board meetings.", growth: [{ role: "Analyst", salary: "$90k", years: "Now" }, { role: "Associate", salary: "$130k", years: "2 yrs" }, { role: "Principal", salary: "$200k", years: "5 yrs" }, { role: "Partner", salary: "$400k+", years: "10 yrs" }] },
      { title: "Impact Investment Analyst", salary: "$80–130k", school: "Finance, Economics, or Policy", desc: "Invest in companies doing good in the world — clean energy, education, healthcare access.", day: "Analyzing financial models, meeting with social enterprises, writing investment memos.", growth: [{ role: "Junior Analyst", salary: "$70k", years: "Now" }, { role: "Analyst", salary: "$90k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$115k", years: "5 yrs" }, { role: "Portfolio Director", salary: "$170k+", years: "10 yrs" }] },
      { title: "Startup CFO", salary: "$160–280k", school: "Accounting, Finance, or MBA", desc: "The financial brain of a startup. Help founders not run out of money.", day: "Building financial models, leading fundraising rounds, managing investor relations.", growth: [{ role: "Financial Analyst", salary: "$75k", years: "Now" }, { role: "Finance Manager", salary: "$110k", years: "2 yrs" }, { role: "VP Finance", salary: "$160k", years: "5 yrs" }, { role: "CFO", salary: "$280k+", years: "10 yrs" }] },
      { title: "Revenue Manager", salary: "$75–130k", school: "Business, Math, or Hospitality", desc: "Use data and algorithms to price products in real time.", day: "Analyzing demand patterns, adjusting pricing strategies, presenting forecasts to leadership.", growth: [{ role: "Revenue Analyst", salary: "$55k", years: "Now" }, { role: "Revenue Manager", salary: "$85k", years: "2 yrs" }, { role: "Senior Revenue Manager", salary: "$110k", years: "5 yrs" }, { role: "VP Revenue", salary: "$160k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "creative", name: "Creative & Culture", icon: "✦", color: "#D4537E", bg: "#FBEAF0",
    hints: ["...that pays well", "...at tech companies", "...with global reach", "...that shapes society", "...for systems thinkers"],
    careers: [
      { title: "Creative Director", salary: "$110–200k", school: "Design, Fine Arts, or self-taught portfolio", desc: "Set the visual and emotional direction for brands, campaigns, and products.", day: "Running creative reviews, briefing designers and writers, presenting concepts to clients.", growth: [{ role: "Junior Designer", salary: "$55k", years: "Now" }, { role: "Mid Designer", salary: "$85k", years: "2 yrs" }, { role: "Senior Designer", salary: "$120k", years: "5 yrs" }, { role: "Creative Director", salary: "$180k+", years: "10 yrs" }] },
      { title: "Music Supervisor", salary: "$70–150k", school: "Music, Film, or Communications", desc: "Choose the music for films, TV shows, and ads. One of the most coveted creative jobs in Hollywood.", day: "Pitching songs to directors, negotiating licensing deals, attending film cuts.", growth: [{ role: "Music Coordinator", salary: "$45k", years: "Now" }, { role: "Music Supervisor", salary: "$80k", years: "2 yrs" }, { role: "Sr Music Supervisor", salary: "$120k", years: "5 yrs" }, { role: "Head of Music", salary: "$180k+", years: "10 yrs" }] },
      { title: "Brand Strategist", salary: "$80–150k", school: "Marketing, Business, or Design", desc: "Figure out what a brand stands for and how it should show up in the world.", day: "Running brand workshops, analyzing cultural trends, writing strategy decks.", growth: [{ role: "Brand Analyst", salary: "$55k", years: "Now" }, { role: "Brand Strategist", salary: "$85k", years: "2 yrs" }, { role: "Sr Brand Strategist", salary: "$120k", years: "5 yrs" }, { role: "Chief Brand Officer", salary: "$200k+", years: "10 yrs" }] },
      { title: "Experience Designer", salary: "$90–155k", school: "Design, Architecture, or Theater", desc: "Design physical and digital experiences — pop-ups, retail, events, museums.", day: "Sketching spatial concepts, coordinating with architects, managing vendor builds.", growth: [{ role: "Jr Experience Designer", salary: "$60k", years: "Now" }, { role: "Experience Designer", salary: "$95k", years: "2 yrs" }, { role: "Sr Experience Designer", salary: "$130k", years: "5 yrs" }, { role: "Experience Director", salary: "$190k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "law", name: "Law & Policy", icon: "▣", color: "#378ADD", bg: "#E6F1FB",
    hints: ["...without being a lawyer", "...for tech people", "...that moves fast", "...that shapes history", "...at the UN"],
    careers: [
      { title: "Tech Policy Analyst", salary: "$80–140k", school: "Law, Poli Sci, or Economics", desc: "Write the laws and frameworks that govern AI and big tech.", day: "Researching legislation, briefing senators, writing policy white papers.", growth: [{ role: "Policy Coordinator", salary: "$55k", years: "Now" }, { role: "Policy Analyst", salary: "$80k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$110k", years: "5 yrs" }, { role: "Policy Director", salary: "$160k+", years: "10 yrs" }] },
      { title: "Startup General Counsel", salary: "$150–250k", school: "Law degree (JD)", desc: "Be the only lawyer at a fast-growing startup. Handle everything from contracts to fundraising.", day: "Reviewing term sheets, advising founders on risk, managing outside counsel.", growth: [{ role: "Associate Attorney", salary: "$90k", years: "Now" }, { role: "Staff Attorney", salary: "$130k", years: "2 yrs" }, { role: "General Counsel", salary: "$175k", years: "5 yrs" }, { role: "Chief Legal Officer", salary: "$280k+", years: "10 yrs" }] },
      { title: "Human Rights Investigator", salary: "$55–100k", school: "Law, International Relations, or Journalism", desc: "Document atrocities, protect witnesses, and build legal cases for international courts.", day: "Conducting field interviews, analyzing evidence, writing investigative reports.", growth: [{ role: "Research Assistant", salary: "$45k", years: "Now" }, { role: "Investigator", salary: "$65k", years: "2 yrs" }, { role: "Senior Investigator", salary: "$90k", years: "5 yrs" }, { role: "Director of Investigations", salary: "$130k+", years: "10 yrs" }] },
      { title: "Privacy Engineer", salary: "$130–190k", school: "CS + Law or Policy background", desc: "Build the technical systems that protect user data and keep companies compliant.", day: "Auditing data flows, implementing privacy-by-design features, advising engineering teams.", growth: [{ role: "Privacy Analyst", salary: "$85k", years: "Now" }, { role: "Privacy Engineer", salary: "$130k", years: "2 yrs" }, { role: "Senior Privacy Eng", salary: "$165k", years: "5 yrs" }, { role: "Head of Privacy", salary: "$220k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "sports", name: "Sports & Entertainment", icon: "▤", color: "#D85A30", bg: "#FAECE7",
    hints: ["...off the field", "...for data lovers", "...behind the scenes", "...for strategists", "...that travel the world"],
    careers: [
      { title: "Sports Analytics Lead", salary: "$90–160k", school: "Statistics, CS, or Sports Science", desc: "Help teams win using data. Every major league team now has an analytics department.", day: "Building player performance models, presenting insights to coaching staff, scouting via data.", growth: [{ role: "Data Analyst", salary: "$60k", years: "Now" }, { role: "Sports Analyst", salary: "$90k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$120k", years: "5 yrs" }, { role: "Head of Analytics", salary: "$180k+", years: "10 yrs" }] },
      { title: "Athlete Brand Manager", salary: "$80–160k", school: "Marketing, Business, or Communications", desc: "Build and protect the personal brand of professional athletes.", day: "Vetting brand deals, managing social content strategy, coordinating media appearances.", growth: [{ role: "Brand Coordinator", salary: "$50k", years: "Now" }, { role: "Brand Manager", salary: "$85k", years: "2 yrs" }, { role: "Sr Brand Manager", salary: "$120k", years: "5 yrs" }, { role: "Chief Brand Officer", salary: "$200k+", years: "10 yrs" }] },
      { title: "Fan Experience Director", salary: "$80–140k", school: "Business, Marketing, or Hospitality", desc: "Design what it feels like to be at a game, concert, or live event.", day: "Overseeing in-venue activations, managing sponsor integrations, analyzing fan feedback.", growth: [{ role: "Events Coordinator", salary: "$45k", years: "Now" }, { role: "Fan Experience Manager", salary: "$75k", years: "2 yrs" }, { role: "Director", salary: "$110k", years: "5 yrs" }, { role: "VP Fan Experience", salary: "$175k+", years: "10 yrs" }] },
      { title: "Esports Strategist", salary: "$70–130k", school: "Business, Marketing, or Game Design", desc: "One of the fastest growing industries in the world. Build teams, leagues, and brand partnerships in gaming.", day: "Scouting players, negotiating sponsorship deals, managing tournament logistics.", growth: [{ role: "Esports Coordinator", salary: "$50k", years: "Now" }, { role: "Esports Manager", salary: "$75k", years: "2 yrs" }, { role: "Sr Strategist", salary: "$105k", years: "5 yrs" }, { role: "Esports Director", salary: "$160k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "edu", name: "Education", icon: "▥", color: "#639922", bg: "#EAF3DE",
    hints: ["...that disrupts school", "...at tech companies", "...for entrepreneurs", "...that scales globally", "...for content creators"],
    careers: [
      { title: "EdTech Product Manager", salary: "$110–170k", school: "Education, CS, or Business", desc: "Build tools that change how millions of kids learn.", day: "Running teacher focus groups, writing product specs, analyzing learning outcome data.", growth: [{ role: "Associate PM", salary: "$80k", years: "Now" }, { role: "Product Manager", salary: "$115k", years: "2 yrs" }, { role: "Senior PM", salary: "$150k", years: "5 yrs" }, { role: "VP Product", salary: "$210k+", years: "10 yrs" }] },
      { title: "Learning Experience Designer", salary: "$70–120k", school: "Education, Instructional Design, or Psychology", desc: "Design how people learn — online courses, corporate training, school curricula.", day: "Storyboarding lessons, collaborating with subject matter experts, testing learning outcomes.", growth: [{ role: "Instructional Designer", salary: "$55k", years: "Now" }, { role: "LX Designer", salary: "$80k", years: "2 yrs" }, { role: "Senior LX Designer", salary: "$105k", years: "5 yrs" }, { role: "Director of Learning", salary: "$150k+", years: "10 yrs" }] },
      { title: "Education Policy Analyst", salary: "$65–110k", school: "Education, Public Policy, or Economics", desc: "Shape national education policy. Work with governments and think tanks to fix broken systems.", day: "Analyzing test score data, writing policy briefs, presenting to school boards.", growth: [{ role: "Policy Researcher", salary: "$50k", years: "Now" }, { role: "Policy Analyst", salary: "$70k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$95k", years: "5 yrs" }, { role: "Policy Director", salary: "$140k+", years: "10 yrs" }] },
      { title: "AI Curriculum Developer", salary: "$80–130k", school: "Education + CS background", desc: "Build the courses that teach the next generation how to use, build, and think about AI.", day: "Researching AI trends, writing curriculum, collaborating with teachers and engineers.", growth: [{ role: "Curriculum Writer", salary: "$55k", years: "Now" }, { role: "Curriculum Developer", salary: "$80k", years: "2 yrs" }, { role: "Sr Curriculum Dev", salary: "$110k", years: "5 yrs" }, { role: "Head of Curriculum", salary: "$155k+", years: "10 yrs" }] },
    ],
  },
  {
    id: "travel", name: "Travel & Hospitality", icon: "▦", color: "#534AB7", bg: "#CECBF6",
    hints: ["...that pays six figures", "...for tech people", "...for culture lovers", "...at luxury brands", "...that never stops growing"],
    careers: [
      { title: "Luxury Travel Advisor", salary: "$80–200k", school: "Hospitality, Business, or self-built client base", desc: "Curate extraordinary trips for high-net-worth clients.", day: "Consulting with clients on dream trips, booking exclusive experiences, managing complex itineraries.", growth: [{ role: "Travel Coordinator", salary: "$45k", years: "Now" }, { role: "Travel Advisor", salary: "$80k", years: "2 yrs" }, { role: "Senior Advisor", salary: "$130k", years: "5 yrs" }, { role: "Agency Owner / Director", salary: "$200k+", years: "10 yrs" }] },
      { title: "Destination Experience Designer", salary: "$70–130k", school: "Hospitality, Architecture, or Cultural Studies", desc: "Design what a destination feels like for tourists and travelers.", day: "Scouting locations, working with local artists and chefs, designing tour experiences.", growth: [{ role: "Experience Coordinator", salary: "$45k", years: "Now" }, { role: "Experience Designer", salary: "$75k", years: "2 yrs" }, { role: "Sr Experience Designer", salary: "$105k", years: "5 yrs" }, { role: "Director of Experiences", salary: "$155k+", years: "10 yrs" }] },
      { title: "Hotel General Manager", salary: "$100–300k", school: "Hospitality Management degree", desc: "Run an entire hotel — the staff, the guest experience, the finances, all of it.", day: "Walking the property, meeting department heads, handling VIP guests, reviewing financials.", growth: [{ role: "Front Desk Agent", salary: "$38k", years: "Now" }, { role: "Asst Manager", salary: "$65k", years: "2 yrs" }, { role: "Hotel GM", salary: "$120k", years: "5 yrs" }, { role: "Regional VP", salary: "$250k+", years: "10 yrs" }] },
      { title: "Travel Tech PM", salary: "$120–180k", school: "Business, CS, or Hospitality", desc: "Build the apps and platforms that power how people discover, book, and experience travel.", day: "Running sprints with engineers, conducting traveler research, defining product roadmap.", growth: [{ role: "Associate PM", salary: "$85k", years: "Now" }, { role: "Product Manager", salary: "$125k", years: "2 yrs" }, { role: "Senior PM", salary: "$155k", years: "5 yrs" }, { role: "Director of Product", salary: "$210k+", years: "10 yrs" }] },
    ],
  },
];

const intersectionCareers = {
  "tech,health": ["Clinical AI Researcher", "Health Informatics Manager", "Digital Therapeutics PM", "Biotech Data Scientist"],
  "tech,creative": ["Creative Technologist", "AI Art Director", "Experience Designer", "Generative AI Artist"],
  "tech,sports": ["Sports Analytics Lead", "Performance Tech Engineer", "Esports Strategist", "Fan Experience PM"],
  "tech,law": ["AI Policy Analyst", "Tech Lawyer", "Trust & Safety Lead", "Privacy Engineer"],
  "tech,edu": ["EdTech Founder", "AI Curriculum Developer", "Learning Experience Designer", "Education Data Scientist"],
  "tech,travel": ["Travel Tech PM", "Hospitality AI Lead", "Smart Hotel Innovator", "Destination Data Analyst"],
  "tech,biz": ["Fintech PM", "Startup CTO", "Quant Analyst", "Growth Engineer"],
  "health,law": ["Bioethicist", "Healthcare Policy Director", "Pharmaceutical Lawyer", "FDA Regulatory Specialist"],
  "health,biz": ["Healthcare Venture Capitalist", "Hospital CFO", "Pharma Brand Manager", "Medical Device Entrepreneur"],
  "health,edu": ["Medical Education Designer", "Public Health Educator", "Clinical Training Director", "Health Literacy Specialist"],
  "biz,creative": ["Brand Venture Investor", "Creative Agency Founder", "Culture Strategist", "Entertainment Deal Maker"],
  "biz,sports": ["Sports Franchise CFO", "Athlete Brand Manager", "Stadium Experience Director", "Sports Venture Capitalist"],
  "biz,travel": ["Hospitality Investment Analyst", "Hotel Asset Manager", "Tourism Board Director", "Travel Startup Founder"],
  "biz,law": ["Venture Capital Associate", "M&A Lawyer", "Startup General Counsel", "Impact Investment Analyst"],
  "sports,creative": ["Sports Photographer", "Stadium Experience Designer", "Sports Brand Creative Director", "Fan Culture Strategist"],
  "sports,edu": ["Athletic Director", "Sports Science Educator", "Coaching Education Developer", "Youth Sports Policy Analyst"],
  "edu,law": ["Education Policy Lawyer", "Student Rights Advocate", "School Board Consultant", "Education Reform Strategist"],
  "edu,creative": ["Curriculum Content Creator", "Educational Game Designer", "Museum Education Director", "Children's Media Producer"],
  "travel,creative": ["Destination Photographer", "Travel Content Creator", "Hospitality Brand Designer", "Cultural Experience Curator"],
  "travel,law": ["International Tourism Lawyer", "Immigration Consultant", "Hospitality Compliance Officer", "Aviation Rights Advocate"],
  "law,creative": ["Entertainment Lawyer", "IP & Copyright Strategist", "Music Rights Manager", "Art Law Specialist"],
};

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────

const quizzes = {
  abstract: {
    name: "The Abstract Quiz",
    description: "Strange questions. Surprising results.",
    questions: [
      { q: "You find an unmarked door. What do you do?", flavor: "There's no sign. No handle. Just a door.", opts: [{ icon: "◧", text: "Research it first", sub: "I want to know before I act.", value: "analytical" }, { icon: "◨", text: "Open it immediately", sub: "The unknown is the point.", value: "adventurous" }, { icon: "◩", text: "Sketch the door and walk away", sub: "I'd rather imagine what's behind it.", value: "creative" }, { icon: "◪", text: "Find someone who knows", sub: "There's always a person with the answer.", value: "social" }] },
      { q: "If your brain were a room, what would it look like?", flavor: "Close your eyes for a second.", opts: [{ icon: "▣", text: "A lab with experiments everywhere", sub: "Half-finished ideas all over the place.", value: "investigative" }, { icon: "▤", text: "A concert hall mid-performance", sub: "Loud, beautiful, a little chaotic.", value: "creative" }, { icon: "▥", text: "A very organized filing system", sub: "Everything labeled. Nothing out of place.", value: "analytical" }, { icon: "▦", text: "A living room full of people", sub: "Always someone new coming through.", value: "social" }] },
      { q: "A stranger gives you $10,000. You can't spend it on yourself.", flavor: "No wrong answer here.", opts: [{ icon: "◐", text: "Fund a project that solves something", sub: "I'd find the most broken thing and fix it.", value: "builder" }, { icon: "◑", text: "Give it to people I know need it", sub: "Impact closest to home first.", value: "social" }, { icon: "◒", text: "Invest it to make more", sub: "$10k can become $50k.", value: "analytical" }, { icon: "◓", text: "Use it to make something beautiful", sub: "A film, an event, a piece of art.", value: "creative" }] },
      { q: "Which superpower would quietly ruin your life?", flavor: "Think about it.", opts: [{ icon: "◔", text: "Reading everyone's mind", sub: "Too much noise. Too much truth.", value: "investigative" }, { icon: "◕", text: "Seeing every possible future", sub: "The weight of knowing what could go wrong.", value: "analytical" }, { icon: "◖", text: "Making everyone agree with you", sub: "You'd never know if they really meant it.", value: "social" }, { icon: "◗", text: "Creating anything instantly", sub: "The process is the whole point.", value: "creative" }] },
      { q: "You have to leave one thing behind forever. What's hardest?", flavor: "Be honest.", opts: [{ icon: "▲", text: "The ability to be surprised", sub: "Knowing what comes next would hollow everything out.", value: "adventurous" }, { icon: "△", text: "Making people feel seen", sub: "Connection is what I'm here for.", value: "social" }, { icon: "▴", text: "Building something that lasts", sub: "I need to know I made a mark.", value: "builder" }, { icon: "▵", text: "Figuring out how things work", sub: "Curiosity is my whole personality.", value: "investigative" }] },
    ],
  },
  cinematic: {
    name: "The Cinematic Quiz",
    description: "Pick movie scenes. Find where you belong.",
    questions: [
      { q: "Which scene feels most like your inner world?", flavor: "Don't overthink it — go with your gut.", opts: [{ icon: "◈", text: "The heist planning scene", sub: "Everyone has a role. The plan is everything.", value: "analytical" }, { icon: "✦", text: "The montage where it all comes together", sub: "Hard work. Growth. The music swells.", value: "builder" }, { icon: "◎", text: "The unexpected road trip", sub: "No map. Just people and possibility.", value: "adventurous" }, { icon: "◉", text: "The quiet scene where someone tells the truth", sub: "Real over polished, every time.", value: "social" }] },
      { q: "In every group project movie, you are...", flavor: "You know which one you are.", opts: [{ icon: "▣", text: "The one who sees what nobody else sees", sub: "And has to convince everyone to believe it.", value: "visionary" }, { icon: "▤", text: "The one who actually gets things done", sub: "While everyone argues, you're halfway there.", value: "builder" }, { icon: "▥", text: "The one who keeps everyone from falling apart", sub: "The glue. The heart.", value: "social" }, { icon: "▦", text: "The wildcard with the unexpected idea", sub: "Nobody saw it coming. It works.", value: "creative" }] },
      { q: "The villain in your story is...", flavor: "Every hero has one.", opts: [{ icon: "◐", text: "A broken system nobody else can see", sub: "You're fighting something invisible.", value: "investigative" }, { icon: "◑", text: "Wasted potential", sub: "Nothing bothers you more than talent going nowhere.", value: "builder" }, { icon: "◒", text: "Boredom. Repetition. Sameness.", sub: "You'd rather burn it down than be ordinary.", value: "adventurous" }, { icon: "◓", text: "Indifference", sub: "You feel things so the world doesn't have to.", value: "social" }] },
      { q: "The last scene of your movie shows you...", flavor: "What's the image?", opts: [{ icon: "◔", text: "Standing in front of something you built", sub: "A company, a city, a movement.", value: "builder" }, { icon: "◕", text: "Somewhere unexpected, bag in hand", sub: "The adventure isn't over.", value: "adventurous" }, { icon: "◖", text: "In a room full of people who matter to you", sub: "This is what it was all for.", value: "social" }, { icon: "◗", text: "Alone, looking at something only you understand", sub: "Satisfied. Finally.", value: "investigative" }] },
      { q: "Your origin story starts with...", flavor: "The moment everything shifted.", opts: [{ icon: "▲", text: "A question nobody could answer", sub: "So you had to find out yourself.", value: "investigative" }, { icon: "△", text: "A person who believed in you first", sub: "You've been trying to deserve it ever since.", value: "social" }, { icon: "▴", text: "Something broken you couldn't look away from", sub: "Fixing things is just who you are.", value: "builder" }, { icon: "▵", text: "A feeling you couldn't name but had to chase", sub: "You're still chasing it.", value: "creative" }] },
    ],
  },
  moody: {
    name: "The Deep Dive",
    description: "Introspective. What drives you at your core?",
    questions: [
      { q: "What keeps you up at night — not with anxiety, but with aliveness?", flavor: "The thing your brain won't let go of.", opts: [{ icon: "◧", text: "A problem I haven't solved yet", sub: "The kind that feels just within reach.", value: "investigative" }, { icon: "◨", text: "A world that could be so much better", sub: "And the gap between here and there.", value: "builder" }, { icon: "◩", text: "Something I want to make that doesn't exist yet", sub: "I can see it. I just can't build it yet.", value: "creative" }, { icon: "◪", text: "People. Always people.", sub: "What they feel. What they need. What they could become.", value: "social" }] },
      { q: "When you help someone and it works, what felt best?", flavor: "Be specific with yourself.", opts: [{ icon: "▣", text: "That I saw what others missed", sub: "The insight was mine.", value: "investigative" }, { icon: "▤", text: "That I actually did something about it", sub: "Not just talked — acted.", value: "builder" }, { icon: "▥", text: "The look on their face", sub: "The moment it landed.", value: "social" }, { icon: "▦", text: "That I found a way nobody expected", sub: "Creative solutions are my love language.", value: "creative" }] },
      { q: "What do you want people to say about you at 60?", flavor: "Not what you achieved. What you were.", opts: [{ icon: "◐", text: "They saw things coming before anyone else", sub: "A mind ahead of its time.", value: "visionary" }, { icon: "◑", text: "They made something that mattered", sub: "Built something real.", value: "builder" }, { icon: "◒", text: "They made people feel less alone", sub: "Their presence changed the room.", value: "social" }, { icon: "◓", text: "They never stopped asking why", sub: "Relentless curiosity until the end.", value: "investigative" }] },
      { q: "The most honest version of why you care about your future?", flavor: "Strip away the impressive answer.", opts: [{ icon: "◔", text: "I want to understand how the world actually works", sub: "Not the version we're sold.", value: "investigative" }, { icon: "◕", text: "I want to build something bigger than me", sub: "Something that outlasts me.", value: "builder" }, { icon: "◖", text: "I want the people I love to be okay", sub: "Everything else is secondary.", value: "social" }, { icon: "◗", text: "I want to feel like I used all of myself", sub: "No wasted potential.", value: "creative" }] },
      { q: "The version of you that settled — what did they give up?", flavor: "You've imagined them. We all have.", opts: [{ icon: "▲", text: "The chance to ask the questions that scared them", sub: "They played it safe intellectually.", value: "investigative" }, { icon: "△", text: "The thing they were building in secret", sub: "They stopped before it was real.", value: "builder" }, { icon: "▴", text: "The people they could have brought with them", sub: "They went alone.", value: "social" }, { icon: "▵", text: "The work that would have felt like play", sub: "They chose stable over alive.", value: "creative" }] },
    ],
  },
};

const profiles = {
  analytical: { type: "The Architect", title: "You think in systems", desc: "You see patterns others miss and need to understand the 'why' behind everything.", industryFit: ["tech", "biz", "law"] },
  creative: { type: "The Maker", title: "You build worlds", desc: "You're driven by the need to make things that didn't exist before.", industryFit: ["creative", "tech", "edu"] },
  social: { type: "The Connector", title: "You move through people", desc: "You understand what humans need before they say it.", industryFit: ["edu", "travel", "sports"] },
  investigative: { type: "The Explorer", title: "You chase truth", desc: "Curiosity is your engine. You need work that keeps revealing new layers.", industryFit: ["health", "law", "tech"] },
  builder: { type: "The Operator", title: "You make things real", desc: "Ideas are fine. But you need to see something get built.", industryFit: ["tech", "biz", "travel"] },
  adventurous: { type: "The Pioneer", title: "You need the frontier", desc: "Routine is your kryptonite. You belong somewhere the map hasn't been drawn yet.", industryFit: ["travel", "sports", "creative"] },
  visionary: { type: "The Visionary", title: "You live in the future", desc: "You see what doesn't exist yet and can't stop talking about it.", industryFit: ["tech", "biz", "edu"] },
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const S = {
  app: { maxWidth: 520, margin: "0 auto", minHeight: "100vh", background: "#F7F6F3", fontFamily: "'Inter', system-ui, sans-serif" },
  screen: { padding: "1.5rem 1.25rem" },
  eyebrow: { fontSize: 11, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 },
  headline: { fontSize: 28, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: 8 },
  sub: { fontSize: 15, color: "#666", lineHeight: 1.6, marginBottom: 6 },
  back: { background: "none", border: "none", color: "#999", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 },
  pill: { display: "inline-block", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 600 },
  card: { background: "#fff", borderRadius: 18, padding: "1.1rem 1.15rem", border: "1px solid #EBEBEB", marginBottom: 10 },
  primaryBtn: { width: "100%", padding: "0.9rem", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  ghostBtn: { width: "100%", padding: "0.9rem", background: "transparent", color: "#999", border: "1px solid #E0E0E0", borderRadius: 14, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  prog: { height: 3, background: "#EBEBEB", borderRadius: 2, marginBottom: 24 },
  progFill: (pct, color) => ({ height: 3, width: `${pct}%`, background: color || "#1a1a1a", borderRadius: 2, transition: "width 0.4s" }),
  timelineRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 },
  timelineDot: (active, color) => ({ width: 28, height: 28, borderRadius: "50%", background: active ? color : "#F0F0F0", border: `2px solid ${active ? color : "#E0E0E0"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }),
  timelineLine: { width: 2, background: "#EBEBEB", margin: "0 13px", flexShrink: 0 },
};

// ─── INDUSTRY PICKER ──────────────────────────────────────────────────────────

function IndustryPicker({ onDone }) {
  const [selected, setSelected] = useState(new Set());
  const [hints, setHints] = useState({});
  const [hintIdx, setHintIdx] = useState({});

  useEffect(() => {
    const init = {};
    industries.forEach(ind => { init[ind.id] = 0; });
    setHintIdx(init);
    const interval = setInterval(() => {
      setHintIdx(prev => {
        const next = { ...prev };
        industries.forEach(ind => { next[ind.id] = (prev[ind.id] + 1) % ind.hints.length; });
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  function toggle(id) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  const intersections = getIntersections(selected);

  return (
    <div style={S.screen}>
      <div style={S.eyebrow}>Step 1 of 2</div>
      <div style={{ ...S.headline, fontSize: 26 }}>What world pulls you in?</div>
      <div style={S.sub}>Pick anything that feels interesting. We'll show you careers at the edges — and the intersections nobody talks about.</div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 20, cursor: "pointer", textDecoration: "underline" }} onClick={() => onDone([])}>Skip — show me everything</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {industries.map(ind => {
          const sel = selected.has(ind.id);
          return (
            <div key={ind.id} onClick={() => toggle(ind.id)} style={{ background: sel ? ind.bg : "#fff", border: sel ? `2px solid ${ind.color}` : "1px solid #EBEBEB", borderRadius: 16, padding: "1rem", cursor: "pointer", transition: "all 0.15s", position: "relative" }}>
              {sel && <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: "50%", background: ind.color, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span></div>}
              <div style={{ fontSize: 20, marginBottom: 6 }}>{ind.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>{ind.name}</div>
              <div style={{ fontSize: 11, color: ind.color, fontWeight: 500, minHeight: 14, transition: "opacity 0.3s" }}>{ind.hints[hintIdx[ind.id] || 0]}</div>
            </div>
          );
        })}
      </div>

      {intersections.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "0.9rem 1rem", border: "1px solid #EBEBEB", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Careers at your intersections</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {intersections.slice(0, 6).map(c => <span key={c} style={{ background: "#F0EFFE", border: "1px solid #D0CBFA", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "#534AB7", fontWeight: 500 }}>{c}</span>)}
          </div>
        </div>
      )}

      {selected.size > 0 && <div style={{ fontSize: 12, color: "#aaa", marginBottom: 14 }}>{selected.size} {selected.size === 1 ? "world" : "worlds"} selected</div>}

      <button style={S.primaryBtn} onClick={() => onDone(Array.from(selected))}>Find my careers →</button>
      <div style={{ height: 8 }} />
      <button style={S.ghostBtn} onClick={() => onDone([])}>Explore freely without filters</button>
    </div>
  );
}

function getIntersections(selected) {
  const arr = Array.from(selected);
  let found = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const k1 = `${arr[i]},${arr[j]}`;
      const k2 = `${arr[j]},${arr[i]}`;
      const careers = intersectionCareers[k1] || intersectionCareers[k2];
      if (careers) found = [...new Set([...found, ...careers])];
    }
  }
  return found;
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

function HomeScreen({ selectedIndustries, onSelectMode, onReset }) {
  const modes = [
    { id: "abstract", icon: "◈", name: "The Abstract Quiz", desc: "Strange questions. Surprising results." },
    { id: "cinematic", icon: "◎", name: "The Cinematic Quiz", desc: "Pick movie scenes. Find where you fit." },
    { id: "bubble", icon: "✦", name: "Career Bubble Map", desc: "Click and explore. Watch careers branch." },
    { id: "moody", icon: "◉", name: "The Deep Dive", desc: "Introspective. What drives you at your core?" },
  ];

  const activeIndustries = selectedIndustries.length > 0 ? industries.filter(i => selectedIndustries.includes(i.id)) : industries;

  return (
    <div style={S.screen}>
      <div style={S.eyebrow}>Career Explorer</div>
      <div style={{ ...S.headline, fontSize: 30, marginBottom: 4 }}>What will you become?</div>
      <div style={{ ...S.sub, marginBottom: 16 }}>Explore careers you've never heard of.</div>

      {selectedIndustries.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {activeIndustries.map(ind => (
            <span key={ind.id} style={{ background: ind.bg, border: `1px solid ${ind.color}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: ind.color }}>{ind.icon} {ind.name}</span>
          ))}
          <span onClick={onReset} style={{ background: "#F5F5F5", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "#aaa", cursor: "pointer" }}>Change ×</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {modes.map(m => (
          <div key={m.id} onClick={() => onSelectMode(m.id)} style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16, padding: "1.1rem", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#EBEBEB"}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: "#999", lineHeight: 1.4 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ ...S.eyebrow, marginBottom: 10 }}>Browse by industry</div>
      {activeIndustries.map(ind => (
        <div key={ind.id} onClick={() => onSelectMode("industry:" + ind.id)} style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 14, padding: "0.85rem 1rem", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
          onMouseEnter={e => e.currentTarget.style.background = ind.bg}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
          <span style={{ fontSize: 18 }}>{ind.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{ind.name}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{ind.careers.length} careers inside</div>
          </div>
          <span style={{ color: "#ccc", fontSize: 16 }}>›</span>
        </div>
      ))}
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────

function QuizScreen({ quizKey, onBack, onComplete }) {
  const quiz = quizzes[quizKey];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scores, setScores] = useState({});
  const question = quiz.questions[currentQ];
  const progress = (currentQ / quiz.questions.length) * 100;
  const accentColor = "#7F77DD";

  function handleNext() {
    if (!selected) return;
    const newScores = { ...scores, [selected]: (scores[selected] || 0) + 1 };
    setScores(newScores);
    setSelected(null);
    if (currentQ + 1 < quiz.questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      const top = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      onComplete(top);
    }
  }

  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onBack}>← Back</button>
      <div style={S.prog}><div style={S.progFill(progress, accentColor)} /></div>
      <div style={S.eyebrow}>Question {currentQ + 1} of {quiz.questions.length}</div>
      <div style={{ ...S.headline, fontSize: 21, marginBottom: 4 }}>{question.q}</div>
      <div style={{ fontSize: 13, color: "#aaa", fontStyle: "italic", marginBottom: 20 }}>{question.flavor}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {question.opts.map(opt => (
          <div key={opt.value} onClick={() => setSelected(opt.value)} style={{ background: selected === opt.value ? "#EEEDFE" : "#fff", border: selected === opt.value ? `2px solid ${accentColor}` : "1px solid #EBEBEB", borderRadius: 14, padding: "0.9rem 1rem", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", transition: "all 0.15s" }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{opt.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{opt.text}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{opt.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleNext} style={{ ...S.primaryBtn, background: selected ? "#1a1a1a" : "#E0E0E0", color: selected ? "#fff" : "#aaa", cursor: selected ? "pointer" : "default" }}>
        {currentQ + 1 === quiz.questions.length ? "See my results" : "Continue"}
      </button>
    </div>
  );
}

// ─── RESULT ───────────────────────────────────────────────────────────────────

function ResultScreen({ profileKey, selectedIndustries, onBack, onExploreBubble, onViewCareer }) {
  const fallbackKeys = ["analytical", "creative", "social", "investigative", "builder", "adventurous", "visionary"];
  const profile = profiles[profileKey] || profiles[fallbackKeys[0]];
  const relevantIndustries = selectedIndustries.length > 0
    ? industries.filter(i => selectedIndustries.includes(i.id) || profile.industryFit.includes(i.id))
    : industries.filter(i => profile.industryFit.includes(i.id));
  const suggestedCareers = relevantIndustries.flatMap(i => i.careers).slice(0, 6);

  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onBack}>← Back</button>
      <div style={{ textAlign: "center", padding: "1rem 0 1.5rem" }}>
        <div style={{ display: "inline-block", background: "#EEEDFE", color: "#534AB7", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 10, letterSpacing: "0.05em" }}>{profile.type}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{profile.title}</div>
        <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>{profile.desc}</div>
      </div>
      <div style={S.eyebrow}>Careers that match you</div>
      {suggestedCareers.map(c => (
        <div key={c.title} onClick={() => onViewCareer(c)} style={{ ...S.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{c.salary}</div>
          </div>
          <span style={{ color: "#ccc", fontSize: 18 }}>›</span>
        </div>
      ))}
      <div style={{ height: 12 }} />
      <button style={S.primaryBtn} onClick={onExploreBubble}>Explore the career universe →</button>
    </div>
  );
}

// ─── CAREER DETAIL ────────────────────────────────────────────────────────────

function CareerDetail({ career, industryColor, onBack }) {
  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onBack}>← Back</button>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{career.title}</div>
        <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 12 }}>{career.desc}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "#F0F0F0", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#555" }}>{career.salary}</span>
          <span style={{ background: "#F0EFFE", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 500, color: "#534AB7" }}>{career.school}</span>
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: 16 }}>
        <div style={S.eyebrow}>A day in the life</div>
        <div style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>{career.day}</div>
      </div>

      <div style={S.eyebrow}>Career roadmap</div>
      <div style={{ background: "#fff", borderRadius: 18, padding: "1.1rem 1.15rem", border: "1px solid #EBEBEB", marginBottom: 20 }}>
        {career.growth.map((step, i) => (
          <div key={i}>
            <div style={S.timelineRow}>
              <div style={S.timelineDot(i === 0, industryColor || "#7F77DD")}>
                {i === 0 ? <span style={{ fontSize: 8, color: "#fff", fontWeight: 700 }}>YOU</span> : <span style={{ fontSize: 9, color: i === 0 ? "#fff" : "#aaa" }}>{i + 1}</span>}
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{step.role}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{step.years} · {step.salary}</div>
              </div>
            </div>
            {i < career.growth.length - 1 && <div style={{ ...S.timelineLine, height: 16, marginBottom: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INDUSTRY BROWSE ──────────────────────────────────────────────────────────

function IndustryBrowse({ industryId, onBack, onViewCareer }) {
  const industry = industries.find(i => i.id === industryId);
  if (!industry) return null;
  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onBack}>← Back</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 28 }}>{industry.icon}</span>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a" }}>{industry.name}</div>
      </div>
      <div style={{ ...S.sub, marginBottom: 20 }}>Careers inside this world</div>
      {industry.careers.map(c => (
        <div key={c.title} onClick={() => onViewCareer(c, industry.color)} style={{ ...S.card, cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = industry.bg}
          onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6, lineHeight: 1.4 }}>{c.desc}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ background: "#F5F5F5", borderRadius: 10, padding: "2px 8px", fontSize: 11, color: "#666" }}>{c.salary}</span>
              </div>
            </div>
            <span style={{ color: "#ccc", fontSize: 18, marginLeft: 8 }}>›</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── BUBBLE MAP ───────────────────────────────────────────────────────────────

function BubbleScreen({ selectedIndustries, onBack, onViewCareer }) {
  const wrapRef = useRef(null);
  const [activeBubble, setActiveBubble] = useState(null);
  const [visited, setVisited] = useState(new Set());
  const activeInds = selectedIndustries.length > 0 ? industries.filter(i => selectedIndustries.includes(i.id)) : industries.slice(0, 6);
  const allCareers = activeInds.flatMap(ind => ind.careers.map(c => ({ ...c, industryColor: ind.color, industryBg: ind.bg })));

  const positions = allCareers.map((_, i) => {
    const angle = (i / allCareers.length) * 2 * Math.PI;
    const r = 30 + (i % 3) * 12;
    return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
  });

  function selectBubble(c, pos, idx) {
    setActiveBubble({ ...c, pos, idx });
    setVisited(prev => new Set([...prev, c.title]));
  }

  return (
    <div style={S.screen}>
      <button style={S.back} onClick={onBack}>← Back</button>
      <div style={S.eyebrow}>Career universe</div>
      <div style={{ fontSize: 12, color: "#bbb", marginBottom: 12 }}>Tap any bubble to explore</div>
      <div ref={wrapRef} style={{ position: "relative", width: "100%", height: 380, background: "#FAFAFA", borderRadius: 18, border: "1px solid #EBEBEB", overflow: "hidden", marginBottom: 12 }}>
        {allCareers.map((c, i) => {
          const pos = positions[i];
          const isActive = activeBubble?.title === c.title;
          const isVisited = visited.has(c.title);
          const r = 34 + (c.title.length % 3) * 6;
          return (
            <div key={c.title} onClick={() => selectBubble(c, pos, i)} style={{ position: "absolute", width: r * 2, height: r * 2, left: `calc(${pos.x}% - ${r}px)`, top: `calc(${pos.y}% - ${r}px)`, borderRadius: "50%", background: isActive ? c.industryColor : c.industryBg, border: `2px solid ${c.industryColor}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: activeBubble && !isActive ? 0.4 : isVisited ? 0.75 : 1, transform: isActive ? "scale(1.12)" : "scale(1)", transition: "all 0.2s", textAlign: "center", padding: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "#fff" : c.industryColor, lineHeight: 1.2 }}>{c.title}</span>
            </div>
          );
        })}
      </div>
      {activeBubble && (
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{activeBubble.title}</div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, marginBottom: 10 }}>{activeBubble.desc}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ background: "#F5F5F5", borderRadius: 10, padding: "3px 10px", fontSize: 11, color: "#666" }}>{activeBubble.salary}</span>
            <span style={{ background: "#F0EFFE", borderRadius: 10, padding: "3px 10px", fontSize: 11, color: "#534AB7" }}>{activeBubble.school}</span>
          </div>
          <button onClick={() => onViewCareer(activeBubble, activeBubble.industryColor)} style={{ ...S.primaryBtn, fontSize: 13, padding: "0.7rem" }}>See full career roadmap →</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("industry");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [resultProfile, setResultProfile] = useState(null);
  const [activeCareer, setActiveCareer] = useState(null);
  const [activeCareerColor, setActiveCareerColor] = useState(null);
  const [browseIndustry, setBrowseIndustry] = useState(null);

  function handleIndustryDone(ids) { setSelectedIndustries(ids); setScreen("home"); }
  function handleSelectMode(mode) {
    if (mode.startsWith("industry:")) { setBrowseIndustry(mode.split(":")[1]); setScreen("browse"); return; }
    if (mode === "bubble") { setScreen("bubble"); return; }
    setActiveQuiz(mode); setScreen("quiz");
  }
  function handleViewCareer(career, color) { setActiveCareer(career); setActiveCareerColor(color); setScreen("career"); }

  return (
    <div style={S.app}>
      {screen === "industry" && <IndustryPicker onDone={handleIndustryDone} />}
      {screen === "home" && <HomeScreen selectedIndustries={selectedIndustries} onSelectMode={handleSelectMode} onReset={() => setScreen("industry")} />}
      {screen === "quiz" && <QuizScreen quizKey={activeQuiz} onBack={() => setScreen("home")} onComplete={p => { setResultProfile(p); setScreen("result"); }} />}
      {screen === "result" && <ResultScreen profileKey={resultProfile} selectedIndustries={selectedIndustries} onBack={() => setScreen("home")} onExploreBubble={() => setScreen("bubble")} onViewCareer={handleViewCareer} />}
      {screen === "career" && <CareerDetail career={activeCareer} industryColor={activeCareerColor} onBack={() => setScreen(resultProfile ? "result" : browseIndustry ? "browse" : "bubble")} />}
      {screen === "browse" && <IndustryBrowse industryId={browseIndustry} onBack={() => setScreen("home")} onViewCareer={handleViewCareer} />}
      {screen === "bubble" && <BubbleScreen selectedIndustries={selectedIndustries} onBack={() => setScreen("home")} onViewCareer={handleViewCareer} />}
    </div>
  );
}
