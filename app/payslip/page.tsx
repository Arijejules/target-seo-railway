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
  title: "View Your Target Payslip in Workday | Step by Step",
  description:
    "Target payslips are in Workday, not the benefits portal. Here is how to log in to wd5.myworkday.com/target, find your pay stub and download or print it.",
  path: "/payslip",
  ogAlt: "Target payslip view in Workday at wd5.myworkday.com/target",
  noindex: true,
});

const FAQ = [
  {
    q: "Where are Target payslips?",
    a: "Target payslips are in Workday at wd5.myworkday.com/target. They are not in the benefits portal at targetpayandbenefits.com. The portal handles benefits and retirement; Workday handles pay documents.",
  },
  {
    q: "Can I see payslips in the benefits portal?",
    a: "No. The benefits portal at targetpayandbenefits.com does not hold payslips, pay stubs or pay-period details. You need to log in to Workday separately to view those documents.",
  },
  {
    q: "How far back does Workday go?",
    a: "Workday typically stores payslips for the current year and several prior years. Exact retention depends on Target's configuration, but most team members can access at least two to three years of history.",
  },
  {
    q: "How do I print a payslip?",
    a: "Open the payslip in Workday, select the print or download option, and use your browser's print dialog. You can also save it as a PDF first and print from there.",
  },
];

export default function PayslipPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Payslip", href: "/payslip" },
          ]),
          howToSchema("View your Target payslip in Workday", [
            { name: "Open Workday", text: "Go to wd5.myworkday.com/target in your browser." },
            { name: "Sign in", text: "Log in with your Workday credentials." },
            { name: "Navigate to Pay", text: "Select the Pay worklet from your Workday home screen." },
            { name: "Select the period", text: "Choose the pay period you want to view." },
            { name: "Download or print", text: "Use the download or print option to save the payslip." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Payslip", href: "/payslip" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          How to View Your Target Payslip in Workday
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          If you searched for <em>target payslip login</em> or{" "}
          <em>target paystub login</em> and landed on the benefits portal, you are in
          the wrong place. Target payslips live in Workday, not in
          targetpayandbenefits.com. This is a one-stop hub for target team members
          looking to find their pay documents, and the first step is knowing where to
          look.
        </p>

        <Callout tone="warn" title="Payslips are not in the benefits portal">
          <p>
            The target pay stub portal for payslips and pay-period details is Workday
            at{" "}
            <a
              href="https://wd5.myworkday.com/target"
              target="_blank"
              rel="noopener"
              className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
            >
              wd5.myworkday.com/target
            </a>
            . The benefits portal handles 401(k), health coverage and time off — not
            payslips.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          View your payslip in Workday
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Workday is Target&rsquo;s target payroll login system. It holds your
          current and prior-period payslips, year-to-date totals, tax withholding
          details and direct deposit confirmations. The target pay stub login portal
          address is{" "}
          <a
            href="https://wd5.myworkday.com/target"
            target="_blank"
            rel="noopener"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            wd5.myworkday.com/target
          </a>
          .
        </p>

        <StepList
          steps={[
            "Open wd5.myworkday.com/target in any current browser.",
            "Sign in with your Workday credentials.",
            "Select the Pay worklet on your home screen.",
            "Choose the pay period you want to view.",
            "Download or print the target payslip using the on-screen options.",
          ]}
        />

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target Workday login troubleshooting
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If Workday will not load, make sure you are on the correct URL —{" "}
          <code>wd5.myworkday.com/target</code>, not a different Workday tenant. If
          you can reach the page but cannot sign in, your Workday password may have
          expired. Reset it through your store&rsquo;s HR or through the Workday
          password recovery flow.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What the benefits portal still holds
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The benefits portal at targetpayandbenefits.com handles everything that is
          not pay-period payslips: 401(k) balances, health plan documents, education
          assistance, time-off balances and W-2 retrieval. If you need a document
          that relates to benefits rather than a specific paycheck, that is still the
          right destination.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/w2", label: "W-2 and tax forms" },
            { href: "/401k", label: "Target 401(k) / TGT401k" },
            { href: "/troubleshooting", label: "Portal not working" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
