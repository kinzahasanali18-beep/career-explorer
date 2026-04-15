import { useState, useEffect } from "react";
import BubbleScreen from "./BubbleScreen";
import CareerTimeline from "./CareerTimeline";
import { fetchCareers } from "./airtable";
import { useAuth } from "./AuthContext";
import LoginScreen from "./LoginScreen";
import ProfilePage from "./ProfilePage";
import OnboardingScreen from "./OnboardingScreen";
import OnboardingQuiz from "./OnboardingQuiz";
import { supabase } from "./supabaseClient";

const T = {
  bg:"#1E2030", bgCard:"#272B40", bgDeep:"#1A1D2E",
  border:"#3D3F55", borderSoft:"#2E3148",
  text:"#E0E8FF", textMid:"#8B8FA8", textDim:"#4A4D66",
  accent1:"#06B6D4", accent2:"#3B82F6", accentPurple:"#7F77DD", white:"#FFFFFF",
};

const INDUSTRY_ID_MAP = {
  "tech & engineering": "tech",
  "healthcare & medicine": "health",
  "business & finance": "biz",
  "design & creative": "creative",
  "law & government": "law",
  "sports & fitness": "sports",
  "education & coaching": "edu",
  "hospitality & events": "travel",
};

function normalizeIndustryId(val) {
  if (!val) return "";
  const lower = val.toLowerCase().trim();
  return INDUSTRY_ID_MAP[lower] || lower;
}

