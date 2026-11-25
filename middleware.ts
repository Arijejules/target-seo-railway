import { NextRequest, NextResponse } from "next/server";

const GATE_COOKIE = "__tpb_gate";
const GEO_COOKIE = "__tpb_geo";

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

function getVisitorIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && first !== "127.0.0.1" && first !== "::1") return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "127.0.0.1" && realIp !== "::1") return realIp;
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  return null;
}

async function getCountryCode(request: NextRequest): Promise<string | null> {
  const fromProxy = request.headers.get("cf-ipcountry")
    || request.headers.get("x-vercel-ip-country")
    || request.headers.get("x-country-code");
  if (fromProxy) return fromProxy;

  const cached = request.cookies.get(GEO_COOKIE)?.value;
  if (cached && /^[A-Z]{2}$/.test(cached)) return cached;

  const ip = getVisitorIp(request);
  if (!ip) return null;

  const apis = [
    { url: `http://ip-api.com/json/${ip}?fields=countryCode`, parse: (d: Record<string, string>) => d.countryCode },
    { url: `https://ipapi.co/${ip}/country/`, parse: (_d: Record<string, string>, text: string) => text.trim() },
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) continue;
      const text = await res.text();
      let code: string;
      try {
        const json = JSON.parse(text);
        code = api.parse(json, text);
      } catch {
        code = api.parse({} as Record<string, string>, text);
      }
      if (code && /^[A-Z]{2}$/.test(code)) return code;
    } catch {}
  }

  return null;
}

function setGeoCookie(res: NextResponse, country: string) {
  res.cookies.set(GEO_COOKIE, country, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });
}

function handleGate(request: NextRequest, existingRes?: NextResponse): NextResponse {
  const gateCookie = request.cookies.get(GATE_COOKIE)?.value;
  const referer = request.headers.get("referer") || "";
  const gateReferrer = process.env.GATE_REFERRER;

  if (gateCookie === "1") {
    return existingRes || NextResponse.next();
  }

  if (gateReferrer && referer) {
    try {
      const refHost = new URL(referer).hostname.replace(/^www\./, "");
      const gateHost = gateReferrer.replace(/^www\./, "");
      if (refHost === gateHost || refHost.endsWith(`.${gateHost}`)) {
        const res = existingRes || NextResponse.next();
        res.cookies.set(GATE_COOKIE, "1", {
          httpOnly: true, secure: true, sameSite: "lax", maxAge: 86400, path: "/",
        });
        return res;
      }
    } catch {}
  }

  if (SEARCH_REFERRERS.test(referer)) {
    const res = existingRes || NextResponse.next();
    res.cookies.set(GATE_COOKIE, "1", {
      httpOnly: true, secure: true, sameSite: "lax", maxAge: 86400, path: "/",
    });
    return res;
  }

  return NextResponse.redirect(new URL("/", request.url), 307);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  if (HONEYPOT_PATHS.some((p) => pathname.toLowerCase().startsWith(p))) {
    return new NextResponse(buildHoneypotPage(), {
      status: 404, headers: { "Content-Type": "text/html" },
    });
  }

  if (isBlocked(ua)) {
    return new NextResponse(buildBlockPage(), {
      status: 403, headers: { "Content-Type": "text/html" },
    });
  }

  if (TRUSTED_CRAWLERS.test(ua) || AI_ANSWER_ENGINES.test(ua) || SOCIAL_CRAWLERS.test(ua)) {
    return NextResponse.next();
  }

  const country = await getCountryCode(request);

  if (country && country !== "US" && country !== "XX" && country !== "T1") {
    const res = NextResponse.redirect(new URL("/outside-us", request.url), 307);
    setGeoCookie(res, country);
    return res;
  }

  const isGated = GATED_PATHS.some((p) => pathname.startsWith(p));

  if (country === "US") {
    const res = NextResponse.next();
    if (!request.cookies.get(GEO_COOKIE)?.value) setGeoCookie(res, "US");
    if (isGated) return handleGate(request, res);
    return res;
  }

  if (isGated) return handleGate(request);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|robots\\.txt|sitemap\\.xml|icon\\.svg|og\\.png|manifest\\.json|\\.well-known|outside-us|favicon\\.ico|icon-48x48\\.png|icon-32x32\\.png|apple-touch-icon\\.png|target-logo\\.png|portrait-section\\.png|alight-worklife-logo\\.png|app-store-badge\\.png|google-play-badge\\.png).*)",
  ],
};
