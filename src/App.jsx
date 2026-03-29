import { useState, useEffect, useRef } from "react";

// ============================================================
// CAREER DATA
// ============================================================

const quizzes = {
  abstract: {
    name: "The Abstract Quiz",
    description: "Strange questions. Surprising results.",
    questions: [
      {
        q: "You find an unmarked door in a building. What do you do?",
        flavor: "There's no sign. No handle. Just a door.",
        opts: [
          { icon: "◧", text: "Pull out my phone and research it first", sub: "It could be anything — I want to know before I act.", value: "analytical" },
          { icon: "◨", text: "Open it immediately", sub: "The unknown is the point.", value: "adventurous" },
          { icon: "◩", text: "Sketch the door and walk away", sub: "I'd rather imagine what's behind it.", value: "creative" },
          { icon: "◪", text: "Find someone who knows", sub: "There's always a person with the answer.", value: "social" },
        ],
      },
      {
        q: "If your brain were a room, what would it look like?",
        flavor: "Close your eyes for a second.",
        opts: [
          { icon: "▣", text: "A lab with experiments everywhere", sub: "Half-finished ideas all over the place.", value: "investigative" },
          { icon: "▤", text: "A concert hall mid-performance", sub: "Loud, beautiful, a little chaotic.", value: "creative" },
          { icon: "▥", text: "A very organized filing system", sub: "Everything labeled. Nothing out of place.", value: "analytical" },
          { icon: "▦", text: "A living room full of people", sub: "Always someone new coming through.", value: "social" },
        ],
      },
      {
        q: "A stranger gives you $10,000. You can't spend it on yourself. What do you do?",
        flavor: "No wrong answer here.",
        opts: [
          { icon: "◐", text: "Fund a project that solves something", sub: "I'd find the most broken thing and fix it.", value: "builder" },
          { icon: "◑", text: "Give it to people I know need it", sub: "Impact closest to home first.", value: "social" },
          { icon: "◒", text: "Invest it to make more", sub: "$10k can become $50k with the right moves.", value: "analytical" },
          { icon: "◓", text: "Use it to make something beautiful", sub: "A film, an event, a piece of art.", value: "creative" },
        ],
      },
      {
        q: "Which superpower would quietly ruin your life?",
        flavor: "Think about it.",
        opts: [
          { icon: "◔", text: "Reading everyone's mind", sub: "Too much noise. Too much truth.", value: "investigative" },
          { icon: "◕", text: "Seeing every possible future", sub: "The weight of knowing what could go wrong.", value: "analytical" },
          { icon: "◖", text: "Making everyone agree with you", sub: "You'd never know if they really meant it.", value: "social" },
          { icon: "◗", text: "Creating anything you imagine instantly", sub: "The process is the whole point.", value: "creative" },
        ],
      },
      {
        q: "You have to leave behind one thing forever. What's hardest to lose?",
        flavor: "Be honest.",
        opts: [
          { icon: "▲", text: "The ability to be surprised", sub: "Knowing what comes next would hollow everything out.", value: "adventurous" },
          { icon: "△", text: "Making people feel seen", sub: "Connection is what I'm here for.", value: "social" },
          { icon: "▴", text: "Building something that lasts", sub: "I need to know I made a mark.", value: "builder" },
          { icon: "▵", text: "Figuring out how things really work", sub: "Curiosity is my whole personality.", value: "investigative" },
        ],
      },
    ],
  },
  cinematic: {
    name: "The Cinematic Quiz",
    description: "Pick movie scenes. Find where you belong.",
    questions: [
      {
        q: "Which movie scene feels most like your inner world?",
        flavor: "Don't overthink it — go with your gut.",
        opts: [
          { icon: "◈", text: "The heist planning scene", sub: "Everyone has a role. The plan is everything.", value: "analytical" },
          { icon: "✦", text: "The montage where everything comes together", sub: "Hard work. Growth. The music swells.", value: "builder" },
          { icon: "◎", text: "The unexpected road trip", sub: "No map. Just people and possibility.", value: "adventurous" },
          { icon: "◉", text: "The quiet scene where someone finally tells the truth", sub: "Real over polished, every time.", value: "social" },
        ],
      },
      {
        q: "In every group project in every movie, you are...",
        flavor: "You know which one you are.",
        opts: [
          { icon: "▣", text: "The one who sees what nobody else sees", sub: "And has to convince everyone else to believe it.", value: "visionary" },
          { icon: "▤", text: "The one who actually gets things done", sub: "While everyone argues, you're already halfway there.", value: "builder" },
          { icon: "▥", text: "The one who keeps everyone from falling apart", sub: "The glue. The heart.", value: "social" },
          { icon: "▦", text: "The wildcard with the unexpected idea", sub: "Nobody saw it coming. It works.", value: "creative" },
        ],
      },
      {
        q: "The villain in your story is...",
        flavor: "Every hero has one.",
        opts: [
          { icon: "◐", text: "A broken system nobody else can see", sub: "You're fighting something invisible.", value: "investigative" },
          { icon: "◑", text: "Wasted potential — yours or others'", sub: "Nothing bothers you more than talent going nowhere.", value: "builder" },
          { icon: "◒", text: "Boredom. Repetition. Sameness.", sub: "You'd rather burn it down than be ordinary.", value: "adventurous" },
          { icon: "◓", text: "Indifference — people not caring enough", sub: "You feel things so the world doesn't have to.", value: "social" },
        ],
      },
      {
        q: "The last scene of your movie shows you...",
        flavor: "What's the image?",
        opts: [
          { icon: "◔", text: "Standing in front of something you built", sub: "A company, a city, a movement.", value: "builder" },
          { icon: "◕", text: "Somewhere unexpected, bag in hand", sub: "The adventure isn't over.", value: "adventurous" },
          { icon: "◖", text: "In a room full of people who matter to you", sub: "This is what it was all for.", value: "social" },
          { icon: "◗", text: "Alone, looking at something only you understand", sub: "Satisfied. Finally.", value: "investigative" },
        ],
      },
      {
        q: "Your origin story starts with...",
        flavor: "The moment everything shifted.",
        opts: [
          { icon: "▲", text: "A question nobody could answer for you", sub: "So you had to find out yourself.", value: "investigative" },
          { icon: "△", text: "A person who believed in you before you did", sub: "You've been trying to deserve it ever since.", value: "social" },
          { icon: "▴", text: "A moment you saw something broken and couldn't look away", sub: "Fixing things is just who you are.", value: "builder" },
          { icon: "▵", text: "A feeling you couldn't name but had to chase", sub: "You're still chasing it.", value: "creative" },
        ],
      },
    ],
  },
  moody: {
    name: "The Deep Dive",
    description: "Introspective. What drives you at your core?",
    questions: [
      {
        q: "What keeps you up at night — not with anxiety, but with aliveness?",
        flavor: "The thing your brain won't let go of.",
        opts: [
          { icon: "◧", text: "A problem I haven't solved yet", sub: "The kind that feels just within reach.", value: "investigative" },
          { icon: "◨", text: "A world that could be so much better", sub: "And the gap between here and there.", value: "builder" },
          { icon: "◩", text: "Something I want to make that doesn't exist yet", sub: "I can see it. I just can't build it yet.", value: "creative" },
          { icon: "◪", text: "People. Always people.", sub: "What they feel. What they need. What they could become.", value: "social" },
        ],
      },
      {
        q: "When you help someone and it actually works, what part felt best?",
        flavor: "Be specific with yourself.",
        opts: [
          { icon: "▣", text: "That I saw what others missed", sub: "The insight was mine.", value: "investigative" },
          { icon: "▤", text: "That I actually did something about it", sub: "Not just talked — acted.", value: "builder" },
          { icon: "▥", text: "The look on their face", sub: "The moment it landed.", value: "social" },
          { icon: "▦", text: "That I found a way nobody expected", sub: "Creative solutions are my love language.", value: "creative" },
        ],
      },
      {
        q: "What do you want people to say about you at 60?",
        flavor: "Not what you want to achieve. What you want to have been.",
        opts: [
          { icon: "◐", text: "They saw things coming before anyone else", sub: "A mind ahead of its time.", value: "visionary" },
          { icon: "◑", text: "They made something that mattered", sub: "Built something real.", value: "builder" },
          { icon: "◒", text: "They made people feel less alone", sub: "Their presence changed the room.", value: "social" },
          { icon: "◓", text: "They never stopped asking why", sub: "Relentless curiosity until the end.", value: "investigative" },
        ],
      },
      {
        q: "What's the most honest version of why you care about your future?",
        flavor: "Strip away the impressive answer.",
        opts: [
          { icon: "◔", text: "I want to understand how the world actually works", sub: "Not the version we're sold.", value: "investigative" },
          { icon: "◕", text: "I want to build something bigger than me", sub: "Something that outlasts me.", value: "builder" },
          { icon: "◖", text: "I want the people I love to be okay", sub: "Everything else is secondary.", value: "social" },
          { icon: "◗", text: "I want to feel like I used all of myself", sub: "No wasted potential.", value: "creative" },
        ],
      },
      {
        q: "The version of you that settled — what did they give up?",
        flavor: "You've imagined them. We all have.",
        opts: [
          { icon: "▲", text: "The chance to ask the questions that scared them", sub: "They played it safe intellectually.", value: "investigative" },
          { icon: "△", text: "The thing they were building in secret", sub: "They stopped before it was real.", value: "builder" },
          { icon: "▴", text: "The people they could have brought with them", sub: "They went alone.", value: "social" },
          { icon: "▵", text: "The work that would have felt like play", sub: "They chose stable over alive.", value: "creative" },
        ],
      },
    ],
  },
};

