import { useState } from "react";

const STAGE_COLORS = ["#F472B6", "#C084FC", "#818CF8", "#38BDF8"];
const STAGE_VIBES = ["Just getting started", "Finding your stride", "In your prime", "Top of the mountain"];
const STAGE_EMOJIS = ["🌱", "🔥", "⚡", "👑"];

function SalaryChart({ growth }) {
  const maxSalary = 250;
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60, marginBottom: 14 }}>
      {growth.map((step, i) => {
        const num = parseInt(step.salary.replace(/[^0-9]/g, "")) || 100;
        const pct = Math.min((num / maxSalary) * 100, 100);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: "100%", borderRadius: "3px 3px 0 0",
              height: `${Math.max(pct, 8)}%`,
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
  const vibe = STAGE_VIBES[index] || "The journey continues";
  const emoji = STAGE_EMOJIS[index] || "⭐";
  const descriptions = [
    "Writing code under supervision, learning the codebase, running your first experiments. Overwhelming at first — by month 6 you'll have shipped something real.",
    "Owning features end to end. You've probably switched companies once for a salary jump. You understand the full lifecycle and mentor junior engineers now.",
    "Leading projects and setting technical direction. Your opinion shapes product decisions. Companies are recruiting you — not the other way around.",
    "Shaping strategy at the highest level. Some people at this stage found startups. Your expertise is genuinely rare and in global demand.",
  ];
  const desc = descriptions[index] || "";

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

export default function CareerTimeline({ career, industryColor, onBack }) {
  const title = career.title || career.t || "Career";
  const desc = career.desc || career.d || "";
  const salary = career.salary || career.s || "";
  const school = career.school || career.sc || "";
  const day = career.day || "";
  const growth = career.growth || [];

  const anim = (delay) => ({
    opacity: 0,
    animation: "fadeSlideUp 0.5s ease forwards",
    animationDelay: `${delay}ms`,
  });

  return (
    <div style={{ padding: "1.5rem 1.25rem", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} style={{
        background: "none", border: "none", color: "#4A4D66",
        fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16,
      }}>← Back</button>

      {/* Header */}
      <div style={{ marginBottom: 6, ...anim(0) }}>
        <div style={{ fontSize: 10, color: "#F472B6", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>
          Career Roadmap
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#F9FAFB", marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#8B8FA8", lineHeight: 1.6, marginBottom: 14 }}>{desc}</div>
      </div>

      {/* Salary range pill */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", ...anim(0) }}>
        <span style={{
          background: "#F472B618", border: "1px solid #F472B640",
          borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: "#F472B6",
        }}>{salary}</span>
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
          <div style={{ fontSize: 13, color: "#E0E8FF" }}>{school || "Varies by role and company"}</div>
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

      {/* Salary chart */}
      {growth.length > 0 && (
        <div style={anim(300)}>
          <div style={{ fontSize: 10, color: "#4A4D66", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 8 }}>
            Salary progression
          </div>
          <SalaryChart growth={growth} />
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: "#2E3148", marginBottom: 14 }} />

      {/* Timeline stages */}
      <div style={{ fontSize: 10, color: "#4A4D66", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 10 }}>
        Your journey
      </div>
      {growth.length > 0 ? (
        growth.map((step, i) => (
          <div key={i} style={anim(400 + i * 100)}>
            <Stage step={step} index={i} isLast={i === growth.length - 1} />
          </div>
        ))
      ) : (
        <div style={{ fontSize: 13, color: "#4A4D66", textAlign: "center", padding: "2rem 0" }}>
          Career path details coming soon
        </div>
      )}

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
