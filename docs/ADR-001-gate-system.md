# ADR-001: Gate System for Target Pay and Benefits

## Status
Accepted

## Context
The Target Pay and Benefits guide site needs access control for sensitive pages (login, verify) while remaining open and indexable for SEO content pages. The site must protect against unauthorized scrapers, scanners, and malicious bots while allowing legitimate search engines and AI answer engines through.

## Decision

### Gate Architecture
- **Cookie-based gate** (`__tpb_gate`): Set when users arrive via approved referrer or search engine. HttpOnly, Secure, SameSite=Lax, 24h TTL.
- **Referrer gate**: Checks incoming referrer against `GATE_REFERRER` env var. Grants cookie on match.
- **Search referrer gate**: Grants cookie when user arrives from Google, Bing, DuckDuckGo, Yahoo, Baidu, or Yandex.
- **Geo restriction**: US-only access enforced via `x-vercel-ip-country` header. Non-US visitors redirected to `/outside-us`.

### Bot Filtering
- **Trusted crawlers**: Googlebot, Bingbot, DuckDuckBot, Applebot, Yandex, Baidu — always pass through.
- **AI answer engines**: OAI-SearchBot, PerplexityBot, Claude-SearchBot, YouBot, Phind — allowed for content serving.
- **Social crawlers**: TwitterBot, LinkedInBot, SlackBot, etc. — allowed for link previews.
- **Blocked**: Tool UAs (curl, wget, Postman), scanner UAs (Nikto, SQLMap, Shodan), SEO crawlers (Screaming Frog, SEMrush, Ahrefs), headless browsers (PhantomJS, Puppeteer), AI training bots (GPTBot, CCBot, ByteSpider).

### Honeypot Paths
Fake 404 responses for `/admin`, `/wp-admin`, `/.env`, `/.git`, etc. to waste scanner time and collect no data.

### Protected Paths
`/login` and `/verify` require gate cookie or approved referrer. Without them, visitors are redirected to the homepage.

## Consequences
- SEO content pages remain fully accessible to all legitimate visitors and search engines.
- Login/verify pages are protected from direct access without proper referral chain.
- Malicious bots and scanners are blocked at the edge before reaching application code.
- AI training crawlers are blocked while AI answer engines are allowed, consistent with robots.txt rules.
