// Deterministic frame renderer: serves comp/, drives headless Chromium, writes JPEG frames.
// usage: node tools/render.mjs --out <dir> [--fps 30] [--from 0] [--to <dur>] [--times 1.2,3.4] [--workers 4]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(path.join(execSync("npm root -g").toString().trim(), "playwright"))); }

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../comp");
const OUT = path.resolve(args.out || "frames");
const FPSR = Number(args.fps || 30);
const WORKERS = Number(args.workers || 4);
fs.mkdirSync(OUT, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ttf": "font/ttf" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]).replace(/^\/$/, "/index.html"));
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch({ args: ["--disable-web-security", "--font-render-hinting=none", "--disable-gpu-vsync"] });
let jobs;
if (args.times) jobs = args.times.split(",").map((t, i) => ({ t: Number(t), name: `t_${Number(t).toFixed(2)}.jpg` }));
else {
  const page0 = await browser.newPage();
  await page0.goto(url); await page0.evaluate(() => window.__ready);
  const dur = await page0.evaluate(() => window.__duration); await page0.close();
  const from = Number(args.from || 0), to = Number(args.to || dur);
  const n0 = Math.round(from * FPSR), n1 = Math.round(to * FPSR);
  jobs = []; for (let n = n0; n < n1; n++) jobs.push({ t: n / FPSR, name: `f_${String(n).padStart(5, "0")}.jpg` });
}
let next = 0, done = 0; const t0 = Date.now();
async function worker() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("console", (m) => { if (m.type() === "error") console.error("page:", m.text()); });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto(url); await page.evaluate(() => window.__ready);
  const stage = await page.$("#stage");
  while (next < jobs.length) {
    const j = jobs[next++];
    await page.evaluate((t) => window.__seek(t), j.t);
    await stage.screenshot({ path: path.join(OUT, j.name), type: "jpeg", quality: 94 });
    if (++done % 60 === 0) console.log(`${done}/${jobs.length} frames · ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
  await page.close();
}
await Promise.all(Array.from({ length: Math.min(WORKERS, jobs.length) }, worker));
await browser.close(); server.close();
console.log(`rendered ${jobs.length} frames to ${OUT} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
