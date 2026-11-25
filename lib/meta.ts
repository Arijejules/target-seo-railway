import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./site";

export function buildMetadata(o: {
  title: string;
  description: string;
  path: string;
  ogAlt: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${o.path}`;
  return {
    title: o.title,
    description: o.description,
    robots: o.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: o.title,
      description: o.description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og.png`,
          width: 1200,
          height: 630,
          alt: o.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: o.title,
      description: o.description,
      images: [`${SITE_URL}/og.png`],
    },
  };
}
