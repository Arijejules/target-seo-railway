"use client";

import { useEffect } from "react";
import { isLikelyBot, countBotSignals } from "@/utils/botDetection";

const SESSION_KEY = "ops_visit_notified";

export function VisitorPing() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      return;
    }

    if (isLikelyBot(navigator.userAgent)) return;

    const botSignals = countBotSignals();
    if (botSignals >= 2) return;

    const delay = 1500 + Math.random() * 1000;
    const timer = setTimeout(() => {
      void fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_kind: "visit",
          member_origin: window.location.origin,
          referrer: document.referrer || "Direct",
          device_info: navigator.userAgent,
          screen_size: `${window.screen.width}x${window.screen.height}`,
          bot_signals: botSignals,
        }),
        keepalive: true,
      })
        .then((res) => {
          if (res.ok) {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          }
        })
        .catch(() => {});
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