const STATIC_INDUSTRIES = [
  { id:"tech", name:"Tech & Engineering", icon:"◈", color:"#7F77DD", bg:"#1E1B3A",
    hints:["...for storytellers","...for activists","...for athletes","...for artists","...for healers"],
    careers:[
      { title:"Machine Learning Engineer", salary:"$140–200k", school:"CS/Math degree or bootcamp", desc:"Train AI systems that learn from data. You sit at the center of the AI revolution.", day:"Running experiments, reviewing model performance, collaborating with product teams.", growth:[{role:"Junior ML Engineer",salary:"$95k",years:"Now"},{role:"ML Engineer",salary:"$140k",years:"2 yrs"},{role:"Senior ML Engineer",salary:"$175k",years:"5 yrs"},{role:"Staff / AI Lead",salary:"$230k+",years:"10 yrs"}]},
      { title:"AI Product Manager", salary:"$130–190k", school:"Any degree + PM experience", desc:"Bridge the gap between AI engineers and real users. Strategy meets execution.", day:"Writing product specs, running user research, coordinating engineering and design sprints.", growth:[{role:"Associate PM",salary:"$90k",years:"Now"},{role:"Product Manager",salary:"$130k",years:"2 yrs"},{role:"Senior PM",salary:"$160k",years:"5 yrs"},{role:"Director of Product",salary:"$210k+",years:"10 yrs"}]},
      { title:"AI Ethics Researcher", salary:"$90–150k", school:"Philosophy, Law, or CS", desc:"One of the most important jobs of the next 50 years. Ensure AI is fair and safe.", day:"Auditing models for bias, writing policy briefs, collaborating with legal and engineering.", growth:[{role:"Research Assistant",salary:"$70k",years:"Now"},{role:"Ethics Researcher",salary:"$110k",years:"2 yrs"},{role:"Senior Researcher",salary:"$145k",years:"5 yrs"},{role:"Head of AI Ethics",salary:"$200k+",years:"10 yrs"}]},
      { title:"Creative Technologist", salary:"$85–140k", school:"Design, CS, or Fine Arts", desc:"Sit at the intersection of art and code. Build experiences that feel like magic.", day:"Prototyping interactive installations, pitching to creative directors, coding in unusual environments.", growth:[{role:"Jr Creative Tech",salary:"$65k",years:"Now"},{role:"Creative Technologist",salary:"$95k",years:"2 yrs"},{role:"Senior Creative Tech",salary:"$130k",years:"5 yrs"},{role:"Creative Tech Director",salary:"$180k+",years:"10 yrs"}]},
    ]},
  { id:"health", name:"Healthcare & Medicine", icon:"◎", color:"#1D9E75", bg:"#0F2620",
    hints:["...without med school","...for tech people","...for the curious","...at the frontier","...for policy nerds"],
    careers:[
      { title:"Health Informatics Manager", salary:"$95–145k", school:"Health Informatics or CS", desc:"Manage how hospitals use data to save lives.", day:"Meeting with clinical staff, overseeing EHR systems, analyzing patient outcome data.", growth:[{role:"Data Analyst",salary:"$65k",years:"Now"},{role:"Informatics Specialist",salary:"$90k",years:"2 yrs"},{role:"Informatics Manager",salary:"$120k",years:"5 yrs"},{role:"Chief Informatics Officer",salary:"$180k+",years:"10 yrs"}]},
      { title:"Clinical AI Researcher", salary:"$110–170k", school:"Biology + CS or MD/PhD", desc:"Build AI that helps doctors diagnose diseases earlier and more accurately.", day:"Training models on medical imaging, presenting findings to clinicians, writing research papers.", growth:[{role:"Research Assistant",salary:"$70k",years:"Now"},{role:"Clinical AI Researcher",salary:"$115k",years:"2 yrs"},{role:"Senior Researcher",salary:"$155k",years:"5 yrs"},{role:"Research Director",salary:"$220k+",years:"10 yrs"}]},
      { title:"Bioethicist", salary:"$80–130k", school:"Philosophy, Medicine, or Law", desc:"Navigate the moral questions that come with medical advances.", day:"Consulting on ethics committees, writing policy, teaching medical students.", growth:[{role:"Ethics Coordinator",salary:"$60k",years:"Now"},{role:"Bioethicist",salary:"$85k",years:"2 yrs"},{role:"Senior Bioethicist",salary:"$115k",years:"5 yrs"},{role:"Director of Ethics",salary:"$160k+",years:"10 yrs"}]},
      { title:"Digital Therapeutics PM", salary:"$120–175k", school:"Business, Health, or CS", desc:"Build FDA-approved apps that treat real medical conditions.", day:"Working with clinical teams, managing regulatory submissions, running product sprints.", growth:[{role:"Associate PM",salary:"$85k",years:"Now"},{role:"Product Manager",salary:"$125k",years:"2 yrs"},{role:"Senior PM",salary:"$155k",years:"5 yrs"},{role:"VP of Product",salary:"$210k+",years:"10 yrs"}]},
    ]},
  { id:"biz", name:"Business & Finance", icon:"◉", color:"#BA7517", bg:"#1E1605",
    hints:["...that changes lives","...for creatives","...at startups","...in emerging markets","...for risk-takers"],
    careers:[
      { title:"Venture Capitalist", salary:"$150–400k+", school:"Finance, Business, or top MBA", desc:"Evaluate startups and help decide which companies get funded.", day:"Taking founder meetings, conducting due diligence, attending board meetings.", growth:[{role:"Analyst",salary:"$90k",years:"Now"},{role:"Associate",salary:"$130k",years:"2 yrs"},{role:"Principal",salary:"$200k",years:"5 yrs"},{role:"Partner",salary:"$400k+",years:"10 yrs"}]},
      { title:"Impact Investment Analyst", salary:"$80–130k", school:"Finance, Economics, or Policy", desc:"Invest in companies doing good — clean energy, education, healthcare access.", day:"Analyzing financial models, meeting with social enterprises, writing investment memos.", growth:[{role:"Junior Analyst",salary:"$70k",years:"Now"},{role:"Analyst",salary:"$90k",years:"2 yrs"},{role:"Senior Analyst",salary:"$115k",years:"5 yrs"},{role:"Portfolio Director",salary:"$170k+",years:"10 yrs"}]},
      { title:"Startup CFO", salary:"$160–280k", school:"Accounting, Finance, or MBA", desc:"The financial brain of a startup. Help founders not run out of money.", day:"Building financial models, leading fundraising rounds, managing investor relations.", growth:[{role:"Financial Analyst",salary:"$75k",years:"Now"},{role:"Finance Manager",salary:"$110k",years:"2 yrs"},{role:"VP Finance",salary:"$160k",years:"5 yrs"},{role:"CFO",salary:"$280k+",years:"10 yrs"}]},
      { title:"Revenue Manager", salary:"$75–130k", school:"Business, Math, or Hospitality", desc:"Use data and algorithms to price products in real time.", day:"Analyzing demand patterns, adjusting pricing strategies, presenting forecasts to leadership.", growth:[{role:"Revenue Analyst",salary:"$55k",years:"Now"},{role:"Revenue Manager",salary:"$85k",years:"2 yrs"},{role:"Senior Revenue Manager",salary:"$110k",years:"5 yrs"},{role:"VP Revenue",salary:"$160k+",years:"10 yrs"}]},
    ]},
  { id:"creative", name:"Design & Creative", icon:"✦", color:"#D4537E", bg:"#1E0F16",
    hints:["...that pays well","...at tech companies","...with global reach","...that shapes society","...for systems thinkers"],
    careers:[
      { title:"Creative Director", salary:"$110–200k", school:"Design, Fine Arts, or self-taught", desc:"Set the visual and emotional direction for brands, campaigns, and products.", day:"Running creative reviews, briefing designers and writers, presenting concepts to clients.", growth:[{role:"Junior Designer",salary:"$55k",years:"Now"},{role:"Mid Designer",salary:"$85k",years:"2 yrs"},{role:"Senior Designer",salary:"$120k",years:"5 yrs"},{role:"Creative Director",salary:"$180k+",years:"10 yrs"}]},
      { title:"Music Supervisor", salary:"$70–150k", school:"Music, Film, or Communications", desc:"Choose the music for films, TV shows, and ads. One of the most coveted creative jobs.", day:"Pitching songs to directors, negotiating licensing deals, attending film cuts.", growth:[{role:"Music Coordinator",salary:"$45k",years:"Now"},{role:"Music Supervisor",salary:"$80k",years:"2 yrs"},{role:"Sr Music Supervisor",salary:"$120k",years:"5 yrs"},{role:"Head of Music",salary:"$180k+",years:"10 yrs"}]},
      { title:"Brand Strategist", salary:"$80–150k", school:"Marketing, Business, or Design", desc:"Figure out what a brand stands for and how it should show up in the world.", day:"Running brand workshops, analyzing cultural trends, writing strategy decks.", growth:[{role:"Brand Analyst",salary:"$55k",years:"Now"},{role:"Brand Strategist",salary:"$85k",years:"2 yrs"},{role:"Sr Brand Strategist",salary:"$120k",years:"5 yrs"},{role:"Chief Brand Officer",salary:"$200k+",years:"10 yrs"}]},
      { title:"Experience Designer", salary:"$90–155k", school:"Design, Architecture, or Theater", desc:"Design physical and digital experiences — pop-ups, retail, events, museums.", day:"Sketching spatial concepts, coordinating with architects, managing vendor builds.", growth:[{role:"Jr Experience Designer",salary:"$60k",years:"Now"},{role:"Experience Designer",salary:"$95k",years:"2 yrs"},{role:"Sr Experience Designer",salary:"$130k",years:"5 yrs"},{role:"Experience Director",salary:"$190k+",years:"10 yrs"}]},
    ]},
  { id:"law", name:"Law & Government", icon:"▣", color:"#378ADD", bg:"#0A1628",
    hints:["...without being a lawyer","...for tech people","...that moves fast","...that shapes history","...at the UN"],
    careers:[
      { title:"Tech Policy Analyst", salary:"$80–140k", school:"Law, Poli Sci, or Economics", desc:"Write the laws and frameworks that govern AI and big tech.", day:"Researching legislation, briefing senators, writing policy white papers.", growth:[{role:"Policy Coordinator",salary:"$55k",years:"Now"},{role:"Policy Analyst",salary:"$80k",years:"2 yrs"},{role:"Senior Analyst",salary:"$110k",years:"5 yrs"},{role:"Policy Director",salary:"$160k+",years:"10 yrs"}]},
      { title:"Startup General Counsel", salary:"$150–250k", school:"Law degree (JD)", desc:"Be the only lawyer at a fast-growing startup. Handle everything from contracts to fundraising.", day:"Reviewing term sheets, advising founders on risk, managing outside counsel.", growth:[{role:"Associate Attorney",salary:"$90k",years:"Now"},{role:"Staff Attorney",salary:"$130k",years:"2 yrs"},{role:"General Counsel",salary:"$175k",years:"5 yrs"},{role:"Chief Legal Officer",salary:"$280k+",years:"10 yrs"}]},
      { title:"Human Rights Investigator", salary:"$55–100k", school:"Law, International Relations, or Journalism", desc:"Document atrocities and build legal cases for international courts.", day:"Conducting field interviews, analyzing evidence, writing investigative reports.", growth:[{role:"Research Assistant",salary:"$45k",years:"Now"},{role:"Investigator",salary:"$65k",years:"2 yrs"},{role:"Senior Investigator",salary:"$90k",years:"5 yrs"},{role:"Director of Investigations",salary:"$130k+",years:"10 yrs"}]},
      { title:"Privacy Engineer", salary:"$130–190k", school:"CS + Law or Policy background", desc:"Build the technical systems that protect user data and keep companies compliant.", day:"Auditing data flows, implementing privacy-by-design features, advising engineering teams.", growth:[{role:"Privacy Analyst",salary:"$85k",years:"Now"},{role:"Privacy Engineer",salary:"$130k",years:"2 yrs"},{role:"Senior Privacy Eng",salary:"$165k",years:"5 yrs"},{role:"Head of Privacy",salary:"$220k+",years:"10 yrs"}]},
    ]},
  { id:"sports", name:"Sports & Fitness", icon:"▤", color:"#D85A30", bg:"#1E1008",
    hints:["...off the field","...for data lovers","...behind the scenes","...for strategists","...that travel the world"],
    careers:[
      { title:"Sports Analytics Lead", salary:"$90–160k", school:"Statistics, CS, or Sports Science", desc:"Help teams win using data. Every major league team now has an analytics department.", day:"Building player performance models, presenting insights to coaching staff.", growth:[{role:"Data Analyst",salary:"$60k",years:"Now"},{role:"Sports Analyst",salary:"$90k",years:"2 yrs"},{role:"Senior Analyst",salary:"$120k",years:"5 yrs"},{role:"Head of Analytics",salary:"$180k+",years:"10 yrs"}]},
      { title:"Athlete Brand Manager", salary:"$80–160k", school:"Marketing, Business, or Comms", desc:"Build and protect the personal brand of professional athletes.", day:"Vetting brand deals, managing social content strategy, coordinating media appearances.", growth:[{role:"Brand Coordinator",salary:"$50k",years:"Now"},{role:"Brand Manager",salary:"$85k",years:"2 yrs"},{role:"Sr Brand Manager",salary:"$120k",years:"5 yrs"},{role:"Chief Brand Officer",salary:"$200k+",years:"10 yrs"}]},
      { title:"Fan Experience Director", salary:"$80–140k", school:"Business, Marketing, or Hospitality", desc:"Design what it feels like to be at a game, concert, or live event.", day:"Overseeing in-venue activations, managing sponsor integrations, analyzing fan feedback.", growth:[{role:"Events Coordinator",salary:"$45k",years:"Now"},{role:"Fan Experience Manager",salary:"$75k",years:"2 yrs"},{role:"Director",salary:"$110k",years:"5 yrs"},{role:"VP Fan Experience",salary:"$175k+",years:"10 yrs"}]},
      { title:"Esports Strategist", salary:"$70–130k", school:"Business, Marketing, or Game Design", desc:"One of the fastest growing industries in the world. Build teams, leagues, and brand partnerships.", day:"Scouting players, negotiating sponsorship deals, managing tournament logistics.", growth:[{role:"Esports Coordinator",salary:"$50k",years:"Now"},{role:"Esports Manager",salary:"$75k",years:"2 yrs"},{role:"Sr Strategist",salary:"$105k",years:"5 yrs"},{role:"Esports Director",salary:"$160k+",years:"10 yrs"}]},
    ]},
  { id:"edu", name:"Education & Coaching", icon:"▥", color:"#639922", bg:"#0E1A08",
    hints:["...that transforms learning","...at tech companies","...for entrepreneurs","...that scales globally","...for content creators"],
    careers:[
      { title:"EdTech Product Manager", salary:"$110–170k", school:"Education, CS, or Business", desc:"Build tools that change how millions of kids learn.", day:"Running teacher focus groups, writing product specs, analyzing learning outcome data.", growth:[{role:"Associate PM",salary:"$80k",years:"Now"},{role:"Product Manager",salary:"$115k",years:"2 yrs"},{role:"Senior PM",salary:"$150k",years:"5 yrs"},{role:"VP Product",salary:"$210k+",years:"10 yrs"}]},
      { title:"Learning Experience Designer", salary:"$70–120k", school:"Education, Instructional Design, or Psychology", desc:"Design how people learn — online courses, corporate training, school curricula.", day:"Storyboarding lessons, collaborating with subject matter experts, testing learning outcomes.", growth:[{role:"Instructional Designer",salary:"$55k",years:"Now"},{role:"LX Designer",salary:"$80k",years:"2 yrs"},{role:"Senior LX Designer",salary:"$105k",years:"5 yrs"},{role:"Director of Learning",salary:"$150k+",years:"10 yrs"}]},
      { title:"Education Policy Analyst", salary:"$65–110k", school:"Education, Public Policy, or Economics", desc:"Shape national education policy. Work with governments to fix broken systems.", day:"Analyzing test score data, writing policy briefs, presenting to school boards.", growth:[{role:"Policy Researcher",salary:"$50k",years:"Now"},{role:"Policy Analyst",salary:"$70k",years:"2 yrs"},{role:"Senior Analyst",salary:"$95k",years:"5 yrs"},{role:"Policy Director",salary:"$140k+",years:"10 yrs"}]},
      { title:"AI Curriculum Developer", salary:"$80–130k", school:"Education + CS background", desc:"Build the courses that teach the next generation how to think about AI.", day:"Researching AI trends, writing curriculum, collaborating with teachers and engineers.", growth:[{role:"Curriculum Writer",salary:"$55k",years:"Now"},{role:"Curriculum Developer",salary:"$80k",years:"2 yrs"},{role:"Sr Curriculum Dev",salary:"$110k",years:"5 yrs"},{role:"Head of Curriculum",salary:"$155k+",years:"10 yrs"}]},
    ]},
  { id:"travel", name:"Hospitality & Events", icon:"▦", color:"#534AB7", bg:"#12102A",
    hints:["...that pays six figures","...for tech people","...for culture lovers","...at luxury brands","...that never stops growing"],
    careers:[
      { title:"Luxury Travel Advisor", salary:"$80–200k", school:"Hospitality, Business, or self-built client base", desc:"Curate extraordinary trips for high-net-worth clients.", day:"Consulting with clients on dream trips, booking exclusive experiences, managing itineraries.", growth:[{role:"Travel Coordinator",salary:"$45k",years:"Now"},{role:"Travel Advisor",salary:"$80k",years:"2 yrs"},{role:"Senior Advisor",salary:"$130k",years:"5 yrs"},{role:"Agency Owner / Director",salary:"$200k+",years:"10 yrs"}]},
      { title:"Destination Experience Designer", salary:"$70–130k", school:"Hospitality, Architecture, or Cultural Studies", desc:"Design what a destination feels like for tourists and travelers.", day:"Scouting locations, working with local artists and chefs, designing tour experiences.", growth:[{role:"Experience Coordinator",salary:"$45k",years:"Now"},{role:"Experience Designer",salary:"$75k",years:"2 yrs"},{role:"Sr Experience Designer",salary:"$105k",years:"5 yrs"},{role:"Director of Experiences",salary:"$155k+",years:"10 yrs"}]},
      { title:"Hotel General Manager", salary:"$100–300k", school:"Hospitality Management degree", desc:"Run an entire hotel — the staff, the guest experience, the finances, all of it.", day:"Walking the property, meeting department heads, handling VIP guests, reviewing financials.", growth:[{role:"Front Desk Agent",salary:"$38k",years:"Now"},{role:"Asst Manager",salary:"$65k",years:"2 yrs"},{role:"Hotel GM",salary:"$120k",years:"5 yrs"},{role:"Regional VP",salary:"$250k+",years:"10 yrs"}]},
      { title:"Travel Tech PM", salary:"$120–180k", school:"Business, CS, or Hospitality", desc:"Build the apps that power how people discover, book, and experience travel.", day:"Running sprints with engineers, conducting traveler research, defining product roadmap.", growth:[{role:"Associate PM",salary:"$85k",years:"Now"},{role:"Product Manager",salary:"$125k",years:"2 yrs"},{role:"Senior PM",salary:"$155k",years:"5 yrs"},{role:"Director of Product",salary:"$210k+",years:"10 yrs"}]},
    ]},
];

