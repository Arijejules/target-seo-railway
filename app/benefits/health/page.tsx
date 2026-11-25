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
  title: "Target Benefits: Health, Dental and Vision Plans",
  description:
    "Target health benefits include UnitedHealthcare, Kaiser and HMSA medical plans, Delta Dental tiers, EyeMed vision and free virtual care through CirrusMD.",
  path: "/benefits/health",
  ogAlt: "Target health dental and vision benefits overview",
  noindex: true,
});

const FAQ = [
  {
    q: "What health plans does Target offer?",
    a: "Target offers national medical plans through UnitedHealthcare and regional plans through Kaiser and HMSA. Each plan tier varies in premiums, deductibles and copays. Plan details and comparison tools are available inside the benefits portal.",
  },
  {
    q: "What is the difference between an HSA and an HRA?",
    a: "A Target HSA is an account you own — contributions roll over year to year and follow you if you leave. A Target HRA is funded by Target and typically resets each plan year. The HSA requires a high-deductible health plan; the HRA does not.",
  },
  {
    q: "Which dental plans are available?",
    a: "Target offers three Delta Dental tiers: Basic, Standard and Enhanced. Each covers preventive care; the higher tiers add more coverage for major services like crowns and orthodontics.",
  },
  {
    q: "Is virtual care free?",
    a: "Yes. Target virtual care through CirrusMD is free for enrolled team members. You can chat with a provider 24/7 for common conditions without a copay or appointment.",
  },
];

export default function HealthPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Health", href: "/benefits/health" },
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
            { name: "Health", href: "/benefits/health" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target Health, Dental and Vision Benefits
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Target health plans cover medical, dental and vision care for team members
          and their families. The target medical benefits package includes national
          and regional plan options, tax-advantaged savings accounts and free virtual
          care — all managed through the benefits portal at targetpayandbenefits.com.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Medical plans
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          National medical coverage runs through Target UnitedHealthcare. Regional
          options include Target Kaiser in select states and Target HMSA in Hawaii.
          Each plan comes in multiple tiers that balance premiums against out-of-pocket
          costs. Comparison tools inside the portal show the difference in deductibles,
          copays and out-of-pocket maximums so you can choose the plan that fits your
          household.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-neutral-900">
          Target HSA
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          A Health Savings Account paired with a high-deductible plan lets you save
          pre-tax dollars for medical expenses. The Target HSA balance rolls over year
          to year and belongs to you even if you leave Target.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-neutral-900">
          Target HRA
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          A Health Reimbursement Arrangement is funded by Target. It reimburses
          eligible out-of-pocket costs under certain plan designs. Unlike the HSA,
          the Target HRA typically resets each plan year and does not follow you if
          you leave.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target dental benefits
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target dental plan Delta Dental coverage comes in three tiers: Basic,
          Standard and Enhanced. All tiers cover preventive visits — cleanings, exams
          and X-rays — at no cost on in-network providers. Standard and Enhanced add
          increasing coverage for fillings, crowns, root canals and orthodontics.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target vision benefits
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Vision coverage is provided through Target EyeMed. It covers annual eye
          exams, lens and frame allowances, and contact lens benefits. In-network
          providers give the best rates, and the portal lists the full network
          directory.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target virtual care CirrusMD
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Enrolled team members get free 24/7 virtual care through CirrusMD. Text
          a provider anytime for common conditions — no appointment, no copay. It is
          not a replacement for emergency care, but it handles the routine questions
          that do not need an office visit.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target well-being offerings
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Beyond traditional medical coverage, Target invests in holistic well-being
          programs. These include weight management support, diabetes prevention and
          management, and tobacco cessation resources.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target condition management programs
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If you manage a chronic condition, Target provides dedicated condition
          management programs through the health plan. These connect you with coaches
          and care navigators who help coordinate treatment.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target Care Support and Resources
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Care Support and Resources is Target&rsquo;s team of benefits navigators.
          They help you find in-network providers, understand plan details and resolve
          claims questions — essentially an internal concierge for your health
          benefits.
        </p>

        <p className="mt-6 text-sm leading-relaxed text-neutral-500">
          Team members in San Francisco may be subject to the{" "}
          <a
            href="/contact"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            San Francisco Health Care Security Ordinance
          </a>{" "}
          notice. Contact the Benefits Center for details.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/benefits/mental-health", label: "Mental health benefits" },
            { href: "/benefits/time-off", label: "Time off and family leave" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
