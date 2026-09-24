/* Hinton Studios — "Dream in 4K" reel. Scene graph.
   Global times (s) come from the locked VO timeline (assets/data/timeline.json). */
"use strict";

const SCENES = [];
function scene(a, b, build, update) {
  const root = mk("div", { cls: "scene" }, $("#world"));
  const s = { a, b, root, update };
  build(s, root);
  SCENES.push(s);
  return s;
}
function printEl(parent, src, x, y, w, h, opts = {}) {
  const p = mk("div", { cls: "print", style: { left: x + "px", top: y + "px", width: w + "px", height: h + "px", padding: (opts.pad ?? 16) + "px", background: opts.border || "var(--cream)" } }, parent);
  const inner = mk("div", { cls: "inner" }, p);
  const im = mk("img", { src: img(src) }, inner);
  if (opts.pos) im.style.objectPosition = opts.pos;
  return { p, inner, im };
}
function svgOver(parent, w = 1080, h = 1920) {
  return mk("svg", { cls: "ov", attrs: { viewBox: `0 0 ${w} ${h}`, width: w, height: h }, style: { width: w + "px", height: h + "px" } }, parent);
}
function stroke(svg, d, color = "#e11d48", width = 7, extra = {}) {
  return mk("path", { attrs: Object.assign({ d, fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round" }, extra) }, svg);
}
/* A clipping of an (invented-masthead) newspaper, headlines are historical facts */
function clipping(parent, mast, date, head, sub, x, y, w) {
  const c = mk("div", { cls: "clip", style: { left: x + "px", top: y + "px", width: w + "px" } }, parent);
  mk("div", { cls: "mast", html: `<span>${mast}</span><span>${date}</span>` }, c);
  mk("div", { cls: "head", html: head }, c);
  if (sub) mk("div", { cls: "sub", html: sub }, c);
  mk("div", { cls: "cols" }, c);
  return c;
}
function stamp(parent, text, x, y, size = 120, color = "#c8102e") {
  return mk("div", { cls: "abs anton", text, style: { left: x + "px", top: y + "px", fontSize: size + "px", color, border: `10px double ${color}`, padding: "4px 28px 0", lineHeight: "1.1", opacity: "0", mixBlendMode: "multiply", letterSpacing: ".04em" } }, parent);
}
/* spring-in helper: returns {s, o} for a pop starting at t0 */
function pop(t, t0, f = 2.6, z = 0.45) { const k = sp(t, t0, f, z); return { k, o: clamp((t - t0) / 0.08) }; }

/* ============ S0 — Film leader countdown (0 – 0.95) ============ */
scene(0, 0.98, (s, r) => {
  st(r, { background: "#1b1a18" });
  s.ring = mk("div", { cls: "abs", style: { left: "140px", top: "460px", width: "800px", height: "800px", borderRadius: "50%", background: "#8d8a84" } }, r);
  s.sweep = mk("div", { cls: "abs", style: { left: "140px", top: "460px", width: "800px", height: "800px", borderRadius: "50%" } }, r);
  const sv = svgOver(r);
  mk("circle", { attrs: { cx: 540, cy: 860, r: 390, fill: "none", stroke: "#e8e4dc", "stroke-width": 6 } }, sv);
  mk("circle", { attrs: { cx: 540, cy: 860, r: 330, fill: "none", stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  mk("line", { attrs: { x1: 40, y1: 860, x2: 1040, y2: 860, stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  mk("line", { attrs: { x1: 540, y1: 330, x2: 540, y2: 1390, stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  s.num = mk("div", { cls: "abs center-x", style: { top: "610px", fontFamily: "DM Serif", fontSize: "460px", lineHeight: "500px", color: "#111" } }, r);
}, (s, t) => {
  const n = t < 0.32 ? 3 : t < 0.64 ? 2 : 1;
  const ph = ((t % 0.32) / 0.32) * 360;
  s.num.textContent = n;
  st(s.sweep, { background: `conic-gradient(from 0deg, rgba(20,20,20,.55) 0deg ${ph.toFixed(1)}deg, transparent ${ph.toFixed(1)}deg)` });
  const wob = noise1(t * 20, 2) * 4;
  st(s.root, { transform: `translate(${wob}px, ${noise1(t * 18, 5) * 5}px)` });
});

/* ============ S1 — 1913 (0.95 – 3.05) ============ */
scene(0.95, 3.1, (s, r) => {
  st(r, { background: "#0d0c0b" });
  s.bg = mk("img", { src: img("projector.jpg"), cls: "abs", style: { left: "-60px", top: "-80px", width: "1200px", height: "2133px", objectFit: "cover", opacity: ".55" } }, r);
  s.year = mk("div", { cls: "abs center-x", style: { top: "560px", fontFamily: "DM Serif", fontSize: "360px", lineHeight: "1", color: "#f3ecdc", textShadow: "0 0 60px rgba(255,240,210,.25)" } }, r);
  s.yl = letters(s.year, "1913");
  s.rule = mk("div", { cls: "abs", style: { left: "240px", width: "600px", top: "950px", height: "3px", background: "#f3ecdc", transformOrigin: "50% 50%" } }, r);
  s.sub = mk("div", { cls: "abs center-x elite", style: { top: "985px", fontSize: "44px", letterSpacing: ".18em", color: "#f3ecdc" } }, r);
  s.subText = "BOMBAY · 3 MAY";
}, (s, t) => {
  const lt = t - 0.95;
  st(s.bg, { transform: `scale(${1.05 + lt * 0.05}) translateY(${-lt * 12}px)` });
  s.yl.forEach((el, i) => {
    const k = sp(t, 0.95 + i * 0.07, 2.4, 0.55);
    st(el, { transform: `translateY(${(1 - k) * 120}px) scale(${lerp(1.6, 1, k)})`, opacity: String(clamp((t - 0.95 - i * 0.07) / 0.1)), filter: `blur(${Math.max(0, (1 - k) * 14).toFixed(1)}px)` });
  });
  st(s.rule, { transform: `scaleX(${E.outE(P(t, 1.35, 1.9))})` });
  const n = Math.floor(P(t, 1.55, 2.35) * s.subText.length);
  const txt = s.subText.slice(0, n);
  if (s.sub.textContent !== txt) s.sub.textContent = txt;
  st(s.root, { opacity: String(1 - P(t, 2.95, 3.1)) });
});

/* ============ S2 — The man, the camera, the headline (3.0 – 6.2) ============ */
scene(3.0, 6.25, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 40%, #2a2724 0%, #121110 70%)" });
  s.pr = printEl(r, "camera1913.jpg", 150, 360, 780, 1040);
  const sv = svgOver(s.pr.inner, 748, 1008);
  s.circ = stroke(sv, wobblyEllipse(262, 345, 150, 150, 7), "#e11d48", 8);
  s.arr = stroke(sv, arrowPath(640, 160, 420, 290, -0.25), "#e11d48", 7);
  s.arrH = stroke(sv, arrowHead(640, 160, 420, 290, -0.25), "#e11d48", 7);
  s.lab = mk("div", { cls: "label red", text: "Hand-cranked camera", style: { left: "520px", top: "420px" } }, r);
  s.clip = clipping(r, "The Picture Herald", "May 1913", "Raja<br>Harishchandra", "India's first full-length feature film opens at the Coronation Cinematograph, Bombay.", 330, 1040, 660);
  s.lab2 = mk("div", { cls: "label paper", text: "Dadasaheb Phalke · the father of Indian cinema", style: { left: "90px", top: "1000px", fontSize: "22px" } }, r);
}, (s, t) => {
  const k = sp(t, 3.0, 1.9, 0.62);
  st(s.pr.p, { transform: tf(0, (1 - k) * 1300, 1, lerp(8, -2.5, k)) });
  st(s.pr.im, { transform: `scale(${1.04 + (t - 3) * 0.035})` });
  drawOn(s.circ, E.outC(P(t, 3.75, 4.3)));
  drawOn(s.arr, E.outC(P(t, 3.95, 4.3))); drawOn(s.arrH, E.outC(P(t, 4.25, 4.4)));
  const l = pop(t, 4.05, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), -2.5) });
  const c = sp(t, 4.45, 2.1, 0.6);
  st(s.clip, { transform: tf((1 - c) * 900, 0, 1, lerp(14, 3.5, c)), opacity: String(clamp((t - 4.45) / 0.1)) });
  const l2 = pop(t, 5.0, 3, 0.55);
  st(s.lab2, { opacity: String(l2.o), transform: tf((1 - l2.k) * -40, 0, 1, -3) });
  // whip out
  const w = E.inE(P(t, 6.0, 6.25));
  st(s.root, { transform: `translateY(${-w * 1400}px)`, filter: `blur(${(w * 18).toFixed(1)}px)` });
});

/* ============ S3 — Pictures that move: filmstrip + intertitle (6.15 – 8.5) ============ */
scene(6.1, 8.55, (s, r) => {
  st(r, { background: "#0c0b0a" });
  s.strip = mk("div", { cls: "abs", style: { left: "250px", top: "0", width: "580px", height: "5200px", background: "#0a0908" } }, r);
  const holes = "repeating-linear-gradient(180deg, transparent 0 22px, #d9d2c2 22px 52px, transparent 52px 74px)";
  mk("div", { cls: "abs", style: { left: "14px", top: "0", width: "30px", height: "100%", background: holes, borderRadius: "4px" } }, s.strip);
  mk("div", { cls: "abs", style: { right: "14px", top: "0", width: "30px", height: "100%", background: holes, borderRadius: "4px" } }, s.strip);
  const srcs = ["camera1913.jpg", "talkie1931.jpg", "camera1913.jpg", "projector.jpg", "camera1913.jpg", "dance1950.jpg", "camera1913.jpg", "talkie1931.jpg"];
  s.frames = [];
  for (let i = 0; i < 14; i++) {
    const f = mk("div", { cls: "abs", style: { left: "62px", top: 20 + i * 370 + "px", width: "456px", height: "340px", overflow: "hidden", background: "#222" } }, s.strip);
    const im = mk("img", { src: img(srcs[i % srcs.length]), cls: "cover", style: { filter: "grayscale(1) contrast(1.1)", objectPosition: `${30 + (i % 5) * 9}% ${35 + (i % 3) * 8}%` } }, f);
    s.frames.push(im);
  }
  s.card = mk("div", { cls: "abs", style: { left: "110px", top: "610px", width: "860px", height: "560px", background: "#080808", border: "3px solid #e9e1cf", outline: "1px solid #e9e1cf", outlineOffset: "-22px", boxShadow: "0 40px 90px rgba(0,0,0,.8)" } }, r);
  mk("div", { cls: "abs center-x", html: "❦", style: { top: "56px", fontSize: "54px", color: "#e9e1cf", fontFamily: "Playfair" } }, s.card);
  s.cardT = mk("div", { cls: "abs center-x", html: "Pictures<br>that move.", style: { top: "140px", fontFamily: "Playfair", fontStyle: "italic", fontWeight: "700", fontSize: "116px", lineHeight: "1.02", color: "#f1eadb" } }, s.card);
  mk("div", { cls: "abs center-x elite", text: "— INTERTITLE, 1913 —", style: { bottom: "54px", fontSize: "24px", letterSpacing: ".3em", color: "#b9b1a0" } }, s.card);
}, (s, t) => {
  const lt = t - 6.1;
  const y = -((lt * 1650) % 740) - 300 + noise1(t * 14, 9) * 5;
  st(s.strip, { transform: `translate(${noise1(t * 10, 4) * 4}px, ${y}px)` });
  const k = sp(t, 6.3, 2.2, 0.5);
  st(s.card, { transform: tf(0, 0, lerp(1.35, 1, k), lerp(-4, 0, k)), opacity: String(clamp((t - 6.3) / 0.08)) });
  const w = E.inE(P(t, 8.3, 8.55));
  st(s.root, { transform: `translateX(${-w * 1300}px)`, filter: `blur(${(w * 16).toFixed(1)}px)` });
});

/* ============ S4 — 1931: they learned to speak (8.45 – 10.8) ============ */
scene(8.34, 10.85, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 45%, #2b2825 0%, #0f0e0d 75%)" });
  s.pr = printEl(r, "talkie1931.jpg", 130, 390, 820, 1093, { pad: 0 });
  const sv = svgOver(s.pr.inner, 820, 1093);
  s.circ = stroke(sv, wobblyEllipse(366, 425, 100, 140, 12), "#e11d48", 8);
  s.lab = mk("div", { cls: "label red", text: "Alam Ara · 1931", style: { left: "560px", top: "400px" } }, r);
  s.lab2 = mk("div", { cls: "label", text: "India's first talkie", style: { left: "560px", top: "462px" } }, r);
  s.banner = mk("div", { cls: "abs anton", html: "100% Talking!", style: { left: "110px", top: "1150px", fontSize: "112px", color: "#0b0a09", background: "#f1eadb", padding: "6px 34px 0", boxShadow: "0 16px 30px rgba(0,0,0,.5)" } }, r);
  s.wave = mk("canvas", { attrs: { width: 1080, height: 260 }, cls: "abs", style: { left: "0", top: "930px", width: "1080px", height: "260px" } }, r);
  s.wctx = s.wave.getContext("2d");
}, (s, t) => {
  const k = sp(t, 8.36, 2.0, 0.6);
  st(s.pr.p, { transform: tf((1 - k) * 1200, 0, 1, lerp(10, 2, k)) });
  st(s.pr.im, { transform: `scale(${1.02 + (t - 8.45) * 0.03})` });
  drawOn(s.circ, E.outC(P(t, 8.95, 9.45)));
  const l = pop(t, 9.1, 3, 0.5), l2 = pop(t, 9.25, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), 2) });
  st(s.lab2, { opacity: String(l2.o), transform: tf(0, 0, lerp(0.6, 1, l2.k), 2) });
  const b = sp(t, 9.55, 2.8, 0.42);
  st(s.banner, { opacity: String(clamp((t - 9.55) / 0.06)), transform: tf(0, 0, lerp(1.9, 1, b), -4) });
  // voice waveform
  const c = s.wctx; c.clearRect(0, 0, 1080, 260);
  const fr = Math.round(t * FPS), env = VOENV;
  c.lineWidth = 5; c.strokeStyle = "#f6f0e2"; c.shadowColor = "rgba(255,240,210,.8)"; c.shadowBlur = 16;
  c.beginPath();
  const reveal = E.outC(P(t, 8.5, 9.0));
  for (let x = 0; x <= 1080 * reveal; x += 4) {
    const idx = fr - Math.round((1080 - x) / 36);
    const a = (env[idx] || 0) * 110;
    const y = 130 + Math.sin(x * 0.09 + t * 30) * a * Math.sin(x * 0.013 + t * 3);
    x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
  }
  c.stroke();
  const w = E.inE(P(t, 10.65, 10.85));
  st(s.root, { transform: `translateX(${-w * 1300}px)`, filter: `blur(${(w * 16).toFixed(1)}px)` });
});

/* ============ S5 — To sing (10.75 – 12.0) ============ */
scene(10.7, 12.05, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 45%, #3a2e28 0%, #140f0d 75%)" });
  s.pr = printEl(r, "dance1950.jpg", 120, 330, 840, 1120, { pad: 0 });
  s.lab = mk("div", { cls: "label paper", text: "Every film · a musical", style: { left: "150px", top: "1310px" } }, r);
}, (s, t) => {
  const k = sp(t, 10.75, 2.0, 0.6);
  st(s.pr.p, { transform: tf((1 - k) * 1200, 0, lerp(1, 1, k), lerp(9, -1.5, k)) });
  st(s.pr.im, { transform: `scale(${1.03 + (t - 10.75) * 0.06}) rotate(${(t - 10.75) * 0.6}deg)` });
  const l = pop(t, 11.05, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), -2) });
  const w = E.inE(P(t, 11.85, 12.05));
  st(s.root, { transform: `scale(${1 + w * 0.6})`, opacity: String(1 - w), filter: `blur(${(w * 20).toFixed(1)}px)` });
});

/* ============ S6 — Every language we dream in (11.95 – 14.6) ============ */
const LANGS = [
  { w: "বাংলা", en: "Bengali", film: "Jamai Sasthi", y: 1931, lat: 22.57, lon: 88.36, c: "#ffb000" },
  { w: "தமிழ்", en: "Tamil", film: "Kalidas", y: 1931, lat: 13.08, lon: 80.27, c: "#ff5a36" },
  { w: "తెలుగు", en: "Telugu", film: "Bhakta Prahlada", y: 1932, lat: 17.39, lon: 78.49, c: "#ffd23f" },
  { w: "मराठी", en: "Marathi", film: "Ayodhyecha Raja", y: 1932, lat: 16.7, lon: 74.24, c: "#ff8a00" },
  { w: "ಕನ್ನಡ", en: "Kannada", film: "Sati Sulochana", y: 1934, lat: 12.97, lon: 77.59, c: "#e11d48" },
  { w: "മലയാളം", en: "Malayalam", film: "Balan", y: 1938, lat: 9.93, lon: 76.27, c: "#2ec4b6" },
  { w: "भोजपुरी", en: "Bhojpuri", film: "Ganga Maiyya Tohe Piyari Chadhaibo", y: 1963, lat: 25.59, lon: 85.14, c: "#ff6fb5" },
  { w: "हिन्दी", en: "Hindi", film: "Alam Ara", y: 1931, lat: 19.08, lon: 72.88, c: "#ffffff" },
];
const MAPX = (lon) => 90 + (lon - 66) * 28.125, MAPY = (lat) => 300 + (37 - lat) * 28.125;
scene(11.9, 14.62, (s, r) => {
  st(r, { background: "#100f0e" });
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.word = mk("div", { cls: "abs center-x", style: { top: "1150px", fontFamily: "Indic", fontSize: "132px", lineHeight: "1.2", color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,.9)" } }, r);
  s.desc = mk("div", { cls: "abs center-x mono", style: { top: "1340px", fontSize: "25px", fontWeight: "600", letterSpacing: ".14em", color: "#f6f0e2", textTransform: "uppercase" } }, r);
  s.title = mk("div", { cls: "abs center-x serif", html: "Every language<br>we dream in", style: { top: "360px", fontSize: "80px", lineHeight: "1", color: "#f6f0e2", opacity: "0" } }, r);
}, (s, t) => {
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const dots = LAND.india, reveal = E.outC(P(t, 11.95, 12.5));
  c.fillStyle = "rgba(246,240,226,0.28)";
  for (let i = 0; i < dots.length; i++) {
    const [lo, la] = dots[i]; const x = MAPX(lo), y = MAPY(la);
    if (hash(i) > reveal) continue;
    c.beginPath(); c.arc(x, y, 4.2, 0, 6.2832); c.fill();
  }
  const step = 0.235, t0 = 12.05;
  let cur = -1;
  LANGS.forEach((L, i) => {
    const ti = t0 + i * step; if (t < ti) return; cur = i;
    const x = MAPX(L.lon), y = MAPY(L.lat), k = spring(t - ti, 3, 0.4);
    c.fillStyle = L.c; c.globalAlpha = 0.25 * clamp(1 - (t - ti) / 0.6);
    c.beginPath(); c.arc(x, y, 20 + (t - ti) * 120, 0, 6.2832); c.fill(); c.globalAlpha = 1;
    c.beginPath(); c.arc(x, y, 13 * k, 0, 6.2832); c.fill();
    c.strokeStyle = "#0b0a09"; c.lineWidth = 3; c.stroke();
    c.font = "600 22px 'Roboto Mono'"; c.fillStyle = L.c; c.globalAlpha = clamp((t - ti) / 0.1);
    const lx = x + (L.lon > 80 ? 22 : -22), al = L.lon > 80 ? "left" : "right";
    c.textAlign = al; c.fillText(L.en.toUpperCase(), lx, y + 8); c.globalAlpha = 1;
  });
  if (cur >= 0) {
    const L = LANGS[cur];
    if (s.word.textContent !== L.w) { s.word.textContent = L.w; s.desc.textContent = `${L.en} · ${L.film} · ${L.y}`; }
    const ti = t0 + cur * step, k = spring(t - ti, 3.2, 0.5);
    st(s.word, { color: L.c, transform: `translateY(${(1 - k) * 60}px) scale(${lerp(1.25, 1, k)})`, opacity: String(clamp((t - ti) / 0.05)) });
    st(s.desc, { opacity: String(clamp((t - ti - 0.03) / 0.06)) });
  }
  const tk = sp(t, 12.1, 2.2, 0.7);
  st(s.title, { opacity: String(clamp((t - 12.1) / 0.2)), transform: `translateY(${(1 - tk) * 30}px)` });
  const w = E.inE(P(t, 14.42, 14.62));
  st(s.root, { transform: `scale(${1 - w * 0.25})`, opacity: String(1 - w) });
});

/* ============ S7 — Heroes into gods (14.5 – 18.0) ============ */
const LEGENDS = [
  "Dadasaheb Phalke · Satyajit Ray · Ritwik Ghatak · Guru Dutt · Bimal Roy · V. Shantaram · Mrinal Sen · K. Balachander · Adoor Gopalakrishnan · Mani Ratnam · Shyam Benegal · S. S. Rajamouli ·",
  "M. G. Ramachandran · Sivaji Ganesan · N. T. Rama Rao · Dr. Rajkumar · Prem Nazir · Uttam Kumar · Suchitra Sen · Rajinikanth · Kamal Haasan · Chiranjeevi · Mammootty · Mohanlal · Kunal Singh ·",
  "Raj Kapoor · Dilip Kumar · Dev Anand · Nargis · Madhubala · Meena Kumari · Waheeda Rehman · Rajesh Khanna · Amitabh Bachchan · Sridevi · Rekha · Shah Rukh Khan ·",
  "Lata Mangeshkar · Mohammed Rafi · Kishore Kumar · Asha Bhosle · R. D. Burman · Ilaiyaraaja · S. P. Balasubrahmanyam · K. J. Yesudas · A. R. Rahman ·",
];
scene(14.5, 18.02, (s, r) => {
  st(r, { background: "#7a0b12" });
  s.rays = mk("div", { cls: "abs", style: { left: "-900px", top: "-700px", width: "2880px", height: "2880px", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, #ff9d00 0deg 7deg, #e0461a 7deg 15deg)" } }, r);
  s.glow = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 50% 42%, rgba(255,230,160,.85) 0%, rgba(255,160,40,.25) 28%, rgba(90,5,10,.75) 75%)" } }, r);
  s.rows = LEGENDS.map((txt, i) => mk("div", { cls: "abs anton", text: (txt + " ").repeat(3), style: { left: "0", top: [362, 450, 1520, 1608][i] + "px", fontSize: "70px", lineHeight: "84px", whiteSpace: "nowrap", color: i % 2 ? "#3d0306" : "#fff3d6", opacity: ".9" } }, r));
  s.bb = printEl(r, "billboard.jpg", 50, 500, 520, 693);
  s.milk = printEl(r, "milk.jpg", 400, 470, 620, 827);
  s.lab = mk("div", { cls: "label paper", text: "1970s–90s · the age of the superstar", style: { left: "70px", top: "1320px" } }, r);
  s.gods = mk("div", { cls: "abs center-x anton", text: "Gods.", style: { top: "960px", fontSize: "330px", lineHeight: "1", color: "#ffd65a", textShadow: "0 0 50px rgba(255,190,40,.9), 0 14px 0 #5a0808, 0 20px 40px rgba(0,0,0,.6)", opacity: "0" } }, r);
}, (s, t) => {
  const lt = t - 14.5;
  st(s.rays, { transform: `rotate(${lt * 9}deg)` });
  s.rows.forEach((el, i) => st(el, { transform: `translateX(${(i % 2 ? -1 : 1) * (lt * 190) - (i % 2 ? 400 : 2200)}px)` }));
  const k1 = sp(t, 14.55, 2.0, 0.6), k2 = sp(t, 14.68, 2.0, 0.55);
  st(s.bb.p, { transform: tf((1 - k1) * -900, 0, 1, lerp(-20, -6, k1)) });
  st(s.milk.p, { transform: tf((1 - k2) * 1000, 0, 1 + 0.05 * E.outE(P(t, 16.67, 17.2)), lerp(18, 4, k2)) });
  st(s.milk.im, { transform: `scale(${1.05 + lt * 0.03})` });
  st(s.bb.im, { transform: `scale(${1.05 + lt * 0.02})` });
  const l = pop(t, 15.25, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), -2) });
  const g = sp(t, 16.67, 2.6, 0.42);
  st(s.gods, { opacity: String(clamp((t - 16.67) / 0.06)), transform: `scale(${lerp(2.2, 1, g)})` });
  st(s.glow, { opacity: String(0.85 + 0.15 * Math.sin(t * 9)) });
  // whip out
  const w = E.inE(P(t, 17.85, 18.02));
  st(s.root, { transform: `translateY(${w * 1500}px)`, filter: `blur(${(w * 18).toFixed(1)}px)` });
});

/* ============ S8 — Queued / Whistled / Wept (17.95 – 21.4) ============ */
scene(17.95, 19.9, (s, r) => {
  s.bg = mk("img", { src: img("queue.jpg"), cls: "abs", style: { left: "-180px", top: "0", width: "1440px", height: "1920px", objectFit: "cover" } }, r);
  s.chip = mk("div", { cls: "label red", text: "05:40 AM · first day, first show", style: { left: "70px", top: "400px", fontSize: "28px" } }, r);
  s.st = stamp(r, "Housefull", 180, 860, 170);
  s.st.style.color = "#e11d48"; s.st.style.borderColor = "#e11d48"; s.st.style.mixBlendMode = "normal"; s.st.style.background = "rgba(246,240,226,.92)";
}, (s, t) => {
  const lt = t - 17.95;
  st(s.bg, { transform: `scale(${1.12 - lt * 0.035}) translateY(${lt * 10}px)` });
  const c = pop(t, 18.25, 3, 0.5);
  st(s.chip, { opacity: String(c.o), transform: tf((1 - c.k) * -60, 0, 1, -2) });
  const k = sp(t, 18.85, 3.2, 0.45);
  st(s.st, { opacity: String(clamp((t - 18.85) / 0.04)), transform: tf(0, 0, lerp(2.4, 1, k), -8) });
});
scene(19.85, 20.55, (s, r) => {
  s.bg = mk("img", { src: img("audience.jpg"), cls: "abs", style: { left: "-180px", top: "0", width: "1440px", height: "1920px", objectFit: "cover", objectPosition: "50% 40%" } }, r);
  const sv = svgOver(r);
  s.lines = [];
  const rr = rng(44);
  for (let i = 0; i < 46; i++) {
    const a = rr() * Math.PI * 2, r1 = 470 + rr() * 140, r2 = r1 + 260 + rr() * 380;
    s.lines.push(mk("line", { attrs: { x1: 540 + Math.cos(a) * r1, y1: 860 + Math.sin(a) * r1, x2: 540 + Math.cos(a) * r2, y2: 860 + Math.sin(a) * r2, stroke: "#fff", "stroke-width": 3 + rr() * 7, "stroke-linecap": "round", opacity: 0.85 } }, sv));
  }
  s.word = mk("div", { cls: "abs center-x anton", text: "Whistled!", style: { top: "740px", fontSize: "210px", lineHeight: "1", color: "#fff", textShadow: "10px 10px 0 #e11d48, 0 20px 50px rgba(0,0,0,.6)" } }, r);
}, (s, t) => {
  const lt = t - 19.85;
  st(s.bg, { transform: `scale(${1.22 - lt * 0.12})` });
  const k = sp(t, 19.88, 3.4, 0.42);
  st(s.word, { transform: tf(0, 0, lerp(0.3, 1, k), -5) });
  const fr = Math.round(t * FPS);
  s.lines.forEach((l, i) => st(l, { opacity: String(hash(fr * 50 + i) > 0.35 ? 0.9 : 0) }));
});
scene(20.5, 21.42, (s, r) => {
  s.bg = mk("img", { src: img("audience.jpg"), cls: "abs", style: { left: "-560px", top: "-500px", width: "2200px", height: "2933px", objectFit: "cover", filter: "saturate(.6) brightness(.8) sepia(.2) hue-rotate(-10deg)" } }, r);
  s.word = mk("div", { cls: "abs center-x serif", text: "Wept.", style: { top: "760px", fontStyle: "italic", fontSize: "260px", lineHeight: "1", color: "#f6f0e2", textShadow: "0 20px 60px rgba(0,0,0,.8)" } }, r);
}, (s, t) => {
  const lt = t - 20.5;
  st(s.bg, { transform: `scale(${1 + lt * 0.05}) translate(${lt * 40}px, ${lt * 20}px)` });
  const k = sp(t, 20.58, 1.6, 0.8);
  st(s.word, { opacity: String(clamp((t - 20.56) / 0.18)), transform: `translateY(${(1 - k) * 40}px)`, filter: `blur(${((1 - k) * 8).toFixed(1)}px)` });
});

/* ============ S9 — Coins at the screen + clippings flurry (21.35 – 23.6) ============ */
const CLIPS = [
  ["The Picture Herald", "Cannes · 1956", "Pather Panchali<br>honoured at Cannes", "Satyajit Ray's debut named Best Human Document.", 1956],
  ["Film Gazette", "Madras · 1957", "Mayabazar<br>casts its spell", "A Telugu–Tamil fantasy for the ages.", 1957],
  ["The Picture Herald", "Los Angeles · 1958", "Mother India<br>in the Oscar race", "Nominated for Best Foreign Language Film.", 1958],
  ["Film Gazette", "Bombay · 1980", "Sholay: five years<br>at the Minerva", "The run that became a legend.", 1980],
  ["The Screen Daily", "Hyderabad · 2017", "Baahubali 2 crosses<br>₹1,000 crore", "A first for Indian cinema.", 2017],
  ["The Screen Daily", "Los Angeles · 2023", "Naatu Naatu<br>wins the Oscar", "Best Original Song — RRR.", 2023],
];
scene(21.35, 23.62, (s, r) => {
  s.bg = mk("img", { src: img("audience.jpg"), cls: "abs", style: { left: "-180px", top: "0", width: "1440px", height: "1920px", objectFit: "cover", filter: "brightness(.45) blur(3px)" } }, r);
  s.clips = CLIPS.map((c, i) => clipping(r, c[0], c[1], c[2], c[3], [60, 250, 40, 290, 70, 230][i], [330, 500, 670, 840, 1000, 1160][i], 760));
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  const rr = rng(2024);
  s.coins = Array.from({ length: 42 }, () => ({ t0: 21.4 + rr() * 1.9, x: 120 + rr() * 840, y: 1500 + rr() * 300, vx: (rr() - 0.5) * 500, vy: -900 - rr() * 700, spin: 6 + rr() * 14, ph: rr() * 6, gold: rr() < 0.6, z: 0.5 + rr() * 0.6 }));
}, (s, t) => {
  st(s.bg, { transform: `scale(${1.1 + (t - 21.35) * 0.05})` });
  s.clips.forEach((c, i) => {
    const ti = 21.8 + i * 0.27, k = sp(t, ti, 2.6, 0.55), side = i % 2 ? 1 : -1;
    st(c, { opacity: String(clamp((t - ti) / 0.05)), transform: tf(side * (1 - k) * 1100, (1 - k) * 80, 0.78, side * lerp(20, 3 + i, k)) });
  });
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  for (const q of s.coins) {
    const d = t - q.t0; if (d < 0 || d > 1.4) continue;
    const g = 1500;
    const x = q.x + q.vx * d, y = q.y + q.vy * d + 0.5 * g * d * d;
    const sc = q.z * (1 + d * 1.6), rx = 28 * sc, ry = rx * Math.abs(Math.cos(q.ph + d * q.spin)) + 2;
    const grad = c.createLinearGradient(x - rx, y - ry, x + rx, y + ry);
    if (q.gold) { grad.addColorStop(0, "#fff1b0"); grad.addColorStop(0.5, "#e2a91e"); grad.addColorStop(1, "#7a5208"); }
    else { grad.addColorStop(0, "#ffffff"); grad.addColorStop(0.5, "#b8bcc2"); grad.addColorStop(1, "#5d636b"); }
    c.fillStyle = grad; c.beginPath(); c.ellipse(x, y, rx, ry, 0.3, 0, 6.2832); c.fill();
    c.strokeStyle = q.gold ? "#8a5d0a" : "#6d737b"; c.lineWidth = 2.5 * sc; c.stroke();
  }
});

/* ============ S10 — But every dream needed permission (23.55 – 26.4) ============ */
function scriptPage(parent, x, y, rot, title) {
  const p = mk("div", { cls: "abs", style: { left: x + "px", top: y + "px", width: "600px", height: "800px", background: "#f4f1ea", boxShadow: "0 20px 50px rgba(0,0,0,.55)", padding: "70px 64px", boxSizing: "border-box", fontFamily: "Courier New, monospace", color: "#1b1b1b", transform: `rotate(${rot}deg)` } }, parent);
  mk("div", { text: title, style: { fontSize: "34px", fontWeight: "700", textAlign: "center", textDecoration: "underline", marginBottom: "40px" } }, p);
  mk("div", { text: "FADE IN:", style: { fontSize: "28px", marginBottom: "22px" } }, p);
  mk("div", { style: { height: "470px", background: "repeating-linear-gradient(180deg, rgba(30,30,30,.55) 0 7px, transparent 7px 30px)", WebkitMask: "linear-gradient(90deg,#000 0 88%,transparent 88%)" } }, p);
  return p;
}
scene(23.55, 26.42, (s, r) => {
  s.bg = mk("img", { src: img("scripts.jpg"), cls: "abs", style: { left: "-180px", top: "0", width: "1440px", height: "1920px", objectFit: "cover", filter: "grayscale(.85) brightness(.5) contrast(1.1)" } }, r);
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(10,18,30,.55), rgba(5,8,14,.75))" } }, r);
  s.pages = [scriptPage(r, 120, 420, -8, "THE DREAM"), scriptPage(r, 250, 380, 3, "UNTITLED"), scriptPage(r, 200, 460, -2, "MY FIRST FILM")];
  s.stamps = [stamp(s.pages[2], "Rejected", 40, 190, 118), stamp(s.pages[2], "No budget", 20, 380, 104), stamp(s.pages[2], "Not now", 90, 560, 110)];
  s.word = mk("div", { cls: "abs center-x serif", text: "Permission.", style: { top: "1230px", fontSize: "150px", color: "#f6f0e2", textShadow: "0 12px 40px rgba(0,0,0,.8)", opacity: "0" } }, r);
}, (s, t) => {
  st(s.bg, { transform: `scale(${1.06 + (t - 23.55) * 0.02})` });
  s.pages.forEach((p, i) => {
    const k = sp(t, 23.6 + i * 0.12, 2.2, 0.65);
    st(p, { transform: `translateY(${(1 - k) * 1300}px) rotate(${[-8, 3, -2][i]}deg)` });
  });
  [24.05, 24.5, 24.95].forEach((ti, i) => {
    const k = sp(t, ti, 3.4, 0.5);
    st(s.stamps[i], { opacity: String(clamp((t - ti) / 0.03) * 0.92), transform: `rotate(${[-12, 8, -6][i]}deg) scale(${lerp(2.2, 1, k)})` });
  });
  const wk = sp(t, 25.3, 2.4, 0.6);
  st(s.word, { opacity: String(clamp((t - 25.3) / 0.1)), transform: `translateY(${(1 - wk) * 40}px)` });
  st(s.root, { opacity: String(1 - P(t, 26.25, 26.42)) });
});

/* ============ S11/S12 — 1 vs 1,000 ... Until now (26.35 – 34.62) ============ */
const GRID = { cols: 25, rows: 40, pw: 34, ph: 25, x0: 540 - 12.5 * 34, y0: 830 - 20 * 25 };
scene(26.35, 34.62, (s, r) => {
  st(r, { background: "#0b0b0c" });
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.count = mk("div", { cls: "abs center-x mono", style: { top: "1262px", fontSize: "30px", fontWeight: "700", letterSpacing: ".2em", color: "#f6f0e2" } }, r);
  s.big = mk("div", { cls: "abs anton", style: { left: "50%", top: "1060px", fontSize: "170px", lineHeight: "1", color: "#f6f0e2", background: "rgba(11,11,12,.88)", padding: "10px 40px 0", translate: "-50% 0" } }, r);
  s.until = mk("div", { cls: "abs center-x", style: { top: "1040px", fontFamily: "Roboto", fontWeight: "300", fontSize: "76px", letterSpacing: ".34em", color: "#fff", opacity: "0" } }, r);
  s.uw = words(s.until, "UNTIL NOW.");
  const sv = svgOver(r);
  s.cross = mk("g", { attrs: { stroke: "#e11d48", "stroke-width": 4, fill: "none" } }, sv);
  mk("line", { attrs: { x1: 540, y1: 670, x2: 540, y2: 990 } }, s.cross);
  mk("line", { attrs: { x1: 380, y1: 830, x2: 700, y2: 830 } }, s.cross);
  [[430, 720, 1, 1], [650, 720, -1, 1], [430, 940, 1, -1], [650, 940, -1, -1]].forEach(([x, y, dx, dy]) =>
    mk("path", { attrs: { d: `M${x},${y + dy * 46} L${x},${y} L${x + dx * 46},${y}`, "stroke-width": 8 } }, s.cross));
}, (s, t) => {
  if (!s.heroImg) s.heroImg = IMGS[img("dance1950.jpg")];
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const G = GRID;
  const zoom = E.ioE(P(t, 28.55, 29.25));        // single frame -> grid cell
  const heroIdx = 20 * G.cols + 12;               // centre cell
  const hx = G.x0 + 12 * G.pw, hy = G.y0 + 20 * G.ph;
  const bw = lerp(640, G.pw - 6, zoom), bh = bw * 9 / 16;
  const bx = lerp(540 - 320, hx + 3, zoom), by = lerp(830 - 180, hy + 3 + (G.ph - 6 - (G.pw - 6) * 9 / 16) / 2, zoom);
  const ignite = (i, j) => { const d = Math.hypot(i - 12, (j - 20) * 0.75) / 23; return 33.57 + d * 0.8; };
  // grid of never-made films
  const dim = lerp(1, 0.28, P(t, 29.65, 30.3)) * lerp(1, 0.55, P(t, 31.1, 31.3));
  for (let j = 0; j < G.rows; j++) for (let i = 0; i < G.cols; i++) {
    const idx = j * G.cols + i; if (idx === heroIdx) continue;
    const d = Math.hypot(i - 12, j - 20) / 24, ta = 28.95 + d * 0.7 + hash(idx) * 0.12;
    if (t < ta) continue;
    const a = clamp((t - ta) / 0.12);
    const x = G.x0 + i * G.pw + 3, y = G.y0 + j * G.ph + 3, w = G.pw - 6, h = G.ph - 6;
    const ig = t >= 33.4 ? clamp((t - ignite(i, j)) / 0.25) : 0;
    if (ig > 0) {
      c.fillStyle = `rgba(225,29,72,${0.35 + 0.65 * ig})`; c.fillRect(x, y, w, h);
      c.fillStyle = `rgba(255,220,225,${0.5 * ig * clamp(1 - (t - ignite(i, j)) / 0.5)})`; c.fillRect(x, y, w, h);
    } else {
      c.strokeStyle = `rgba(200,200,205,${0.55 * a * dim})`; c.lineWidth = 2; c.strokeRect(x, y, w, h);
    }
  }
  // the one film that got made
  if (s.heroImg) {
    const heroA = t < 33.4 ? 1 : 1 - clamp((t - 33.6) / 0.3) * 0;
    c.save(); c.globalAlpha = heroA; c.shadowColor = "rgba(255,240,210,.8)"; c.shadowBlur = lerp(40, 10, zoom);
    c.fillStyle = "#f6f0e2"; c.fillRect(bx - 8 * (1 - zoom), by - 8 * (1 - zoom), bw + 16 * (1 - zoom), bh + 16 * (1 - zoom));
    c.shadowBlur = 0;
    const iw = s.heroImg.width, ih = s.heroImg.height, sh = iw * 9 / 16;
    c.drawImage(s.heroImg, 0, ih * 0.3, iw, sh, bx, by, bw, bh);
    c.restore();
  }
  // counters
  let big = "", cnt = "";
  if (t < 28.6) { big = ""; cnt = t > 26.6 ? "1 FILM MADE" : ""; }
  else if (t < 31.1) { const n = Math.round(lerp(1, 1000, E.outC(P(t, 28.9, 29.7)))); big = n.toLocaleString("en-IN"); cnt = t > 29.6 ? "NEVER MADE" : "…"; }
  if (s.big.textContent !== big) s.big.textContent = big;
  if (s.count.textContent !== cnt) s.count.textContent = cnt;
  st(s.big, { opacity: String(clamp((t - 28.7) / 0.1) * (1 - P(t, 30.9, 31.12))) });
  st(s.count, { opacity: String(clamp((t - 26.6) / 0.15) * (1 - P(t, 30.9, 31.12))), color: t > 29.6 ? "#9a9aa0" : "#f6f0e2" });
  // until now
  const ck = sp(t, 31.12, 2.6, 0.45);
  st(s.cross, { opacity: String(clamp((t - 31.12) / 0.05) * (1 - P(t, 34.3, 34.5))), transform: `scale(${lerp(1.6, 1, ck)})`, transformOrigin: "540px 830px" });
  st(s.until, { opacity: String((1 - P(t, 34.2, 34.45))) });
  s.uw.forEach((w, i) => { const ti = [31.65, 32.44][i]; st(w, { opacity: String(clamp((t - ti) / 0.25)), filter: `blur(${(8 * (1 - clamp((t - ti) / 0.3))).toFixed(1)}px)` }); });
  const shake = t > 33.6 ? (t - 33.6) * 6 : 0;
  st(s.root, { transform: `translate(${noise1(t * 30, 1) * shake}px, ${noise1(t * 30, 2) * shake}px) scale(${1 + E.inC(P(t, 33.6, 34.57)) * 0.25})` });
});

/* ============ S13 — 2026 · the camera is your imagination (34.57 – 39.65) ============ */
scene(34.57, 39.68, (s, r) => {
  st(r, { background: "#070707" });
  s.red = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 50% 45%, #e11d48 0%, #7a0a1c 55%, #070707 100%)" } }, r);
  s.year = mk("div", { cls: "abs center-x anton", text: "2026", style: { top: "560px", fontSize: "440px", lineHeight: "1", color: "#fff", letterSpacing: "-.01em" } }, r);
  s.nhc = mk("div", { cls: "abs center-x serif", style: { top: "860px", fontSize: "104px", lineHeight: "1.05", color: "#f6f0e2" } }, r);
  s.nw = words(s.nhc, "Nothing has changed.");
  s.stack = mk("div", { cls: "abs", style: { left: "220px", top: "470px", width: "640px", height: "860px" } }, r);
  s.pr = printEl(s.stack, "camera1913.jpg", 0, 0, 640, 860);
  s.dream = mk("img", { src: img("dreamer.jpg"), cls: "abs", style: { left: "16px", top: "16px", width: "608px", height: "828px", objectFit: "cover", opacity: "0" } }, s.stack);
  s.scan = mk("div", { cls: "abs", style: { left: "16px", width: "608px", height: "6px", background: "#ff2d55", boxShadow: "0 0 30px 8px rgba(255,45,85,.8)", opacity: "0" } }, s.stack);
  s.l1 = mk("div", { cls: "label", text: "The camera", style: { left: "560px", top: "400px", fontSize: "34px" } }, r);
  const sv = svgOver(r);
  s.strike = stroke(sv, "M560,428 L820,426", "#ff2d55", 9);
  s.l2 = mk("div", { cls: "label red", text: "Your imagination", style: { left: "440px", top: "470px", fontSize: "40px" } }, r);
  s.bar = mk("div", { cls: "abs", style: { left: "80px", top: "1360px", width: "920px", height: "104px", borderRadius: "52px", background: "rgba(20,20,22,.92)", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 20px 60px rgba(0,0,0,.6)" } }, r);
  s.prompt = mk("div", { cls: "abs mono", style: { left: "40px", top: "33px", fontSize: "28px", color: "#f6f0e2", whiteSpace: "nowrap" } }, s.bar);
  s.btn = mk("div", { cls: "abs mono", text: "GENERATE", style: { right: "12px", top: "12px", height: "80px", lineHeight: "80px", padding: "0 30px", borderRadius: "40px", background: "#e11d48", color: "#fff", fontSize: "24px", fontWeight: "700", letterSpacing: ".12em" } }, s.bar);
  s.ptxt = "a dreamer on a Bengaluru rooftop, 4K";
}, (s, t) => {
  // 2026 slam, then lift away
  const k = sp(t, 34.57, 2.8, 0.42);
  const up = E.ioC(P(t, 34.82, 35.22));
  st(s.year, { transform: `translateY(${-up * 200}px) scale(${lerp(1.5, 1, k) * lerp(1, 0.42, up)})`, opacity: String(1 - P(t, 36.2, 36.45)) });
  st(s.red, { opacity: String(lerp(1, 0.0, E.outC(P(t, 34.6, 35.6)))) });
  s.nw.forEach((w, i) => { const ti = [35.08, 35.38, 35.62][i]; const kk = sp(t, ti, 2.6, 0.6); st(w, { opacity: String(clamp((t - ti) / 0.1)), transform: `translateY(${(1 - kk) * 50}px)` }); });
  st(s.nhc, { opacity: String(1 - P(t, 36.2, 36.4)) });
  // camera print arrives on "only now"
  const pk = sp(t, 36.3, 2.1, 0.62);
  st(s.stack, { opacity: String(clamp((t - 36.3) / 0.06)), transform: tf(0, (1 - pk) * 1200, 1, lerp(12, -2, pk)) });
  st(s.pr.im, { transform: `scale(${1.05 + (t - 36.3) * 0.03})`, filter: "grayscale(1) contrast(1.1)" });
  const l1 = pop(t, 37.4, 3, 0.5);
  st(s.l1, { opacity: String(l1.o), transform: tf(0, 0, lerp(0.6, 1, l1.k), -2) });
  drawOn(s.strike, E.outC(P(t, 38.25, 38.45)));
  const l2 = pop(t, 38.5, 3, 0.45);
  st(s.l2, { opacity: String(l2.o), transform: tf(0, 0, lerp(0.5, 1, l2.k), -3) });
  // prompt typing + generate
  const kb = sp(t, 36.45, 2.4, 0.7);
  st(s.bar, { opacity: String(clamp((t - 36.45) / 0.1)), transform: `translateY(${(1 - kb) * 200}px)` });
  const n = Math.floor(P(t, 36.6, 38.05) * s.ptxt.length);
  const cur = Math.floor(t * 3) % 2 ? "▍" : " ";
  const txt = s.ptxt.slice(0, n) + (t < 38.2 ? cur : "");
  if (s.prompt.textContent !== txt) s.prompt.textContent = txt;
  const press = t > 38.1 && t < 38.3 ? 0.9 : 1;
  st(s.btn, { transform: `scale(${press})`, background: t > 38.1 ? "#ff2d55" : "#e11d48" });
  // diffusion reveal
  const rv = P(t, 38.21, 39.0);
  st(s.dream, { opacity: String(E.outC(rv)), filter: `blur(${((1 - E.outC(rv)) * 40).toFixed(1)}px) saturate(${lerp(0.3, 1.1, rv)}) brightness(${lerp(1.8, 1, rv)})` });
  st(s.scan, { opacity: String(rv > 0 && rv < 1 ? 1 : 0), top: `${16 + E.ioC(rv) * 828}px` });
  const w = E.inE(P(t, 39.5, 39.68));
  st(s.root, { transform: `translateY(${-w * 1500}px)`, filter: `blur(${(w * 18).toFixed(1)}px)` });
});

/* ============ S14 — Small budgets / impossible dreams montage (39.6 – 44.0) ============ */
const WORK = [
  ["hs-tata1mg.jpg", "Commercial"], ["hs-kookie.jpg", "3D animation"], ["hs-ilaiyaraaja.jpg", "Tribute film"], ["hs-dominoz.jpg", "Product film"],
  ["hs-horror.jpg", "Ad film"], ["hs-zepto.jpg", "Brand film"], ["hs-portfolio-3.jpg", "CGI spot"], ["hs-portfolio-2.jpg", "Product film"],
  ["hs-portfolio-1.jpg", "Commercial"], ["hs-portfolio-4.jpg", "Launch film"],
];
scene(39.55, 44.02, (s, r) => {
  st(r, { background: "#0a0a0a" });
  s.strip = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px" } }, r);
  s.cards = [];
  for (let i = 0; i < 22; i++) {
    const [src, lab] = WORK[i % WORK.length];
    const c = mk("div", { cls: "abs", style: { left: "40px", top: i * 560 + "px", width: "1000px", height: "536px", overflow: "hidden", background: "#111" } }, s.strip);
    mk("img", { src: img(src), cls: "cover" }, c);
    mk("div", { cls: "label", text: lab, style: { left: "20px", bottom: "20px", fontSize: "22px", background: "rgba(10,10,10,.85)" } }, c);
    mk("div", { cls: "label red", text: "Made at Hinton", style: { right: "20px", top: "20px", fontSize: "20px" } }, c);
    s.cards.push(c);
  }
  s.band = mk("div", { cls: "abs", style: { left: "0", top: "700px", width: "1080px", height: "340px", background: "#e11d48", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)" } }, r);
  s.small = mk("div", { cls: "abs center-x serif", text: "Here's to the ones with", style: { top: "36px", fontStyle: "italic", fontSize: "60px", color: "#fff" } }, s.band);
  s.w1 = mk("div", { cls: "abs center-x anton", text: "Small budgets.", style: { top: "120px", fontSize: "170px", lineHeight: "1", color: "#fff" } }, s.band);
  s.w2 = mk("div", { cls: "abs center-x anton", html: "Impossible<br>dreams.", style: { top: "40px", fontSize: "210px", lineHeight: ".95", color: "#fff" } }, s.band);
}, (s, t) => {
  const lt = t - 39.55;
  const off = 520 * lt + 260 * lt * lt;               // accelerating scroll
  st(s.strip, { transform: `translateY(${-off + 200}px)`, filter: `blur(${clamp((lt - 2.8) * 2.5, 0, 5).toFixed(1)}px)` });
  const bk = sp(t, 39.85, 2.4, 0.6);
  const grow = E.ioC(P(t, 42.2, 42.5));
  st(s.band, { transform: `scaleY(${bk})`, height: `${lerp(340, 520, grow)}px`, top: `${lerp(700, 610, grow)}px` });
  st(s.small, { opacity: String(clamp((t - 39.9) / 0.15) * (1 - P(t, 42.1, 42.3))) });
  const k1 = sp(t, 40.75, 2.6, 0.5);
  st(s.w1, { opacity: String(clamp((t - 40.75) / 0.06) * (1 - P(t, 42.15, 42.3))), transform: `scale(${lerp(1.6, 1, k1)})` });
  const k2 = sp(t, 42.35, 2.6, 0.45);
  st(s.w2, { opacity: String(clamp((t - 42.35) / 0.06)), transform: `scale(${lerp(1.8, 1, k2)})` });
  const w = E.inE(P(t, 43.85, 44.02));
  st(s.root, { opacity: String(1 - w), transform: `scale(${1 + w * 0.3})` });
});

/* ============ S15 — Made in India. For the world. (43.95 – 47.05) ============ */
const CITIES = [[51.5, -0.12], [40.71, -74.0], [25.2, 55.27], [1.35, 103.82], [35.68, 139.69], [-33.87, 151.21], [48.85, 2.35], [6.52, 3.38], [-23.55, -46.63], [34.05, -118.24], [-1.29, 36.82], [55.75, 37.62], [43.65, -79.38], [22.3, 114.17]];
const BLR = [12.97, 77.59];
function ortho(lat, lon, lat0, lon0, R, cx, cy) {
  const f = (lat * Math.PI) / 180, l = (lon * Math.PI) / 180, f0 = (lat0 * Math.PI) / 180, l0 = (lon0 * Math.PI) / 180;
  const cosc = Math.sin(f0) * Math.sin(f) + Math.cos(f0) * Math.cos(f) * Math.cos(l - l0);
  return [cx + R * Math.cos(f) * Math.sin(l - l0), cy - R * (Math.cos(f0) * Math.sin(f) - Math.sin(f0) * Math.cos(f) * Math.cos(l - l0)), cosc];
}
function slerpLL(a, b, u) {
  const toV = ([la, lo]) => { const f = (la * Math.PI) / 180, l = (lo * Math.PI) / 180; return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)]; };
  const A = toV(a), B = toV(b); const d = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)); const s = Math.sin(d) || 1;
  const k1 = Math.sin((1 - u) * d) / s, k2 = Math.sin(u * d) / s;
  const v = [A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2];
  return [(Math.asin(v[2]) * 180) / Math.PI, (Math.atan2(v[1], v[0]) * 180) / Math.PI, d];
}
scene(43.95, 47.08, (s, r) => {
  st(r, { background: "radial-gradient(circle at 50% 45%, #15161c 0%, #050506 70%)" });
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.name = mk("div", { cls: "abs anton", text: "Bengaluru, India", style: { left: "600px", top: "770px", fontSize: "70px", lineHeight: "1", color: "#fff" } }, r);
  s.coord = mk("div", { cls: "abs mono", text: "12.97° N · 77.59° E", style: { left: "604px", top: "852px", fontSize: "24px", letterSpacing: ".12em", color: "#f6f0e2" } }, r);
  s.hq = mk("div", { cls: "label red", text: "Hinton Studios HQ", style: { left: "600px", top: "900px", fontSize: "22px" } }, r);
  s.t1 = mk("div", { cls: "abs center-x anton", text: "Made in India.", style: { top: "1180px", fontSize: "140px", lineHeight: "1", color: "#fff" } }, r);
  s.t2 = mk("div", { cls: "abs center-x anton", text: "For the world.", style: { top: "1180px", fontSize: "140px", lineHeight: "1", color: "#e11d48" } }, r);
}, (s, t) => {
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const z = E.ioE(P(t, 45.35, 46.3));
  const R = lerp(lerp(5600, 4200, P(t, 43.95, 45.35)), 430, z);
  const lat0 = lerp(BLR[0], 18, z), lon0 = lerp(BLR[1], 52, z) - Math.max(0, t - 46.3) * 8;
  const cx = 540, cy = lerp(860, 800, z);
  if (z > 0.2) {  // globe disc
    c.fillStyle = `rgba(30,32,40,${0.6 * clamp((z - 0.2) / 0.3)})`; c.beginPath(); c.arc(cx, cy, R, 0, 6.2832); c.fill();
    c.strokeStyle = `rgba(225,29,72,${0.35 * clamp((z - 0.2) / 0.3)})`; c.lineWidth = 3; c.stroke();
  }
  const drawSet = (pts, rad, alpha) => {
    if (alpha <= 0.01) return;
    c.fillStyle = `rgba(246,240,226,${alpha})`;
    for (const [lo, la] of pts) {
      const [x, y, cc] = ortho(la, lo, lat0, lon0, R, cx, cy);
      if (cc <= 0 || x < -20 || x > 1100 || y < -20 || y > 1940) continue;
      c.beginPath(); c.arc(x, y, rad * (0.5 + 0.5 * cc), 0, 6.2832); c.fill();
    }
  };
  drawSet(LAND.india, lerp(7, 2, z), 0.5 * (1 - clamp((z - 0.35) / 0.3)));
  drawSet(LAND.world, lerp(10, 2.3, z), 0.55 * clamp((z - 0.15) / 0.3));
  // arcs from Bengaluru
  CITIES.forEach((city, i) => {
    const ta = 45.75 + i * 0.06; if (t < ta) return;
    const u = E.outC(clamp((t - ta) / 0.7));
    c.strokeStyle = "#e11d48"; c.lineWidth = 3.5; c.shadowColor = "#ff2d55"; c.shadowBlur = 12; c.beginPath();
    let started = false, last = null;
    for (let k = 0; k <= 40; k++) {
      const uu = (k / 40) * u; const [la, lo, d] = slerpLL(BLR, city, uu);
      const lift = 1 + Math.sin(Math.PI * uu) * 0.18 * Math.min(1, d);
      const [x, y, cc] = ortho(la, lo, lat0, lon0, R * lift, cx, cy);
      const vis = cc > -0.05;
      if (!vis) { started = false; continue; }
      if (!started) { c.moveTo(x, y); started = true; } else c.lineTo(x, y);
      last = [x, y];
    }
    c.stroke(); c.shadowBlur = 0;
    if (last && u < 1) { c.fillStyle = "#fff"; c.beginPath(); c.arc(last[0], last[1], 6, 0, 6.2832); c.fill(); }
    if (u >= 1) { const [x, y, cc] = ortho(city[0], city[1], lat0, lon0, R, cx, cy); if (cc > 0) { c.fillStyle = "#ff2d55"; c.beginPath(); c.arc(x, y, 7, 0, 6.2832); c.fill(); } }
  });
  // Bengaluru pin
  const [bx, by, bc] = ortho(BLR[0], BLR[1], lat0, lon0, R, cx, cy);
  if (bc > 0) {
    const pulse = (t * 1.6) % 1;
    c.strokeStyle = `rgba(225,29,72,${1 - pulse})`; c.lineWidth = 4; c.beginPath(); c.arc(bx, by, 20 + pulse * 60 * (1 - z * 0.6), 0, 6.2832); c.stroke();
    c.fillStyle = "#e11d48"; c.beginPath(); c.arc(bx, by, lerp(16, 9, z), 0, 6.2832); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 3; c.stroke();
  }
  const na = clamp((t - 44.05) / 0.15) * (1 - P(t, 45.3, 45.5));
  const nk = sp(t, 44.05, 2.4, 0.6);
  [s.name, s.coord, s.hq].forEach((el, i) => st(el, { opacity: String(na), transform: `translateX(${(1 - sp(t, 44.05 + i * 0.1, 2.4, 0.6)) * 80}px)` }));
  const k1 = sp(t, 44.33, 2.6, 0.5);
  st(s.t1, { opacity: String(clamp((t - 44.33) / 0.06) * (1 - P(t, 45.6, 45.75))), transform: `scale(${lerp(1.5, 1, k1)})` });
  const k2 = sp(t, 45.86, 2.6, 0.5);
  st(s.t2, { opacity: String(clamp((t - 45.86) / 0.06)), transform: `translateY(${lerp(0, 190, z)}px) scale(${lerp(1.5, 1, k2)})` });
  const w = E.inE(P(t, 46.9, 47.08));
  st(s.root, { opacity: String(1 - w), transform: `scale(${1 + w * 0.5})` });
});

/* ============ S16 — Logo sting · Dream in 4K · Create with AI (47.0 – 52.95) ============ */
scene(47.0, 52.95, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 22%, #9e0e1d 0%, #3d0409 45%, #050102 80%)" });
  s.logo = mk("div", { cls: "abs", style: { left: "0", top: "200px", width: "1080px", height: "1080px", transformOrigin: "540px 540px" } }, r);
  s.frame = mk("img", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1080px", WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 52%, transparent 71%)", maskImage: "radial-gradient(circle at 50% 50%, #000 52%, transparent 71%)" } }, s.logo);
  s.word = mk("div", { cls: "abs center-x", html: "<b style='font-weight:800'>HINTON</b> STUDIOS", style: { top: "1210px", fontFamily: "Roboto", fontWeight: "400", fontSize: "78px", color: "#f6f0e2", opacity: "0" } }, r);
  s.tag1 = mk("div", { cls: "abs center-x anton", html: "Dream in <span style='background:#e11d48;padding:0 18px'>4K.</span>", style: { top: "1020px", fontSize: "150px", lineHeight: "1.1", color: "#fff", opacity: "0" } }, r);
  s.tag2 = mk("div", { cls: "abs center-x anton", html: "Create with <span style='color:#ff2d55'>AI.</span>", style: { top: "1200px", fontSize: "150px", lineHeight: "1.1", color: "#fff", opacity: "0" } }, r);
}, (s, t) => {
  const idx = clamp(Math.floor((t - 47.0) * 30), 0, 106);
  const src = `assets/sting/s${String(idx + 1).padStart(3, "0")}.jpg`;
  if (s.frame.__src !== src) { s.frame.__src = src; s.frame.src = src; }
  const shrink = E.ioC(P(t, 48.85, 49.3));
  const push = 1 + Math.max(0, t - 50.5) * 0.012;
  st(s.logo, { transform: `translateY(${-shrink * 120}px) scale(${lerp(1, 0.62, shrink) * push})` });
  const wk = P(t, 48.3, 48.8);
  st(s.word, { opacity: String(E.outC(wk)), letterSpacing: `${lerp(0.5, 0.12, E.outC(wk))}em`, transform: `translateY(${-shrink * 300}px) scale(${lerp(1, 0.8, shrink)})` });
  const k1 = sp(t, 49.06, 2.6, 0.5), k2 = sp(t, 50.82, 2.6, 0.5);
  st(s.tag1, { opacity: String(clamp((t - 49.06) / 0.06)), transform: `scale(${lerp(1.6, 1, k1)})` });
  st(s.tag2, { opacity: String(clamp((t - 50.82) / 0.06)), transform: `scale(${lerp(1.6, 1, k2)})` });
  const w = E.inE(P(t, 52.8, 52.95));
  st(s.root, { opacity: String(1 - w) });
});

