"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsAdminModalOpen(false); // Close admin modal automatically on navigation
  }, [pathname]); // Refresh login status and close modal on navigation

  useEffect(() => {
    if (!isAdminModalOpen) {
      setAdminEmail("");
      setAdminPassword("");
    }
  }, [isAdminModalOpen]);

  // Determine active tab based on pathname
  let activeTab = "home";
  if (pathname === "/") {
    activeTab = "home";
  } else if (pathname.startsWith("/lesson") || pathname.startsWith("/library")) {
    activeTab = "learn";
  } else if (pathname.startsWith("/stats")) {
    activeTab = "stats";
  } else if (pathname.startsWith("/profile")) {
    activeTab = "profile";
  }

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "learn",
      label: "Learn",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "stats",
      label: "Stats",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: isLoggedIn ? "Profile" : "Profil",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  if (!mounted) {
    return null;
  }

  if (
    pathname === "/" ||
    pathname === "/onboarding" ||
    pathname === "/login" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/lesson")
  ) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isInstallable && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            onClick={handleInstallClick}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/85 hover:bg-black/90 dark:bg-zinc-900/90 dark:hover:bg-zinc-900 backdrop-blur-xl border border-white/10 text-white rounded-full py-3 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-2.5 z-[100] cursor-pointer active:scale-95 transition-all text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:border-white/20"
          >
            <svg className="w-4 h-4 text-purple-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Instal Aplikasi Studee</span>
          </motion.button>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2.5rem)] bg-[var(--nav-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-full py-2.5 px-3 shadow-2xl flex items-center justify-between z-[100] transition-colors duration-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "profile") {
                router.push("/profile");
                return;
              }
              if (tab.id === "stats") {
                router.push("/stats");
                return;
              }
              if (tab.id === "home") {
                router.push("/");
                return;
              }
              if (tab.id === "learn") {
                router.push("/library");
                return;
              }
            }}
            className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${
              activeTab === tab.id
                ? "bg-black/10 border border-black/20 text-black dark:bg-white/20 dark:border-white/20 dark:text-white shadow-lg"
                : "text-[var(--text-color)]/60 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {activeTab === tab.id && (
              <span className="text-xs font-semibold tracking-wider transition-all duration-300">
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
