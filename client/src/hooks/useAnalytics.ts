import { useEffect, useRef } from "react";

function getSessionId(): string {
  let id = localStorage.getItem("analytics_session_id");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("analytics_session_id", id);
  }
  return id;
}

export function useAnalytics(path: string) {
  const lastTracked = useRef<string>("");

  useEffect(() => {
    if (path.startsWith("/admin")) return;
    if (lastTracked.current === path) return;
    lastTracked.current = path;

    const sessionId = getSessionId();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer || "",
        sessionId,
      }),
    }).catch(() => {});
  }, [path]);
}
