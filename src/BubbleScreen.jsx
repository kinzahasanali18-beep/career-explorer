import { useState, useRef } from "react";
import SalaryNote from "./SalaryNote";

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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

export default function BubbleScreen({ selectedIndustries, onBack, onViewCareer, industries = [] }) {
  const [activeInd, setActiveInd] = useState(null);
  const [activeCareer, setActiveCareer] = useState(null);
  const canvasRef = useRef(null);

  const visibleInds = selectedIndustries && selectedIndustries.length > 0
    ? industries.filter(i => selectedIndustries.includes(i.id))
    : industries;

  function selectInd(ind) {
    if (activeInd?.id === ind.id) return;
    setActiveInd(ind);
    setActiveCareer(null);
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }, 400);
  }

  function selectCareer(career) {
    if (activeCareer?.title === career.title) return;
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

      <button onClick={onBack} style={{ background: "var(--bgCard)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: "var(--textMid)", cursor: "pointer", marginBottom: 20 }}>← Back</button>
      <div style={{ fontSize: 10, color: "#06B6D4", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Career Universe</div>
      <div style={{ fontSize: 12, color: "var(--textDim)", marginBottom: 14 }}>Tap an industry bubble to explore its careers</div>

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
              glow={ind.glow || hexToRgba(ind.color, 0.6)}
              shimmer={ind.shimmer || hexToRgba(ind.color, 0.35)}
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
                  key={career.title}
                  size={70}
                  color={activeInd.color}
                  glow={activeInd.glow || hexToRgba(activeInd.color, 0.6)}
                  shimmer={activeInd.shimmer || hexToRgba(activeInd.color, 0.35)}
                  icon=""
                  name={career.title}
                  sub={career.salary}
                  onClick={() => selectCareer(career)}
                  style={{
                    opacity: activeCareer ? (activeCareer.title === career.title ? 1 : 0.32) : 1,
                    transform: activeCareer?.title === career.title ? "scale(1.08)" : "scale(1)",
                    filter: activeCareer && activeCareer.title !== career.title ? "saturate(0.4) brightness(0.6)" : "none",
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
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{activeCareer.title}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: activeInd.color, marginBottom: activeCareer.salary ? 2 : 6 }}>{activeCareer.salary}</div>
              {activeCareer.salary && <SalaryNote style={{ marginBottom: 6 }} />}
              <div style={{ fontSize: 12, color: "var(--textMid)", lineHeight: 1.6, marginBottom: 10 }}>{activeCareer.desc}</div>
              {activeCareer.school && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ background: `${activeInd.color}20`, border: `1px solid ${activeInd.color}45`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 600, color: activeInd.color }}>
                  📚 {activeCareer.school}
                </span>
              </div>
              )}
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
