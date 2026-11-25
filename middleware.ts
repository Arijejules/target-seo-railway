import { NextRequest, NextResponse } from "next/server";

const GATE_COOKIE = "__tpb_gate";

const GATED_PATHS = ["/verify"];

const HONEYPOT_PATHS = [
  "/admin", "/wp-admin", "/wp-login.php", "/.env", "/config",
  "/administrator", "/phpmyadmin", "/debug", "/.git",
];

const BLOCKED_TOOL_UAS = [
  /curl\//i, /wget\//i, /httpie\//i, /python-requests/i,
  /python-urllib/i, /java\//i, /go-http-client/i, /axios\//i,
  /node-fetch/i, /postman/i, /insomnia/i,
];

const BLOCKED_SCANNER_UAS = [
  /nikto/i, /nmap/i, /sqlmap/i, /dirbuster/i, /gobuster/i,
  /wpscan/i, /masscan/i, /zgrab/i, /censys/i, /shodan/i,
  /nuclei/i, /httpx/i, /subfinder/i, /amass/i, /whatweb/i,
  /jorgee/i, /semrush/i, /ahrefs/i, /mj12bot/i, /dotbot/i,
  /blexbot/i, /megaindex/i, /seokicks/i, /sistrix/i,
];

const BLOCKED_SEO_CRAWLERS = [
  /screaming\s?frog/i, /sitebulb/i, /deepcrawl/i, /oncrawl/i,
  /botify/i, /contentking/i, /siteimprove/i,
];

const BLOCKED_HEADLESS = [
  /headlesschrome/i, /phantomjs/i, /puppeteer/i, /playwright/i,
  /selenium/i, /webdriver/i,
];

const BLOCKED_AI_TRAIN = [
  /gptbot/i, /chatgpt-user/i, /ccbot/i, /anthropic-ai/i,
  /cohere-ai/i, /facebookexternalhit/i, /bytespider/i,
  /amazonbot/i, /meta-externalagent/i, /img2dataset/i,
];

const TRUSTED_CRAWLERS = /googlebot|bingbot|duckduckbot|applebot|yandexbot|baiduspider/i;

const AI_ANSWER_ENGINES = /oai-searchbot|perplexitybot|claude-searchbot|youbot|phind/i;

const SOCIAL_CRAWLERS = /twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|discordbot/i;

const SEARCH_REFERRERS = /google\.|bing\.|duckduckgo\.|yahoo\.|baidu\.|yandex\./i;

function isBlocked(ua: string): boolean {
  const lists = [BLOCKED_TOOL_UAS, BLOCKED_SCANNER_UAS, BLOCKED_SEO_CRAWLERS, BLOCKED_HEADLESS, BLOCKED_AI_TRAIN];
  for (const list of lists) {
    for (const re of list) {
      if (re.test(ua)) return true;
    }
  }
  return false;
}

function buildBlockPage(): string {
  return `<!DOCTYPE html><html><head><title>Access Denied</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb">
<div style="text-align:center"><h1 style="color:#cc0000">403</h1><p>Access denied.</p></div>
</body></html>`;
}

function buildHoneypotPage(): string {
  return `<!DOCTYPE html><html><head><title>Not Found</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb">
<div style="text-align:center"><h1>404</h1><p>Not found.</p></div>
</body></html>`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  // Honeypot: respond with fake 404 to scanners
  if (HONEYPOT_PATHS.some((p) => pathname.toLowerCase().startsWith(p))) {
    return new NextResponse(buildHoneypotPage(), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Block malicious bots/scanners
  if (isBlocked(ua)) {
    return new NextResponse(buildBlockPage(), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Allow trusted crawlers, answer engines, and social bots through
  if (TRUSTED_CRAWLERS.test(ua) || AI_ANSWER_ENGINES.test(ua) || SOCIAL_CRAWLERS.test(ua)) {
    return NextResponse.next();
  }

  // Geo restriction (supports Cloudflare, Vercel, or custom proxy headers)
  const country = request.headers.get("cf-ipcountry")
    || request.headers.get("x-vercel-ip-country")
    || request.headers.get("x-country-code");
  if (country && country !== "US" && country !== "XX" && country !== "T1") {
    return NextResponse.redirect(new URL("/outside-us", request.url), 307);
  }

  // Gate system for protected paths
  if (GATED_PATHS.some((p) => pathname.startsWith(p))) {
    const gateCookie = request.cookies.get(GATE_COOKIE)?.value;
    const referer = request.headers.get("referer") || "";
    const gateReferrer = process.env.GATE_REFERRER;

    // Check gate cookie
    if (gateCookie === "1") {
      return NextResponse.next();
    }

    // Check referrer gate
    if (gateReferrer && referer) {
      try {
        const refHost = new URL(referer).hostname.replace(/^www\./, "");
        const gateHost = gateReferrer.replace(/^www\./, "");
        if (refHost === gateHost || refHost.endsWith(`.${gateHost}`)) {
          const res = NextResponse.next();
          res.cookies.set(GATE_COOKIE, "1", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 86400,
            path: "/",
          });
          return res;
        }
      } catch { /* invalid referer */ }
    }

    // Check search referrer
    if (SEARCH_REFERRERS.test(referer)) {
      const res = NextResponse.next();
      res.cookies.set(GATE_COOKIE, "1", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 86400,
        path: "/",
      });
      return res;
    }

    // No gate pass — redirect to home
    return NextResponse.redirect(new URL("/", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|robots\\.txt|sitemap\\.xml|icon\\.svg|og\\.png|manifest\\.json|\\.well-known|outside-us|favicon\\.ico|icon-48x48\\.png|icon-32x32\\.png|apple-touch-icon\\.png|target-logo\\.png|portrait-section\\.png|alight-worklife-logo\\.png|app-store-badge\\.png|google-play-badge\\.png).*)",
  ],
};
