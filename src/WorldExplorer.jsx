import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const SCENES = [
  {
    industryName: "Healthcare & Medicine",
    label: "Healthcare",
    slug: "healthcare",
    color: "#1D9E75",
    skyTop: "#071812",
    skyBottom: "#0f2a1e",
    groundColor: "#0a2018",
    accentColor: "#2DD4A4",
  },
  {
    industryName: "Business & Finance",
    label: "Business",
    slug: "business",
    color: "#BA7517",
    skyTop: "#140e00",
    skyBottom: "#1e1600",
    groundColor: "#180e00",
    accentColor: "#F0A030",
  },
  {
    industryName: "Media & Journalism",
    label: "Media",
    slug: "media",
    color: "#D4537E",
    skyTop: "#150810",
    skyBottom: "#1e0f16",
    groundColor: "#150a10",
    accentColor: "#F070A0",
  },
];

// ─── URL helpers ──────────────────────────────────────────────────────────────

function readWorldParams() {
  const p = new URLSearchParams(window.location.search);
  const slug = p.get("world") || "";
  const rawPan = parseInt(p.get("pan") || "0", 10);
  const careerId = p.get("career") || null;
  const sceneIdx = SCENES.findIndex(s => s.slug === slug);
  return {
    sceneIdx: sceneIdx >= 0 ? sceneIdx : 0,
    pan: isNaN(rawPan) ? 0 : rawPan,
    careerId,
  };
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
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

function drawPerson(ctx, x, y, color, bobOffset = 0, selected = false) {
  const py = y + bobOffset;

  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x, py + 42, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (selected) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 24;
    ctx.strokeStyle = color + "99";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, py - 18, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, py - 18, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.arc(x - 3, py - 22, 5, 0, Math.PI * 2);
  ctx.fill();

  const bodyGrad = ctx.createLinearGradient(x - 10, py - 4, x + 10, py + 28);
  bodyGrad.addColorStop(0, color);
  bodyGrad.addColorStop(1, color + "88");
  ctx.fillStyle = bodyGrad;
  roundedRect(ctx, x - 10, py - 4, 20, 30, 6);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 4.5;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x - 10, py + 2); ctx.lineTo(x - 18, py + 16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 10, py + 2); ctx.lineTo(x + 18, py + 16); ctx.stroke();
  ctx.lineWidth = 5.5;
  ctx.beginPath(); ctx.moveTo(x - 5, py + 26); ctx.lineTo(x - 7, py + 42); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, py + 26); ctx.lineTo(x + 7, py + 42); ctx.stroke();
}

