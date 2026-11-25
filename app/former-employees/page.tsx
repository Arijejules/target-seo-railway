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
  title: "Target 401(k) After Leaving: Former Employee Access",
  description:
    "Former Target team members can still access 401(k) records, plan documents and old W-2s. Identity verification through Alight, rollover and distribution basics.",
  path: "/former-employees",
  ogAlt: "Target 401(k) access for former employees through Alight",
  noindex: true,
});

const FAQ = [
  {
    q: "Can I still access my 401(k) after leaving?",
    a: "Yes. Your target 401k login former employee path goes through Alight identity verification. Your balance, investment elections and plan documents remain accessible as long as money stays in the plan.",
  },
  {
    q: "How does Alight verify me?",
    a: "Alight uses your Social Security Number and date of birth to confirm your identity. If the information on file does not match, you will need to call the Benefits Center at 800-828-5850 to update your records.",
  },
  {
    q: "What stays open and what closes?",
    a: "Your 401(k) balance, plan documents and prior W-2s remain accessible. Active-employee features like benefits enrollment, time-off requests and MyTime scheduling close when you leave.",
  },
  {
    q: "How long does the packet take?",
    a: "If you request a rollover or distribution, the processing packet typically arrives within two to four weeks after the request is submitted. Direct rollovers to another plan or IRA are usually faster than check distributions.",
  },
];

export default function FormerEmployeesPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Former Employees", href: "/former-employees" },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Former Employees", href: "/former-employees" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Target 401(k) Access After Leaving the Company
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          If you searched for <em>target 401k login former employee</em>, you are not
          locked out. Former team members keep access to their 401(k) balance, plan
          documents and historical W-2s through the same portal at
          targetpayandbenefits.com. The difference is how you verify your identity —
          the flow runs through Alight rather than the active-employee login route.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target 401k access after termination
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          When you leave Target — whether you quit, retire or are separated — your
          401(k) balance stays in the plan until you decide what to do with it. The
          money is yours, including the full company match, because Target offers 100%
          immediate vesting. Nothing is forfeited. You can leave the balance where it
          is, roll it over to another employer&rsquo;s plan, move it to an IRA or take
          a distribution.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          How the former employee login works
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Go to targetpayandbenefits.com and select Log On. Choose the off-network
          option. If your credentials still work, you are in. If they have expired
          or you never registered, the portal will walk you through Alight identity
          verification using your SSN and date of birth. Former employee access does
          not require a current Team Member Number.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What stays open
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Your 401(k) balance and investment elections, historical plan documents and
          prior-year W-2 forms remain accessible. You can review transactions, change
          investment allocations on your existing balance and request rollovers or
          distributions from inside the portal.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What closes
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Active-employee features shut down when you leave. That includes benefits
          enrollment, health plan access, time-off balances, MyTime scheduling and
          the Team Target discount. COBRA may extend certain health coverage — look
          for the COBRA notification in the mail within 14 days of your separation.
        </p>

        <Callout tone="info" title="Rollover and distribution basics">
          <p>
            A rollover moves your 401(k) balance to another qualified account without
            triggering taxes. A distribution pays you directly but may incur income
            tax and a 10% early-withdrawal penalty if you are under 59½. Talk to a
            tax professional before choosing.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/401k", label: "Target 401(k) / TGT401k" },
            { href: "/w2", label: "W-2 and tax forms" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
