/* Timeline controller (v4, 83.6 s): global grade, film FX, flashes, camera shake, iris + film-burn transitions, HUD, captions.
   Exposes window.__ready (Promise) and window.__seek(t) (Promise; resolves once every clip frame is decoded and drawn). */
"use strict";

let LAND = { world: [], india: [] }, VOENV = [], TIMELINE = null;
const DURATION = 83.6;

const CAPTIONS = [
  { a: 3.37, b: 6.12, text: "A man in Bombay bet everything he had…" },
  { a: 9.77, b: 11.45, text: "Then, they learned to speak," },
  { a: 12.22, b: 12.7, text: "to sing," },
  { a: 17.86, b: 19.32, text: "We turned our heroes…" },
  { a: 30.36, b: 32.03, text: "Queued before sunrise," },
  { a: 35.27, b: 36.59, text: "threw coins at the screen." },
  { a: 39.36, b: 41.31, text: "But every dream needed permission." },
  { a: 42.54, b: 44.1, text: "For every film that got made," },
  { a: 44.67, b: 46.09, text: "a thousand never did." },
  { a: 53.51, b: 56.43, text: "Only now, the camera is your imagination." },
];

/* camera shake [t, amount] and white flashes [t, peak, decay s] — each sits on a musical hit */
const IMPACTS = [[1.1, 0.6], [17.63, 1.0], [20.62, 0.8], [23.26, 0.35], [31.72, 0.6], [32.47, 0.5], [38.9, 0.6], [39.75, 0.35], [40.1, 0.35], [40.45, 0.35], [40.8, 0.35], [46.4, 0.5], [49.88, 1.3], [68.12, 0.35], [76.12, 0.9]];
const FLASHES = [[1.1, 0.85, 0.28], [17.63, 0.5, 0.35], [20.62, 0.3, 0.2], [32.45, 0.25, 0.12], [46.4, 0.25, 0.3], [49.88, 1.0, 0.45], [76.12, 0.3, 0.35]];

function era(t) {
  if (t < 12.05) return { f: "grayscale(1) contrast(1.14) sepia(.12)", fx: { grain: 0.2, dust: 1, flicker: 0.16 }, v: 0.8 };
  if (t < 13.3) return { f: "grayscale(.45) sepia(.35) contrast(1.06)", fx: { grain: 0.16, dust: 0.6, flicker: 0.08 }, v: 0.7 };
  if (t < 17.16) { const u = P(t, 13.3, 17.1); return { f: `grayscale(${lerp(0.5, 0.2, u).toFixed(3)}) sepia(${lerp(0.35, 0.18, u).toFixed(3)})`, fx: { grain: 0.14, dust: 0.4, flicker: 0.05 }, v: 0.65 }; }
  if (t < 17.63) return { f: "saturate(1.14) contrast(1.05)", fx: { grain: 0.18, dust: 0.9, flicker: 0.14 }, v: 0.62 };  // the jam and the burn
  if (t < 38.85) return { f: "saturate(1.14) contrast(1.05)", fx: { grain: 0.12, dust: 0.1, flicker: 0.02 }, v: 0.5 };
  if (t < 49.88) return { f: "saturate(.9)", fx: { grain: 0.1, dust: 0, flicker: 0 }, v: 0.55 };
  return { f: "none", fx: { grain: 0.06, dust: 0, flicker: 0 }, v: 0.4 };
}

