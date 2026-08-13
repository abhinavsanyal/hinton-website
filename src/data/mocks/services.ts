/**
 * Service-page content — one entry per capability hub (`/services/<slug>`).
 *
 * Copy follows the studio's SEO brief: an answer-first lede, cluster
 * vocabulary in headings, and a specific number/named model every few
 * sentences (fact density is what AI answer engines quote). Every string on a
 * service page comes from here — components stay content-free.
 */

import { publicEnv } from "@/env";

const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL 
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "") 
  : "/assets";

/** Videos in `all-content` carry spaces and brackets, so paths are encoded. */
const allContent = (file: string) => `${MEDIA_BASE}/all-content/${encodeURIComponent(file)}`;
const showreel = `${MEDIA_BASE}/showreel`;

export interface ServiceMedia {
  /** Omit to render an empty glass placeholder tile awaiting a final grade. */
  src?: string;
  label: string;
  meta: string;
  /** `portrait` drives the 9:16 tile used by vertical formats. */
  ratio?: "landscape" | "portrait";
}

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServicePipelineStep {
  title: string;
  body: string;
}

export interface ServiceDeliverable {
  title: string;
  body: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceContent {
  slug: string;
  /** Short label for the navbar dropdown. */
  navLabel: string;
  /** One-line blurb shown under the label in the dropdown. */
  navBlurb: string;
  eyebrow: string;
  /** The page `<h1>` — split into lines for the scroll-scrubbed hero. */
  headingLines: string[];
  /** Visible keyword-bearing sub-line under the H1. */
  lede: string;
  metaTitle: string;
  metaDescription: string;
  intro: { heading: string; body: string[] };
  stats: ServiceStat[];
  media: ServiceMedia[];
  pipeline: ServicePipelineStep[];
  deliverables: ServiceDeliverable[];
  faqs: ServiceFaq[];
  /** Slugs of sibling services surfaced at the foot of the page. */
  related: string[];
}

export const servicesContent: ServiceContent[] = [
  {
    slug: "ai-tvc-production",
    navLabel: "AI TVC Production",
    navBlurb: "Broadcast-grade 30s and 60s commercials, no shoot day",
    eyebrow: "AI TVC production house",
    headingLines: ["TV Commercials", "without a shoot"],
    lede:
      "Hinton Studios is an AI TVC production house in Bengaluru producing broadcast-grade 4K television commercials for brands across India, the Gulf and the US — scripted and directed by filmmakers, executed through a generative AI pipeline.",
    metaTitle: "AI TVC Production House — Broadcast-Grade AI Television Commercials",
    metaDescription:
      "Hinton Studios produces AI TVCs and AI commercial films for brands — 4K broadcast delivery, character consistency across shots, campaign-ready in days. AI TVC production company in Bengaluru, India.",
    intro: {
      heading: "What an AI TVC production house actually does",
      body: [
        "An AI TVC is a television commercial generated frame-by-frame instead of photographed. We write the screenplay, lock the shot list, build the animatic, then execute across Seedance, Veo, Kling and Sora before grading and finishing in DaVinci Resolve. The output is a 4K master that meets broadcast delivery specs.",
        "The difference between an AI video tool and an AI commercial production company is direction. A tool renders a prompt. A studio holds a 180-degree axis across 40 shots, keeps a character's face consistent through a full campaign, and maintains a colour palette that survives a TV cut, a 6-second bumper and a vertical edit.",
        "We work the way an ad film production house works — brief, treatment, previz, approvals, master — only the shoot week is replaced by a generation week, which is where the cost and calendar collapse.",
      ],
    },
    stats: [
      { value: "11 days", label: "Median brief to 4K master" },
      { value: "4K / UHD", label: "Broadcast delivery spec" },
      { value: "40+", label: "Shots per 30-second cut" },
      { value: "6 models", label: "In the generation stack" },
    ],
    media: [
      { src: allContent("TATA-1MG[40secs].mov"), label: "Tata 1mg", meta: "AI TVC · Comedy Ad Film · VFX" },
      { src: allContent("Dominoz[30sec].mov"), label: "Domino's", meta: "AI TVC · Product Film · 30 sec" },
      { src: allContent("Horror Comedy Soda AD[60secs].mov"), label: "Horror Comedy Soda", meta: "AI TVC · Narrative Ad · 60 sec" },
      { label: "Reserved for next campaign", meta: "Master in grade" },
    ],
    pipeline: [
      { title: "The brief", body: "Product, audience, media plan and budget band. We come back with a one-page treatment inside 48 hours." },
      { title: "Script and shot list", body: "A filmmaker writes the screenplay and breaks it into a numbered shot list with lens, movement and grain noted per frame." },
      { title: "Animatic", body: "A timed animatic locks the cut before a single hero frame is generated, so revisions cost minutes, not days." },
      { title: "Generation", body: "Shots run across the model stack, chosen per shot for motion, character fidelity or product accuracy. Typically 8–12 generations per keeper." },
      { title: "VFX and compositing", body: "Product replacement, logo lockups, clean-up and continuity fixes so the pack shot is legally and visually exact." },
      { title: "Grade and finish", body: "Kodak-style film emulation, 4K upscale, mix and multilingual voiceover. Delivered to broadcast and platform specs." },
    ],
    deliverables: [
      { title: "30s and 60s TVC masters", body: "4K ProRes and H.264, broadcast-safe levels, textless versions included." },
      { title: "Cutdowns", body: "15s, 10s and 6s bumpers cut from the same master, plus 9:16 and 1:1 platform crops." },
      { title: "Multilingual versions", body: "Hindi, Tamil, Telugu, Kannada and English voiceover with AI lipsync where the frame needs it." },
      { title: "Campaign stills", body: "Print-resolution key art pulled from the generated frames, no separate stills shoot." },
    ],
    faqs: [
      {
        question: "Can I make a TV commercial entirely with AI?",
        answer:
          "Yes. We deliver 4K masters that meet broadcast specs, with textless versions and broadcast-safe levels. The script, shot list and direction are human; the frames are generated. Most brands run these on television and on digital from the same master.",
      },
      {
        question: "How much does an AI ad film cost in India?",
        answer:
          "AI TVC production typically lands well below the equivalent live-action ad film budget because there is no unit, no location and no shoot day. Cost scales with shot count, VFX load and the number of language versions rather than with crew size.",
      },
      {
        question: "What is the turnaround time for an AI ad film?",
        answer:
          "Median brief-to-master is around 11 days. A locked script and a single approval round can compress that to a week; heavy product VFX or six language versions extend it.",
      },
      {
        question: "How do AI film studios keep characters consistent across shots?",
        answer:
          "Character consistency comes from locked reference sets, seed discipline and a shot list written to avoid the angles models handle badly. It is a directing constraint solved at the shot-list stage, not a post fix.",
      },
    ],
    related: ["brand-and-product-films", "ai-storyboards-and-moodboards", "2d-and-3d-animation"],
  },
  {
    slug: "brand-and-product-films",
    navLabel: "Brand & Product Films",
    navBlurb: "Founder stories, launch films and CGI product hero shots",
    eyebrow: "AI brand film production",
    headingLines: ["Brand films", "that carry weight"],
    lede:
      "Hinton Studios produces AI brand films, corporate films, founder-story films and CGI product films for D2C, FMCG, fintech and hospitality brands — cinematic craft on a generative AI production pipeline.",
    metaTitle: "AI Brand Films & Product Films — AI Video Production for Brands",
    metaDescription:
      "AI brand film and AI product film production for D2C, FMCG and fintech brands. Launch films, founder stories, CGI product ads and corporate films. Hinton Studios, Bengaluru.",
    intro: {
      heading: "Brand films, product films and the stories in between",
      body: [
        "A brand film is not a commercial. It runs longer, argues slower, and carries the thing a 30-second spot cannot: why the company exists. We produce launch films, founder-story films, recruitment films, investor-pitch films and CGI product hero films on the same AI production pipeline.",
        "Product work is where generative AI earns its keep. A CGI product ad that would need a table-top unit, a macro rig and three days of lighting becomes a directed generation problem — with the added freedom of shots a camera physically cannot take.",
        "Every film is art-directed frame-level. The brand's palette, typography and product geometry are locked into the pipeline as constraints before generation begins, so the output is on-brand rather than merely impressive.",
      ],
    },
    stats: [
      { value: "60–180s", label: "Typical brand-film runtime" },
      { value: "9 verticals", label: "D2C, FMCG, fintech, hospitality and more" },
      { value: "Frame-level", label: "Art direction and colour discipline" },
      { value: "Print-res", label: "Key art pulled from the same frames" },
    ],
    media: [
      { src: allContent("Ilaiyaraaja-birthday-tribute-final-cut.mov"), label: "Ilaiyaraaja Tribute", meta: "Brand Film · Tribute · Music" },
      { src: `${showreel}/portfolio-1.mp4`, label: "Product Film", meta: "CGI Product · Hero Shots" },
      { src: `${showreel}/portfolio-4.mp4`, label: "Launch Film", meta: "Brand Film · Narrative" },
      { label: "Founder story — in production", meta: "Placeholder" },
    ],
    pipeline: [
      { title: "Discovery", body: "We read the brand book, the deck and the last three campaigns before writing a word." },
      { title: "Treatment", body: "A written treatment with a reference reel, so the visual argument is agreed before production spend." },
      { title: "Script and board", body: "Screenplay plus an illustrated board. Long-form needs structure more than a spot does." },
      { title: "Generation", body: "Shots generated against locked brand references — palette, product geometry, typography and tone all constrained up front." },
      { title: "Product accuracy pass", body: "Packaging, labels and product silhouette composited or replaced so the hero object is exact." },
      { title: "Grade, mix and master", body: "Film emulation grade, score, sound design and delivery in every ratio the campaign needs." },
    ],
    deliverables: [
      { title: "Brand film master", body: "60–180 second cut in 4K, textless and subtitled versions included." },
      { title: "Social cutdowns", body: "Vertical and square edits built from the master for Instagram, YouTube Shorts and LinkedIn." },
      { title: "Product hero shots", body: "CGI-grade product frames usable as stills, loops or campaign key art." },
      { title: "Score and sound design", body: "Original or licensed score with a full mix, delivered as stems on request." },
    ],
    faqs: [
      {
        question: "What is the difference between a brand film and a TVC?",
        answer:
          "A TVC sells a product in 30 seconds against a media buy. A brand film runs 60–180 seconds and sells the company's reason for existing — used at launches, on the website, in sales decks and for recruitment rather than on a broadcast schedule.",
      },
      {
        question: "Can AI produce accurate product shots for advertising?",
        answer:
          "Yes, with a compositing pass. Generated frames give the lighting and camera move; packaging, labels and product silhouette are composited or replaced so the hero object matches the real SKU exactly — which is what legal and packaging teams sign off on.",
      },
      {
        question: "Which brand categories does an AI film studio suit best?",
        answer:
          "Categories where the visual ambition outruns the budget: D2C, FMCG, fintech, EdTech, SaaS, real estate, hospitality, jewellery and fashion. Anything needing scale, travel or impossible camera moves benefits most.",
      },
      {
        question: "Do you work with in-house marketing teams or only agencies?",
        answer:
          "Both. We work directly with brand managers and CMOs, and we work white-label as the production partner behind ad agencies who need an AI pipeline they do not run in-house.",
      },
    ],
    related: ["ai-tvc-production", "vertical-micro-dramas", "2d-and-3d-animation"],
  },
  {
    slug: "vertical-micro-dramas",
    navLabel: "Vertical Micro Dramas",
    navBlurb: "Mobile-first episodic series built for retention",
    eyebrow: "AI micro drama production company",
    headingLines: ["Micro dramas", "built for the thumb"],
    lede:
      "Hinton Studios is a vertical micro drama production company producing AI-generated 9:16 episodic series — 60 to 100 episodes, one to two minutes each, written for the retention curve of a mobile feed.",
    metaTitle: "Vertical Micro Drama Production — AI Micro Drama Series Company",
    metaDescription:
      "AI micro drama production company producing vertical drama series for mobile-first platforms. 60–100 episode seasons, 9:16 native, written for retention. Hinton Studios, Bengaluru.",
    intro: {
      heading: "What is a micro drama, and why does it work?",
      body: [
        "A micro drama is a vertical, mobile-native serialised story told in 60 to 100 episodes of one to two minutes each. Every episode ends on a hook. The format monetises through per-episode unlocks and ad breaks, which is why retention per episode matters more than production polish.",
        "Traditionally a season means months of shooting on a punishing schedule. Generative AI changes the arithmetic: episodes are generated in batches against a locked character bible, so a season becomes a writing and directing problem rather than a scheduling one.",
        "We build the character bible first — faces, wardrobe, locations and lighting states locked as reference sets — then generate episodes in blocks. That is what keeps a lead actor's face identical in episode 4 and episode 71.",
      ],
    },
    stats: [
      { value: "60–100", label: "Episodes per season" },
      { value: "9:16", label: "Native vertical, not a crop" },
      { value: "60–120s", label: "Runtime per episode" },
      { value: "1 bible", label: "Locked characters across the season" },
    ],
    media: [
      { src: `${showreel}/portfolio-2.mp4`, label: "Series Concept", meta: "Vertical Drama · Episode 01", ratio: "portrait" },
      { src: `${showreel}/portfolio-5.mp4`, label: "Series Concept", meta: "Vertical Drama · Episode 02", ratio: "portrait" },
      { label: "Season in development", meta: "Placeholder", ratio: "portrait" },
      { label: "Season in development", meta: "Placeholder", ratio: "portrait" },
    ],
    pipeline: [
      { title: "Format and hook design", body: "We map the retention curve first — where the cliffhanger falls, where the unlock sits, how episode one earns episode two." },
      { title: "Writers' room", body: "Season arc, episode beats and the hook ladder written before any visual work starts." },
      { title: "Character bible", body: "Faces, wardrobe, locations and lighting states locked as reference sets. This is the asset the whole season depends on." },
      { title: "Block generation", body: "Episodes generated in blocks against the bible, so continuity holds from episode 1 to episode 100." },
      { title: "Vertical grade and sound", body: "Graded for small screens and loud rooms — contrast and dialogue mix tuned for phone playback." },
      { title: "Platform delivery", body: "Episode masters, thumbnails, hook clips and the trailer cut, packaged to platform spec." },
    ],
    deliverables: [
      { title: "Episode masters", body: "Full season in 9:16, delivered per episode to platform encoding specs." },
      { title: "Character bible", body: "The locked reference set — reusable for season two without redesigning the cast." },
      { title: "Hook clips and trailers", body: "Cut-downs built for acquisition: the first-episode hook, the season trailer and paid-social variants." },
      { title: "Multilingual dubs", body: "Regional-language versions with AI dubbing and lipsync, the cheapest way to widen a season's audience." },
    ],
    faqs: [
      {
        question: "What is a vertical micro drama?",
        answer:
          "A vertical micro drama is a mobile-native serialised story: 60–100 episodes of one to two minutes, shot 9:16, each ending on a cliffhanger. Viewers typically unlock later episodes through in-app purchase, so the format is written around retention.",
      },
      {
        question: "Who produces vertical micro drama series in India?",
        answer:
          "Hinton Studios produces AI-generated vertical micro drama seasons from Bengaluru — format design, writers' room, character bible, generation and platform delivery in one pipeline.",
      },
      {
        question: "How do you keep the cast consistent across 100 episodes?",
        answer:
          "A character bible locks every face, wardrobe state, location and lighting condition as a reference set before generation begins. Episodes are then generated in blocks against that bible rather than prompted independently.",
      },
      {
        question: "How do micro dramas make money?",
        answer:
          "Mainly per-episode unlocks and in-app purchases, with ad breaks and brand integration as secondary revenue. Because revenue is per-episode, the commercial job of episode one is to make episode two feel unavoidable.",
      },
    ],
    related: ["brand-and-product-films", "ai-storyboards-and-moodboards", "ai-tvc-production"],
  },
  {
    slug: "ai-storyboards-and-moodboards",
    navLabel: "AI Storyboards & Moodboards",
    navBlurb: "Previz, animatics and pitch-winning visual decks",
    eyebrow: "AI previz and storyboard service",
    headingLines: ["Previz", "before you commit"],
    lede:
      "Hinton Studios runs an AI previz and storyboard service — shot lists, moodboards, illustrated boards and timed animatics that let brands and agencies see a campaign film before anyone books a crew.",
    metaTitle: "AI Storyboards, Moodboards & Previz — AI Previz Studio",
    metaDescription:
      "AI previz studio producing storyboards, moodboards, shot lists and timed animatics for commercials and films. See the film before the budget is committed. Hinton Studios, Bengaluru.",
    intro: {
      heading: "What is previz, and why does it save money?",
      body: [
        "Previz is the film before the film. A moodboard fixes the look, a storyboard fixes the frames, and an animatic fixes the timing — so the expensive decisions get made while they are still cheap to change. Changing a shot in an animatic costs minutes. Changing it on a shoot day costs the day.",
        "Generative AI made previz photographic. Instead of pencil frames a client has to imagine their way through, we deliver boards that look like the finished grade, and animatics cut to the real edit with scratch voiceover and temp score.",
        "This is also the fastest way to win a pitch. An agency walking into a brand review with a timed, graded animatic is not describing an idea — it is screening one.",
      ],
    },
    stats: [
      { value: "48–72h", label: "Brief to first board set" },
      { value: "Timed", label: "Animatics cut to the real edit" },
      { value: "Photographic", label: "Boards at finished-grade fidelity" },
      { value: "Any format", label: "TVC, brand film, series or micro drama" },
    ],
    media: [
      { src: allContent("Nishiddham-previz[4mins].mov"), label: "Nishiddham", meta: "Previz · Feature · 4 min" },
      { src: allContent("Superstar-previz[3mins].mov"), label: "Superstar", meta: "Previz · Feature · 3 min" },
      { src: `${showreel}/portfolio-3.mp4`, label: "Campaign Moodboard", meta: "Moodboard · Look Development" },
      { label: "Board set — in progress", meta: "Placeholder" },
    ],
    pipeline: [
      { title: "Brief and reference", body: "We take the script or the one-line idea, plus whatever references exist, and agree the visual target." },
      { title: "Moodboard", body: "Look development: palette, lens language, grain, lighting and grade direction, presented as a deck." },
      { title: "Shot list", body: "Every frame numbered with lens, movement and duration — the document the whole production runs on." },
      { title: "Storyboard", body: "Photographic boards at finished-grade fidelity, so approvals happen against what the film will actually look like." },
      { title: "Animatic", body: "Boards cut to timing with scratch voiceover and temp score. This is the version that gets signed off." },
      { title: "Handover", body: "Board set, shot list and animatic delivered as a package — usable by us or by any production house you choose." },
    ],
    deliverables: [
      { title: "Moodboard deck", body: "Look, palette, lens language and grade direction in a presentable deck." },
      { title: "Numbered shot list", body: "Lens, movement, duration and coverage notes per frame, in a format a crew can shoot from." },
      { title: "Storyboard set", body: "Photographic frames at finished-grade fidelity, delivered as stills and as a PDF board." },
      { title: "Timed animatic", body: "Cut to the real edit with scratch VO and temp score, in every ratio the campaign needs." },
    ],
    faqs: [
      {
        question: "What is previz in filmmaking?",
        answer:
          "Previz is visualising a film before production — moodboards for look, storyboards for framing and animatics for timing. It moves expensive decisions to the cheapest possible stage, which is why it reliably saves more than it costs.",
      },
      {
        question: "What is an animatic?",
        answer:
          "An animatic is a storyboard cut to timing with scratch voiceover and temp music, so it plays as a rough version of the finished film. It is the artefact most brand approvals should be given against.",
      },
      {
        question: "How do I get an AI storyboard made for my campaign?",
        answer:
          "Send the script or the one-line idea and any references. We return a moodboard and first board set within 48–72 hours, then a numbered shot list and a timed animatic.",
      },
      {
        question: "Can I take the previz to another production house?",
        answer:
          "Yes. The board set, shot list and animatic are delivered as a standalone package. Plenty of clients use our previz to brief a live-action crew rather than to commission the film from us.",
      },
    ],
    related: ["ai-tvc-production", "2d-and-3d-animation", "vertical-micro-dramas"],
  },
  {
    slug: "2d-and-3d-animation",
    navLabel: "2D & 3D Animation",
    navBlurb: "Character animation, animated series and CGI VFX",
    eyebrow: "AI animation studio",
    headingLines: ["Animation", "in two dimensions", "and three"],
    lede:
      "Hinton Studios is an AI animation studio producing 2D character animation, 3D and CGI animation, animated series and AI VFX for brands, kids' properties and title sequences.",
    metaTitle: "AI 2D & 3D Animation Studio — Character Animation, CGI and VFX",
    metaDescription:
      "AI animation studio producing 2D character animation, 3D and CGI animation, animated series and VFX for brands. Animation production in Bengaluru, India. Hinton Studios.",
    intro: {
      heading: "Two dimensions, three dimensions, one pipeline",
      body: [
        "Animation is where a brand can say things live action cannot — talk to children, personify a product, or build a world that does not exist. We produce 2D character animation, 3D and CGI work, animated series episodes, title sequences and AI VFX shots for live-action plates.",
        "The AI pipeline does not replace animation craft; it removes the tween. A character design, a rig-equivalent reference set and a shot list still come first. What changes is that in-betweening, background painting and lighting passes collapse from weeks to days.",
        "For series work the economics matter most: an animated property that previously needed a studio floor and a two-year schedule becomes a season a small directed team can actually finish.",
      ],
    },
    stats: [
      { value: "2D + 3D", label: "Character, CGI and hybrid work" },
      { value: "Series-ready", label: "Episodic pipelines, not one-offs" },
      { value: "Kids-safe", label: "Design and content standards for young audiences" },
      { value: "VFX", label: "AI shots composited onto live plates" },
    ],
    media: [
      { src: allContent("3D Animation Kookie Kandy[30sec].mov"), label: "Kookie & Kandy", meta: "3D Animation · Character · 30 sec" },
      { src: `${showreel}/portfolio-6.mp4`, label: "Title Sequence", meta: "2D Animation · Motion Design" },
      { src: `${showreel}/portfolio-3.mp4`, label: "CGI Spot", meta: "3D Animation · Product CGI" },
      { label: "Animated series — in development", meta: "Placeholder" },
    ],
    pipeline: [
      { title: "Character and world design", body: "Design sheets for every character and location, approved before a frame moves." },
      { title: "Reference lock", body: "Designs converted into locked reference sets — the animation equivalent of a rig, and what keeps a character on-model." },
      { title: "Board and animatic", body: "Boards cut to timing so performance beats and comedy timing are agreed early." },
      { title: "Animation pass", body: "Shots generated and directed against the locked designs, with hand correction wherever performance demands it." },
      { title: "Compositing and VFX", body: "Backgrounds, effects, camera moves and — for hybrid work — AI shots composited onto live-action plates." },
      { title: "Grade, mix and delivery", body: "Colour, sound design, mix and delivery in broadcast, streaming or social specs." },
    ],
    deliverables: [
      { title: "Animated spots and films", body: "30s to 3-minute animated commercials and brand films in 2D, 3D or hybrid." },
      { title: "Series episodes", body: "Episodic animation with a reusable design bible, built for a season rather than a pilot." },
      { title: "Title sequences", body: "Opening titles and motion-design packages, including lower thirds and endboards." },
      { title: "VFX shots", body: "AI-generated elements composited onto live-action plates for set extension, effects and impossible shots." },
    ],
    faqs: [
      {
        question: "Do you do 2D animation, 3D animation, or both?",
        answer:
          "Both, and hybrids of the two. 2D suits character comedy and motion design; 3D and CGI suit product, scale and physical realism. Many campaigns use a 2D character on a CGI product world.",
      },
      {
        question: "Can AI animation hold a character on-model across a series?",
        answer:
          "Yes, with a design bible. Character sheets are converted into locked reference sets before production, which functions like a rig — every episode is generated against the same references rather than prompted from scratch.",
      },
      {
        question: "How much does animation production cost in India with an AI pipeline?",
        answer:
          "Cost scales with character count, shot count and how much hand correction the performance needs — not with studio floor time. Series work is where the saving compounds, because the design bible is built once and amortised across every episode.",
      },
      {
        question: "Can you composite AI shots onto our existing live-action footage?",
        answer:
          "Yes. We produce AI VFX elements — set extensions, effects, crowd and impossible camera moves — and composite them onto live plates, delivering the finished shots back into your edit.",
      },
    ],
    related: ["ai-tvc-production", "brand-and-product-films", "ai-storyboards-and-moodboards"],
  },
];

export const getServiceBySlug = (slug: string): ServiceContent | undefined =>
  servicesContent.find((service) => service.slug === slug);

/** Section headings shared by every service page. */
export const serviceSections = {
  media: "Selected work",
  pipeline: "How it gets made",
  deliverables: "What you receive",
  faq: "Questions brands ask",
  related: "Related capabilities",
  breadcrumb: { home: "Home", services: "Services" },
};

/** Shared CTA pair rendered at the foot of every service page. */
export const serviceCta = {
  heading: "Brief us this week.",
  headingFaded: "Previz by the weekend.",
  sub: "Tell us the product, the audience and the budget band. We come back with a one-page treatment inside 48 hours.",
  book: { label: "Book a call", href: "#connect" },
  work: { label: "View all work", href: "/work" },
};

export const servicesIndex = {
  eyebrow: "Capabilities",
  heading: "What we make",
  lede:
    "Hinton Studios is an AI filmmaking and AI video production studio in Bengaluru. Five capabilities, one human-directed, AI-executed pipeline.",
  metaTitle: "Services — AI Film & Video Production Capabilities",
  metaDescription:
    "AI TVC production, brand and product films, vertical micro dramas, AI storyboards and previz, and 2D & 3D animation. The full capability index of Hinton Studios, Bengaluru.",
};
