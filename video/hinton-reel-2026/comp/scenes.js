/* Hinton Studios — "Dream in 4K" reel, v4 (83.6 s). Scene graph.
   Every scene is a pure function of t. Global times are locked to the re-timed narration
   (assets/data/timeline.json) and to the score's bar grid (128 BPM; late downbeats 63.0 · 64.875 · 66.75 · 68.625 · 70.5 · 72.375 · 74.25 · 76.125). */
"use strict";

const EXTRA = new Set((window.MANIFEST && window.MANIFEST.extra) || []);
const pick = (name, fallback) => (EXTRA.has(name) ? name : fallback);

const SCENES = [];
/* update(s, t) runs before clip frames decode; post(s, t) runs after, for canvases that draw video frames */
function scene(a, b, build, update, post) {
  const root = mk("div", { cls: "scene" }, $("#world"));
  const s = { a, b, root, update, post, on: false };
  build(s, root);
  SCENES.push(s);
  return s;
}
/* print whose picture is a video slot */
function printClip(parent, clip, still, x, y, w, h, opts = {}) {
  const p = mk("div", { cls: "print", style: { left: x + "px", top: y + "px", width: w + "px", height: h + "px", padding: (opts.pad ?? 16) + "px", background: opts.border || "var(--cream)" } }, parent);
  const inner = mk("div", { cls: "inner" }, p);
  const slot = clipSlot(inner, clip, still, { width: "100%", height: "100%" }, opts);
  return { p, inner, slot };
}
function svgOver(parent, w = 1080, h = 1920) {
  return mk("svg", { cls: "ov", attrs: { viewBox: `0 0 ${w} ${h}`, width: w, height: h }, style: { width: w + "px", height: h + "px" } }, parent);
}
function stroke(svg, d, color = "#e11d48", width = 7, extra = {}) {
  return mk("path", { attrs: Object.assign({ d, fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round" }, extra) }, svg);
}
function clipping(parent, mast, date, head, sub, x, y, w, compact = false) {
  const c = mk("div", { cls: "clip" + (compact ? " compact" : ""), style: { left: x + "px", top: y + "px", width: w + "px" } }, parent);
  mk("div", { cls: "mast", html: `<span>${mast}</span><span>${date}</span>` }, c);
  mk("div", { cls: "head", html: head }, c);
  if (sub) mk("div", { cls: "sub", html: sub }, c);
  if (!compact) mk("div", { cls: "cols" }, c);
  return c;
}
function stamp(parent, text, x, y, size = 120, color = "#c8102e") {
  return mk("div", { cls: "abs anton", text, style: { left: x + "px", top: y + "px", fontSize: size + "px", color, border: `10px double ${color}`, padding: "4px 28px 0", lineHeight: "1.1", opacity: "0", mixBlendMode: "multiply", letterSpacing: ".04em", whiteSpace: "nowrap" } }, parent);
}
function pop(t, t0, f = 2.6, z = 0.45) { const k = sp(t, t0, f, z); return { k, o: clamp((t - t0) / 0.08) }; }
function whipOut(s, t, t0, t1, dir = "y", dist = -1400) {
  const w = E.inE(P(t, t0, t1));
  const tr = dir === "y" ? `translateY(${w * dist}px)` : `translateX(${w * dist}px)`;
  st(s.root, { transform: tr, filter: `blur(${(w * 18).toFixed(1)}px)` });
}
/* Vox-style speed lines burst (SVG) */
function burstLines(parent, seed, cx = 540, cy = 860, n = 46) {
  const sv = svgOver(parent); const rr = rng(seed); const lines = [];
  for (let i = 0; i < n; i++) {
    const a = rr() * Math.PI * 2, r1 = 440 + rr() * 160, r2 = r1 + 260 + rr() * 420;
    lines.push(mk("line", { attrs: { x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1, x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2, stroke: "#fff", "stroke-width": 3 + rr() * 7, "stroke-linecap": "round", opacity: 0.85 } }, sv));
  }
  return lines;
}
function flashLines(lines, t) { const fr = Math.round(t * FPS); lines.forEach((l, i) => st(l, { opacity: String(hash(fr * 50 + i) > 0.35 ? 0.9 : 0) })); }
/* piecewise-linear time map, pairs = [[real t, local t], …]; extrapolates at slope 1 */
function warp(t, pairs) {
  if (t <= pairs[0][0]) return pairs[0][1] + (t - pairs[0][0]);
  for (let i = 1; i < pairs.length; i++) {
    const [a0, b0] = pairs[i - 1], [a1, b1] = pairs[i];
    if (t <= a1) return lerp(b0, b1, (t - a0) / (a1 - a0));
  }
  const [aN, bN] = pairs[pairs.length - 1];
  return bN + (t - aN);
}
/* a clip whose frames are drawn into a canvas (in post, once decoded) */
function vidSource(parent, name, opts = {}) {
  const im = mk("img", { style: { display: "none" } }, parent);
  const o = { im, name, t0: opts.t0 || 0, speed: opts.speed || 1, offset: opts.offset || 0, tmp: document.createElement("canvas") };
  o.set = (t) => {
    const n = CLIPS[name] || 1;
    const idx = clamp(Math.floor(((t - o.t0) * o.speed + o.offset) * FPS), 0, n - 1);
    setSrc(im, `assets/clips/${name}/${String(idx + 1).padStart(4, "0")}.jpg`);
  };
  return o;
}
/* draw a source rect of a decoded frame into ctx at a given mosaic block size (1 = sharp) */
function drawPix(c, o, sx, sy, sw, sh, dx, dy, dw, dh, block) {
  if (!o.im.naturalWidth) return;
  if (block <= 1.05) { c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high"; c.drawImage(o.im, sx, sy, sw, sh, dx, dy, dw, dh); return; }
  const w = Math.max(1, Math.round(dw / block)), h = Math.max(1, Math.round(dh / block));
  if (o.tmp.width !== w || o.tmp.height !== h) { o.tmp.width = w; o.tmp.height = h; }
  const tc = o.tmp.getContext("2d"); tc.imageSmoothingEnabled = true; tc.imageSmoothingQuality = "high";
  tc.drawImage(o.im, sx, sy, sw, sh, 0, 0, w, h);
  c.imageSmoothingEnabled = false; c.drawImage(o.tmp, 0, 0, w, h, dx, dy, dw, dh);
}
const polyD = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";

/* ---------- global transitions (drawn by main.js) ---------- */
/* silent-era irises: [start closing, closed, open again, cx, cy] */
const IRIS = [[6.55, 6.82, 7.1, 540, 790], [9.45, 9.7, 9.98, 540, 860]];
function irisAt(t) {
  for (const [a, m, b, cx, cy] of IRIS) {
    if (t >= a && t < b) {
      const u = t < m ? 1 - E.inQ(P(t, a, m)) : E.outQ(P(t, m, b));
      return { r: u * 1320, cx, cy };
    }
  }
  return null;
}
/* the projector jams, the frame freezes and the film burns through into colour */
const BURN = { cx: 560, cy: 1010, freeze: 17.16, blister: 17.18, t0: 17.3, t1: 17.63 };
function burnPoly(t) {
  if (t < BURN.t0 || t >= BURN.t1) return null;
  const u = P(t, BURN.t0, BURN.t1);
  const R = 26 + 1900 * E.inC(u) + 100 * u;
  const pts = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const n = 0.16 * Math.sin(3 * a + 1.3 + t * 2) + 0.1 * Math.sin(5 * a + 4.1 - t * 3) + 0.07 * Math.sin(9 * a + 2.2 + t * 5) + 0.04 * Math.sin(17 * a + 0.7);
    pts.push([BURN.cx + Math.cos(a) * R * (1 + n), BURN.cy + Math.sin(a) * R * (1 + n)]);
  }
  return { pts, R, u };
}

/* ============ S0 — Film leader countdown (0 – 1.12) ============ */
scene(0, 1.12, (s, r) => {
  st(r, { background: "#1b1a18" });
  s.ring = mk("div", { cls: "abs", style: { left: "140px", top: "460px", width: "800px", height: "800px", borderRadius: "50%", background: "#8d8a84" } }, r);
  s.sweep = mk("div", { cls: "abs", style: { left: "140px", top: "460px", width: "800px", height: "800px", borderRadius: "50%" } }, r);
  const sv = svgOver(r);
  mk("circle", { attrs: { cx: 540, cy: 860, r: 390, fill: "none", stroke: "#e8e4dc", "stroke-width": 6 } }, sv);
  mk("circle", { attrs: { cx: 540, cy: 860, r: 330, fill: "none", stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  mk("line", { attrs: { x1: 40, y1: 860, x2: 1040, y2: 860, stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  mk("line", { attrs: { x1: 540, y1: 330, x2: 540, y2: 1390, stroke: "#e8e4dc", "stroke-width": 4 } }, sv);
  s.num = mk("div", { cls: "abs center-x", style: { top: "610px", fontFamily: "DM Serif", fontSize: "460px", lineHeight: "500px", color: "#111" } }, r);
  s.burn = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 70% 30%, rgba(255,220,150,1) 0%, rgba(255,120,20,.9) 18%, rgba(120,20,0,.6) 34%, rgba(0,0,0,0) 55%)", opacity: "0", mixBlendMode: "screen" } }, r);
}, (s, t) => {
  const n = t < 0.36 ? 3 : t < 0.72 ? 2 : 1;
  const ph = ((t % 0.36) / 0.36) * 360;
  s.num.textContent = n;
  st(s.sweep, { background: `conic-gradient(from 0deg, rgba(20,20,20,.55) 0deg ${ph.toFixed(1)}deg, transparent ${ph.toFixed(1)}deg)` });
  st(s.root, { transform: `translate(${noise1(t * 20, 2) * 4}px, ${noise1(t * 18, 5) * 5}px)` });
  const b = P(t, 0.86, 1.1);
  st(s.burn, { opacity: String(E.inC(b)), transform: `scale(${1 + b * 2.5})` });
});

/* ============ S1 — 1913 over a running projector (1.08 – 3.35) ============ */
scene(1.08, 3.35, (s, r) => {
  st(r, { background: "#0d0c0b" });
  s.bg = clipSlot(r, "v01_projector", "projector.jpg", { opacity: ".62" }, { drift: [0.05, 0, -14] });
  s.bg.t0 = 1.08;
  s.year = mk("div", { cls: "abs center-x", style: { top: "560px", fontFamily: "DM Serif", fontSize: "360px", lineHeight: "1", color: "#f3ecdc", textShadow: "0 0 60px rgba(255,240,210,.25)" } }, r);
  s.yl = letters(s.year, "1913");
  s.rule = mk("div", { cls: "abs", style: { left: "240px", width: "600px", top: "950px", height: "3px", background: "#f3ecdc" } }, r);
  s.sub = mk("div", { cls: "abs center-x elite", style: { top: "985px", fontSize: "44px", letterSpacing: ".18em", color: "#f3ecdc" } }, r);
  s.subText = "BOMBAY · 3 MAY";
  s.tag = mk("div", { cls: "label red", text: "India's first feature film", style: { left: "50%", top: "1070px", translate: "-50% 0" } }, r);
}, (s, t) => {
  s.bg.set(t, 1 + (t - 1.08) * 0.02);
  s.yl.forEach((el, i) => {
    const k = sp(t, 1.12 + i * 0.07, 2.4, 0.55);
    st(el, { transform: `translateY(${(1 - k) * 120}px) scale(${lerp(1.6, 1, k)})`, opacity: String(clamp((t - 1.12 - i * 0.07) / 0.1)), filter: `blur(${Math.max(0, (1 - k) * 14).toFixed(1)}px)` });
  });
  st(s.rule, { transform: `scaleX(${E.outE(P(t, 1.5, 2.0))})` });
  const n = Math.floor(P(t, 1.7, 2.5) * s.subText.length);
  const txt = s.subText.slice(0, n);
  if (s.sub.textContent !== txt) s.sub.textContent = txt;
  const l = pop(t, 2.55, 3, 0.5);
  st(s.tag, { opacity: String(l.o), transform: `scale(${lerp(0.6, 1, l.k)})` });
  st(s.root, { opacity: String(1 - P(t, 3.2, 3.35)) });
});

/* ============ S2 — The man, the camera, the numbers (3.25 – 6.85; irises out) ============ */
scene(3.25, 6.85, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 40%, #2a2724 0%, #121110 70%)" });
  s.pr = printClip(r, "v02_camera1913", "camera1913.jpg", 150, 350, 780, 1040, { drift: [0.035, 0, 0] });
  s.pr.slot.t0 = 3.25;
  const sv = svgOver(s.pr.inner, 748, 1008);
  s.circ = stroke(sv, wobblyEllipse(262, 345, 150, 150, 7), "#e11d48", 8);
  s.arr = stroke(sv, arrowPath(640, 160, 420, 290, -0.25), "#e11d48", 7);
  s.arrH = stroke(sv, arrowHead(640, 160, 420, 290, -0.25), "#e11d48", 7);
  s.lab = mk("div", { cls: "label red", text: "Hand-cranked camera", style: { left: "520px", top: "410px" } }, r);
  s.clip = clipping(r, "The Picture Herald", "May 1913", "Raja<br>Harishchandra", "India's first full-length feature film opens at the Coronation Cinematograph, Bombay.", 330, 1030, 660);
  s.stats = ["Budget ₹15,000", "≈40 minutes", "Silent"].map((txt, i) => mk("div", { cls: "label paper", text: txt, style: { left: "90px", top: 860 + i * 62 + "px", fontSize: "24px" } }, r));
  s.lab2 = mk("div", { cls: "label", text: "Dadasaheb Phalke · father of Indian cinema", style: { left: "90px", top: "790px", fontSize: "22px" } }, r);
}, (s, t) => {
  const k = sp(t, 3.25, 1.9, 0.62);
  st(s.pr.p, { transform: tf(0, (1 - k) * 1300, 1, lerp(8, -2.5, k)) });
  s.pr.slot.set(t, 1 + (t - 3.25) * 0.015);
  drawOn(s.circ, E.outC(P(t, 3.95, 4.5)));
  drawOn(s.arr, E.outC(P(t, 4.15, 4.5))); drawOn(s.arrH, E.outC(P(t, 4.45, 4.6)));
  const l = pop(t, 4.25, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), -2.5) });
  const c = sp(t, 4.95, 2.1, 0.6);
  st(s.clip, { transform: tf((1 - c) * 900, 0, 1, lerp(14, 3.5, c)), opacity: String(clamp((t - 4.95) / 0.1)) });
  const l2 = pop(t, 5.5, 3, 0.55);
  st(s.lab2, { opacity: String(l2.o), transform: tf((1 - l2.k) * -40, 0, 1, -3) });
  s.stats.forEach((el, i) => { const q = pop(t, 5.75 + i * 0.16, 3.2, 0.5); st(el, { opacity: String(q.o), transform: tf((1 - q.k) * -60, 0, 1, -3) }); });
  st(s.root, { transform: `scale(${(1 + E.inQ(P(t, 6.3, 6.85)) * 0.05).toFixed(4)})` });   // leans into the iris
});

/* ============ S3 — Pictures that move: live filmstrip + intertitle (6.8 – 9.72; iris in/out) ============ */
scene(6.8, 9.72, (s, r) => {
  st(r, { background: "#0c0b0a" });
  s.strip = mk("div", { cls: "abs", style: { left: "250px", top: "0", width: "580px", height: "5600px", background: "#0a0908" } }, r);
  const holes = "repeating-linear-gradient(180deg, transparent 0 22px, #d9d2c2 22px 52px, transparent 52px 74px)";
  mk("div", { cls: "abs", style: { left: "14px", top: "0", width: "30px", height: "100%", background: holes, borderRadius: "4px" } }, s.strip);
  mk("div", { cls: "abs", style: { right: "14px", top: "0", width: "30px", height: "100%", background: holes, borderRadius: "4px" } }, s.strip);
  const srcs = [["v02_camera1913", "camera1913.jpg"], ["v03_talkie", "talkie1931.jpg"], ["v01_projector", "projector.jpg"], ["v04_dance", "dance1950.jpg"]];
  s.frames = [];
  for (let i = 0; i < 15; i++) {
    const f = mk("div", { cls: "abs", style: { left: "62px", top: 20 + i * 370 + "px", width: "456px", height: "340px", overflow: "hidden", background: "#222" } }, s.strip);
    const [c, st_] = srcs[i % srcs.length];
    const slot = clipSlot(f, c, st_, { width: "100%", height: "100%" }, { offset: (i % 5) * 0.4, drift: [0.02, 0, 0] });
    s.frames.push(slot);
  }
  s.card = mk("div", { cls: "abs", style: { left: "110px", top: "610px", width: "860px", height: "560px", background: "#080808", border: "3px solid #e9e1cf", outline: "1px solid #e9e1cf", outlineOffset: "-22px", boxShadow: "0 40px 90px rgba(0,0,0,.8)" } }, r);
  mk("div", { cls: "abs center-x", html: "❦", style: { top: "56px", fontSize: "54px", color: "#e9e1cf", fontFamily: "Playfair" } }, s.card);
  mk("div", { cls: "abs center-x", html: "Pictures<br>that move.", style: { top: "140px", fontFamily: "Playfair", fontStyle: "italic", fontWeight: "700", fontSize: "116px", lineHeight: "1.02", color: "#f1eadb" } }, s.card);
  mk("div", { cls: "abs center-x elite", text: "— INTERTITLE, 1913 —", style: { bottom: "54px", fontSize: "24px", letterSpacing: ".3em", color: "#b9b1a0" } }, s.card);
  s.fps = mk("div", { cls: "label red", text: "≈16 frames a second · turned by hand", style: { left: "50%", top: "1230px", translate: "-50% 0", fontSize: "24px" } }, r);
}, (s, t) => {
  const lt = t - 6.8;
  const y = -((lt * 1500) % 740) - 300 + noise1(t * 14, 9) * 5;
  st(s.strip, { transform: `translate(${noise1(t * 10, 4) * 4}px, ${y}px)` });
  s.frames.forEach((f) => { f.t0 = 6.8; f.set(t); });
  const k = sp(t, 6.95, 2.2, 0.5);
  st(s.card, { transform: tf(0, 0, lerp(1.35, 1, k) * (1 + (t - 6.95) * 0.012) * (1 + E.inQ(P(t, 9.2, 9.72)) * 0.04), lerp(-4, 0, k) + (t - 6.95) * 0.35), opacity: String(clamp((t - 6.95) / 0.08)) });
  const q = pop(t, 8.1, 3, 0.5);
  st(s.fps, { opacity: String(q.o), transform: `scale(${lerp(0.6, 1, q.k)})` });
});

/* ============ S4 — 1931: they learned to speak (9.68 – 12.15; irises in) ============ */
scene(9.68, 12.15, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 45%, #2b2825 0%, #0f0e0d 75%)" });
  s.pr = printClip(r, "v03_talkie", "talkie1931.jpg", 130, 390, 820, 1093, { pad: 0, drift: [0.03, 0, 0] });
  s.pr.slot.t0 = 9.68;
  const sv = svgOver(s.pr.inner, 820, 1093);
  s.circ = stroke(sv, wobblyEllipse(366, 425, 100, 140, 12), "#e11d48", 8);
  s.lab = mk("div", { cls: "label red", text: "Alam Ara · 14 March 1931", style: { left: "520px", top: "400px" } }, r);
  s.lab2 = mk("div", { cls: "label", text: "Majestic Cinema, Bombay", style: { left: "520px", top: "462px" } }, r);
  s.banner = mk("div", { cls: "abs anton", html: "100% Talking!", style: { left: "110px", top: "1150px", fontSize: "112px", color: "#0b0a09", background: "#f1eadb", padding: "6px 34px 0", boxShadow: "0 16px 30px rgba(0,0,0,.5)" } }, r);
  s.wave = mk("canvas", { attrs: { width: 1080, height: 260 }, cls: "abs", style: { left: "0", top: "930px", width: "1080px", height: "260px" } }, r);
  s.wctx = s.wave.getContext("2d");
}, (s, t) => {
  const k = E.outC(P(t, 9.68, 10.9));
  st(s.pr.p, { transform: tf(0, 0, lerp(1.07, 1, k), 2) });
  s.pr.slot.set(t);
  drawOn(s.circ, E.outC(P(t, 10.1, 10.6)));
  const l = pop(t, 10.25, 3, 0.5), l2 = pop(t, 10.4, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), 2) });
  st(s.lab2, { opacity: String(l2.o), transform: tf(0, 0, lerp(0.6, 1, l2.k), 2) });
  const b = sp(t, 10.85, 2.8, 0.42);
  st(s.banner, { opacity: String(clamp((t - 10.85) / 0.06)), transform: tf(0, 0, lerp(1.9, 1, b), -4) });
  const c = s.wctx; c.clearRect(0, 0, 1080, 260);
  const fr = Math.round(t * FPS);
  c.lineWidth = 5; c.strokeStyle = "#f6f0e2"; c.shadowColor = "rgba(255,240,210,.8)"; c.shadowBlur = 16;
  c.beginPath();
  const reveal = E.outC(P(t, 9.75, 10.25));
  for (let x = 0; x <= 1080 * reveal; x += 4) {
    const idx = fr - Math.round((1080 - x) / 36);
    const a = (VOENV[idx] || 0) * 110;
    const y = 130 + Math.sin(x * 0.09 + t * 30) * a * Math.sin(x * 0.013 + t * 3);
    x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
  }
  c.stroke();
  whipOut(s, t, 11.95, 12.15, "x", -1300);
});

/* ============ S5 — To sing (12.05 – 13.42) ============ */
scene(12.05, 13.42, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 45%, #3a2e28 0%, #140f0d 75%)" });
  s.pr = printClip(r, "v04_dance", "dance1950.jpg", 120, 330, 840, 1120, { pad: 0, drift: [0.06, 0, 0] });
  s.pr.slot.t0 = 12.05;
  s.lab = mk("div", { cls: "label paper", text: "“De De Khuda Ke Naam Par” · India's first film song, 1931", style: { left: "50%", top: "1300px", translate: "-50% 0", fontSize: "21px" } }, r);
  s.notes = [0, 1, 2, 3, 4].map((i) => mk("div", { cls: "abs", text: i % 2 ? "♪" : "♫", style: { left: 180 + i * 170 + "px", top: "300px", fontSize: "70px", color: "#f1eadb", opacity: "0" } }, r));
}, (s, t) => {
  const k = sp(t, 12.05, 2.0, 0.6);
  st(s.pr.p, { transform: tf((1 - k) * 1200, 0, 1, lerp(9, -1.5, k)) });
  s.pr.slot.set(t);
  const l = pop(t, 12.4, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: `scale(${lerp(0.6, 1, l.k)})` });
  s.notes.forEach((n, i) => { const u = P(t, 12.25 + i * 0.12, 13.3); st(n, { opacity: String(Math.sin(Math.PI * u) * 0.9), transform: `translateY(${-u * 160}px) rotate(${(i - 2) * 8 * u}deg)` }); });
  const w = E.inE(P(t, 13.22, 13.42));
  st(s.root, { transform: `scale(${1 + w * 0.6})`, opacity: String(1 - w), filter: `blur(${(w * 20).toFixed(1)}px)` });
});

