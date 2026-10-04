---
tags: [architecture, config, stable]
updated: 2026-05-21
---

# Environment Variables

Rules for handling configuration and secrets.

## Rules

- Store all secrets in **`.env.local`** — never commit it (it is git-ignored).
- Document every required variable in **`.env.example`** (committed, no real values).
- Reference variables in code via `process.env.VARIABLE_NAME`.
- Prefix with **`NEXT_PUBLIC_`** only if the value is safe to expose to the browser.
  Unprefixed variables are server-only.

## Current variables

| Name | Scope | Purpose |
|------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | public | Site origin (no trailing slash). Drives canonical URLs, OG/Twitter tags, `robots.txt`, `sitemap.xml`, JSON-LD. Falls back to `http://localhost:3000` when unset — **set it in production**. See [[seo-metadata]]. |
| `CONTACT_ENDPOINT` | server-only | Optional upstream the `/api/contact` route forwards leads to (CRM / webhook). When unset, submissions are logged server-side. See [[api-architecture]]. |

Documented in `.env.example` (committed). Validated by `src/env.ts` (zod):
`publicEnv` for `NEXT_PUBLIC_*` (safe anywhere), `getServerEnv()` for
server-only secrets (route handlers only) — see [[api-architecture]]. Read env
through `src/env.ts`, never `process.env` directly.

> [!important] Secret handling
> Secret keys are **unprefixed** — `NEXT_PUBLIC_` is only for values safe in the
> browser. Secrets are read in server code (`app/api/**`); the browser never
> holds one. See [[api-architecture]].

When the next variable is introduced:
1. Add it to `.env.example` with a comment describing it.
2. Add a row to the table above (name, scope, purpose).
3. Add a [[changelog]] entry.

## Related

[[tech-stack]] · [[seo-metadata]] · [[backend/README]]

## September 2026 integrations

See `.env.example` and `frontend/launch-readiness.md`: optional public Google Ads ID/label and Meta Pixel ID; server-only SMTP settings and Meta CAPI token/API version/test-event code. GA4 and Clarity IDs supplied by the site owner are configured in the shared analytics component. Never put SMTP passwords or CAPI tokens in public variables.

## Enquiry delivery (29 September 2026)
No SMTP password is required for the default FormSubmit gateway. The receiving inbox must click its one-time activation email before production enquiries can be delivered. To: abhinava@hintonstudios.com; CC: souvik@hintonstudios.com, avkash@hintonstudios.com. Optional complete SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_FROM switches to SMTP and enables visitor confirmation/report emails. Partial SMTP settings do not disable FormSubmit. Do not store credentials in source control.

Resend alternative: set server-only `RESEND_API_KEY` and `RESEND_FROM` (an address on a verified sending domain). A complete Resend configuration takes priority over SMTP; an ambiguous delivery failure never automatically retries via a second provider. No client bundle receives the key. The existing studio To/CC and visitor confirmation behavior is shared by both transports.