function hudState(t) {
  if (t < 1.1 || (t >= 23.22 && t < 30.08) || (t >= 46.4 && t < 49.88) || t >= 65.81) return null;
  if (t < 9.68) return { y: 1913, c: "01 — SILENCE" };
  if (t < 13.3) return { y: lerp(1913, 1931, E.outC(P(t, 9.75, 10.2))), c: "02 — SOUND" };
  if (t < 17.63) return { y: lerp(1931, 1963, P(t, 13.45, 15.4)), c: "02 — SOUND" };
  if (t < 23.22) return { y: lerp(1963, 1975, E.outC(P(t, 17.63, 18.2))), c: "03 — STARDOM" };
  if (t < 36.7) return { y: "70s–90s", c: "03 — STARDOM" };
  if (t < 38.85) { let y = 1956; CLIPS_NEWS.forEach((c, i) => { if (t >= 36.7 + i * 0.33) y = c[4]; }); return { y, c: "03 — STARDOM" }; }
  if (t < 46.4) return { y: "1913–2025", c: "04 — PERMISSION" };
  return { y: 2026, c: "05 — IMAGINATION" };
}

let IRIS_EL = null, BURN_CV = null, BURN_CTX = null;
/* the film burning through: blister, charred rim, burning edge, embers. S6 clips the matching hole out of itself. */
function drawBurn(t) {
  const c = BURN_CTX;
  if (t < BURN.blister || t >= BURN.t1) { if (BURN_CV.__on) { c.clearRect(0, 0, 1080, 1920); BURN_CV.__on = false; } return; }
  BURN_CV.__on = true;
  c.clearRect(0, 0, 1080, 1920);
  const { cx, cy } = BURN;
  if (t < BURN.t0 + 0.1) {
    const u = P(t, BURN.blister, BURN.t0 + 0.1), r = 24 + 190 * E.outQ(u);
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(255,248,220,${(0.95 * u).toFixed(3)})`); g.addColorStop(0.3, `rgba(255,170,60,${(0.85 * u).toFixed(3)})`);
    g.addColorStop(0.65, `rgba(110,40,8,${(0.6 * u).toFixed(3)})`); g.addColorStop(1, "rgba(40,12,2,0)");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 6.2832); c.fill();
  }
  const b = burnPoly(t); if (!b) return;
  const hole = new Path2D(polyD(b.pts));
  c.save();
  const outside = new Path2D(); outside.rect(0, 0, 1080, 1920); outside.addPath(hole);
  c.clip(outside, "evenodd");
  c.lineJoin = "round";
  c.strokeStyle = "rgba(20,6,1,.55)"; c.lineWidth = 160; c.stroke(hole);
  c.strokeStyle = "rgba(90,28,4,.8)"; c.lineWidth = 72; c.stroke(hole);
  c.restore();
  c.lineJoin = "round";
  c.shadowColor = "#ff7a00"; c.shadowBlur = 40; c.strokeStyle = "#ff5a0a"; c.lineWidth = 30; c.stroke(hole);
  c.shadowBlur = 18; c.strokeStyle = "#ffc46b"; c.lineWidth = 12; c.stroke(hole);
  c.shadowBlur = 0; c.strokeStyle = "#fffbe8"; c.lineWidth = 3.5; c.stroke(hole);
  const rr = rng(1763);
  for (let i = 0; i < 110; i++) {
    const a = rr() * 6.2832, tb = BURN.t0 + rr() * (BURN.t1 - BURN.t0 - 0.04), life = 0.25 + rr() * 0.3, v = 250 + rr() * 650, sz = 1.5 + rr() * 3, gc = 190 + Math.round(rr() * 60);
    const age = t - tb; if (age < 0 || age > life) continue;
    const ub = P(tb, BURN.t0, BURN.t1), Rb = 26 + 1900 * E.inC(ub) + 100 * ub;
    const x = cx + Math.cos(a) * (Rb + v * age), y = cy + Math.sin(a) * (Rb + v * age) - 180 * age * age;
    c.fillStyle = `rgba(255,${gc},90,${(1 - age / life).toFixed(2)})`;
    c.beginPath(); c.arc(x, y, sz, 0, 6.2832); c.fill();
  }
}

async function seek(t) {
  PENDING.length = 0;
  for (const s of SCENES) {
    s.on = t >= s.a && t < s.b;
    show(s.root, s.on);
    if (s.on) s.update(s, t);
  }
  const e = era(t);
  const flick = e.fx.flicker ? 1 + (hash(Math.round(t * FPS) * 3 + 1) - 0.5) * e.fx.flicker : 1;
  let shx = 0, shy = 0, rot = 0;
  for (const [ti, a] of IMPACTS) {
    const d = t - ti; if (d < 0 || d > 0.6) continue;
    const k = a * Math.exp(-d * 9);
    shx += noise1(t * 38, ti * 7) * 16 * k; shy += noise1(t * 41, ti * 11) * 16 * k; rot += noise1(t * 30, ti * 13) * 0.5 * k;
  }
  const weave = t < 12.05 ? noise1(t * 6, 77) * 2.5 : 0;
  st($("#world"), { filter: `brightness(${flick.toFixed(3)})`, "--grade": e.f, transform: `translate(${(shx + weave).toFixed(2)}px, ${(shy + weave * 0.6).toFixed(2)}px) rotate(${rot.toFixed(3)}deg)` });
  FX.draw(t, Object.assign({}, e.fx, { flicker: 0 }));
  st($("#vignette"), { background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(0,0,0,${e.v}) 100%)` });
  const ir = irisAt(t);
  st(IRIS_EL, { display: ir ? "block" : "none", background: ir ? `radial-gradient(circle at ${ir.cx}px ${ir.cy}px, rgba(0,0,0,0) ${ir.r.toFixed(1)}px, #000 ${(ir.r + 14).toFixed(1)}px)` : "none" });
  drawBurn(t);
  let fl = 0;
  for (const [ti, a, d] of FLASHES) { const dt = t - ti; if (dt >= 0 && dt < d) fl = Math.max(fl, a * (1 - dt / d)); }
  if (t > 49.6 && t < 49.88) fl = Math.max(fl, E.inC(P(t, 49.6, 49.88)));
  st($("#flash"), { opacity: fl.toFixed(3) });
  st($("#fade"), { opacity: String(1 - P(t, 0, 0.12)) });
  const h = hudState(t);
  HUD.update(t, h ? h.y : "", h ? h.c : "", h ? 1 : 0, false);
  CAP.update(t);
  await Promise.all(PENDING);
  for (const s of SCENES) if (s.on && s.post) s.post(s, t);
}

