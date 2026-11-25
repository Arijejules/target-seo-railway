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
  title: "Target Mental Health Benefits and Free 24/7 Support",
  description:
    "Target mental health benefits include free confidential access through Spring Health, EAP coverage and family support. Available 24/7 at no cost to team members.",
  path: "/benefits/mental-health",
  ogAlt: "Target mental health benefits through Spring Health",
  noindex: true,
});

const FAQ = [
  {
    q: "Is Spring Health free?",
    a: "Yes. Target Spring Health sessions are available at no cost to eligible team members. There is no copay, no deductible and no need to use your medical plan benefits to access them.",
  },
  {
    q: "Is it confidential?",
    a: "Yes. Target mental health services through Spring Health are confidential. Your employer does not receive information about your sessions, diagnoses or treatment details.",
  },
  {
    q: "Does my family get access?",
    a: "Yes. Eligible household members, including spouses, domestic partners and dependents, can access Target mental health benefits through Spring Health at no additional cost.",
  },
  {
    q: "How do I start?",
    a: "Visit the Spring Health platform through the benefits portal at targetpayandbenefits.com or directly through the Spring Health website. You can schedule a session or start a conversation with a provider immediately.",
  },
];

export default function MentalHealthPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Mental Health", href: "/benefits/mental-health" },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Benefits", href: "/benefits/health" },
            { name: "Mental Health", href: "/benefits/mental-health" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target Mental Health and Well-being Resources
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Target mental health benefits give team members free, confidential access
          to professional support 24 hours a day, 7 days a week. The primary channel
          is Target Spring Health, a platform that connects you with licensed
          therapists and coaches without a referral, a copay or a waiting list.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What Spring Health covers
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Spring Health provides therapy sessions, coaching, digital self-care tools
          and crisis support. Sessions are free for eligible team members — no need
          to use your medical plan. The platform covers common concerns like anxiety,
          depression, stress, relationship issues and workplace challenges. It also
          offers specialized support for life events like grief, parenting and
          financial stress.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target EAP scope
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The Target EAP (Employee Assistance Program) provides short-term
          counseling, referrals and work-life resources. It covers areas beyond
          traditional therapy, including legal consultations, financial guidance and
          elder-care referrals. The EAP is available to all team members regardless
          of medical plan enrollment.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Confidentiality
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Everything you discuss with a provider through Target mental health
          services stays between you and that provider. Target does not receive
          information about who uses the program, what is discussed or what
          diagnoses are made. The confidentiality protections are the same ones that
          apply to any licensed mental health provider.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Family coverage
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Eligible household members — spouses, domestic partners and dependents —
          can access the same mental health resources at no additional cost. Each
          family member can use the platform independently and confidentially.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Getting started
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Log in to targetpayandbenefits.com and look for the mental health or
          well-being section, or go directly to the Spring Health platform. You can
          browse providers, schedule a session or start a guided self-care module
          right away. No manager approval and no paperwork.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/benefits/health", label: "Health, dental and vision" },
            { href: "/benefits/time-off", label: "Time off and family leave" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
