import { useState, useEffect, useLayoutEffect, useCallback } from "react";

// A lightweight spotlight walkthrough. Each step points at a real element found
// by CSS selector (data-tour="..."), dims the rest of the screen, and shows a
// callout card styled with the app's own tokens. If a target is missing or
// hidden (e.g. the desktop-only sidebar on mobile), the callout just centers.

const T = {
  bgCard: "var(--bgCard)", bgDeep: "var(--bgDeep)", border: "var(--border)",
  text: "var(--text)", textMid: "var(--textMid)",
  accent1: "#06B6D4", accent2: "#3B82F6", accentPurple: "#7F77DD",
};

const CALLOUT_W = 264;
const CALLOUT_H_EST = 150; // used only for edge-clamping
const PAD = 10;

export default function Tour({ steps, onClose }) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  const step = steps[i];
  const isLast = i === steps.length - 1;

  const measure = useCallback(() => {
    const el = step && document.querySelector(step.selector);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) { setRect(r); return; }
    }
    setRect(null); // target absent/hidden → centered callout, no spotlight
  }, [step]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [measure]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function next() { if (isLast) onClose(); else setI(n => n + 1); }

  // ── Position the callout relative to the target ──
  const vw = typeof window !== "undefined" ? window.innerWidth : 360;
  const vh = typeof window !== "undefined" ? window.innerHeight : 640;
  let top, left;
  if (!rect) {
    top = vh / 2 - CALLOUT_H_EST / 2;
    left = vw / 2 - CALLOUT_W / 2;
  } else if (step.placement === "right" && rect.right + 12 + CALLOUT_W <= vw - PAD) {
    left = rect.right + 12;
    top = rect.top;
  } else {
    // default: below the target, flipping above if it would overflow the bottom
    left = rect.left;
    top = rect.bottom + 12;
    if (top + CALLOUT_H_EST > vh - PAD) top = rect.top - CALLOUT_H_EST - 12;
  }
  left = Math.max(PAD, Math.min(left, vw - CALLOUT_W - PAD));
  top = Math.max(PAD, Math.min(top, vh - CALLOUT_H_EST - PAD));

  const SP = 6; // spotlight padding around the target

  return (
    <>
      {/* Click-blocker so the page behind isn't interactive mid-tour */}
      <div style={{ position: "fixed", inset: 0, zIndex: 30000 }} />

      {/* Dimming: a spotlight cutout around the target, or a flat scrim if none */}
      {rect ? (
        <div style={{
          position: "fixed",
          top: rect.top - SP, left: rect.left - SP,
          width: rect.width + SP * 2, height: rect.height + SP * 2,
          borderRadius: 12,
          boxShadow: "0 0 0 9999px rgba(8,9,18,0.66)",
          border: `2px solid ${T.accentPurple}`,
          zIndex: 30001, pointerEvents: "none",
          transition: "all 0.22s ease",
        }} />
      ) : (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,9,18,0.66)", zIndex: 30001, pointerEvents: "none" }} />
      )}

      {/* Callout card */}
      <div style={{
        position: "fixed", top, left, width: CALLOUT_W, zIndex: 30002,
        background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14,
        padding: "14px 15px 13px", boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        fontFamily: "'Inter', system-ui, sans-serif",
        animation: "fadeSlideUp 0.25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accentPurple }}>
            Quick tour · {i + 1} of {steps.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close tour"
            style={{ background: "none", border: "none", color: T.textMid, fontSize: 16, lineHeight: 1, cursor: "pointer", padding: "0 2px" }}
          >×</button>
        </div>

        <div style={{ fontSize: 14, color: T.text, lineHeight: 1.45, marginBottom: 14 }}>
          {step.text}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: T.textMid, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 2px" }}
          >Skip</button>
          <button
            onClick={next}
            style={{
              background: `linear-gradient(135deg, ${T.accent1}, ${T.accent2})`,
              border: "none", borderRadius: 9, color: "#fff",
              fontSize: 13, fontWeight: 700, padding: "8px 18px", cursor: "pointer",
            }}
          >{isLast ? "Got it" : "Next"}</button>
        </div>
      </div>
    </>
  );
}
