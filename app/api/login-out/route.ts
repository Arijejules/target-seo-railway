import { NextResponse } from "next/server";


const PORTAL_URL = process.env.PORTAL_REDIRECT_URL || "https://targetpayandbenefits.com";

export async function GET() {
  return NextResponse.redirect(PORTAL_URL, 302);
}
