import { useState } from "react";

const STAGE_COLORS = ["#F472B6", "#C084FC", "#818CF8", "#38BDF8"];
const STAGE_VIBES  = ["Education & Training", "Entry Level", "Mid Career", "Senior Level"];
const STAGE_EMOJIS = ["🎓", "🌱", "🔥", "👑"];

// ─── Salary helpers ───────────────────────────────────────────────────────────

function parseSalaryRange(str) {
  const nums = (str || "").match(/\d+/g);
  if (!nums) return { lo: 80, hi: 120 };
  const lo = parseInt(nums[0]);
  const hi = nums.length > 1 ? parseInt(nums[1]) : lo + Math.round(lo * 0.4);
  return { lo, hi };
}

function fmtK(n) {
  return `$${Math.round(n / 5) * 5}k`;
}

// ─── Role name helpers ────────────────────────────────────────────────────────

function deriveEntryRole(title) {
  const stripped = title.replace(/^(Senior|Lead|Head of|Director of|VP of|Chief|Principal)\s+/i, "");
  return stripped !== title ? stripped : `Junior ${title}`;
}

function deriveSeniorRole(title) {
  if (/^(Senior|Lead|Head|Director|VP|Chief|Principal)/i.test(title)) return title;
  return `Senior ${title}`;
}

// ─── Education requirement generator ─────────────────────────────────────────

