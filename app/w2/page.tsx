import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Callout from "@/components/Callout";
import FaqBlock from "@/components/FaqBlock";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Getting Your Target W-2 and Tax Forms",
  description:
    "How to access your Target W-2 and tax forms through the employee benefits portal. Covers electronic delivery, timing, former-employee retrieval and corrections.",
  path: "/w2",
  ogAlt: "Target W-2 and tax forms access through the benefits portal",
  noindex: true,
});

const FAQ = [
  {
    q: "When is the W-2 available?",
    a: "Target typically makes W-2 forms available electronically by late January for the prior tax year. If you consented to electronic delivery, you can download it as soon as it posts. Paper copies mail by the January 31 deadline.",
  },
  {
    q: "Can former employees get their W-2?",
    a: "Yes. Former team members can access W-2s through the target employee benefits portal by verifying their identity through Alight. If your account is inactive, call the Benefits Center at 800-828-5850 for help.",
  },
  {
    q: "How do I consent to electronic delivery?",
    a: "Log in to targetpayandbenefits.com, navigate to the tax forms section and select the option to receive your W-2 electronically. Consent is usually a one-time toggle that carries forward each year.",
  },
  {
    q: "What if my W-2 is wrong?",
    a: "If the figures on your W-2 do not match your records, contact the Benefits Center at 800-828-5850. Target will issue a corrected W-2 (W-2c) if an error is confirmed. Do not file your taxes with an incorrect form.",
  },
];

export default function W2Page() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "W-2 and Tax Forms", href: "/w2" },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "W-2 and Tax Forms", href: "/w2" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          How to Get Your Target W-2 and Tax Forms
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Every January, Target team members start searching for their target W2 and
          tax forms. The W-2 is the form your tax preparer or filing software needs
          to report your wages, tips and withheld taxes for the prior year. Target
          delivers it through the target employee benefits portal at
          targetpayandbenefits.com, administered by Alight.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          When and where to find your W-2
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Electronic W-2 forms typically post by late January. If you consented to
          electronic delivery, you can download your W-2 as soon as it appears — no
          waiting for the mail. Paper copies are mailed by the January 31 federal
          deadline to the address Target has on file. If you moved, update your
          address before January to avoid delays.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Consenting to electronic delivery
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Electronic delivery is faster, more secure and available earlier. Log in
          to the portal, navigate to the tax forms or W-2 section, and toggle the
          electronic delivery preference. This is usually a one-time setting. Once
          you opt in, every future W-2 will be available digitally first. You can
          still print or save it as a PDF.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Former employee W-2 retrieval
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If you left Target, your W-2 for the year you worked is still available
          through the portal. Former team members verify their identity through
          Alight rather than the active-employee login route. If you cannot access
          the portal at all, call the Benefits Center at 800-828-5850 and request
          a paper copy. They will mail it to your last known address.
        </p>

        <Callout tone="info" title="Correcting a W-2">
          <p>
            If the numbers on your W-2 do not match your pay records, do not file
            with the incorrect form. Contact the Benefits Center — Target will
            issue a corrected W-2c if the error is confirmed.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Other tax-related documents
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Besides the W-2, the portal may surface 1095-C forms for health coverage
          reporting. These are needed if you enrolled in a Target health plan.
          Year-to-date pay details and deductions live in Workday at{" "}
          <a
            href="https://wd5.myworkday.com/target"
            target="_blank"
            rel="noopener"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            wd5.myworkday.com/target
          </a>
          , not in the benefits portal.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/payslip", label: "View your payslip in Workday" },
            { href: "/401k", label: "Target 401(k) / TGT401k" },
            { href: "/former-employees", label: "Former employee access" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
