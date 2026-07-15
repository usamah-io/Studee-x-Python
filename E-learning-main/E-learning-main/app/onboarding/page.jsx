"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hasVisitedOnboarding", "true");
      localStorage.setItem("isLoggedIn", "true");
      document.cookie = "isLoggedIn=true; path=/";
      localStorage.setItem("userRole", "user");
      document.cookie = "userRole=user; path=/";
    }
    setIsExiting(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600); // 600ms match duration of ease-out transition
  };

  return (
    <motion.main
      initial={{ opacity: 0, scale: 1.02 }}
      animate={isExiting ? { opacity: 0, scale: 0.98, filter: "blur(15px)" } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full min-h-screen overflow-hidden text-white font-sans flex flex-col justify-between p-6 sm:p-10 md:p-16"
    >
      {/* Background Image with Blur & Dark Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 filter blur-xs"
        style={{ backgroundImage: `url('/onboarding_bg.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90 z-10" />

      {/* Glow ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-15" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-15" />

      {/* Top: Branding Logo (Typography Design) - Center Aligned */}
      <div className="relative z-20 flex flex-col items-center select-none pt-4 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-outfit">
          Stu<span className="text-purple-400">dee</span>
        </h1>
      </div>

      {/* Bottom Section: Floating Glassmorphic Panel (Tagline + Indicators & CTA Button) */}
      <div className="w-full relative z-20 flex flex-col gap-6 mt-auto pb-4 max-w-xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl">
        {/* Tagline - Tighter letter spacing (tracking-tight) & line spacing (leading-tight) */}
        <h2 className="text-2.5xl sm:text-3xl md:text-3.5xl font-semibold leading-tight text-white font-sans text-left lowercase tracking-tight">
          temukan ritme belajar yang menyenangkan dan jadikan setiap prosesnya terasa <span className="text-purple-400 font-bold">lebih ringan</span>.
        </h2>

        {/* Bottom Row: 3 Dashes Indicators (Left) & Pill Button (Right) */}
        <div className="w-full flex items-center justify-between gap-4 mt-2">
          {/* Dashes Indicator (Purple) */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-1 rounded-full bg-purple-500" />
            <div className="w-6 h-1 rounded-full bg-purple-500/25" />
            <div className="w-6 h-1 rounded-full bg-purple-500/25" />
          </div>

          {/* Purple Pill Button with Dark Circle Arrow */}
          <button
            onClick={handleStart}
            className="flex items-center gap-3 bg-purple-500 text-white rounded-full py-2 pl-2 pr-6 text-xs sm:text-sm font-bold shadow-lg transition-all duration-300 active:scale-95 cursor-pointer hover:bg-purple-600 hover:shadow-purple-500/25 flex-shrink-0"
          >
            {/* Dark Circle with Right Arrow */}
            <div className="w-8 h-8 rounded-full bg-black/80 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </div>
            <span>Get Started</span>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
