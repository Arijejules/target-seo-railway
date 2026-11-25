import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { PORTAL_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "US Only",
  description:
    "TargetPayandBenefits is available to users in the United States only.",
  path: "/outside-us",
  ogAlt: "TargetPayandBenefits US-only notice",
  noindex: true,
});

export default function OutsideUsPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-neutral-900">
        TargetPayandBenefits is US-only
      </h1>
      <p className="mt-6 leading-relaxed text-neutral-700">
        This guide and the official Target Pay and Benefits portal are available
        only to users in the United States. If you believe you are seeing this
        page in error, try connecting from a US network or disabling your VPN.
      </p>
      <a
        href={PORTAL_URL}
        className="mt-8 inline-block rounded-md bg-[#cc0000] px-6 py-3 font-semibold text-white hover:bg-[#a30000]"
      >
        Visit the official portal
      </a>
    </main>
  );
}
