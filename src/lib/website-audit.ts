import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { ApiError } from "@/lib/api";

function publicIPv4(ip: string) {
  const [a,b] = ip.split(".").map(Number);
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && [0,168].includes(b)) || (a === 100 && b >= 64 && b <= 127) || (a === 198 && [18,19,51].includes(b)) || (a === 203 && b === 0));
}
export async function auditWebsite(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) throw new ApiError(400, "invalid_website", "Use a public HTTPS website URL.");
  const addresses = await lookup(url.hostname, { all: true, family: 4 });
  if (!addresses.length || addresses.some(a => !publicIPv4(a.address))) throw new ApiError(400, "invalid_website", "Use a public website address.");
  // Pin the validated address to avoid DNS rebinding; do not follow redirects.
  const html = await new Promise<string>((resolve, reject) => {
    const req = request(url, { family: 4, lookup: (_host, options, callback) => options.all ? callback(null, [addresses[0]]) : callback(null, addresses[0].address, 4), headers: { "User-Agent": "HintonWebsiteReview/1.0", Accept: "text/html" }, timeout: 8000 }, res => {
      if (res.statusCode !== 200 || !res.headers["content-type"]?.includes("text/html")) { res.resume(); reject(new ApiError(422, "unreadable", "Use the final homepage URL. This page redirected or did not return readable HTML.")); return; }
      let bytes = 0; const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => { bytes += chunk.length; if (bytes > 524288) { req.destroy(); reject(new ApiError(422, "too_large", "This page is too large for the basic review.")); } else chunks.push(chunk); });
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("Website timeout")));
    req.on("error", reject); req.end();
  });
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.slice(0,160) || url.hostname;
  const hasVideo = /<video\b|youtube\.com\/embed|player\.vimeo\.com/i.test(html);
  const hasDescription = /<meta[^>]+name=["']description["']/i.test(html);
  const recommendations = [
    hasVideo ? "Video markup was found. Review whether the opening communicates your central offer and whether the next step is visible beside the player." : "No embedded video was detected in the homepage HTML. Consider a concise introduction that explains your offer and gives visitors a clear next step.",
    hasDescription ? "A meta description was detected. Keep the promise in your campaign video consistent with the landing-page message." : "No meta description was detected. Clarify the homepage proposition before building a campaign film around it.",
    "Plan a product or service demonstration around one customer question, with captions and a visible contact link.",
    "Create vertical cutdowns with alternative opening hooks, then compare qualified enquiries rather than views alone.",
  ];
  return { website: url.origin + url.pathname, title, recommendations, limitation: "Basic review of publicly returned homepage HTML. JavaScript-rendered content may be missed. This is a rules-based planning aid, not an AI-generated audit, ranking forecast or performance measurement." };
}
