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
  title: "Target 401(k) Login (TGT401k) and Match Explained",
  description:
    "Log in to your Target 401(k) through targetpayandbenefits.com. Dollar-for-dollar match up to 5 percent, 100% immediate vesting, contribution changes and fund options.",
  path: "/401k",
  ogAlt: "Target 401(k) TGT401k login and plan details",
  noindex: true,
});

const FAQ = [
  {
    q: "How do I log in to my TGT401k?",
    a: "Go to targetpayandbenefits.com, select Log On, choose the login route that matches your location, and sign in. Your 401(k) balance and plan details are inside the portal under the retirement or financial well-being section.",
  },
  {
    q: "What is the Target 401(k) match?",
    a: "Target matches your contributions dollar for dollar up to 5% of your eligible pay. If you contribute 5%, Target adds another 5%. The match is one of the most generous in retail and costs you nothing beyond your own contribution.",
  },
  {
    q: "When am I vested?",
    a: "Immediately. Target offers 100% immediate vesting on the company match. That means every dollar Target contributes is yours from day one — there is no waiting period and nothing to forfeit if you leave.",
  },
  {
    q: "Can I change my contribution rate anytime?",
    a: "Yes. Log in to the portal and navigate to the retirement section. You can increase, decrease or pause your contribution at any time. Changes typically take effect within one to two pay periods.",
  },
];

export default function Page401k() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "401(k)", href: "/401k" },
          ]),
          howToSchema("Log in to your Target 401(k)", [
            { name: "Open the portal", text: "Go to targetpayandbenefits.com." },
            { name: "Select Log On", text: "Click Log On at the top of the page." },
            { name: "Choose your route", text: "Pick the login option that matches your location." },
            { name: "Sign in", text: "Enter your User ID and password." },
            { name: "Navigate to retirement", text: "Select the retirement or financial well-being section to view your 401(k)." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "401(k)", href: "/401k" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target 401(k) / TGT401k Login and Plan Details
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          The <strong>target 401k login</strong> and <strong>tgt401k login</strong>{" "}
          both point to the same place — the retirement section inside
          targetpayandbenefits.com. The plan is officially called the Target
          Corporation 401(k) Plan, often shortened to <strong>TGT 401k</strong> or
          TGT401k by team members. It is administered by Alight Solutions and is one
          of the strongest retail retirement benefits available.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          TGT 401k login steps
        </h2>
        <StepList
          steps={[
            "Go to targetpayandbenefits.com in any current browser.",
            "Select Log On and choose the route matching your location.",
            "Enter your User ID and password.",
            "Navigate to the retirement or financial well-being section.",
            "View your target 401(k) balance, contributions and investment elections.",
          ]}
        />
        <p className="mt-4 leading-relaxed text-neutral-700">
          Some team members search for <strong>tgt401k.com</strong> directly — that
          legacy domain used to resolve to the same system. Today, the canonical
          address is targetpayandbenefits.com. If you have a bookmark pointing to
          tgt401k.com, update it.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target 401k match — dollar for dollar up to 5%
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Target matches dollar for dollar up to 5 percent of your eligible pay. That
          means for every dollar you put in, Target adds a dollar, up to the 5%
          ceiling. The target 401k match 5 percent provision is one of the highest in
          the retail sector. Combined with 100% immediate vesting, the target TGT 401k
          plan hands you free money from your first paycheck.
        </p>

        <Callout tone="info" title="100% immediate vesting">
          <p>
            Every dollar Target contributes is yours immediately. There is no
            vesting schedule and nothing to forfeit if you leave. This applies to
            the full company match from day one.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Contributions and fund selection
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          You can change your contribution rate at any time through the portal.
          Increase it, decrease it or pause it — changes typically take effect within
          one to two pay periods. The plan offers a range of investment options,
          including target-date funds, index funds and actively managed funds. If you
          do not choose, the plan assigns a default target-date fund based on your
          expected retirement year.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Loans and hardship withdrawals
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The Target 401(k) plan allows loans against your own balance under certain
          conditions. You repay the loan through payroll deductions. Hardship
          withdrawals are also available for qualifying expenses, though they carry
          tax consequences. Review the plan document inside the portal or call Alight
          Solutions for details.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/former-employees", label: "401(k) access after leaving" },
            { href: "/payslip", label: "View your payslip in Workday" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
