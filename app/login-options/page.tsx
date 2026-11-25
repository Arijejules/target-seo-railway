import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { PORTAL_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import StepList from "@/components/StepList";
import FaqBlock from "@/components/FaqBlock";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  howToSchema,
  faqSchema,
} from "@/lib/schema";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "TargetPayandBenefits Log On: 2 Login Options Explained",
  description:
    "There are two ways to log in to Target Pay and Benefits: the Target network route and the off-network route. Here is which one you need and why.",
  path: "/login-options",
  ogAlt: "TargetPayandBenefits.com log on options explained",
  noindex: true,
});

const FAQ = [
  {
    q: "Which login option should I choose?",
    a: "If you are on a store, distribution center or corporate workstation connected to the Target network, choose the first option. If you are at home, on your phone or on any personal device not connected to the Target network, choose the second option.",
  },
  {
    q: "Can I log in from home?",
    a: "Yes. Use the second option — team members not on the Target network. You will need the User ID and password you created during registration. Any current browser on any device works from home.",
  },
  {
    q: "What happens if I pick the wrong option?",
    a: "You will see a login screen that does not match your credentials. Switch to the other option and try again. No lockout occurs just from picking the wrong route — only repeated incorrect passwords trigger a lockout.",
  },
  {
    q: "Why are there two options at all?",
    a: "The Target network option uses your network credentials for single sign-on, so you do not need a separate password. The off-network option uses the User ID and password you created at registration, adding a layer of identity verification when you are outside the firewall.",
  },
];

export default function LoginOptionsPage() {
  return (
    <>
      <JsonLd
        graph={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Login Options", href: "/login-options" },
          ]),
          howToSchema("Log on to TargetPayandBenefits", [
            { name: "Open the portal", text: "Go to targetpayandbenefits.com in any current browser." },
            { name: "Select Log On", text: "Click Log On at the top of the page." },
            { name: "Answer the question", text: "The screen asks 'How would you like to log in?' — pick the route that matches your location." },
            { name: "Enter credentials", text: "Type your User ID and password on the matching screen." },
            { name: "Reach your dashboard", text: "Click Log On again to reach your personalized dashboard." },
          ]),
          faqSchema(FAQ),
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Login Options", href: "/login-options" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
          The Two TargetPayandBenefits Log On Options
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-neutral-700">
          The <strong>targetpayandbenefits.com log on</strong> screen does something
          most portals skip — it asks you a question before it asks for a password.
          The prompt reads <strong>&ldquo;How would you like to log in?&rdquo;</strong>{" "}
          and gives you exactly two routes. Understanding which route to pick is the
          fastest way to avoid login trouble on the Target Pay and Benefits portal.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Target network login
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The first option — &ldquo;Team members on the Target network&rdquo; — is
          for anyone sitting at a Target network computer. That includes store
          workstations, distribution center terminals and corporate laptops plugged
          into the building&rsquo;s wired or wireless connection. Because the device
          is already authenticated against Target&rsquo;s internal network, the portal
          uses single sign-on. You do not type a User ID or password at all; the
          session inherits your network credentials.
        </p>
        <p className="mt-3 leading-relaxed text-neutral-700">
          If you are a target employee login from a store device, this is your route.
          It is also the route for any target team member login from a corporate
          desktop. The key factor is not your job title — it is whether the device is
          on the network.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Not on the Target network
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The second option — &ldquo;Team members not on the Target network&rdquo; —
          is for everyone else. That means your personal phone on cellular data, your
          home laptop on Wi-Fi, a library computer or any device that is not connected
          to Target&rsquo;s internal network. You will enter the User ID and password
          you created when you registered.
        </p>
        <p className="mt-3 leading-relaxed text-neutral-700">
          This is the route for a target alight login from home. The underlying
          platform is Alight Worklife, so some team members search for{" "}
          <em>alight worklife target login</em> or <em>worklife.alight.com target</em> —
          both lead here. The portal at targetpayandbenefits.com is the front door
          to the same Alight system, just branded for Target.
        </p>

        <h2 className="mt-8 text-xl font-bold text-neutral-900">
          What if you pick the wrong route?
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Nothing breaks permanently. If you choose the network option from home,
          the page will hang or return an error because there is no network session
          to inherit. If you choose the off-network option from a store device, it
          will ask for a User ID and password you may not remember because you
          normally sign in through the network. In either case, go back to the
          choice screen and switch options.
        </p>

        <h2 className="mt-8 text-xl font-bold text-neutral-900">
          When to fall back to Workday
        </h2>
        <p className="mt-3 leading-relaxed text-neutral-700">
          The benefits portal does not hold payslips. If you came here looking for
          your pay stub, head to Workday at{" "}
          <a
            href="https://wd5.myworkday.com/target"
            target="_blank"
            rel="noopener"
            className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
          >
            wd5.myworkday.com/target
          </a>{" "}
          instead. The portal handles benefits, retirement and time off; Workday
          handles pay documents.
        </p>

        <StepList
          steps={[
            "Open targetpayandbenefits.com in any current browser.",
            "Select Log On at the top of the page.",
            "Read the question — are you on the Target network right now?",
            "Pick the matching option.",
            "Enter credentials if prompted, then select Log On.",
          ]}
        />

        <h2 className="mt-10 text-2xl font-bold text-neutral-900">
          Frequently asked questions
        </h2>
        <FaqBlock items={FAQ} />

        <RelatedLinks
          links={[
            { href: "/", label: "Target Pay and Benefits Login" },
            { href: "/register", label: "New user registration" },
            { href: "/forgot-password", label: "Forgot User ID or Password" },
            { href: "/troubleshooting", label: "Portal not working" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