/* ============ S6 — Every language we dream in (13.3 – 17.63): the reel jams and burns through into colour ============ */
const LANGS = [                                           // in order of each language's first talkie
  { w: "हिन्दी", en: "Hindi", film: "Alam Ara", y: 1931, lat: 19.08, lon: 72.88, c: "#ffffff" },
  { w: "বাংলা", en: "Bengali", film: "Jamai Sasthi", y: 1931, lat: 22.57, lon: 88.36, c: "#ffb000" },
  { w: "தமிழ்", en: "Tamil", film: "Kalidas", y: 1931, lat: 13.08, lon: 80.27, c: "#ff5a36" },
  { w: "తెలుగు", en: "Telugu", film: "Bhakta Prahlada", y: 1932, lat: 17.39, lon: 78.49, c: "#ffd23f" },
  { w: "मराठी", en: "Marathi", film: "Ayodhyecha Raja", y: 1932, lat: 16.7, lon: 74.24, c: "#ff8a00" },
  { w: "ಕನ್ನಡ", en: "Kannada", film: "Sati Sulochana", y: 1934, lat: 12.97, lon: 77.59, c: "#e11d48" },
  { w: "മലയാളം", en: "Malayalam", film: "Balan", y: 1938, lat: 9.93, lon: 76.27, c: "#2ec4b6" },
  { w: "भोजपुरी", en: "Bhojpuri", film: "Ganga Maiyya Tohe Piyari Chadhaibo", y: 1963, lat: 25.59, lon: 85.14, c: "#ff6fb5" },
];
const MAPX = (lon) => 90 + (lon - 66) * 28.125, MAPY = (lat) => 300 + (37 - lat) * 28.125;
scene(13.3, BURN.t1, (s, r) => {
  st(r, { background: "#100f0e", zIndex: "3" });              // above S7a so the burn hole reveals colour beneath
  s.inner = mk("div", { cls: "fill", style: { transformOrigin: "540px 900px" } }, r);
  s.bg = clipSlot(s.inner, "v01_projector", "projector.jpg", { opacity: ".24", filter: "blur(2px)" }, { offset: 0.8 });
  s.bg.t0 = 13.3;
  mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 42%, rgba(16,15,14,.5) 0%, rgba(16,15,14,.9) 72%)" } }, s.inner);
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, s.inner);
  s.ctx = s.cv.getContext("2d");
  s.word = mk("div", { cls: "abs center-x", style: { top: "1150px", fontFamily: "Indic", fontSize: "132px", lineHeight: "1.2", color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,.9)" } }, s.inner);
  s.desc = mk("div", { cls: "abs center-x mono", style: { top: "1340px", fontSize: "25px", fontWeight: "600", letterSpacing: ".14em", color: "#f6f0e2", textTransform: "uppercase" } }, s.inner);
  s.title = mk("div", { cls: "abs center-x serif", html: "Every language<br>we dream in", style: { top: "360px", fontSize: "80px", lineHeight: "1", color: "#f6f0e2", opacity: "0" } }, s.inner);
  s.stat = mk("div", { cls: "abs", style: { left: "90px", top: "1120px", width: "900px", padding: "30px 36px", background: "#f6f0e2", color: "#0b0a09", boxShadow: "0 30px 60px rgba(0,0,0,.6)", opacity: "0", boxSizing: "border-box" } }, s.inner);
  mk("div", { cls: "mono", text: "BY THE NUMBERS", style: { fontSize: "22px", fontWeight: "700", letterSpacing: ".3em", color: "#b3122b" } }, s.stat);
  mk("div", { cls: "anton", html: "More films than<br>any nation on Earth", style: { fontSize: "86px", lineHeight: ".98", marginTop: "10px" } }, s.stat);
  mk("div", { cls: "mono", text: "Every year · in dozens of languages", style: { fontSize: "24px", marginTop: "14px", letterSpacing: ".08em" } }, s.stat);
}, (s, t) => {
  const T = Math.min(t, BURN.freeze);                          // after the jam, the frame holds
  s.bg.set(T);
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const dots = LAND.india, reveal = E.outC(P(T, 13.3, 13.9));
  for (let i = 0; i < dots.length; i++) {
    const [lo, la] = dots[i]; const x = MAPX(lo), y = MAPY(la);
    if (hash(i) > reveal) continue;
    let heat = 0;
    LANGS.forEach((L, j) => { const tj = 13.45 + j * 0.26; if (T > tj) { const d = Math.hypot(x - MAPX(L.lon), y - MAPY(L.lat)); heat = Math.max(heat, clamp(1 - d / 120) * clamp((T - tj) / 0.3)); } });
    const wave = 0.5 + 0.5 * Math.sin(T * 5 - (x + y) * 0.012);   // a slow shimmer rolls across the country
    c.fillStyle = heat > 0.02 ? `rgba(255,${Math.round(200 - heat * 120)},${Math.round(120 - heat * 80)},${0.28 + heat * 0.5})` : `rgba(246,240,226,${(0.2 + 0.12 * wave).toFixed(3)})`;
    c.beginPath(); c.arc(x, y, 4.2 + heat * 1.6, 0, 6.2832); c.fill();
  }
  const step = 0.26, t0 = 13.45;
  let cur = -1;
  LANGS.forEach((L, i) => {
    const ti = t0 + i * step; if (T < ti) return; cur = i;
    const x = MAPX(L.lon), y = MAPY(L.lat), k = spring(T - ti, 3, 0.4);
    const rip = ((T - ti) % 1.2) / 1.2;                         // pins keep breathing after they land
    c.fillStyle = L.c; c.globalAlpha = 0.25 * clamp(1 - (T - ti) / 0.6) + 0.12 * (1 - rip) * clamp((T - ti - 0.6) / 0.2);
    c.beginPath(); c.arc(x, y, T - ti < 0.6 ? 20 + (T - ti) * 120 : 16 + rip * 50, 0, 6.2832); c.fill(); c.globalAlpha = 1;
    c.beginPath(); c.arc(x, y, 13 * k, 0, 6.2832); c.fill();
    c.strokeStyle = "#0b0a09"; c.lineWidth = 3; c.stroke();
    c.font = "600 22px 'Roboto Mono'"; c.fillStyle = L.c; c.globalAlpha = clamp((T - ti) / 0.1);
    const lx = x + (L.lon > 80 ? 22 : -22), al = L.lon > 80 ? "left" : "right";
    c.textAlign = al; c.fillText(L.en.toUpperCase(), lx, y + 8); c.globalAlpha = 1;
  });
  const statOn = T > 15.55;
  if (cur >= 0 && !statOn) {
    const L = LANGS[cur];
    if (s.word.textContent !== L.w) { s.word.textContent = L.w; s.desc.textContent = `${L.en} · ${L.film} · ${L.y}`; }
    const ti = t0 + cur * step, k = spring(T - ti, 3.2, 0.5);
    st(s.word, { color: L.c, transform: `translateY(${(1 - k) * 60}px) scale(${lerp(1.25, 1, k)})`, opacity: String(clamp((T - ti) / 0.05)) });
    st(s.desc, { opacity: String(clamp((T - ti - 0.03) / 0.06)) });
  } else { st(s.word, { opacity: "0" }); st(s.desc, { opacity: "0" }); }
  const tk = sp(T, 13.45, 2.2, 0.7);
  st(s.title, { opacity: String(clamp((T - 13.45) / 0.2)), transform: `translateY(${(1 - tk) * 30}px)` });
  const sk = sp(T, 15.55, 2.4, 0.55);
  st(s.stat, { opacity: String(clamp((T - 15.55) / 0.08)), transform: tf(0, (1 - sk) * 500, 1, lerp(6, -2, sk)) });
  // slow push; once jammed, the frame shudders in the gate
  const jam = t > BURN.freeze ? 1 : 0;
  const jx = jam * noise1(t * 40, 3) * 5, jy = jam * (noise1(t * 36, 8) * 7 + (hash(Math.round(t * FPS)) > 0.7 ? 14 : 0));
  st(s.inner, { transform: `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) scale(${(1 + (T - 13.3) * 0.02).toFixed(4)})` });
  st(s.root, { opacity: String(clamp((t - 13.3) / 0.1)) });
  const b = burnPoly(t);
  st(s.root, { clipPath: b ? `path(evenodd, "M0 0 H1080 V1920 H0 Z ${polyD(b.pts)}")` : "none" });
});

/* ============ S7a — Heroes (17.3 – 20.05): the billboard painter, revealed through the burn; colour slam at 17.63 ============ */
scene(17.3, 20.05, (s, r) => {
  st(r, { background: "#2a0507" });
  s.bg = clipSlot(r, "v05_billboard", "billboard.jpg", {}, { drift: [0.05, 0, 10] });
  s.bg.t0 = 17.3;
  s.rays = mk("div", { cls: "abs", style: { left: "-900px", top: "-900px", width: "2880px", height: "2880px", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(255,157,0,.55) 0deg 7deg, rgba(224,70,26,0) 7deg 15deg)", mixBlendMode: "screen", opacity: "0" } }, r);
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(40,0,0,.7) 100%)" } }, r);
  s.kick = mk("div", { cls: "abs mono", text: "1970s – 90s", style: { left: "80px", top: "420px", fontSize: "30px", fontWeight: "700", letterSpacing: ".3em", color: "#ffd65a" } }, r);
  s.w = mk("div", { cls: "abs anton", style: { left: "70px", top: "470px", fontSize: "150px", lineHeight: ".92", color: "#fff", textShadow: "0 12px 40px rgba(0,0,0,.6)" } }, r);
  s.ws = words(s.w, "We turned our heroes");
  [2].forEach((i) => s.w.insertBefore(document.createElement("br"), s.ws[i]));
  s.lab = mk("div", { cls: "label paper", text: "Hand-painted billboards · up to 40 ft tall", style: { left: "80px", top: "1250px", fontSize: "22px" } }, r);
}, (s, t) => {
  s.bg.set(t, lerp(1.16, 1.0, sp(t, 17.63, 1.6, 0.8)));
  st(s.rays, { opacity: String(0.55 * clamp((t - 17.63) / 0.2)), transform: `rotate(${(t - 17.3) * 10}deg)` });
  const k = sp(t, 17.68, 2.6, 0.45);
  st(s.kick, { opacity: String(clamp((t - 17.68) / 0.1)), transform: `translateX(${(1 - k) * -60}px)` });
  const wt = [17.86, 18.12, 18.4, 18.62];
  s.ws.forEach((el, i) => { const q = sp(t, wt[i], 2.8, 0.5); st(el, { opacity: String(clamp((t - wt[i]) / 0.06)), transform: `translateY(${(1 - q) * 90}px) rotate(${(1 - q) * -6}deg)` }); });
  const l = pop(t, 18.9, 3, 0.5);
  st(s.lab, { opacity: String(l.o), transform: tf(0, 0, lerp(0.6, 1, l.k), -2) });
  whipOut(s, t, 19.85, 20.05, "y", 1500);
});

/* ============ S7b — …into gods (19.95 – 23.32): milk abhishekam, then the festival mural ============ */
scene(19.95, 23.32, (s, r) => {
  st(r, { background: "#3a0508" });
  s.bg = clipSlot(r, "v06_milk", "milk.jpg", {}, { drift: [0.035, 0, 0], pos: "50% 30%" });
  s.bg.t0 = 19.95;
  s.halo = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 50% 30%, rgba(255,230,160,.75) 0%, rgba(255,170,40,.3) 22%, rgba(0,0,0,0) 48%)", mixBlendMode: "screen", opacity: "0" } }, r);
  s.rays = mk("div", { cls: "abs", style: { left: "-900px", top: "-1100px", width: "2880px", height: "2880px", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(255,214,90,.35) 0deg 4deg, rgba(0,0,0,0) 4deg 12deg)", mixBlendMode: "screen", opacity: "0" } }, r);
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(30,0,0,.75) 100%)" } }, r);
  s.into = mk("div", { cls: "abs center-x serif", text: "into", style: { top: "880px", fontStyle: "italic", fontSize: "110px", color: "#fff", opacity: "0", textShadow: "0 10px 30px rgba(0,0,0,.6)" } }, r);
  s.gods = mk("div", { cls: "abs center-x anton", text: "Gods.", style: { top: "990px", fontSize: "330px", lineHeight: "1", color: "#ffd65a", textShadow: "0 0 50px rgba(255,190,40,.9), 0 14px 0 #5a0808, 0 20px 40px rgba(0,0,0,.6)", opacity: "0" } }, r);
  s.ins = mk("div", { cls: "fill", style: { opacity: "0" } }, r);
  s.insClip = clipSlot(s.ins, "v13_fdfs", "audience.jpg", {}, { offset: 7.9, pos: "50% 40%" });
  s.insClip.t0 = 22.1;
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.7))" } }, s.ins);
  s.temple = mk("div", { cls: "abs", style: { left: "80px", top: "980px", width: "920px" } }, s.ins);
  mk("div", { cls: "mono", text: "DEVOTION, LITERALLY", style: { fontSize: "24px", fontWeight: "700", letterSpacing: ".3em", color: "#ffd65a" } }, s.temple);
  mk("div", { cls: "anton", html: "Fans have built<br>temples for their stars", style: { fontSize: "96px", lineHeight: ".98", color: "#fff", marginTop: "12px" } }, s.temple);
}, (s, t) => {
  s.bg.set(t);
  st(s.into, { opacity: String(clamp((t - 20.2) / 0.1) * (1 - P(t, 21.9, 22.2))), transform: `translateY(${(1 - sp(t, 20.2, 2.4, 0.6)) * 30}px)` });
  const g = sp(t, 20.62, 2.6, 0.42);
  st(s.gods, { opacity: String(clamp((t - 20.62) / 0.06) * (1 - P(t, 21.9, 22.2))), transform: `scale(${lerp(2.2, 1, g)})` });
  st(s.halo, { opacity: String(clamp((t - 20.6) / 0.25) * (0.85 + 0.15 * Math.sin(t * 9))) });
  st(s.rays, { opacity: String(clamp((t - 20.6) / 0.3)), transform: `rotate(${(t - 19.95) * 6}deg)` });
  st(s.ins, { opacity: String(clamp((t - 22.1) / 0.14)) });
  s.insClip.set(t, 1.1 - (t - 22.1) * 0.04);
  const tk = sp(t, 22.3, 2.4, 0.6);
  st(s.temple, { opacity: String(clamp((t - 22.3) / 0.1)), transform: `translateY(${(1 - tk) * 80}px)` });
});

