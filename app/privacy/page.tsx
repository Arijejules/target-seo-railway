import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { PORTAL_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}. No accounts, no login, no data sold.`,
  path: "/privacy",
  ogAlt: "Privacy policy for Target Pay and Benefits Guide",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Effective date: November 21, 2026
      </p>

      <div className="mt-8 space-y-4 leading-relaxed text-neutral-700">
        <p>
          {SITE_NAME} is an independent informational guide. We do not operate
          the official Target Pay and Benefits portal and have no access to your
          employment records, payroll data, or benefits elections.
        </p>
        <p>
          This site does not require you to create an account, log in, or
          provide any personal information. There are no contact forms, comment
          sections, or user-generated content features. We do not collect names,
          email addresses, Social Security numbers, or any other personally
          identifiable information.
        </p>
        <p>
          We do not sell, rent, trade, or otherwise share personal data with
          third parties because we do not collect it. No advertising networks,
          analytics trackers, or marketing pixels are used on this site.
        </p>
        <p>
          This site contains links to third-party websites, including the
          official portal at{" "}
          <a
            href={PORTAL_URL}
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
            rel="noopener noreferrer"
          >
            targetpayandbenefits.com
          </a>
          . Once you leave this site, you are subject to the privacy policy of
          the destination. We are not responsible for the privacy practices of
          those external sites.
        </p>
        <p>
          Our hosting provider may collect standard server logs (IP address,
          browser type, pages visited) for security and performance purposes.
          These logs are not used for tracking or profiling and are retained
          according to the provider&apos;s data retention policy.
        </p>
        <p>
          We may update this policy to reflect changes in our practices. Any
          changes will be posted on this page with a revised effective date.
        </p>
      </div>
    </main>
  );
}