function generateEducation(career) {
  const t = (career.title || career.t || "").toLowerCase();
  const industry = (career.primary_industry || "").toLowerCase();

  // Title keyword → requirement (checked in order, first match wins)
  const rules = [
    // Healthcare — licensed/clinical
    [/physician|surgeon|doctor\b/,            "Medical degree (MD or DO), residency, board certification"],
    [/psychiatrist/,                           "Medical degree (MD or DO), psychiatry residency, board certification"],
    [/nurse practitioner|np\b/,               "Master of Science in Nursing (MSN), APRN licensure"],
    [/registered nurse|\bnurse\b/,            "Bachelor of Science in Nursing (BSN), NCLEX-RN licensure"],
    [/pharmacist/,                             "Doctor of Pharmacy (PharmD), state licensure"],
    [/physical therapist/,                    "Doctor of Physical Therapy (DPT), state licensure"],
    [/occupational therapist/,                "Master's in Occupational Therapy, NBCOT certification"],
    [/speech.language|speech therapist/,      "Master's in Speech-Language Pathology, ASHA CCC-SLP"],
    [/recreational therapist|recreation ther/,"Bachelor's in Recreational Therapy or Therapeutic Recreation, CTRS certification"],
    [/respiratory therapist/,                 "Associate's or Bachelor's in Respiratory Therapy, RRT credential"],
    [/radiation therapist/,                   "Bachelor's in Radiation Therapy, ARRT certification"],
    [/dental hygienist/,                       "Associate's in Dental Hygiene, RDH licensure"],
    [/dentist/,                                "Doctor of Dental Surgery (DDS or DMD), state licensure"],
    [/optometrist/,                            "Doctor of Optometry (OD), state licensure"],
    [/chiropractor/,                           "Doctor of Chiropractic (DC), state licensure"],
    [/veterinarian|\bvet\b/,                  "Doctor of Veterinary Medicine (DVM), state licensure"],
    [/dietitian|nutritionist/,                "Bachelor's in Nutrition or Dietetics, RDN credential"],
    [/health informatics/,                    "Bachelor's in Health Informatics, Health IT, or CS; RHIA or CPHIMS certification valued"],
    [/clinical.*(researcher|scientist)/,      "Bachelor's or PhD in Biology, CS, or related biomedical field"],
    [/bioethicist/,                            "Graduate degree in Bioethics, Philosophy, or Medicine (MD/JD/PhD)"],
    [/public health/,                          "Bachelor's or Master's in Public Health (MPH)"],
    [/epidemiologist/,                         "Master's or PhD in Epidemiology or Public Health"],
    [/medical/,                                "Relevant health science degree and role-specific licensure"],
    // Law
    [/lawyer|attorney|general counsel|legal counsel/, "Juris Doctor (JD), bar exam passage"],
    [/judge/,                                  "Juris Doctor (JD), extensive legal practice, judicial appointment"],
    [/paralegal/,                              "Associate's or Bachelor's in Paralegal Studies, NALA certification a plus"],
    [/human rights investigator/,             "Bachelor's in Law, International Relations, or Journalism; field experience valued"],
    [/privacy engineer/,                       "Bachelor's in CS; CIPP or CIPM privacy certification; legal background a plus"],
    [/compliance/,                             "Bachelor's in Business or Law; CCEP or CRCM certification"],
    [/tech policy|policy analyst/,            "Bachelor's in Political Science, Economics, or Law; policy research experience"],
    // Tech & Engineering
    [/machine learning|ml engineer|ai engineer/, "Bachelor's or Master's in CS, Mathematics, or AI/ML"],
    [/data scientist/,                         "Bachelor's or Master's in Statistics, CS, or Data Science"],
    [/software engineer|software developer/,  "Bachelor's in CS or Software Engineering; strong portfolio accepted"],
    [/devops|site reliability|sre\b/,         "Bachelor's in CS or IT; AWS/GCP/Azure certifications a plus"],
    [/cloud engineer/,                         "Bachelor's in CS or IT; AWS, Azure, or GCP certification"],
    [/cybersecurity|security engineer|infosec/, "Bachelor's in CS or IT; CISSP, CompTIA Security+, or CEH certification"],
    [/network engineer/,                       "Bachelor's in CS or IT; CCNA or CCNP certification"],
    [/database admin|dba\b/,                  "Bachelor's in CS or IT; Oracle, SQL Server, or AWS database certification"],
    [/ai ethics|ethics researcher/,           "Graduate degree in Philosophy, CS, Law, or Social Science"],
    [/creative technologist/,                 "Bachelor's in Design, CS, or Fine Arts; portfolio essential"],
    [/product manager|product owner/,         "Bachelor's in any field; CS or Business preferred; PM certification a plus"],
    [/ai.*product|product.*ai/,               "Bachelor's in CS or Business; experience with AI/ML products valued"],
    [/digital therapeutics/,                  "Bachelor's in CS, Health, or Business; regulatory and clinical experience a plus"],
    // Business & Finance
    [/venture capital|vc\b/,                  "Bachelor's in Finance, Business, or CS; MBA or startup experience valued"],
    [/investment bank/,                        "Bachelor's in Finance, Economics, or Math; CFA a plus"],
    [/financial analyst|impact invest/,       "Bachelor's in Finance or Economics; CFA designation a plus"],
    [/cfo|chief financial/,                   "Bachelor's in Finance or Accounting; CPA and/or MBA preferred"],
    [/ceo|chief executive/,                   "MBA or equivalent; extensive leadership and domain experience"],
    [/cto|chief technology/,                  "Bachelor's in CS or Engineering; deep technical leadership experience"],
    [/actuary/,                                "Bachelor's in Mathematics or Statistics; FSA or FCAS certification"],
    [/accountant|cpa\b/,                      "Bachelor's in Accounting, CPA licensure"],
    [/revenue manager/,                        "Bachelor's in Business, Finance, or Hospitality; revenue management certification a plus"],
    [/startup.*cfo|cfo.*startup/,             "Bachelor's in Finance or Accounting; CPA or MBA; startup finance experience"],
    [/consultant/,                             "Bachelor's or MBA in Business or relevant technical field"],
    [/operations manager/,                    "Bachelor's in Business or Operations Management; PMP a plus"],
    [/supply chain|logistics/,               "Bachelor's in Supply Chain or Business; APICS CSCP certification"],
    [/project manager/,                        "Bachelor's in relevant field; PMP certification strongly valued"],
    [/hr\b|human resources/,                 "Bachelor's in HR or Business; PHR or SHRM-CP certification"],
    // Design & Creative
    [/creative director/,                     "Bachelor's in Design, Fine Arts, or Communications; extensive portfolio"],
    [/brand strategist|brand manager/,        "Bachelor's in Marketing, Business, or Design"],
    [/experience designer/,                   "Bachelor's in Design, Architecture, or Theater; portfolio required"],
    [/music supervisor/,                       "Bachelor's in Music, Film, or Communications; industry network essential"],
    [/graphic designer/,                       "Bachelor's in Graphic Design or Fine Arts; strong portfolio required"],
    [/ux|ui designer|interaction design/,     "Bachelor's in Design or HCI; UX certification or bootcamp accepted; portfolio essential"],
    [/animator/,                               "Bachelor's in Animation or Digital Arts; strong reel required"],
    [/filmmaker|cinematographer/,             "Bachelor's in Film or equivalent production experience"],
    [/photographer/,                           "Formal degree optional; strong portfolio and technical skill essential"],
    [/fashion designer/,                       "Bachelor's in Fashion Design; portfolio required"],
    [/interior designer/,                      "Bachelor's in Interior Design; NCIDQ examination"],
    [/game designer/,                          "Bachelor's in Game Design, CS, or Digital Arts"],
    // Education & Coaching
    [/edtech/,                                 "Bachelor's in Education, CS, or Business; teaching or product experience"],
    [/learning experience|instructional design/, "Bachelor's in Education or Instructional Design; ID certification a plus"],
    [/education policy/,                       "Bachelor's or Master's in Education, Public Policy, or Economics"],
    [/ai curriculum|curriculum developer/,    "Bachelor's in Education; CS or AI background strongly valued"],
    [/professor|faculty/,                      "Master's or PhD in relevant field; PhD required for research universities"],
    [/teacher|educator/,                       "Bachelor's in Education or subject area; state teaching credential"],
    [/school principal/,                       "Master's in Education Leadership; administrative credential"],
    [/athletic director/,                      "Bachelor's in Sports Management or Physical Education; advanced degree preferred"],
    [/coach\b/,                                "Relevant ICF or industry coaching certification; Bachelor's in related field"],
    [/personal trainer/,                       "NASM, ACE, or NSCA personal training certification; no degree required"],
    // Sports & Fitness
    [/sports analytics/,                       "Bachelor's in Statistics, Mathematics, or Sports Science; SQL and Python skills"],
    [/athlete brand|sports.*brand/,           "Bachelor's in Marketing, Business, or Communications"],
    [/fan experience/,                         "Bachelor's in Business, Marketing, or Hospitality"],
    [/esports/,                                "Bachelor's in Business, Marketing, or Game Design; deep industry knowledge"],
    [/athletic trainer/,                       "Bachelor's in Athletic Training, BOC certification, state licensure"],
    [/kinesiolog/,                             "Bachelor's in Kinesiology or Exercise Science"],
    [/sports medicine/,                        "Medical degree (MD/DO) or DPT; sports medicine fellowship"],
    // Hospitality & Events
    [/hotel.*manager|general manager.*hotel/, "Bachelor's in Hospitality Management; extensive operational experience"],
    [/luxury travel|travel advisor/,          "No formal degree required; ASTA or CLIA certification valued; deep destination knowledge"],
    [/destination.*designer|experience.*design.*travel/, "Bachelor's in Hospitality, Architecture, or Cultural Studies"],
    [/travel tech/,                            "Bachelor's in CS or Business; hospitality domain knowledge"],
    [/event planner|event manager/,           "Bachelor's in Hospitality, Business, or Communications; CMP certification"],
    [/chef|culinary/,                          "Culinary arts degree or apprenticeship; ServSafe certification"],
    [/sommelier/,                              "Court of Master Sommeliers certification (CMS); no degree required"],
    // Other
    [/pilot/,                                  "FAA commercial pilot certificate, instrument rating, 1,500+ flight hours"],
    [/journalist|reporter/,                   "Bachelor's in Journalism or Communications; strong clips portfolio"],
    [/architect/,                              "Bachelor's or Master's in Architecture (B.Arch or M.Arch); ARE licensure"],
    [/urban planner/,                          "Master's in Urban Planning (MUP/MURP); AICP certification"],
    [/environmental/,                          "Bachelor's in Environmental Science, Engineering, or Policy"],
    [/social worker/,                          "Bachelor's (BSW) or Master's (MSW) in Social Work; LCSW licensure"],
    [/psychologist/,                           "Doctoral degree (PhD or PsyD) in Psychology; state licensure"],
    [/nonprofit|fundrais/,                    "Bachelor's in Nonprofit Management, Communications, or relevant field"],
    [/diplomat/,                               "Bachelor's in International Relations or Political Science; Foreign Service written exam"],
    [/librarian/,                              "Master's in Library Science (MLS or MLIS)"],
    [/curator/,                                "Bachelor's or Master's in Art History, Museum Studies, or relevant discipline"],
    [/real estate/,                            "State real estate license; Bachelor's in Business optional but valued"],
  ];

  for (const [pattern, requirement] of rules) {
    if (pattern.test(t)) return requirement;
  }

  // Industry-level fallbacks
  if (industry.includes("tech"))        return "Bachelor's in Computer Science, Engineering, or related field; strong portfolio or bootcamp accepted at many companies";
  if (industry.includes("health"))      return "Relevant health science degree; licensure or certification specific to the role required";
  if (industry.includes("law"))         return "Bachelor's in Political Science, Law, or related field; JD for practicing legal roles";
  if (industry.includes("business") || industry.includes("finance")) return "Bachelor's in Business, Finance, or Economics; relevant certification (CPA, CFA, MBA) valued";
  if (industry.includes("design") || industry.includes("creative")) return "Design or Fine Arts degree, or a portfolio strong enough to speak for itself";
  if (industry.includes("sport"))       return "Bachelor's in Sports Science, Kinesiology, or Business; role-specific certification often required";
  if (industry.includes("education"))   return "Bachelor's in Education or relevant subject area; teaching credential for school-based roles";
  if (industry.includes("hospitality")) return "Bachelor's in Hospitality Management or Business; industry certifications valued";

  return "Bachelor's degree in a relevant field; specific certifications vary by employer and specialisation";
}

