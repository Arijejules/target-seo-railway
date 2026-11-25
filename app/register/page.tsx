import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { PORTAL_URL } from "@/lib/site";
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
  title: "TargetPayandBenefits New User Registration (Step by Step)",
  description:
    "Register as a new user on targetpayandbenefits.com. You need the last four of your SSN and your birthdate. Full walkthrough with failure cases.",
  path: "/register",
  ogAlt: "TargetPayandBenefits new user registration screen",
  noindex: true,
});

const FAQ = [
  {
    q: "What do I need to register?",
    a: "You need the last four digits of your Social Security Number and your date of birth. You will also choose your own User ID and password and set three security questions during the process.",
  },
  {
    q: "How many security questions are there?",
    a: "Three. You choose both the questions and the answers. These are your fallback if you ever lose your User ID or password, so pick answers you will remember months from now.",
  },
  {
    q: "What if my SSN and birthdate don't verify?",
    a: "If verification fails, your identity record may not match what Target has on file. Contact the Benefits Center at 800-828-5850 to update your records before trying again.",
  },
  {
    q: "Can I register on a phone?",
    a: "Yes. The registration flow works in any current mobile browser. Use the off-network login route, tap New User, and follow the same steps you would on a desktop.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Register", href: "/register" },
          ]),
          howToSchema("Register as a new TargetPayandBenefits user", [
            { name: "Open the portal", text: "Go to targetpayandbenefits.com and select Log On." },
            { name: "Select New User", text: "Click the New User? link on the login screen." },
            { name: "Verify identity", text: "Enter the last four digits of your SSN and your birthdate, then select Continue." },
            { name: "Create credentials", text: "Choose a User ID and password that meet the portal's requirements." },
            { name: "Set security questions", text: "Pick three security questions and type answers you will remember." },
            { name: "Finish", text: "Submit the form. You can now log in with the credentials you created." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Register", href: "/register" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          How to Register as a New TargetPayandBenefits User
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          If this is your first time visiting targetpayandbenefits.com, do not guess
          at a User ID and password — you need to register first. Registration is
          a one-time process that links your identity to the portal and gives you
          credentials for every future visit. The whole thing takes about five
          minutes on a device you trust.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          What you need before you start
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Have two pieces of information ready: the last four digits of your Social
          Security Number and your date of birth. These match against what Target has
          on file. If either is wrong — for instance, if your legal name or SSN
          changed and HR was not updated — the verification step will fail. Fix
          your records with the Benefits Center before trying again. You should also
          target benefits login from a device you trust, because you will be setting
          a password.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          New user registration steps
        </h2>
        <StepList
          steps={[
            "Open targetpayandbenefits.com and select Log On.",
            "On the login screen, click New User? instead of entering credentials.",
            "Enter the last four digits of your SSN and your birthdate, then select Continue.",
            "Choose a User ID — something you will remember but that is not your email.",
            "Create a password that meets the portal's length and complexity rules.",
            "Pick three security questions and type answers you will remember months later.",
            "Submit. You are now registered and can log in immediately.",
          ]}
        />

        <h3 className="mt-8 text-lg font-semibold text-neutral-900">
          Security questions and why they matter
        </h3>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The three security questions you choose at registration are your safety
          net. If you ever forget your User ID or password, the recovery flow will
          ask you to answer these exact questions. Pick answers that are specific
          enough that you will not confuse them later — &ldquo;What city were you
          born in?&rdquo; is better than &ldquo;What is your favorite color?&rdquo;
          because the answer is less likely to change. Write them down somewhere
          safe.
        </p>

        <Callout tone="warn" title="Verification failed?">
          <p>
            If the portal says your SSN or birthdate does not match, your records
            at Target may need updating. Call the Benefits Center at 800-828-5850
            to reconcile. Do not keep retrying — repeated failures do not unlock
            the account.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          After registration
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Once registration completes, the targetpayandbenefits sign in flow uses
          the User ID and password you just created. Choose the off-network login
          option if you are at home, or the on-network option if you are on a Target
          workstation. Either way, the credentials are the same set you built during
          registration.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/login-options", label: "The two login routes" },
            { href: "/forgot-password", label: "Forgot User ID or Password" },
            { href: "/troubleshooting", label: "Portal not working" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
