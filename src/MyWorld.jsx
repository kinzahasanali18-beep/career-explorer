import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const T = {
  bg: "#1E2030", bgCard: "#272B40", bgDeep: "#1A1D2E",
  border: "#3D3F55", text: "#E0E8FF", textMid: "#8B8FA8", textDim: "#4A4D66",
  accent1: "#06B6D4", accent2: "#3B82F6", accentPurple: "#7F77DD",
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

function parseSalaryMin(range) {
  if (!range) return 0;
  const m = range.match(/\$?(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

// Zone order defines left→right placement and the exact label strings used as group keys.
const ZONE_ORDER = {
  salary:     ["Entry Level", "High Earners"],
  experience: ["New",         "Senior"],
  remote:     ["Remote",      "In-Person"],
  pressure:   ["Chill",       "Intense"],
  // industry: dynamic, no fixed order
};

function getGroupLabel(career, sortMode) {
  const kws = career.keywords || [];
  switch (sortMode) {
    case "salary": {
      const s = parseSalaryMin(career.salary_range);
      return s >= 100 ? "High Earners" : "Entry Level";
    }
    case "industry":
      return career.primary_industry || "Other";
    case "experience": {
      const title = (career.name || "").toLowerCase();
      return (title.includes("director") || title.includes("head of") || title.includes("chief") ||
              title.includes("vp") || title.includes("manager") || title.includes("lead") || title.includes("senior"))
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

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Figure: 50 CSS px tall ────────────────────────────────────────────────────
// All coordinates relative to `groundY` (feet level) in CSS pixels.
// Feet at groundY, head top at groundY-50.
//   Legs:   groundY-17  →  groundY       (17 px)
//   Body:   groundY-35  →  groundY-17    (18 px, 10 px wide)
//   Head:   centre groundY-43, radius 7  (top at groundY-50)
function drawFigure(ctx, x, groundY, color, facing, walkPhase, state, selected, t) {
  const isMoving  = state === "wandering" || state === "running";
  const isRunning = state === "running";

  const maxSwing = isRunning ? 17 : 10;
  const legSwing = isMoving ? Math.sin(walkPhase) * maxSwing : 0;
  const headBob  = !isMoving ? Math.sin(t * 1.6) * 1.2 : 0;   // idle bob

  // Shadow
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x, groundY + 2, 9, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.lineCap = "round";
  ctx.strokeStyle = color;

  // Legs
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(x - 2.5, groundY - 17); ctx.lineTo(x - 2.5 + legSwing * 0.4, groundY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 2.5, groundY - 17); ctx.lineTo(x + 2.5 - legSwing * 0.4, groundY); ctx.stroke();

  // Body
  ctx.fillStyle = color;
  roundedRect(ctx, x - 5, groundY - 35, 10, 18, 3);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.13)";
  roundedRect(ctx, x - 4, groundY - 34, 4, 7, 2);
  ctx.fill();

  // Arms (opposite to leg swing)
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 5, groundY - 29); ctx.lineTo(x - 11 - legSwing * 0.4, groundY - 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, groundY - 29); ctx.lineTo(x + 11 + legSwing * 0.4, groundY - 20); ctx.stroke();

  // Head
  const headY = groundY - 43 + headBob;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, headY, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.26)";
  ctx.beginPath(); ctx.arc(x + (facing >= 0 ? -2 : 2), headY - 2.5, 2.8, 0, Math.PI * 2); ctx.fill();

  if (selected) {
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 16;
    ctx.strokeStyle = color + "77"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, headY, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

// ─── Speech bubble ─────────────────────────────────────────────────────────────
function drawSpeechBubble(ctx, x, groundY, t) {
  const by = groundY - 63;
  const bw = 30, bh = 17, br = 5;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.90)";
  roundedRect(ctx, x - bw / 2, by - bh / 2, bw, bh, br);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bh / 2 - 1);
  ctx.lineTo(x, by + bh / 2 + 6);
  ctx.lineTo(x + 4, by + bh / 2 - 1);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3.5 + i * 1.1));
    ctx.fillStyle = "#555";
    ctx.beginPath(); ctx.arc(x - 5 + i * 5, by + 1, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MyWorld({ onBack, onViewCareer }) {
  const { user } = useAuth();
  const canvasRef   = useRef(null);
  const cssSizeRef  = useRef({ W: 0, H: 0 });  // CSS px dimensions, set by resize

  const [careers,       setCareers]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [sortMode,      setSortMode]      = useState(null);
  const [listView,      setListView]      = useState(false);
  const [selectedCareer,setSelectedCareer]= useState(null);

  const peopleRef    = useRef([]);
  const animFrameRef = useRef(null);
  const sortModeRef  = useRef(null);
  const selectedRef  = useRef(null);

  useEffect(() => { sortModeRef.current = sortMode; }, [sortMode]);
  useEffect(() => { selectedRef.current = selectedCareer; }, [selectedCareer]);

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("saved_careers").select("career_id").eq("user_id", user.id)
      .then(async ({ data: saved }) => {
        const ids = (saved || []).map(r => r.career_id).filter(Boolean);
        if (!ids.length) { setCareers([]); setLoading(false); return; }
        const { data: careerData } = await supabase.from("careers").select("*").in("id", ids);
        setCareers((careerData || []).map(c => ({
          ...c,
          traits:   c.traits   ? c.traits.split(",").map(t => t.trim()).filter(Boolean)   : [],
          keywords: c.keywords ? c.keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        })));
        setLoading(false);
      });
  }, [user]);

  // ─── Place figures — entrance run from edges ────────────────────────────────

  useEffect(() => {
    if (!careers.length) { peopleRef.current = []; return; }
    // Use live CSS width; fall back to window if canvas not yet measured
    const W = cssSizeRef.current.W || window.innerWidth || 800;
    const count = careers.length;
    // Spacing: enough that 6-8 figures are always visible across the canvas
    const spacing = count > 1 ? Math.min(80, (W - 100) / (count - 1)) : 0;
    const spread  = spacing * (count - 1);
    const startX  = Math.max(50, (W - spread) / 2);

    console.log("[MyWorld] placing", careers.length, "figures, W:", W);
    const rng = seededRng(42);
    peopleRef.current = careers.map((c, i) => {
      const x = count === 1 ? W / 2 : startX + i * spacing;
      return {
        id: c.id, career: c, color: getColor(c.primary_industry),
        x,
        targetX: x,
        zoneXMin: 50, zoneXMax: W - 50,
        state: "idle",
        facing: rng() > 0.5 ? 1 : -1,
        walkPhase: 0,
        idleTimer: Math.floor(rng() * 40),  // 0-40 frames → immediately starts wandering
        talkTimer: 0, talkPartner: null,
        bobPhase: rng() * Math.PI * 2,
      };
    });
  }, [careers]);

  // ─── Sort / unsort ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!peopleRef.current.length) return;
    const W = cssSizeRef.current.W || window.innerWidth || 800;

    if (!sortMode) {
      peopleRef.current.forEach(p => {
        p.zoneXMin = 50; p.zoneXMax = W - 50;
        p.targetX  = 50 + Math.random() * (W - 100);
        p.state = "running"; p.talkPartner = null; p.talkTimer = 0;
      });
      return;
    }

    const groups = {};
    peopleRef.current.forEach(p => {
      const g = getGroupLabel(p.career, sortMode);
      (groups[g] = groups[g] || []).push(p);
    });
    // Use fixed left→right order when defined; fall back to insertion order for industry
    const names = ZONE_ORDER[sortMode]
      ? ZONE_ORDER[sortMode].filter(n => groups[n])
      : Object.keys(groups);
    const gW = W / names.length;

    names.forEach((gName, gi) => {
      const gp = groups[gName];
      const raw0 = gi * gW + 30, raw1 = (gi + 1) * gW - 30;
      // Guard against zones that are too narrow or inverted (happens on small canvases)
      const xMin = Math.min(raw0, raw1);
      const xMax = Math.max(raw0, raw1, xMin + 40); // at least 40px wide
      const cx = gi * gW + gW / 2;
      const spreadPx = Math.max(30, xMax - xMin - 20);
      gp.forEach((p, pi) => {
        p.zoneXMin = xMin; p.zoneXMax = xMax;
        const off = gp.length === 1 ? 0 : (pi / (gp.length - 1) - 0.5) * spreadPx;
        p.targetX = Math.max(xMin, Math.min(xMax, cx + off));
        p.state = "running"; p.talkPartner = null; p.talkTimer = 0;
      });
    });
  }, [sortMode]);

  // ─── Canvas resize — stores CSS dimensions in ref ──────────────────────────
  // Depends on `loading` so it re-runs when the canvas first mounts
  // (loading transitions true→false, main return with <canvas> renders for the first time).

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
      console.log("[MyWorld] canvas sized:", W, "×", H, "dpr:", dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [loading]);

  // ─── Animation loop ─────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const RUN_SPD  = 3.5;
    const WALK_SPD = 0.9;
    let loggedOnce = false;

    function draw(ts) {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      // CSS dimensions from ref — set by resize observer, no DPR math needed here
      const { W, H } = cssSizeRef.current;
      if (!loggedOnce) {
        console.log("[MyWorld] draw() fired — cssSizeRef:", W, H, "| people:", peopleRef.current.length);
        loggedOnce = true;
      }
      if (!W || !H) { animFrameRef.current = requestAnimationFrame(draw); return; }

      // Scale context so every drawing unit = 1 CSS pixel.
      // This is the ONLY place DPR is applied; all coordinates below are CSS pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const t = ts / 1000;

      // Background
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#181a2a"); sky.addColorStop(0.7, "#1E2030"); sky.addColorStop(1, "#1a1c2a");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // groundY computed from live CSS height — never stale
      const groundY = H * 0.72;

      // Stars
      const srng = seededRng(99);
      for (let i = 0; i < 55; i++) {
        const sx = srng() * W, sy = srng() * groundY * 0.88, sr = srng() * 1.3 + 0.3;
        ctx.globalAlpha = (0.5 + 0.5 * Math.sin(t * (0.5 + srng() * 0.7) + i * 1.7)) * 0.45;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ground
      ctx.fillStyle = "#14162a"; ctx.fillRect(0, groundY, W, H - groundY);
      ctx.strokeStyle = "#3D3F5533"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

      const people = peopleRef.current;

      // ── State machine ──
      people.forEach(p => {
        // Sort active: allow running to zone position, then freeze with idle head bob only.
        if (sortModeRef.current) {
          if (p.state === "running") {
            const dx = p.targetX - p.x;
            if (Math.abs(dx) < RUN_SPD + 0.5) {
              p.x = p.targetX; p.state = "idle";
            } else {
              p.x += Math.sign(dx) * RUN_SPD; p.facing = Math.sign(dx); p.walkPhase += 0.22;
            }
          } else {
            // Force everything else to frozen idle — legs settle, no wander, no talk
            p.state = "idle";
            p.walkPhase *= 0.88;
            p.talkPartner = null;
          }
          return; // skip free-wander logic below
        }

        // No sort active — full free-wander behaviour
        if (p.state === "running") {
          const dx = p.targetX - p.x;
          if (Math.abs(dx) < RUN_SPD + 0.5) {
            p.x = p.targetX; p.state = "idle"; p.idleTimer = 40 + Math.random() * 80;
          } else {
            p.x += Math.sign(dx) * RUN_SPD; p.facing = Math.sign(dx); p.walkPhase += 0.22;
          }
        } else if (p.state === "wandering") {
          const dx = p.targetX - p.x;
          if (Math.abs(dx) < WALK_SPD + 0.5) {
            p.x = p.targetX; p.state = "idle"; p.idleTimer = 80 + Math.random() * 220;
          } else {
            p.x += Math.sign(dx) * WALK_SPD; p.facing = Math.sign(dx); p.walkPhase += 0.13;
          }
        } else if (p.state === "idle") {
          p.walkPhase *= 0.88;
          if (--p.idleTimer <= 0) {
            if (Math.random() < 0.3) p.facing = -p.facing;
            p.targetX = p.zoneXMin + Math.random() * (p.zoneXMax - p.zoneXMin);
            p.state = "wandering";
          }
          if (Math.random() < 0.004) {
            for (const other of people) {
              if (other.id === p.id || other.talkPartner !== null) continue;
              if ((other.state === "idle" || other.state === "wandering") && Math.abs(other.x - p.x) < 70) {
                const dur = 100 + Math.random() * 80;
                p.state = "talking";   other.state = "talking";
                p.talkTimer = dur;     other.talkTimer = dur;
                p.talkPartner = other.id; other.talkPartner = p.id;
                p.facing = Math.sign(other.x - p.x) || 1;
                other.facing = -p.facing;
                break;
              }
            }
          }
        } else if (p.state === "talking") {
          p.walkPhase *= 0.88;
          if (--p.talkTimer <= 0) {
            p.state = "wandering"; p.talkPartner = null;
            p.targetX = p.zoneXMin + Math.random() * (p.zoneXMax - p.zoneXMin);
          }
        }
      });

      // ── Sort zone dividers + floor labels (fixed boundaries, not centroid-based) ──
      const sm = sortModeRef.current;
      if (sm) {
        const grps = {};
        people.forEach(p => { const g = getGroupLabel(p.career, sm); (grps[g] = grps[g] || []).push(p); });
        const names = ZONE_ORDER[sm]
          ? ZONE_ORDER[sm].filter(n => grps[n])
          : Object.keys(grps);
        const gW = W / names.length;

        names.forEach((gName, gi) => {
          const zoneLeft = gi * gW;
          const centerX  = zoneLeft + gW / 2;

          // Dashed vertical divider between zones (skip before zone 0)
          if (gi > 0) {
            ctx.save();
            ctx.strokeStyle = "rgba(255,255,255,0.11)";
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 7]);
            ctx.beginPath();
            ctx.moveTo(zoneLeft, groundY - 80);
            ctx.lineTo(zoneLeft, H);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
          }

          // Floor text label
          ctx.save();
          ctx.font = "bold 10px Inter, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(255,255,255,0.26)";
          ctx.fillText(gName.toUpperCase(), centerX, groundY + 22);
          ctx.restore();
        });
      }

      // ── Speech bubbles (one per pair) ──
      const drawn = new Set();
      people.forEach(p => {
        if (p.state !== "talking" || !p.talkPartner) return;
        const key = [p.id, p.talkPartner].sort().join("_");
        if (drawn.has(key)) return; drawn.add(key);
        const other = people.find(q => q.id === p.talkPartner);
        if (other) drawSpeechBubble(ctx, (p.x + other.x) / 2, groundY, t);
      });

      // ── Draw figures + name labels ──
      people.forEach(p => {
        const isSel = selectedRef.current && selectedRef.current.id === p.id;
        drawFigure(ctx, p.x, groundY, p.color, p.facing, p.walkPhase, p.state, isSel, t + p.bobPhase);
        ctx.font = "10px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(224,232,255,0.60)";
        ctx.fillText((p.career.name || "").split(" ").slice(0, 2).join(" "), p.x, groundY + 14);
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [careers]);

  // ─── Click hit detection ─────────────────────────────────────────────────────

  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const { H } = cssSizeRef.current;
    const groundY = H * 0.72;
    let hit = null;
    for (const p of peopleRef.current) {
      if (Math.abs(cx - p.x) < 18 && (cy - groundY) > -55 && (cy - groundY) < 16) { hit = p; break; }
    }
    setSelectedCareer(hit ? hit.career : null);
  }

  // ─── Sorted list ─────────────────────────────────────────────────────────────

  const sortedCareers = [...careers].sort((a, b) => {
    if (sortMode === "salary")     return parseSalaryMin(b.salary_range) - parseSalaryMin(a.salary_range);
    if (sortMode === "industry")   return (a.primary_industry || "").localeCompare(b.primary_industry || "");
    if (sortMode === "experience") return getGroupLabel(a, "experience").localeCompare(getGroupLabel(b, "experience"));
    return 0;
  });

  // ─── Render ──────────────────────────────────────────────────────────────────

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

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 20, display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(30,32,48,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: T.textMid, cursor: "pointer" }}>← Back</button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: T.text }}>
          Your Echoes <span style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>— {careers.length} Echo{careers.length !== 1 ? "es" : ""}</span>
        </div>
        <button
          onClick={() => setListView(v => !v)}
          style={{ background: listView ? T.accent1 + "33" : "transparent", border: `1px solid ${listView ? T.accent1 : T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: listView ? T.accent1 : T.textMid, cursor: "pointer" }}
        >{listView ? "◎ Canvas" : "≡ List"}</button>
      </div>

      {/* Sort buttons */}
      <div style={{ position: "absolute", top: 58, left: 0, right: 0, zIndex: 20, display: "flex", gap: 6, padding: "10px 14px", overflowX: "auto", background: "rgba(30,32,48,0.75)", backdropFilter: "blur(8px)" }}>
        {SORT_MODES.map(m => (
          <button key={m.id}
            onClick={() => setSortMode(prev => prev === m.id ? null : m.id)}
            style={{ flexShrink: 0, padding: "5px 13px", fontSize: 11, fontWeight: 600, borderRadius: 20, cursor: "pointer", transition: "all 0.18s",
              border: `1px solid ${sortMode === m.id ? T.accent1 : T.border}`,
              background: sortMode === m.id ? T.accent1 + "28" : "transparent",
              color: sortMode === m.id ? T.accent1 : T.textMid }}
          >{m.label}</button>
        ))}
      </div>

      {/* Canvas — always mounted so animation loop stays alive; hidden via display when list view is active */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: listView ? "none" : "block", cursor: "pointer" }}
        onClick={handleCanvasClick}
      />

      {/* List view */}
      {listView && (
        <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingTop: 110 }}>
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

      {/* Career card */}
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
            style={{ width: "100%", padding: "0.8rem", background: `linear-gradient(135deg, ${getColor(selectedCareer.primary_industry)}, ${T.accent2})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >View career path →</button>
        </div>
      )}
    </div>
  );
}