async function boot() {
  const [tl, env, land] = await Promise.all(["timeline.json", "vo_env.json", "land_dots.json"].map((f) => fetch(`assets/data/${f}`).then((r) => r.json())));
  TIMELINE = tl; VOENV = env; LAND = land;
  CLIPS = (window.MANIFEST && window.MANIFEST.clips) || {};
  IRIS_EL = $("#iris"); BURN_CV = $("#burn"); BURN_CTX = BURN_CV.getContext("2d");
  const list = [...document.querySelectorAll("img")].map((i) => i.getAttribute("src")).filter(Boolean);
  list.push("assets/img/h-mask.svg");
  [...EXTRA].forEach((n) => list.push(img(n)));
  await preloadAll([...new Set(list)]);
  await document.fonts.load("100px Anton"); await document.fonts.load("100px 'DM Serif'"); await document.fonts.load("italic 100px 'DM Serif'");
  await document.fonts.load("italic 700 100px Playfair"); await document.fonts.load("900 100px Playfair"); await document.fonts.load("100px Elite");
  await document.fonts.load("500 100px Oswald");
  await document.fonts.load("600 30px 'Roboto Mono'"); await document.fonts.load("700 30px 'Roboto Mono'"); await document.fonts.load("300 30px Roboto"); await document.fonts.load("800 30px Roboto");
  for (const L of LANGS) await document.fonts.load("100px Indic", L.w);
  for (const L of LINES) await document.fonts.load("34px Indic", L.n);
  await document.fonts.ready;
  FX.init(); HUD.init(); CAP.init(CAPTIONS);
  await seek(0);
}
window.__ready = boot();
window.__seek = async (t) => { await seek(t); return true; };
window.__duration = DURATION;
