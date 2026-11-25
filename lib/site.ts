const _raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://target-benefits.up.railway.app";
export const SITE_URL = (
  /^https?:\/\//i.test(_raw) ? _raw : `https://${_raw}`
).replace(/\/+$/, "");

export const SITE_NAME = "Target Pay and Benefits Guide";

export const PORTAL_URL = "https://targetpayandbenefits.com";

export const DISCLAIMER =
  "Independent guide. Not affiliated with, endorsed by, or operated by Target Corporation or Alight Solutions. Target, TargetPayandBenefits, Alight and Worklife are trademarks of their respective owners. Always confirm details on the official portal.";

export const LAST_UPDATED = "November 2026";

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Log In", href: "/" },
  { label: "Payslip", href: "/payslip" },
  { label: "401(k)", href: "/401k" },
  { label: "Benefits", href: "/benefits/health" },
  { label: "Troubleshooting", href: "/troubleshooting" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Portal",
    links: [
      { label: "Log on", href: "/" },
      { label: "New user", href: "/register" },
      { label: "Forgot password", href: "/forgot-password" },
    ],
  },
  {
    heading: "Pay",
    links: [
      { label: "Payslip", href: "/payslip" },
      { label: "W-2", href: "/w2" },
      { label: "401(k)", href: "/401k" },
      { label: "Former employees", href: "/former-employees" },
    ],
  },
  {
    heading: "Benefits",
    links: [
      { label: "Health", href: "/benefits/health" },
      { label: "Mental health", href: "/benefits/mental-health" },
      { label: "Time off", href: "/benefits/time-off" },
      { label: "Education", href: "/benefits/education" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Troubleshooting", href: "/troubleshooting" },
      { label: "Contact", href: "/contact" },
      { label: "Legit or scam", href: "/legit-or-scam" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