const profiles = {
  analytical: { type: "The Architect", title: "You think in systems", desc: "You see patterns others miss and need to understand the 'why' behind everything. You belong in roles where deep thinking creates real leverage.", careers: ["Data Scientist", "Quant Analyst", "UX Researcher", "Systems Designer", "Product Strategist", "AI Policy Analyst", "Behavioral Economist", "Epidemiologist"] },
  creative:   { type: "The Maker",     title: "You build worlds",     desc: "You're driven by the need to make things that didn't exist before. You belong where craft meets vision.", careers: ["Creative Director", "Game Designer", "Spatial Designer", "Brand Strategist", "Experience Designer", "Set Designer", "Music Supervisor", "Art Technologist"] },
  social:     { type: "The Connector", title: "You move through people", desc: "You understand what humans need before they say it. You belong in roles where relationships are the product.", careers: ["Community Director", "Chief of Staff", "Culture Strategist", "Event Producer", "Talent Partner", "Diplomacy & Policy", "Social Impact PM", "Partnerships Lead"] },
  investigative: { type: "The Explorer", title: "You chase truth", desc: "Curiosity is your engine. You need work that keeps revealing new layers — problems without obvious answers.", careers: ["Investigative Journalist", "Climate Scientist", "Forensic Analyst", "Venture Researcher", "Ethnographer", "Intelligence Analyst", "Deep Tech Founder", "Bioethicist"] },
  builder:    { type: "The Operator",  title: "You make things real",  desc: "Ideas are fine. But you need to see something get built. You thrive where execution is everything.", careers: ["Startup Founder", "Product Manager", "Launch Strategist", "Operations Lead", "Urban Planner", "Infrastructure Engineer", "COO", "Social Enterprise Builder"] },
  adventurous:{ type: "The Pioneer",   title: "You need the frontier", desc: "Routine is your kryptonite. You belong somewhere the map hasn't been drawn yet.", careers: ["Expedition Leader", "Crisis Correspondent", "Satellite Engineer", "Deep Sea Researcher", "Space Tourism Strategist", "Field Epidemiologist", "Conflict Mediator", "Wilderness Therapist"] },
  visionary:  { type: "The Visionary", title: "You live in the future", desc: "You see what doesn't exist yet and can't stop talking about it. You belong at the intersection of ideas and influence.", careers: ["Futurist", "Venture Capitalist", "Chief Innovation Officer", "Political Strategist", "Sci-Fi Consultant", "Foresight Analyst", "Technology Ethicist", "Startup Studio Founder"] },
};

