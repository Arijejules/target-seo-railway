import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { PORTAL_URL, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms of use for ${SITE_NAME}. Independent guide, no warranty.`,
  path: "/terms",
  ogAlt: "Terms of use for Target Pay and Benefits Guide",
  noindex: true,
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900">Terms of Use</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Effective date: November 21, 2026
      </p>

      <div className="mt-8 space-y-4 leading-relaxed text-neutral-700">
        <p>
          {SITE_NAME} is an independent informational resource. It is not
          affiliated with, endorsed by, or operated by Target Corporation,
          Alight Solutions, or any of their subsidiaries. All trademarks,
          service marks, and trade names referenced on this site are the
          property of their respective owners.
        </p>
        <p>
          The content on this site is provided for general informational
          purposes only. While we strive to keep the information accurate and
          up to date, we make no representations or warranties of any kind,
          express or implied, about the completeness, accuracy, reliability,
          or suitability of the information. Your use of any information on
          this site is strictly at your own risk.
        </p>
        <p>
          This site does not provide financial, legal, tax, or benefits
          advice. For authoritative information about your Target pay and
          benefits, always refer to the official portal at{" "}
          <a
            href={PORTAL_URL}
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
            rel="noopener noreferrer"
          >
            targetpayandbenefits.com
          </a>{" "}
          or contact Target&apos;s HR department directly.
        </p>
        <p>
          We are not responsible for the content, privacy practices, or
          availability of any external websites linked from this site. Links
          to third-party sites do not constitute an endorsement of their
          content or services.
        </p>
        <p>
          We reserve the right to modify or discontinue this site, with or
          without notice, at any time. We shall not be liable to you or any
          third party for any modification, suspension, or discontinuation.
        </p>
        <p>
          By using this site, you agree to these terms. If you do not agree,
          please do not use the site. We may update these terms at any time;
          continued use after changes constitutes acceptance.
        </p>
      </div>
    </main>
  );
}
