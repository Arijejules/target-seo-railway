import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqBlock from "@/components/FaqBlock";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Target Benefits Contact Numbers and Support",
  description:
    "Target Benefits Center: 800-828-5850. What to have ready, chat options, Benefit Providers Contact List and mailing address at 1000 Nicollet Mall, Minneapolis.",
  path: "/contact",
  ogAlt: "Target Benefits Center contact numbers and support channels",
  noindex: true,
});

const FAQ = [
  {
    q: "What number do I call?",
    a: "The primary Target benefits phone number is 800-828-5850. An alternate number is 847-883-0433. Both connect to the Benefits Center operated by Alight for Target Corporation.",
  },
  {
    q: "What should I have ready?",
    a: "Have your Team Member Number, the last four digits of your Social Security Number and a description of your issue ready before you call. This speeds up identity verification and gets you to the right team faster.",
  },
  {
    q: "Is there chat?",
    a: "Yes. The portal at targetpayandbenefits.com has a live chat widget that appears after you log in. It connects you with a support agent who can help with benefits questions in real time.",
  },
  {
    q: "What is the mailing address?",
    a: "Target Corporation headquarters is at 1000 Nicollet Mall, Minneapolis, MN 55403. For benefits-specific correspondence, the Benefits Center mailing address may differ — confirm it with the agent when you call.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Contact", href: "/contact" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target Benefits Contact Numbers and Support
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          The quickest way to reach a human about your Target benefits is the
          target benefits phone number: <strong>800-828-5850</strong>. That line
          connects to the Target Benefits Center, which is operated by Alight on
          behalf of Target Corporation. An alternate number is 847-883-0433. Both
          handle the same range of benefits questions.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          TargetPayandBenefits customer service
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The target benefits center handles enrollment questions, login issues,
          401(k) inquiries, health plan questions, claims disputes and life-event
          changes. The agents can also help you navigate the portal itself if you are
          having trouble finding a specific section.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What to have ready
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Before you call, gather your Team Member Number, the last four digits of
          your Social Security Number and a brief description of your issue. If the
          issue involves a claim, have the claim number or date of service handy.
          This information shortens the verification step and gets you to the right
          agent faster.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Chat support
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The portal at targetpayandbenefits.com includes a live chat widget that
          appears once you are logged in. It connects you with a support agent in
          real time. If you prefer typing to talking, this is the channel to use.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Benefit Providers Contact List
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          For questions about a specific provider — UnitedHealthcare, Delta Dental,
          EyeMed, Spring Health or any other partner — the portal publishes a Benefit
          Providers Contact List. It contains direct phone numbers and websites for
          each provider, so you can skip the Benefits Center and go straight to the
          source when that is faster.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Mailing address
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target Corporation headquarters is at 1000 Nicollet Mall, Minneapolis,
          MN 55403. For benefits-specific correspondence, confirm the correct mailing
          address with the Benefits Center agent when you call — the processing
          address may differ from the corporate headquarters.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          When to use which channel
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Call 800-828-5850 for anything urgent — locked accounts, enrollment
          deadlines, claims disputes. Use chat for routine questions you can type
          while doing something else. Use the Benefit Providers Contact List when
          your question is about a specific insurer or program rather than the portal
          itself.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/troubleshooting", label: "Portal not working" },
            { href: "/forgot-password", label: "Forgot User ID or Password" },
            { href: "/benefits/health", label: "Health, dental and vision" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
