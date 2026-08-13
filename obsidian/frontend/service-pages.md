---
tags: [frontend, seo, stable]
updated: 2026-08-12
---

# Service pages — `/services` hub + 5 spokes

The capability side of the site: one hub page and five service pages, built as a
**hub-and-spoke** internal-link cluster for SEO. Added as a purely additive
change — the Showreel landing page ([[home-page]]) was not touched.
ADR: [[decisions-log]] ADR-0025.

## Routes

| Route | File | View | Render |
|-------|------|------|--------|
| `/services` | `app/services/page.tsx` | `views/services/services-index-view.tsx` | Static |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | `views/services/service-view.tsx` | SSG (5 paths) |

The five slugs: `ai-tvc-production`, `brand-and-product-films`,
`vertical-micro-dramas`, `ai-storyboards-and-moodboards`, `2d-and-3d-animation`.

`[slug]/page.tsx` exports **`dynamicParams = false`**. The service set is fixed,
so an off-list slug must hard-404 rather than render an on-demand soft-404 that a
crawler would index.

## Content source of truth

All copy lives in `src/data/mocks/services.ts` — nothing is hardcoded in a
component ([[component-conventions]] hard rule #4). Adding a sixth service means
appending one `ServiceContent` object; the nav dropdown, the `/services` grid,
`generateStaticParams`, the sitemap and the JSON-LD all derive from it.

```ts
interface ServiceContent {
  slug; navLabel; navBlurb; eyebrow;
  headingLines: string[]; lede; metaTitle; metaDescription;
  intro: { heading: string; body: string[] };
  stats; media; pipeline; deliverables; faqs;
  related: string[];   // slugs — renders the reciprocal spoke↔spoke links
}
```

Also exported: `getServiceBySlug`, `serviceSections` (section headings),
`serviceCta` (the two closing CTAs), `servicesIndex` (hub copy).

## Page composition

```
ServiceView (Server)
├── <script type="application/ld+json">   ← getServiceStructuredData(service)
├── SiteHeader ... awaitLoader={false}
└── <main id="main">
    ├── ServiceHero        client — 220vh track, CSS-perspective camera rig
    ├── <nav aria-label="Breadcrumb">
    ├── ServiceNarrative   intro prose + stats <dl>
    ├── ServiceMediaWall   grid of <FlareMedia>
    ├── ServiceProcess     pipeline <ol> + deliverables <dl>
    ├── ServiceFaqSection  <dl> of visible answers + related-capability links
    ├── ServiceCta         "Book a call" (Cal.com) + "View all work" (/work)
    └── SeoFooter
```

## The hero camera

Same technique as the Showreel, at a fraction of the size: a `ProgressTrigger`
scrubs **one** react-spring value `p` over a 220vh track; `p` drives a
`[perspective:1400px]` rig whose plates fly along `translateZ` from
`PLATE_DEPTH = [-1500, -2400, -3300, -4200]`. There is **no GSAP** in this
project — see [[animation-system]] and ADR-0002.

Plates are text-only. Nothing in the hero loads video, so the `<h1>` stays the
LCP element.

## SEO rules encoded here

- **One intent, one URL** — each service owns exactly one page; no overlap.
- **Answer-first** — the lede answers the page's question in 40–60 words.
- **Fact density** — a number or named entity every 150–200 words (the `stats`
  array and the pipeline copy carry these).
- **Never hide text** — FAQ answers render open, not in an accordion. Collapsed
  answers are unreliably extracted by AI answer engines and read as cloaking.
- **Server-rendered** — every page is prerendered HTML; the only client leaves
  are the hero camera and the flare media.
- **Structured data** — `getServiceStructuredData()` emits a `@graph` of
  `Service` (+`OfferCatalog`), `FAQPage`, `HowTo` (from `pipeline`) and
  `BreadcrumbList`, all tied to the site `Organization` node. See
  [[seo-metadata]].
- **Hub and spoke** — `/services` links down to all five; each service links back
  up via the breadcrumb and sideways via `related`.

## Nav integration

`NavLink` in `data/mocks/home.ts` gained an optional `menu?: NavMenuItem[]`.
When present, `SiteHeader` renders `<ServicesMenu>` (a glass dropdown) instead of
a plain link; the mobile sheet renders a nested `<ul>` of sub-links. Existing
link entries are unaffected.

Two additive fixes made `SiteHeader` usable off the home page:

- **`awaitLoader?: boolean`** (default `true`). The bar fades in on
  `useLoaderStore.revealed`, which only the home-page `IntroLoader` flips.
  Pages without the loader pass `false`. Home behaviour is unchanged.
- **`anchor()`** — `#section` hrefs are rewritten to `/#section` when
  `usePathname() !== "/"`, so the "Capabilities" and "Studio" links jump home
  instead of dead-linking to the current document.

`/work` now mounts the same header (`awaitLoader={false}`); its top padding went
`20vmin → 24vmin` and its floating close button drops below the bar on phones.

## Related

[[routing]] · [[seo-metadata]] · [[components/ui]] · [[animation-system]] · [[home-page]]
