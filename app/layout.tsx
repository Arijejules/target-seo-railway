import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { CONTENT_SIGNAL } from "@/lib/ai-referral";
import { VisitorPing } from "@/components/VisitorPing";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cc0000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description:
    "Independent guide to Target Pay and Benefits. Login help, payslips, 401(k), health coverage, W-2 forms and troubleshooting for targetpayandbenefits.com.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  other: {
    "content-signal": CONTENT_SIGNAL,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <VisitorPing />
        {children}
      </body>
    </html>
  );
}