const bubbleData = [
  { id: "ml",       label: "Machine Learning Eng", sub: "builds AI models",   x: 50, y: 38, r: 52, color: "#8B7EF8", bg: "#8B7EF8", salary: "$140–200k", school: "CS/Math degree or bootcamp",  desc: "Train AI systems that learn from data. You sit at the center of the AI revolution.", related: ["data", "product", "ethics", "research"] },
  { id: "data",     label: "Data Scientist",        sub: "finds patterns",     x: 20, y: 62, r: 46, color: "#7B6EE8", bg: "#7B6EE8", salary: "$110–170k", school: "Stats, Math, or CS",          desc: "Turn massive datasets into decisions that change how companies operate.", related: ["ml", "analyst", "viz"] },
  { id: "product",  label: "AI Product Manager",    sub: "ships AI products",  x: 78, y: 65, r: 44, color: "#00D4B4", bg: "#00D4B4", salary: "$130–190k", school: "Any degree + PM experience", desc: "Bridge the gap between AI engineers and real users. Strategy meets execution.", related: ["ml", "design", "growth"] },
  { id: "ethics",   label: "AI Ethics Researcher",  sub: "keeps AI honest",    x: 18, y: 25, r: 38, color: "#E86B8B", bg: "#E86B8B", salary: "$90–150k",  school: "Philosophy, Law, CS",        desc: "One of the most important jobs of the next 50 years. Ensure AI systems are fair, safe, and human.", related: ["ml", "policy", "research"] },
  { id: "design",   label: "AI UX Designer",        sub: "makes AI human",     x: 82, y: 28, r: 36, color: "#00E5C4", bg: "#00E5C4", salary: "$100–155k", school: "Design + curiosity about AI", desc: "Design how humans talk to AI. The rarest and most needed skill in tech right now.", related: ["product", "viz", "ml"] },
  { id: "research", label: "AI Researcher",         sub: "pushes the frontier",x: 50, y: 80, r: 42, color: "#5BA8F0", bg: "#5BA8F0", salary: "$160–300k", school: "PhD or top MS program",       desc: "Work at Anthropic, OpenAI, DeepMind. Push what AI can do at the fundamental level.", related: ["ml", "ethics", "data"] },
  { id: "policy",   label: "Tech Policy Analyst",   sub: "shapes the rules",   x:  6, y: 46, r: 32, color: "#F0A84A", bg: "#F0A84A", salary: "$80–140k",  school: "Law, Poli Sci, or Economics", desc: "Write the laws and frameworks that govern AI and big tech. High stakes, high impact.", related: ["ethics", "research"] },
  { id: "growth",   label: "Growth Engineer",       sub: "scales products",    x: 91, y: 78, r: 30, color: "#7ED44A", bg: "#7ED44A", salary: "$120–180k", school: "CS or self-taught",           desc: "Use data and code to grow products exponentially. Part engineer, part marketer, all results.", related: ["product", "data", "analyst"] },
  { id: "analyst",  label: "Business Analyst",      sub: "translates data",    x: 32, y: 88, r: 28, color: "#A89ECC", bg: "#A89ECC", salary: "$75–120k",  school: "Business, Econ, or CS",      desc: "Turn complex data into stories that executives actually use to make decisions.", related: ["data", "growth"] },
  { id: "viz",      label: "Data Visualization",    sub: "makes data beautiful",x:68, y: 88, r: 26, color: "#F06E6E", bg: "#F06E6E", salary: "$85–130k",  school: "Design + stats combo",        desc: "The rare person who can make a spreadsheet feel like a story. Incredibly in demand.", related: ["design", "data", "analyst"] },
];