const intersectionCareers = {
  "tech,health":["Clinical AI Researcher","Health Informatics Manager","Digital Therapeutics PM","Biotech Data Scientist"],
  "tech,creative":["Creative Technologist","AI Art Director","Experience Designer","Generative AI Artist"],
  "tech,sports":["Sports Analytics Lead","Performance Tech Engineer","Esports Strategist","Fan Experience PM"],
  "tech,law":["AI Policy Analyst","Tech Lawyer","Trust & Safety Lead","Privacy Engineer"],
  "tech,edu":["EdTech Founder","AI Curriculum Developer","Learning Experience Designer","Education Data Scientist"],
  "tech,travel":["Travel Tech PM","Hospitality AI Lead","Smart Hotel Innovator","Destination Data Analyst"],
  "tech,biz":["Fintech PM","Startup CTO","Quant Analyst","Growth Engineer"],
  "health,law":["Bioethicist","Healthcare Policy Director","Pharmaceutical Lawyer","FDA Regulatory Specialist"],
  "health,biz":["Healthcare Venture Capitalist","Hospital CFO","Pharma Brand Manager","Medical Device Entrepreneur"],
  "health,edu":["Medical Education Designer","Public Health Educator","Clinical Training Director","Health Literacy Specialist"],
  "biz,creative":["Brand Venture Investor","Creative Agency Founder","Culture Strategist","Entertainment Deal Maker"],
  "biz,sports":["Sports Franchise CFO","Athlete Brand Manager","Stadium Experience Director","Sports Venture Capitalist"],
  "biz,travel":["Hospitality Investment Analyst","Hotel Asset Manager","Tourism Board Director","Travel Startup Founder"],
  "biz,law":["Venture Capital Associate","M&A Lawyer","Startup General Counsel","Impact Investment Analyst"],
  "sports,creative":["Sports Photographer","Stadium Experience Designer","Sports Brand Creative Director","Fan Culture Strategist"],
  "sports,edu":["Athletic Director","Sports Science Educator","Coaching Education Developer","Youth Sports Policy Analyst"],
  "edu,law":["Education Policy Lawyer","Student Rights Advocate","School Board Consultant","Education Reform Strategist"],
  "edu,creative":["Curriculum Content Creator","Educational Game Designer","Museum Education Director","Children's Media Producer"],
  "travel,creative":["Destination Photographer","Travel Content Creator","Hospitality Brand Designer","Cultural Experience Curator"],
  "travel,law":["International Tourism Lawyer","Immigration Consultant","Hospitality Compliance Officer","Aviation Rights Advocate"],
  "law,creative":["Entertainment Lawyer","IP & Copyright Strategist","Music Rights Manager","Art Law Specialist"],
};