function drawSceneBackground(ctx, W, H, scene, time) {
  const groundY = Math.floor(H * 0.72);

  const sky = ctx.createLinearGradient(0, 0, 0, groundY);
  sky.addColorStop(0, scene.skyTop);
  sky.addColorStop(1, scene.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, groundY);

  ctx.fillStyle = scene.groundColor;
  ctx.fillRect(0, groundY, W, H - groundY);

  ctx.save();
  ctx.shadowColor = scene.color;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = scene.color + "55";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY); ctx.lineTo(W, groundY);
  ctx.stroke();
  ctx.restore();

  const rng = seededRng(42);
  for (let i = 0; i < 55; i++) {
    const sx = rng() * W;
    const sy = rng() * groundY * 0.85;
    const sr = rng() * 1.4 + 0.3;
    const flicker = 0.6 + 0.4 * Math.sin(time * (0.8 + rng() * 0.6) + i);
    ctx.globalAlpha = flicker * 0.55;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const buildRng = seededRng(77);
  ctx.fillStyle = scene.color + "18";
  for (let i = 0; i < 8; i++) {
    const bx = buildRng() * W;
    const bh = 30 + buildRng() * 80;
    const bw = 20 + buildRng() * 35;
    ctx.fillRect(bx, groundY - bh, bw, bh);
  }

  return groundY;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorldExplorer({ onBack, onViewCareer }) {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  // useState lazy initializer runs exactly once — StrictMode-safe.
  // This captures the URL params at the moment the component first mounts.
  const [initialParams] = useState(() => readWorldParams());

  // restoredRef gates the one-time restore so it fires only after careers load.
  // Refs survive StrictMode's intentional double-invocation; the boolean guard
  // ensures the second invocation skips the restore that already happened.
  const restoredRef = useRef(false);

  const [sceneIdx, setSceneIdx] = useState(initialParams.sceneIdx);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [flashColor, setFlashColor] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());


  const panX = useRef(0);
  const isDragging = useRef(false);
  const isButtonDown = useRef(false);
  const dragStartX = useRef(0);
  const panStartX = useRef(0);
  const animFrameRef = useRef(null);
  const peopleRef = useRef([]);
  const timeRef = useRef(0);
  const sceneIdxRef = useRef(sceneIdx);
  const selectedRef = useRef(null);

  useEffect(() => { sceneIdxRef.current = sceneIdx; }, [sceneIdx]);
  useEffect(() => { selectedRef.current = selectedCareer; }, [selectedCareer]);

  // Component-level write so it can update the debug bar
  function writeParams(idx, pan, careerId = null) {
    const scene = SCENES[idx];
    if (!scene) return;
    const p = new URLSearchParams();
    p.set("world", scene.slug);
    p.set("pan", Math.round(pan));
    if (careerId) p.set("career", careerId);
    history.replaceState(null, "", "?" + p.toString());
  }

  // ─── Fetch careers ────────────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    setSelectedCareer(null);

    // Only reset pan + URL when the user deliberately switches tabs
    // (i.e. after the initial restore has already happened).
    // On first mount restoredRef is false — we leave pan alone and let
    // the careers effect below apply the URL-saved value once loaded.
    if (restoredRef.current) {
      panX.current = 0;
      writeParams(sceneIdx, 0, null);
    }

    supabase
      .from("careers")
      .select("*")
      .eq("primary_industry", SCENES[sceneIdx].industryName)
      .then(({ data, error }) => {
        if (error) {
          console.error("[WorldExplorer] Supabase fetch error:", error);
          setLoading(false);
          return;
        }
        const parsed = (data || []).map(c => ({
          ...c,
          traits: c.traits ? c.traits.split(",").map(t => t.trim()).filter(Boolean) : [],
          keywords: c.keywords ? c.keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        }));
        console.log(`[WorldExplorer] Loaded ${parsed.length} careers for "${SCENES[sceneIdx].industryName}"`);
        setCareers(parsed);
        setLoading(false);
      });
  }, [sceneIdx]);

  // ─── Layout people — restore pan + career AFTER real data exists ──────────
  // The draw loop clamps panX using peopleRef.current.length.
  // If we set panX before people are laid out (length = 0), minPan = 0
  // and any negative value is silently clamped away.
  // Waiting until careers.length > 0 ensures the clamp math is correct.

  useEffect(() => {
    peopleRef.current = careers.map((c, i) => ({
      id: c.id,
      career: c,
      x: 120 + i * 155,
      bobPhase: (i * 1.37) % (Math.PI * 2),
      bobSpeed: 0.55 + (i * 0.13) % 0.5,
    }));

    if (!restoredRef.current && careers.length > 0) {
      restoredRef.current = true;
      console.log(`[WorldExplorer] Restoring: pan=${initialParams.pan}, career=${initialParams.careerId}`);
      panX.current = initialParams.pan;
      // Write params so debug bar reflects restored state
      writeParams(initialParams.sceneIdx, initialParams.pan, initialParams.careerId);

      if (initialParams.careerId) {
        const match = careers.find(c => c.id === initialParams.careerId);
        if (match) {
          console.log(`[WorldExplorer] Restoring open card: ${match.name}`);
          setSelectedCareer(match);
        } else {
          console.warn(`[WorldExplorer] Career ID ${initialParams.careerId} not found in loaded careers`);
        }
      }
    }
  }, [careers]);

  // ─── Saved-career IDs ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_careers")
      .select("career_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setSavedIds(new Set((data || []).map(r => r.career_id)));
      });
  }, [user]);

  // ─── Canvas resize ────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ─── Animation loop ───────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw(ts) {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      timeRef.current = ts / 1000;
      const t = timeRef.current;
      const sc = SCENES[sceneIdxRef.current];

      const groundY = drawSceneBackground(ctx, W, H, sc, t);
      const personBaseY = groundY - 42;

      // Only clamp once people exist — avoids zeroing a restored pan
      if (peopleRef.current.length > 0) {
        const totalWidth = peopleRef.current.length * 155 + 240;
        const minPan = Math.min(0, W - totalWidth);
        panX.current = Math.max(minPan, Math.min(0, panX.current));
      }

      ctx.save();
      ctx.translate(panX.current, 0);

      peopleRef.current.forEach(p => {
        const bob = Math.sin(t * p.bobSpeed + p.bobPhase) * 3;
        const isSel = selectedRef.current && selectedRef.current.id === p.id;
        drawPerson(ctx, p.x, personBaseY, sc.color, bob, isSel);

        const name = p.career.name || "";
        const words = name.split(" ");
        const lines = [];
        let cur = "";
        ctx.font = "bold 11px Inter, system-ui, sans-serif";
        words.forEach(w => {
          const test = cur ? cur + " " + w : w;
          if (ctx.measureText(test).width > 110) { lines.push(cur); cur = w; }
          else cur = test;
        });
        if (cur) lines.push(cur);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(224,232,255,0.82)";
        lines.forEach((line, li) => {
          ctx.fillText(line, p.x, personBaseY + 58 + li * 14);
        });
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // ─── URL-aware open / close ───────────────────────────────────────────────

  function openCareer(career) {
    setSelectedCareer(career);
    writeParams(sceneIdxRef.current, panX.current, career.id);
  }

  function closeCareer() {
    setSelectedCareer(null);
    writeParams(sceneIdxRef.current, panX.current, null);
  }

  // ─── Input handlers ───────────────────────────────────────────────────────

  function switchScene(idx) {
    setSceneIdx(idx);
  }

  function handleMouseDown(e) {
    isButtonDown.current = true;
    isDragging.current = false;
    dragStartX.current = e.clientX;
    panStartX.current = panX.current;
  }

  function handleMouseMove(e) {
    if (!isButtonDown.current) return;
    if (Math.abs(e.clientX - dragStartX.current) > 4) {
      isDragging.current = true;
      panX.current = panStartX.current + (e.clientX - dragStartX.current);
    }
  }

  function handleMouseUp(e) {
    isButtonDown.current = false;
    if (!isDragging.current) {
      handleCanvasClick(e.clientX, e.clientY);
    } else {
      writeParams(sceneIdxRef.current, panX.current, selectedRef.current?.id || null);
    }
    isDragging.current = false;
  }

  function handleTouchStart(e) {
    dragStartX.current = e.touches[0].clientX;
    panStartX.current = panX.current;
    isDragging.current = false;
  }

  function handleTouchMove(e) {
    isDragging.current = true;
    panX.current = panStartX.current + (e.touches[0].clientX - dragStartX.current);
  }

  function handleTouchEnd(e) {
    if (!isDragging.current) {
      const t = e.changedTouches[0];
      handleCanvasClick(t.clientX, t.clientY);
    } else {
      writeParams(sceneIdxRef.current, panX.current, selectedRef.current?.id || null);
    }
    isDragging.current = false;
  }

  function handleCanvasClick(clientX, clientY) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const H = canvas.height / dpr;
    const groundY = H * 0.72;
    const personBaseY = groundY - 42;
    const localX = clientX - rect.left - panX.current;
    const localY = clientY - rect.top;

    let hit = null;
    for (const p of peopleRef.current) {
      const dx = localX - p.x;
      const dy = localY - personBaseY;
      if (Math.abs(dx) < 24 && dy > -55 && dy < 55) { hit = p; break; }
    }

    if (hit) openCareer(hit.career);
    else closeCareer();
  }

  async function handleSaveCareer(career) {
    if (!user || savedIds.has(career.id)) return;
    await supabase.from("saved_careers").insert({ user_id: user.id, career_id: career.id });
    setSavedIds(prev => new Set([...prev, career.id]));
  }

  async function handleKeywordClick(keyword) {
    closeCareer();
    const { data } = await supabase
      .from("careers")
      .select("primary_industry")
      .ilike("keywords", `%${keyword}%`)
      .in("primary_industry", SCENES.map(s => s.industryName))
      .limit(1);

    if (data?.[0]) {
      const targetIdx = SCENES.findIndex(s => s.industryName === data[0].primary_industry);
      if (targetIdx >= 0) {
        setFlashColor(SCENES[targetIdx].color);
        setTimeout(() => setFlashColor(null), 600);
        setTimeout(() => switchScene(targetIdx), 100);
      }
    }
  }

  function handleViewTimeline() {
    writeParams(sceneIdxRef.current, panX.current, selectedCareer?.id || null);
    onViewCareer(selectedCareer, SCENES[sceneIdxRef.current].color);
    setSelectedCareer(null);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const scene = SCENES[sceneIdx];

  return (
    <div style={{
      position: "relative", width: "100%", height: "100vh",
      background: scene.skyTop, overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {flashColor && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 200,
          background: flashColor + "55", pointerEvents: "none",
          transition: "opacity 0.5s ease-out",
        }} />
      )}

      <button onClick={onBack} style={{
        position: "absolute", top: 16, left: 16, zIndex: 20,
        background: "rgba(20,22,36,0.85)", border: "1px solid #3D3F55",
        borderRadius: 20, padding: "7px 15px", fontSize: 12, fontWeight: 600,
        color: "#8B8FA8", cursor: "pointer", backdropFilter: "blur(10px)",
      }}>← Back</button>

      <div style={{
        position: "absolute", top: 17, left: "50%", transform: "translateX(-50%)",
        zIndex: 20, fontSize: 13, fontWeight: 800, color: "#E0E8FF",
        letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
      }}>World Explorer</div>

      <div style={{
        position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)",
        zIndex: 20, display: "flex", gap: 6,
        background: "rgba(20,22,36,0.85)", border: "1px solid #3D3F55",
        borderRadius: 26, padding: "4px", backdropFilter: "blur(10px)",
      }}>
        {SCENES.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => switchScene(i)}
            style={{
              padding: "6px 16px", fontSize: 12, fontWeight: 600,
              borderRadius: 22, border: "none", cursor: "pointer",
              background: sceneIdx === i ? s.color : "transparent",
              color: sceneIdx === i ? "#fff" : "#8B8FA8",
              transition: "all 0.2s",
            }}
          >{s.label}</button>
        ))}
      </div>

      {!loading && careers.length > 4 && (
        <div style={{
          position: "absolute", bottom: selectedCareer ? "52vh" : 22,
          left: "50%", transform: "translateX(-50%)",
          zIndex: 20, fontSize: 11, color: "#4A4D6688", pointerEvents: "none",
          transition: "bottom 0.3s",
        }}>← drag to explore →</div>
      )}

      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging.current) {
            writeParams(sceneIdxRef.current, panX.current, selectedRef.current?.id || null);
          }
          isDragging.current = false;
          isButtonDown.current = false;
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          color: scene.accentColor, fontSize: 14, fontWeight: 600,
        }}>Loading {scene.label}…</div>
      )}

      {!loading && careers.length === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{ fontSize: 14, color: "#8B8FA8" }}>No careers found in this world yet</div>
        </div>
      )}

      {selectedCareer && (
        <CareerCardModal
          career={selectedCareer}
          sceneColor={scene.color}
          isSaved={savedIds.has(selectedCareer.id)}
          onSave={() => handleSaveCareer(selectedCareer)}
          onClose={closeCareer}
          onKeywordClick={handleKeywordClick}
          onViewTimeline={handleViewTimeline}
        />
      )}
    </div>
  );
}