// ============================================================
// DESIGN TOKENS
// ============================================================

const C = {
  bg:         "#080810",
  surface:    "#0F0F1A",
  surface2:   "#161626",
  border:     "rgba(255,255,255,0.07)",
  purple:     "#8B7EF8",
  purpleDim:  "rgba(139,126,248,0.10)",
  purpleGlow: "rgba(139,126,248,0.28)",
  teal:       "#00E5C4",
  tealDim:    "rgba(0,229,196,0.10)",
  text:       "#F0EFFE",
  muted:      "#6B6B90",
  dim:        "#3A3A5C",
};

const ease = "cubic-bezier(0.4, 0, 0.2, 1)";

const backBtn = {
  background:  "none",
  border:      "none",
  color:       C.muted,
  fontSize:    "11px",
  cursor:      "pointer",
  marginBottom:"1.75rem",
  padding:     0,
  display:     "flex",
  alignItems:  "center",
  gap:         "6px",
  fontFamily:  "'Space Grotesk', sans-serif",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

// ============================================================
// SHARED COMPONENTS
// ============================================================

function CareerChip({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.tealDim : C.surface,
        border:     `1px solid ${hovered ? "rgba(0,229,196,0.28)" : C.border}`,
        borderRadius: "20px",
        padding:    "6px 15px",
        fontSize:   "12px",
        fontWeight: 500,
        cursor:     "default",
        color:      hovered ? C.teal : "#A8A5CC",
        transition: `all 0.22s ${ease}`,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {label}
    </span>
  );
}

function OptionCard({ opt, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    selected ? "rgba(139,126,248,0.09)" : hovered ? "rgba(255,255,255,0.025)" : C.surface,
        border:        `${selected ? "1.5px" : "1px"} solid ${selected ? C.purple : hovered ? "rgba(255,255,255,0.11)" : C.border}`,
        borderRadius:  "16px",
        padding:       "0.95rem 1.1rem",
        cursor:        "pointer",
        display:       "flex",
        gap:           "14px",
        alignItems:    "flex-start",
        transition:    `all 0.22s ${ease}`,
        boxShadow:     selected ? `0 0 22px rgba(139,126,248,0.14), inset 0 1px 0 rgba(139,126,248,0.08)` : "none",
        transform:     selected ? "none" : hovered ? "translateX(4px)" : "none",
      }}
    >
      <span style={{
        fontSize:   "16px",
        flexShrink: 0,
        color:      selected ? C.purple : C.muted,
        transition: `color 0.2s`,
        marginTop:  "1px",
      }}>{opt.icon}</span>
      <div>
        <div style={{
          fontSize:   "13px",
          fontWeight: 600,
          color:      selected ? C.text : hovered ? C.text : "#C0BDDE",
          transition: `color 0.2s`,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>{opt.text}</div>
        <div style={{ fontSize: "11px", color: C.muted, marginTop: "3px", lineHeight: 1.45 }}>{opt.sub}</div>
      </div>
    </div>
  );
}

// ============================================================
// SCREENS
// ============================================================

function HomeScreen({ onSelectMode }) {
  const modes = [
    { id: "abstract",  icon: "◈", name: "The Abstract Quiz",   desc: "Strange questions. Surprising results. Careers you'd never think to Google.", accent: C.purple },
    { id: "cinematic", icon: "◎", name: "The Cinematic Quiz",  desc: "Pick movie scenes, moments, and feelings. Find where you fit.", accent: C.teal },
    { id: "bubble",    icon: "✦", name: "Career Bubble Map",   desc: "Click and explore. Watch careers branch into other careers.", accent: C.purple },
    { id: "moody",     icon: "◉", name: "The Deep Dive",       desc: "Introspective. What drives you at your core?", accent: C.teal },
  ];

  return (
    <div style={{ padding: "2.75rem 1.5rem 3rem" }}>
      <div style={{
        fontSize:      "10px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color:         C.teal,
        marginBottom:  "1.1rem",
        fontFamily:    "'Space Grotesk', sans-serif",
        fontWeight:    500,
      }}>
        Career Explorer
      </div>

      <h1 style={{
        fontFamily:    "'Syne', sans-serif",
        fontSize:      "clamp(38px, 11vw, 54px)",
        fontWeight:    800,
        lineHeight:    1.02,
        marginBottom:  "1.1rem",
        letterSpacing: "-0.025em",
        background:    `linear-gradient(140deg, ${C.text} 0%, #B8B0FF 55%, ${C.teal} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor:  "transparent",
        backgroundClip: "text",
      }}>
        WHAT WILL<br />YOU BECOME?
      </h1>

      <p style={{
        color:         C.muted,
        fontSize:      "14px",
        lineHeight:    1.7,
        marginBottom:  "2.5rem",
        maxWidth:      "300px",
        fontWeight:    400,
      }}>
        Explore careers you've never heard of. Take a weird quiz or wander the career universe.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {modes.map((m) => <ModeCard key={m.id} mode={m} onClick={() => onSelectMode(m.id)} />)}
      </div>
    </div>
  );
}

function ModeCard({ mode, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    hovered ? "rgba(139,126,248,0.07)" : C.surface,
        border:        `1px solid ${hovered ? "rgba(139,126,248,0.38)" : C.border}`,
        borderRadius:  "20px",
        padding:       "1.3rem 1.1rem",
        cursor:        "pointer",
        transition:    `all 0.28s ${ease}`,
        boxShadow:     hovered
          ? `0 0 28px rgba(139,126,248,0.12), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `inset 0 1px 0 rgba(255,255,255,0.025)`,
        transform:     hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div style={{
        fontSize:      "20px",
        marginBottom:  "0.8rem",
        color:         hovered ? mode.accent : C.muted,
        transition:    `color 0.2s`,
      }}>{mode.icon}</div>
      <div style={{
        fontFamily:    "'Syne', sans-serif",
        fontSize:      "13px",
        fontWeight:    700,
        marginBottom:  "5px",
        color:         hovered ? C.text : "#C0BDDE",
        letterSpacing: "0.01em",
        transition:    `color 0.2s`,
      }}>{mode.name}</div>
      <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.45 }}>{mode.desc}</div>
    </div>
  );
}

function QuizScreen({ quizKey, onBack, onComplete }) {
  const quiz = quizzes[quizKey];
  const [currentQ, setCurrentQ]       = useState(0);
  const [selected, setSelected]       = useState(null);
  const [scores, setScores]           = useState({});
  const [qVisible, setQVisible]       = useState(true);

  const question = quiz.questions[currentQ];
  const progress = (currentQ / quiz.questions.length) * 100;

  function handleNext() {
    if (!selected) return;
    const newScores = { ...scores, [selected]: (scores[selected] || 0) + 1 };
    setScores(newScores);
    setQVisible(false);
    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 < quiz.questions.length) {
        setCurrentQ(currentQ + 1);
        setTimeout(() => setQVisible(true), 40);
      } else {
        const top = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
        onComplete(top);
      }
    }, 280);
  }

  return (
    <div style={{ padding: "2rem 1.5rem", minHeight: "100vh" }}>
      <button onClick={onBack} style={backBtn}>← Back</button>

      {/* Progress bar */}
      <div style={{
        height:       "2px",
        background:   C.surface2,
        borderRadius: "1px",
        marginBottom: "2.25rem",
        overflow:     "hidden",
      }}>
        <div style={{
          height:     "100%",
          width:      `${progress}%`,
          background: `linear-gradient(90deg, ${C.purple}, ${C.teal})`,
          borderRadius: "1px",
          transition: `width 0.55s ${ease}`,
          boxShadow:  `0 0 8px ${C.purpleGlow}`,
        }} />
      </div>

      {/* Question content */}
      <div style={{
        opacity:    qVisible ? 1 : 0,
        transform:  qVisible ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.28s ease, transform 0.28s ease`,
      }}>
        <div style={{
          fontSize:      "10px",
          color:         C.dim,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom:  "0.8rem",
          fontFamily:    "'Space Grotesk', sans-serif",
        }}>
          {currentQ + 1} <span style={{ opacity: 0.4 }}>/ {quiz.questions.length}</span>
        </div>

        <h2 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      "21px",
          fontWeight:    700,
          lineHeight:    1.3,
          marginBottom:  "0.55rem",
          color:         C.text,
          letterSpacing: "-0.01em",
        }}>{question.q}</h2>

        <p style={{
          fontSize:     "13px",
          color:        C.muted,
          fontStyle:    "italic",
          marginBottom: "1.75rem",
          lineHeight:   1.5,
        }}>{question.flavor}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
          {question.opts.map((opt) => (
            <OptionCard
              key={opt.value}
              opt={opt}
              selected={selected === opt.value}
              onClick={() => setSelected(opt.value)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        style={{
          width:         "100%",
          padding:       "1rem",
          background:    selected ? `linear-gradient(135deg, ${C.purple} 0%, #6052D8 100%)` : C.surface2,
          color:         selected ? "#fff" : C.dim,
          border:        selected ? "none" : `1px solid ${C.border}`,
          borderRadius:  "16px",
          fontSize:      "12px",
          fontWeight:    600,
          cursor:        selected ? "pointer" : "default",
          transition:    `all 0.3s ${ease}`,
          fontFamily:    "'Space Grotesk', sans-serif",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          boxShadow:     selected ? `0 4px 22px rgba(139,126,248,0.38)` : "none",
        }}
      >
        {currentQ + 1 === quiz.questions.length ? "Reveal my path →" : "Continue →"}
      </button>
    </div>
  );
}

