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
  title: "Reset TargetPayandBenefits User ID or Password",
  description:
    "Forgot your targetpayandbenefits User ID or password? Two recovery paths — SSN plus birthdate or three security questions. When to call the Benefits Center instead.",
  path: "/forgot-password",
  ogAlt: "TargetPayandBenefits password reset screen",
  noindex: true,
});

const FAQ = [
  {
    q: "How do I reset my password?",
    a: "Click Forgot User ID or Password on the login screen. Verify with your SSN last four and birthdate, or answer your three security questions. Then create a new password that meets the portal's complexity rules.",
  },
  {
    q: "What if I lost my User ID too?",
    a: "The same recovery flow handles both. After identity verification, you can retrieve your User ID and reset your password in a single session. You do not need to call anyone unless verification itself fails.",
  },
  {
    q: "How many security questions do I answer?",
    a: "All three. These are the questions you chose when you registered. If you cannot remember the answers, use the SSN-and-birthdate path instead, or call the Benefits Center at 800-828-5850.",
  },
  {
    q: "When should I call instead?",
    a: "Call the Benefits Center at 800-828-5850 if both recovery paths fail, if your account appears locked after too many attempts, or if you never registered in the first place and cannot complete the new-user flow.",
  },
];

export default function ForgotPasswordPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Forgot Password", href: "/forgot-password" },
          ]),
          howToSchema("Reset your TargetPayandBenefits password", [
            { name: "Open the portal", text: "Go to targetpayandbenefits.com and select Log On." },
            { name: "Click the recovery link", text: "Select Forgot User ID or Password on the login screen." },
            { name: "Choose a verification method", text: "Enter your SSN last four and birthdate, or answer your three security questions." },
            { name: "Create a new password", text: "Set a new password that meets the portal's requirements." },
            { name: "Log in", text: "Return to the login screen and sign in with your new credentials." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Forgot Password", href: "/forgot-password" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          Reset Your TargetPayandBenefits User ID or Password
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          Losing your targetpayandbenefits password is common — the portal is not
          something most team members use every day, so credentials slip out of
          memory. The recovery flow handles both a forgotten User ID and a forgotten
          password in the same session, and there are two ways to verify your
          identity.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Forgot User ID or Password — the link
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          On the targetpayandbenefits.com login screen, below the password field, you
          will see a link labeled <strong>Forgot User ID or Password?</strong>. Click
          it to start the recovery process. The portal will ask you to prove your
          identity before it lets you create new credentials.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Path 1: SSN last four and birthdate
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Enter the last four digits of your Social Security Number and your date of
          birth. These match against the records Target has on file. If they match,
          you can retrieve your User ID and set a new password immediately.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Path 2: targetpayandbenefits security questions
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If you prefer not to enter your SSN, or if the SSN path is unavailable, you
          can answer the three security questions you set during registration. All
          three answers must match exactly — the system is case-sensitive. If you
          cannot remember them, fall back to Path 1.
        </p>

        <StepList
          steps={[
            "Go to targetpayandbenefits.com and select Log On.",
            "Click Forgot User ID or Password on the login screen.",
            "Choose your verification method: SSN + birthdate or security questions.",
            "Complete the verification step.",
            "Retrieve your User ID if needed, then create a new password.",
          ]}
        />

        <h3 className="mt-8 text-lg font-semibold text-neutral-900">
          TargetPayandBenefits account locked
        </h3>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If you entered the wrong password too many times, the account may lock
          temporarily. Wait at least 30 minutes before trying again, or call the
          Benefits Center at 800-828-5850 to have the lock removed manually. Do not
          keep retrying — each failed attempt extends the lockout.
        </p>

        <Callout tone="info" title="Still stuck?">
          <p>
            If both recovery paths fail and you cannot get in, call the Benefits
            Center at 800-828-5850 during business hours. Have your Team Member
            Number ready.
          </p>
        </Callout>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/login-options", label: "The two login routes" },
            { href: "/register", label: "New user registration" },
            { href: "/contact", label: "Benefits Center phone numbers" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
