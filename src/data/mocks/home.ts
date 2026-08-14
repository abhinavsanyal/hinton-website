/**
 * Placeholder content for the Showreel home page — Hinton Studios rebrand.
 * Story beats unfold through the scroll:
 *   Beat 1 (Hero):          "AI films when Directed"
 *   Beat 2 (Sphere top):    "Prompts when"
 *   Beat 3 (Sphere bottom): "engineered"
 *   Beat 4 (Sphere bottom): "by Humans"
 *   Closing (CTA):          "Dream at the speed of AI …"
 * Fed to the view via props so no string is hardcoded in a component.
 */

import { servicesContent } from "@/data/mocks/services";

export interface NavMenuItem {
  label: string;
  href: string;
  blurb: string;
}

export interface NavLink {
  label: string;
  href: string;
  /** When present the item renders as a glass dropdown rather than a plain link. */
  menu?: NavMenuItem[];
}

export interface CatalistContent {
  url: string;
  /** Headline / subhead split into plain + emphasised (bold) runs. */
  lead: string;
  leadStrong: string;
  /** Dark card: pill label + title. Light card: search query text. */
  pillLabel?: string;
  pillTitle?: string;
  searchText?: string;
  /** Optional video overlay for the diagonal card treatment. */
  video?: string;
}

export interface PortfolioItem {
  year: string;
  client: string;
  title: string;
  discipline: string;
  video: string;
}

export interface ShowreelContent {
  brand: string;
  logo: string;
  nav: NavLink[];
  /** Black CTA pinned to the right of the header bar. */
  headerCta: { label: string; href: string };
  heroSubline?: string;
  marquee: string[];
  hero: {
    lines: string[];
    templatesTitle: string;
    bottomBlock?: {
      leftText: string;
      features?: string[];
      rightText?: string;
      rightTextBullets?: string[];
      avatars?: string[];
    };
  };
  catalistDark: CatalistContent;
  catalistLight: CatalistContent;
  /** CTA pinned under the 4-card carousel (the second block). */
  carouselCta: {
    button: string;
    href: string;
  };
  sphere: {
    headingTop: string;
    headingBottom: string[];
    /** Supporting paragraphs shown in the open sphere scene. */
    body: string[];
    /** Carousel-face chrome (slot-4 card preview). */
    cardLabel: string;
    cardUrl: string;
    cardHeading: string;
  };
  portfolio: {
    items: PortfolioItem[];
  };
  cta: {
    heading: string;
    /** Second heading line, rendered semi-transparent (like the hero subtitle). */
    headingFaded: string;
    sub: string;
    button: string;
    href: string;
  };
}

import { publicEnv } from "@/env";

const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL 
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "") 
  : "/assets";

const A = `${MEDIA_BASE}/showreel`;
const B = "/assets/brand";

export const homeContent: ShowreelContent = {
  brand: "Hinton Studios",
  logo: `${B}/hinton-studios-logo.png`,
  nav: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Work", href: "/work" },
    {
      label: "Services",
      href: "/services",
      menu: servicesContent.map((service) => ({
        label: service.navLabel,
        href: `/services/${service.slug}`,
        blurb: service.navBlurb,
      })),
    },
    { label: "Studio", href: "#studio" },
  ],
  headerCta: { label: "Book a call", href: "#connect" },
  heroSubline:
    "Broadcast-grade Brand Films, TV Commercials, Animation, Previz, Vertical Micro Dramas and more. Directed by human filmmakers. We bet you cannot tell the difference between a shot made with a camera or a frame made by us.",
  marquee: [
    "AI ad film production",
    "AI TVC production house",
    "Micro drama & vertical series",
    "AI storyboards & animatics",
    "Human-directed, AI-executed",
    "Bengaluru to worldwide",
  ],

  /* ── Beat 1 ──────────────────────────────────────────────────────────── */
  hero: {
    lines: ["AI films", "when Directed"],
    templatesTitle: "Explore our\nshowreel",
    bottomBlock: {
      leftText: "",
      rightTextBullets: [
        "Broadcast 4K Delivery",
        "Zero Shoot Days",
        "100% Character Consistency",
        "Human-Directed Pipeline",
        "Generative AI Execution",
        "Cinematic Color & Rhythm",
        "Scalable Micro Dramas",
        "Advanced Storyboarding",
        "Campaign-Ready In Days"
      ],
    },
  },

  /* ── Cards (carousel slots 2 & 3) ─────────────────────────────────── */
  catalistDark: {
    url: "hintonstudios.com",
    pillLabel: "AI PIPELINE",
    pillTitle: "Start Campaign",
    lead: "Production engine for ",
    leadStrong: "AI Films",
    video: `${B}/Outro-horizontal.mp4`,
  },
  catalistLight: {
    url: "hintonstudios.com",
    searchText: "Generate 30s TVC",
    lead: "From script to screen. ",
    leadStrong: "One AI pipeline.",
    video: `${A}/portfolio-1.mp4`,
  },

  carouselCta: {
    button: "See our work",
    href: "/work",
  },

  /* ── Beats 2–4 (sphere section) ──────────────────────────────────── */
  sphere: {
    headingTop: "Prompts",
    headingBottom: ["when", "engineered"],
    body: [
      "And stories, when made for humans, by humans. Prompt engineering is a craft discipline here, not a text box. Our directors write cinematic prompts the way a DOP writes a lighting plot: lens, movement, grain, valence.",
      "That discipline is what separates an AI video production studio from an AI tool. Character consistency across a hundred shots, a colour palette that survives a full campaign, a 180-degree axis that never breaks. Machine execution, human direction, frame by frame.",
    ],
    cardLabel: "AI film studio, Bengaluru",
    cardUrl: "hintonstudios.com",
    cardHeading: "Stories, by Humans",
  },

  /* ── Portfolio ─────────────────────────────────────────────────────── */
  portfolio: {
    items: [
      {
        year: "2025",
        client: "Tata 1mg",
        title: "Tata 1mg",
        discipline: "AI TVC · Comedy Ad Film · VFX",
        video: `${A}/portfolio-1.mp4`,
      },
      {
        year: "2025",
        client: "Domino's",
        title: "Domino's",
        discipline: "AI Ad Film · 3D Animation · Product Film",
        video: `${A}/portfolio-2.mp4`,
      },
      {
        year: "2025",
        client: "Kookie & Kandy",
        title: "Kookie & Kandy",
        discipline: "AI Animated Series · 2D Character Animation",
        video: `${A}/portfolio-3.mp4`,
      },
    ],
  },

  /* ── Closing beat (CTA) ────────────────────────────────────────────── */
  cta: {
    heading: "Dream at the",
    headingFaded: "speed of AI",
    sub: "Campaign films, TVCs, and micro dramas. Briefed today, delivered in days. With budgets that make sense. Mail us your madness.",
    button: "Get in touch",
    href: "mailto:hello@hintonstudios.com",
  },
};
