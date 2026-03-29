import { useState, useRef } from "react";

const INDUSTRIES = [
  {
    id: "tech", name: "Tech & AI", icon: "◈",
    color: "#7F77DD",
    glow: "rgba(127,119,221,0.6)",
    shimmer: "rgba(127,119,221,0.35)",
    careers: [
      { t: "Machine Learning Engineer", s: "$140–200k", sc: "CS / Math degree or bootcamp", d: "Train AI systems that learn from data. You sit at the center of the AI revolution.", day: "Running experiments, reviewing model performance, collaborating with product teams.", growth: [{ role: "Junior ML Engineer", salary: "$95k", years: "Now" }, { role: "ML Engineer", salary: "$140k", years: "2 yrs" }, { role: "Senior ML Engineer", salary: "$175k", years: "5 yrs" }, { role: "Staff / AI Lead", salary: "$230k+", years: "10 yrs" }] },
      { t: "AI Product Manager", s: "$130–190k", sc: "Any degree + PM experience", d: "Bridge the gap between AI engineers and real users.", day: "Writing product specs, running user research, coordinating engineering and design.", growth: [{ role: "Associate PM", salary: "$90k", years: "Now" }, { role: "Product Manager", salary: "$130k", years: "2 yrs" }, { role: "Senior PM", salary: "$160k", years: "5 yrs" }, { role: "Director of Product", salary: "$210k+", years: "10 yrs" }] },
      { t: "AI Ethics Researcher", s: "$90–150k", sc: "Philosophy, Law, or CS", d: "One of the most important jobs of the next 50 years. Ensure AI is fair and safe.", day: "Auditing models for bias, writing policy briefs, collaborating with legal and engineering.", growth: [{ role: "Research Assistant", salary: "$70k", years: "Now" }, { role: "Ethics Researcher", salary: "$110k", years: "2 yrs" }, { role: "Senior Researcher", salary: "$145k", years: "5 yrs" }, { role: "Head of AI Ethics", salary: "$200k+", years: "10 yrs" }] },
      { t: "Creative Technologist", s: "$85–140k", sc: "Design, CS, or Fine Arts", d: "Sit at the intersection of art and code. Build experiences that feel like magic.", day: "Prototyping interactive installations, pitching to creative directors, coding in unusual ways.", growth: [{ role: "Jr Creative Tech", salary: "$65k", years: "Now" }, { role: "Creative Technologist", salary: "$95k", years: "2 yrs" }, { role: "Senior Creative Tech", salary: "$130k", years: "5 yrs" }, { role: "Creative Tech Director", salary: "$180k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "health", name: "Healthcare & Science", icon: "◎",
    color: "#1D9E75",
    glow: "rgba(29,158,117,0.6)",
    shimmer: "rgba(29,158,117,0.35)",
    careers: [
      { t: "Health Informatics Manager", s: "$95–145k", sc: "Health Informatics or CS", d: "Manage how hospitals use data to save lives.", day: "Meeting with clinical staff, overseeing EHR systems, analyzing patient outcome data.", growth: [{ role: "Data Analyst", salary: "$65k", years: "Now" }, { role: "Informatics Specialist", salary: "$90k", years: "2 yrs" }, { role: "Informatics Manager", salary: "$120k", years: "5 yrs" }, { role: "Chief Informatics Officer", salary: "$180k+", years: "10 yrs" }] },
      { t: "Clinical AI Researcher", s: "$110–170k", sc: "Biology + CS or MD/PhD", d: "Build AI that helps doctors diagnose diseases earlier and more accurately.", day: "Training models on medical imaging, presenting findings to clinicians.", growth: [{ role: "Research Assistant", salary: "$70k", years: "Now" }, { role: "Clinical AI Researcher", salary: "$115k", years: "2 yrs" }, { role: "Senior Researcher", salary: "$155k", years: "5 yrs" }, { role: "Research Director", salary: "$220k+", years: "10 yrs" }] },
      { t: "Bioethicist", s: "$80–130k", sc: "Philosophy, Medicine, or Law", d: "Navigate the moral questions that come with medical advances.", day: "Consulting on ethics committees, writing policy, teaching medical students.", growth: [{ role: "Ethics Coordinator", salary: "$60k", years: "Now" }, { role: "Bioethicist", salary: "$85k", years: "2 yrs" }, { role: "Senior Bioethicist", salary: "$115k", years: "5 yrs" }, { role: "Director of Ethics", salary: "$160k+", years: "10 yrs" }] },
      { t: "Digital Therapeutics PM", s: "$120–175k", sc: "Business, Health, or CS", d: "Build FDA-approved apps that treat real medical conditions.", day: "Working with clinical teams, managing regulatory submissions, running product sprints.", growth: [{ role: "Associate PM", salary: "$85k", years: "Now" }, { role: "Product Manager", salary: "$125k", years: "2 yrs" }, { role: "Senior PM", salary: "$155k", years: "5 yrs" }, { role: "VP of Product", salary: "$210k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "biz", name: "Business & Finance", icon: "◉",
    color: "#BA7517",
    glow: "rgba(186,117,23,0.6)",
    shimmer: "rgba(186,117,23,0.35)",
    careers: [
      { t: "Venture Capitalist", s: "$150–400k+", sc: "Finance, Business, or top MBA", d: "Evaluate startups and help decide which companies get funded.", day: "Taking founder meetings, conducting due diligence, attending board meetings.", growth: [{ role: "Analyst", salary: "$90k", years: "Now" }, { role: "Associate", salary: "$130k", years: "2 yrs" }, { role: "Principal", salary: "$200k", years: "5 yrs" }, { role: "Partner", salary: "$400k+", years: "10 yrs" }] },
      { t: "Impact Investment Analyst", s: "$80–130k", sc: "Finance, Economics, or Policy", d: "Invest in companies doing good — clean energy, education, healthcare access.", day: "Analyzing financial models, meeting with social enterprises, writing investment memos.", growth: [{ role: "Junior Analyst", salary: "$70k", years: "Now" }, { role: "Analyst", salary: "$90k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$115k", years: "5 yrs" }, { role: "Portfolio Director", salary: "$170k+", years: "10 yrs" }] },
      { t: "Startup CFO", s: "$160–280k", sc: "Accounting, Finance, or MBA", d: "The financial brain of a startup. Help founders not run out of money.", day: "Building financial models, leading fundraising rounds, managing investor relations.", growth: [{ role: "Financial Analyst", salary: "$75k", years: "Now" }, { role: "Finance Manager", salary: "$110k", years: "2 yrs" }, { role: "VP Finance", salary: "$160k", years: "5 yrs" }, { role: "CFO", salary: "$280k+", years: "10 yrs" }] },
      { t: "Revenue Manager", s: "$75–130k", sc: "Business, Math, or Hospitality", d: "Use data and algorithms to price products in real time.", day: "Analyzing demand patterns, adjusting pricing strategies, presenting forecasts to leadership.", growth: [{ role: "Revenue Analyst", salary: "$55k", years: "Now" }, { role: "Revenue Manager", salary: "$85k", years: "2 yrs" }, { role: "Senior Revenue Manager", salary: "$110k", years: "5 yrs" }, { role: "VP Revenue", salary: "$160k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "creative", name: "Creative & Culture", icon: "✦",
    color: "#D4537E",
    glow: "rgba(212,83,126,0.6)",
    shimmer: "rgba(212,83,126,0.35)",
    careers: [
      { t: "Creative Director", s: "$110–200k", sc: "Design, Fine Arts, or self-taught", d: "Set the visual and emotional direction for brands, campaigns, and products.", day: "Running creative reviews, briefing designers and writers, presenting concepts to clients.", growth: [{ role: "Junior Designer", salary: "$55k", years: "Now" }, { role: "Mid Designer", salary: "$85k", years: "2 yrs" }, { role: "Senior Designer", salary: "$120k", years: "5 yrs" }, { role: "Creative Director", salary: "$180k+", years: "10 yrs" }] },
      { t: "Music Supervisor", s: "$70–150k", sc: "Music, Film, or Communications", d: "Choose the music for films, TV shows, and ads. One of the most coveted creative jobs.", day: "Pitching songs to directors, negotiating licensing deals, attending film cuts.", growth: [{ role: "Music Coordinator", salary: "$45k", years: "Now" }, { role: "Music Supervisor", salary: "$80k", years: "2 yrs" }, { role: "Sr Music Supervisor", salary: "$120k", years: "5 yrs" }, { role: "Head of Music", salary: "$180k+", years: "10 yrs" }] },
      { t: "Brand Strategist", s: "$80–150k", sc: "Marketing, Business, or Design", d: "Figure out what a brand stands for and how it should show up in the world.", day: "Running brand workshops, analyzing cultural trends, writing strategy decks.", growth: [{ role: "Brand Analyst", salary: "$55k", years: "Now" }, { role: "Brand Strategist", salary: "$85k", years: "2 yrs" }, { role: "Sr Brand Strategist", salary: "$120k", years: "5 yrs" }, { role: "Chief Brand Officer", salary: "$200k+", years: "10 yrs" }] },
      { t: "Experience Designer", s: "$90–155k", sc: "Design, Architecture, or Theater", d: "Design physical and digital experiences — pop-ups, retail, events, museums.", day: "Sketching spatial concepts, coordinating with architects, managing vendor builds.", growth: [{ role: "Jr Experience Designer", salary: "$60k", years: "Now" }, { role: "Experience Designer", salary: "$95k", years: "2 yrs" }, { role: "Sr Experience Designer", salary: "$130k", years: "5 yrs" }, { role: "Experience Director", salary: "$190k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "law", name: "Law & Policy", icon: "▣",
    color: "#378ADD",
    glow: "rgba(55,138,221,0.6)",
    shimmer: "rgba(55,138,221,0.35)",
    careers: [
      { t: "Tech Policy Analyst", s: "$80–140k", sc: "Law, Poli Sci, or Economics", d: "Write the laws and frameworks that govern AI and big tech.", day: "Researching legislation, briefing senators, writing policy white papers.", growth: [{ role: "Policy Coordinator", salary: "$55k", years: "Now" }, { role: "Policy Analyst", salary: "$80k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$110k", years: "5 yrs" }, { role: "Policy Director", salary: "$160k+", years: "10 yrs" }] },
      { t: "Startup General Counsel", s: "$150–250k", sc: "Law degree (JD)", d: "Be the only lawyer at a fast-growing startup. Handle everything from contracts to fundraising.", day: "Reviewing term sheets, advising founders on risk, managing outside counsel.", growth: [{ role: "Associate Attorney", salary: "$90k", years: "Now" }, { role: "Staff Attorney", salary: "$130k", years: "2 yrs" }, { role: "General Counsel", salary: "$175k", years: "5 yrs" }, { role: "Chief Legal Officer", salary: "$280k+", years: "10 yrs" }] },
      { t: "Human Rights Investigator", s: "$55–100k", sc: "Law, International Relations, or Journalism", d: "Document atrocities and build legal cases for international courts.", day: "Conducting field interviews, analyzing evidence, writing investigative reports.", growth: [{ role: "Research Assistant", salary: "$45k", years: "Now" }, { role: "Investigator", salary: "$65k", years: "2 yrs" }, { role: "Senior Investigator", salary: "$90k", years: "5 yrs" }, { role: "Director of Investigations", salary: "$130k+", years: "10 yrs" }] },
      { t: "Privacy Engineer", s: "$130–190k", sc: "CS + Law or Policy background", d: "Build the technical systems that protect user data and keep companies compliant.", day: "Auditing data flows, implementing privacy-by-design features, advising engineering teams.", growth: [{ role: "Privacy Analyst", salary: "$85k", years: "Now" }, { role: "Privacy Engineer", salary: "$130k", years: "2 yrs" }, { role: "Senior Privacy Eng", salary: "$165k", years: "5 yrs" }, { role: "Head of Privacy", salary: "$220k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "sports", name: "Sports & Entertainment", icon: "▤",
    color: "#D85A30",
    glow: "rgba(216,90,48,0.6)",
    shimmer: "rgba(216,90,48,0.35)",
    careers: [
      { t: "Sports Analytics Lead", s: "$90–160k", sc: "Statistics, CS, or Sports Science", d: "Help teams win using data. Every major league team has an analytics department.", day: "Building player performance models, presenting insights to coaching staff.", growth: [{ role: "Data Analyst", salary: "$60k", years: "Now" }, { role: "Sports Analyst", salary: "$90k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$120k", years: "5 yrs" }, { role: "Head of Analytics", salary: "$180k+", years: "10 yrs" }] },
      { t: "Athlete Brand Manager", s: "$80–160k", sc: "Marketing, Business, or Comms", d: "Build and protect the personal brand of professional athletes.", day: "Vetting brand deals, managing social content strategy, coordinating media appearances.", growth: [{ role: "Brand Coordinator", salary: "$50k", years: "Now" }, { role: "Brand Manager", salary: "$85k", years: "2 yrs" }, { role: "Sr Brand Manager", salary: "$120k", years: "5 yrs" }, { role: "Chief Brand Officer", salary: "$200k+", years: "10 yrs" }] },
      { t: "Fan Experience Director", s: "$80–140k", sc: "Business, Marketing, or Hospitality", d: "Design what it feels like to be at a game, concert, or live event.", day: "Overseeing in-venue activations, managing sponsor integrations, analyzing fan feedback.", growth: [{ role: "Events Coordinator", salary: "$45k", years: "Now" }, { role: "Fan Experience Manager", salary: "$75k", years: "2 yrs" }, { role: "Director", salary: "$110k", years: "5 yrs" }, { role: "VP Fan Experience", salary: "$175k+", years: "10 yrs" }] },
      { t: "Esports Strategist", s: "$70–130k", sc: "Business, Marketing, or Game Design", d: "Build teams, leagues, and brand partnerships in gaming.", day: "Scouting players, negotiating sponsorship deals, managing tournament logistics.", growth: [{ role: "Esports Coordinator", salary: "$50k", years: "Now" }, { role: "Esports Manager", salary: "$75k", years: "2 yrs" }, { role: "Sr Strategist", salary: "$105k", years: "5 yrs" }, { role: "Esports Director", salary: "$160k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "edu", name: "Education", icon: "▥",
    color: "#639922",
    glow: "rgba(99,153,34,0.6)",
    shimmer: "rgba(99,153,34,0.35)",
    careers: [
      { t: "EdTech Product Manager", s: "$110–170k", sc: "Education, CS, or Business", d: "Build tools that change how millions of kids learn.", day: "Running teacher focus groups, writing product specs, analyzing learning outcome data.", growth: [{ role: "Associate PM", salary: "$80k", years: "Now" }, { role: "Product Manager", salary: "$115k", years: "2 yrs" }, { role: "Senior PM", salary: "$150k", years: "5 yrs" }, { role: "VP Product", salary: "$210k+", years: "10 yrs" }] },
      { t: "Learning Experience Designer", s: "$70–120k", sc: "Education, Instructional Design, or Psychology", d: "Design how people learn — online courses, corporate training, school curricula.", day: "Storyboarding lessons, collaborating with subject matter experts, testing learning outcomes.", growth: [{ role: "Instructional Designer", salary: "$55k", years: "Now" }, { role: "LX Designer", salary: "$80k", years: "2 yrs" }, { role: "Senior LX Designer", salary: "$105k", years: "5 yrs" }, { role: "Director of Learning", salary: "$150k+", years: "10 yrs" }] },
      { t: "Education Policy Analyst", s: "$65–110k", sc: "Education, Public Policy, or Economics", d: "Shape national education policy. Work with governments to fix broken systems.", day: "Analyzing test score data, writing policy briefs, presenting to school boards.", growth: [{ role: "Policy Researcher", salary: "$50k", years: "Now" }, { role: "Policy Analyst", salary: "$70k", years: "2 yrs" }, { role: "Senior Analyst", salary: "$95k", years: "5 yrs" }, { role: "Policy Director", salary: "$140k+", years: "10 yrs" }] },
      { t: "AI Curriculum Developer", s: "$80–130k", sc: "Education + CS background", d: "Build the courses that teach the next generation how to think about AI.", day: "Researching AI trends, writing curriculum, collaborating with teachers and engineers.", growth: [{ role: "Curriculum Writer", salary: "$55k", years: "Now" }, { role: "Curriculum Developer", salary: "$80k", years: "2 yrs" }, { role: "Sr Curriculum Dev", salary: "$110k", years: "5 yrs" }, { role: "Head of Curriculum", salary: "$155k+", years: "10 yrs" }] },
    ]
  },
  {
    id: "travel", name: "Travel & Hospitality", icon: "▦",
    color: "#534AB7",
    glow: "rgba(83,74,183,0.6)",
    shimmer: "rgba(83,74,183,0.35)",
    careers: [
      { t: "Luxury Travel Advisor", s: "$80–200k", sc: "Hospitality, Business, or self-built client base", d: "Curate extraordinary trips for high-net-worth clients.", day: "Consulting with clients on dream trips, booking exclusive experiences, managing itineraries.", growth: [{ role: "Travel Coordinator", salary: "$45k", years: "Now" }, { role: "Travel Advisor", salary: "$80k", years: "2 yrs" }, { role: "Senior Advisor", salary: "$130k", years: "5 yrs" }, { role: "Agency Owner / Director", salary: "$200k+", years: "10 yrs" }] },
      { t: "Destination Experience Designer", s: "$70–130k", sc: "Hospitality, Architecture, or Cultural Studies", d: "Design what a destination feels like for tourists and travelers.", day: "Scouting locations, working with local artists and chefs, designing tour experiences.", growth: [{ role: "Experience Coordinator", salary: "$45k", years: "Now" }, { role: "Experience Designer", salary: "$75k", years: "2 yrs" }, { role: "Sr Experience Designer", salary: "$105k", years: "5 yrs" }, { role: "Director of Experiences", salary: "$155k+", years: "10 yrs" }] },
      { t: "Hotel General Manager", s: "$100–300k", sc: "Hospitality Management degree", d: "Run an entire hotel — the staff, the guest experience, the finances, all of it.", day: "Walking the property, meeting department heads, handling VIP guests, reviewing financials.", growth: [{ role: "Front Desk Agent", salary: "$38k", years: "Now" }, { role: "Asst Manager", salary: "$65k", years: "2 yrs" }, { role: "Hotel GM", salary: "$120k", years: "5 yrs" }, { role: "Regional VP", salary: "$250k+", years: "10 yrs" }] },
      { t: "Travel Tech PM", s: "$120–180k", sc: "Business, CS, or Hospitality", d: "Build the apps that power how people discover, book, and experience travel.", day: "Running sprints with engineers, conducting traveler research, defining product roadmap.", growth: [{ role: "Associate PM", salary: "$85k", years: "Now" }, { role: "Product Manager", salary: "$125k", years: "2 yrs" }, { role: "Senior PM", salary: "$155k", years: "5 yrs" }, { role: "Director of Product", salary: "$210k+", years: "10 yrs" }] },
    ]
  },
];

function Bubble({ size, color, glow, shimmer, icon, name, sub, onClick, style = {} }) {
  const r = size / 2;
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease, filter 0.6s ease",
        ...style,
      }}
    >
      {/* Main bubble shell — mostly transparent with color tint */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `
          radial-gradient(circle at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 45%),
          radial-gradient(circle at 65% 70%, ${shimmer} 0%, transparent 55%),
          radial-gradient(circle at 15% 70%, rgba(120,200,255,0.2) 0%, transparent 45%),
          radial-gradient(circle at 80% 20%, rgba(255,180,220,0.18) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)
        `,
        border: `1.5px solid rgba(255,255,255,0.28)`,
        boxShadow: `
          inset 0 0 ${r * 0.6}px rgba(255,255,255,0.06),
          inset ${r * 0.1}px ${r * 0.1}px ${r * 0.4}px ${shimmer},
          0 0 ${r * 0.8}px ${glow},
          0 0 ${r * 1.6}px ${glow.replace("0.6", "0.2")}
        `,
      }} />

      {/* Iridescent rim — the rainbow edge */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "transparent",
        boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.2), inset 0 0 0 3px ${shimmer}`,
      }} />

      {/* Big white shine — top left */}
      <div style={{
        position: "absolute",
        top: "8%", left: "12%",
        width: "38%", height: "32%",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.75)",
        filter: `blur(${r * 0.16}px)`,
        pointerEvents: "none",
      }} />

      {/* Small sparkle — top right */}
      <div style={{
        position: "absolute",
        top: "14%", right: "16%",
        width: "18%", height: "14%",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.55)",
        filter: `blur(${r * 0.1}px)`,
        pointerEvents: "none",
      }} />

      {/* Bottom color blush */}
      <div style={{
        position: "absolute",
        bottom: "12%", left: "20%",
        width: "60%", height: "22%",
        borderRadius: "50%",
        background: shimmer,
        filter: `blur(${r * 0.18}px)`,
        pointerEvents: "none",
      }} />

      {/* Label */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 6, zIndex: 2,
      }}>
        {icon && (
          <div style={{
            fontSize: size > 70 ? 18 : 14,
            marginBottom: 3,
            filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))",
          }}>{icon}</div>
        )}
        <div style={{
          fontSize: size > 70 ? 10 : 8.5,
          fontWeight: 700,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.25,
          textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)",
        }}>{name}</div>
        {sub && (
          <div style={{
            fontSize: 8,
            color: "rgba(255,255,255,0.7)",
            marginTop: 2,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function Connector({ color }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
      <div style={{
        width: 1.5,
        height: 30,
        background: `linear-gradient(180deg, ${color}80, ${color}10)`,
        borderRadius: 2,
        animation: "drawLine 0.8s ease forwards",
      }} />
    </div>
  );
}

export default function BubbleScreen({ selectedIndustries, onBack, onViewCareer }) {
  const [activeInd, setActiveInd] = useState(null);
  const [activeCareer, setActiveCareer] = useState(null);
  const canvasRef = useRef(null);

  const visibleInds = selectedIndustries && selectedIndustries.length > 0
    ? INDUSTRIES.filter(i => selectedIndustries.includes(i.id))
    : INDUSTRIES;

  function selectInd(ind) {
    if (activeInd?.id === ind.id) return;
    setActiveInd(ind);
    setActiveCareer(null);
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }, 400);
  }

  function selectCareer(career) {
    if (activeCareer?.t === career.t) return;
    setActiveCareer(career);
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }, 300);
  }

  return (
    <div className="bubble-screen-wrapper" style={{ padding: "1.25rem 1rem" }}>
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes floatB { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(5px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawLine { from{height:0;opacity:0} to{opacity:1} }
        @keyframes cardIn { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      <button onClick={onBack} style={{ background: "none", border: "none", color: "#4A4D66", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>← Back</button>
      <div style={{ fontSize: 10, color: "#06B6D4", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Career Universe</div>
      <div style={{ fontSize: 12, color: "#4A4D66", marginBottom: 14 }}>Tap an industry bubble to explore its careers</div>

      <div
        ref={canvasRef}
        className="bubble-canvas"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: 560,
          scrollBehavior: "smooth",
          paddingBottom: 16,
        }}
      >
        {/* Industry row */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, paddingTop: 8, paddingBottom: 4 }}>
          {visibleInds.map((ind, i) => (
            <Bubble
              key={ind.id}
              size={76}
              color={ind.color}
              glow={ind.glow}
              shimmer={ind.shimmer}
              icon={ind.icon}
              name={ind.name}
              onClick={() => selectInd(ind)}
              style={{
                opacity: activeInd ? (activeInd.id === ind.id ? 1 : 0.35) : 1,
                transform: activeInd?.id === ind.id ? "scale(1.08)" : "scale(1)",
                filter: activeInd && activeInd.id !== ind.id ? "saturate(0.5) brightness(0.65)" : "none",
                animation: !activeInd ? `${i % 2 === 0 ? "floatA" : "floatB"} ${3.2 + i * 0.22}s ease-in-out infinite ${i * 0.15}s` : "none",
              }}
            />
          ))}
        </div>

        {!activeInd && (
          <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.18)", padding: "6px 0 12px" }}>
            tap any bubble to explore
          </div>
        )}

        {/* Career layer */}
        {activeInd && (
          <>
            <Connector color={activeInd.color} />
            <div style={{
              fontSize: 10, color: activeInd.color, letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 700,
              textAlign: "center", marginBottom: 8,
              animation: "fadeIn 0.5s ease forwards",
            }}>
              {activeInd.name}
            </div>
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center",
              gap: 10, paddingBottom: 4,
              animation: "fadeIn 0.6s ease forwards",
            }}>
              {activeInd.careers.map((career, i) => (
                <Bubble
                  key={career.t}
                  size={70}
                  color={activeInd.color}
                  glow={activeInd.glow}
                  shimmer={activeInd.shimmer}
                  icon=""
                  name={career.t}
                  sub={career.s}
                  onClick={() => selectCareer(career)}
                  style={{
                    opacity: activeCareer ? (activeCareer.t === career.t ? 1 : 0.32) : 1,
                    transform: activeCareer?.t === career.t ? "scale(1.08)" : "scale(1)",
                    filter: activeCareer && activeCareer.t !== career.t ? "saturate(0.4) brightness(0.6)" : "none",
                    animation: !activeCareer ? `${i % 2 === 0 ? "floatA" : "floatB"} ${3 + i * 0.3}s ease-in-out infinite ${i * 0.2}s` : "none",
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.14)", padding: "4px 0 8px", fontStyle: "italic" }}>
              ↑ scroll up to pick a different industry
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.18)", paddingBottom: 8 }}>
              {!activeCareer ? "tap a career to learn more" : ""}
            </div>
          </>
        )}

        {/* Detail card */}
        {activeCareer && (
          <>
            <Connector color={activeInd.color} />
            <div style={{
              margin: "4px 0 12px",
              background: `${activeInd.color}14`,
              border: `1px solid ${activeInd.color}35`,
              borderRadius: 16,
              padding: "1rem 1.1rem",
              animation: "cardIn 0.6s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#E0E8FF", marginBottom: 3 }}>{activeCareer.t}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: activeInd.color, marginBottom: 6 }}>{activeCareer.s}</div>
              <div style={{ fontSize: 12, color: "#8B8FA8", lineHeight: 1.6, marginBottom: 10 }}>{activeCareer.d}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ background: `${activeInd.color}20`, border: `1px solid ${activeInd.color}45`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 600, color: activeInd.color }}>
                  📚 {activeCareer.sc}
                </span>
              </div>
              {onViewCareer && (
                <button
                  onClick={() => onViewCareer(activeCareer, activeInd.color)}
                  style={{
                    width: "100%", padding: "0.75rem",
                    background: `linear-gradient(135deg, #06B6D4, #3B82F6)`,
                    color: "#fff", border: "none", borderRadius: 12,
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  See full career roadmap →
                </button>
              )}
            </div>
            <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.14)", fontStyle: "italic", paddingBottom: 8 }}>
              ↑ scroll up to explore other careers
            </div>
          </>
        )}
      </div>
    </div>
  );
}
