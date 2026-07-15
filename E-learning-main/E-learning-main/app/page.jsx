"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingPage from "./onboarding/page";

export default function RootPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const hasVisited = localStorage.getItem("hasVisitedOnboarding") === "true";
    
    if (logged) {
      setIsLoggedIn(true);
      router.push("/dashboard");
    } else if (hasVisited) {
      setIsLoggedIn(true); // Treat as transitioning/loading state to show spinner
      router.push("/login");
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  if (isLoggedIn === null || isLoggedIn) {
    // Show a clean glassmorphism loading spinner while verifying session or redirecting
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 animate-pulse">Studee Loading...</span>
        </div>
      </div>
    );
  }

  // Renders the onboarding screen directly at / if first time visitor and not logged in
  return <OnboardingPage />;
}
