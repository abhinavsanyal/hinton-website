/* Timeline controller: global grade, film FX, flashes, camera shake, HUD, captions.
   Exposes window.__ready (Promise) and window.__seek(t) for the frame renderer. */
"use strict";

let LAND = { world: [], india: [] }, VOENV = [], TIMELINE = null;
const DURATION = 59.87;

const CAPTIONS = [
  { a: 3.01, b: 5.84, text: "A man in Bombay bet everything he had…" },
  { a: 8.65, b: 10.55, text: "Then, they learned to speak," },
  { a: 10.9, b: 11.73, text: "to sing," },
  { a: 14.69, b: 17.63, text: "We turned our heroes into <b>gods</b>," },
  { a: 18.03, b: 19.78, text: "queued before sunrise," },
  { a: 21.47, b: 23.03, text: "threw coins at the screen." },
  { a: 23.78, b: 25.96, text: "But every dream needed permission." },
  { a: 26.41, b: 28.29, text: "For every film that got made," },
  { a: 28.64, b: 30.27, text: "a thousand never did." },
];

const IMPACTS = [[0.95, 0.6], [15.0, 1.0], [18.85, 0.8], [19.88, 0.5], [23.59, 0.6], [24.05, 0.4], [24.5, 0.4], [24.95, 0.4], [31.12, 0.5], [34.57, 1.3], [48.33, 0.6], [49.06, 0.35], [50.82, 0.35], [57.95, 0.8]];
const FLASHES = [[0.95, 0.85, 0.28], [15.0, 0.6, 0.3], [19.85, 0.3, 0.12], [31.12, 0.25, 0.3], [34.57, 1.0, 0.45], [47.0, 0.55, 0.3], [48.33, 0.3, 0.25], [57.95, 0.7, 0.35]];

function era(t) {
  // returns grade filter, fx params, vignette
  if (t < 10.7) return { f: "grayscale(1) contrast(1.14) sepia(.12)", fx: { grain: 0.2, dust: 1, flicker: 0.16 }, v: 0.8 };
  if (t < 11.95) return { f: "grayscale(.45) sepia(.35) contrast(1.06)", fx: { grain: 0.16, dust: 0.6, flicker: 0.08 }, v: 0.7 };
  if (t < 14.55) { const u = P(t, 11.95, 14.4); return { f: `grayscale(${lerp(0.4, 0, u).toFixed(3)}) sepia(${lerp(0.3, 0.05, u).toFixed(3)})`, fx: { grain: 0.14, dust: 0.4, flicker: 0.05 }, v: 0.65 }; }
  if (t < 15.0) return { f: "grayscale(.75) sepia(.3)", fx: { grain: 0.14, dust: 0.3, flicker: 0.03 }, v: 0.6 };
  if (t < 23.55) return { f: "saturate(1.12) contrast(1.04)", fx: { grain: 0.12, dust: 0.12, flicker: 0.02 }, v: 0.5 };
  if (t < 34.57) return { f: "saturate(.92)", fx: { grain: 0.1, dust: 0, flicker: 0 }, v: 0.55 };
  return { f: "none", fx: { grain: 0.07, dust: 0, flicker: 0 }, v: 0.4 };
}

function hudState(t) {
  if (t < 0.95 || (t >= 31.1 && t < 34.57) || t >= 47.0) return null;
  if (t < 8.45) return { y: 1913, c: "01 — SILENCE" };
  if (t < 11.95) return { y: lerp(1913, 1931, E.outC(P(t, 8.45, 8.95))), c: "02 — SOUND" };
  if (t < 14.5) return { y: lerp(1931, 1963, P(t, 12.05, 13.95)), c: "02 — SOUND" };
  if (t < 21.35) return { y: lerp(1963, 1975, E.outC(P(t, 14.5, 15.1))), c: "03 — STARDOM", dark: t < 18.0 };
  if (t < 23.55) { let y = 1975; CLIPS.forEach((c, i) => { if (t >= 21.8 + i * 0.27) y = c[4]; }); return { y, c: "03 — STARDOM" }; }
  if (t < 31.1) return { y: "1913–2025", c: "04 — PERMISSION" };
  return { y: 2026, c: "05 — IMAGINATION" };
}

function seek(t) {
  // scenes
  for (const s of SCENES) {
    const on = t >= s.a && t < s.b;
    show(s.root, on);
    if (on) s.update(s, t);
  }
  // grade + flicker
  const e = era(t);
  const flick = e.fx.flicker ? 1 + (hash(Math.round(t * FPS) * 3 + 1) - 0.5) * e.fx.flicker : 1;
  let shx = 0, shy = 0, rot = 0;
  for (const [ti, a] of IMPACTS) {
    const d = t - ti; if (d < 0 || d > 0.6) continue;
    const k = a * Math.exp(-d * 9);
    shx += noise1(t * 38, ti * 7) * 16 * k; shy += noise1(t * 41, ti * 11) * 16 * k; rot += noise1(t * 30, ti * 13) * 0.5 * k;
  }
  const weave = t < 10.7 ? noise1(t * 6, 77) * 2.5 : 0;
  st($("#world"), { filter: `brightness(${flick.toFixed(3)})`, "--grade": e.f, transform: `translate(${(shx + weave).toFixed(2)}px, ${(shy + weave * 0.6).toFixed(2)}px) rotate(${rot.toFixed(3)}deg)` });
  FX.draw(t, Object.assign({}, e.fx, { flicker: 0 }));
  st($("#vignette"), { background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(0,0,0,${e.v}) 100%)` });
  // flashes
  let fl = 0;
  for (const [ti, a, d] of FLASHES) { const dt = t - ti; if (dt >= 0 && dt < d) fl = Math.max(fl, a * (1 - dt / d)); }
  if (t > 34.3 && t < 34.57) fl = Math.max(fl, E.inC(P(t, 34.3, 34.57)));
  st($("#flash"), { opacity: fl.toFixed(3) });
  st($("#fade"), { opacity: String(1 - P(t, 0, 0.12)) });
  // HUD + captions
  const h = hudState(t);
  HUD.update(t, h ? h.y : "", h ? h.c : "", h ? 1 : 0, h && h.dark);
  CAP.update(t);
}

async function boot() {
  const [tl, env, land] = await Promise.all(["timeline.json", "vo_env.json", "land_dots.json"].map((f) => fetch(`assets/data/${f}`).then((r) => r.json())));
  TIMELINE = tl; VOENV = env; LAND = land;
  const list = [...document.querySelectorAll("img")].map((i) => i.getAttribute("src")).filter(Boolean);
  for (let i = 1; i <= 107; i++) list.push(`assets/sting/s${String(i).padStart(3, "0")}.jpg`);
  await preloadAll([...new Set(list)]);
  await document.fonts.load("100px Anton"); await document.fonts.load("100px 'DM Serif'"); await document.fonts.load("italic 100px 'DM Serif'");
  await document.fonts.load("italic 700 100px Playfair"); await document.fonts.load("900 100px Playfair"); await document.fonts.load("100px Elite");
  await document.fonts.load("600 30px 'Roboto Mono'"); await document.fonts.load("700 30px 'Roboto Mono'"); await document.fonts.load("300 30px Roboto"); await document.fonts.load("800 30px Roboto");
  for (const L of LANGS) await document.fonts.load("100px Indic", L.w);
  await document.fonts.ready;
  FX.init(); HUD.init(); CAP.init(CAPTIONS);
  seek(0);
}
window.__ready = boot();
window.__seek = (t) => { seek(t); return true; };
window.__duration = DURATION;
