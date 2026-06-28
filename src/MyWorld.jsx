import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const T = {
  bg: "#1E2030", bgCard: "#272B40", bgDeep: "#1A1D2E",
  border: "#3D3F55", text: "#E0E8FF", textMid: "#8B8FA8", textDim: "#4A4D66",
  accent1: "#06B6D4", accent2: "#3B82F6",
};

const INDUSTRY_COLORS = {
  "Tech & Engineering":    "#7F77DD",
  "Healthcare & Medicine": "#1D9E75",
  "Business & Finance":    "#BA7517",
  "Design & Creative":     "#D4537E",
  "Law & Government":      "#378ADD",
  "Sports & Fitness":      "#D85A30",
  "Education & Coaching":  "#639922",
  "Hospitality & Events":  "#534AB7",
  "Media & Entertainment": "#C4508E",
  "Media & Journalism":    "#C4508E",
};
function getColor(industry) { return INDUSTRY_COLORS[industry] || "#7F77DD"; }

const SORT_MODES = [
  { id: "salary",     label: "by salary" },
  { id: "industry",  label: "by industry" },
  { id: "experience",label: "by experience" },
  { id: "remote",    label: "remote vs in-person" },
  { id: "pressure",  label: "chill vs high-pressure" },
];

const ZONE_ORDER = {
  salary:     ["Entry Level", "High Earners"],
  experience: ["New",         "Senior"],
  remote:     ["Remote",      "In-Person"],
  pressure:   ["Chill",       "Intense"],
};

// Padding constants
const MARGIN     = 24;   // canvas edge padding
const TOP_MARGIN = 110;  // below header + sort buttons