// ─── Career card modal ────────────────────────────────────────────────────────

function CareerCardModal({ career, sceneColor, isSaved, onSave, onClose, onKeywordClick, onViewTimeline }) {
  const traits = career.traits || [];
  const keywords = career.keywords || [];

  function renderDescription(desc) {
    if (!desc || !keywords.length) return desc;
    const parts = [];
    let remaining = desc;
    const sortedKws = [...keywords].sort((a, b) => b.length - a.length);
    const used = new Set();

    while (remaining.length > 0) {
      let matched = false;
      for (const kw of sortedKws) {
        if (used.has(kw)) continue;
        const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
        if (idx === 0) {
          parts.push({ text: remaining.slice(0, kw.length), type: "keyword", kw });
          remaining = remaining.slice(kw.length);
          used.add(kw);
          matched = true;
          break;
        }
      }
      if (!matched) {
        let nearestIdx = remaining.length;
        for (const kw of sortedKws) {
          if (used.has(kw)) continue;
          const idx = remaining.toLowerCase().indexOf(kw.toLowerCase());
          if (idx > 0 && idx < nearestIdx) nearestIdx = idx;
        }
        parts.push({ text: remaining.slice(0, nearestIdx), type: "plain" });
        remaining = remaining.slice(nearestIdx);
      }
    }

    return parts.map((p, i) =>
      p.type === "keyword" ? (
        <span key={i} onClick={() => onKeywordClick(p.kw)} style={{
          color: sceneColor, textDecoration: "underline",
          textDecorationStyle: "dotted", fontWeight: 600, cursor: "pointer",
        }}>{p.text}</span>
      ) : <span key={i}>{p.text}</span>
    );
  }

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "#242840", borderTop: `2px solid ${sceneColor}`,
      borderRadius: "20px 20px 0 0", padding: "1.4rem 1.4rem 1.8rem",
      maxHeight: "58vh", overflowY: "auto",
      boxShadow: "0 -12px 48px rgba(0,0,0,0.7)",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div style={{ fontSize: 10, color: sceneColor, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
            {career.primary_industry}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#E0E8FF", lineHeight: 1.25 }}>{career.name}</div>
          {career.salary_range && (
            <div style={{ fontSize: 13, color: sceneColor, marginTop: 5, fontWeight: 600 }}>{career.salary_range}</div>
          )}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#4A4D66", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
      </div>

      {career.description && (
        <p style={{ fontSize: 14, color: "#8B8FA8", lineHeight: 1.75, marginBottom: 14 }}>
          {renderDescription(career.description)}
        </p>
      )}

      {traits.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "#4A4D66", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Traits</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {traits.map(t => (
              <span key={t} style={{
                background: sceneColor + "22", border: `1px solid ${sceneColor}55`,
                borderRadius: 20, padding: "3px 11px", fontSize: 11, fontWeight: 600, color: sceneColor,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {keywords.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: "#4A4D66", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
            Keywords — click to explore
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {keywords.slice(0, 10).map(k => (
              <span key={k} onClick={() => onKeywordClick(k)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = sceneColor; e.currentTarget.style.color = sceneColor; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#3D3F55"; e.currentTarget.style.color = "#8B8FA8"; }}
                style={{
                  background: "#1A1D2E", border: "1px solid #3D3F55",
                  borderRadius: 20, padding: "3px 11px", fontSize: 11,
                  fontWeight: 600, color: "#8B8FA8", cursor: "pointer", transition: "all 0.15s",
                }}
              >{k}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onViewTimeline} style={{
          flex: 1, padding: "0.8rem",
          background: `linear-gradient(135deg, ${sceneColor}, ${sceneColor}cc)`,
          color: "#fff", border: "none", borderRadius: 12,
          fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>View career path →</button>
        <button onClick={onSave} disabled={isSaved} style={{
          padding: "0.8rem 1rem",
          background: isSaved ? sceneColor + "22" : "#1A1D2E",
          color: isSaved ? sceneColor : "#8B8FA8",
          border: `1px solid ${isSaved ? sceneColor + "55" : "#3D3F55"}`,
          borderRadius: 12, fontSize: 14, fontWeight: 700,
          cursor: isSaved ? "default" : "pointer",
          transition: "all 0.2s", minWidth: 110,
        }}>{isSaved ? "✓ Echoed" : "+ Echo"}</button>
      </div>
    </div>
  );
}
