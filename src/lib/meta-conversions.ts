import { createHash } from "node:crypto";
import { getServerEnv, publicEnv } from "@/env";
import { siteConfig } from "@/lib/site";
/** Optional server-side lead delivery. Never called without marketing consent. */
export async function sendMetaLead(email: string, eventId: string, page: string) {
  const env = getServerEnv();
  if (!env.META_CAPI_ACCESS_TOKEN || !env.META_GRAPH_API_VERSION || !publicEnv.NEXT_PUBLIC_META_PIXEL_ID) return;
  try {
    const response = await fetch(`https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${publicEnv.NEXT_PUBLIC_META_PIXEL_ID}/events`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.META_CAPI_ACCESS_TOKEN}` }, signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ data: [{ event_name: "Lead", event_time: Math.floor(Date.now() / 1000), event_id: eventId, action_source: "website", event_source_url: `${siteConfig.url}${page}`, user_data: { em: [createHash("sha256").update(email.trim().toLowerCase()).digest("hex")] } }], ...(env.META_TEST_EVENT_CODE ? { test_event_code: env.META_TEST_EVENT_CODE } : {}) }),
    });
    if (!response.ok) console.error("Meta lead delivery failed", response.status);
  } catch { console.error("Meta lead delivery timed out or failed."); }
}
