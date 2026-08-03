import { useState } from "react";

const T = {
  bg: "var(--bg)", bgCard: "var(--bgCard)", bgDeep: "var(--bgDeep)",
  border: "var(--border)", text: "var(--text)", textMid: "var(--textMid)", textDim: "var(--textDim)",
  accent: "#7F77DD",
};

export const WORLD_COLORS = {
  "Business & Finance":        "#BA7517",
  "Tech & Engineering":        "#7F77DD",
  "Law & Government":          "#378ADD",
  "Healthcare & Medicine":     "#1D9E75",
  "Media & Journalism":        "#C4508E",
  "Design & Creative":         "#D4537E",
  "Science & Research":        "#8B5CF6",
  "Entrepreneurship":          "#F59E0B",
  "Social Impact & Nonprofit": "#10B981",
  "Education & Coaching":      "#639922",
};

function worldColor(w) { return WORLD_COLORS[w] || T.accent; }

const URGENCY_LABELS = {
  5: "Plan 12–18 months ahead",
  4: "Plan 9–12 months ahead",
  3: "Plan 6–9 months ahead",
  2: "Plan 3–6 months ahead",
  1: "Plan 1–3 months ahead",
};

export const collegeData = [
  { n: "Finance / Investment Banking", world: "Business & Finance", timing: "Rolling", urgency: 5,
    one: "The earliest of everyone — banks open & close a year+ ahead",
    when: "Bulge brackets (Goldman, JPMorgan, Morgan Stanley, Citi) opened & closed Summer 2027 apps Dec 2025–Jan 2026. Elite boutiques even earlier. Big 4 advisory & asset managers reopen Aug–fall 2026.",
    who: "Sophomores aiming for junior-summer internships; freshmen/sophomores for early-insight & diversity programs.",
    tip: "Finance recruiting runs on a rolling basis, often a year or more before the internship starts. The posted deadline is usually later than when spots actually fill.",
    url: "https://www.adventiscg.com/class-of-2028-recruiting-timeline" },
  { n: "Big Tech / Software", world: "Tech & Engineering", timing: "Rolling", urgency: 4,
    one: "Rolling, no fixed deadlines — earlier applications are seen first",
    when: "Amazon posts first (~Jul 2026), Microsoft mid-Aug, then Meta/Google/Apple Sep–Oct. Google's SWE listing sometimes opens only 2–4 weeks.",
    who: "CS/eng + adjacent (math, stats, physics). Underclassmen: Google STEP, Microsoft Explore, Amazon Propel.",
    tip: "Most tech roles are reviewed on a rolling basis, so earlier applications are seen first. There are often no fixed deadlines.",
    url: "https://github.com/sndsh404/summer-2027-internships" },
  { n: "Consulting", world: "Business & Finance", timing: "Winter", urgency: 4,
    one: "MBB opens winter; early-ID programs are the side door",
    when: "MBB opens ~Jan 2026, Round 1 deadlines late March; Bain has a 2nd window into Aug. Boutiques/economic consulting Sep–Nov. Big 4 consulting Aug–Sep.",
    who: "Juniors for main programs; sophomores for diversity/early-ID (some get cut year to year — check).",
    tip: "Many firms run diversity and early-identification programs that feed directly into interview pipelines, sometimes a year ahead of main recruiting.",
    url: "https://managementconsulted.com/consulting-internships/" },
  { n: "Big 4 / Accounting & Advisory", world: "Business & Finance", timing: "Rolling", urgency: 3,
    one: "Forgiving timeline, broad majors, your finance backup",
    when: "Aug–Sep 2026, rolling, some open into January.",
    who: "Sophomores/juniors wanting finance-adjacent experience without banking's early recruiting timeline.",
    tip: "Big 4 advisory tends to have higher acceptance rates than bulge-bracket banking and accepts a broader range of majors.",
    url: "https://www.deloitte.com/us/en/careers/students-early-careers.html" },
  { n: "Engineering", world: "Tech & Engineering", timing: "Fall", urgency: 3,
    one: "Career fairs Sep–Oct are the main door",
    when: "Aerospace/defense (SpaceX, Boeing, Lockheed, Northrop) Aug–Oct. Broad peak Sep–Oct via career fairs. Mech/EE/chem/biomed heavy through fall.",
    who: "Engineering majors, all years.",
    tip: "University career fairs in September and October are a primary recruiting channel for many engineering employers.",
    url: "https://github.com/sndsh404/summer-2027-internships" },
  { n: "Government / Federal", world: "Law & Government", timing: "Fall–Winter", urgency: 3,
    one: "Clearance roles = apply 9–12 mo ahead",
    when: "Federal programs (Pathways, NIH, CDC) Oct–Jan. Clearance roles (CIA/FBI/NSA) need 9–12 mo lead for background checks. State/local Jan–Mar.",
    who: "Any major; usually US citizenship required.",
    tip: "Roles requiring a security clearance can take 9–12 months to process due to background checks. USAJobs is the central federal application portal.",
    url: "https://www.usajobs.gov/" },
  { n: "Marketing / Advertising / PR", world: "Media & Journalism", timing: "Fall–Spring", urgency: 2,
    one: "Major doesn't matter — portfolio does",
    when: "CPG (P&G, Unilever, Nike, Coca-Cola) Aug–Sep; tech marketing Sep–Oct; agencies Nov–Mar.",
    who: "Any major — English, comms, psych all welcome.",
    tip: "Marketing roles typically weigh portfolio and demonstrated interest more heavily than a specific major.",
    url: "https://www.extern.com/post/marketing-internships-summer-2027-guide" },
  { n: "Healthcare / Pharma / Public Health", world: "Healthcare & Medicine", timing: "Rolling", urgency: 2,
    one: "Wide range Nov–May; research locks in early",
    when: "Corporate pharma (J&J etc.) Aug–Nov rolling. Research positions lock in early — get into a lab and you often keep the spot.",
    who: "Pre-med, bio, chem, nursing, public health.",
    tip: "Research positions are often secured by contacting professors directly rather than through formal postings.",
    url: "https://www.careers.jnj.com/en/early-career-programs/internships/" },
  { n: "Media / Journalism / Entertainment", world: "Media & Journalism", timing: "Year-round", urgency: 2,
    one: "Rarely standardized — network and watch postings",
    when: "Rarely standardized; many filled as-needed year-round.",
    who: "Comms, journalism, film, writing.",
    tip: "Media roles are frequently filled as-needed throughout the year rather than on a fixed cycle.",
    url: "https://simplify.jobs/" },
  { n: "Law / Legal (pre-JD)", world: "Law & Government", timing: "Year-round", urgency: 2,
    one: "Paralegal/assistant roles post year-round",
    when: "No standard timeline for non-JD roles. Paralegal/legal-assistant roles post year-round; private sector & federal tend winter/spring.",
    who: "Pre-law, any major.",
    tip: "Non-JD legal roles like paralegal and legal assistant positions are typically posted year-round, with more activity in winter and spring.",
    url: "https://www.usajobs.gov/" },
  { n: "Data / Analytics", world: "Tech & Engineering", timing: "Varies by industry", urgency: 3,
    one: "Follows the parent industry's clock",
    when: "At tech companies, opens with SWE (Jul–Oct). At banks/consulting/healthcare, follows that parent industry's clock.",
    who: "Stats, CS, econ, data-oriented majors.",
    tip: "Data role timelines usually follow the parent industry — tech-company data roles open with software roles, while bank or healthcare data roles follow those sectors.",
    url: "https://github.com/sndsh404/summer-2027-internships" },
  { n: "Design / UX / Creative", world: "Design & Creative", timing: "Fall", urgency: 2,
    one: "Portfolio-first; tech-adjacent timelines",
    when: "Tech-adjacent roles follow tech timelines (Jul–Oct); agencies later.",
    who: "Design, HCI, art, comms.",
    tip: "Design hiring is typically portfolio-driven, and tech-adjacent design roles tend to follow technology recruiting timelines.",
    url: "https://simplify.jobs/" },
  { n: "Sustainability / Energy / Environment", world: "Science & Research", timing: "Fall", urgency: 2,
    one: "Posts in waves; lots of spring roles",
    when: "Posts in waves Sep–Nov, plus spring one-offs.",
    who: "Environmental science, policy, engineering.",
    tip: "Roles in this sector are often posted in waves through the fall, with additional openings in spring.",
    url: "https://www.usajobs.gov/" },
  { n: "Startups / Entrepreneurship", world: "Entrepreneurship", timing: "Rolling", urgency: 1,
    one: "Just-in-time hiring; spring is prime",
    when: "Rolling, heaviest Dec–Mar.",
    who: "Anyone, especially folks who missed early waves.",
    tip: "Startups commonly hire just-in-time and recruit later in the cycle, with the heaviest activity from December through March.",
    url: "https://wellfound.com/" },
  { n: "Nonprofits / Social Impact", world: "Social Impact & Nonprofit", timing: "Rolling", urgency: 1,
    one: "Funding-driven; service years have hard deadlines",
    when: "Funding-driven, spring-heavy & rolling. Service years (Teach for America, AmeriCorps, Peace Corps) have hard, early, once-a-year deadlines.",
    who: "Any major, mission-driven.",
    tip: "Nonprofit hiring is largely funding-driven and rolling, but structured service-year programs (Teach for America, AmeriCorps, Peace Corps) have firm, once-a-year deadlines.",
    url: "https://www.idealist.org/" },
  { n: "Co-op Programs", world: "Tech & Engineering", timing: "Two cycles a year", urgency: 3,
    one: "Two cycles a year; apply a semester ahead",
    when: "Two cycles, spring (Jan–Jun) and fall (Jul–Dec); apply a semester ahead.",
    who: "Schools with formal co-op programs (eng, business, healthcare). Some require one to graduate.",
    tip: "Co-ops run in two cycles per year and applications typically open a semester ahead. Availability depends on your school's co-op office.",
    url: "" },
];

