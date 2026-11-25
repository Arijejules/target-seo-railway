import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Callout from "@/components/Callout";
import StepList from "@/components/StepList";
import FaqBlock from "@/components/FaqBlock";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, howToSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "TargetPayandBenefits Not Working? Fixes and Status",
  description:
    "TargetPayandBenefits not working? Work down the stack: connectivity, caps lock, wrong login route, maintenance window, browser cache, then escalation.",
  path: "/troubleshooting",
  ogAlt: "TargetPayandBenefits not working troubleshooting steps",
  noindex: true,
});

const FAQ = [
  {
    q: "Is the portal down right now?",
    a: "If targetpayandbenefits.com shows a 'site undergoing maintenance' message, it is in a planned maintenance window. Wait — do not keep retrying. If the page does not load at all, check your own connection first before assuming the portal is down.",
  },
  {
    q: "Why does the page keep failing?",
    a: "The most common reasons are caps lock being on, choosing the wrong login option, an expired password or a stale browser cache. Work through the checklist above before escalating.",
  },
  {
    q: "What if maintenance is running?",
    a: "Wait it out. Maintenance windows are usually short. Retrying during maintenance does not help and may add noise to their monitoring. Try again in an hour.",
  },
  {
    q: "When do I escalate?",
    a: "Escalate to the Benefits Center at 800-828-5850 if you have tried all the steps above and still cannot get in. Have your Team Member Number and a description of the error ready.",
  },
];

export default function TroubleshootingPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Troubleshooting", href: "/troubleshooting" },
          ]),
          howToSchema("Fix TargetPayandBenefits login issues", [
            { name: "Check your connection", text: "Make sure your internet connection is working by visiting another website." },
            { name: "Check caps lock", text: "Passwords are case-sensitive — turn off caps lock and try again." },
            { name: "Verify the login route", text: "Make sure you chose the right option: on the Target network or not." },
            { name: "Check for maintenance", text: "If the page says site undergoing maintenance, wait and try later." },
            { name: "Clear browser cache", text: "Clear your browser cache and cookies, then reload the page." },
            { name: "Call the Benefits Center", text: "If nothing works, call 800-828-5850 for direct support." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Troubleshooting", href: "/troubleshooting" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          TargetPayandBenefits Not Working: Fixes That Actually Work
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          If targetpayandbenefits.com is not loading or your login keeps failing,
          work through the checklist below before calling anyone. Most issues resolve
          at the first three steps. The target pay and benefits link down problem is
          almost always on your end or in a planned maintenance window — genuine
          outages are rare.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          TargetPayandBenefits down or just you?
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Try loading a different website. If nothing loads, the problem is your
          connection, not the portal. If other sites work but
          targetpayandbenefits.com does not, the portal may genuinely be down. Try
          again in a few minutes — if the site undergoing maintenance message
          appears, that confirms a planned window.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          TargetPayandBenefits site maintenance
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Maintenance windows usually happen overnight or on weekends and last
          anywhere from a few minutes to a couple of hours. If you see a maintenance
          notice, do not keep retrying — the page will come back on its own. Repeated
          attempts during maintenance do nothing except waste your time.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Fix checklist
        </h2>
        <StepList
          steps={[
            "Check your internet connection — load any other website to confirm.",
            "Turn off caps lock. Passwords are case-sensitive.",
            "Make sure you picked the right login route — Target network or off-network.",
            "If the page says maintenance, wait at least an hour and try again.",
            "Clear your browser cache and cookies, then reload.",
            "Try a different browser or an incognito/private window.",
          ]}
        />

        <h3 className="mt-8 text-lg font-semibold text-neutral-900">
          TargetPayandBenefits login error
        </h3>
        <p className="mt-3 leading-relaxed text-neutral-700">
          A targetpayandbenefits login error after entering credentials usually means
          the User ID or password is wrong. If you are certain you typed them
          correctly, your password may have expired. Use the{" "}
          <a
            href="/forgot-password"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            Forgot User ID or Password
          </a>{" "}
          flow to reset.
        </p>

        <Callout tone="info" title="Still stuck?">
          <p>
            Call the Benefits Center at 800-828-5850. Have your Team Member Number
            and a description of the error ready. There is also a live chat widget
            on the portal itself once you can reach the page.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/login-options", label: "The two login routes" },
            { href: "/forgot-password", label: "Forgot User ID or Password" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
