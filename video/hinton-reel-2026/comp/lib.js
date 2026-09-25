/* Hinton Studios reel — deterministic motion-graphics helpers.
   Everything is a pure function of time t (seconds) so any frame can be rendered in any order. */
"use strict";

const W = 1080, H = 1920, FPS = 30;
const $ = (s) => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const P = (t, a, b) => clamp((t - a) / (b - a));           // normalised progress of t through [a,b]
const win = (t, a, b, fi = 0.15, fo = 0.15) => Math.min(P(t, a, a + fi), 1 - P(t, b - fo, b)); // fade window

const E = {
  lin: (x) => x,
  inQ: (x) => x * x,
  outQ: (x) => 1 - (1 - x) * (1 - x),
  inC: (x) => x * x * x,
  outC: (x) => 1 - Math.pow(1 - x, 3),
  ioC: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuint: (x) => 1 - Math.pow(1 - x, 5),
  inE: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
  outE: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  ioE: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
  outB: (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
  ioS: (x) => 0.5 - 0.5 * Math.cos(Math.PI * x),
};

/* Damped spring step response (0 -> 1). dt = seconds since trigger, f = natural freq (Hz), z = damping ratio. */
function spring(dt, f = 2.2, z = 0.5) {
  if (dt <= 0) return 0;
  const w = 2 * Math.PI * f;
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + ((z * w) / wd) * Math.sin(wd * dt));
  }
  return 1 - Math.exp(-w * dt) * (1 + w * dt);
}
const sp = (t, t0, f, z) => spring(t - t0, f, z);

/* Seeded RNG (mulberry32) */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (n) => { const r = rng(n * 9973 + 17); r(); return r(); };
/* smooth value-noise 1D for camera drift/shake */
function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 1000) * 2 - 1, hash(i + 1 + seed * 1000) * 2 - 1, u);
}

/* DOM helpers */
function mk(tag, opts = {}, parent) {
  const svgTags = ["svg", "path", "circle", "line", "rect", "g", "polygon", "ellipse", "text", "defs", "mask", "polyline"];
  const el = svgTags.includes(tag) ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
  if (opts.cls) el.setAttribute("class", opts.cls);
  if (opts.html != null) el.innerHTML = opts.html;
  if (opts.text != null) el.textContent = opts.text;
  if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k]);
  if (opts.style) Object.assign(el.style, opts.style);
  if (opts.src) el.src = opts.src;
  if (parent) parent.appendChild(el);
  return el;
}
/* style setter that only touches the DOM when a value changes */
function st(el, props) {
  const c = el.__c || (el.__c = {});
  for (const k in props) {
    const v = props[k];
    if (c[k] !== v) { c[k] = v; if (k.startsWith("--")) el.style.setProperty(k, v); else el.style[k] = v; }
  }
}
const tf = (x = 0, y = 0, s = 1, r = 0, extra = "") => `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)}) ${extra}`;
const show = (el, on) => st(el, { display: on ? "block" : "none" });

/* image preload registry */
const IMGS = {};
function img(name) { return `assets/img/${name}`; }
function preloadAll(list) {
  return Promise.all(list.map((src) => new Promise((res) => {
    const i = new Image(); i.onload = () => { IMGS[src] = i; i.decode().then(res, res); }; i.onerror = () => { console.error("missing", src); res(); }; i.src = src;
  })));
}

