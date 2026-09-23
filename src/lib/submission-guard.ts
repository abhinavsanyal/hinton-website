import { ApiError } from "@/lib/api";
const attempts = new Map<string, { count: number; until: number }>();
/** Instance-local abuse guard. Use host WAF limits for distributed production protection. */
export function guardSubmission(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== (req.headers.get("host") || new URL(req.url).host)) throw new ApiError(403, "invalid_origin", "Please submit from this website.");
  if (Number(req.headers.get("content-length") || 0) > 12000) throw new ApiError(413, "too_large", "The message is too large.");
  const key = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
  const entry = attempts.get(key) || { count: 0, until: now + 600000 };
  if (++entry.count > 5) throw new ApiError(429, "rate_limited", "Please wait a few minutes before submitting again.");
  attempts.set(key, entry);
}
