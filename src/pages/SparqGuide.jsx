import { useState } from "react";

const T = {
  bg: "var(--bg)", bgCard: "var(--bgCard)", bgDeep: "var(--bgDeep)",
  border: "var(--border)", text: "var(--text)", textMid: "var(--textMid)", textDim: "var(--textDim)",
  accent: "#7F77DD",
};

const categories = [
  { id: "all",       label: "All" },
  { id: "programs",  label: "Programs" },
  { id: "recruiting",label: "Recruiting" },
  { id: "offers",    label: "Offers & Money" },
  { id: "school",    label: "School Stuff" },
];

const glossary = [
  {
    term: "Internship",
    category: "programs",
    emoji: "💼",
    simple: "A short-term job — usually over the summer — where you try out a career.",
    real: "Typically 10–12 weeks, paid (sometimes very well), and the whole point is to see if you like the work — and for them to see if they like you. Most big companies use internships as a pipeline to hire full-time employees. Do well? You might get a job offer before you even graduate.",
    tip: "Apply WAY earlier than you think. Most summer internships open in September of the prior year. Yes, really.",
  },
  {
    term: "Co-op",
    category: "programs",
    emoji: "🔄",
    simple: "Like an internship but longer — usually 6 months — and you alternate with school semesters.",
    real: "Co-ops are common in engineering, business, and healthcare. There are two cycles: spring (Jan–June) and fall (July–Dec). You only do one at a time, and some schools actually require it to graduate. You work full-time hours for a full semester, which means you get real experience, not just coffee runs. The pay is usually really good too.",
    tip: "If your school has a co-op program, use it. Employers love it because they get to actually train you.",
  },
  {
    term: "Fellowship",
    category: "programs",
    emoji: "🏆",
    simple: "A selective, funded program — often for research, public service, or leadership.",
    real: "Fellowships are usually more prestigious than internships and sometimes more competitive than getting into college. They come in all sizes — some pay you a stipend, some fly you somewhere, some come with a scholarship. Common ones: Fulbright, Gates Millennium, Posse, Knight-Hennessy. They often target specific identities, interests, or career paths.",
    tip: "A lot of fellowships have deadlines in October–December of your junior year. Start researching sophomore year.",
  },
  {
    term: "Rotational Program",
    category: "programs",
    emoji: "🌀",
    simple: "A 2-year full-time job where you rotate through different teams before settling into one.",
    real: "Usually for new grads. You join a company and spend 6 months in one department, then switch to another, and maybe another. By the end you've seen 3–4 different functions and can choose what you want to do. Finance, consulting, and tech companies love these. They're competitive to get into but a great way to figure out what you actually want.",
    tip: "These programs recruit just like full-time jobs — apply during your senior year, not after graduation.",
  },
  {
    term: "Early Recruiting",
    category: "recruiting",
    emoji: "📅",
    simple: "When companies start hiring interns or new grads way earlier than you'd expect.",
    real: "Finance and consulting are notorious for this. If you want to intern at Goldman Sachs or McKinsey the summer after your junior year, you need to apply in September of your junior year — a full 9 months before the internship even starts. This catches so many people off guard. Tech recruiting is a little later (November–February) but still earlier than most students realize.",
    tip: "Set calendar reminders for September and October of every fall. That's prime recruiting season.",
  },
  {
    term: "On-Campus Recruiting (OCR)",
    category: "recruiting",
    emoji: "🏫",
    simple: "When companies come to your school specifically to hire students.",
    real: "Big companies partner with universities and host info sessions, career fairs, and interviews right on campus. If your school has a strong recruiting presence, take advantage — some companies only hire from a small list of 'target schools.' If your school isn't a target school, you can still apply directly online, it just takes more initiative.",
    tip: "Go to the info sessions even if you're not sure you want the job. Free food + networking + you might change your mind.",
  },
  {
    term: "Networking",
    category: "recruiting",
    emoji: "🌐",
    simple: "Building real relationships with people in careers you're interested in.",
    real: "Networking gets a bad rap because people think it means being fake. But at its best it's just talking to people who do interesting things and learning from them. A lot of jobs and opportunities are never posted publicly — they're filled through people who knew someone. LinkedIn, alumni networks, and career fairs are all places to start. The goal isn't to ask for a job immediately, it's to build a relationship first.",
    tip: "The best message isn't 'can you get me a job.' It's 'I'm curious about your path — would you have 20 minutes to chat?'",
  },
  {
    term: "Informational Interview",
    category: "recruiting",
    emoji: "☕",
    simple: "A casual conversation with someone in a career you're curious about — not a real interview.",
    real: "You reach out, ask to chat for 20 minutes, and ask them about their job, their path, what they wish they knew. It's low stakes because you're not asking for a job. But it builds relationships, gives you inside info, and sometimes turns into a referral. Most people are actually happy to help students — they just need to be asked.",
    tip: "Always send a thank you message after. And follow up in a few months with an update on where you landed.",
  },
  {
    term: "Referral",
    category: "recruiting",
    emoji: "📣",
    simple: "When someone who works at a company recommends you for a job there.",
    real: "A referral can move your resume from the bottom of a pile to the top of a list. Some companies fill up to 50% of roles through referrals. If you know anyone — a family friend, a classmate, a professor — who works somewhere you want to apply, it is totally okay to ask if they'd be willing to refer you. Most internal referral programs even pay employees a bonus if you get hired.",
    tip: "Ask nicely and give them everything they need — your resume, the specific role link, a few sentences about why you want it.",
  },
  {
    term: "ATS (Applicant Tracking System)",
    category: "recruiting",
    emoji: "🤖",
    simple: "The software companies use to sort through hundreds of resumes before a human even sees them.",
    real: "When you apply to a big company online, your resume usually goes through an ATS first. It scans for keywords, formatting, and qualifications. If your resume doesn't match what the system is looking for, a human might never see it. This is why tailoring your resume to each job description actually matters — you're optimizing for the robot before you can impress the human.",
    tip: "Use simple formatting. No tables, no columns, no fancy graphics. ATS systems hate them.",
  },
  {
    term: "Return Offer",
    category: "offers",
    emoji: "🤝",
    simple: "When a company offers you a full-time job after your internship before you graduate.",
    real: "If you intern somewhere and crush it, they might offer you a job on the spot — sometimes in the last week of your internship. This is called a return offer and it's kind of the holy grail of internships. You can accept, decline, or use it as leverage. Some people use their return offer to negotiate better salaries elsewhere.",
    tip: "Don't feel pressured to accept right away. You usually have a few weeks or months to decide.",
  },
  {
    term: "Exploding Offer",
    category: "offers",
    emoji: "💣",
    simple: "A job offer with a really short deadline designed to pressure you into accepting fast.",
    real: "Some companies give you 24–72 hours to accept an offer. This is called an exploding offer and it's a red flag. Legitimate employers give you at least 2 weeks. If a company is rushing you, ask for an extension. Most will give it to you. If they won't, that tells you something about how they treat employees.",
    tip: "Always ask for more time. The worst they can say is no.",
  },
  {
    term: "Stipend",
    category: "offers",
    emoji: "💵",
    simple: "A fixed payment you get for a program — not quite a salary, but still money.",
    real: "Fellowships, research programs, and some nonprofits pay stipends instead of hourly wages. It might be $500/month, or $5,000 for the whole summer. It's usually less than a traditional internship salary but the experience or prestige can make it worth it. Always ask what the stipend is before committing — some programs bury this info.",
    tip: "If a stipend is low, check if housing or travel is covered. That can make a huge difference.",
  },
  {
    term: "Credit vs. Paid Internship",
    category: "offers",
    emoji: "⚖️",
    simple: "Some internships pay you money. Some offer 'academic credit' instead.",
    real: "Some internships pay you hourly or a salary. Others offer 'academic credit' instead — which means you work for free and sometimes even pay tuition for the privilege. Both are common, especially in creative and nonprofit fields. Neither is inherently wrong, but you should always know which one you're signing up for before you commit.",
    tip: "Always ask upfront. 'Is this position paid or for academic credit?' is a completely normal question and any good employer will answer it without hesitation.",
  },
  {
    term: "Gap Year",
    category: "school",
    emoji: "✈️",
    simple: "Taking a year off between high school and college — or college and a job — to do something intentional.",
    real: "Gap years get a bad reputation but they can be incredibly valuable when used well. Think: AmeriCorps, traveling, building something, working, volunteering. Some companies and graduate schools actually look favorably on gap years. The key is doing something — not just taking time off to figure it out.",
    tip: "If you're considering one, tell people what you're doing with it. 'I'm taking a gap year to do X' lands very differently than 'I'm just taking a year off.'",
  },
  {
    term: "Greek Life & Clubs",
    category: "school",
    emoji: "🏛️",
    simple: "Extracurriculars matter more than most people realize — especially for recruiting.",
    real: "Certain clubs are basically pipelines to certain industries. Business fraternities feed into finance. Consulting clubs hold case competitions that recruiters actually attend. Pre-med societies have shadowing programs. You don't have to join everything — but being active in 1–2 things that connect to your interests gives you experience, community, and connections.",
    tip: "Leadership in a club (even a small one) looks better on a resume than being a passive member of a big one.",
  },
  {
    term: "GPA Cutoffs",
    category: "school",
    emoji: "📊",
    simple: "Some companies won't even look at your application if your GPA is below a certain number.",
    real: "Finance and consulting companies are notorious for 3.5+ GPA cutoffs. Some tech companies have them too. This doesn't mean your GPA is your whole story — but it matters more than people want to admit, especially for early recruiting. If your GPA isn't where you want it, focus on building experience and networks that can get you a referral past the filter.",
    tip: "Never put a GPA below 3.0 on your resume. Only include it if it helps you.",
  },
];

