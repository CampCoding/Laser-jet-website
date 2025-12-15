"use client";

import { useEffect, useRef, useState } from "react";

export default function useNetworkStatus({
  pingUrl = "https://laser-jet-website.vercel.app/favicon.ico",
  intervalMs = 5000,
} = {}) {
  const [isOnline, setIsOnline] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const setFromNavigator = () => {
      if (typeof navigator === "undefined") return;
      setIsOnline(navigator.onLine);
      console.log("navigator offline");

    };

    const ping = async () => {
      // لو navigator شايف Offline خلاص
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setIsOnline(false);
        console.log("navigator offline");
        return;
      }

      try {
        // request سريع بدون cache
        const res = await fetch(`${pingUrl}?t=${Date.now()}`, {
          method: "GET",
          cache: "no-store",
        });
        setIsOnline(res.ok);
        console.log("navigator offline");

      } catch {
        setIsOnline(false);
      }
    };

    const onOnline = () => {
      setIsOnline(true);
      ping(); // تحقق سريع
    };

    const onOffline = () => setIsOnline(false);

    // init
    setFromNavigator();
    ping();

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    timerRef.current = setInterval(ping, intervalMs);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pingUrl, intervalMs]);

  return { isOnline };
}
