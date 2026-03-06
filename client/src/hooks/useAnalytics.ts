import { useEffect, useRef } from "react";

function getSessionId(): string {
  let id = localStorage.getItem("analytics_session_id");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("analytics_session_id", id);
  }
  return id;
}

function getUtmParams(): { utmSource: string; utmMedium: string; utmCampaign: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
    };
  } catch {
    return { utmSource: "", utmMedium: "", utmCampaign: "" };
  }
}

export function useAnalytics(path: string) {
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (path.startsWith("/admin")) return;
    if (lastTracked.current === path) return;
    lastTracked.current = path;

    const sessionId = getSessionId();
    const utm = getUtmParams();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || "",
        sessionId,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: document.documentElement.lang || navigator.language || "",
        ...utm,
      }),
    }).catch(() => {});
  }, [path]);
}