export default function SparqGuide() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedTerm, setExpandedTerm] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = glossary.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      search === "" ||
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.simple.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 10, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
          The Big Sister Guide
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>The Guide</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.5 }}>
          Things nobody told you about — internships, recruiting, money, and more.
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={T.textDim} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search anything..."
          style={{
            width: "100%", padding: "10px 36px 10px 36px",
            background: T.bgCard, border: `1px solid ${T.border}`,
            borderRadius: 12, color: T.text, fontSize: 13,
            fontFamily: "inherit", outline: "none", boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = T.accent; }}
          onBlur={e => { e.target.style.borderColor = T.border; }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: T.textDim, fontSize: 16, lineHeight: 1, padding: "2px 4px",
            }}
          >×</button>
        )}
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: `1px solid ${activeCategory === cat.id ? T.accent : T.border}`,
              background: activeCategory === cat.id ? `${T.accent}22` : "transparent",
              color: activeCategory === cat.id ? T.accent : T.textMid,
              cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >{cat.label}</button>
        ))}
      </div>

      {/* Count */}
      <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14 }}>
        {filtered.length} term{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◎</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>Nothing found</div>
          <div style={{ fontSize: 13, color: T.textMid }}>Try a different search term.</div>
        </div>
      )}

      {/* Glossary cards */}
      {filtered.map(item => {
        const isOpen = expandedTerm === item.term;
        return (
          <div
            key={item.term}
            onClick={() => setExpandedTerm(isOpen ? null : item.term)}
            style={{
              background: T.bgCard,
              border: `1px solid ${isOpen ? T.accent : T.border}`,
              borderRadius: 16,
              padding: "14px",
              marginBottom: 10,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = T.accent + "88"; }}
            onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = T.border; }}
          >
            {/* Collapsed row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 4, lineHeight: 1.35 }}>
                  {item.term}
                </div>
                <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>
                  {item.simple}
                </div>
              </div>
              <span style={{
                color: T.textDim, fontSize: 12, flexShrink: 0, marginTop: 3,
                display: "inline-block",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}>▾</span>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7, margin: "0 0 10px" }}>
                  {item.real}
                </p>
                <div style={{
                  background: `${T.accent}14`,
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontSize: 11,
                  color: T.accent,
                  lineHeight: 1.55,
                }}>
                  <span style={{ fontWeight: 700, marginRight: 5 }}>Big sis tip →</span>
                  {item.tip}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
