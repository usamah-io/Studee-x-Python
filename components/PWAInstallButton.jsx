"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.deferredPrompt) {
        setIsInstallable(true);
      }

      const handleInstallable = () => {
        setIsInstallable(true);
      };
      window.addEventListener("pwa-installable", handleInstallable);
      return () => {
        window.removeEventListener("pwa-installable", handleInstallable);
      };
    }
  }, []);

  const [collapseTimer, setCollapseTimer] = useState(null);

  const handleInstallClick = async () => {
    if (typeof window !== "undefined" && window.deferredPrompt) {
      const prompt = window.deferredPrompt;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
        window.deferredPrompt = null;
      }
    }
  };

  const handleClick = (e) => {
    if (!isExpanded) {
      e.preventDefault();
      setIsExpanded(true);
      if (collapseTimer) clearTimeout(collapseTimer);
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 4000);
      setCollapseTimer(timer);
    } else {
      if (collapseTimer) clearTimeout(collapseTimer);
      handleInstallClick();
    }
  };

  useEffect(() => {
    return () => {
      if (collapseTimer) clearTimeout(collapseTimer);
    };
  }, [collapseTimer]);

  return (
    <AnimatePresence>
      {isInstallable && (
        <motion.button
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={handleClick}
          className="fixed bottom-24 right-6 h-11 bg-black border border-white/20 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-[100] cursor-pointer overflow-hidden transition-all hover:bg-zinc-900 px-3 gap-0"
          style={{ minWidth: "44px" }}
          title="Instal Aplikasi Studee"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-white flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-bold whitespace-nowrap tracking-wide select-none pr-1"
                >
                  Install
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
