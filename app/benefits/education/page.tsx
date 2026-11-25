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
  title: "Target Education Assistance and Dream to Be",
  description:
    "Target education assistance through Dream to Be offers roughly 500 programs across 40+ schools, many tuition-free. Eligibility, how to apply and what is covered.",
  path: "/benefits/education",
  ogAlt: "Target education assistance and Dream to Be program",
  noindex: true,
});

const FAQ = [
  {
    q: "What is Dream to Be?",
    a: "Target Dream to Be is Target's education assistance program. It provides access to roughly 500 certificate, bootcamp and degree programs across 40+ schools, with many options available tuition-free to eligible team members.",
  },
  {
    q: "Are programs really tuition-free?",
    a: "Many are. Target covers tuition costs for a wide selection of programs at partner schools. The exact coverage depends on the school and program — some are fully tuition-free, others have reduced costs. Check the program catalog for details.",
  },
  {
    q: "Who is eligible?",
    a: "Eligibility is based on your employment status and tenure. Both full-time and part-time team members may qualify. Specific requirements are in the program details inside the benefits portal.",
  },
  {
    q: "How do I apply?",
    a: "Log in to targetpayandbenefits.com and navigate to the education assistance section. Browse the catalog of available programs, select the one you want and follow the enrollment steps. Applications go through the portal, not through the schools directly.",
  },
];

export default function EducationPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Education", href: "/benefits/education" },
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
            { name: "Education", href: "/benefits/education" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target Education Assistance and Dream to Be
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Target education assistance is built around <strong>Dream to Be</strong>,
          a program that opens roughly 500 certificate, bootcamp and degree paths
          across 40+ partner schools. Many of those paths are target tuition free
          degree options, meaning Target covers the tuition entirely. It is one of
          the most expansive education benefits in retail and a core part of
          Target&rsquo;s target career development commitment.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What Dream to Be covers
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The program spans certificates, bootcamps, associate degrees, bachelor&rsquo;s
          degrees and select master&rsquo;s programs. Fields range from business and
          technology to healthcare and the trades. Some programs are fully online,
          making them practical for team members who work rotating schedules.
          Target tuition reimbursement applies to programs in the catalog — you do
          not need to find a school on your own and then ask for reimbursement.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Tuition-free options
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          A significant subset of Dream to Be programs are tuition-free. Target pays
          the tuition directly to the school so you are not fronting costs and waiting
          for reimbursement. Books and fees may still apply depending on the program,
          but the tuition line itself is zero.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Eligibility and how to apply
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Both full-time and part-time team members may qualify. Eligibility details
          — including minimum tenure and hours — are in the portal. To apply, log in
          to targetpayandbenefits.com, navigate to the education assistance section
          and browse the catalog. Select a program and follow the enrollment steps.
          Target career development advisors can help you choose if you are unsure.
        </p>

        <p className="mt-4 leading-relaxed text-neutral-700">
          For broader career information, see the{" "}
          <a
            href="https://corporate.target.com/careers/"
            target="_blank"
            rel="noopener"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            Target Careers
          </a>{" "}
          site.
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
            { href: "/401k", label: "Target 401(k) / TGT401k" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
