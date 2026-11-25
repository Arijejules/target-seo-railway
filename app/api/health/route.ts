import { NextResponse } from "next/server";


export async function GET() {
  return NextResponse.json({
    ok: true,
    project: "target-pay-benefits",
    ts: Date.now(),
  });
}
