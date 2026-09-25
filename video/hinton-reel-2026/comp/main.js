/* Timeline controller (v2, 90 s): global grade, film FX, flashes, camera shake, HUD, captions.
   Exposes window.__ready (Promise) and window.__seek(t) (Promise; resolves once every clip frame is decoded). */
"use strict";

let LAND = { world: [], india: [] }, VOENV = [], TIMELINE = null;
const DURATION = 90.0;

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
  { a: 53.66, b: 56.83, text: "Only now, the camera is your imagination." },
];

const IMPACTS = [[1.1, 0.6], [17.5, 1.0], [20.62, 0.8], [23.55, 0.5], [31.45, 0.8], [32.5, 0.5], [38.9, 0.6], [39.75, 0.35], [40.1, 0.35], [40.45, 0.35], [40.8, 0.35], [46.43, 0.5], [49.88, 1.3], [69.58, 0.4], [71.5, 1.0], [80.5, 0.9], [81.75, 0.4]];
const FLASHES = [[1.1, 0.85, 0.28], [17.5, 0.6, 0.3], [20.62, 0.35, 0.2], [32.45, 0.3, 0.12], [46.43, 0.25, 0.3], [49.88, 1.0, 0.45], [71.5, 0.45, 0.25], [80.5, 0.8, 0.4]];

function era(t) {
  if (t < 12.05) return { f: "grayscale(1) contrast(1.14) sepia(.12)", fx: { grain: 0.2, dust: 1, flicker: 0.16 }, v: 0.8 };
  if (t < 13.3) return { f: "grayscale(.45) sepia(.35) contrast(1.06)", fx: { grain: 0.16, dust: 0.6, flicker: 0.08 }, v: 0.7 };
  if (t < 16.95) { const u = P(t, 13.3, 16.8); return { f: `grayscale(${lerp(0.4, 0, u).toFixed(3)}) sepia(${lerp(0.3, 0.05, u).toFixed(3)})`, fx: { grain: 0.14, dust: 0.4, flicker: 0.05 }, v: 0.65 }; }
  if (t < 17.5) return { f: "grayscale(.8) sepia(.35)", fx: { grain: 0.14, dust: 0.3, flicker: 0.03 }, v: 0.6 };
  if (t < 38.85) return { f: "saturate(1.14) contrast(1.05)", fx: { grain: 0.12, dust: 0.1, flicker: 0.02 }, v: 0.5 };
  if (t < 49.88) return { f: "saturate(.9)", fx: { grain: 0.1, dust: 0, flicker: 0 }, v: 0.55 };
  return { f: "none", fx: { grain: 0.06, dust: 0, flicker: 0 }, v: 0.4 };
}

function hudState(t) {
  if (t < 1.1 || (t >= 46.43 && t < 49.88) || t >= 67.65) return null;
  if (t < 9.62) return { y: 1913, c: "01 — SILENCE" };
  if (t < 13.3) return { y: lerp(1913, 1931, E.outC(P(t, 9.62, 10.1))), c: "02 — SOUND" };
  if (t < 16.95) return { y: lerp(1931, 1963, P(t, 13.45, 15.4)), c: "02 — SOUND" };
  if (t < 23.5) return { y: lerp(1963, 1975, E.outC(P(t, 17.5, 18.1))), c: "03 — STARDOM" };
  if (t < 30.0) { let y = 1972; STARS.forEach((s_, i) => { if (t >= WALL_T0 + i * WALL_STEP) y = s_[2]; }); return { y, c: "03 — STARDOM" }; }
  if (t < 36.7) return { y: 1985, c: "03 — STARDOM" };
  if (t < 38.85) { let y = 1956; CLIPS_NEWS.forEach((c, i) => { if (t >= 36.7 + i * 0.33) y = c[4]; }); return { y, c: "03 — STARDOM" }; }
  if (t < 46.43) return { y: "1913–2025", c: "04 — PERMISSION" };
  return { y: 2026, c: "05 — IMAGINATION" };
}

async function seek(t) {
  PENDING.length = 0;
  for (const s of SCENES) {
    const on = t >= s.a && t < s.b;
    show(s.root, on);
    if (on) s.update(s, t);
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
  let fl = 0;
  for (const [ti, a, d] of FLASHES) { const dt = t - ti; if (dt >= 0 && dt < d) fl = Math.max(fl, a * (1 - dt / d)); }
  if (t > 49.6 && t < 49.88) fl = Math.max(fl, E.inC(P(t, 49.6, 49.88)));
  st($("#flash"), { opacity: fl.toFixed(3) });
  st($("#fade"), { opacity: String(Math.max(1 - P(t, 0, 0.12), P(t, 89.75, 90.0) * 0)) });
  const h = hudState(t);
  HUD.update(t, h ? h.y : "", h ? h.c : "", h ? 1 : 0, false);
  CAP.update(t);
  await Promise.all(PENDING);
}

async function boot() {
  const [tl, env, land] = await Promise.all(["timeline.json", "vo_env.json", "land_dots.json"].map((f) => fetch(`assets/data/${f}`).then((r) => r.json())));
  TIMELINE = tl; VOENV = env; LAND = land;
  CLIPS = (window.MANIFEST && window.MANIFEST.clips) || {};
  const list = [...document.querySelectorAll("img")].map((i) => i.getAttribute("src")).filter(Boolean);
  ["milk.jpg", "audience.jpg", "billboard.jpg", "queue.jpg", "projector.jpg", "camera1913.jpg", "talkie1931.jpg", "dance1950.jpg", "scripts.jpg", "dreamer.jpg", "muskan_director.jpg", "muskan_front.jpg"].forEach((n) => list.push(img(n)));
  [...EXTRA].forEach((n) => list.push(img(n)));
  await preloadAll([...new Set(list)]);
  await document.fonts.load("100px Anton"); await document.fonts.load("100px 'DM Serif'"); await document.fonts.load("italic 100px 'DM Serif'");
  await document.fonts.load("italic 700 100px Playfair"); await document.fonts.load("900 100px Playfair"); await document.fonts.load("100px Elite");
  await document.fonts.load("600 30px 'Roboto Mono'"); await document.fonts.load("700 30px 'Roboto Mono'"); await document.fonts.load("300 30px Roboto"); await document.fonts.load("800 30px Roboto");
  for (const L of LANGS) await document.fonts.load("100px Indic", L.w);
  await document.fonts.ready;
  FX.init(); HUD.init(); CAP.init(CAPTIONS);
  await seek(0);
}
window.__ready = boot();
window.__seek = async (t) => { await seek(t); return true; };
window.__duration = DURATION;
