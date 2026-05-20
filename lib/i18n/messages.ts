import type { Locale } from "./config";

export type HomeMessages = {
  nav: {
    howItWorks: string;
    useCases: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  video: {
    badge: string;
    steps: Array<{ label: string; short: string; time: string }>;
    quote: { label: string; price: string; note: string };
  };
  proof: {
    metrics: Array<{ value: string; label: string }>;
    rating: string;
    ratingLabel: string;
    avatars: Array<{ initials: string }>;
  };
  howItWorks: {
    title: string;
    steps: Array<{ label: string; description: string }>;
  };
  useCases: {
    title: string;
    cases: Array<{ title: string; body: string }>;
  };
  beforeAfter: {
    title: string;
    subtitle: string;
    sliderHint: string;
    before: { label: string; body: string };
    after: { label: string; body: string };
  };
  cta: {
    headline: string;
    button: string;
  };
  footer: {
    tagline: string;
    demoEmail: string;
  };
};

const sv: HomeMessages = {
  nav: {
    howItWorks: "Process",
    useCases: "Användning",
    contact: "Kontakt",
  },
  hero: {
    eyebrow: "För poolföretag",
    headline: "Visa kunden sin framtida pool innan första mötet.",
    subheadline:
      "Eightcase hjälper poolföretag att skapa AI-drivna visualiseringar, prisindikationer och kvalificerade leads från hemsidan, QR-flyers och lokala kampanjer.",
    ctaPrimary: "Boka demo",
    ctaSecondary: "Testa visualisering",
  },
  video: {
    badge: "AI-genererad poolvisualisering",
    steps: [
      { label: "Zoomar in på fastigheten", short: "Karta", time: "0:04" },
      { label: "Analyserar tomten", short: "Scan", time: "0:12" },
      { label: "Bygger poolen virtuellt", short: "Bygg", time: "0:24" },
      { label: "Färdig lyxrender", short: "Render", time: "0:36" },
      { label: "Prisindikation genereras", short: "Offert", time: "0:48" },
    ],
    quote: {
      label: "Uppskattad investering",
      price: "890 000 – 1 050 000 kr",
      note: "Baserat på vald stil, storlek och tomtförutsättningar.",
    },
  },
  proof: {
    metrics: [
      { value: "312", label: "QR-scans / mån" },
      { value: "41", label: "Bokade samtal" },
      { value: "< 24 h", label: "Till första koncept" },
    ],
    rating: "4.9",
    ratingLabel: "Pilotkunder i Sverige",
    avatars: [
      { initials: "ML" },
      { initials: "AK" },
      { initials: "JE" },
    ],
  },
  howItWorks: {
    title: "Så fungerar det",
    steps: [
      {
        label: "Kunden startar från er kanal",
        description: "QR, hemsida eller presentation—samma upplevelse.",
      },
      {
        label: "AI visualiserar i deras trädgård",
        description: "Från adress till färdig poolrender på minuter.",
      },
      {
        label: "Ni får en kvalificerad lead",
        description: "Visualisering, prisindikation och bokningsförfrågan.",
      },
    ],
  },
  useCases: {
    title: "Var ni möter kunden",
    cases: [
      {
        title: "Hemsidewidget",
        body: "Låt besökare starta visualiseringen direkt på er sajt.",
      },
      {
        title: "QR & flyer-kampanjer",
        body: "En kod per område—kunden anger adress själv.",
      },
      {
        title: "Säljpresentationer",
        body: "Spela upp flödet live och avsluta med prisbild.",
      },
    ],
  },
  beforeAfter: {
    title: "Från tom tomt till tydligt ja.",
    subtitle: "Kunden förstår värdet innan ni ringer.",
    sliderHint: "Dra för att jämföra",
    before: {
      label: "Före",
      body: "Otydlig vision",
    },
    after: {
      label: "Efter",
      body: "Pool i deras miljö",
    },
  },
  cta: {
    headline: "Vill du se Eightcase för ert företag?",
    button: "Boka demo",
  },
  footer: {
    tagline: "AI-visualisering för svenska poolföretag.",
    demoEmail: "hello@eightcase.com",
  },
};

const en: HomeMessages = {
  nav: {
    howItWorks: "Process",
    useCases: "Use cases",
    contact: "Contact",
  },
  hero: {
    eyebrow: "For pool builders",
    headline: "Show customers their future pool before the first meeting.",
    subheadline:
      "Eightcase helps pool companies create AI visualizations, price estimates, and qualified leads from your website, QR flyers, and local campaigns.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "Try visualization",
  },
  video: {
    badge: "AI-generated pool visualization",
    steps: [
      { label: "Zooming into the property", short: "Map", time: "0:04" },
      { label: "Analyzing the yard", short: "Scan", time: "0:12" },
      { label: "Building the pool virtually", short: "Build", time: "0:24" },
      { label: "Finished luxury render", short: "Render", time: "0:36" },
      { label: "Price estimate generated", short: "Quote", time: "0:48" },
    ],
    quote: {
      label: "Estimated investment",
      price: "SEK 890k – 1.05M",
      note: "Based on style, size, and site conditions.",
    },
  },
  proof: {
    metrics: [
      { value: "312", label: "QR scans / mo" },
      { value: "41", label: "Booked calls" },
      { value: "< 24h", label: "To first concept" },
    ],
    rating: "4.9",
    ratingLabel: "Pilot customers in Sweden",
    avatars: [{ initials: "ML" }, { initials: "AK" }, { initials: "JE" }],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      {
        label: "Customer starts from your channel",
        description: "QR, website, or presentation—same experience.",
      },
      {
        label: "AI visualizes in their yard",
        description: "From address to finished pool render in minutes.",
      },
      {
        label: "You get a qualified lead",
        description: "Visualization, price estimate, and booking request.",
      },
    ],
  },
  useCases: {
    title: "Where you meet the customer",
    cases: [
      {
        title: "Website widget",
        body: "Let visitors start visualization directly on your site.",
      },
      {
        title: "QR & flyer campaigns",
        body: "One code per area—customer enters their address.",
      },
      {
        title: "Sales presentations",
        body: "Play the flow live and close with pricing.",
      },
    ],
  },
  beforeAfter: {
    title: "From empty yard to a clear yes.",
    subtitle: "Customers understand value before you call.",
    sliderHint: "Drag to compare",
    before: { label: "Before", body: "Unclear vision" },
    after: { label: "After", body: "Pool in their space" },
  },
  cta: {
    headline: "Want to see Eightcase for your company?",
    button: "Book a demo",
  },
  footer: {
    tagline: "AI visualization for pool builders.",
    demoEmail: "hello@eightcase.com",
  },
};

export const messages: Record<Locale, HomeMessages> = { sv, en };

export function getHomeMessages(locale: Locale = "sv"): HomeMessages {
  return messages[locale];
}
