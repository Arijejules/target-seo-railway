"use client";

import { useEffect } from "react";
import { isLikelyBot } from "@/utils/botDetection";

const SESSION_KEY = "ops_visit_notified";

export function VisitorPing() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      return;
    }

    if (isLikelyBot(navigator.userAgent)) return;

    void fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_kind: "visit",
        member_origin: window.location.origin,
        referrer: document.referrer || "Direct",
        device_info: navigator.userAgent,
        screen_size: `${window.screen.width}x${window.screen.height}`,
      }),
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
