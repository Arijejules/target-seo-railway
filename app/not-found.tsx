import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          Page not found
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          The page you requested does not exist. Try one of the pages below.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Portal</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/" className="text-[#cc0000] underline">Log in to Target Pay and Benefits</Link></li>
              <li><Link href="/login-options" className="text-[#cc0000] underline">The two login routes</Link></li>
              <li><Link href="/register" className="text-[#cc0000] underline">New user registration</Link></li>
              <li><Link href="/forgot-password" className="text-[#cc0000] underline">Forgot User ID or Password</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Pay</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/payslip" className="text-[#cc0000] underline">View your payslip in Workday</Link></li>
              <li><Link href="/w2" className="text-[#cc0000] underline">W-2 and tax forms</Link></li>
              <li><Link href="/401k" className="text-[#cc0000] underline">Target 401(k) / TGT401k</Link></li>
              <li><Link href="/former-employees" className="text-[#cc0000] underline">Former employee access</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Benefits</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/benefits/health" className="text-[#cc0000] underline">Health, dental and vision</Link></li>
              <li><Link href="/benefits/mental-health" className="text-[#cc0000] underline">Mental health</Link></li>
              <li><Link href="/benefits/time-off" className="text-[#cc0000] underline">Time off and family leave</Link></li>
              <li><Link href="/benefits/education" className="text-[#cc0000] underline">Education assistance</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Support</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link href="/troubleshooting" className="text-[#cc0000] underline">Troubleshooting</Link></li>
              <li><Link href="/contact" className="text-[#cc0000] underline">Contact numbers</Link></li>
              <li><Link href="/legit-or-scam" className="text-[#cc0000] underline">Legit or scam</Link></li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