export const highSchoolData = [
  { n: "Elite STEM Research (RSI, SSP, Simons)", world: "Science & Research", timing: "Fall–Winter", urgency: 5,
    one: "Crown jewels — tiny acceptance, fall-of-junior-year apps",
    when: "Open fall, close Dec–Feb. RSI (~2.5% accept) closes early–mid Dec, for rising seniors applying junior fall. SSP/Simons cluster Jan–Feb.",
    who: "Rising juniors/seniors strong in math & science. Most free, housing covered.",
    tip: "These programs are highly competitive and most are free, covering housing and materials. Many students also build research experience through local labs.",
    url: "https://www.cee.org/programs/apply-rsi" },
  { n: "University Pre-College Research", world: "Science & Research", timing: "Winter", urgency: 4,
    one: "Read eligibility fine print — age & location cutoffs",
    when: "Winter open (Dec–Jan), close ~Feb–Mar. NIH HS program opens mid-Nov, closes mid-Feb.",
    who: "Rising juniors/seniors, often 16+; some require living near campus.",
    tip: "Eligibility often includes age minimums, location requirements, and citizenship restrictions that vary by program.",
    url: "https://www.training.nih.gov/research-training/pb/sip/" },
  { n: "Corporate HS Programs", world: "Business & Finance", timing: "Fall–Winter", urgency: 4,
    one: "The hidden gems — paid/prestigious, colleges notice",
    when: "Fall–Jan deadlines. Bank of America Student Leaders ~mid-Jan; Goldman & Big 4 explorations same window.",
    who: "HS juniors curious about business/finance/consulting/tech.",
    tip: "Some corporate high school programs, like Bank of America Student Leaders, combine a paid internship with a leadership summit and are recognized by colleges.",
    url: "https://www.bankofamerica.com/en/about-us/student-leaders.html" },
  { n: "Government / National Labs", world: "Science & Research", timing: "Fall–Winter", urgency: 3,
    one: "Dedicated HS slots almost nobody applies to",
    when: "Fall open, close winter (Jan–Feb). NASA runs one of the largest HS programs in the country.",
    who: "STEM-interested HS, many 16+; citizenship/proximity often required.",
    tip: "National labs and agencies like NASA run dedicated high school programs, many open to students 16 and older, often with citizenship or proximity requirements.",
    url: "https://stemgateway.nasa.gov/" },
  { n: "Summer Enrichment / Pre-College", world: "Education & Coaching", timing: "Winter–Spring", urgency: 2,
    one: "Watch cost — free & selective beats pay-to-play",
    when: "Widest range — winter open, some accept into April.",
    who: "Any HS student exploring a subject or college life.",
    tip: "These range widely in cost. Selective, free programs are generally regarded more highly than tuition-based ones.",
    url: "" },
  { n: "Competitions / Olympiads", world: "Science & Research", timing: "School year", urgency: 2,
    one: "Involvement + leadership matters more than winning",
    when: "School-year cycle — register fall, regionals/state winter, nationals spring/summer.",
    who: "Any HS student; team events (DECA, Science Olympiad) great for everyone.",
    tip: "These follow the school-year calendar, with registration in fall, regional and state rounds in winter, and national events in spring or summer.",
    url: "https://www.soinc.org/" },
  { n: "Scholarships", world: "Education & Coaching", timing: "Fall–Spring", urgency: 2,
    one: "Many large scholarships close in winter or spring",
    when: "Many open fall, close winter/spring of senior year; others year-round.",
    who: "Mostly juniors/seniors, some underclassmen.",
    tip: "Many large scholarships open in fall and close in winter or spring of senior year, though some accept applications year-round.",
    url: "" },
];

