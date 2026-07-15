"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Register service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker registered:", reg.scope))
          .catch((err) => console.error("Service Worker registration failed:", err));
      }

      // 2. Listen for beforeinstallprompt
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        // Dispatch custom event to notify components that the app is installable
        window.dispatchEvent(new Event("pwa-installable"));
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  return null;
}