// ─── Timeline generator ───────────────────────────────────────────────────────

function generateTimeline(career) {
  const title    = career.title || career.t || "Professional";
  const salary   = career.salary || career.s || "";
  const school   = career.school || career.sc || "";
  const industry = career.primary_industry || "";

  const { lo, hi } = parseSalaryRange(salary);
  const mid = Math.round((lo + hi) / 2);

  const eduReq  = school || generateEducation(career);
  const eduRole = school || (industry ? `${industry} Training` : "Education & Certification");

  return [
    {
      role:   eduRole,
      salary: fmtK(lo * 0.45),
      years:  "Training",
      desc:   `${eduReq}. Strong academic performance, internships, and portfolio work all contribute to your success.`,
    },
    {
      role:   deriveEntryRole(title),
      salary: fmtK(lo * 0.7),
      years:  "0–2 yrs",
      desc:   `You're learning by doing — figuring out how the industry actually works and building your first body of real output. Focus on absorbing feedback and shipping. The fundamentals you build now compound across your whole career.`,
    },
    {
      role:   title,
      salary: fmtK(mid),
      years:  "3–7 yrs",
      desc:   `You know what you're doing. You've likely moved employers once for a raise, you own significant projects end-to-end, and junior people look to you for direction. Your opinion is starting to shape real decisions.`,
    },
    {
      role:   deriveSeniorRole(title),
      salary: `${fmtK(hi * 1.3)}+`,
      years:  "8+ yrs",
      desc:   `You're the go-to person in the room. Strategy, leadership, and big-picture thinking are your territory. Some people at this stage launch their own ventures. Your depth of experience is genuinely rare and in demand.`,
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SalaryChart({ growth }) {
  const maxSalary = 250;
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60, marginBottom: 14 }}>
      {growth.map((step, i) => {
        const num = parseInt((step.salary || "").replace(/[^0-9]/g, "")) || 40;
        const pct = Math.min((num / maxSalary) * 100, 100);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: "100%", borderRadius: "3px 3px 0 0",
              height: `${Math.max(pct, 4)}%`,
              background: STAGE_COLORS[i],
              minHeight: 4,
            }} />
            <div style={{ fontSize: 9, color: "#8B8FA8", textAlign: "center" }}>{step.salary}</div>
            <div style={{ fontSize: 9, color: "#4A4D66", textAlign: "center" }}>{step.years}</div>
          </div>
        );
      })}
    </div>
  );
}