function parseSalaryMin(range) {
  if (!range) return 0;
  const m = range.match(/\$?(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function getGroupLabel(career, sortMode) {
  const kws = career.keywords || [];
  switch (sortMode) {
    case "salary":
      return parseSalaryMin(career.salary_range) >= 100 ? "High Earners" : "Entry Level";
    case "industry":
      return career.primary_industry || "Other";
    case "experience": {
      const t = (career.name || "").toLowerCase();
      return (t.includes("director") || t.includes("head of") || t.includes("chief") ||
              t.includes("vp") || t.includes("manager") || t.includes("lead") || t.includes("senior"))
        ? "Senior" : "New";
    }
    case "remote":
      return ["remote","flexible","digital","online","virtual","freelance"].some(r => kws.includes(r))
        ? "Remote" : "In-Person";
    case "pressure":
      return ["competitive","urgent","high-stakes","demanding","intensive","fast-paced"].some(p => kws.includes(p))
        ? "Intense" : "Chill";
    default: return "All";
  }
}

function seededRng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ─── Plaza floor ─────────────────────────────────────────────────────────────
function drawFloor(ctx, W, H) {
  // Base
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#161828");
  bg.addColorStop(1, "#1b1d2e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Radial plaza glow
  const gl = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
  gl.addColorStop(0,   "rgba(80,90,200,0.09)");
  gl.addColorStop(0.6, "rgba(40,50,140,0.03)");
  gl.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(0, 0, W, H);

  // Tile grid
  const TILE = 52;
  ctx.strokeStyle = "rgba(255,255,255,0.038)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < W; x += TILE) { ctx.moveTo(x + 0.5, 0);   ctx.lineTo(x + 0.5, H); }
  for (let y = 0; y < H; y += TILE) { ctx.moveTo(0, y + 0.5);    ctx.lineTo(W, y + 0.5); }
  ctx.stroke();

  // Intersection dots
  ctx.fillStyle = "rgba(255,255,255,0.055)";
  for (let x = TILE; x < W; x += TILE) {
    for (let y = TILE; y < H; y += TILE) {
      ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function darkenColor(hex, f) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.round(((n >> 16) & 0xff) * f);
  const g = Math.round(((n >>  8) & 0xff) * f);
  const b = Math.round(( n        & 0xff) * f);
  return `rgb(${r},${g},${b})`;
}

// ─── Figure (3/4 isometric — head · body · legs with depth scaling) ──────────
// `y`     = ground-contact / feet level in CSS pixels.
// `scale` = 0.72 (top of canvas, far away) → 1.0 (bottom, close).
// Mirror the whole figure when cos(angle) < 0 (walking left).
function drawFigure(ctx, x, y, color, angle, walkPhase, state, selected, idleBob, scale) {
  const s      = scale;
  const fy     = y + idleBob;             // animated feet Y
  const moving = state === "wandering";
  const flip   = Math.cos(angle) < -0.15; // mirror when heading left

  const legSwing = moving ? Math.sin(walkPhase * 2.6) : 0;

  const LEG_H  = 21 * s;
  const BODY_H = 13 * s;
  const BODY_W = 18 * s;
  const HEAD_R = 11 * s;

  const bodyMidY = fy  - LEG_H - BODY_H * 0.5;
  const headCY   = fy  - LEG_H - BODY_H - HEAD_R + 1.5 * s;

  ctx.save();
  if (flip) { ctx.translate(x * 2, 0); ctx.scale(-1, 1); }

  // Drop shadow on floor
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x, fy + 2.5 * s, BODY_W * 0.82, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Legs
  ctx.strokeStyle = darkenColor(color, 0.72);
  ctx.lineCap = "round";
  ctx.lineWidth = 4.5 * s;
  ctx.beginPath();
  ctx.moveTo(x - 4 * s, fy - LEG_H);
  ctx.lineTo(x - 4 * s + legSwing * 5 * s, fy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, fy - LEG_H);
  ctx.lineTo(x + 4 * s - legSwing * 5 * s, fy);
  ctx.stroke();

  // Torso (wider oval, darker shade of the color)
  ctx.fillStyle = darkenColor(color, 0.85);
  ctx.beginPath();
  ctx.ellipse(x, bodyMidY, BODY_W * 0.5, BODY_H * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head (full color)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, headCY, HEAD_R, 0, Math.PI * 2);
  ctx.fill();

  // Head gloss
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.arc(x - HEAD_R * 0.28, headCY - HEAD_R * 0.30, HEAD_R * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Eyes — two dark dots in upper-centre of face
  const eyeY = headCY - HEAD_R * 0.12;
  ctx.fillStyle = "rgba(0,0,0,0.68)";
  ctx.beginPath(); ctx.arc(x - HEAD_R * 0.32, eyeY, HEAD_R * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + HEAD_R * 0.32, eyeY, HEAD_R * 0.16, 0, Math.PI * 2); ctx.fill();

  // Smile
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = HEAD_R * 0.14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x, headCY + HEAD_R * 0.10, HEAD_R * 0.32, 0.18 * Math.PI, 0.82 * Math.PI);
  ctx.stroke();

  if (selected) {
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 14;
    ctx.strokeStyle = "rgba(255,255,255,0.58)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, headCY, HEAD_R + 5 * s, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

// ─── Name badge (shown on hover) ─────────────────────────────────────────────
// `headTopY` = top of the figure's head; badge sits just above it.
function drawNameBadge(ctx, x, headTopY, name, color) {
  const label = (name || "").replace(/\//g, " / ").trim();
  ctx.save();
  ctx.font = "600 10px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tw = ctx.measureText(label).width;
  const bw = tw + 14, bh = 18;
  const bx = x - bw / 2, by = headTopY - bh - 5;

  // Shadow behind badge
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 6;
  ctx.fillStyle = "rgba(15,17,32,0.94)";
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 4);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = color + "99"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.stroke();

  ctx.fillStyle = "#E0E8FF";
  ctx.fillText(label, x, by + bh / 2);
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyWorld({ onBack, onViewCareer }) {
  const { user } = useAuth();
  const canvasRef  = useRef(null);
  const cssSizeRef = useRef({ W: 0, H: 0 });

  const [careers,        setCareers]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [sortMode,       setSortMode]       = useState(null);
  const [listView,       setListView]       = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const peopleRef    = useRef([]);
  const animFrameRef = useRef(null);
  const sortModeRef  = useRef(null);
  const selectedRef  = useRef(null);
  const hoverRef     = useRef(null);  // { x, y } in CSS pixels

  useEffect(() => { sortModeRef.current = sortMode; },       [sortMode]);
  useEffect(() => { selectedRef.current = selectedCareer; }, [selectedCareer]);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("saved_careers").select("career_id").eq("user_id", user.id)
      .then(async ({ data: saved }) => {
        const ids = (saved || []).map(r => r.career_id).filter(Boolean);
        if (!ids.length) { setCareers([]); setLoading(false); return; }
        const { data: cd } = await supabase.from("careers").select("*").in("id", ids);
        setCareers((cd || []).map(c => ({
          ...c,
          traits:   c.traits   ? c.traits.split(",").map(s => s.trim()).filter(Boolean)   : [],
          keywords: c.keywords ? c.keywords.split(",").map(s => s.trim()).filter(Boolean) : [],
        })));
        setLoading(false);
      });
  }, [user]);

  // ─── Place figures randomly across the plaza ───────────────────────────────
  useEffect(() => {
    if (!careers.length) { peopleRef.current = []; return; }
    const { W, H } = cssSizeRef.current;
    const cW = W || window.innerWidth  || 800;
    const cH = H || window.innerHeight || 600;
    const rng = seededRng(42);
    peopleRef.current = careers.map(c => {
      const angle = rng() * Math.PI * 2;
      return {
        id:    c.id,
        career: c,
        color: getColor(c.primary_industry),
        x:     MARGIN + rng() * (cW - MARGIN * 2),
        y:     TOP_MARGIN + rng() * (cH - TOP_MARGIN - MARGIN),
        angle,
        walkSpeed:        0.75 + rng() * 0.55,
        walkPhase:        rng() * Math.PI * 2,
        bobPhase:         rng() * Math.PI * 2,
        state:            "wandering",
        idleTimer:        0,
        dirChangeTimer:   40 + Math.floor(rng() * 110),
        zoneXMin: MARGIN,   zoneXMax: cW - MARGIN,
        zoneYMin: TOP_MARGIN, zoneYMax: cH - MARGIN,
      };
    });
  }, [careers]);

  // ─── Sort / unsort ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!peopleRef.current.length) return;
    const { W, H } = cssSizeRef.current;
    const cW = W || window.innerWidth  || 800;
    const cH = H || window.innerHeight || 600;

    if (!sortMode) {
      peopleRef.current.forEach(p => {
        p.zoneXMin = MARGIN;      p.zoneXMax = cW - MARGIN;
        p.zoneYMin = TOP_MARGIN;  p.zoneYMax = cH - MARGIN;
        p.state = "wandering";
      });
      return;
    }

    const groups = {};
    peopleRef.current.forEach(p => {
      const g = getGroupLabel(p.career, sortMode);
      (groups[g] = groups[g] || []).push(p);
    });
    const names = ZONE_ORDER[sortMode]
      ? ZONE_ORDER[sortMode].filter(n => groups[n])
      : Object.keys(groups);
    const gW = cW / names.length;

    names.forEach((gName, gi) => {
      const xMin = gi === 0               ? MARGIN      : gi * gW + 12;
      const xMax = gi === names.length - 1 ? cW - MARGIN : (gi + 1) * gW - 12;
      const yMin = TOP_MARGIN, yMax = cH - MARGIN;
      (groups[gName] || []).forEach(p => {
        p.zoneXMin = xMin; p.zoneXMax = xMax;
        p.zoneYMin = yMin; p.zoneYMax = yMax;
        p.state = "wandering";
        // If outside zone, steer toward zone centre
        if (p.x < xMin || p.x > xMax || p.y < yMin || p.y > yMax) {
          const cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2;
          p.angle = Math.atan2(cy - p.y, cx - p.x) + (Math.random() - 0.5) * 0.3;
        }
      });
    });
  }, [sortMode]);

  // ─── Canvas resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.clientWidth  || canvas.offsetWidth  || 800;
      const H = canvas.clientHeight || canvas.offsetHeight || 600;
      cssSizeRef.current = { W, H };
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [loading]);

  // ─── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw(ts) {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const { W, H } = cssSizeRef.current;
      if (!W || !H) { animFrameRef.current = requestAnimationFrame(draw); return; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const t = ts / 1000;
      const people = peopleRef.current;
      const sm = sortModeRef.current;

      // ── Plaza floor ──
      drawFloor(ctx, W, H);

      // ── Zone watermarks + dividers (drawn before figures) ──
      if (sm) {
        const grps = {};
        people.forEach(p => {
          const g = getGroupLabel(p.career, sm);
          (grps[g] = grps[g] || []).push(p);
        });
        const names = ZONE_ORDER[sm]
          ? ZONE_ORDER[sm].filter(n => grps[n])
          : Object.keys(grps);
        const gW = W / names.length;

        ctx.save();
        // Watermark text
        const fs = Math.min(68, Math.max(24, W / Math.max(names.length * 3.8, 3)));
        ctx.font = `bold ${fs}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255,255,255,0.055)";
        names.forEach((name, gi) => {
          ctx.fillText(name.toUpperCase(), gi * gW + gW / 2, H * 0.5);
        });
        // Dividers
        ctx.strokeStyle = "rgba(255,255,255,0.09)";
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 8]);
        for (let i = 1; i < names.length; i++) {
          ctx.beginPath(); ctx.moveTo(i * gW, 0); ctx.lineTo(i * gW, H); ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ── Update figure positions ──
      people.forEach(p => {
        if (p.state === "idle") {
          if (--p.idleTimer <= 0) p.state = "wandering";
          return;
        }

        // Steer toward zone if outside it
        const inZone = p.x >= p.zoneXMin && p.x <= p.zoneXMax
                    && p.y >= p.zoneYMin && p.y <= p.zoneYMax;
        if (!inZone) {
          const cx = (p.zoneXMin + p.zoneXMax) / 2;
          const cy = (p.zoneYMin + p.zoneYMax) / 2;
          p.angle = Math.atan2(cy - p.y, cx - p.x) + (Math.random() - 0.5) * 0.25;
        }

        const spd = inZone ? p.walkSpeed : p.walkSpeed * 2.8;
        let nx = p.x + Math.cos(p.angle) * spd;
        let ny = p.y + Math.sin(p.angle) * spd;
        let a  = p.angle;

        // Bounce off zone / canvas edges
        if (nx < p.zoneXMin) { nx = p.zoneXMin; a = Math.PI - a; }
        if (nx > p.zoneXMax) { nx = p.zoneXMax; a = Math.PI - a; }
        if (ny < p.zoneYMin) { ny = p.zoneYMin; a = -a; }
        if (ny > p.zoneYMax) { ny = p.zoneYMax; a = -a; }

        // Periodic random direction nudge
        if (--p.dirChangeTimer <= 0) {
          a += (Math.random() - 0.5) * 1.1;
          p.dirChangeTimer = 55 + Math.floor(Math.random() * 130);
          if (Math.random() < 0.10) {
            p.state = "idle";
            p.idleTimer = 35 + Math.floor(Math.random() * 90);
            return;
          }
        }

        p.x = nx; p.y = ny; p.angle = a;
        p.walkPhase += spd * 0.21;
      });

      // ── Draw figures back-to-front (painter's algorithm for depth) ──
      const byDepth = [...people].sort((a, b) => a.y - b.y);

      // scale(p): 0.82 at top of canvas → 1.0 at bottom (depth cue)
      const figScale = p =>
        0.82 + 0.18 * Math.max(0, Math.min(1,
          (p.y - TOP_MARGIN) / Math.max(1, H - TOP_MARGIN - MARGIN)));

      // Hover hit-test against figure visual centre (mid-body, above feet)
      const hp = hoverRef.current;
      let hoveredPerson = null;
      if (hp) {
        let best = 26;
        for (const p of people) {
          const sc  = figScale(p);
          const midY = p.y - (21 + 6.5) * sc;  // feet − (legH + halfBodyH)
          const d = Math.hypot(p.x - hp.x, midY - hp.y);
          if (d < best) { best = d; hoveredPerson = p; }
        }
      }

      byDepth.forEach(p => {
        const isSel   = selectedRef.current?.id === p.id;
        const idleBob = Math.sin(t * 1.9 + p.bobPhase) * 0.65;
        drawFigure(ctx, p.x, p.y, p.color, p.angle, p.walkPhase, p.state, isSel, idleBob, figScale(p));
      });

      // Name badge drawn last (always on top)
      if (hoveredPerson) {
        const sc       = figScale(hoveredPerson);
        const bob      = Math.sin(t * 1.9 + hoveredPerson.bobPhase) * 0.65;
        const headTopY = hoveredPerson.y + bob - (21 + 13 + 22) * sc;
        drawNameBadge(ctx, hoveredPerson.x, headTopY, hoveredPerson.career.name, hoveredPerson.color);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [careers]);

  // ─── Event handlers ────────────────────────────────────────────────────────
  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const { H } = cssSizeRef.current;
    let hit = null, best = 26;
    for (const p of peopleRef.current) {
      const sc   = 0.82 + 0.18 * Math.max(0, Math.min(1,
        (p.y - TOP_MARGIN) / Math.max(1, H - TOP_MARGIN - MARGIN)));
      const midY = p.y - (21 + 6.5) * sc;
      const d = Math.hypot(p.x - cx, midY - cy);
      if (d < best) { best = d; hit = p; }
    }
    setSelectedCareer(hit ? hit.career : null);
  }

  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    hoverRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseLeave() { hoverRef.current = null; }

  // ─── Sorted list data ──────────────────────────────────────────────────────
  const sortedCareers = [...careers].sort((a, b) => {
    if (sortMode === "salary")     return parseSalaryMin(b.salary_range) - parseSalaryMin(a.salary_range);
    if (sortMode === "industry")   return (a.primary_industry || "").localeCompare(b.primary_industry || "");
    if (sortMode === "experience") return getGroupLabel(a, "experience").localeCompare(getGroupLabel(b, "experience"));
    return 0;
  });

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{ color: T.textMid, fontSize: 14 }}>Loading your echoes…</div>
    </div>
  );

  if (!careers.length) return (
    <div style={{ height: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: "'Inter',system-ui,sans-serif", padding: "2rem" }}>
      <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: T.textMid, cursor: "pointer" }}>← Back</button>
      <div style={{ fontSize: 48, opacity: 0.5 }}>✦</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.text, textAlign: "center" }}>No Echoes yet</div>
      <div style={{ fontSize: 14, color: T.textMid, textAlign: "center", maxWidth: 300 }}>Explore worlds to find them.</div>
      <button onClick={onBack} style={{ padding: "10px 28px", background: `linear-gradient(135deg,${T.accent1},${T.accent2})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Explore careers →</button>
    </div>
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: T.bg, overflow: "hidden", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Canvas — always mounted; hidden only in list view */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: listView ? "none" : "block", cursor: "pointer" }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(22,24,40,0.90)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: T.textMid, cursor: "pointer" }}>← Back</button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: T.text }}>
          Your Echoes <span style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>— {careers.length} Echo{careers.length !== 1 ? "es" : ""}</span>
        </div>
        <button
          onClick={() => setListView(v => !v)}
          style={{ background: listView ? T.accent1 + "33" : "transparent", border: `1px solid ${listView ? T.accent1 : T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: listView ? T.accent1 : T.textMid, cursor: "pointer" }}
        >{listView ? "◎ Plaza" : "≡ List"}</button>
      </div>

      {/* Sort buttons */}
      <div style={{ position: "absolute", top: 57, left: 0, right: 0, zIndex: 20, display: "flex", gap: 6, padding: "9px 14px", overflowX: "auto", background: "rgba(22,24,40,0.80)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.border}22` }}>
        {SORT_MODES.map(m => (
          <button key={m.id}
            onClick={() => setSortMode(prev => prev === m.id ? null : m.id)}
            style={{
              flexShrink: 0, padding: "5px 13px", fontSize: 11, fontWeight: 600,
              borderRadius: 20, cursor: "pointer", transition: "all 0.18s",
              border: `1px solid ${sortMode === m.id ? T.accent1 : T.border}`,
              background: sortMode === m.id ? T.accent1 + "28" : "transparent",
              color: sortMode === m.id ? T.accent1 : T.textMid,
            }}
          >{m.label}</button>
        ))}
      </div>

      {/* List view */}
      {listView && (
        <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingTop: 106 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <th style={{ textAlign: "left", padding: "8px 12px 8px 16px", fontWeight: 700 }}>Career</th>
                <th style={{ textAlign: "left", padding: "8px 12px 8px 0",  fontWeight: 700 }}>Industry</th>
                <th style={{ textAlign: "left", padding: "8px 12px 8px 0",  fontWeight: 700 }}>Salary</th>
              </tr>
            </thead>
            <tbody>
              {sortedCareers.map(c => {
                const color = getColor(c.primary_industry);
                return (
                  <tr key={c.id} onClick={() => onViewCareer(c, color)}
                    style={{ cursor: "pointer", borderBottom: `1px solid ${T.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bgCard}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 12px 13px 16px", fontSize: 14, fontWeight: 700, color: T.text }}>{c.name}</td>
                    <td style={{ padding: "13px 12px 13px 0" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color, background: color + "22", border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 9px" }}>{c.primary_industry}</span>
                    </td>
                    <td style={{ padding: "13px 12px 13px 0", fontSize: 12, color: T.accent1, fontWeight: 600 }}>{c.salary_range}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Career detail card */}
      {selectedCareer && !listView && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50, background: T.bgCard, borderTop: `2px solid ${getColor(selectedCareer.primary_industry)}`, borderRadius: "20px 20px 0 0", padding: "1.3rem 1.4rem 1.8rem", boxShadow: "0 -10px 40px rgba(0,0,0,0.65)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: getColor(selectedCareer.primary_industry), fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{selectedCareer.primary_industry}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{selectedCareer.name}</div>
              {selectedCareer.salary_range && <div style={{ fontSize: 13, color: T.accent1, marginTop: 4, fontWeight: 600 }}>{selectedCareer.salary_range}</div>}
            </div>
            <button onClick={() => setSelectedCareer(null)} style={{ background: "none", border: "none", color: T.textDim, fontSize: 24, cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
          </div>
          {selectedCareer.description && <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: 14 }}>{selectedCareer.description}</p>}
          <button
            onClick={() => { onViewCareer(selectedCareer, getColor(selectedCareer.primary_industry)); setSelectedCareer(null); }}
            style={{ width: "100%", padding: "0.8rem", background: `linear-gradient(135deg,${getColor(selectedCareer.primary_industry)},${T.accent2})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >View career path →</button>
        </div>
      )}
    </div>
  );
}