/* Hand-drawn SVG path helpers (Vox-style annotations) */
function wobblyEllipse(cx, cy, rx, ry, seed = 1, turns = 1.12) {
  const r = rng(seed); const pts = []; const n = 64;
  for (let i = 0; i <= n * turns; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI * 0.6;
    const k = 1 + (r() - 0.5) * 0.05 + (i / n) * 0.04;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return "M" + pts.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L");
}
function arrowPath(x1, y1, x2, y2, bend = 0.25) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
}
function arrowHead(x1, y1, x2, y2, bend = 0.25, size = 26) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const p1 = [x2 - size * Math.cos(a - 0.45), y2 - size * Math.sin(a - 0.45)], p2 = [x2 - size * Math.cos(a + 0.45), y2 - size * Math.sin(a + 0.45)];
  return `M${p1[0]},${p1[1]} L${x2},${y2} L${p2[0]},${p2[1]}`;
}
/* draw-on stroke: set dasharray to path length, reveal by progress */
function drawOn(pathEl, p) {
  if (!pathEl.__len) { pathEl.__len = pathEl.getTotalLength(); if (!pathEl.__len) return; pathEl.style.strokeDasharray = pathEl.__len; }
  st(pathEl, { strokeDashoffset: String(pathEl.__len * (1 - clamp(p))) });
}

/* Split text into per-letter spans for kinetic type */
function letters(el, text) {
  el.innerHTML = "";
  return [...text].map((ch) => mk("span", { text: ch === " " ? " " : ch, style: { display: "inline-block" } }, el));
}
function words(el, text) {
  el.innerHTML = "";
  return text.split(" ").map((w, i, arr) => {
    const s = mk("span", { text: w, style: { display: "inline-block" } }, el);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    return s;
  });
}

/* ---------- Film FX layer: grain, dust, scratches, flicker ---------- */
const FX = {
  cv: null, ctx: null, img: null,
  init() {
    this.cv = $("#fx"); this.ctx = this.cv.getContext("2d");
    this.img = this.ctx.createImageData(this.cv.width, this.cv.height);
  },
  draw(t, o) {
    const { grain = 0.1, dust = 0, flicker = 0, tint = null } = o;
    const ctx = this.ctx, w = this.cv.width, h = this.cv.height;
    ctx.clearRect(0, 0, w, h);
    const frame = Math.round(t * FPS);
    if (grain > 0) {
      const r = rng(frame * 131 + 7), d = this.img.data, a = Math.round(255 * grain);
      for (let i = 0; i < d.length; i += 4) {
        const v = r() * 255 | 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = a;
      }
      ctx.putImageData(this.img, 0, 0);
    }
    if (dust > 0) {
      const r = rng(frame * 977 + 3);
      ctx.save();
      const n = Math.floor(r() * 7 * dust);
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = r() < 0.6 ? `rgba(0,0,0,${0.5 * dust})` : `rgba(255,255,255,${0.45 * dust})`;
        const x = r() * w, y = r() * h, s = 0.6 + r() * 2.6;
        ctx.beginPath(); ctx.ellipse(x, y, s, s * (0.4 + r()), r() * 3, 0, Math.PI * 2); ctx.fill();
      }
      if (r() < 0.55 * dust) { // vertical scratch
        const x = (noise1(t * 0.7, 3) * 0.5 + 0.5) * w;
        ctx.strokeStyle = `rgba(255,255,255,${0.12 + 0.2 * r()})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (r() - 0.5) * 6, h); ctx.stroke();
      }
      ctx.restore();
    }
    if (flicker > 0) {
      const f = (hash(frame * 3 + 1) - 0.5) * flicker;
      ctx.fillStyle = f > 0 ? `rgba(255,250,235,${f * 0.5})` : `rgba(0,0,0,${-f})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, w, h); }
  },
};