export default function WhenToApply({ starredItems, onToggleStar, onReplayTour }) {
  const [mode, setMode] = useState("college");
  const [expanded, setExpanded] = useState(null);
  const [activeWorld, setActiveWorld] = useState(null);

  const data = mode === "college" ? collegeData : highSchoolData;
  const worlds = [...new Set(data.map(d => d.world))].sort();

  const filtered = activeWorld ? data.filter(d => d.world === activeWorld) : data;

  const sorted = [...filtered].sort((a, b) => a.n.localeCompare(b.n));

  return (
    <div className="sparq-screen" style={{ padding: "72px 1.25rem 90px", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 22 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>When to Apply</div>
          <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55 }}>
            Most internships are the END of a 12–18 month process, not a spring scramble. Here's when each industry actually moves — and how far ahead you need to be.
          </div>
        </div>
        <button
          onClick={onReplayTour}
          title="Replay the quick tour"
          aria-label="Replay the quick tour"
          style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMid,
            fontSize: 14, fontWeight: 700, cursor: "pointer", lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >?</button>
      </div>

      {/* Mode toggle */}
      <div data-tour="wta-mode" style={{ display: "inline-flex", gap: 0, marginBottom: 18, background: T.bgDeep, borderRadius: 12, padding: 3 }}>
        {[["college", "College"], ["highschool", "High School"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setMode(val); setActiveWorld(null); setExpanded(null); }}
            style={{
              padding: "7px 20px", borderRadius: 9, fontSize: 13, fontWeight: 700,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: mode === val ? T.bgCard : "transparent",
              color: mode === val ? T.text : T.textMid,
              boxShadow: mode === val ? "0 1px 4px #00000040" : "none",
              fontFamily: "inherit",
            }}
          >{label}</button>
        ))}
      </div>

      {/* Disclaimer banner */}
      <div style={{
        background: T.bgDeep, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "10px 14px", marginBottom: 18,
        fontSize: 11, color: T.textMid, lineHeight: 1.6,
      }}>
        <strong style={{ color: T.text }}>Heads up</strong> — these dates shift every year and every company runs its own process. Use this as a general guide, not a fixed calendar, and always confirm with the actual program or company page.
      </div>

      {/* World filter chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        <button
          onClick={() => setActiveWorld(null)}
          style={{
            padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            border: `1px solid ${!activeWorld ? T.accent : T.border}`,
            background: !activeWorld ? `${T.accent}22` : "transparent",
            color: !activeWorld ? T.accent : T.textMid,
            cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
          }}
        >All</button>
        {worlds.map(w => {
          const col = worldColor(w);
          const active = activeWorld === w;
          return (
            <button
              key={w}
              onClick={() => setActiveWorld(active ? null : w)}
              style={{
                padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: `1px solid ${active ? col : T.border}`,
                background: active ? `${col}22` : "transparent",
                color: active ? col : T.textMid,
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >{w}</button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ fontSize: 11, color: T.textDim, marginBottom: 14 }}>
        {sorted.length} industr{sorted.length !== 1 ? "ies" : "y"}
      </div>

      {/* Cards */}
      {sorted.map((item, idx) => {
        const isOpen = expanded === item.n;
        const wc = worldColor(item.world);
        const isStarred = starredItems.has(item.n);

        return (
          <div
            key={item.n}
            onClick={() => setExpanded(isOpen ? null : item.n)}
            style={{
              background: T.bgCard,
              border: `1px solid ${isOpen ? T.accent : T.border}`,
              borderRadius: 16,
              padding: "14px",
              marginBottom: 10,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => { if (!isOpen) e.currentTarget.style.borderColor = `${T.accent}88`; }}
            onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = T.border; }}
          >
            {/* Collapsed row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              {/* Left: pills + name + summary */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: T.textMid, background: T.bgDeep,
                    border: `1px solid ${T.border}`,
                    borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap",
                  }}>{item.timing}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: wc, background: `${wc}18`,
                    border: `1px solid ${wc}40`,
                    borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap",
                  }}>{item.world}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3, lineHeight: 1.3 }}>{item.n}</div>
                <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.45 }}>{item.one}</div>
              </div>

              {/* Right: urgency dots + star + chevron */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, paddingTop: 2 }}>
                <div data-tour={idx === 0 ? "wta-urgency" : undefined} style={{ display: "flex", gap: 3 }} title={URGENCY_LABELS[item.urgency]}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: i <= item.urgency ? T.accent : T.border,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    data-tour={idx === 0 ? "wta-star" : undefined}
                    onClick={e => { e.stopPropagation(); onToggleStar(item); }}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 15, lineHeight: 1, padding: 0,
                      color: isStarred ? "#F59E0B" : T.textDim,
                    }}
                  >{isStarred ? "★" : "☆"}</button>
                  <span style={{
                    color: T.textDim, fontSize: 12,
                    display: "inline-block",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>▾</span>
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 10, letterSpacing: "0.04em" }}>
                  {URGENCY_LABELS[item.urgency]}
                </div>

                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>When: </span>
                  <span style={{ fontSize: 11, color: T.textMid, lineHeight: 1.6 }}>{item.when}</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>Who: </span>
                  <span style={{ fontSize: 11, color: T.textMid, lineHeight: 1.6 }}>{item.who}</span>
                </div>

                <div style={{
                  background: `${T.accent}14`,
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 10, padding: "10px 12px",
                  fontSize: 11, color: T.accent, lineHeight: 1.55,
                  marginBottom: item.url ? 12 : 0,
                }}>
                  <span style={{ fontWeight: 700, marginRight: 5 }}>Good to know</span>
                  {item.tip}
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: "inline-block",
                      padding: "7px 16px",
                      background: T.bgDeep,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      fontSize: 12, fontWeight: 600,
                      color: T.textMid,
                      textDecoration: "none",
                      transition: "border-color 0.15s, color 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}
                  >Apply / Learn more ↗</a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
