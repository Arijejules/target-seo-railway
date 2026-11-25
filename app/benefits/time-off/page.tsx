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
  title: "Target Time Off, Paid Leave and Family Benefits",
  description:
    "Target time off includes PTO, sick pay, paid holidays, four weeks family leave at 100% pay, $10,000 adoption and $10,000 surrogacy assistance per attempt.",
  path: "/benefits/time-off",
  ogAlt: "Target time off paid leave and family benefits overview",
  noindex: true,
});

const FAQ = [
  {
    q: "How much paid time off do team members get?",
    a: "Target paid time off accrues based on your role and years of service. The exact accrual rate is in the plan documents inside the portal. Part-time and full-time team members have different schedules.",
  },
  {
    q: "How long is paid family leave?",
    a: "Target paid family leave provides up to four weeks at 100% pay replacement for qualifying events, including the birth or adoption of a child. This is in addition to any other leave you may qualify for.",
  },
  {
    q: "How much adoption reimbursement?",
    a: "Target adoption assistance reimburses up to $10,000 per child for eligible adoption expenses. This covers agency fees, legal costs, court costs and travel related to the adoption.",
  },
  {
    q: "Where do I request time off?",
    a: "Time-off requests go through MyTime, Target's scheduling and time-management system. Log in to MyTime from a store device or through the team member portal to submit requests and check your balance.",
  },
];

export default function TimeOffPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Time Off", href: "/benefits/time-off" },
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
            { name: "Time Off", href: "/benefits/time-off" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target Time Off, Paid Leave and Family Benefits
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Target time off programs go well beyond basic PTO. The total rewards
          package includes sick pay, paid holidays, one of the more generous paid
          family leave policies in retail, and financial support for adoption and
          surrogacy. Requests and balances are managed through{" "}
          <a
            href="/contact"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            MyTime
          </a>
          , Target&rsquo;s scheduling system.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target paid time off
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          PTO accrues based on your role and length of service. Full-time and
          part-time team members have different accrual rates. You can check your
          current balance and submit requests in MyTime. Unused PTO may carry over
          within policy limits — review the plan document in the portal for the exact
          cap.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target sick pay and paid holidays
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target provides target sick pay for eligible team members. Paid holidays
          follow the company calendar, which typically includes major federal holidays.
          Holiday premium pay may apply for team members who work on those days. Check
          the schedule in MyTime.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target paid family leave
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target paid family leave provides up to four weeks at 100% pay replacement
          for qualifying events. That includes the birth, adoption or foster placement
          of a child. The benefit applies to all eligible team members regardless of
          gender. It runs in addition to any state-mandated leave and to short-term
          disability benefits for birthing parents.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target adoption assistance and surrogacy assistance
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target adoption assistance reimburses up to $10,000 per child for qualified
          adoption expenses — agency fees, legal costs, court costs and adoption-related
          travel. Target surrogacy assistance provides up to $10,000 per attempt for
          eligible surrogacy-related costs. Both benefits are available to all eligible
          team members.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Managing time off in MyTime
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          All time-off requests flow through MyTime. You can submit requests, view
          your schedule, check your PTO balance and see approved time off in one
          place. Access MyTime from a store or distribution center device, or
          through the team member portal.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/benefits/health", label: "Health, dental and vision" },
            { href: "/benefits/mental-health", label: "Mental health benefits" },
            { href: "/benefits/education", label: "Education assistance" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
