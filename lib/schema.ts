import { SITE_URL, SITE_NAME, PORTAL_URL } from "./site";

interface FaqItem {
  q: string;
  a: string;
}

interface HowToStep {
  name: string;
  text: string;
}

export function webSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "Independent guide to targetpayandbenefits.com — login help, 401(k), payslips, benefits and troubleshooting for Target team members.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function orgSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Target Corporation",
    url: "https://corporate.target.com/",
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image.png`,
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://corporate.target.com/",
      "https://www.target.com/",
      PORTAL_URL,
    ],
  };
}

export function breadcrumbSchema(
  items: { name: string; href: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function howToSchema(
  name: string = "How to Log In to Target Pay and Benefits",
  steps: HowToStep[] = [
    {
      name: "Open the portal",
      text: "Go to targetpayandbenefits.com in any current browser.",
    },
    {
      name: "Select Log On",
      text: "Click Log On at the top of the page.",
    },
    {
      name: "Choose your login route",
      text: "Pick the option matching your location — on the Target network or not.",
    },
    {
      name: "Enter credentials",
      text: "Type your User ID and password, then select Log On.",
    },
  ]
) {
  return {
    "@type": "HowTo",
    "@id": `${SITE_URL}/#howto`,
    name,
    totalTime: "PT2M",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleSchema(o: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@type": "Article",
    "@id": `${SITE_URL}${o.path}/#article`,
    headline: o.headline,
    description: o.description,
    url: `${SITE_URL}${o.path}`,
    datePublished: o.datePublished,
    dateModified: o.dateModified,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}