function ResultScreen({ profileKey, onBack, onExploreBubble }) {
  const profile = profiles[profileKey] || profiles["analytical"];

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <button onClick={onBack} style={backBtn}>← Back</button>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "0.5rem 0 2rem" }}>
        <div style={{
          display:       "inline-flex",
          alignItems:    "center",
          background:    "rgba(139,126,248,0.10)",
          border:        "1px solid rgba(139,126,248,0.28)",
          color:         C.purple,
          fontSize:      "10px",
          fontWeight:    700,
          padding:       "5px 16px",
          borderRadius:  "20px",
          marginBottom:  "1.5rem",
          fontFamily:    "'Space Grotesk', sans-serif",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          {profile.type}
        </div>

        <h1 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      "clamp(30px, 9vw, 42px)",
          fontWeight:    800,
          marginBottom:  "1rem",
          letterSpacing: "-0.025em",
          background:    `linear-gradient(140deg, ${C.text} 0%, ${C.purple} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor:  "transparent",
          backgroundClip: "text",
          lineHeight:    1.1,
        }}>{profile.title}</h1>

        <p style={{
          fontSize:   "14px",
          color:      C.muted,
          lineHeight: 1.7,
          maxWidth:   "300px",
          margin:     "0 auto",
        }}>{profile.desc}</p>
      </div>

      {/* Divider */}
      <div style={{
        height:       "1px",
        background:   `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
        marginBottom: "1.5rem",
      }} />

      <div style={{
        fontSize:      "10px",
        color:         C.dim,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        marginBottom:  "0.85rem",
        fontFamily:    "'Space Grotesk', sans-serif",
      }}>Careers that match your profile</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2.25rem" }}>
        {profile.careers.map((c) => <CareerChip key={c} label={c} />)}
      </div>

      <CinematicButton onClick={onExploreBubble}>
        Explore the career universe →
      </CinematicButton>
    </div>
  );
}