/* ============ S17 — The visionaries are already here. Are you? (52.9 – 59.87) ============ */
scene(52.88, 60.5, (s, r) => {
  st(r, { background: "#000" });
  s.ph = mk("div", { cls: "fill" }, r);
  s.bg = mk("img", { src: img("muskan_director.jpg"), cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", objectFit: "cover", objectPosition: "50% 40%" } }, s.ph);
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,.75) 85%)" } }, s.ph);
  const sv = svgOver(s.ph);
  s.vf = mk("g", { attrs: { stroke: "#fff", "stroke-width": 5, fill: "none", opacity: 0.9 } }, sv);
  [[80, 300, 1, 1], [1000, 300, -1, 1], [80, 1440, 1, -1], [1000, 1440, -1, -1]].forEach(([x, y, dx, dy]) => mk("path", { attrs: { d: `M${x},${y + dy * 70} L${x},${y} L${x + dx * 70},${y}` } }, s.vf));
  mk("line", { attrs: { x1: 520, y1: 870, x2: 560, y2: 870, "stroke-width": 3 } }, s.vf);
  mk("line", { attrs: { x1: 540, y1: 850, x2: 540, y2: 890, "stroke-width": 3 } }, s.vf);
  s.rec = mk("div", { cls: "abs mono", html: "<span style='display:inline-block;width:22px;height:22px;border-radius:50%;background:#ff2d55;margin-right:12px;vertical-align:-2px'></span>REC", style: { left: "112px", top: "330px", fontSize: "28px", fontWeight: "700", color: "#fff", letterSpacing: ".12em" } }, s.ph);
  s.tc = mk("div", { cls: "abs mono", style: { right: "112px", top: "330px", fontSize: "28px", fontWeight: "600", color: "#fff", letterSpacing: ".08em" } }, s.ph);
  s.spec = mk("div", { cls: "abs mono", text: "4K · 24 FPS · BENGALURU", style: { left: "112px", top: "1380px", fontSize: "22px", color: "rgba(255,255,255,.85)", letterSpacing: ".14em" } }, s.ph);
  s.line = mk("div", { cls: "abs center-x serif", style: { top: "1080px", fontSize: "88px", lineHeight: "1.05", color: "#fff", textShadow: "0 8px 30px rgba(0,0,0,.7)" } }, s.ph);
  s.lw = words(s.line, "The visionaries are already here.");
  s.line.insertBefore(document.createElement("br"), s.lw[2]);
  s.are = mk("div", { cls: "abs center-x anton", html: "<span id='a1'>Are</span> <span id='a2' style='color:#e11d48'>you?</span>", style: { top: "660px", fontSize: "220px", lineHeight: "1", color: "#fff", opacity: "0" } }, r);
  s.end = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 50% 42%, #d0142f 0%, #9e0e1d 45%, #4a0710 100%)", opacity: "0" } }, r);
  s.endLogo = mk("img", { src: img("logo-white.png"), cls: "abs", style: { left: "240px", top: "420px", width: "600px", height: "520px", objectFit: "contain" } }, s.end);
  s.endTag = mk("div", { cls: "abs center-x mono", text: "DREAM IN 4K · CREATE WITH AI", style: { top: "1000px", fontSize: "34px", fontWeight: "700", letterSpacing: ".2em", color: "#fff" } }, s.end);
  s.endUrl = mk("div", { cls: "abs center-x", text: "hintonstudios.com", style: { top: "1090px", fontFamily: "Roboto", fontWeight: "600", fontSize: "56px", color: "#fff" } }, s.end);
  s.endLoc = mk("div", { cls: "abs center-x mono", text: "MADE IN BENGALURU · MADE FOR THE WORLD", style: { top: "1190px", fontSize: "22px", letterSpacing: ".18em", color: "rgba(255,255,255,.8)" } }, s.end);
}, (s, t) => {
  const lt = t - 52.88;
  st(s.bg, { transform: `scale(${1.1 - lt * 0.012}) translateY(${lt * 6}px)` });
  st(s.ph, { opacity: String(clamp((t - 52.88) / 0.25) * (1 - P(t, 56.85, 56.95))) });
  const fr = Math.round(t * FPS);
  st(s.rec, { opacity: String(Math.floor(t * 2) % 2 ? 0.35 : 1) });
  const tc = `00:${String(Math.floor(t)).padStart(2, "0")}:${String(fr % 30).padStart(2, "0")}`;
  if (s.tc.textContent !== tc) s.tc.textContent = tc;
  const wt = [53.54, 53.75, 54.78, 55.1, 55.55];
  s.lw.forEach((w, i) => { const k = sp(t, wt[i], 2.4, 0.65); st(w, { opacity: String(clamp((t - wt[i]) / 0.12)), transform: `translateY(${(1 - k) * 40}px)` }); });
  // ARE YOU?
  st(s.are, { opacity: String(clamp((t - 57.2) / 0.05) * (1 - P(t, 57.93, 57.97))) });
  const a1 = $("#a1"), a2 = $("#a2");
  if (a1) { const k1 = sp(t, 57.27, 3, 0.5), k2 = sp(t, 57.55, 3, 0.45); st(a1, { display: "inline-block", opacity: String(clamp((t - 57.27) / 0.05)), transform: `scale(${lerp(1.4, 1, k1)})` }); st(a2, { display: "inline-block", opacity: String(clamp((t - 57.55) / 0.05)), transform: `scale(${lerp(1.6, 1, k2)})` }); }
  // end card
  const e = clamp((t - 57.95) / 0.05);
  st(s.end, { opacity: String(e) });
  const ek = sp(t, 57.95, 2.2, 0.55);
  st(s.endLogo, { transform: `scale(${lerp(1.25, 1, ek) * (1 + Math.max(0, t - 58.3) * 0.015)})` });
  [s.endTag, s.endUrl, s.endLoc].forEach((el, i) => { const k = sp(t, 58.25 + i * 0.12, 2.4, 0.6); st(el, { opacity: String(clamp((t - 58.25 - i * 0.12) / 0.1)), transform: `translateY(${(1 - k) * 30}px)` }); });
});
