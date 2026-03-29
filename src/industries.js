export const industries = [
  {
    id: 'tech',
    name: 'Tech & AI',
    icon: '◈',
    color: '#7F77DD',
    bg: '#EEEDFE',
    hints: ['...for storytellers','...for activists','...for athletes','...for artists','...for healers'],
    careers: [
      { title: 'Machine Learning Engineer', salary: '$140–200k', school: 'CS/Math degree or bootcamp', desc: 'Train AI systems that learn from data. You sit at the center of the AI revolution.', day: 'Running experiments, reviewing model performance, collaborating with product teams.', growth: [{role:'Junior ML Engineer',salary:'$95k',years:'Now'},{role:'ML Engineer',salary:'$140k',years:'2 yrs'},{role:'Senior ML Engineer',salary:'$175k',years:'5 yrs'},{role:'Staff Engineer / AI Lead',salary:'$230k+',years:'10 yrs'}] },
      { title: 'AI Product Manager', salary: '$130–190k', school: 'Any degree + PM experience', desc: 'Bridge the gap between AI engineers and real users.', day: 'Writing product specs, running user research, coordinating engineering and design sprints.', growth: [{role:'Associate PM',salary:'$90k',years:'Now'},{role:'Product Manager',salary:'$130k',years:'2 yrs'},{role:'Senior PM',salary:'$160k',years:'5 yrs'},{role:'Director of Product',salary:'$210k+',years:'10 yrs'}] },
      { title: 'AI Ethics Researcher', salary: '$90–150k', school: 'Philosophy, Law, or CS', desc: 'One of the most important jobs of the next 50 years. Ensure AI is fair and safe.', day: 'Auditing models for bias, writing policy briefs, collaborating with legal and engineering.', growth: [{role:'Research Assistant',salary:'$70k',years:'Now'},{role:'Ethics Researcher',salary:'$110k',years:'2 yrs'},{role:'Senior Researcher',salary:'$145k',years:'5 yrs'},{role:'Head of AI Ethics',salary:'$200k+',years:'10 yrs'}] },
      { title: 'Creative Technologist', salary: '$85–140k', school: 'Design, CS, or Fine Arts', desc: 'Sit at the intersection of art and code. Build experiences that feel like magic.', day: 'Prototyping interactive installations, pitching ideas to creative directors, coding in unusual environments.', growth: [{role:'Jr Creative Tech',salary:'$65k',years:'Now'},{role:'Creative Technologist',salary:'$95k',years:'2 yrs'},{role:'Senior Creative Tech',salary:'$130k',years:'5 yrs'},{role:'Creative Tech Director',salary:'$180k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'health',
    name: 'Healthcare & Science',
    icon: '◎',
    color: '#1D9E75',
    bg: '#E1F5EE',
    hints: ['...without med school','...for tech people','...for the curious','...at the frontier','...for policy nerds'],
    careers: [
      { title: 'Health Informatics Manager', salary: '$95–145k', school: 'Health Informatics or CS degree', desc: 'Manage how hospitals and health systems use data to save lives.', day: 'Meeting with clinical staff, overseeing EHR systems, analyzing patient outcome data.', growth: [{role:'Data Analyst',salary:'$65k',years:'Now'},{role:'Informatics Specialist',salary:'$90k',years:'2 yrs'},{role:'Informatics Manager',salary:'$120k',years:'5 yrs'},{role:'Chief Health Informatics Officer',salary:'$180k+',years:'10 yrs'}] },
      { title: 'Clinical AI Researcher', salary: '$110–170k', school: 'Biology + CS or MD/PhD', desc: 'Build AI that helps doctors diagnose diseases earlier and more accurately.', day: 'Training models on medical imaging, presenting findings to clinicians, writing research papers.', growth: [{role:'Research Assistant',salary:'$70k',years:'Now'},{role:'Clinical AI Researcher',salary:'$115k',years:'2 yrs'},{role:'Senior Researcher',salary:'$155k',years:'5 yrs'},{role:'Research Director',salary:'$220k+',years:'10 yrs'}] },
      { title: 'Bioethicist', salary: '$80–130k', school: 'Philosophy, Medicine, or Law', desc: 'Navigate the moral questions that come with medical advances — gene editing, AI diagnostics, end-of-life care.', day: 'Consulting on hospital ethics committees, writing policy, teaching medical students.', growth: [{role:'Ethics Coordinator',salary:'$60k',years:'Now'},{role:'Bioethicist',salary:'$85k',years:'2 yrs'},{role:'Senior Bioethicist',salary:'$115k',years:'5 yrs'},{role:'Director of Ethics',salary:'$160k+',years:'10 yrs'}] },
      { title: 'Digital Therapeutics PM', salary: '$120–175k', school: 'Business, Health, or CS', desc: 'Build FDA-approved apps that treat real medical conditions — depression, diabetes, ADHD.', day: 'Working with clinical teams, managing regulatory submissions, running product sprints.', growth: [{role:'Associate PM',salary:'$85k',years:'Now'},{role:'Product Manager',salary:'$125k',years:'2 yrs'},{role:'Senior PM',salary:'$155k',years:'5 yrs'},{role:'VP of Product',salary:'$210k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'biz',
    name: 'Business & Finance',
    icon: '◉',
    color: '#BA7517',
    bg: '#FAEEDA',
    hints: ['...that changes lives','...for creatives','...at startups','...in emerging markets','...for risk-takers'],
    careers: [
      { title: 'Venture Capitalist', salary: '$150–400k+', school: 'Finance, Business, or top MBA', desc: 'Evaluate startups, meet founders, and help decide which companies get funded.', day: 'Taking founder meetings, conducting due diligence, attending board meetings, sourcing deals.', growth: [{role:'Analyst',salary:'$90k',years:'Now'},{role:'Associate',salary:'$130k',years:'2 yrs'},{role:'Principal',salary:'$200k',years:'5 yrs'},{role:'Partner',salary:'$400k+',years:'10 yrs'}] },
      { title: 'Impact Investment Analyst', salary: '$80–130k', school: 'Finance, Economics, or Policy', desc: 'Invest in companies doing good in the world — clean energy, education, healthcare access.', day: 'Analyzing financial models, meeting with social enterprises, writing investment memos.', growth: [{role:'Junior Analyst',salary:'$70k',years:'Now'},{role:'Analyst',salary:'$90k',years:'2 yrs'},{role:'Senior Analyst',salary:'$115k',years:'5 yrs'},{role:'Portfolio Director',salary:'$170k+',years:'10 yrs'}] },
      { title: 'Startup CFO', salary: '$160–280k', school: 'Accounting, Finance, or MBA', desc: 'The financial brain of a startup. You help founders not run out of money while building something big.', day: 'Building financial models, leading fundraising rounds, managing investor relations.', growth: [{role:'Financial Analyst',salary:'$75k',years:'Now'},{role:'Finance Manager',salary:'$110k',years:'2 yrs'},{role:'VP Finance',salary:'$160k',years:'5 yrs'},{role:'CFO',salary:'$280k+',years:'10 yrs'}] },
      { title: 'Revenue Manager', salary: '$75–130k', school: 'Business, Math, or Hospitality', desc: 'Use data and algorithms to price products in real time. Hotels, airlines, and SaaS companies all need this.', day: 'Analyzing demand patterns, adjusting pricing strategies, presenting forecasts to leadership.', growth: [{role:'Revenue Analyst',salary:'$55k',years:'Now'},{role:'Revenue Manager',salary:'$85k',years:'2 yrs'},{role:'Senior Revenue Manager',salary:'$110k',years:'5 yrs'},{role:'VP Revenue',salary:'$160k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'creative',
    name: 'Creative & Culture',
    icon: '✦',
    color: '#D4537E',
    bg: '#FBEAF0',
    hints: ['...that pays well','...at tech companies','...with global reach','...that shapes society','...for systems thinkers'],
    careers: [
      { title: 'Creative Director', salary: '$110–200k', school: 'Design, Fine Arts, or self-taught portfolio', desc: 'Set the visual and emotional direction for brands, campaigns, and products.', day: 'Running creative reviews, briefing designers and writers, presenting concepts to clients.', growth: [{role:'Junior Designer',salary:'$55k',years:'Now'},{role:'Mid Designer',salary:'$85k',years:'2 yrs'},{role:'Senior Designer',salary:'$120k',years:'5 yrs'},{role:'Creative Director',salary:'$180k+',years:'10 yrs'}] },
      { title: 'Music Supervisor', salary: '$70–150k', school: 'Music, Film, or Communications', desc: 'Choose the music for films, TV shows, and ads. One of the most coveted creative jobs in Hollywood.', day: 'Pitching songs to directors, negotiating licensing deals, attending film cuts and edits.', growth: [{role:'Music Coordinator',salary:'$45k',years:'Now'},{role:'Music Supervisor',salary:'$80k',years:'2 yrs'},{role:'Sr Music Supervisor',salary:'$120k',years:'5 yrs'},{role:'Head of Music',salary:'$180k+',years:'10 yrs'}] },
      { title: 'Brand Strategist', salary: '$80–150k', school: 'Marketing, Business, or Design', desc: 'Figure out what a brand stands for and how it should show up in the world.', day: 'Running brand workshops, analyzing cultural trends, writing strategy decks.', growth: [{role:'Brand Analyst',salary:'$55k',years:'Now'},{role:'Brand Strategist',salary:'$85k',years:'2 yrs'},{role:'Sr Brand Strategist',salary:'$120k',years:'5 yrs'},{role:'Chief Brand Officer',salary:'$200k+',years:'10 yrs'}] },
      { title: 'Experience Designer', salary: '$90–155k', school: 'Design, Architecture, or Theater', desc: 'Design physical and digital experiences — pop-ups, retail environments, events, museums.', day: 'Sketching spatial concepts, coordinating with architects, managing vendor builds.', growth: [{role:'Jr Experience Designer',salary:'$60k',years:'Now'},{role:'Experience Designer',salary:'$95k',years:'2 yrs'},{role:'Sr Experience Designer',salary:'$130k',years:'5 yrs'},{role:'Experience Director',salary:'$190k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'law',
    name: 'Law & Policy',
    icon: '▣',
    color: '#378ADD',
    bg: '#E6F1FB',
    hints: ['...without being a lawyer','...for tech people','...that moves fast','...that shapes history','...at the UN'],
    careers: [
      { title: 'Tech Policy Analyst', salary: '$80–140k', school: 'Law, Poli Sci, or Economics', desc: 'Write the laws and frameworks that govern AI and big tech. High stakes, high impact.', day: 'Researching legislation, briefing senators, writing policy white papers.', growth: [{role:'Policy Coordinator',salary:'$55k',years:'Now'},{role:'Policy Analyst',salary:'$80k',years:'2 yrs'},{role:'Senior Analyst',salary:'$110k',years:'5 yrs'},{role:'Policy Director',salary:'$160k+',years:'10 yrs'}] },
      { title: 'Startup General Counsel', salary: '$150–250k', school: 'Law degree (JD)', desc: 'Be the only lawyer at a fast-growing startup. Handle everything from contracts to fundraising to HR.', day: 'Reviewing term sheets, advising founders on risk, managing outside counsel.', growth: [{role:'Associate Attorney',salary:'$90k',years:'Now'},{role:'Staff Attorney',salary:'$130k',years:'2 yrs'},{role:'General Counsel',salary:'$175k',years:'5 yrs'},{role:'Chief Legal Officer',salary:'$280k+',years:'10 yrs'}] },
      { title: 'Human Rights Investigator', salary: '$55–100k', school: 'Law, International Relations, or Journalism', desc: 'Document atrocities, protect witnesses, and build legal cases for international courts.', day: 'Conducting field interviews, analyzing evidence, writing investigative reports.', growth: [{role:'Research Assistant',salary:'$45k',years:'Now'},{role:'Investigator',salary:'$65k',years:'2 yrs'},{role:'Senior Investigator',salary:'$90k',years:'5 yrs'},{role:'Director of Investigations',salary:'$130k+',years:'10 yrs'}] },
      { title: 'Privacy Engineer', salary: '$130–190k', school: 'CS + Law or Policy background', desc: 'Build the technical systems that protect user data and keep companies compliant with global privacy laws.', day: 'Auditing data flows, implementing privacy-by-design features, advising engineering teams.', growth: [{role:'Privacy Analyst',salary:'$85k',years:'Now'},{role:'Privacy Engineer',salary:'$130k',years:'2 yrs'},{role:'Senior Privacy Eng',salary:'$165k',years:'5 yrs'},{role:'Head of Privacy',salary:'$220k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Entertainment',
    icon: '▤',
    color: '#D85A30',
    bg: '#FAECE7',
    hints: ['...off the field','...for data lovers','...behind the scenes','...for strategists','...that travel the world'],
    careers: [
      { title: 'Sports Analytics Lead', salary: '$90–160k', school: 'Statistics, CS, or Sports Science', desc: 'Help teams win using data. Every major league team now has an analytics department.', day: 'Building player performance models, presenting insights to coaching staff, scouting via data.', growth: [{role:'Data Analyst',salary:'$60k',years:'Now'},{role:'Sports Analyst',salary:'$90k',years:'2 yrs'},{role:'Senior Analyst',salary:'$120k',years:'5 yrs'},{role:'Head of Analytics',salary:'$180k+',years:'10 yrs'}] },
      { title: 'Athlete Brand Manager', salary: '$80–160k', school: 'Marketing, Business, or Communications', desc: 'Build and protect the personal brand of professional athletes. Part PR, part business strategy.', day: 'Vetting brand deals, managing social content strategy, coordinating media appearances.', growth: [{role:'Brand Coordinator',salary:'$50k',years:'Now'},{role:'Brand Manager',salary:'$85k',years:'2 yrs'},{role:'Sr Brand Manager',salary:'$120k',years:'5 yrs'},{role:'Chief Brand Officer',salary:'$200k+',years:'10 yrs'}] },
      { title: 'Fan Experience Director', salary: '$80–140k', school: 'Business, Marketing, or Hospitality', desc: 'Design what it feels like to be at a game, concert, or live event. The best in the business make it unforgettable.', day: 'Overseeing in-venue activations, managing sponsor integrations, analyzing fan feedback data.', growth: [{role:'Events Coordinator',salary:'$45k',years:'Now'},{role:'Fan Experience Manager',salary:'$75k',years:'2 yrs'},{role:'Director',salary:'$110k',years:'5 yrs'},{role:'VP Fan Experience',salary:'$175k+',years:'10 yrs'}] },
      { title: 'Esports Strategist', salary: '$70–130k', school: 'Business, Marketing, or Game Design', desc: 'One of the fastest growing industries in the world. Build teams, leagues, and brand partnerships in gaming.', day: 'Scouting players, negotiating sponsorship deals, managing tournament logistics.', growth: [{role:'Esports Coordinator',salary:'$50k',years:'Now'},{role:'Esports Manager',salary:'$75k',years:'2 yrs'},{role:'Sr Strategist',salary:'$105k',years:'5 yrs'},{role:'Esports Director',salary:'$160k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'edu',
    name: 'Education',
    icon: '▥',
    color: '#639922',
    bg: '#EAF3DE',
    hints: ['...that disrupts school','...at tech companies','...for entrepreneurs','...that scales globally','...for content creators'],
    careers: [
      { title: 'EdTech Product Manager', salary: '$110–170k', school: 'Education, CS, or Business', desc: 'Build tools that change how millions of kids learn. One of the most meaningful PM roles in tech.', day: 'Running teacher focus groups, writing product specs, analyzing learning outcome data.', growth: [{role:'Associate PM',salary:'$80k',years:'Now'},{role:'Product Manager',salary:'$115k',years:'2 yrs'},{role:'Senior PM',salary:'$150k',years:'5 yrs'},{role:'VP Product',salary:'$210k+',years:'10 yrs'}] },
      { title: 'Learning Experience Designer', salary: '$70–120k', school: 'Education, Instructional Design, or Psychology', desc: 'Design how people learn — online courses, corporate training, school curricula.', day: 'Storyboarding lessons, collaborating with subject matter experts, testing learning outcomes.', growth: [{role:'Instructional Designer',salary:'$55k',years:'Now'},{role:'LX Designer',salary:'$80k',years:'2 yrs'},{role:'Senior LX Designer',salary:'$105k',years:'5 yrs'},{role:'Director of Learning',salary:'$150k+',years:'10 yrs'}] },
      { title: 'Education Policy Analyst', salary: '$65–110k', school: 'Education, Public Policy, or Economics', desc: 'Shape national education policy. Work with government, think tanks, and nonprofits to fix broken systems.', day: 'Analyzing test score data, writing policy briefs, presenting to school boards and legislators.', growth: [{role:'Policy Researcher',salary:'$50k',years:'Now'},{role:'Policy Analyst',salary:'$70k',years:'2 yrs'},{role:'Senior Analyst',salary:'$95k',years:'5 yrs'},{role:'Policy Director',salary:'$140k+',years:'10 yrs'}] },
      { title: 'AI Curriculum Developer', salary: '$80–130k', school: 'Education + CS background', desc: 'Build the courses that teach the next generation how to use, build, and think about AI.', day: 'Researching AI trends, writing curriculum, collaborating with teachers and engineers.', growth: [{role:'Curriculum Writer',salary:'$55k',years:'Now'},{role:'Curriculum Developer',salary:'$80k',years:'2 yrs'},{role:'Sr Curriculum Dev',salary:'$110k',years:'5 yrs'},{role:'Head of Curriculum',salary:'$155k+',years:'10 yrs'}] },
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    icon: '▦',
    color: '#534AB7',
    bg: '#CECBF6',
    hints: ['...that pays six figures','...for tech people','...for culture lovers','...at luxury brands','...that never stops growing'],
    careers: [
      { title: 'Luxury Travel Advisor', salary: '$80–200k', school: 'Hospitality, Business, or self-built client base', desc: 'Curate extraordinary trips for high-net-worth clients. Companies like Fora have reimagined this role.', day: 'Consulting with clients on dream trips, booking exclusive experiences, managing complex itineraries.', growth: [{role:'Travel Coordinator',salary:'$45k',years:'Now'},{role:'Travel Advisor',salary:'$80k',years:'2 yrs'},{role:'Senior Advisor',salary:'$130k',years:'5 yrs'},{role:'Agency Owner / Director',salary:'$200k+',years:'10 yrs'}] },
      { title: 'Destination Experience Designer', salary: '$70–130k', school: 'Hospitality, Architecture, or Cultural Studies', desc: 'Design what a destination feels like for tourists and travelers. Part curator, part storyteller.', day: 'Scouting locations, working with local artists and chefs, designing tour experiences.', growth: [{role:'Experience Coordinator',salary:'$45k',years:'Now'},{role:'Experience Designer',salary:'$75k',years:'2 yrs'},{role:'Sr Experience Designer',salary:'$105k',years:'5 yrs'},{role:'Director of Experiences',salary:'$155k+',years:'10 yrs'}] },
      { title: 'Hotel General Manager', salary: '$100–300k', school: 'Hospitality Management degree', desc: 'Run an entire hotel — the staff, the guest experience, the finances, all of it.', day: 'Walking the property, meeting with department heads, handling VIP guest relations, reviewing financials.', growth: [{role:'Front Desk Agent',salary:'$38k',years:'Now'},{role:'Asst Manager',salary:'$65k',years:'2 yrs'},{role:'Hotel GM',salary:'$120k',years:'5 yrs'},{role:'Regional VP',salary:'$250k+',years:'10 yrs'}] },
      { title: 'Travel Tech PM', salary: '$120–180k', school: 'Business, CS, or Hospitality', desc: 'Build the apps and platforms that power how people discover, book, and experience travel.', day: 'Running sprints with engineers, conducting traveler research, defining product roadmap.', growth: [{role:'Associate PM',salary:'$85k',years:'Now'},{role:'Product Manager',salary:'$125k',years:'2 yrs'},{role:'Senior PM',salary:'$155k',years:'5 yrs'},{role:'Director of Product',salary:'$210k+',years:'10 yrs'}] },
    ]
  },
];

export const intersectionCareers = {
  'tech,health': ['Clinical AI Researcher','Health Informatics Manager','Digital Therapeutics PM','Biotech Data Scientist','Precision Medicine Analyst'],
  'tech,creative': ['Creative Technologist','AI Art Director','Experience Designer','Interactive Media Engineer','Generative AI Artist'],
  'tech,sports': ['Sports Analytics Lead','Performance Tech Engineer','Esports Strategist','Fan Experience PM','Wearable Tech Designer'],
  'tech,law': ['AI Policy Analyst','Tech Lawyer','Trust & Safety Lead','Privacy Engineer','Digital Rights Advocate'],
  'tech,edu': ['EdTech Founder','AI Curriculum Developer','Learning Experience Designer','Education Data Scientist','Adaptive Learning Engineer'],
  'tech,travel': ['Travel Tech PM','Hospitality AI Lead','Smart Hotel Innovator','Destination Data Analyst','Tourism App Designer'],
  'tech,biz': ['Fintech PM','Startup CTO','Quant Analyst','Growth Engineer','Crypto Product Manager'],
  'health,law': ['Bioethicist','Healthcare Policy Director','Pharmaceutical Lawyer','FDA Regulatory Specialist','Patient Rights Advocate'],
  'health,biz': ['Healthcare Venture Capitalist','Hospital CFO','Pharma Brand Manager','Health Insurance Strategist','Medical Device Entrepreneur'],
  'health,edu': ['Medical Education Designer','Public Health Educator','Healthcare Policy Researcher','Clinical Training Director','Health Literacy Specialist'],
  'biz,creative': ['Brand Venture Investor','Creative Agency Founder','Culture Strategist','Entertainment Deal Maker','Fashion Business Director'],
  'biz,sports': ['Sports Franchise CFO','Athlete Brand Manager','Stadium Experience Director','Sports Venture Capitalist','Sports Media Rights Negotiator'],
  'biz,travel': ['Hospitality Investment Analyst','Hotel Asset Manager','Tourism Board Director','Travel Startup Founder','Airline Revenue Strategist'],
  'biz,law': ['Venture Capital Associate','M&A Lawyer','Startup General Counsel','Impact Investment Analyst','Corporate Governance Advisor'],
  'sports,creative': ['Sports Photographer','Stadium Experience Designer','Athlete Documentary Director','Sports Brand Creative Director','Fan Culture Strategist'],
  'sports,edu': ['Athletic Director','Sports Science Educator','Coaching Education Developer','Youth Sports Policy Analyst','Sports Medicine Professor'],
  'edu,law': ['Education Policy Lawyer','Student Rights Advocate','School Board Consultant','Higher Ed Compliance Officer','Education Reform Strategist'],
  'edu,creative': ['Curriculum Content Creator','Educational Game Designer','Learning Experience Artist','Museum Education Director','Children\'s Media Producer'],
  'travel,creative': ['Destination Photographer','Travel Content Creator','Hospitality Brand Designer','Cultural Experience Curator','Travel Film Director'],
  'travel,law': ['International Tourism Lawyer','Travel Insurance Policy Expert','Immigration Consultant','Hospitality Compliance Officer','Aviation Rights Advocate'],
  'law,creative': ['Entertainment Lawyer','IP & Copyright Strategist','Music Rights Manager','Art Law Specialist','Fashion Law Consultant'],
};