/* ---------- HUD: chapter label + year counter ---------- */
const HUD = {
  init() {
    const hud = $("#hud");
    this.root = mk("div", { style: { position: "absolute", inset: "0", textShadow: "0 2px 12px rgba(0,0,0,.55)" } }, hud);
    this.chap = mk("div", { cls: "abs mono", style: { left: "64px", top: "286px", fontSize: "23px", fontWeight: "600", letterSpacing: ".22em", color: "#f6f0e2", display: "flex", alignItems: "center", gap: "14px" } }, this.root);
    this.dot = mk("span", { style: { width: "14px", height: "14px", background: "var(--red-hi)", display: "inline-block" } }, this.chap);
    this.chapT = mk("span", { text: "" }, this.chap);
    this.yearBox = mk("div", { cls: "abs", style: { right: "64px", top: "262px", textAlign: "right" } }, this.root);
    this.yearT = mk("div", { cls: "mono", style: { fontSize: "58px", fontWeight: "700", color: "#f6f0e2", letterSpacing: ".02em", lineHeight: "1" } }, this.yearBox);
    this.yearL = mk("div", { cls: "mono", text: "YEAR", style: { fontSize: "18px", letterSpacing: ".4em", color: "rgba(246,240,226,.6)", marginTop: "6px" } }, this.yearBox);
  },
  update(t, year, chapter, alpha, dark = false) {
    st(this.root, { opacity: String(alpha) });
    const col = dark ? "#0b0a09" : "#f6f0e2";
    st(this.yearT, { color: col }); st(this.chap, { color: col }); st(this.yearL, { color: dark ? "rgba(11,10,9,.6)" : "rgba(246,240,226,.6)" });
    if (this.chapT.textContent !== chapter) this.chapT.textContent = chapter;
    const y = typeof year === "number" ? String(Math.round(year)) : year;
    if (this.yearT.textContent !== y) this.yearT.textContent = y;
  },
};

/* ---------- Captions (burned in, for sound-off viewing) ---------- */
const CAP = {
  init(lines) { this.el = $("#caption"); this.lines = lines; },
  update(t) {
    let txt = "", a = 0;
    for (const l of this.lines) {
      if (t >= l.a - 0.08 && t <= l.b + 0.25) { txt = l.text; a = Math.min(P(t, l.a - 0.08, l.a + 0.06), 1 - P(t, l.b + 0.1, l.b + 0.25)); }
    }
    if (this.el.__t !== txt) { this.el.__t = txt; this.el.innerHTML = txt ? `<span>${txt}</span>` : ""; }
    st(this.el, { opacity: a.toFixed(3), transform: `translateY(${(1 - a) * 10}px)` });
  },
};

/* ---------- v2: video clip slots (image sequences) with still-image fallback ---------- */
let CLIPS = {};              // name -> frame count, from assets/data/clips.json (absent => fallback still)
const PENDING = [];          // image decodes the renderer must wait for before capturing a frame
function setSrc(el, src) {
  if (el.__src === src) return;
  el.__src = src; el.src = src;
  PENDING.push(el.decode().catch(() => {}));
}
/* A full-bleed or boxed video slot. `still` is shown (with drift) when the clip isn't available. */
function clipSlot(parent, name, still, style = {}, opts = {}) {
  const box = mk("div", { cls: "abs", style: Object.assign({ left: "0", top: "0", width: "1080px", height: "1920px", overflow: "hidden" }, style) }, parent);
  const el = mk("img", { cls: "abs", style: { left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: opts.pos || "50% 50%", transformOrigin: "50% 50%" } }, box);
  const slot = { box, el, name, still, t0: 0, speed: opts.speed || 1, offset: opts.offset || 0 };
  slot.set = (t, extraScale = 1) => {
    const lt = Math.max(0, t - slot.t0);
    const n = CLIPS[name];
    if (n) {
      const idx = clamp(Math.floor((lt * slot.speed + slot.offset) * FPS), 0, n - 1);
      setSrc(el, `assets/clips/${name}/${String(idx + 1).padStart(4, "0")}.jpg`);
      st(el, { transform: `scale(${extraScale.toFixed(4)})` });
    } else {
      setSrc(el, img(still));
      const d = opts.drift || [0.06, 0, -18];      // scale/sec, x px/sec, y px/sec
      st(el, { transform: `translate(${(d[1] * lt).toFixed(2)}px, ${(d[2] * lt).toFixed(2)}px) scale(${((1.04 + d[0] * lt) * extraScale).toFixed(4)})` });
    }
  };
  return slot;
}
/* GSAP eases as plain functions (deterministic; GSAP is only used as an easing/timeline library). */
const G = (name) => (window.gsap ? gsap.parseEase(name) : (x) => x);