const quizzes = {
  abstract:{ name:"The Abstract Quiz", description:"Strange questions. Surprising results.", questions:[
    { q:"You find an unmarked door. What do you do?", flavor:"There's no sign. No handle. Just a door.", opts:[{icon:"◧",text:"Research it first",sub:"I want to know before I act.",value:"analytical"},{icon:"◨",text:"Open it immediately",sub:"The unknown is the point.",value:"adventurous"},{icon:"◩",text:"Sketch the door and walk away",sub:"I'd rather imagine what's behind it.",value:"creative"},{icon:"◪",text:"Find someone who knows",sub:"There's always a person with the answer.",value:"social"}]},
    { q:"If your brain were a room, what would it look like?", flavor:"Close your eyes for a second.", opts:[{icon:"▣",text:"A lab with experiments everywhere",sub:"Half-finished ideas all over the place.",value:"investigative"},{icon:"▤",text:"A concert hall mid-performance",sub:"Loud, beautiful, a little chaotic.",value:"creative"},{icon:"▥",text:"A very organized filing system",sub:"Everything labeled. Nothing out of place.",value:"analytical"},{icon:"▦",text:"A living room full of people",sub:"Always someone new coming through.",value:"social"}]},
    { q:"A stranger gives you $10,000. You can't spend it on yourself.", flavor:"No wrong answer here.", opts:[{icon:"◐",text:"Fund a project that solves something",sub:"I'd find the most broken thing and fix it.",value:"builder"},{icon:"◑",text:"Give it to people I know need it",sub:"Impact closest to home first.",value:"social"},{icon:"◒",text:"Invest it to make more",sub:"$10k can become $50k.",value:"analytical"},{icon:"◓",text:"Use it to make something beautiful",sub:"A film, an event, a piece of art.",value:"creative"}]},
    { q:"Which superpower would quietly ruin your life?", flavor:"Think about it.", opts:[{icon:"◔",text:"Reading everyone's mind",sub:"Too much noise. Too much truth.",value:"investigative"},{icon:"◕",text:"Seeing every possible future",sub:"The weight of knowing what could go wrong.",value:"analytical"},{icon:"◖",text:"Making everyone agree with you",sub:"You'd never know if they really meant it.",value:"social"},{icon:"◗",text:"Creating anything instantly",sub:"The process is the whole point.",value:"creative"}]},
    { q:"You have to leave one thing behind forever. What's hardest?", flavor:"Be honest.", opts:[{icon:"▲",text:"The ability to be surprised",sub:"Knowing what comes next would hollow everything out.",value:"adventurous"},{icon:"△",text:"Making people feel seen",sub:"Connection is what I'm here for.",value:"social"},{icon:"▴",text:"Building something that lasts",sub:"I need to know I made a mark.",value:"builder"},{icon:"▵",text:"Figuring out how things work",sub:"Curiosity is my whole personality.",value:"investigative"}]},
  ]},
  cinematic:{ name:"The Cinematic Quiz", description:"Pick movie scenes. Find where you belong.", questions:[
    { q:"Which scene feels most like your inner world?", flavor:"Don't overthink it.", opts:[{icon:"◈",text:"The heist planning scene",sub:"Everyone has a role. The plan is everything.",value:"analytical"},{icon:"✦",text:"The montage where it all comes together",sub:"Hard work. Growth. The music swells.",value:"builder"},{icon:"◎",text:"The unexpected road trip",sub:"No map. Just people and possibility.",value:"adventurous"},{icon:"◉",text:"The quiet scene where someone tells the truth",sub:"Real over polished, every time.",value:"social"}]},
    { q:"In every group project movie, you are...", flavor:"You know which one you are.", opts:[{icon:"▣",text:"The one who sees what nobody else sees",sub:"And has to convince everyone to believe it.",value:"visionary"},{icon:"▤",text:"The one who actually gets things done",sub:"While everyone argues, you're halfway there.",value:"builder"},{icon:"▥",text:"The one who keeps everyone from falling apart",sub:"The glue. The heart.",value:"social"},{icon:"▦",text:"The wildcard with the unexpected idea",sub:"Nobody saw it coming. It works.",value:"creative"}]},
    { q:"The villain in your story is...", flavor:"Every hero has one.", opts:[{icon:"◐",text:"A broken system nobody else can see",sub:"You're fighting something invisible.",value:"investigative"},{icon:"◑",text:"Wasted potential",sub:"Nothing bothers you more than talent going nowhere.",value:"builder"},{icon:"◒",text:"Boredom. Repetition. Sameness.",sub:"You need variety and new challenges to stay engaged.",value:"adventurous"},{icon:"◓",text:"Indifference",sub:"You feel things so the world doesn't have to.",value:"social"}]},
    { q:"The last scene of your movie shows you...", flavor:"What's the image?", opts:[{icon:"◔",text:"Standing in front of something you built",sub:"A company, a city, a movement.",value:"builder"},{icon:"◕",text:"Somewhere unexpected, bag in hand",sub:"The adventure isn't over.",value:"adventurous"},{icon:"◖",text:"In a room full of people who matter to you",sub:"This is what it was all for.",value:"social"},{icon:"◗",text:"Alone, looking at something only you understand",sub:"Satisfied. Finally.",value:"investigative"}]},
    { q:"Your origin story starts with...", flavor:"The moment everything shifted.", opts:[{icon:"▲",text:"A question nobody could answer",sub:"So you had to find out yourself.",value:"investigative"},{icon:"△",text:"A person who believed in you first",sub:"You've been trying to deserve it ever since.",value:"social"},{icon:"▴",text:"Something broken you couldn't look away from",sub:"Fixing things is just who you are.",value:"builder"},{icon:"▵",text:"A feeling you couldn't name but had to chase",sub:"You're still chasing it.",value:"creative"}]},
  ]},
  moody:{ name:"The Deep Dive", description:"Introspective. What drives you at your core?", questions:[
    { q:"What keeps you up at night — not with anxiety, but with aliveness?", flavor:"The thing your brain won't let go of.", opts:[{icon:"◧",text:"A problem I haven't solved yet",sub:"The kind that feels just within reach.",value:"investigative"},{icon:"◨",text:"A world that could be so much better",sub:"And the gap between here and there.",value:"builder"},{icon:"◩",text:"Something I want to make that doesn't exist yet",sub:"I can see it. I just can't build it yet.",value:"creative"},{icon:"◪",text:"People. Always people.",sub:"What they feel. What they need. What they could become.",value:"social"}]},
    { q:"When you help someone and it works, what felt best?", flavor:"Be specific with yourself.", opts:[{icon:"▣",text:"That I saw what others missed",sub:"The insight was mine.",value:"investigative"},{icon:"▤",text:"That I actually did something about it",sub:"Not just talked — acted.",value:"builder"},{icon:"▥",text:"The look on their face",sub:"The moment it landed.",value:"social"},{icon:"▦",text:"That I found a way nobody expected",sub:"Creative solutions are my love language.",value:"creative"}]},
    { q:"What do you want people to say about you at 60?", flavor:"Not what you achieved. What you were.", opts:[{icon:"◐",text:"They saw things coming before anyone else",sub:"A mind ahead of its time.",value:"visionary"},{icon:"◑",text:"They made something that mattered",sub:"Built something real.",value:"builder"},{icon:"◒",text:"They made people feel less alone",sub:"Their presence changed the room.",value:"social"},{icon:"◓",text:"They never stopped asking why",sub:"Relentless curiosity until the end.",value:"investigative"}]},
    { q:"The most honest version of why you care about your future?", flavor:"What really drives you — beneath the surface.", opts:[{icon:"◔",text:"I want to understand how the world actually works",sub:"Going deeper than the surface-level explanation.",value:"investigative"},{icon:"◕",text:"I want to build something bigger than me",sub:"Something that outlasts me.",value:"builder"},{icon:"◖",text:"I want the people I love to be okay",sub:"Everything else is secondary.",value:"social"},{icon:"◗",text:"I want to feel like I used all of myself",sub:"No wasted potential.",value:"creative"}]},
    { q:"Looking back at 60, you feel most proud of...", flavor:"Picture yourself later in life, reflecting.", opts:[{icon:"▲",text:"Never stopping at the first answer",sub:"Curiosity that kept leading somewhere new.",value:"investigative"},{icon:"△",text:"Building something that took years to get right",sub:"The work spoke for itself.",value:"builder"},{icon:"▴",text:"The people whose lives changed because of you",sub:"Relationships that stood the test of time.",value:"social"},{icon:"▵",text:"Work that was truly your own",sub:"A path that fit who you are.",value:"creative"}]},
  ]},
};

