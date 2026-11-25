import { SITE_URL } from "@/lib/site";
import {
  AI_REFERENCE_CRAWLER_AGENTS,
  AI_TRAINING_CRAWLER_AGENTS,
} from "@/lib/ai-referral";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  // Default group — permissive
  lines.push("User-agent: *");
  lines.push("Allow: /");
  lines.push("Disallow: /api/");
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push("");

  // Per-agent blocks for AI training crawlers — disallow everything
  for (const agent of AI_TRAINING_CRAWLER_AGENTS) {
    lines.push(`User-agent: ${agent}`);
    lines.push("Disallow: /");
    lines.push("");
  }

  // Per-agent blocks for AI reference/search crawlers — allow with api guard
  for (const agent of AI_REFERENCE_CRAWLER_AGENTS) {
    lines.push(`User-agent: ${agent}`);
    lines.push("Allow: /");
    lines.push("Disallow: /api/");
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
