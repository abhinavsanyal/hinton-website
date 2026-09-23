/**
 * Service-page content — one entry per capability hub (`/services/<slug>`).
 *
 * Copy follows the studio's SEO brief: an answer-first lede, cluster
 * vocabulary in headings, and a specific number/named model every few
 * sentences (fact density is what AI answer engines quote). Every string on a
 * service page comes from here — components stay content-free.
 */

import { getWorkVideoBySource } from "@/data/mocks/work";
import { publicEnv } from "@/env";

const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "")
  : "https://pub-fc6cefbd1ab24e1fb85d8851c0271332.r2.dev";

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

const serviceEntries: ServiceContent[] = [
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
      { value: "Brief-led", label: "Schedule agreed for your project" },
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
      { title: "The brief", body: "Product, audience, media plan and budget band. We develop a treatment and agree the production schedule." },
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
          "The schedule depends on script readiness, shot complexity, approval rounds and language versions. We provide a scoped production timeline after reviewing your brief.",
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


// Focused service pages for distinct buyer needs.
serviceEntries.push(
{
  "slug": "ai-ad-film-production",
  "navLabel": "AI Ad Film Production",
  "navBlurb": "Campaign ideas built for digital screens",
  "eyebrow": "AI Ad Film Production",
  "headingLines": [
    "AI Ad Film Production"
  ],
  "lede": "Turn one campaign idea into a clear, memorable advertising film. Hinton combines script development, art direction, AI image generation and editorial finishing for paid social, online video and brand launches.",
  "metaTitle": "AI Ad Film Production Studio in Bengaluru",
  "metaDescription": "Turn one campaign idea into a clear, memorable advertising film. Hinton combines script development, art direction, AI image generation and editorial finishing for paid social, online video and brand launches.",
  "intro": {
    "heading": "Build the message before generating the image",
    "body": [
      "Start with the audience problem, the single promise and the action you want viewers to take. We develop a treatment and shot plan around those decisions, rather than asking a model to invent the campaign.",
      "An ad film needs more than attractive frames. Product identity, continuity, believable performance and legible brand assets need human review. We plan those checks during preproduction and agree the delivery formats before production starts."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Creative treatment and script",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Hero film and cutdowns",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Platform-specific end cards",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ai-brand-films",
  "navLabel": "AI Brand Films",
  "navBlurb": "Tell the story behind your brand",
  "eyebrow": "AI Brand Films",
  "headingLines": [
    "AI Brand Films"
  ],
  "lede": "Human-directed AI brand films for company stories, positioning campaigns and launches. Hinton helps translate brand values into a cinematic narrative with a consistent visual language.",
  "metaTitle": "AI Brand Films Studio in Bengaluru",
  "metaDescription": "Human-directed AI brand films for company stories, positioning campaigns and launches. Hinton helps translate brand values into a cinematic narrative with a consistent visual language.",
  "intro": {
    "heading": "Make the brand recognisable without relying on a logo",
    "body": [
      "A brand film should establish a point of view. We begin with the company story, approved claims, tone and intended audience, then develop a narrative that has a reason to exist beyond a product demonstration.",
      "AI can support imagined environments, visual metaphors and transitions that would otherwise require complex shoots. When an authentic founder interview or real location is essential, we plan a hybrid approach and preserve the distinction between real footage and generated imagery."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Narrative and visual treatment",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Brand film master",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Social edits and subtitle versions",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ai-product-films",
  "navLabel": "AI Product Films",
  "navBlurb": "Show the product. Make the benefit clear.",
  "eyebrow": "AI Product Films",
  "headingLines": [
    "AI Product Films"
  ],
  "lede": "AI-assisted product films for launches, ecommerce and advertising. Hinton builds product stories around approved references, practical benefits and consistent brand presentation.",
  "metaTitle": "AI Product Films Studio in Bengaluru",
  "metaDescription": "AI-assisted product films for launches, ecommerce and advertising. Hinton builds product stories around approved references, practical benefits and consistent brand presentation.",
  "intro": {
    "heading": "Accuracy is part of the creative brief",
    "body": [
      "A product film must show what the product actually does. Supply pack shots, dimensions, logo files, materials and approved claims so the production can distinguish creative atmosphere from details that must be reproduced exactly.",
      "We plan hero shots, demonstrations and feature callouts as separate sequences. Real product photography or 3D assets can anchor the edit where generated footage cannot reliably reproduce packaging, typography or mechanical details."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Product hero sequences",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Feature demonstrations",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Ecommerce and launch edits",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ai-animation",
  "navLabel": "AI Animation",
  "navBlurb": "2D and 3D characters, worlds and ideas in motion",
  "eyebrow": "AI Animation",
  "headingLines": [
    "AI Animation"
  ],
  "lede": "AI-assisted animation for explainers, branded stories and entertainment. Hinton develops style, character references and editorial rhythm around the story you need to tell.",
  "metaTitle": "AI Animation Studio in Bengaluru",
  "metaDescription": "AI-assisted animation for explainers, branded stories and entertainment. Hinton develops style, character references and editorial rhythm around the story you need to tell.",
  "intro": {
    "heading": "Choose the animation language that serves the story",
    "body": [
      "Animation can explain an invisible process, build a fictional world or give a brand its own character. We establish the visual rules before production: shapes, palettes, movement, shot design and the intended balance between stylisation and realism.",
      "Character sheets and approved keyframes guide each sequence. Human review catches changing proportions, costume drift and inconsistent screen direction. Complex movement may need conventional animation or compositing alongside generated footage."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Style frames and character references",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Animated sequences",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Sound-designed final edits",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ai-vfx-cgi",
  "navLabel": "AI VFX & CGI",
  "navBlurb": "Impossible scenes, carefully finished",
  "eyebrow": "AI VFX & CGI",
  "headingLines": [
    "AI VFX & CGI"
  ],
  "lede": "AI-assisted VFX and CGI for advertising and films. Hinton combines visual development, compositing and finishing to integrate ambitious imagery with the needs of a real campaign.",
  "metaTitle": "AI VFX & CGI Studio in Bengaluru",
  "metaDescription": "AI-assisted VFX and CGI for advertising and films. Hinton combines visual development, compositing and finishing to integrate ambitious imagery with the needs of a real campaign.",
  "intro": {
    "heading": "Plan the composite, not just the spectacle",
    "body": [
      "A convincing effects shot depends on lighting, perspective, scale and the relationship between foreground and background. We assess source footage and references before choosing generation, 3D or compositing techniques.",
      "Brand-critical elements should remain controlled assets. We use approved product imagery and graphic layers where fidelity matters, then review edges, reflections, motion and continuity at delivery resolution."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "VFX concept development",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "CGI and composite sequences",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Graded delivery masters",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ai-reels",
  "navLabel": "AI Reels",
  "navBlurb": "Short stories that earn attention",
  "eyebrow": "AI Reels",
  "headingLines": [
    "AI Reels"
  ],
  "lede": "AI reels and short-form video for brand channels and campaigns. Hinton helps structure an opening hook, a clear message and a useful next step for mobile viewing.",
  "metaTitle": "AI Reels Studio in Bengaluru",
  "metaDescription": "AI reels and short-form video for brand channels and campaigns. Hinton helps structure an opening hook, a clear message and a useful next step for mobile viewing.",
  "intro": {
    "heading": "Design for a small screen and a short attention window",
    "body": [
      "The opening needs to establish context quickly. We plan the first frame, on-screen copy and visual progression together so the reel still makes sense when a viewer starts with sound off.",
      "A series works best with repeatable visual rules and different ideas. We can develop alternate openings, aspect-ratio versions and concise edits for testing. Performance depends on creative, audience, placement and the offer; no single format guarantees results."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Vertical-first scripts",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Captioned reel edits",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Alternative opening hooks",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
{
  "slug": "ugc-style-ads",
  "navLabel": "UGC-Style Ads",
  "navBlurb": "Conversational creative with a clear point",
  "eyebrow": "UGC-Style Ads",
  "headingLines": [
    "UGC-Style Ads"
  ],
  "lede": "UGC-style advertising creative for product explanations and paid social. Hinton develops relatable scripts and mobile-first edits without presenting synthetic performances as genuine customer reviews.",
  "metaTitle": "UGC-Style Ads Studio in Bengaluru",
  "metaDescription": "UGC-style advertising creative for product explanations and paid social. Hinton develops relatable scripts and mobile-first edits without presenting synthetic performances as genuine customer reviews.",
  "intro": {
    "heading": "Keep the conversational tone and the evidence honest",
    "body": [
      "UGC-style describes a visual and editorial approach: direct address, everyday language and a simple demonstration. It should not imply that a performer is a real customer or that a scripted claim is an independent testimonial.",
      "We work from approved benefits and substantiated claims. Real creators, licensed performances and clearly disclosed synthetic material can each have a role, depending on the campaign and platform requirements."
    ]
  },
  "stats": [
    {
      "value": "Human-led",
      "label": "Creative direction"
    },
    {
      "value": "Brief-first",
      "label": "Production planning"
    },
    {
      "value": "Multi-format",
      "label": "Delivery options"
    }
  ],
  "media": [],
  "pipeline": [
    {
      "title": "Define the brief",
      "body": "Agree the audience, message, references, rights and delivery requirements."
    },
    {
      "title": "Approve the treatment",
      "body": "Review scripts and visual references before committing to the full production."
    },
    {
      "title": "Produce and review",
      "body": "Develop the footage and refine continuity, product details and editorial rhythm."
    },
    {
      "title": "Finish and deliver",
      "body": "Review the grade, sound, captions and agreed format versions."
    }
  ],
  "deliverables": [
    {
      "title": "Direct-response scripts",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Mobile-first ad edits",
      "body": "Scope, formats and review rounds agreed in the project brief."
    },
    {
      "title": "Caption and CTA variations",
      "body": "Scope, formats and review rounds agreed in the project brief."
    }
  ],
  "faqs": [
    {
      "question": "What do you need to estimate the project?",
      "answer": "Share your brief, desired duration, reference films, brand assets, delivery formats and target date. We recommend a production approach and quote the agreed scope."
    },
    {
      "question": "Can this be adapted for several markets?",
      "answer": "We can plan subtitles, voiceover and alternate edits. Language review, usage rights and local requirements should be agreed before production."
    }
  ],
  "related": [
    "ai-tvc-production",
    "brand-and-product-films",
    "vertical-micro-dramas"
  ]
},
);

serviceEntries.push({
  "slug": "ai-feature-films",
  "navLabel": "AI Feature Films",
  "navBlurb": "Long-form storytelling, from screenplay and previz to the finished film",
  "eyebrow": "AI feature film production",
  "headingLines": [
    "Big stories.",
    "Feature-length ambition."
  ],
  "lede": "Hinton Studios develops AI feature films and hybrid narrative productions, combining human-led writing and direction with AI-assisted visual development, previsualisation and production.",
  "metaTitle": "AI Feature Film Production & Previsualisation",
  "metaDescription": "Develop an AI feature film with Hinton Studios: screenplay development, visual worlds, character continuity, previsualisation, editing and sound. Discuss your film.",
  "intro": {
    "heading": "A film begins with a story worth telling",
    "body": [
      "We work with filmmakers, producers and storytellers to turn a screenplay or early concept into a practical production plan. The first step is understanding the story, its audience, its visual ambition and the resources needed to deliver it.",
      "Our approach brings together script development, character and environment design, previsualisation, AI-assisted sequences and a considered edit. Some projects suit an AI-led pipeline; others benefit from live action, animation or a hybrid approach. We establish that approach through a treatment and proof of concept.",
      "Long-form work demands continuity across scenes. We plan recurring characters, locations, visual references, shot language and review milestones before committing to full production. Rights, voice permissions, delivery requirements and the final scope are agreed for each film."
    ]
  },
  "stats": [
    {
      "value": "Story first",
      "label": "Human writing and direction"
    },
    {
      "value": "Long form",
      "label": "Feature-length narratives"
    },
    {
      "value": "Hybrid",
      "label": "AI, live action and animation"
    },
    {
      "value": "Scene by scene",
      "label": "Continuity and editorial review"
    }
  ],
  "media": [
{ src: allContent("Nishiddham-previz[4mins].mov"), label: "Nishiddham — previsualisation", meta: "Narrative previz · 2026" },
{ src: allContent("Superstar-previz[3mins].mov"), label: "Superstar — previsualisation", meta: "Narrative previz · 2026" }
],
  "pipeline": [
    {
      "title": "Develop the story",
      "body": "Share a synopsis, screenplay or treatment. We review the narrative, intended audience and production ambitions."
    },
    {
      "title": "Build the visual world",
      "body": "Define characters, locations and look references, then test a representative scene or sequence."
    },
    {
      "title": "Plan and produce",
      "body": "Lock the agreed screenplay, shot plan and review milestones. Produce sequences with continuity checks throughout."
    },
    {
      "title": "Edit, sound and finish",
      "body": "Bring the film together through picture editing, sound design, music, grading and agreed delivery masters."
    }
  ],
  "deliverables": [
    {
      "title": "Treatment and production roadmap",
      "body": "An agreed creative approach, scope and staged production plan."
    },
    {
      "title": "Visual development and previz",
      "body": "Character references, world design and selected scene previsualisation."
    },
    {
      "title": "Film and delivery masters",
      "body": "Edited sequences or a complete film, with sound, grade and formats as scoped."
    }
  ],
  "faqs": [
    {
      "question": "Can you help if I only have an idea?",
      "answer": "Yes. Start with a synopsis or a short conversation. We can scope story development, a treatment or a proof of concept before a full production commitment."
    },
    {
      "question": "Do you produce complete feature films?",
      "answer": "Yes. We discuss complete AI-led and hybrid feature film productions as well as individual sequences and previsualisation. Scope, feasibility, rights and a realistic schedule are agreed after reviewing the script."
    },
    {
      "question": "Can AI be combined with a live-action production?",
      "answer": "Yes. We can plan visual development, environments, animation or selected sequences around live-action material, with the approach tested against your delivery requirements."
    }
  ],
  "related": [
    "ai-storyboards-and-moodboards",
    "ai-vfx-cgi",
    "ai-animation",
    "vertical-micro-dramas"
  ]
});

// Keep animation examples and production detail when consolidating the old hub.
const animation = serviceEntries.find(service => service.slug === "ai-animation");
const previousAnimation = serviceEntries.find(service => service.slug === "2d-and-3d-animation");
if (animation && previousAnimation) {
  animation.media = previousAnimation.media.filter(item => item.src?.includes("3D%20Animation"));
  animation.pipeline = previousAnimation.pipeline;
  animation.deliverables = previousAnimation.deliverables;
  animation.navBlurb = "2D and 3D characters, worlds and ideas in motion";
}

// The inherited episode/title-sequence labels referred to unrelated commercials.
// Publish only examples of the stated format; approved micro-drama samples are pending.
const microDramas = serviceEntries.find(service => service.slug === "vertical-micro-dramas");
if (microDramas) microDramas.media = [];
const storyboards = serviceEntries.find(service => service.slug === "ai-storyboards-and-moodboards");
if (storyboards) storyboards.media = storyboards.media.filter(item => !item.src?.includes("/showreel/"));

// Consolidated services keep a single index entry per distinct offering.
const retiredServices: Record<string, string> = {
  "2d-and-3d-animation": "ai-animation",
  "brand-and-product-films": "ai-brand-films",
};
export const servicesContent: ServiceContent[] = serviceEntries
  .filter(service => !retiredServices[service.slug])
  .map(service => ({ ...service, media: service.media.map(item => {
    const film = item.src ? getWorkVideoBySource(item.src) : undefined;
    return film ? { ...item, label: film.title, meta: `${film.categories.join(" · ")} · ${film.year}` } : item;
  }), related: [...new Set(service.related.map(slug => retiredServices[slug] || slug))].filter(slug => slug !== service.slug) }));

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
  headingFaded: "Let’s shape the story.",
  sub: "Tell us the product, the audience and the budget band. We develop a treatment and agree the production schedule.",
  book: { label: "Book a call", href: "#connect" },
  work: { label: "View all work", href: "/work" },
};

export const servicesIndex = {
  eyebrow: "Capabilities",
  heading: "What we make",
  lede:
    "Hinton Studios is an AI filmmaking and AI video production studio in Bengaluru. Commercials, feature films, animation and episodic storytelling — directed by humans, enabled by AI.",
  metaTitle: "Services — AI Film & Video Production Capabilities",
  metaDescription:
    "AI TVC production, brand and product films, vertical micro dramas, AI storyboards and previz, and 2D & 3D animation. The full capability index of Hinton Studios, Bengaluru.",
};