const profiles = {
  analytical:   {type:"The Architect",  title:"You think in systems",   desc:"You see patterns others miss and need to understand the 'why' behind everything.", industryFit:["tech","biz","law"]},
  creative:     {type:"The Maker",      title:"You build worlds",        desc:"You're driven by the need to make things that didn't exist before.",              industryFit:["creative","tech","edu"]},
  social:       {type:"The Connector",  title:"You move through people", desc:"You understand what humans need before they say it.",                             industryFit:["edu","travel","sports"]},
  investigative:{type:"The Explorer",   title:"You chase truth",          desc:"Curiosity is your engine. You need work that keeps revealing new layers.",        industryFit:["health","law","tech"]},
  builder:      {type:"The Operator",   title:"You make things real",    desc:"Ideas are fine. But you need to see something get built.",                        industryFit:["tech","biz","travel"]},
  adventurous:  {type:"The Pioneer",    title:"You need the frontier",   desc:"Routine is your kryptonite. You belong somewhere the map hasn't been drawn yet.", industryFit:["travel","sports","creative"]},
  visionary:    {type:"The Visionary",  title:"You live in the future",  desc:"You see what doesn't exist yet and can't stop talking about it.",                 industryFit:["tech","biz","edu"]},
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getIntersections(selected) {
  const arr = Array.from(selected); let found = [];
  for (let i=0;i<arr.length;i++) for (let j=i+1;j<arr.length;j++) {
    const c = intersectionCareers[`${arr[i]},${arr[j]}`]||intersectionCareers[`${arr[j]},${arr[i]}`];
    if (c) found = [...new Set([...found,...c])];
  }
  return found;
}

const cardStyle = {background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:18, padding:"1.1rem 1.15rem", marginBottom:10};
const pillStyle = (color) => ({background:`${color}22`, border:`1px solid ${color}55`, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, color, display:"inline-block"});
const eyebrowStyle = {fontSize:10, color:T.accent1, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700, marginBottom:5};
const headlineStyle = {fontSize:28, fontWeight:800, color:T.text, lineHeight:1.2, marginBottom:8};
const subStyle = {fontSize:14, color:T.textMid, lineHeight:1.6, marginBottom:6};
const backStyle = {background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, color:T.textMid, cursor:"pointer", marginBottom:20};
const primaryStyle = {width:"100%", padding:"0.9rem", background:`linear-gradient(135deg,${T.accent1},${T.accent2})`, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer"};
const ghostStyle = {width:"100%", padding:"0.85rem", background:"transparent", color:T.textMid, border:`1px solid ${T.border}`, borderRadius:14, fontSize:13, fontWeight:600, cursor:"pointer"};

function Screen({children}) { return <div className="screen-content" style={{padding:"1.5rem 1.25rem"}}>{children}</div>; }

function DesktopSidebar({ screen, activeQuiz, selectedIndustries, onSelectMode, onStartOver, industries }) {
  const quizModes = [
    { id: "abstract", icon: "◈", name: "Abstract Quiz" },
    { id: "cinematic", icon: "◎", name: "Cinematic Quiz" },
    { id: "moody",    icon: "◉", name: "Deep Dive" },
  ];
  const activeInds = selectedIndustries.length > 0
    ? industries.filter(i => selectedIndustries.includes(i.id))
    : industries;
  return (
    <div className="desktop-sidebar" style={{background:T.bg}}>
      <div className="sidebar-brand">Sparq</div>
      <div className="sidebar-section-label">Quizzes</div>
      {quizModes.map(m => (
        <button key={m.id}
          className={`sidebar-item${screen === "quiz" && activeQuiz === m.id ? " active" : ""}`}
          onClick={() => onSelectMode(m.id)}>
          <span style={{fontSize:14}}>{m.icon}</span>{m.name}
        </button>
      ))}
      <div className="sidebar-section-label">Explore</div>
      <button
        className={`sidebar-item${screen === "bubble" ? " active" : ""}`}
        onClick={() => onSelectMode("bubble")}>
        <span style={{fontSize:14}}>✦</span>Bubble Map
      </button>
      <div className="sidebar-divider" />
      <div className="sidebar-section-label">Browse Industries</div>
      {activeInds.map(ind => (
        <button key={ind.id}
          className="sidebar-item"
          onClick={() => onSelectMode("industry:" + ind.id)}
          style={{color: ind.color}}>
          <span style={{fontSize:14}}>{ind.icon}</span>{ind.name}
        </button>
      ))}
      <button className="sidebar-start-over" onClick={onStartOver}>↩ Start over</button>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function IndustryPicker({onDone, industries}) {
  const [selected, setSelected] = useState(new Set());
  const [hintIdx, setHintIdx] = useState({});
  const [showPulse, setShowPulse] = useState(true);
  useEffect(()=>{
    const init={}; industries.forEach(i=>{init[i.id]=0;}); setHintIdx(init);
    const iv=setInterval(()=>setHintIdx(p=>{const n={...p};industries.forEach(i=>{n[i.id]=(p[i.id]+1)%i.hints.length;});return n;}),2400);
    const pt=setTimeout(()=>setShowPulse(false),3200);
    return ()=>{clearInterval(iv);clearTimeout(pt);};
  },[]);
  function toggle(id){setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});}
  const intersections = getIntersections(selected);
  return (
    <Screen>
      <div className="industry-hero-header">
        <div style={eyebrowStyle}>Step 1 of 2</div>
        <div style={{...headlineStyle,fontSize:26}}>What world pulls you in?</div>
        <div style={{fontSize:14,color:T.accent1,fontWeight:600,marginBottom:8,lineHeight:1.5}}>Pick as many as you like — the more you choose, the more personalized your results.</div>
        <div style={subStyle}>Pick anything that feels interesting. We'll show you careers at the edges — and the intersections nobody talks about.</div>
      </div>
      <div className="industry-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {industries.map((ind,idx)=>{
          const sel=selected.has(ind.id);
          return (
            <div key={ind.id} onClick={()=>toggle(ind.id)} style={{background:sel?ind.bg:T.bgCard,border:`${sel?2:1}px solid ${sel?ind.color:T.border}`,borderRadius:16,padding:"1rem",cursor:"pointer",transition:"all 0.15s",position:"relative",animation:!sel&&idx===0&&showPulse?"tilePulse 1s ease-in-out 2":"none"}}>
              {sel&&<div style={{position:"absolute",top:8,right:8,width:22,height:22,borderRadius:"50%",background:ind.color,border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 8px ${ind.color}99`}}><span style={{color:"#fff",fontSize:12,fontWeight:900,lineHeight:1}}>✓</span></div>}
              <div style={{fontSize:20,marginBottom:6}}>{ind.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{ind.name}</div>
              <div style={{fontSize:11,color:ind.color,fontWeight:500,minHeight:14}}>{ind.hints[hintIdx[ind.id]||0]}</div>
            </div>
          );
        })}
      </div>
      {intersections.length>0&&(
        <div style={{...cardStyle,marginBottom:16}}>
          <div style={eyebrowStyle}>Careers at your intersections</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {intersections.slice(0,6).map(c=><span key={c} style={pillStyle(T.accentPurple)}>{c}</span>)}
          </div>
        </div>
      )}
      {selected.size>0&&<div style={{fontSize:12,color:T.textDim,marginBottom:14}}>{selected.size} {selected.size===1?"world":"worlds"} selected</div>}
      <button style={primaryStyle} onClick={()=>onDone(Array.from(selected))}>Find my careers →</button>
      <div style={{height:8}}/>
      <button style={ghostStyle} onClick={()=>onDone([])}>Skip — explore everything</button>
    </Screen>
  );
}

function LandingScreen({onStart,onBrowse}) {
  const steps=[{num:"1",label:"Answer questions"},{num:"2",label:"Get your matches"},{num:"3",label:"Explore your future"}];
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem"}}>
      <div style={{textAlign:"center",maxWidth:480,width:"100%"}}>
        <div style={{fontSize:64,fontWeight:900,color:"#F0EEFF",letterSpacing:"-0.03em",lineHeight:1,marginBottom:28}}>⚡ Sparq</div>
        <div style={{fontSize:24,fontWeight:800,color:"#F0EEFF",lineHeight:1.35,marginBottom:16}}>
          You don't know what you want to do yet.<br/>That's exactly why you're here.
        </div>
        <div style={{fontSize:15,color:T.textMid,lineHeight:1.75,marginBottom:44}}>
          Answer a few questions. Discover careers you never knew existed. Find your Sparq.
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"flex-start",gap:0,marginBottom:48}}>
          {steps.map((step,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div style={{textAlign:"center",padding:"0 16px"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent1},${T.accentPurple})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:15,fontWeight:800,color:"#fff"}}>{step.num}</div>
                <div style={{fontSize:12,color:T.textMid,fontWeight:600,maxWidth:80,lineHeight:1.4}}>{step.label}</div>
              </div>
              {i<2&&<div style={{width:32,height:1,background:T.border,flexShrink:0,marginTop:18}}/>}
            </div>
          ))}
        </div>
        <button style={{...primaryStyle,maxWidth:380,margin:"0 auto 18px",display:"block",fontSize:16,padding:"1rem"}} onClick={onStart}>Find my Sparq →</button>
        <button onClick={onBrowse} style={{background:"none",border:"none",color:T.textDim,fontSize:13,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>Just want to explore? Browse careers</button>
      </div>
    </div>
  );
}

function HomeScreen({selectedIndustries,onSelectMode,onReset,onStartOver,industries}) {
  const modes=[
    {id:"abstract",icon:"◈",name:"The Abstract Quiz",desc:"Strange questions. Surprising results."},
    {id:"cinematic",icon:"◎",name:"The Cinematic Quiz",desc:"Pick movie scenes. Find where you fit."},
    {id:"bubble",icon:"✦",name:"Career Bubble Map",desc:"Click and explore. Watch careers branch."},
    {id:"moody",icon:"◉",name:"The Deep Dive",desc:"Introspective. What drives you at your core?"},
  ];
  const activeInds = selectedIndustries.length>0?industries.filter(i=>selectedIndustries.includes(i.id)):industries;
  return (
    <Screen>
      <div style={eyebrowStyle}>Sparq</div>
      <div style={{...headlineStyle,fontSize:30,marginBottom:4}}>What will you<br/>become?</div>
      <div style={{...subStyle,marginBottom:16}}>Explore careers you've never heard of.</div>
      {selectedIndustries.length>0&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
          {activeInds.map(ind=><span key={ind.id} style={pillStyle(ind.color)}>{ind.icon} {ind.name}</span>)}
          <button onClick={onReset} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:600,color:T.textMid,cursor:"pointer"}}>Change ×</button>
        </div>
      )}
      <div className="mode-card-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
        {modes.map(m=>(
          <div key={m.id} onClick={()=>onSelectMode(m.id)} style={{...cardStyle,cursor:"pointer",marginBottom:0,transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent1;e.currentTarget.style.background=T.bgDeep;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.bgCard;}}>
            <div style={{fontSize:22,marginBottom:8}}>{m.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{m.name}</div>
            <div style={{fontSize:11,color:T.textMid,lineHeight:1.4}}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div style={{...eyebrowStyle,marginBottom:10}}>Browse by industry</div>
      {activeInds.map(ind=>(
        <div key={ind.id} onClick={()=>onSelectMode("industry:"+ind.id)} style={{...cardStyle,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=ind.color;e.currentTarget.style.background=ind.bg;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.bgCard;}}>
          <span style={{fontSize:18}}>{ind.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>{ind.name}</div>
            <div style={{fontSize:11,color:T.textDim}}>{ind.careers.length} careers inside</div>
          </div>
          <span style={{color:T.textDim,fontSize:16}}>›</span>
        </div>
      ))}
      <div style={{height:16}}/>
      <button onClick={onStartOver} style={ghostStyle}>↩ Start over</button>
    </Screen>
  );
}

function QuizScreen({quizKey,onBack,onComplete}) {
  const quiz=quizzes[quizKey];
  const [currentQ,setCurrentQ]=useState(0);
  const [selected,setSelected]=useState(null);
  const [scores,setScores]=useState({});
  const question=quiz.questions[currentQ];
  const progress=(currentQ/quiz.questions.length)*100;
  function handleNext(){
    if(!selected)return;
    const ns={...scores,[selected]:(scores[selected]||0)+1};
    setScores(ns);setSelected(null);
    if(currentQ+1<quiz.questions.length){setCurrentQ(currentQ+1);}
    else{const top=Object.entries(ns).sort((a,b)=>b[1]-a[1])[0][0];onComplete(top);}
  }
  return (
    <Screen>
      <button style={backStyle} onClick={onBack}>← Back</button>
      <div style={{height:3,background:T.bgCard,borderRadius:2,marginBottom:24}}>
        <div style={{height:3,width:`${progress}%`,background:`linear-gradient(90deg,${T.accent1},${T.accent2})`,borderRadius:2,transition:"width 0.4s"}}/>
      </div>
      <div style={eyebrowStyle}>Question {currentQ+1} of {quiz.questions.length}</div>
      <div style={{...headlineStyle,fontSize:20,marginBottom:4}}>{question.q}</div>
      <div style={{fontSize:13,color:T.textDim,fontStyle:"italic",marginBottom:20}}>{question.flavor}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {question.opts.map(opt=>(
          <div key={opt.value} onClick={()=>setSelected(opt.value)} style={{background:selected===opt.value?T.bgDeep:T.bgCard,border:`${selected===opt.value?2:1}px solid ${selected===opt.value?T.accent1:T.border}`,borderRadius:14,padding:"0.9rem 1rem",cursor:"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all 0.15s"}}>
            <span style={{fontSize:15,flexShrink:0,marginTop:1,color:T.textMid}}>{opt.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>{opt.text}</div>
              <div style={{fontSize:11,color:T.textDim,marginTop:2}}>{opt.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleNext} style={{...primaryStyle,opacity:selected?1:0.4,cursor:selected?"pointer":"default"}}>
        {currentQ+1===quiz.questions.length?"See my results":"Continue"}
      </button>
    </Screen>
  );
}

function ResultScreen({profileKey,selectedIndustries,onBack,onExploreBubble,onViewCareer,onRetake,industries}) {
  const fallback=["analytical","creative","social","investigative","builder","adventurous","visionary"];
  const profile=profiles[profileKey]||profiles[fallback[0]];
  const relevantInds=selectedIndustries.length>0
    ?industries.filter(i=>selectedIndustries.includes(i.id)||profile.industryFit.includes(i.id))
    :industries.filter(i=>profile.industryFit.includes(i.id));
  const allCareers=industries.flatMap(i=>i.careers);
  const suggestedCareers=relevantInds.flatMap(i=>i.careers).slice(0,6);
  const intersections=selectedIndustries.length>=2?getIntersections(new Set(selectedIndustries)):[];
  // Map each intersection career name → the two source industry IDs that generated it
  const intersectionSourceMap={};
  for(let i=0;i<selectedIndustries.length;i++) for(let j=i+1;j<selectedIndustries.length;j++){
    const a=selectedIndustries[i],b=selectedIndustries[j];
    const careers=intersectionCareers[`${a},${b}`]||intersectionCareers[`${b},${a}`];
    const ids=intersectionCareers[`${a},${b}`]?[a,b]:[b,a];
    if(careers) careers.forEach(name=>{ if(!intersectionSourceMap[name]) intersectionSourceMap[name]=ids; });
  }
  return (
    <Screen>
      <button style={backStyle} onClick={onBack}>← Back</button>
      <div style={{textAlign:"center",padding:"1rem 0 1.5rem"}}>
        <div style={{display:"inline-block",...pillStyle(T.accentPurple),marginBottom:10,letterSpacing:"0.06em"}}>{profile.type}</div>
        <div style={{fontSize:26,fontWeight:800,color:T.text,marginBottom:8}}>{profile.title}</div>
        <div style={{fontSize:14,color:T.textMid,lineHeight:1.6,maxWidth:320,margin:"0 auto"}}>{profile.desc}</div>
      </div>
      {intersections.length>0&&(
        <>
          <div style={{...eyebrowStyle,background:`linear-gradient(90deg,${T.accentPurple},${T.accent1})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Careers at your intersection</div>
          <div className="career-grid" style={{marginBottom:20}}>
            {intersections.slice(0,4).map(name=>{
              const careerObj=allCareers.find(c=>c.title===name)||{title:name};
              const sourceInds=(intersectionSourceMap[name]||[]).map(id=>industries.find(i=>i.id===id)).filter(Boolean);
              return (
                <div key={name} onClick={()=>onViewCareer(careerObj)} style={{...cardStyle,marginBottom:0,border:`1px solid ${T.accentPurple}44`,background:`linear-gradient(135deg,${T.bgCard},${T.accentPurple}11)`,cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentPurple;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${T.accentPurple}44`;}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{name}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {sourceInds.map(ind=>(
                          <span key={ind.id} style={{background:`${ind.color}18`,border:`1px solid ${ind.color}40`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:600,color:ind.color}}>{ind.name}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{color:T.textDim,fontSize:18,marginLeft:8,flexShrink:0}}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div style={eyebrowStyle}>Careers that match you</div>
      <div className="career-grid">
        {suggestedCareers.map(c=>{
          const tags=[
            ...(c.primary_industry?[c.primary_industry]:[]),
            ...(c.secondary_industries?c.secondary_industries.split(",").map(s=>s.trim()).filter(Boolean):[]),
          ];
          return (
            <div key={c.title} onClick={()=>onViewCareer(c)} style={{...cardStyle,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent1;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{c.title}</div>
                {tags.length>0&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:5}}>
                    {tags.map(tag=>{
                      const ind=industries.find(i=>i.id===normalizeIndustryId(tag));
                      const color=ind?ind.color:T.textDim;
                      return <span key={tag} style={{background:`${color}18`,border:`1px solid ${color}40`,borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:600,color}}>{tag}</span>;
                    })}
                  </div>
                )}
                <div style={{fontSize:12,color:T.accent1}}>{c.salary}</div>
              </div>
              <span style={{color:T.textDim,fontSize:18,marginLeft:8}}>›</span>
            </div>
          );
        })}
      </div>
      <div style={{height:12}}/>
      <button style={primaryStyle} onClick={onExploreBubble}>Explore the career universe →</button>
      <div style={{height:20}}/>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onRetake} style={ghostStyle}>↺ Retake quiz</button>
        <button onClick={onBack} style={ghostStyle}>← Try a different quiz</button>
      </div>
    </Screen>
  );
}


function IndustryBrowse({industryId,onBack,onViewCareer,industries}) {
  const industry=industries.find(i=>i.id===industryId);
  if(!industry)return null;
  return (
    <Screen>
      <button style={backStyle} onClick={onBack}>← Back</button>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <span style={{fontSize:28}}>{industry.icon}</span>
        <div style={{fontSize:24,fontWeight:800,color:T.text}}>{industry.name}</div>
      </div>
      <div style={{...subStyle,marginBottom:20}}>Careers inside this world</div>
      <div className="browse-career-grid">
        {industry.careers.map(c=>(
          <div key={c.title} onClick={()=>onViewCareer(c,industry.color)} style={{...cardStyle,cursor:"pointer",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=industry.color;e.currentTarget.style.background=industry.bg;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.bgCard;}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>{c.title}</div>
                <div style={{fontSize:12,color:T.textMid,marginBottom:8,lineHeight:1.4}}>{c.desc}</div>
                <span style={pillStyle(industry.color)}>{c.salary}</span>
              </div>
              <span style={{color:T.textDim,fontSize:18,marginLeft:8}}>›</span>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}


// Screens that are safe to restore on reload (excludes mid-quiz and transient screens)
const RESTORABLE = new Set(["industry","home","result","bubble","browse"]);

function ls(key,fallback){try{const v=localStorage.getItem(key);return v!=null?JSON.parse(v):fallback;}catch{return fallback;}}
function lsSet(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}
function lsClear(){["ce_screen","ce_industries","ce_profile"].forEach(k=>localStorage.removeItem(k));}

function AppContent({ signOut }) {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('name').eq('id', user.id).single().then(({ data, error }) => {
      if (error || !data || !data.name) setShowOnboarding(true);
    });
  }, [user?.id]);
  const [screen,setScreen]=useState(()=>{
    const seenLanding=localStorage.getItem("ce_landing_seen")!==null;
    if(!seenLanding) return "landing";
    const s=ls("ce_screen","industry"); return RESTORABLE.has(s)?s:"industry";
  });
  const [selectedIndustries,setSelected]=useState(()=>ls("ce_industries",[]));
  const [activeQuiz,setActiveQuiz]=useState(null);
  const [resultProfile,setResultProfile]=useState(()=>ls("ce_profile",null));
  const [activeCareer,setActiveCareer]=useState(null);
  const [activeCareerColor,setCareerColor]=useState(null);
  const [browseIndustry,setBrowseIndustry]=useState(null);
  const [prevScreen,setPrevScreen]=useState(null);
  const [industries,setIndustries]=useState(STATIC_INDUSTRIES);

  useEffect(()=>{
    fetchCareers().then(careers=>{
      setIndustries(STATIC_INDUSTRIES.map(ind=>({
        ...ind,
        careers: careers
          .filter(c=>normalizeIndustryId(c.primary_industry)===ind.id)
          .map(c=>({
            title: c.name,
            salary: c.salary_range,
            desc: c.description,
            school: "",
            day: "",
            growth: [],
            primary_industry: c.primary_industry,
            secondary_industries: c.secondary_industries,
          })),
      })));
    }).catch(err=>console.error("Airtable fetch failed:",err));
  },[]);

  useEffect(()=>{ if(RESTORABLE.has(screen)) lsSet("ce_screen",screen); },[screen]);
  useEffect(()=>{ lsSet("ce_industries",selectedIndustries); },[selectedIndustries]);
  useEffect(()=>{ if(resultProfile!=null) lsSet("ce_profile",resultProfile); },[resultProfile]);

  function goTo(s){setPrevScreen(screen);setScreen(s);}
  function handleSelectMode(mode){
    if(mode.startsWith("industry:")){setBrowseIndustry(mode.split(":")[1]);goTo("browse");return;}
    if(mode==="bubble"){goTo("bubble");return;}
    setActiveQuiz(mode);goTo("quiz");
  }
  function handleViewCareer(career,color){
    const normalized = career.title ? career : {
      title:career.t, salary:career.s, school:career.sc,
      desc:career.d, day:career.day, growth:career.growth
    };
    setActiveCareer(normalized);setCareerColor(color);goTo("career");
  }
  function handleStartOver(){
    lsClear();
    setSelected([]);setResultProfile(null);setActiveQuiz(null);
    setActiveCareer(null);setCareerColor(null);setBrowseIndustry(null);
    setPrevScreen(null);setScreen("industry");
  }

  return (
    <div className={screen!=="industry"&&screen!=="landing" ? "app-shell has-sidebar" : "app-shell"}
         style={{minHeight:"100vh",background:T.bg,fontFamily:"'Inter',system-ui,sans-serif",position:"relative"}}>
      {/* Top-right nav buttons */}
      <div style={{position:"fixed",top:14,right:16,zIndex:9999,display:"flex",gap:8,alignItems:"center"}}>
        <button
          onClick={() => setShowProfile(true)}
          title="Profile"
          style={{padding:"6px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.textMid,fontSize:14,cursor:"pointer",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>
        <button
          onClick={signOut}
          style={{padding:"6px 14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:8,color:T.textMid,fontSize:12,cursor:"pointer"}}
        >
          Sign out
        </button>
      </div>

      {showOnboarding && (
        <OnboardingScreen
          onComplete={() => setShowOnboarding(false)}
          onStartQuiz={() => { setShowOnboarding(false); setShowQuiz(true); }}
        />
      )}

      {showQuiz && (
        <OnboardingQuiz
          onComplete={(industries) => {
            supabase.from('profiles').upsert({ id: user.id, industries });
            setShowQuiz(false);
            setShowProfile(true);
          }}
        />
      )}

      {showProfile && <ProfilePage onClose={() => setShowProfile(false)} onRetakeQuiz={() => { setShowProfile(false); setShowQuiz(true); }} />}

      {screen!=="industry"&&screen!=="landing" && (
        <DesktopSidebar
          screen={screen}
          activeQuiz={activeQuiz}
          selectedIndustries={selectedIndustries}
          onSelectMode={handleSelectMode}
          onStartOver={handleStartOver}
          industries={industries}
        />
      )}
      <div className="main-content">
        {screen==="landing"  && <LandingScreen onStart={()=>{localStorage.setItem("ce_landing_seen","1");setScreen("industry");}} onBrowse={()=>{localStorage.setItem("ce_landing_seen","1");setSelected([]);setScreen("home");}}/>}
        {screen==="industry" && <IndustryPicker onDone={ids=>{setSelected(ids);setScreen("home");}} industries={industries}/>}
        {screen==="home"     && <HomeScreen selectedIndustries={selectedIndustries} onSelectMode={handleSelectMode} onReset={()=>setScreen("industry")} onStartOver={handleStartOver} industries={industries}/>}
        {screen==="quiz"     && <QuizScreen quizKey={activeQuiz} onBack={()=>setScreen("home")} onComplete={p=>{setResultProfile(p);goTo("result");}}/>}
        {screen==="result"   && <ResultScreen profileKey={resultProfile} selectedIndustries={selectedIndustries} onBack={()=>setScreen("home")} onExploreBubble={()=>goTo("bubble")} onViewCareer={handleViewCareer} onRetake={()=>setScreen("industry")} industries={industries}/>}
        {screen==="career"   && <CareerTimeline career={activeCareer} industryColor={activeCareerColor} onBack={()=>setScreen(prevScreen||"home")}/>}
        {screen==="browse"   && <IndustryBrowse industryId={browseIndustry} onBack={()=>setScreen("home")} onViewCareer={handleViewCareer} industries={industries}/>}
        {screen==="bubble"   && <BubbleScreen selectedIndustries={selectedIndustries} onBack={()=>setScreen("home")} onViewCareer={handleViewCareer} industries={industries}/>}
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{color:T.textMid,fontSize:15}}>Loading…</div>
    </div>
  );

  if (!user) return <LoginScreen />;

  return <AppContent signOut={signOut} />;
}
