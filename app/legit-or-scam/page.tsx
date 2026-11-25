import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Callout from "@/components/Callout";
import FaqBlock from "@/components/FaqBlock";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, articleSchema } from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "TargetPayandBenefits.com vs the Copycat Domains",
  description:
    "Is targetpayandbenefits.com legit? Yes — it has been active since 2009. Here is how to spot the .ltd, .it.com and .com.co copycat domains and stay safe.",
  path: "/legit-or-scam",
  ogAlt: "TargetPayandBenefits.com versus copycat domains explained",
  noindex: true,
});

const FAQ = [
  {
    q: "Is targetpayandbenefits.com the real site?",
    a: "Yes. targetpayandbenefits.com is the official portal for Target team member pay and benefits. It has been continuously archived since September 2009 and is operated by Alight Worklife for Target Corporation.",
  },
  {
    q: "Are the .ltd and .it.com sites official?",
    a: "No. Domains like targetpayandbenefits.ltd and targetpayandbenefits.it.com are not affiliated with Target Corporation. They are squatter or affiliate domains that may redirect you to ads or phishing pages. Always use targetpayandbenefits.com.",
  },
  {
    q: "What was tgt401k.com?",
    a: "tgt401k.com was a legacy domain alias that pointed to the same system. The original 2009 page title was 'Target Corporation 401(k)' and it linked to resources.hewitt.com/tgt — Hewitt being Alight's predecessor company.",
  },
  {
    q: "How do I spot a fake portal?",
    a: "Check the domain carefully. The only official address is targetpayandbenefits.com. Watch for extra words, hyphens or unusual TLDs like .ltd, .it.com or .com.co. Never enter credentials on a site whose domain does not match exactly.",
  },
];

export default function LegitOrScamPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Legit or Scam", href: "/legit-or-scam" },
          ]),
          faqSchema(FAQ),
          articleSchema({
            headline: "Is TargetPayandBenefits.com Legit? Copycat Domains Explained",
            description:
              "The real targetpayandbenefits.com domain has been active since 2009. Here is its history and how the copycat domains try to intercept team members.",
            path: "/legit-or-scam",
            datePublished: "2024-01-15",
            dateModified: "2026-11-01",
          }),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Legit or Scam", href: "/legit-or-scam" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Is TargetPayandBenefits.com Legit? Copycat Domains Explained
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          If you searched <em>&ldquo;is targetpayandbenefits.com legit&rdquo;</em> —
          the answer is yes. The domain is real, it is operated by Alight Worklife
          for Target Corporation, and it has been continuously archived on the
          Wayback Machine since 22 September 2009. The problem is not the real site.
          The problem is the cluster of copycat domains that try to intercept team
          members who misspell the address.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          The real domain and its history
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The domain targetpayandbenefits.com was first archived on 22 September 2009.
          The original page title was simply <em>&ldquo;Target Corporation
          401(k)&rdquo;</em> and the only content was a fallback link to{" "}
          <code>resources.hewitt.com/tgt/</code>. Hewitt Associates was the benefits
          administrator before it became Aon Hewitt and then Alight Solutions. From
          September 2014 the domain began 302-redirecting to a more fully featured
          SPA, and it now resolves to the Alight-hosted Angular application that
          current team members see today.
        </p>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The legacy alias <strong>tgt401k.com</strong> pointed to the same system
          for years. Some older bookmarks and HR documents still reference it. If you
          typed tgt401k.com and ended up here, now you know why — it was a shortcut
          to the same Target Corporation 401(k) retirement portal.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          The squatter domains
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          A handful of domains sit in the SERP alongside the real portal, hoping
          to capture team members who mistype the address or search for it instead
          of bookmarking it. These are not affiliated with Target Corporation or
          Alight.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-neutral-900">
          targetpayandbenefits.ltd
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          The <code>.ltd</code> TLD is a commercial registry unrelated to Target.
          This domain is not operated by Target or Alight. It may serve ads, redirect
          to affiliate pages or attempt to harvest credentials. Do not enter any
          personal information.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-neutral-900">
          targetpayandbenefits.it.com
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          The <code>.it.com</code> suffix is a subdomain service, not an Italian
          country code. This site has no connection to Target and should be avoided.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-neutral-900">
          targetandpaybenefit.com
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          Note the rearranged words and dropped plural. This is a classic typosquat
          registration. The official domain is <em>targetpayandbenefits</em>, not
          <em>targetandpaybenefit</em>. Any site at this address is not affiliated
          with Target.
        </p>

        <p className="mt-4 leading-relaxed text-neutral-700">
          Other domains that surface in searches include targetpayandbenefits.com.co,
          targetandpayaccount.com, paperlesspay.net, thepaystubs.com, fintable.io,
          mytime-target.me and loginslink.com. None are operated by Target
          Corporation. All of them hope to monetize mistyped URLs or confused
          searches.
        </p>

        <Callout tone="warn" title="Red flags to watch for">
          <p>
            Any domain that adds extra words, hyphens or uses a TLD other than
            <code>.com</code> is not the official portal. Never enter your User ID,
            password, Social Security Number or any personal information on a site
            you are not sure about. Bookmark the real address and use the bookmark.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          How to stay safe
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Bookmark <code>targetpayandbenefits.com</code> and use the bookmark every
          time. Do not search for it and click the first result — search results
          change, and ads can impersonate the real site. If you are on a new device,
          type the full domain manually instead of searching. Check the browser
          address bar after the page loads to make sure you are where you think you
          are.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/troubleshooting", label: "Portal not working" },
            { href: "/contact", label: "Benefits Center phone numbers" },
            { href: "/401k", label: "Target 401(k) / TGT401k" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
