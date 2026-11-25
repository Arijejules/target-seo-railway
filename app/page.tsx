import type { Metadata } from "next";
import { buildMetadata } from "@/lib/meta";
import { webSiteSchema, orgSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = buildMetadata({
  title: "Target Pay and Benefits Login | TargetPayandBenefits.com",
  description:
    "Log on at targetpayandbenefits.com to view pay, benefits and tax forms. Two login routes, new-user registration and password reset, all in one place.",
  path: "/",
  ogAlt: "Target Pay and Benefits login screen at targetpayandbenefits.com",
});

const FAQ = [
  {
    q: "How do I log in to targetpayandbenefits.com?",
    a: "Go to targetpayandbenefits.com, select Log On, and choose the route that matches where you are — on the Target network or off it. Enter your User ID and password. If you have not registered yet, use the New User link instead.",
  },
  {
    q: "What if I forgot my User ID or password?",
    a: "Use the Forgot User ID or Password link on the login screen. You will verify with the last four digits of your Social Security Number and your birthdate, or by answering the three security questions you set at registration. You can then create a new password.",
  },
  {
    q: "Can former Target team members still log in?",
    a: "Former team members keep access to 401(k) records, plan documents and old W-2s. That access runs through Alight identity verification rather than the active-employee route, so the flow looks different. Read the former employee guide before you start.",
  },
  {
    q: "Where do I find my Target payslip?",
    a: "Payslips are not in the benefits portal. They live in Workday at wd5.myworkday.com/target, along with your pay history and tax forms. The portal handles benefits and retirement; Workday handles pay documents.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        graph={[
          webSiteSchema(),
          orgSchema(),
          breadcrumbSchema([{ name: "Home", href: "/" }]),
          faqSchema(FAQ),
        ]}
      />
      <LoginForm />
    </>
  );
}