/* ============ S8 — The lines a nation knows by heart (23.22 – 30.08): one card every two beats ============ */
const LINES = [
  { q: "Kitne aadmi the?", n: "कितने आदमी थे?", who: "Amjad Khan", film: "Sholay", y: 1975, lang: "Hindi", motif: "hills", bg: ["#6d1f0b", "#1f0703"], ac: "#ffb347" },
  { q: "Main aaj bhi phenke hue paise nahi uthata.", n: "मैं आज भी फेंके हुए पैसे नहीं उठाता।", who: "Amitabh Bachchan", film: "Deewaar", y: 1975, lang: "Hindi", motif: "coins", note: "The Angry Young Man", bg: ["#17243c", "#05080f"], ac: "#f4c25a" },
  { q: "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain, Senorita.", n: "बड़े बड़े देशों में ऐसी छोटी छोटी बातें होती रहती हैं, सेनोरिटा।", who: "Shah Rukh Khan", film: "Dilwale Dulhania Le Jayenge", y: 1995, lang: "Hindi", motif: "mustard", note: "1,000+ weeks in one theatre", bg: ["#0a3558", "#2f78a6"], ac: "#ffd400" },
  { q: "En vazhi thani vazhi.", n: "என் வழி தனி வழி", who: "Rajinikanth", film: "Padayappa", y: 1999, lang: "Tamil", motif: "rays", bg: ["#b44f00", "#3d1100"], ac: "#ffe14d" },
  { q: "Nee po mone Dinesha.", n: "നീ പോ മോനേ ദിനേശാ", who: "Mohanlal", film: "Narasimham", y: 2000, lang: "Malayalam", motif: "rays2", bg: ["#0d5a52", "#03201d"], ac: "#ffd166" },
  { q: "Ek baar jo maine commitment kar di, uske baad toh main khud ki bhi nahi sunta.", n: "एक बार जो मैंने कमिटमेंट कर दी, उसके बाद तो मैं खुद की भी नहीं सुनता।", who: "Salman Khan", film: "Wanted", y: 2009, lang: "Hindi", motif: "tape", note: "Remake of Telugu hit Pokiri (2006)", bg: ["#1d1d22", "#060607"], ac: "#f4b41a" },
  { q: "Flower nahi… fire hai main!", n: "फ्लावर नहीं, फायर है मैं!", who: "Allu Arjun", film: "Pushpa: The Rise", y: 2021, lang: "Telugu · Hindi dub", motif: "sparks", bg: ["#4a0c05", "#0e0302"], ac: "#ff7a1a" },
];
const WALL_T0 = 23.26, WALL_STEP = 0.9756;              // two beats of the celebration cue (123 BPM)
const CW = 960, CH = 1080;
const MOTIF = {
  hills(c, lt, t) {                                        // Ramgarh at sunset
    const sy = 700 - lt * 14;
    const g = c.createRadialGradient(620, sy, 20, 620, sy, 440);
    g.addColorStop(0, "rgba(255,196,110,.85)"); g.addColorStop(0.3, "rgba(255,120,40,.35)"); g.addColorStop(1, "rgba(255,90,20,0)");
    c.fillStyle = g; c.fillRect(0, 0, CW, CH);
    c.fillStyle = "rgba(255,214,140,.95)"; c.beginPath(); c.arc(620, sy, 96, 0, 6.2832); c.fill();
    [["#4d170a", 770, 0.5, 3], ["#2d0c05", 850, 0.9, 7], ["#150402", 940, 1.5, 11]].forEach(([col, base, spd, seed]) => {
      c.fillStyle = col; c.beginPath(); c.moveTo(0, CH);
      for (let x = 0; x <= CW + 16; x += 16) {
        const xx = x + t * 26 * spd + seed * 100;
        c.lineTo(x, base - 110 * (0.5 + 0.5 * Math.sin(xx * 0.0052 + seed)) * (0.6 + 0.4 * Math.sin(xx * 0.013 + seed * 2)) - 22 * noise1(xx * 0.05, seed));
      }
      c.lineTo(CW, CH); c.closePath(); c.fill();
    });
    const rr = rng(975);
    for (let k = 0; k < 44; k++) { const x = (rr() * CW + t * (20 + rr() * 40)) % CW, y = 300 + rr() * 700 - lt * 8; c.fillStyle = `rgba(255,210,150,${(0.15 + rr() * 0.3).toFixed(2)})`; c.beginPath(); c.arc(x, y, 1 + rr() * 2.5, 0, 6.2832); c.fill(); }
  },
  coins(c, lt) {                                           // "phenke hue paise" — coins thrown down, one by one
    const g = c.createRadialGradient(480, 1080, 10, 480, 1080, 560); g.addColorStop(0, "rgba(244,194,90,.32)"); g.addColorStop(1, "rgba(244,194,90,0)");
    c.fillStyle = g; c.fillRect(0, 0, CW, CH);
    const rr = rng(1975);
    for (let k = 0; k < 30; k++) {
      const x0 = 70 + rr() * 820, t0 = -0.35 + rr() * 1.3, spin = 8 + rr() * 10, rad = 16 + rr() * 16, gold = rr() < 0.7, floor = 975 + rr() * 80, vx = (rr() - 0.5) * 80, ph = rr() * 6;
      const dt = lt - t0; if (dt < 0) continue;
      const yf = -60 + 1300 * dt * dt, landed = yf >= floor;
      const x = x0 + vx * Math.min(dt, 0.9), y = landed ? floor : yf;
      const ry = landed ? rad * 0.34 : Math.max(2, rad * Math.abs(Math.cos(ph + dt * spin)));
      c.fillStyle = gold ? "#e9b53a" : "#c7ccd3"; c.beginPath(); c.ellipse(x, y, rad, ry, 0, 0, 6.2832); c.fill();
      c.lineWidth = 2; c.strokeStyle = gold ? "#8a5d08" : "#6f757d"; c.stroke();
      if (ry > rad * 0.5) { c.strokeStyle = gold ? "rgba(255,240,176,.9)" : "rgba(255,255,255,.9)"; c.lineWidth = 1.5; c.beginPath(); c.ellipse(x, y, rad * 0.68, ry * 0.68, 0, 0, 6.2832); c.stroke(); }
    }
  },
  mustard(c, lt, t) {                                      // the mustard field
    const hz = 660;
    let g = c.createLinearGradient(0, hz - 170, 0, hz + 30); g.addColorStop(0, "rgba(255,240,190,0)"); g.addColorStop(1, "rgba(255,236,170,.38)");
    c.fillStyle = g; c.fillRect(0, hz - 170, CW, 200);
    g = c.createLinearGradient(0, hz, 0, CH); g.addColorStop(0, "#d9b400"); g.addColorStop(0.45, "#b09000"); g.addColorStop(1, "#56620f");
    c.fillStyle = g; c.fillRect(0, hz, CW, CH - hz);
    const rr = rng(1995), N = 280, stalks = [];
    for (let k = 0; k < N; k++) stalks.push([rr(), rr(), rr()]);
    stalks.sort((a, b) => a[1] - b[1]);
    for (const [u, d, ph] of stalks) {
      const x = u * (CW + 60) - 30, base = hz + 10 + d * (CH - hz), hgt = 40 + d * 260;
      const sway = Math.sin(t * 1.7 + x * 0.012 + ph * 6) * (4 + d * 22) + Math.sin(t * 0.7 + ph * 3) * 6 * d;
      c.strokeStyle = `rgba(${Math.round(60 + d * 40)},${Math.round(110 + d * 30)},20,${(0.5 + d * 0.5).toFixed(2)})`; c.lineWidth = 1 + d * 3;
      c.beginPath(); c.moveTo(x, base); c.quadraticCurveTo(x + sway * 0.3, base - hgt * 0.6, x + sway, base - hgt); c.stroke();
      c.fillStyle = `rgba(255,${Math.round(212 + d * 30)},${Math.round(d * 40)},${(0.7 + d * 0.3).toFixed(2)})`;
      const bx = x + sway, by = base - hgt, br = 3 + d * 9;
      for (let f = 0; f < 4; f++) { const a = f * 1.7 + ph * 5; c.beginPath(); c.arc(bx + Math.cos(a) * br, by + Math.sin(a) * br * 0.7, br * 0.75, 0, 6.2832); c.fill(); }
    }
  },
  rays(c, lt, t) {                                         // a mass hero's sunrise
    const cx = 480, cy = 1200;
    c.save(); c.translate(cx, cy); c.rotate(t * 0.3);
    for (let k = 0; k < 28; k++) { c.fillStyle = k % 2 ? "rgba(255,225,77,.2)" : "rgba(255,160,40,.08)"; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 1800, (k / 28) * 6.2832, ((k + 0.5) / 28) * 6.2832); c.closePath(); c.fill(); }
    c.restore();
    const g = c.createRadialGradient(cx, cy - 120, 20, cx, cy - 120, 560); g.addColorStop(0, "rgba(255,240,180,.85)"); g.addColorStop(1, "rgba(255,200,80,0)");
    c.fillStyle = g; c.fillRect(0, 0, CW, CH);
  },
  rays2(c, lt, t) {                                        // light from above, a slow swagger
    const cx = 900, cy = -80;
    c.save(); c.translate(cx, cy); c.rotate(-t * 0.22);
    for (let k = 0; k < 22; k++) { c.fillStyle = k % 2 ? "rgba(255,209,102,.16)" : "rgba(46,196,182,.07)"; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 2000, (k / 22) * 6.2832, ((k + 0.45) / 22) * 6.2832); c.closePath(); c.fill(); }
    c.restore();
    const g = c.createRadialGradient(cx, cy, 20, cx, cy, 700); g.addColorStop(0, "rgba(255,236,190,.7)"); g.addColorStop(1, "rgba(255,209,102,0)");
    c.fillStyle = g; c.fillRect(0, 0, CW, CH);
    const rr = rng(2000);
    for (let k = 0; k < 36; k++) { const x = rr() * CW, y = (rr() * CH + t * (30 + rr() * 50)) % CH; c.fillStyle = `rgba(255,236,190,${(0.12 + rr() * 0.25).toFixed(2)})`; c.beginPath(); c.arc(x, y, 1 + rr() * 2, 0, 6.2832); c.fill(); }
  },
  tape(c, lt, t) {                                         // police-line tape across the card
    const rr = rng(2009);
    for (let k = 0; k < 16; k++) { const y = 120 + rr() * 560, len = 120 + rr() * 300, x = ((rr() * 1400 + t * (900 + rr() * 900)) % 1500) - 300; c.strokeStyle = `rgba(255,255,255,${(0.05 + rr() * 0.1).toFixed(2)})`; c.lineWidth = 2 + rr() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + len, y); c.stroke(); }
    [[782, -4, 1], [838, 3, -1]].forEach(([y, rot, dir]) => {
      c.save(); c.translate(480, y); c.rotate((rot * Math.PI) / 180);
      c.fillStyle = "#f4b41a"; c.fillRect(-700, -30, 1400, 60);
      c.fillStyle = "#111"; c.font = "700 30px 'Roboto Mono'"; c.textBaseline = "middle";
      const off = ((t * 140 * dir) % 300 + 300) % 300;
      for (let x = -900 + off; x < 900; x += 300) c.fillText("WANTED ·", x, 2);
      c.restore();
    });
  },
  sparks(c, lt, t) {                                       // fire, rising
    const g = c.createRadialGradient(480, 1200, 40, 480, 1200, 760); g.addColorStop(0, "rgba(255,120,30,.8)"); g.addColorStop(0.5, "rgba(200,40,10,.32)"); g.addColorStop(1, "rgba(120,10,0,0)");
    c.fillStyle = g; c.fillRect(0, 0, CW, CH);
    const rr = rng(2021);
    for (let k = 0; k < 110; k++) {
      const x0 = rr() * CW, v = 180 + rr() * 420, ph = rr() * 3, life = 1.1 + rr(), rad = 1.5 + rr() * 3.5, gcol = 150 + Math.round(rr() * 90);
      const age = (t + ph) % life, y = CH + 20 - age * v, x = x0 + Math.sin(age * 3 + ph * 5) * 30;
      c.fillStyle = `rgba(255,${gcol},60,${(0.9 * (1 - age / life)).toFixed(2)})`;
      c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fill();
    }
  },
};
function marquee(c, lt, t) {
  const ins = 22, gap = 40, pts = [];
  for (let x = ins; x <= CW - ins; x += gap) pts.push([x, ins]);
  for (let y = ins + gap; y <= CH - ins; y += gap) pts.push([CW - ins, y]);
  for (let x = CW - ins - gap; x >= ins; x -= gap) pts.push([x, CH - ins]);
  for (let y = CH - ins - gap; y > ins; y -= gap) pts.push([ins, y]);
  const stp = Math.floor(t * 12), all = lt > -0.04 && lt < 0.16;
  pts.forEach(([x, y], i) => {
    if (all || (i + stp) % 3 === 0) {
      const g = c.createRadialGradient(x, y, 0, x, y, 17); g.addColorStop(0, "rgba(255,236,170,.9)"); g.addColorStop(1, "rgba(255,200,90,0)");
      c.fillStyle = g; c.beginPath(); c.arc(x, y, 17, 0, 6.2832); c.fill();
      c.fillStyle = "#fff6d8"; c.beginPath(); c.arc(x, y, 5.5, 0, 6.2832); c.fill();
    } else { c.fillStyle = "rgba(90,60,25,.85)"; c.beginPath(); c.arc(x, y, 5, 0, 6.2832); c.fill(); }
  });
}
function lineCard(parent, L, i) {
  const c = mk("div", { cls: "abs", style: { left: "60px", top: "372px", width: CW + "px", height: CH + "px", overflow: "hidden", background: `linear-gradient(180deg, ${L.bg[0]} 0%, ${L.bg[1]} 100%)`, boxShadow: "0 50px 100px rgba(0,0,0,.6)", transformOrigin: "50% 60%", display: "none" } }, parent);
  const cv = mk("canvas", { attrs: { width: CW, height: CH }, cls: "abs", style: { left: "0", top: "0", width: CW + "px", height: CH + "px" } }, c);
  mk("div", { cls: "abs mono", text: L.lang.toUpperCase(), style: { left: "64px", top: "64px", fontSize: "22px", fontWeight: "700", letterSpacing: ".3em", color: "#fff", opacity: ".9" } }, c);
  mk("div", { cls: "abs anton", text: String(L.y), style: { right: "62px", top: "46px", fontSize: "84px", lineHeight: "1", color: L.ac } }, c);
  const qm = mk("div", { cls: "abs serif", text: "“", style: { left: "46px", top: "120px", fontSize: "280px", lineHeight: "1", color: L.ac, opacity: ".9" } }, c);
  const size = L.q.length <= 17 ? 150 : L.q.length <= 28 ? 116 : L.q.length <= 45 ? 90 : 70;
  const box = mk("div", { cls: "abs", style: { left: "74px", right: "66px", top: "210px", height: "560px", display: "flex", flexDirection: "column", justifyContent: "center" } }, c);
  const q = mk("div", { cls: "serif", style: { fontStyle: "italic", fontSize: size + "px", lineHeight: "1.06", color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,.5)" } }, box);
  const qw = words(q, L.q);
  const nat = mk("div", { text: L.n, style: { fontFamily: "Indic", fontSize: "34px", lineHeight: "1.45", color: "rgba(255,255,255,.8)", marginTop: "22px", textShadow: "0 3px 12px rgba(0,0,0,.5)" } }, box);
  const rule = mk("div", { cls: "abs", style: { left: "76px", width: "120px", top: "872px", height: "6px", background: L.ac, transformOrigin: "0 50%" } }, c);
  const who = mk("div", { cls: "abs anton", text: L.who, style: { left: "74px", top: "900px", fontSize: "78px", lineHeight: "1", color: "#fff", whiteSpace: "nowrap", textShadow: "0 4px 20px rgba(0,0,0,.7)" } }, c);
  const film = mk("div", { cls: "abs mono", text: `${L.film} · ${L.y}`.toUpperCase(), style: { left: "78px", top: "994px", fontSize: "23px", fontWeight: "700", letterSpacing: ".14em", color: L.ac, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,.8)" } }, c);
  const note = L.note ? mk("div", { cls: "abs mono", text: L.note, style: { right: "48px", top: "150px", padding: "10px 16px", background: "#f6f0e2", color: "#0b0a09", fontSize: "21px", fontWeight: "700", letterSpacing: ".04em", boxShadow: "0 10px 20px rgba(0,0,0,.4)", whiteSpace: "nowrap", transformOrigin: "100% 0" } }, c) : null;
  return { c, cv, ctx: cv.getContext("2d"), L, i, qm, qw, nat, rule, who, film, note };
}
scene(23.22, 30.08, (s, r) => {
  st(r, { background: "#120305" });
  s.bg = clipSlot(r, "v13_fdfs", "audience.jpg", { opacity: ".5" }, { offset: 3.5, speed: 0.6 });
  s.bg.t0 = 23.22;
  mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 45%, rgba(60,5,12,.3) 0%, rgba(10,2,4,.86) 78%)" } }, r);
  s.rays = mk("div", { cls: "abs", style: { left: "-900px", top: "-540px", width: "2880px", height: "2880px", borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, rgba(255,150,40,.16) 0deg 5deg, rgba(0,0,0,0) 5deg 13deg)", mixBlendMode: "screen" } }, r);
  mk("div", { cls: "fill", style: { backgroundImage: "radial-gradient(rgba(255,214,90,.2) 2.2px, transparent 2.6px)", backgroundSize: "18px 18px", WebkitMask: "radial-gradient(circle at 50% 45%, transparent 32%, #000 78%)" } }, r);
  s.stage = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px" } }, r);
  s.cards = LINES.map((L, i) => lineCard(s.stage, L, i));
  s.foot = mk("div", { cls: "abs center-x mono", text: "THE LINES A NATION KNOWS BY HEART", style: { top: "1492px", fontSize: "24px", fontWeight: "700", letterSpacing: ".3em", color: "#ffd65a", opacity: "0" } }, r);
  // a Vox-style year ruler, 1970 → 2025
  s.rul = mk("div", { cls: "abs", style: { left: "0", top: "1540px", width: "1080px", height: "110px", opacity: "0" } }, r);
  const sv = svgOver(s.rul, 1080, 110);
  s.RX = (y) => 120 + (y - 1970) * (840 / 55);
  mk("line", { attrs: { x1: 120, y1: 30, x2: 960, y2: 30, stroke: "rgba(255,255,255,.35)", "stroke-width": 2 } }, sv);
  s.prog = mk("line", { attrs: { x1: 120, y1: 30, x2: 120, y2: 30, stroke: "#e11d48", "stroke-width": 6, "stroke-linecap": "round" } }, sv);
  for (let y = 1970; y <= 2025; y += 5) {
    const dec = y % 10 === 0;
    mk("line", { attrs: { x1: s.RX(y), y1: 30, x2: s.RX(y), y2: dec ? 52 : 42, stroke: "rgba(255,255,255,.6)", "stroke-width": dec ? 3 : 2 } }, sv);
    if (dec) mk("text", { text: String(y), attrs: { x: s.RX(y), y: 84, fill: "rgba(255,255,255,.7)", "font-family": "Roboto Mono", "font-size": 20, "font-weight": 700, "text-anchor": "middle" } }, sv);
  }
  s.mark = mk("path", { attrs: { d: "M-13,-2 L13,-2 L0,20 Z", fill: "#ffd65a" } }, sv);
}, (s, t) => {
  s.bg.set(t);
  st(s.rays, { transform: `rotate(${(t - 23.22) * 7}deg)` });
  const n = LINES.length;
  s.cards.forEach((C, i) => {
    const ti = WALL_T0 + i * WALL_STEP, tin = ti - 0.14;          // lands on the beat
    const tn = i < n - 1 ? WALL_T0 + (i + 1) * WALL_STEP - 0.14 : 1e9;
    const tn2 = i < n - 2 ? WALL_T0 + (i + 2) * WALL_STEP - 0.14 : 1e9;
    if (t < tin || t > tn2 + 0.45) { st(C.c, { display: "none" }); return; }
    const k = spring(t - tin, 3.2, 0.74);
    const back = t > tn ? spring(t - tn, 2.4, 0.9) : 0;           // pushed back by the next card
    const back2 = clamp((t - tn2) / 0.45);
    const y = (1 - k) * 1350 - back * 128 - back2 * 90;
    const rot = (1 - k) * (i % 2 ? 8 : -8) + ((i % 3) - 1) * 0.7 * k;
    const sc = lerp(1, 0.9, back) * lerp(1, 0.92, back2);
    st(C.c, { display: "block", zIndex: String(10 + i), opacity: String(1 - back2), transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`, filter: `brightness(${lerp(1, 0.45, back).toFixed(3)})` });
    const lt = t - ti;
    const ctx = C.ctx; ctx.clearRect(0, 0, CW, CH);
    MOTIF[C.L.motif](ctx, lt, t);
    const gr = ctx.createLinearGradient(0, 0, 0, CH);
    gr.addColorStop(0, "rgba(0,0,0,.24)"); gr.addColorStop(0.28, "rgba(0,0,0,0)"); gr.addColorStop(0.66, "rgba(0,0,0,0)"); gr.addColorStop(0.8, "rgba(0,0,0,.5)"); gr.addColorStop(1, "rgba(0,0,0,.8)");
    ctx.fillStyle = gr; ctx.fillRect(0, 0, CW, CH);
    marquee(ctx, lt, t);
    const qk = spring(t - tin - 0.04, 3, 0.55);
    st(C.qm, { transform: `scale(${lerp(0.3, 1, qk).toFixed(3)}) rotate(${((1 - qk) * -30).toFixed(1)}deg)`, opacity: String(clamp((t - tin) / 0.1)) });
    C.qw.forEach((w, j) => { const tw = ti - 0.06 + j * 0.028, kk = spring(t - tw, 3.4, 0.7); st(w, { opacity: String(clamp((t - tw) / 0.07)), transform: `translateY(${((1 - kk) * 36).toFixed(1)}px)`, filter: `blur(${(Math.max(0, 1 - kk) * 6).toFixed(1)}px)` }); });
    st(C.nat, { opacity: String(clamp((t - ti - 0.3) / 0.15)) });
    st(C.rule, { transform: `scaleX(${E.outC(P(t, ti + 0.05, ti + 0.35)).toFixed(3)})` });
    const wk = spring(t - ti - 0.1, 3, 0.7);
    st(C.who, { opacity: String(clamp((t - ti - 0.1) / 0.08)), transform: `translateX(${((1 - wk) * -70).toFixed(1)}px)` });
    st(C.film, { opacity: String(clamp((t - ti - 0.2) / 0.1)) });
    if (C.note) { const nk = spring(t - ti - 0.3, 3.4, 0.45); st(C.note, { opacity: String(clamp((t - ti - 0.3) / 0.05)), transform: `rotate(4deg) scale(${lerp(1.8, 1, nk).toFixed(3)})` }); }
  });
  st(s.foot, { opacity: String(clamp((t - 23.5) / 0.3)) });
  const rk = sp(t, 23.4, 2.2, 0.8);
  st(s.rul, { opacity: String(clamp((t - 23.4) / 0.3)), transform: `translateY(${((1 - rk) * 40).toFixed(1)}px)` });
  let yr = 1970;
  LINES.forEach((L, i) => { const ti = WALL_T0 + i * WALL_STEP - 0.14; if (t >= ti) yr = lerp(yr, L.y, spring(t - ti, 2.2, 0.85)); });
  const mx = s.RX(yr);
  st(s.mark, { transform: `translate(${mx.toFixed(1)}px, 4px)` });
  s.prog.setAttribute("x2", mx.toFixed(1));
  whipOut(s, t, 29.9, 30.08, "x", -1400);
});

/* ============ S9 — Queued before sunrise (30.0 – 32.55): the HOUSEFULL sign flickers on ============ */
const NEON_ON = [[31.3, 31.35], [31.42, 31.46], [31.54, 31.66], [31.72, 99]];
scene(30.0, 32.55, (s, r) => {
  s.bg = clipSlot(r, "v07_queue", "queue.jpg", {}, { drift: [-0.03, 12, 0] });
  s.bg.t0 = 30.0;
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(10,14,30,.4) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.25) 100%)" } }, r);
  s.spill = mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 55%, rgba(255,45,85,.55) 0%, rgba(255,45,85,0) 55%)", mixBlendMode: "screen", opacity: "0" } }, r);
  s.chip = mk("div", { cls: "abs mono", text: "1ST DAY · 1ST SHOW", style: { left: "70px", top: "404px", fontSize: "30px", fontWeight: "700", letterSpacing: ".16em", color: "#bff6ff", textShadow: "0 0 6px #fff, 0 0 16px #22d3ee, 0 0 34px #06b6d4" } }, r);
  s.clock = mk("div", { cls: "abs", style: { left: "70px", top: "470px", width: "150px", height: "150px", borderRadius: "50%", background: "#f6f0e2", boxShadow: "0 10px 30px rgba(0,0,0,.5)" } }, r);
  const sv = svgOver(s.clock, 150, 150);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; mk("line", { attrs: { x1: 75 + Math.sin(a) * 60, y1: 75 - Math.cos(a) * 60, x2: 75 + Math.sin(a) * 68, y2: 75 - Math.cos(a) * 68, stroke: "#0b0a09", "stroke-width": i % 3 ? 3 : 6 } }, sv); }
  s.hh = mk("line", { attrs: { x1: 75, y1: 75, x2: 75, y2: 38, stroke: "#0b0a09", "stroke-width": 8, "stroke-linecap": "round" } }, sv);
  s.mh = mk("line", { attrs: { x1: 75, y1: 75, x2: 75, y2: 22, stroke: "#b3122b", "stroke-width": 5, "stroke-linecap": "round" } }, sv);
  s.time = mk("div", { cls: "abs mono", style: { left: "240px", top: "520px", fontSize: "54px", fontWeight: "700", color: "#fff", textShadow: "0 4px 16px rgba(0,0,0,.6)" } }, r);
  s.plate = mk("div", { cls: "abs", style: { left: "90px", top: "860px", width: "900px", height: "260px", borderRadius: "26px", background: "rgba(14,6,12,.84)", border: "3px solid rgba(255,255,255,.1)", boxShadow: "0 30px 70px rgba(0,0,0,.65), inset 0 0 40px rgba(0,0,0,.6)" } }, r);
  s.neon = mk("div", { cls: "abs center-x", style: { top: "44px", fontFamily: "Oswald", fontWeight: "500", fontSize: "168px", lineHeight: "1", letterSpacing: ".07em" } }, s.plate);
  s.nl = letters(s.neon, "HOUSEFULL");
}, (s, t) => {
  s.bg.set(t);
  const cf = t < 30.18 ? 0 : t < 30.22 ? 1 : t < 30.26 ? 0 : 1;          // the small sign blinks on
  st(s.chip, { opacity: String(cf) });
  const ck = pop(t, 30.3, 3, 0.5);
  st(s.clock, { opacity: String(ck.o), transform: `scale(${lerp(0.4, 1, ck.k)})` });
  const mins = lerp(3 * 60, 5 * 60 + 40, E.outC(P(t, 30.3, 31.2)));
  const hA = (mins / 720) * 360, mA = ((mins % 60) / 60) * 360;
  st(s.hh, { transform: `rotate(${hA}deg)`, transformOrigin: "75px 75px" });
  st(s.mh, { transform: `rotate(${mA}deg)`, transformOrigin: "75px 75px" });
  const tt = `0${Math.floor(mins / 60)}:${String(Math.floor(mins % 60)).padStart(2, "0")} AM`;
  if (s.time.textContent !== tt) s.time.textContent = tt;
  st(s.time, { opacity: String(ck.o) });
  const pk = sp(t, 30.9, 2.2, 0.75);
  st(s.plate, { opacity: String(clamp((t - 30.9) / 0.15)), transform: `translateY(${((1 - pk) * 60).toFixed(1)}px)` });
  const on = NEON_ON.some(([a, b]) => t >= a && t < b) ? 1 : 0;
  s.nl.forEach((el, i) => {
    const lit = on && !(i === 5 && t >= 32.02 && t < 32.08);
    st(el, { color: lit ? "#fff4f7" : "rgba(120,44,62,.6)", textShadow: lit ? "0 0 4px #fff, 0 0 12px #ff4d7a, 0 0 30px #ff2d55, 0 0 60px #e11d48, 0 0 100px rgba(225,29,72,.8)" : "none" });
  });
  st(s.spill, { opacity: String(on * (0.8 + 0.2 * Math.sin(t * 40))) });
  st(s.root, { transform: `scale(${(1 + (t - 30) * 0.012).toFixed(4)})` });
});

/* ============ S10 — Whistled (32.45 – 33.62) ============ */
scene(32.45, 33.62, (s, r) => {
  s.bg = clipSlot(r, "v08_audience", "audience.jpg", {}, { drift: [-0.1, 0, 0], pos: "50% 40%" });
  s.bg.t0 = 32.45;
  s.lines = burstLines(r, 44);
  s.ring = mk("div", { cls: "abs", style: { left: "240px", top: "560px", width: "600px", height: "600px", borderRadius: "50%", border: "10px solid #fff", opacity: "0" } }, r);
  s.word = mk("div", { cls: "abs center-x anton", text: "Whistled!", style: { top: "740px", fontSize: "210px", lineHeight: "1", color: "#fff", textShadow: "10px 10px 0 #e11d48, 0 20px 50px rgba(0,0,0,.6)" } }, r);
}, (s, t) => {
  s.bg.set(t, 1.18 - (t - 32.45) * 0.1);
  const k = sp(t, 32.5, 3.4, 0.42);
  st(s.word, { transform: tf(0, 0, lerp(0.3, 1, k), -5) });
  flashLines(s.lines, t);
  const u = P(t, 32.52, 33.1);
  st(s.ring, { opacity: String((1 - u) * 0.8), transform: `scale(${0.4 + u * 1.6})` });
});

/* ============ S11 — Wept (33.55 – 34.97) ============ */
scene(33.55, 34.97, (s, r) => {
  s.bg = clipSlot(r, "v09_tear", "audience.jpg", {}, { drift: [0.04, 0, 0], pos: "20% 30%", offset: 1.5 });
  s.bg.t0 = 33.55;
  s.tint = mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(20,30,60,.25), rgba(0,0,0,.45))" } }, r);
  s.word = mk("div", { cls: "abs center-x serif", text: "Wept.", style: { top: "1200px", fontStyle: "italic", fontSize: "240px", lineHeight: "1", color: "#f6f0e2", textShadow: "0 20px 60px rgba(0,0,0,.8)" } }, r);
}, (s, t) => {
  s.bg.set(t, 1 + (t - 33.55) * 0.03);
  if (!CLIPS.v09_tear) st(s.bg.el, { filter: "saturate(.6) brightness(.85) sepia(.2)" });
  const k = sp(t, 33.64, 1.6, 0.8);
  st(s.word, { opacity: String(clamp((t - 33.62) / 0.2)), transform: `translateY(${(1 - k) * 40}px)`, filter: `blur(${((1 - k) * 8).toFixed(1)}px)` });
});

/* ============ S12 — Coins at the screen → the headlines timeline (34.9 – 38.95) ============ */
const CLIPS_NEWS = [
  ["The Picture Herald", "Cannes · 1956", "Pather Panchali wins at Cannes", "Satyajit Ray's debut named Best Human Document.", 1956],
  ["Film Gazette", "Madras · 1957", "Mayabazar casts its spell", "A Telugu–Tamil fantasy for the ages.", 1957],
  ["The Picture Herald", "Los Angeles · 1958", "Mother India in the Oscar race", "Nominated for Best Foreign Language Film.", 1958],
  ["Film Gazette", "Bombay · 1980", "Sholay: five years at Minerva", "The run that became a legend.", 1980],
  ["The Screen Daily", "Hyderabad · 2017", "Baahubali 2 crosses ₹1,000 crore", "A first for Indian cinema.", 2017],
  ["The Screen Daily", "Los Angeles · 2023", "Naatu Naatu wins the Oscar", "Best Original Song — RRR.", 2023],
];
scene(34.9, 38.95, (s, r) => {
  st(r, { background: "radial-gradient(ellipse at 50% 30%, #1d1a2a 0%, #0a0910 60%, #050408 100%)" });
  s.room = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", perspective: "1600px", perspectiveOrigin: "540px 1500px" } }, r);
  s.screen = mk("div", { cls: "abs", style: { left: "90px", top: "300px", width: "900px", height: "560px", transform: "rotateX(10deg)", transformOrigin: "50% 100%", background: "#fff7e8", boxShadow: "0 0 120px 30px rgba(255,236,200,.45), 0 0 0 14px #1a1714", overflow: "hidden" } }, s.room);
  s.onScreen = clipSlot(s.screen, "v06_milk", "milk.jpg", { width: "100%", height: "100%" }, { drift: [0.02, 0, 0], pos: "50% 22%", offset: 1.5 });
  s.onScreen.t0 = 34.9;
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(255,240,210,.15), rgba(0,0,0,.25))" } }, s.screen);
  s.curtL = mk("div", { cls: "abs", style: { left: "-40px", top: "240px", width: "150px", height: "760px", background: "repeating-linear-gradient(90deg, #5a0b14 0 26px, #7d1320 26px 44px)", borderRadius: "0 0 60px 0", boxShadow: "inset -20px 0 40px rgba(0,0,0,.6)" } }, r);
  s.curtR = mk("div", { cls: "abs", style: { right: "-40px", top: "240px", width: "150px", height: "760px", background: "repeating-linear-gradient(90deg, #7d1320 0 18px, #5a0b14 18px 44px)", borderRadius: "0 0 0 60px", boxShadow: "inset 20px 0 40px rgba(0,0,0,.6)" } }, r);
  s.beam = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", background: "conic-gradient(from 180deg at 540px 1980px, rgba(0,0,0,0) 0deg, rgba(0,0,0,0) 152deg, rgba(255,236,190,.16) 164deg, rgba(255,236,190,.22) 180deg, rgba(255,236,190,.16) 196deg, rgba(0,0,0,0) 208deg)", mixBlendMode: "screen" } }, r);
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  const rr = rng(1975);
  s.crowd = Array.from({ length: 34 }, (_, i) => { const row = i % 3; return { x: 40 + rr() * 1000, row, y: 1480 + row * 150, s: 0.8 + row * 0.25 + rr() * 0.15, ph: rr() * 6, arm: rr() < 0.55 }; }).sort((a, b) => a.row - b.row);
  s.coins = Array.from({ length: 46 }, (_, i) => {
    const x0 = 120 + rr() * 840, t0 = 34.95 + (i / 46) * 1.35 + rr() * 0.08;
    return { t0, x0, y0: 1500 + rr() * 260, x1: 180 + rr() * 720, y1: 360 + rr() * 440, dur: 0.72 + rr() * 0.22, spin: 9 + rr() * 10, ph: rr() * 6, kind: rr() < 0.45 ? "25" : rr() < 0.7 ? "50" : "₹1", gold: rr() < 0.62 };
  });
  s.lab1 = mk("div", { cls: "label", text: "25 paise", style: { left: "150px", top: "1010px", fontSize: "24px", opacity: "0" } }, r);
  s.lab2 = mk("div", { cls: "label red", text: "₹1", style: { left: "760px", top: "930px", fontSize: "26px", opacity: "0" } }, r);
  const sv = svgOver(r);
  s.arr1 = stroke(sv, arrowPath(300, 1040, 380, 930, 0.2), "#f6f0e2", 5); s.arr1h = stroke(sv, arrowHead(300, 1040, 380, 930, 0.2, 20), "#f6f0e2", 5);
  s.arr2 = stroke(sv, arrowPath(790, 960, 700, 860, -0.2), "#e11d48", 5); s.arr2h = stroke(sv, arrowHead(790, 960, 700, 860, -0.2, 20), "#e11d48", 5);
  s.card = mk("div", { cls: "abs", style: { left: "80px", top: "1120px", width: "920px", padding: "26px 32px", background: "#f6f0e2", color: "#0b0a09", boxShadow: "0 30px 60px rgba(0,0,0,.6)", opacity: "0", boxSizing: "border-box" } }, r);
  mk("div", { cls: "mono", text: "THE SINGLE-SCREEN OVATION", style: { fontSize: "22px", fontWeight: "700", letterSpacing: ".3em", color: "#b3122b" } }, s.card);
  mk("div", { cls: "anton", html: "Coins, flowers, whistles —<br>hurled at the hero", style: { fontSize: "74px", lineHeight: ".98", marginTop: "8px" } }, s.card);
  s.shade = mk("div", { cls: "fill", style: { background: "rgba(8,6,5,.9)", opacity: "0" } }, r);
  s.line = mk("div", { cls: "abs", style: { left: "96px", top: "360px", width: "5px", height: "1020px", background: "#e11d48", transformOrigin: "50% 0" } }, r);
  s.items = CLIPS_NEWS.map((c, i) => {
    const y = 370 + i * 168;
    const dot = mk("div", { cls: "abs", style: { left: "84px", top: y + 26 + "px", width: "29px", height: "29px", borderRadius: "50%", background: "#e11d48", border: "5px solid #0d0907" } }, r);
    const yr = mk("div", { cls: "abs mono", text: String(c[4]), style: { left: "0px", top: y + 72 + "px", width: "80px", textAlign: "center", fontSize: "20px", fontWeight: "700", color: "#f6f0e2" } }, r);
    const cl = clipping(r, c[0], c[1], c[2], c[3], 140, y, 880, true);
    return { dot, yr, cl };
  });
}, (s, t) => {
  const lt = t - 34.9;
  s.onScreen.set(t);
  const push = E.ioS(clamp(lt / 1.8));
  st(s.room, { transform: `translateY(${push * 40}px) scale(${1 + push * 0.06})`, transformOrigin: "540px 600px" });
  st(s.beam, { opacity: String(0.85 + 0.15 * Math.sin(t * 23) * Math.sin(t * 7)) });
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const dr = rng(77);
  for (let i = 0; i < 90; i++) { const bx = 540 + (dr() - 0.5) * 900 * dr(), by = (dr() * 1900 - lt * (20 + dr() * 40) + 1920) % 1920; c.fillStyle = `rgba(255,236,200,${(0.08 + dr() * 0.2).toFixed(2)})`; c.beginPath(); c.arc(bx + Math.sin(lt * 2 + i) * 6, by, 1 + dr() * 2.2, 0, 6.2832); c.fill(); }
  for (const q of s.coins) {
    const u = (t - q.t0) / q.dur; if (u < 0) continue;
    const drawCoin = (uu, alpha) => {
      const e = uu;
      const x = lerp(q.x0, q.x1, e), y = lerp(q.y0, q.y1, e) - Math.sin(Math.PI * e) * 260;
      const rad = lerp(34, 13, E.outQ(e));
      const ang = q.ph + (t - q.t0) * q.spin * (uu / Math.max(u, 1e-3)), ry = Math.max(2, rad * Math.abs(Math.cos(ang)));
      c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(0.25);
      c.fillStyle = q.gold ? "#e9b53a" : "#c7ccd3"; c.beginPath(); c.ellipse(0, 0, rad, ry, 0, 0, 6.2832); c.fill();
      c.lineWidth = Math.max(1.5, rad * 0.14); c.strokeStyle = q.gold ? "#9a6a0c" : "#7b8189"; c.stroke();
      c.lineWidth = Math.max(1, rad * 0.06); c.strokeStyle = q.gold ? "#fff0b0" : "#ffffff";
      c.beginPath(); c.ellipse(0, 0, rad * 0.7, ry * 0.7, 0, 0, 6.2832); c.stroke();
      if (ry > rad * 0.45 && alpha > 0.9) { c.scale(1, ry / rad); c.fillStyle = q.gold ? "#7a5208" : "#4f555c"; c.font = `700 ${Math.round(rad * 0.8)}px 'Roboto Mono'`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(q.kind, 0, 1); }
      c.restore();
    };
    if (u <= 1) {
      for (let g = 3; g >= 1; g--) drawCoin(Math.max(0, u - g * 0.05), 0.12 * (4 - g));
      drawCoin(u, 1);
    } else if (u < 1.35) {
      const k = (u - 1) / 0.35; c.strokeStyle = `rgba(255,244,210,${(1 - k).toFixed(2)})`; c.lineWidth = 3;
      for (let a = 0; a < 6; a++) { const aa = a * 1.047 + q.ph; c.beginPath(); c.moveTo(q.x1 + Math.cos(aa) * 8 * (1 + k * 3), q.y1 + Math.sin(aa) * 8 * (1 + k * 3)); c.lineTo(q.x1 + Math.cos(aa) * 16 * (1 + k * 3), q.y1 + Math.sin(aa) * 16 * (1 + k * 3)); c.stroke(); }
    }
  }
  for (const p of s.crowd) {
    const bob = Math.sin(t * 9 + p.ph) * 8 * p.s, x = p.x, y = p.y + bob, sc = p.s;
    c.fillStyle = ["#15111c", "#0b0910", "#030205"][p.row];
    if (p.arm) { c.strokeStyle = c.fillStyle; c.lineCap = "round"; c.lineWidth = 22 * sc; const th = Math.sin(t * 6 + p.ph); c.beginPath(); c.moveTo(x + 30 * sc, y + 40 * sc); c.lineTo(x + (50 + th * 30) * sc, y - (80 + th * 20) * sc); c.stroke(); }
    c.beginPath(); c.arc(x, y, 42 * sc, 0, 6.2832); c.fill();
    c.beginPath(); c.roundRect(x - 80 * sc, y + 34 * sc, 160 * sc, 260 * sc, 60 * sc); c.fill();
    c.strokeStyle = "rgba(255,230,190,.25)"; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 42 * sc, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
  }
  const a1 = pop(t, 35.45, 3, 0.5), a2 = pop(t, 35.7, 3, 0.5);
  st(s.lab1, { opacity: String(a1.o * (1 - P(t, 36.4, 36.6))), transform: `scale(${lerp(0.6, 1, a1.k)})` });
  st(s.lab2, { opacity: String(a2.o * (1 - P(t, 36.4, 36.6))), transform: `scale(${lerp(0.6, 1, a2.k)})` });
  drawOn(s.arr1, E.outC(P(t, 35.45, 35.7))); drawOn(s.arr1h, E.outC(P(t, 35.65, 35.75)));
  drawOn(s.arr2, E.outC(P(t, 35.7, 35.95))); drawOn(s.arr2h, E.outC(P(t, 35.9, 36.0)));
  const ak = clamp(1 - P(t, 36.4, 36.6)); [s.arr1, s.arr1h, s.arr2, s.arr2h].forEach((p) => st(p, { opacity: String(ak) }));
  const ck = sp(t, 35.95, 2.6, 0.6);
  st(s.card, { opacity: String(clamp((t - 35.95) / 0.1) * (1 - P(t, 36.45, 36.6))), transform: tf(0, (1 - ck) * 300, 1, lerp(5, -1.5, ck)) });
  const sh = clamp((t - 36.55) / 0.25);
  st(s.shade, { opacity: String(sh) });
  st(s.line, { transform: `scaleY(${E.outC(P(t, 36.6, 38.6))})`, opacity: String(sh) });
  s.items.forEach(({ dot, yr, cl }, i) => {
    const ti = 36.7 + i * 0.33, k = sp(t, ti, 2.8, 0.6), o = clamp((t - ti) / 0.06);
    st(dot, { opacity: String(o), transform: `scale(${lerp(0.2, 1, k)})` });
    st(yr, { opacity: String(o) });
    st(cl, { opacity: String(o), transform: tf((1 - k) * 700, 0, 1, (1 - k) * 8 + (i % 2 ? 0.6 : -0.6)) });
  });
});

/* ============ S13 — But every dream needed permission (38.85 – 42.42) ============ */
function scriptPage(parent, x, y, rot, title) {
  const p = mk("div", { cls: "abs", style: { left: x + "px", top: y + "px", width: "600px", height: "800px", background: "#f4f1ea", boxShadow: "0 20px 50px rgba(0,0,0,.55)", padding: "70px 64px", boxSizing: "border-box", fontFamily: "Courier New, monospace", color: "#1b1b1b", transform: `rotate(${rot}deg)` } }, parent);
  mk("div", { text: title, style: { fontSize: "34px", fontWeight: "700", textAlign: "center", textDecoration: "underline", marginBottom: "40px" } }, p);
  mk("div", { text: "FADE IN:", style: { fontSize: "28px", marginBottom: "22px" } }, p);
  mk("div", { style: { height: "470px", background: "repeating-linear-gradient(180deg, rgba(30,30,30,.55) 0 7px, transparent 7px 30px)", WebkitMask: "linear-gradient(90deg,#000 0 88%,transparent 88%)" } }, p);
  return p;
}
scene(38.85, 42.42, (s, r) => {
  s.bg = clipSlot(r, "v14_scripts", "scripts.jpg", {}, { drift: [0.02, 0, 0] });
  s.bg.t0 = 38.85;
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(10,18,30,.55), rgba(5,8,14,.78))" } }, r);
  s.pages = [scriptPage(r, 120, 400, -8, "THE DREAM"), scriptPage(r, 250, 360, 3, "UNTITLED"), scriptPage(r, 200, 440, -2, "MY FIRST FILM")];
  s.stamps = [["Rejected", 40, 170, 116], ["No budget", 20, 330, 100], ["No crew", 70, 480, 104], ["Not now", 90, 620, 108]].map(([txt, x, y, sz]) => stamp(s.pages[2], txt, x, y, sz));
  s.word = mk("div", { cls: "abs center-x serif", text: "Permission.", style: { top: "1240px", fontSize: "150px", color: "#f6f0e2", textShadow: "0 12px 40px rgba(0,0,0,.8)", opacity: "0" } }, r);
}, (s, t) => {
  s.bg.set(t, 1 + (t - 38.85) * 0.012);
  if (!CLIPS.v14_scripts) st(s.bg.el, { filter: "grayscale(.85) brightness(.6) contrast(1.1)" });
  s.pages.forEach((p, i) => { const k = sp(t, 38.9 + i * 0.12, 2.2, 0.65); st(p, { transform: `translateY(${(1 - k) * 1300}px) rotate(${[-8, 3, -2][i]}deg)` }); });
  [39.75, 40.1, 40.45, 40.8].forEach((ti, i) => { const k = sp(t, ti, 3.4, 0.5); st(s.stamps[i], { opacity: String(clamp((t - ti) / 0.03) * 0.92), transform: `rotate(${[-12, 8, -5, 6][i]}deg) scale(${lerp(2.2, 1, k)})` }); });
  const wk = sp(t, 40.83, 2.4, 0.6);
  st(s.word, { opacity: String(clamp((t - 40.83) / 0.1)), transform: `translateY(${(1 - wk) * 40}px)` });
  st(s.root, { opacity: String(1 - P(t, 42.25, 42.42)) });
});

/* ============ S14 — 1 vs 1,000 … Until now (42.3 – 49.95) ============ */
const GRID = { cols: 25, rows: 40, pw: 34, ph: 25, x0: 540 - 12.5 * 34, y0: 830 - 20 * 25 };
scene(42.3, 49.95, (s, r) => {
  st(r, { background: "#0b0b0c" });
  s.halo = mk("div", { cls: "abs", style: { left: "40px", top: "430px", width: "1000px", height: "800px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,236,200,.22) 0%, rgba(255,236,200,0) 62%)", opacity: "0" } }, r);
  s.hero = clipSlot(r, "v04_dance", "dance1950.jpg", { left: "220px", top: "650px", width: "640px", height: "360px", opacity: "0" }, { drift: [0.02, 0, 0] });
  s.hero.t0 = 42.3;
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.count = mk("div", { cls: "abs center-x mono", style: { top: "1262px", fontSize: "30px", fontWeight: "700", letterSpacing: ".2em", color: "#f6f0e2" } }, r);
  s.big = mk("div", { cls: "abs anton", style: { left: "50%", top: "1060px", fontSize: "170px", lineHeight: "1", color: "#f6f0e2", background: "rgba(11,11,12,.88)", padding: "10px 40px 0", translate: "-50% 0" } }, r);
  s.until = mk("div", { cls: "abs center-x", style: { top: "1040px", fontFamily: "Roboto", fontWeight: "300", fontSize: "76px", letterSpacing: ".34em", color: "#fff" } }, r);
  s.uw = words(s.until, "UNTIL NOW.");
  const sv = svgOver(r);
  s.cross = mk("g", { attrs: { stroke: "#e11d48", "stroke-width": 4, fill: "none" } }, sv);
  mk("line", { attrs: { x1: 540, y1: 670, x2: 540, y2: 990 } }, s.cross);
  mk("line", { attrs: { x1: 380, y1: 830, x2: 700, y2: 830 } }, s.cross);
  [[430, 720, 1, 1], [650, 720, -1, 1], [430, 940, 1, -1], [650, 940, -1, -1]].forEach(([x, y, dx, dy]) => mk("path", { attrs: { d: `M${x},${y + dy * 46} L${x},${y} L${x + dx * 46},${y}`, "stroke-width": 8 } }, s.cross));
}, (s, t) => {
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const G_ = GRID;
  const zoom = E.ioE(P(t, 44.6, 45.3));
  const heroIdx = 20 * G_.cols + 12;
  const hx = G_.x0 + 12 * G_.pw, hy = G_.y0 + 20 * G_.ph;
  const bw = lerp(640, G_.pw - 6, zoom), bh = bw * 9 / 16;
  const bx = lerp(220, hx + 3, zoom), by = lerp(650, hy + 3 + (G_.ph - 6 - (G_.pw - 6) * 9 / 16) / 2, zoom);
  s.hero.set(t, 1.12 - 0.1 * E.ioS(P(t, 42.3, 44.6)));
  st(s.halo, { opacity: String(clamp((t - 42.4) / 0.4) * (1 - P(t, 44.6, 45.0)) * (0.85 + 0.15 * Math.sin(t * 17) * Math.sin(t * 5))) });
  st(s.hero.box, { opacity: String(clamp((t - 42.4) / 0.15)), left: bx.toFixed(1) + "px", top: by.toFixed(1) + "px", width: bw.toFixed(1) + "px", height: bh.toFixed(1) + "px", boxShadow: `0 0 ${lerp(50, 8, zoom)}px rgba(255,240,210,.7)`, outline: `${lerp(10, 1, zoom).toFixed(1)}px solid #f6f0e2` });
  const ignite = (i, j) => 48.73 + (Math.hypot(i - 12, (j - 20) * 0.75) / 23) * 0.85;
  const dim = lerp(1, 0.28, P(t, 45.6, 46.2)) * lerp(1, 0.55, P(t, 46.43, 46.6));
  for (let j = 0; j < G_.rows; j++) for (let i = 0; i < G_.cols; i++) {
    const idx = j * G_.cols + i; if (idx === heroIdx) continue;
    const d = Math.hypot(i - 12, j - 20) / 24, ta = 44.95 + d * 0.7 + hash(idx) * 0.12;
    if (t < ta) continue;
    const a = clamp((t - ta) / 0.12);
    const x = G_.x0 + i * G_.pw + 3, y = G_.y0 + j * G_.ph + 3, w = G_.pw - 6, h = G_.ph - 6;
    const ig = t >= 48.6 ? clamp((t - ignite(i, j)) / 0.25) : 0;
    if (ig > 0) {
      c.fillStyle = `rgba(225,29,72,${0.35 + 0.65 * ig})`; c.fillRect(x, y, w, h);
      c.fillStyle = `rgba(255,220,225,${0.5 * ig * clamp(1 - (t - ignite(i, j)) / 0.5)})`; c.fillRect(x, y, w, h);
    } else { c.strokeStyle = `rgba(200,200,205,${0.55 * a * dim})`; c.lineWidth = 2; c.strokeRect(x, y, w, h); }
  }
  let big = "", cnt = "";
  if (t < 44.6) cnt = t > 42.6 ? "1 FILM MADE" : "";
  else if (t < 46.43) { big = Math.round(lerp(1, 1000, E.outC(P(t, 44.95, 45.7)))).toLocaleString("en-IN"); cnt = t > 45.6 ? "NEVER MADE" : "…"; }
  if (s.big.textContent !== big) s.big.textContent = big;
  if (s.count.textContent !== cnt) s.count.textContent = cnt;
  st(s.big, { opacity: String(clamp((t - 44.7) / 0.1) * (1 - P(t, 46.2, 46.43))) });
  st(s.count, { opacity: String(clamp((t - 42.6) / 0.15) * (1 - P(t, 46.2, 46.43))), color: t > 45.6 ? "#9a9aa0" : "#f6f0e2" });
  const ck = sp(t, 46.43, 2.6, 0.45);
  st(s.cross, { opacity: String(clamp((t - 46.43) / 0.05) * (1 - P(t, 49.6, 49.8))), transform: `scale(${lerp(1.6, 1, ck)})`, transformOrigin: "540px 830px" });
  st(s.until, { opacity: String(1 - P(t, 49.45, 49.7)) });
  s.uw.forEach((w, i) => { const ti = [47.33, 48.12][i]; st(w, { opacity: String(clamp((t - ti) / 0.25)), filter: `blur(${(8 * (1 - clamp((t - ti) / 0.3))).toFixed(1)}px)` }); });
  const shake = t > 48.73 ? (t - 48.73) * 6 : 0;
  st(s.root, { transform: `translate(${noise1(t * 30, 1) * shake}px, ${noise1(t * 30, 2) * shake}px) scale(${1 + E.inC(P(t, 48.73, 49.88)) * 0.25})` });
});

/* ============ S15 — 2026 · nothing has changed · only the tools did (49.86 – 53.35) ============ */
function cameraIcon(kind) {
  const P_ = { fill: "#f6f0e2" }, R_ = { fill: "#e11d48" };
  const parts = {
    crank: [["rect", { x: 40, y: 60, width: 120, height: 80, rx: 6 }, P_], ["circle", { cx: 75, cy: 38, r: 28 }, P_], ["circle", { cx: 130, cy: 38, r: 28 }, P_], ["rect", { x: 160, y: 88, width: 26, height: 24, rx: 4 }, P_], ["rect", { x: 172, y: 110, width: 8, height: 36 }, R_], ["rect", { x: 14, y: 84, width: 28, height: 32, rx: 3 }, P_]],
    studio: [["rect", { x: 30, y: 44, width: 150, height: 96, rx: 22 }, P_], ["rect", { x: 0, y: 70, width: 34, height: 44, rx: 6 }, P_], ["rect", { x: 70, y: 18, width: 70, height: 28, rx: 10 }, R_], ["rect", { x: 96, y: 140, width: 18, height: 26 }, P_]],
    film35: [["rect", { x: 50, y: 70, width: 120, height: 72, rx: 8 }, P_], ["rect", { x: 70, y: 20, width: 90, height: 52, rx: 26 }, P_], ["rect", { x: 10, y: 84, width: 42, height: 44, rx: 4 }, P_], ["rect", { x: 0, y: 76, width: 12, height: 60 }, R_], ["rect", { x: 170, y: 88, width: 34, height: 18, rx: 4 }, P_]],
    digital: [["rect", { x: 70, y: 62, width: 84, height: 78, rx: 8 }, P_], ["rect", { x: 30, y: 84, width: 42, height: 36, rx: 4 }, P_], ["rect", { x: 110, y: 18, width: 84, height: 50, rx: 6 }, R_], ["rect", { x: 118, y: 26, width: 68, height: 34, rx: 3 }, { fill: "#0b0a09" }], ["rect", { x: 154, y: 90, width: 30, height: 14, rx: 3 }, P_]],
  }[kind];
  const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sv.setAttribute("viewBox", "0 0 220 170"); sv.setAttribute("width", "220"); sv.setAttribute("height", "170");
  for (const [tag, at, fill] of parts) mk(tag, { attrs: Object.assign({}, at, fill) }, sv);
  return sv;
}
scene(49.86, 53.35, (s, r) => {
  st(r, { background: "#070707" });
  s.bgv = clipSlot(r, "v11_dreamer", "dreamer.jpg", { opacity: "0", filter: "blur(3px)" }, { offset: 0.4 });
  s.bgv.t0 = 49.86;
  mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 45%, rgba(7,7,7,.35) 0%, rgba(7,7,7,.88) 70%)" } }, r);
  s.red = mk("div", { cls: "fill", style: { background: "radial-gradient(circle at 50% 45%, #e11d48 0%, #7a0a1c 55%, #070707 100%)" } }, r);
  s.rings = [0, 1].map((i) => mk("div", { cls: "abs", style: { left: "140px", top: "380px", width: "800px", height: "800px", borderRadius: "50%", border: `${i ? 6 : 22}px solid rgba(255,255,255,.95)`, opacity: "0", boxSizing: "border-box" } }, r));
  s.flare = mk("div", { cls: "abs", style: { left: "-200px", top: "766px", width: "1480px", height: "28px", borderRadius: "14px", background: "linear-gradient(90deg, rgba(120,170,255,0) 0%, rgba(150,195,255,.85) 30%, #fff 50%, rgba(150,195,255,.85) 70%, rgba(120,170,255,0) 100%)", filter: "blur(5px)", opacity: "0", mixBlendMode: "screen" } }, r);
  s.year = mk("div", { cls: "abs center-x anton", text: "2026", style: { top: "560px", fontSize: "440px", lineHeight: "1", color: "#fff" } }, r);
  s.nhc = mk("div", { cls: "abs center-x serif", style: { top: "800px", fontSize: "104px", lineHeight: "1.05", color: "#f6f0e2" } }, r);
  s.nw = words(s.nhc, "Nothing has changed.");
  s.kick = mk("div", { cls: "abs center-x mono", text: "ONLY THE TOOLS DID", style: { top: "1010px", fontSize: "26px", fontWeight: "700", letterSpacing: ".3em", color: "#e11d48", opacity: "0" } }, r);
  s.row = [["crank", "1913", "Hand-cranked"], ["studio", "1950s", "Studio 35 mm"], ["film35", "1990s", "35 mm"], ["digital", "2010s", "Digital"]].map(([k, y, l], i) => {
    const box = mk("div", { cls: "abs", style: { left: 30 + i * 225 + "px", top: "1090px", width: "220px", textAlign: "center", opacity: "0" } }, r);
    box.appendChild(cameraIcon(k));
    mk("div", { cls: "anton", text: y, style: { fontSize: "44px", color: "#fff", marginTop: "6px" } }, box);
    mk("div", { cls: "mono", text: l.toUpperCase(), style: { fontSize: "17px", letterSpacing: ".12em", color: "rgba(246,240,226,.75)" } }, box);
    return box;
  });
  const sv = svgOver(r);
  s.arrows = [0, 1, 2].map((i) => stroke(sv, `M${230 + i * 225},1160 L${258 + i * 225},1160`, "#e11d48", 6));
  s.q = mk("div", { cls: "abs anton", text: "?", style: { left: "930px", top: "1070px", fontSize: "150px", color: "#e11d48", opacity: "0" } }, r);
}, (s, t) => {
  s.bgv.set(t);
  st(s.bgv.box, { opacity: String(0.5 * clamp((t - 50.1) / 0.9)) });
  const k = sp(t, 49.88, 2.8, 0.42);
  const up = E.ioC(P(t, 50.1, 50.45));
  st(s.year, { transform: `translateY(${-up * 230}px) scale(${lerp(1.5, 1, k) * lerp(1, 0.46, up)})` });
  st(s.red, { opacity: String(lerp(1, 0, E.outC(P(t, 49.9, 50.9)))) });
  s.rings.forEach((el, i) => { const u = P(t, 49.88 + i * 0.07, 50.55 + i * 0.1); st(el, { opacity: String(u > 0 && u < 1 ? (1 - E.outQ(u)) : 0), transform: `scale(${(0.08 + E.outC(u) * 2.6).toFixed(3)})` }); });
  const fu = P(t, 49.88, 50.4);
  st(s.flare, { opacity: String(fu > 0 && fu < 1 ? 1 - E.outQ(fu) : 0), transform: `scaleX(${(0.2 + E.outC(fu) * 1.1).toFixed(3)}) scaleY(${(1 - fu * 0.6).toFixed(3)})` });
  const wt = [50.41, 50.72, 51.0];
  s.nw.forEach((w, i) => { const kk = sp(t, wt[i], 2.6, 0.6); st(w, { opacity: String(clamp((t - wt[i]) / 0.1)), transform: `translateY(${(1 - kk) * 50}px)` }); });
  st(s.kick, { opacity: String(clamp((t - 51.5) / 0.15)) });
  s.row.forEach((b, i) => { const ti = 51.7 + i * 0.3, q = sp(t, ti, 3, 0.5); st(b, { opacity: String(clamp((t - ti) / 0.06)), transform: `translateY(${(1 - q) * 80}px) scale(${lerp(0.6, 1, q)})` }); });
  s.arrows.forEach((a, i) => drawOn(a, E.outC(P(t, 51.88 + i * 0.3, 52.06 + i * 0.3))));
  const qk = sp(t, 52.9, 3, 0.4);
  st(s.q, { opacity: String(clamp((t - 52.9) / 0.05)), transform: `scale(${lerp(2, 1, qk)})` });
  const w = E.inE(P(t, 53.12, 53.35));
  st(s.root, { opacity: String(1 - w), transform: `scale(${1 + w * 0.4})`, transformOrigin: "980px 1150px" });
});

/* ============ S16 — Only now, the camera is your imagination (53.25 – 58.4; designed on a +0.35 s clock) ============ */
scene(53.25, 58.4, (s, r) => {
  st(r, { background: "#070707" });
  s.stack = mk("div", { cls: "abs", style: { left: "220px", top: "440px", width: "640px", height: "860px" } }, r);
  s.pr = printClip(s.stack, "v02_camera1913", "camera1913.jpg", 0, 0, 640, 860, { drift: [0.03, 0, 0] });
  s.pr.slot.t0 = 53.5;
  s.dream = clipSlot(s.stack, "v11_dreamer", "dreamer.jpg", { left: "16px", top: "16px", width: "608px", height: "828px", opacity: "0" }, { drift: [0.05, 0, 0] });
  s.noise = mk("canvas", { attrs: { width: 152, height: 207 }, cls: "abs", style: { left: "16px", top: "16px", width: "608px", height: "828px", imageRendering: "pixelated", opacity: "0" } }, s.stack);
  s.nctx = s.noise.getContext("2d");
  s.scan = mk("div", { cls: "abs", style: { left: "16px", width: "608px", height: "6px", background: "#ff2d55", boxShadow: "0 0 30px 8px rgba(255,45,85,.8)", opacity: "0" } }, s.stack);
  s.l1 = mk("div", { cls: "label", text: "The camera", style: { left: "560px", top: "356px", fontSize: "34px" } }, r);
  const sv = svgOver(r);
  s.strike = stroke(sv, "M556,390 L824,388", "#ff2d55", 9);
  s.l2 = mk("div", { cls: "label red", text: "Your imagination", style: { left: "430px", top: "468px", fontSize: "40px" } }, r);
  s.bar = mk("div", { cls: "abs", style: { left: "80px", top: "1340px", width: "920px", height: "96px", borderRadius: "48px", background: "rgba(20,20,22,.94)", border: "2px solid rgba(255,255,255,.18)", boxShadow: "0 20px 60px rgba(0,0,0,.6)" } }, r);
  s.prompt = mk("div", { cls: "abs mono", style: { left: "36px", top: "30px", fontSize: "27px", color: "#f6f0e2", whiteSpace: "nowrap" } }, s.bar);
  s.btn = mk("div", { cls: "abs mono", text: "GENERATE", style: { right: "10px", top: "10px", height: "76px", lineHeight: "76px", padding: "0 28px", borderRadius: "38px", background: "#e11d48", color: "#fff", fontSize: "23px", fontWeight: "700", letterSpacing: ".12em" } }, s.bar);
  s.prog = mk("div", { cls: "abs mono", style: { left: "34px", bottom: "34px", padding: "9px 14px 8px", background: "rgba(8,8,10,.8)", fontSize: "21px", fontWeight: "700", letterSpacing: ".12em", color: "#ff2d55", opacity: "0", whiteSpace: "nowrap" } }, s.stack);
  s.ptxt = "a dreamer on a Bengaluru rooftop, 4K";
}, (s, tReal) => {
  const t = tReal + 0.35;
  const pk = sp(t, 53.52, 2.1, 0.62);
  st(s.stack, { opacity: String(clamp((t - 53.52) / 0.06)), transform: tf(0, (1 - pk) * 1200, 1, lerp(12, -2, pk)) });
  s.pr.slot.set(t);
  st(s.pr.slot.el, { filter: "grayscale(1) contrast(1.1)" });
  const l1 = pop(t, 54.97, 3, 0.5);
  st(s.l1, { opacity: String(l1.o), transform: tf(0, 0, lerp(0.6, 1, l1.k), -2) });
  drawOn(s.strike, E.outC(P(t, 55.9, 56.1)));
  const l2 = pop(t, 56.12, 3, 0.45);
  st(s.l2, { opacity: String(l2.o), transform: tf(0, 0, lerp(0.5, 1, l2.k), -3) });
  const kb = sp(t, 53.7, 2.4, 0.7);
  st(s.bar, { opacity: String(clamp((t - 53.7) / 0.1)), transform: `translateY(${(1 - kb) * 200}px)` });
  const n = Math.floor(P(t, 53.85, 55.75) * s.ptxt.length);
  const cur = Math.floor(t * 3) % 2 ? "▍" : " ";
  const txt = s.ptxt.slice(0, n) + (t < 55.9 ? cur : "");
  if (s.prompt.textContent !== txt) s.prompt.textContent = txt;
  st(s.btn, { transform: `scale(${t > 55.8 && t < 56.0 ? 0.9 : 1})`, background: t > 55.8 ? "#ff2d55" : "#e11d48" });
  const rv = P(t, 55.97, 57.1);
  s.dream.t0 = 55.97; s.dream.set(t);
  st(s.dream.box, { opacity: String(E.outC(clamp(rv * 1.4))), filter: `blur(${((1 - E.outC(rv)) * 30).toFixed(1)}px) saturate(${lerp(0.3, 1.1, rv).toFixed(2)})` });
  if (rv > 0 && rv < 1) {
    const d = s.nctx.createImageData(152, 207), rr = rng(Math.round(t * FPS) * 7 + 1);
    for (let i = 0; i < d.data.length; i += 4) { const v = rr() * 255; d.data[i] = v; d.data[i + 1] = v * 0.9; d.data[i + 2] = v * 0.95; d.data[i + 3] = 255; }
    s.nctx.putImageData(d, 0, 0);
  }
  st(s.noise, { opacity: String(rv > 0 && rv < 1 ? (1 - E.outC(rv)) * 0.85 : 0) });
  st(s.scan, { opacity: String(rv > 0 && rv < 1 ? 1 : 0), top: `${16 + E.ioC(rv) * 828}px` });
  const pct = Math.round(E.outC(rv) * 100);
  const ptx = rv > 0 && rv < 1 ? `GENERATING · 4K · ${pct}%` : rv >= 1 ? "RENDERED · 3840 × 2160" : "";
  if (s.prog.textContent !== ptx) s.prog.textContent = ptx;
  st(s.prog, { opacity: String(rv > 0 ? 1 - P(t, 58.3, 58.5) : 0) });
  whipOut(s, t, 58.55, 58.75, "y", -1500);
});

/* ============ S17 — Small budgets. Impossible dreams. (58.25 – 62.55; v3 choreography warped onto the v4 voice) ============ */
const WORK = [
  ["hs-tata1mg.jpg", "Commercial"], ["hs-kookie.jpg", "3D animation"], ["hs-ilaiyaraaja.jpg", "Tribute film"], ["hs-dominoz.jpg", "Product film"],
  ["hs-horror.jpg", "Ad film"], ["hs-zepto.jpg", "Brand film"], ["hs-portfolio-3.jpg", "CGI spot"], ["hs-portfolio-2.jpg", "Product film"],
  ["hs-portfolio-1.jpg", "Commercial"], ["hs-portfolio-4.jpg", "Launch film"],
];
const S17_WARP = [[58.05, 58.8], [58.22, 58.97], [59.45, 60.2], [60.6, 61.5], [60.75, 61.65], [62.35, 63.75], [62.55, 63.95]];
scene(58.25, 62.55, (s, r) => {
  st(r, { background: "#0a0a0a" });
  s.world3d = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", perspective: "1400px", perspectiveOrigin: "540px 600px" } }, r);
  s.plane = mk("div", { cls: "abs", style: { left: "-420px", top: "-400px", width: "1920px", height: "3000px", transformStyle: "preserve-3d", transform: "rotateX(24deg) rotateZ(-12deg)" } }, s.world3d);
  s.kb = [];
  s.cols = [0, 1, 2].map((ci) => {
    const col = mk("div", { cls: "abs", style: { left: ci * 640 + "px", top: "0", width: "620px" } }, s.plane);
    for (let i = 0; i < 12; i++) {
      const [src, lab] = WORK[(i * 3 + ci * 4) % WORK.length];
      const c = mk("div", { cls: "abs", style: { left: "0", top: i * 370 + "px", width: "620px", height: "349px", overflow: "hidden", background: "#111", boxShadow: "0 20px 40px rgba(0,0,0,.6)" } }, col);
      s.kb.push(mk("img", { src: img(src), cls: "cover", style: { transformOrigin: `${30 + ((i * 37 + ci * 11) % 40)}% 50%` } }, c));
      mk("div", { cls: "label", text: lab, style: { left: "16px", bottom: "16px", fontSize: "20px", background: "rgba(10,10,10,.85)" } }, c);
    }
    return col;
  });
  mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.7) 100%)" } }, r);
  s.chip = mk("div", { cls: "label red", text: "Made at Hinton Studios", style: { left: "50%", top: "400px", translate: "-50% 0", fontSize: "24px" } }, r);
  s.band = mk("div", { cls: "abs", style: { left: "0", top: "700px", width: "1080px", height: "340px", background: "#e11d48", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)" } }, r);
  s.small = mk("div", { cls: "abs center-x serif", text: "Here's to the ones with", style: { top: "36px", fontStyle: "italic", fontSize: "60px", color: "#fff" } }, s.band);
  s.w1 = mk("div", { cls: "abs center-x anton", text: "Small budgets.", style: { top: "120px", fontSize: "170px", lineHeight: "1", color: "#fff" } }, s.band);
  s.w2 = mk("div", { cls: "abs center-x anton", html: "Impossible<br>dreams.", style: { top: "40px", fontSize: "210px", lineHeight: ".95", color: "#fff" } }, s.band);
}, (s, tReal) => {
  const t = warp(tReal, S17_WARP);
  const lt = t - 58.6;
  s.cols.forEach((col, ci) => { const sp_ = [320, 420, 360][ci]; const off = sp_ * lt + 60 * lt * lt; st(col, { transform: `translateY(${-(off + ci * 150) % 1110 - 200}px)` }); });
  s.kb.forEach((im, i) => st(im, { transform: `scale(${(1.1 + 0.08 * Math.sin(tReal * 0.9 + i * 1.3)).toFixed(4)})` }));
  st(s.plane, { transform: `rotateX(${24 - lt * 1.5}deg) rotateZ(${-12 + lt * 0.8}deg) translateZ(${lt * 40}px)` });
  const c = pop(t, 58.8, 3, 0.5);
  st(s.chip, { opacity: String(c.o), transform: `scale(${lerp(0.6, 1, c.k)})` });
  const bk = sp(t, 58.95, 2.4, 0.6);
  const grow = E.ioC(P(t, 61.5, 61.8));
  st(s.band, { transform: `scaleY(${bk})`, height: `${lerp(340, 520, grow)}px`, top: `${lerp(700, 610, grow)}px` });
  st(s.small, { opacity: String(clamp((t - 58.97) / 0.15) * (1 - P(t, 61.4, 61.6))) });
  const k1 = sp(t, 60.2, 2.6, 0.5);
  st(s.w1, { opacity: String(clamp((t - 60.2) / 0.06) * (1 - P(t, 61.45, 61.6))), transform: `scale(${lerp(1.6, 1, k1)})` });
  const k2 = sp(t, 61.65, 2.6, 0.45);
  st(s.w2, { opacity: String(clamp((t - 61.65) / 0.06)), transform: `scale(${lerp(1.8, 1, k2)})` });
  const w = E.inE(P(t, 63.75, 63.95));
  st(s.root, { opacity: String(1 - w), transform: `scale(${1 + w * 0.3})` });
});

/* ============ S18 — Made in India. For the world. (62.45 – 65.95) ============ */
const CITIES = [["London", 51.5, -0.12], ["New York", 40.71, -74.0], ["Dubai", 25.2, 55.27], ["Singapore", 1.35, 103.82], ["Tokyo", 35.68, 139.69], ["Sydney", -33.87, 151.21], ["Paris", 48.85, 2.35], ["Lagos", 6.52, 3.38], ["São Paulo", -23.55, -46.63], ["Los Angeles", 34.05, -118.24], ["Nairobi", -1.29, 36.82], ["Toronto", 43.65, -79.38], ["Hong Kong", 22.3, 114.17], ["Moscow", 55.75, 37.62]];
const BLR = [12.97, 77.59];
function ortho(lat, lon, lat0, lon0, R, cx, cy) {
  const f = (lat * Math.PI) / 180, l = (lon * Math.PI) / 180, f0 = (lat0 * Math.PI) / 180, l0 = (lon0 * Math.PI) / 180;
  const cosc = Math.sin(f0) * Math.sin(f) + Math.cos(f0) * Math.cos(f) * Math.cos(l - l0);
  return [cx + R * Math.cos(f) * Math.sin(l - l0), cy - R * (Math.cos(f0) * Math.sin(f) - Math.sin(f0) * Math.cos(f) * Math.cos(l - l0)), cosc];
}
function slerpLL(a, b, u) {
  const toV = ([la, lo]) => { const f = (la * Math.PI) / 180, l = (lo * Math.PI) / 180; return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)]; };
  const A = toV(a), B = toV(b); const d = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1)); const sn = Math.sin(d) || 1;
  const k1 = Math.sin((1 - u) * d) / sn, k2 = Math.sin(u * d) / sn;
  const v = [A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2];
  return [(Math.asin(v[2]) * 180) / Math.PI, (Math.atan2(v[1], v[0]) * 180) / Math.PI, d];
}
scene(62.45, 65.95, (s, r) => {
  st(r, { background: "radial-gradient(circle at 50% 42%, #16171e 0%, #050506 70%)" });
  s.stars = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.sctx = s.stars.getContext("2d");
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.name = mk("div", { cls: "abs anton", text: "Bengaluru, India", style: { left: "600px", top: "770px", fontSize: "70px", lineHeight: "1", color: "#fff" } }, r);
  s.coord = mk("div", { cls: "abs mono", text: "12.97° N · 77.59° E", style: { left: "604px", top: "852px", fontSize: "24px", letterSpacing: ".12em", color: "#f6f0e2" } }, r);
  s.hq = mk("div", { cls: "label red", text: "Hinton Studios HQ", style: { left: "600px", top: "900px", fontSize: "22px" } }, r);
  s.t1 = mk("div", { cls: "abs center-x anton", text: "Made in India.", style: { top: "1180px", fontSize: "140px", lineHeight: "1", color: "#fff" } }, r);
  s.t2 = mk("div", { cls: "abs center-x anton", text: "For the world.", style: { top: "1180px", fontSize: "140px", lineHeight: "1", color: "#e11d48" } }, r);
}, (s, t) => {
  // drifting star field behind the globe
  const sc = s.sctx; sc.clearRect(0, 0, 1080, 1920);
  const sr = rng(2026);
  for (let i = 0; i < 160; i++) { const x = (sr() * 1080 - (t - 62.45) * (8 + sr() * 18) + 1080) % 1080, y = sr() * 1920, a = 0.15 + sr() * 0.45 * (0.6 + 0.4 * Math.sin(t * 3 + i)); sc.fillStyle = `rgba(246,240,226,${a.toFixed(2)})`; sc.fillRect(x, y, 2, 2); }
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  const z = E.ioE(P(t, 63.9, 64.85));
  const R = lerp(lerp(5600, 4300, P(t, 62.45, 63.9)), 430, z);
  const lat0 = lerp(BLR[0], 18, z), lon0 = lerp(BLR[1], 52, z) - Math.max(0, t - 64.85) * 9;
  const cx = 540, cy = lerp(860, 790, z);
  if (z > 0.15) {
    const a = clamp((z - 0.15) / 0.3);
    const gl = c.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
    gl.addColorStop(0, `rgba(225,29,72,${0.35 * a})`); gl.addColorStop(1, "rgba(225,29,72,0)");
    c.fillStyle = gl; c.beginPath(); c.arc(cx, cy, R * 1.25, 0, 6.2832); c.fill();
    const sg = c.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    sg.addColorStop(0, `rgba(58,60,74,${a})`); sg.addColorStop(1, `rgba(14,15,20,${a})`);
    c.fillStyle = sg; c.beginPath(); c.arc(cx, cy, R, 0, 6.2832); c.fill();
    c.strokeStyle = `rgba(246,240,226,${0.07 * a})`; c.lineWidth = 1.2;
    for (let la = -60; la <= 60; la += 30) { c.beginPath(); let st0 = false; for (let lo = -180; lo <= 180; lo += 4) { const [x, y, cc] = ortho(la, lo, lat0, lon0, R, cx, cy); if (cc > 0) { st0 ? c.lineTo(x, y) : c.moveTo(x, y); st0 = true; } else st0 = false; } c.stroke(); }
    for (let lo = -180; lo < 180; lo += 30) { c.beginPath(); let st0 = false; for (let la = -85; la <= 85; la += 4) { const [x, y, cc] = ortho(la, lo, lat0, lon0, R, cx, cy); if (cc > 0) { st0 ? c.lineTo(x, y) : c.moveTo(x, y); st0 = true; } else st0 = false; } c.stroke(); }
  }
  const drawSet = (pts, rad, alpha) => {
    if (alpha <= 0.01) return;
    for (const [lo, la] of pts) {
      const [x, y, cc] = ortho(la, lo, lat0, lon0, R, cx, cy);
      if (cc <= 0 || x < -20 || x > 1100 || y < -20 || y > 1940) continue;
      c.fillStyle = `rgba(246,240,226,${alpha * (0.35 + 0.65 * cc)})`;
      c.beginPath(); c.arc(x, y, rad * (0.5 + 0.5 * cc), 0, 6.2832); c.fill();
    }
  };
  drawSet(LAND.india, lerp(7, 2, z), 0.5 * (1 - clamp((z - 0.35) / 0.3)));
  drawSet(LAND.world, lerp(10, 2.3, z), 0.6 * clamp((z - 0.15) / 0.3));
  CITIES.forEach(([nm, la_, lo_], i) => {
    const ta = 64.3 + i * 0.07; if (t < ta) return;
    const city = [la_, lo_];
    const u = E.outC(clamp((t - ta) / 0.75));
    c.strokeStyle = "#e11d48"; c.lineWidth = 3.5; c.shadowColor = "#ff2d55"; c.shadowBlur = 12; c.beginPath();
    let started = false, last = null;
    for (let k = 0; k <= 40; k++) {
      const uu = (k / 40) * u; const [la, lo, d] = slerpLL(BLR, city, uu);
      const lift = 1 + Math.sin(Math.PI * uu) * 0.2 * Math.min(1, d);
      const [x, y, cc] = ortho(la, lo, lat0, lon0, R * lift, cx, cy);
      if (cc < -0.05) { started = false; continue; }
      if (!started) { c.moveTo(x, y); started = true; } else c.lineTo(x, y);
      last = [x, y];
    }
    c.stroke(); c.shadowBlur = 0;
    if (last && u < 1) { c.fillStyle = "#fff"; c.beginPath(); c.arc(last[0], last[1], 6, 0, 6.2832); c.fill(); }
    if (u >= 1) {
      const [x, y, cc] = ortho(la_, lo_, lat0, lon0, R, cx, cy);
      if (cc > 0.05) {
        c.fillStyle = "#ff2d55"; c.beginPath(); c.arc(x, y, 7, 0, 6.2832); c.fill();
        c.font = "700 17px 'Roboto Mono'"; c.fillStyle = `rgba(246,240,226,${clamp((t - ta - 0.75) / 0.2) * cc})`; c.textAlign = "left"; c.fillText(nm.toUpperCase(), x + 12, y + 6);
      }
    }
  });
  const [bx, by, bc] = ortho(BLR[0], BLR[1], lat0, lon0, R, cx, cy);
  if (bc > 0) {
    const pulse = (t * 1.6) % 1;
    c.strokeStyle = `rgba(225,29,72,${1 - pulse})`; c.lineWidth = 4; c.beginPath(); c.arc(bx, by, 20 + pulse * 60 * (1 - z * 0.6), 0, 6.2832); c.stroke();
    c.fillStyle = "#e11d48"; c.beginPath(); c.arc(bx, by, lerp(16, 9, z), 0, 6.2832); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 3; c.stroke();
  }
  const na = clamp((t - 62.5) / 0.15) * (1 - P(t, 63.75, 63.95));
  [s.name, s.coord, s.hq].forEach((el, i) => st(el, { opacity: String(na), transform: `translateX(${(1 - sp(t, 62.5 + i * 0.1, 2.4, 0.6)) * 80}px)` }));
  const k1 = sp(t, 62.92, 2.6, 0.5);
  st(s.t1, { opacity: String(clamp((t - 62.92) / 0.06) * (1 - P(t, 64.12, 64.3))), transform: `scale(${lerp(1.5, 1, k1)})` });
  const k2 = sp(t, 64.37, 2.6, 0.5);
  st(s.t2, { opacity: String(clamp((t - 64.37) / 0.06)), transform: `translateY(${lerp(0, 190, z)}px) scale(${lerp(1.5, 1, k2)})` });
  const w = E.inE(P(t, 65.62, 65.85));
  st(s.root, { opacity: String(1 - w), transform: `scale(${1 + w * 0.5})` });
});

/* ============ S19 — Hinton Studios. Dream in 4K. (65.81 – 69.09): an LED wall, then SD → HD → 4K ============ */
const RES = [[67.38, 26, 480, "SD", "480p"], [67.72, 8, 720, "HD", "1080p"], [68.12, 1, 1080, "4K", "2160p"]];
const resK = (t) => ({ sd: spring(t - 67.38, 3, 0.72), hd: spring(t - 67.72, 2.6, 0.78), k4: spring(t - 68.12, 2.4, 0.8) });
scene(65.81, 69.09, (s, r) => {
  st(r, { background: "#050505" });
  s.fest = vidSource(r, "v13_fdfs", { t0: 65.81, offset: 5.2 });
  s.hero = vidSource(r, "v05_billboard", { t0: 67.3 });
  s.cv = mk("canvas", { attrs: { width: 1080, height: 1920 }, cls: "full" }, r);
  s.ctx = s.cv.getContext("2d");
  s.led = document.createElement("canvas"); s.led.width = 27; s.led.height = 48;
  s.vig = mk("div", { cls: "fill", style: { background: "radial-gradient(ellipse at 50% 50%, rgba(5,5,5,.2) 0%, rgba(5,5,5,.75) 70%)" } }, r);
  const sv = svgOver(r);
  s.ticks = [[0, 960, 70, 960], [1010, 960, 1080, 960], [540, 240, 540, 300], [540, 1620, 540, 1680]].map(([x1, y1, x2, y2]) => mk("line", { attrs: { x1, y1, x2, y2, stroke: "#fff", "stroke-width": 3, opacity: 0.8 } }, sv));
  s.marks = [[60, 300, 1, 1], [1020, 300, -1, 1], [60, 1620, 1, -1], [1020, 1620, -1, -1]].map(([x, y, dx, dy]) => mk("path", { attrs: { d: `M${x},${y + dy * 56} L${x},${y} L${x + dx * 56},${y}`, stroke: "#fff", "stroke-width": 4, fill: "none" } }, sv));
  s.brand = mk("div", { cls: "abs center-x", style: { top: "760px", fontFamily: "Roboto", fontSize: "150px", lineHeight: "1.02", color: "#fff", letterSpacing: ".07em", textShadow: "0 0 40px rgba(255,255,255,.25), 0 10px 40px rgba(0,0,0,.7)" } }, r);
  s.bl = letters(s.brand, "HINTON STUDIOS");
  s.bl.forEach((el, i) => { el.style.fontWeight = i < 6 ? "800" : "300"; });
  s.brand.insertBefore(document.createElement("br"), s.bl[7]);
  s.sub = mk("div", { cls: "abs center-x mono", text: "HUMAN-DIRECTED · AI-EXECUTED · BENGALURU", style: { top: "1110px", fontSize: "25px", fontWeight: "700", letterSpacing: ".2em", color: "#ff2d55", textShadow: "0 2px 12px rgba(0,0,0,.8)" } }, r);
  s.chips = RES.map(([ti, blk, w, a, b], i) => {
    const h = (w * 4) / 3, x = 540 - w / 2, y = 960 - h / 2;
    return mk("div", { cls: "abs mono", html: `<b>${a}</b> · ${b}`, style: { left: x + (i === 2 ? 40 : 14) + "px", top: y + (i === 2 ? 30 : 14) + "px", padding: "8px 14px 7px", fontSize: i === 2 ? "30px" : "22px", letterSpacing: ".1em", color: i === 2 ? "#fff" : "#0b0a09", background: i === 2 ? "#e11d48" : "#f6f0e2", opacity: "0", transformOrigin: "0 0" } }, r);
  });
  s.count = mk("div", { cls: "abs mono", style: { right: "40px", top: "284px", fontSize: "24px", fontWeight: "700", letterSpacing: ".12em", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,.8)" } }, r);
  s.d4 = mk("div", { cls: "abs center-x anton", html: "Dream in <span style='display:inline-block;background:#e11d48;padding:0 22px'>4K.</span>", style: { top: "1450px", fontSize: "170px", lineHeight: "1.05", color: "#fff", textShadow: "0 16px 40px rgba(0,0,0,.6)", opacity: "0" } }, r);
}, (s, t) => {
  s.fest.set(t); s.hero.set(t);
  const out = E.inQ(P(t, 67.2, 67.42));
  st(s.vig, { opacity: String(1 - P(t, 67.25, 67.6)) });
  s.ticks.forEach((l, i) => { const u = E.outE(P(t, 65.85 + i * 0.04, 66.3 + i * 0.04)); st(l, { opacity: String(0.8 * u * (1 - out)) }); });
  s.marks.forEach((m, i) => { const u = E.outC(P(t, 65.95 + i * 0.05, 66.35 + i * 0.05)); st(m, { opacity: String(u), transform: `scale(${lerp(1.25, 1, u).toFixed(3)})`, transformOrigin: "540px 960px" }); });
  s.bl.forEach((el, i) => { const ti = 66.07 + i * 0.035, k = sp(t, ti, 2.8, 0.55); st(el, { opacity: String(clamp((t - ti) / 0.06) * (1 - out)), transform: `translateY(${((1 - k) * 80 - out * 40).toFixed(1)}px)`, filter: `blur(${(Math.max(0, 1 - k) * 6 + out * 8).toFixed(1)}px)` }); });
  const sk = sp(t, 66.7, 2.4, 0.6);
  st(s.sub, { opacity: String(clamp((t - 66.7) / 0.12) * (1 - out)), transform: `translateY(${(1 - sk) * 30}px)` });
  const K = resK(t), kk = [K.sd, K.hd, K.k4];
  s.chips.forEach((ch, i) => { const ti = RES[i][0] + (i ? 0.1 : 0.04); const k = sp(t, ti, 3.2, 0.5); st(ch, { opacity: String(kk[i] > 0.8 ? clamp((t - ti) / 0.05) : 0), transform: `scale(${lerp(1.6, 1, k).toFixed(3)})` }); });
  const ct = t < 68.3 ? "" : `3840 × 2160 · ${(Math.round(lerp(0, 8.3, E.outC(P(t, 68.3, 68.8))) * 10) / 10).toFixed(1)} MP`;
  if (s.count.textContent !== ct) s.count.textContent = ct;
  const dk = sp(t, 68.12, 2.6, 0.5);
  st(s.d4, { opacity: String(clamp((t - 68.12) / 0.06)), transform: `scale(${lerp(1.6, 1, dk).toFixed(3)})` });
  const w = E.inQ(P(t, 68.85, 69.09));
  st(s.root, { transform: `scale(${(1 + w * 0.1).toFixed(4)})`, filter: `blur(${(w * 6).toFixed(1)}px)` });
}, (s, t) => {
  const c = s.ctx; c.clearRect(0, 0, 1080, 1920);
  // behind the title: the festival night on a giant LED wall, one lit bulb per pixel
  const aA = clamp((t - 65.81) / 0.3) * (1 - P(t, 67.25, 67.6));
  if (aA > 0 && s.fest.im.naturalWidth) {
    const lc = s.led.getContext("2d", { willReadFrequently: true }); lc.imageSmoothingEnabled = true; lc.imageSmoothingQuality = "high";
    const z = 1 + (t - 65.81) * 0.03, sw = 1080 / z, sh = 1920 / z;
    lc.drawImage(s.fest.im, (1080 - sw) / 2, (1920 - sh) / 2, sw, sh, 0, 0, 27, 48);
    const d = lc.getImageData(0, 0, 27, 48).data;
    for (let j = 0; j < 48; j++) for (let i = 0; i < 27; i++) {
      const k = (j * 27 + i) * 4, wave = 0.75 + 0.25 * Math.sin((j - (t - 65.81) * 26) * 0.35);
      const g = aA * 0.78 * wave;
      c.fillStyle = `rgb(${Math.round(d[k] * g + 14 * aA)},${Math.round(d[k + 1] * g * 0.86)},${Math.round(d[k + 2] * g * 0.86)})`;
      c.beginPath(); c.roundRect(i * 40 + 5, j * 40 + 5, 30, 30, 8); c.fill();
    }
  }
  if (t < 67.36) return;
  const K = resK(t);
  const w = (480 + 240 * K.hd + 360 * K.k4) * lerp(0.7, 1, K.sd), h = (w * 4) / 3, x = 540 - w / 2, y = 960 - h / 2;
  let cur = 0; RES.forEach((R_, i) => { if (t >= R_[0]) cur = i; });
  const wipe = cur === 0 ? 1 : P(t, RES[cur][0], RES[cur][0] + 0.22);
  c.globalAlpha = clamp((t - 67.36) / 0.08);
  if (wipe < 1) drawPix(c, s.hero, 0, 240, 1080, 1440, x, y, w, h, RES[cur - 1][1]);
  c.save(); c.beginPath(); c.rect(x, y, w, h * wipe); c.clip();
  drawPix(c, s.hero, 0, 240, 1080, 1440, x, y, w, h, RES[cur][1]);
  c.restore();
  if (wipe > 0 && wipe < 1) { c.fillStyle = "#ff2d55"; c.shadowColor = "#ff2d55"; c.shadowBlur = 24; c.fillRect(x, y + h * wipe - 3, w, 6); c.shadowBlur = 0; }
  c.globalAlpha = 1;
  // earlier resolutions stay behind as outlines
  RES.forEach(([ti, , bw], i) => {
    if (i === 2 || t < RES[i + 1][0]) return;
    const bh = (bw * 4) / 3;
    c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 3; c.setLineDash([14, 10]); c.strokeRect(540 - bw / 2, 960 - bh / 2, bw, bh); c.setLineDash([]);
  });
});

/* ============ S20 — Create with AI. (69.05 – 70.99): the 4K frame becomes one tile in a wall of generated worlds ============ */
const TILES = [
  ["v02_camera1913", 1.0, "Phalke's hand-cranked camera, 1913"], ["v03_talkie", 0.5, "the first talkie, one microphone"], ["v01_projector", 2.0, "a 1913 projection booth"],
  ["v04_dance", 1.0, "a hand-tinted dancer, 1950s"], ["v07_queue", 1.5, "a queue at dawn, first day"], ["v08_audience", 0.8, "a single screen erupts"],
  ["v11_dreamer", 2.0, "monsoon rooftop, anamorphic"], ["v05_billboard", 0, "a painter on a 40-ft hoarding"], ["v13_fdfs", 5.5, "festival night, string lights"],
  ["v06_milk", 2.2, "milk over a 40-ft cut-out"], ["v09_tear", 1.2, "a mother's tear, projector light"], ["v14_scripts", 1.0, "unread scripts, 1998"],
  ["v10_coins", 0.5, "coins in a spotlight"], ["v08_audience", 3.0, "whistles, confetti, 1985"], ["v04_dance", 3.0, "a twirl, 35 mm"],
];
scene(69.05, 70.99, (s, r) => {
  st(r, { background: "#050505" });
  s.wall = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", transformOrigin: "540px 960px" } }, r);
  s.tiles = TILES.map(([clip, off, prompt], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 540 + (col - 1) * 330 - 150, y = 960 + (row - 2) * 430 - 200;
    const tile = mk("div", { cls: "abs", style: { left: x + "px", top: y + "px", width: "300px", height: "400px", overflow: "hidden", background: "#111", outline: "2px solid rgba(255,255,255,.14)" } }, s.wall);
    const slot = clipSlot(tile, clip, "dreamer.jpg", { width: "100%", height: "100%" }, { offset: off });
    slot.t0 = i === 7 ? 67.3 : 69.05;
    const nz = mk("canvas", { attrs: { width: 60, height: 80 }, cls: "abs", style: { left: "0", top: "0", width: "300px", height: "400px", imageRendering: "pixelated", mixBlendMode: "overlay" } }, tile);
    const pr = mk("div", { cls: "abs mono", text: "› " + prompt, style: { left: "10px", right: "10px", bottom: "10px", fontSize: "15px", lineHeight: "1.3", color: "#fff", background: "rgba(0,0,0,.72)", padding: "6px 8px" } }, tile);
    const ring = Math.max(Math.abs(col - 1), Math.abs(row - 2));
    return { tile, slot, nz, nctx: nz.getContext("2d"), pr, g0: i === 7 ? 60 : 69.14 + ring * 0.09 + hash(i + 3) * 0.08, prompt, i };
  });
  s.band = mk("div", { cls: "abs", style: { left: "0", top: "858px", width: "1080px", height: "204px", background: "rgba(8,8,8,.9)", boxShadow: "0 30px 80px rgba(0,0,0,.7)", transformOrigin: "0 50%" } }, r);
  s.cw = mk("div", { cls: "abs center-x anton", html: "Create with <span style='color:#ff2d55'>AI.</span>", style: { top: "28px", fontSize: "150px", lineHeight: "1", color: "#fff" } }, s.band);
}, (s, t) => {
  const pull = G("expo.out")(P(t, 69.09, 69.95));
  const sc = lerp(3.96, 1.0, pull) * (1 - 0.07 * P(t, 69.95, 70.99));
  st(s.wall, { transform: `translateY(${(-Math.max(0, t - 69.6) * 26).toFixed(1)}px) scale(${sc.toFixed(4)})`, filter: `blur(${(6 * (1 - P(t, 69.05, 69.25))).toFixed(1)}px)` });
  s.tiles.forEach((T) => {
    T.slot.set(t);
    const g = P(t, T.g0, T.g0 + 0.5);
    if (g > 0 && g < 1) {
      const d = T.nctx.createImageData(60, 80), rr = rng(Math.round(t * FPS) * 13 + T.i);
      for (let k = 0; k < d.data.length; k += 4) { const v = rr() * 255; d.data[k] = v; d.data[k + 1] = v; d.data[k + 2] = v; d.data[k + 3] = 255; }
      T.nctx.putImageData(d, 0, 0);
    }
    st(T.nz, { opacity: String(T.i === 7 || g >= 1 ? 0 : 1 - E.outC(g)) });
    st(T.slot.el, { filter: T.i === 7 ? "none" : `blur(${((1 - E.outC(g)) * 22).toFixed(1)}px) saturate(${lerp(1.6, 1, g).toFixed(2)}) brightness(${lerp(0.55, 1, E.outC(clamp((t - T.g0 + 0.15) / 0.4))).toFixed(2)})` });
    const n = Math.floor(clamp((t - (T.i === 7 ? 69.8 : T.g0)) / 0.45) * T.prompt.length);
    const txt = n > 0 ? "› " + T.prompt.slice(0, n) : "";
    if (T.pr.textContent !== txt) T.pr.textContent = txt;
    st(T.pr, { opacity: txt ? "1" : "0" });
  });
  const bk = G("expo.out")(P(t, 69.12, 69.5));
  st(s.band, { clipPath: `inset(0 ${((1 - bk) * 100).toFixed(2)}% 0 0)` });
  const ck = sp(t, 69.2, 2.6, 0.55);
  st(s.cw, { opacity: String(clamp((t - 69.18) / 0.06)), transform: `scale(${lerp(1.4, 1, ck).toFixed(3)})` });
});

/* ============ S21 — The visionaries are already here. Are you? (70.97 – 76.2): Muskan, one continuous take ============ */
scene(70.97, 76.2, (s, r) => {
  st(r, { background: "#000" });
  s.v = clipSlot(r, "v12_muskan", "muskan_director.jpg", {}, { speed: 0.985 });
  s.v.t0 = 70.97;
  st(s.v.el, { transformOrigin: "52% 30%" });
  mk("div", { cls: "fill", style: { background: "linear-gradient(180deg, rgba(0,0,0,.22) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 50%, rgba(0,0,0,.66) 80%, rgba(0,0,0,.82) 100%)" } }, r);
  s.line = mk("div", { cls: "abs center-x serif", style: { top: "1190px", fontSize: "100px", lineHeight: "1.04", color: "#fff", textShadow: "0 8px 30px rgba(0,0,0,.7)" } }, r);
  s.lw = words(s.line, "The visionaries are already here.");
  s.line.insertBefore(document.createElement("br"), s.lw[2]);
  s.are = mk("div", { cls: "abs center-x serif", html: "<span>Are</span> <span>you?</span>", style: { top: "1220px", fontStyle: "italic", fontSize: "180px", lineHeight: "1", color: "#fff", textShadow: "0 10px 44px rgba(0,0,0,.8)" } }, r);
  [s.a1, s.a2] = s.are.querySelectorAll("span");
  st(s.a1, { display: "inline-block" }); st(s.a2, { display: "inline-block", color: "#ff2d55" });
}, (s, t) => {
  s.v.set(t, lerp(1.0, 1.07, E.ioS(P(t, 70.97, 76.12))));
  st(s.v.box, { filter: `blur(${((1 - E.outC(P(t, 70.97, 71.35))) * 12).toFixed(1)}px)` });
  const wt = [71.32, 71.57, 72.56, 72.9, 73.35];
  const fade = 1 - P(t, 74.9, 75.2);
  s.lw.forEach((w, i) => { const k = sp(t, wt[i], 2.2, 0.7); st(w, { opacity: String(clamp((t - wt[i]) / 0.14) * fade), transform: `translateY(${((1 - k) * 40 - (1 - fade) * 20).toFixed(1)}px)`, filter: `blur(${(Math.max(0, 1 - k) * 8 + (1 - fade) * 6).toFixed(1)}px)` }); });
  const k1 = sp(t, 75.28, 2.4, 0.62), k2 = sp(t, 75.55, 2.2, 0.5);
  st(s.a1, { opacity: String(clamp((t - 75.28) / 0.1)), transform: `translateY(${((1 - k1) * 50).toFixed(1)}px)`, filter: `blur(${(Math.max(0, 1 - k1) * 10).toFixed(1)}px)` });
  st(s.a2, { opacity: String(clamp((t - 75.55) / 0.1)), transform: `translateY(${((1 - k2) * 50).toFixed(1)}px) scale(${lerp(1.25, 1, k2).toFixed(3)})`, filter: `blur(${(Math.max(0, 1 - k2) * 10).toFixed(1)}px)` });
});

/* ============ S23 — Logo finale (76.12 – 83.6): cut on the final chord; traced, filled with light, wordmark ============ */
const LOGO_PATHS = [
  "M 31.0,538.5 L 30.0,691.5 L 180.0,690.5 L 158.0,664.5 L 57.0,663.5 L 57.0,561.5 Z",
  "M 715.0,537.5 L 689.0,560.5 L 689.0,663.5 L 587.0,664.5 L 565.0,690.5 L 715.0,691.5 Z",
  "M 602.0,540.5 L 545.0,502.5 L 485.0,643.5 Z", "M 143.0,540.5 L 261.0,643.5 L 200.0,502.5 Z",
  "M 477.0,454.5 L 480.0,641.5 L 541.0,496.5 Z", "M 198.0,416.5 L 138.0,465.5 L 139.0,535.5 L 199.0,496.5 Z",
  "M 538.0,393.5 L 481.0,449.5 L 542.0,489.5 Z", "M 602.0,336.5 L 546.0,384.5 L 547.0,496.5 L 606.0,535.5 Z",
  "M 202.0,256.5 L 206.0,354.5 L 265.0,297.5 Z", "M 139.0,213.5 L 143.0,410.5 L 199.0,361.5 L 199.0,251.5 Z",
  "M 607.0,212.5 L 546.0,251.5 L 547.0,330.5 L 607.0,281.5 Z",
  "M 481.0,111.5 L 476.0,316.5 L 306.0,317.5 L 202.0,409.5 L 202.0,497.5 L 264.0,638.5 L 269.0,428.5 L 442.0,427.5 L 544.0,340.5 L 542.0,247.5 Z",
  "M 265.0,109.5 L 205.0,250.5 L 269.0,293.5 Z", "M 484.0,106.5 L 545.0,245.5 L 602.0,209.5 Z", "M 261.0,106.5 L 143.0,208.5 L 201.0,245.5 Z",
  "M 565.0,54.5 L 588.0,80.5 L 689.0,81.5 L 689.0,184.5 L 715.0,207.5 L 715.0,53.5 Z",
  "M 181.0,53.5 L 30.0,53.5 L 30.0,207.5 L 57.0,183.5 L 57.0,80.5 L 157.0,80.5 Z",
];
const BRACKETS = new Set([0, 1, 15, 16]);
const FIN = 76.12;
scene(FIN, 83.8, (s, r) => {
  st(r, { background: "radial-gradient(circle at 50% 42%, #c8122c 0%, #8f0c1f 48%, #3a050c 100%)" });
  s.blobA = mk("div", { cls: "abs", style: { left: "-200px", top: "200px", width: "900px", height: "900px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,120,120,.28) 0%, rgba(255,120,120,0) 65%)" } }, r);
  s.blobB = mk("div", { cls: "abs", style: { left: "400px", top: "900px", width: "1000px", height: "1000px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,90,.22) 0%, rgba(255,60,90,0) 65%)" } }, r);
  s.glow = mk("div", { cls: "abs", style: { left: "140px", top: "250px", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,235,235,.35) 0%, rgba(255,235,235,0) 62%)", opacity: "0" } }, r);
  s.group = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "1080px", height: "1920px", transformOrigin: "540px 690px" } }, r);
  const LX = 540 - 320, LY = 370;
  s.logoBox = mk("div", { cls: "abs", style: { left: LX + "px", top: LY + "px", width: "640px", height: "640px", transformOrigin: "320px 320px" } }, s.group);
  s.svg = mk("svg", { cls: "ov", attrs: { viewBox: "0 0 745 745", width: 640, height: 640 }, style: { left: "0", top: "0", width: "640px", height: "640px", overflow: "visible" } }, s.logoBox);
  s.cross = [
    mk("line", { attrs: { x1: 372.5, y1: -60, x2: 372.5, y2: 805, stroke: "#fff", "stroke-width": 2.5, opacity: 0.85 } }, s.svg),
    mk("line", { attrs: { x1: -60, y1: 372.5, x2: 805, y2: 372.5, stroke: "#fff", "stroke-width": 2.5, opacity: 0.85 } }, s.svg),
  ];
  s.ticks = [[350, 187, 395, 187], [350, 560, 395, 560], [350, 372.5, 395, 372.5]].map(([a, b, c, d]) => mk("line", { attrs: { x1: a, y1: b, x2: c, y2: d, stroke: "#fff", "stroke-width": 3.5 } }, s.svg));
  s.corners = [[-12, -12, 1, 1], [757, -12, -1, 1], [-12, 757, 1, -1], [757, 757, -1, -1]].map(([x, y, dx, dy]) => mk("path", { attrs: { d: `M${x + dx * 32},${y} L${x},${y} L${x},${y + dy * 32}`, stroke: "#fff", "stroke-width": 3.5, fill: "none" } }, s.svg));
  s.pieces = LOGO_PATHS.map((d, i) => {
    const fill = mk("path", { attrs: { d, fill: "#fff", opacity: 0 } }, s.svg);
    const line = BRACKETS.has(i) ? null : mk("path", { attrs: { d, fill: "none", stroke: "#fff", "stroke-width": 2.6, "stroke-linejoin": "round" } }, s.svg);
    const nums = d.match(/[\d.]+/g).map(Number); let sx = 0, sy = 0; for (let k = 0; k < nums.length; k += 2) { sx += nums[k]; sy += nums[k + 1]; }
    const cx = sx / (nums.length / 2), cy = sy / (nums.length / 2);
    return { fill, line, i, cx, cy, dist: Math.hypot(cx - 372.5, cy - 372.5) / 372.5 };
  });
  s.ghost = mk("svg", { cls: "ov", attrs: { viewBox: "0 0 745 745", width: 640, height: 640 }, style: { left: "0", top: "0", width: "640px", height: "640px", overflow: "visible", opacity: "0", filter: "blur(14px)" } }, s.logoBox);
  LOGO_PATHS.forEach((d) => mk("path", { attrs: { d, fill: "#fff" } }, s.ghost));
  s.sweep = mk("div", { cls: "abs", style: { left: "0", top: "0", width: "640px", height: "640px", background: "linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(255,255,255,.85) 50%, rgba(255,255,255,0) 62%)", backgroundSize: "300% 100%", WebkitMaskImage: "url(assets/img/h-mask.svg)", maskImage: "url(assets/img/h-mask.svg)", WebkitMaskSize: "640px 640px", maskSize: "640px 640px", mixBlendMode: "overlay", opacity: "0" } }, s.logoBox);
  s.word = mk("div", { cls: "abs center-x", style: { top: "1070px", fontFamily: "Roboto", fontSize: "92px", lineHeight: "1", color: "#fff", whiteSpace: "nowrap" } }, s.group);
  s.wl = letters(s.word, "HINTON STUDIOS");
  s.wl.forEach((el, i) => { el.style.fontWeight = i < 6 ? "800" : "300"; });
  s.rule = mk("div", { cls: "abs", style: { left: "390px", width: "300px", top: "1195px", height: "2px", background: "rgba(255,255,255,.7)" } }, s.group);
  s.tag = mk("div", { cls: "abs center-x mono", text: "DREAM IN 4K · CREATE WITH AI", style: { top: "1225px", fontSize: "32px", fontWeight: "700", letterSpacing: ".22em", color: "#fff", opacity: "0" } }, s.group);
  s.url = mk("div", { cls: "abs center-x", text: "hintonstudios.com", style: { top: "1300px", fontFamily: "Roboto", fontWeight: "500", fontSize: "54px", color: "#fff", opacity: "0" } }, s.group);
  s.loc = mk("div", { cls: "abs center-x mono", text: "BENGALURU · MADE FOR THE WORLD", style: { top: "1392px", fontSize: "21px", letterSpacing: ".24em", color: "rgba(255,255,255,.78)", opacity: "0" } }, s.group);
}, (s, t) => {
  const lt = t - FIN;
  const eo = G("expo.out"), p2 = G("power2.inOut"), p3o = G("power3.out"), s1 = G("sine.inOut");
  st(s.blobA, { transform: `translate(${Math.sin(lt * 0.35) * 120}px, ${Math.cos(lt * 0.3) * 80}px)` });
  st(s.blobB, { transform: `translate(${Math.cos(lt * 0.28) * -140}px, ${Math.sin(lt * 0.33) * 90}px)` });
  const settle = eo(clamp(lt / 1.8));
  const hold = 1 + Math.max(0, lt - 1.8) * 0.004;
  st(s.logoBox, { transform: `scale(${(lerp(1.12, 1, settle) * hold).toFixed(4)})`, filter: `blur(${(lerp(6, 0, eo(clamp(lt / 1.0)))).toFixed(2)}px)` });
  st(s.group, { transform: `translateY(${lerp(20, 0, settle).toFixed(1)}px)` });
  st(s.ghost, { opacity: String((0.7 * Math.exp(-lt * 3.2)).toFixed(3)) });           // the whole mark glows on the chord
  st(s.glow, { opacity: String((0.55 + 0.25 * Math.sin(lt * 1.3)) * clamp((lt - 0.6) / 1.0)) });
  s.cross.forEach((l, i) => { const u = eo(clamp((lt - i * 0.06) / 0.7)); st(l, { transform: i ? `scaleX(${u})` : `scaleY(${u})`, transformOrigin: "372.5px 372.5px" }); });
  s.ticks.forEach((l, i) => { const u = p3o(clamp((lt - 0.3 - i * 0.08) / 0.5)); st(l, { opacity: String(u), transform: `scaleX(${u})`, transformOrigin: "372.5px 0px" }); });
  s.pieces.forEach((pc) => {
    if (pc.line) {
      const u = p2(clamp((lt - 0.02 - pc.dist * 0.18) / 0.8));
      drawOn(pc.line, u);
      st(pc.line, { opacity: String(1 - p2(clamp((lt - 0.95) / 0.45))) });
      st(pc.fill, { opacity: String(p3o(clamp((lt - 0.62 - pc.dist * 0.12) / 0.6))) });
    } else {
      const u = eo(clamp((lt - 0.55) / 0.9));
      const dx = (pc.cx < 372.5 ? -1 : 1) * 70 * (1 - u), dy = (pc.cy < 372.5 ? -1 : 1) * 70 * (1 - u);
      st(pc.fill, { opacity: String(clamp((lt - 0.55) / 0.35)), transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` });
    }
  });
  s.corners.forEach((c, i) => { const u = eo(clamp((lt - 0.8 - i * 0.05) / 0.7)); st(c, { opacity: String(u * 0.9), transform: `scale(${lerp(1.15, 1, u)})`, transformOrigin: "372.5px 372.5px" }); });
  const sw = s1(clamp((lt - 1.4) / 1.0));
  st(s.sweep, { opacity: String(sw > 0 && sw < 1 ? 1 : 0), backgroundPosition: `${lerp(120, -20, sw)}% 0` });
  const wk = p3o(clamp((lt - 1.5) / 1.2));
  st(s.word, { letterSpacing: `${lerp(0.16, 0.08, wk).toFixed(3)}em` });
  s.wl.forEach((el, i) => { const ti = 1.5 + i * 0.03, u = p3o(clamp((lt - ti) / 0.8)); st(el, { opacity: String(u), transform: `translateY(${(1 - u) * 26}px)`, filter: `blur(${((1 - u) * 5).toFixed(1)}px)` }); });
  st(s.rule, { transform: `scaleX(${p3o(clamp((lt - 2.1) / 0.8))})` });
  [[s.tag, 2.35], [s.url, 2.65], [s.loc, 2.95]].forEach(([el, ti]) => { const u = p3o(clamp((lt - ti) / 0.8)); st(el, { opacity: String(u * (el === s.loc ? 0.85 : 1)), transform: `translateY(${(1 - u) * 18}px)` }); });
});