function CinematicButton({ onClick, children, secondary }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:         "100%",
        padding:       "1rem",
        background:    secondary
          ? (hovered ? C.surface2 : "transparent")
          : `linear-gradient(135deg, ${hovered ? "#9B8EFF" : C.purple} 0%, ${hovered ? "#7262E8" : "#6052D8"} 100%)`,
        color:         secondary ? C.muted : "#fff",
        border:        secondary ? `1px solid ${C.border}` : "none",
        borderRadius:  "16px",
        fontSize:      "12px",
        fontWeight:    600,
        cursor:        "pointer",
        transition:    `all 0.28s ${ease}`,
        fontFamily:    "'Space Grotesk', sans-serif",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        boxShadow:     secondary ? "none" : hovered
          ? `0 6px 28px rgba(139,126,248,0.5)`
          : `0 4px 20px rgba(139,126,248,0.34)`,
        transform:     hovered ? "translateY(-1px)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function BubbleScreen({ onBack }) {
  const wrapRef = useRef(null);
  const [activeBubble, setActiveBubble] = useState(null);
  const [visited, setVisited]           = useState(new Set());

  function selectBubble(b) {
    setActiveBubble(b);
    setVisited(prev => new Set([...prev, b.id]));
  }

  return (
    <div style={{ padding: "2rem 1.5rem" }}>
      <button onClick={onBack} style={backBtn}>← Back</button>

      <div style={{
        fontSize:      "10px",
        color:         C.teal,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginBottom:  "5px",
        fontFamily:    "'Space Grotesk', sans-serif",
        fontWeight:    500,
      }}>Career Universe — Tech & AI</div>
      <p style={{ fontSize: "12px", color: C.dim, marginBottom: "1.25rem" }}>
        Tap any node to explore. Lines show connected roles.
      </p>

      {/* Bubble canvas */}
      <div
        ref={wrapRef}
        style={{
          position:     "relative",
          width:        "100%",
          height:       "420px",
          background:   `radial-gradient(ellipse at 50% 45%, rgba(139,126,248,0.07) 0%, ${C.bg} 68%)`,
          borderRadius: "20px",
          border:       `1px solid ${C.border}`,
          overflow:     "hidden",
          marginBottom: "1.1rem",
        }}
      >
        {/* Connection lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {bubbleData.map(b => b.related.map(rid => {
            const target = bubbleData.find(x => x.id === rid);
            if (!target) return null;
            const lit = activeBubble && (activeBubble.id === b.id || activeBubble.id === rid);
            return (
              <line
                key={`${b.id}-${rid}`}
                x1={`${b.x}%`} y1={`${b.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke={lit ? C.purple : "rgba(255,255,255,0.05)"}
                strokeWidth={lit ? "1.5" : "1"}
                strokeDasharray="3,6"
                opacity={lit ? 0.85 : 0.4}
                style={{ transition: `all 0.3s ${ease}` }}
              />
            );
          }))}
        </svg>

        {/* Bubbles */}
        {bubbleData.map(b => {
          const isActive  = activeBubble?.id === b.id;
          const isRelated = activeBubble?.related.includes(b.id);
          const isVisited = visited.has(b.id);
          const opacity   = activeBubble
            ? (isActive || isRelated ? 1 : 0.22)
            : (isVisited ? 0.6 : 1);

          return (
            <div
              key={b.id}
              onClick={() => selectBubble(b)}
              style={{
                position:      "absolute",
                width:         `${b.r * 2}px`,
                height:        `${b.r * 2}px`,
                left:          `calc(${b.x}% - ${b.r}px)`,
                top:           `calc(${b.y}% - ${b.r}px)`,
                borderRadius:  "50%",
                background:    isActive
                  ? `radial-gradient(circle at 40% 35%, ${b.color}30 0%, ${b.color}08 70%)`
                  : "rgba(255,255,255,0.018)",
                border:        isActive
                  ? `2px solid ${b.color}`
                  : isRelated
                    ? `1.5px solid ${b.color}70`
                    : `1px solid ${b.color}40`,
                display:       "flex",
                flexDirection: "column",
                alignItems:    "center",
                justifyContent:"center",
                cursor:        "pointer",
                opacity,
                transform:     isActive ? "scale(1.13)" : "scale(1)",
                transition:    `all 0.3s ${ease}`,
                textAlign:     "center",
                boxShadow:     isActive
                  ? `0 0 28px ${b.color}50, inset 0 0 18px ${b.color}12`
                  : isRelated
                    ? `0 0 12px ${b.color}28`
                    : "none",
              }}
            >
              <span style={{
                fontSize:   "9px",
                fontWeight: 700,
                color:      isActive || isRelated ? b.color : `${b.color}80`,
                lineHeight: 1.2,
                padding:    "0 6px",
                fontFamily: "'Space Grotesk', sans-serif",
                transition: `color 0.25s`,
              }}>{b.label}</span>
              <span style={{
                fontSize:   "8px",
                color:      `${b.color}60`,
                marginTop:  "2px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>{b.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {activeBubble && (
        <div style={{
          background:   C.surface,
          border:       `1px solid rgba(139,126,248,0.18)`,
          borderRadius: "20px",
          padding:      "1.3rem",
          boxShadow:    "0 6px 32px rgba(0,0,0,0.35)",
          animation:    `fadeInUp 0.32s ${ease}`,
        }}>
          <div style={{
            display:       "inline-block",
            background:    `${activeBubble.color}1A`,
            color:         activeBubble.color,
            fontSize:      "10px",
            fontWeight:    700,
            padding:       "3px 10px",
            borderRadius:  "10px",
            marginBottom:  "0.6rem",
            fontFamily:    "'Space Grotesk', sans-serif",
            letterSpacing: "0.06em",
          }}>{activeBubble.sub}</div>

          <div style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:      "19px",
            fontWeight:    700,
            marginBottom:  "6px",
            color:         C.text,
          }}>{activeBubble.label}</div>

          <p style={{
            fontSize:     "12px",
            color:        C.muted,
            lineHeight:   1.6,
            marginBottom: "1rem",
          }}>{activeBubble.desc}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "0.8rem" }}>
            {[
              { label: "Salary",    value: activeBubble.salary,  valueColor: C.teal },
              { label: "Education", value: activeBubble.school,   valueColor: C.text },
            ].map(({ label, value, valueColor }) => (
              <div key={label} style={{
                background:   C.surface2,
                borderRadius: "12px",
                padding:      "0.8rem",
                border:       `1px solid ${C.border}`,
              }}>
                <div style={{
                  fontSize:      "9px",
                  color:         C.dim,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom:  "5px",
                  fontFamily:    "'Space Grotesk', sans-serif",
                }}>{label}</div>
                <div style={{
                  fontSize:   "12px",
                  fontWeight: 600,
                  color:      valueColor,
                  lineHeight: 1.3,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: "11px", color: C.muted }}>
            <span style={{
              fontSize:      "9px",
              color:         C.dim,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginRight:   "6px",
            }}>Connected to</span>
            {activeBubble.related.map(r => bubbleData.find(x => x.id === r)?.label || r).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [screen, setScreen]             = useState("home");
  const [activeQuiz, setActiveQuiz]     = useState(null);
  const [resultProfile, setResultProfile] = useState(null);
  const [visible, setVisible]           = useState(true);

  function navigate(newScreen, setup) {
    setVisible(false);
    setTimeout(() => {
      if (setup) setup();
      setScreen(newScreen);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 340);
  }

  function handleSelectMode(mode) {
    if (mode === "bubble") { navigate("bubble"); return; }
    navigate("quiz", () => setActiveQuiz(mode));
  }

  return (
    <div style={{
      maxWidth:   "480px",
      margin:     "0 auto",
      minHeight:  "100vh",
      background: C.bg,
      fontFamily: "'Space Grotesk', sans-serif",
      position:   "relative",
    }}>
      {/* Ambient top glow */}
      <div style={{
        position:      "fixed",
        top:           0,
        left:          "50%",
        transform:     "translateX(-50%)",
        width:         "480px",
        height:        "1px",
        background:    `linear-gradient(90deg, transparent, ${C.purple}, ${C.teal}, transparent)`,
        opacity:       0.6,
        pointerEvents: "none",
        zIndex:        10,
      }} />

      <div style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.38s ${ease}, transform 0.38s ${ease}`,
      }}>
        {screen === "home"   && <HomeScreen onSelectMode={handleSelectMode} />}
        {screen === "quiz"   && (
          <QuizScreen
            quizKey={activeQuiz}
            onBack={() => navigate("home")}
            onComplete={(profile) => navigate("result", () => setResultProfile(profile))}
          />
        )}
        {screen === "result" && (
          <ResultScreen
            profileKey={resultProfile}
            onBack={() => navigate("home")}
            onExploreBubble={() => navigate("bubble")}
          />
        )}
        {screen === "bubble" && <BubbleScreen onBack={() => navigate("home")} />}
      </div>
    </div>
  );
}