function Stage({ step, index, isLast }) {
  const color = STAGE_COLORS[index] || "#38BDF8";
  const vibe  = STAGE_VIBES[index]  || "The journey continues";
  const emoji = STAGE_EMOJIS[index] || "⭐";
  const desc  = step.desc || "";

  return (
    <div style={{
      borderRadius: 14,
      padding: "0.9rem",
      marginBottom: isLast ? 0 : 8,
      background: `${color}12`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}22`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <div style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color }}>{step.years}</div>
          <div style={{ fontSize: 14, lineHeight: 1 }}>{emoji}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color, marginBottom: 2 }}>{vibe}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#F9FAFB" }}>{step.role}</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color, textAlign: "right", flexShrink: 0 }}>{step.salary}</div>
      </div>
      {desc && (
        <div style={{ fontSize: 12, color: "#8B8FA8", lineHeight: 1.6, marginTop: 8, paddingLeft: 48 }}>
          {desc}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CareerTimeline({ career, industryColor, onBack }) {
  const title    = career.title || career.t || "Career";
  const desc     = career.desc  || career.d || "";
  const salary   = career.salary || career.s || "";
  const school   = career.school || career.sc || "";
  const day      = career.day || "";
  const growth   = career.growth || [];

  const primaryIndustry       = career.primary_industry || "";
  const secondaryIndustries   = career.secondary_industries
    ? career.secondary_industries.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const allTags = [
    ...(primaryIndustry ? [{ label: primaryIndustry, isPrimary: true }] : []),
    ...secondaryIndustries.map(s => ({ label: s, isPrimary: false })),
  ];

  // Use real growth data if present, otherwise generate from career fields
  const stages = growth.length > 0 ? growth : generateTimeline(career);

  const anim = (delay) => ({
    opacity: 0,
    animation: "fadeSlideUp 0.5s ease forwards",
    animationDelay: `${delay}ms`,
  });

  return (
    <div className="career-timeline-wrapper" style={{ padding: "1.5rem 1.25rem", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} style={{
        background: "#272B40", border: "1px solid #3D3F55", borderRadius: 20,
        padding: "5px 14px", fontSize: 12, fontWeight: 600, color: "#8B8FA8",
        cursor: "pointer", marginBottom: 20,
      }}>← Back</button>

      {/* Header */}
      <div style={{ marginBottom: 6, ...anim(0) }}>
        <div style={{ fontSize: 10, color: "#F472B6", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Career Roadmap
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", marginBottom: 8 }}>{title}</div>
        {allTags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {allTags.map(({ label, isPrimary }) => (
              <span key={label} style={{
                background: isPrimary ? "#7F77DD22" : "#3D3F5588",
                border: `1px solid ${isPrimary ? "#7F77DD66" : "#3D3F55"}`,
                borderRadius: 20, padding: "3px 10px",
                fontSize: 11, fontWeight: isPrimary ? 700 : 500,
                color: isPrimary ? "#A89FEE" : "#8B8FA8",
                letterSpacing: "0.02em",
              }}>{label}</span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 13, color: "#8B8FA8", lineHeight: 1.6, marginBottom: 14 }}>{desc}</div>
      </div>

      {/* Salary range pill */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", ...anim(0) }}>
        {salary && (
          <span style={{
            background: "#F472B618", border: "1px solid #F472B640",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#F472B6",
          }}>{salary}</span>
        )}
        {school && (
          <span style={{
            background: "#818CF818", border: "1px solid #818CF840",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#818CF8",
          }}>🎓 {school}</span>
        )}
      </div>

      {/* Education bar */}
      <div style={{
        background: "#1A1D2E", border: "1px solid #3D3F55",
        borderRadius: 12, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
        ...anim(100),
      }}>
        <div style={{ fontSize: 20 }}>🎓</div>
        <div>
          <div style={{ fontSize: 10, color: "#4A4D66", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>What you need to get here</div>
          <div style={{ fontSize: 13, color: "#E0E8FF" }}>{school || generateEducation(career)}</div>
        </div>
      </div>

      {/* Day in the life */}
      {day && (
        <div style={{
          background: "#272B40", border: "1px solid #3D3F55",
          borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          ...anim(200),
        }}>
          <div style={{ fontSize: 10, color: "#4A4D66", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>A day in the life</div>
          <div style={{ fontSize: 13, color: "#8B8FA8", lineHeight: 1.6 }}>{day}</div>
        </div>
      )}

      {/* Salary chart — only when real growth data is present */}
      {growth.length > 0 && (
        <div style={anim(300)}>
          <div style={{ fontSize: 10, color: "#4A4D66", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 8 }}>
            Salary progression
          </div>
          <SalaryChart growth={growth} />
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "#2E3148", marginBottom: 14, ...anim(300) }} />

      {/* Timeline stages */}
      <div style={{ fontSize: 10, color: "#4A4D66", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 10, ...anim(300) }}>
        Your journey
      </div>
      {stages.map((step, i) => (
        <div key={i} style={anim(400 + i * 100)}>
          <Stage step={step} index={i} isLast={i === stages.length - 1} />
        </div>
      ))}

      {/* Bottom CTA */}
      <div style={{ marginTop: 20, background: "#272B40", border: "1px solid #3D3F55", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#8B8FA8", marginBottom: 10, lineHeight: 1.5 }}>
          Curious what this could look like for you specifically?
        </div>
        <button
          onClick={() => {}}
          style={{
            width: "100%", padding: "0.8rem",
            background: "linear-gradient(135deg, #F472B6, #818CF8, #38BDF8)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          Explore more careers like this →
        </button>
      </div>

    </div>
  );
}
