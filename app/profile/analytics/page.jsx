"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Activity } from "lucide-react";
import "../../../lib/i18n";

export default function AnalyticsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Platform Analytics
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Analytics summary row */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          <div className="p-3 rounded-2xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-1 text-center">
            <span className="text-[14px] font-black tracking-tight app-theme-text">1,284</span>
            <span className="text-[7px] app-theme-text-muted uppercase font-bold tracking-wider leading-none">Active Students</span>
          </div>
          <div className="p-3 rounded-2xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-1 text-center">
            <span className="text-[14px] font-black tracking-tight app-theme-text">42.5m</span>
            <span className="text-[7px] app-theme-text-muted uppercase font-bold tracking-wider leading-none">Avg Study Time</span>
          </div>
          <div className="p-3 rounded-2xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-1 text-center">
            <span className="text-[14px] font-black tracking-tight app-theme-text">87.4%</span>
            <span className="text-[7px] app-theme-text-muted uppercase font-bold tracking-wider leading-none">Quiz Pass Rate</span>
          </div>
        </div>

        {/* Graph 1: Weekly Student Engagement */}
        <div className="w-full p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-3.5 shadow-xl">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Engagement Analytics
            </span>
            <span className="text-[9px] app-theme-text-muted font-semibold mt-0.5">Weekly Active Users (WAU)</span>
          </div>

          {/* SVG Line Graph */}
          <div className="w-full h-32 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1,1" className="text-[var(--text-color)]" opacity="0.15" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1,1" className="text-[var(--text-color)]" opacity="0.15" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1,1" className="text-[var(--text-color)]" opacity="0.15" />
              
              <path
                d="M 0 35 Q 16.6 25, 33.3 28 T 66.6 15 T 100 8"
                fill="none"
                stroke="currentColor"
                className="text-[var(--text-color)]"
                strokeWidth="0.8"
                opacity="0.85"
              />
              <path
                d="M 0 35 Q 16.6 25, 33.3 28 T 66.6 15 T 100 8 L 100 40 L 0 40 Z"
                fill="url(#white-grad)"
                opacity="0.05"
              />
              
              <circle cx="0" cy="35" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="16.6" cy="27" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="33.3" cy="28" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="50" cy="20" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="66.6" cy="15" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="83.3" cy="12" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />
              <circle cx="100" cy="8" r="1" fill="currentColor" stroke="none" className="text-[var(--text-color)]" />

              <defs>
                <linearGradient id="white-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" className="text-[var(--text-color)]" />
                  <stop offset="100%" stopColor="currentColor" className="text-[var(--text-color)]" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex justify-between items-center text-[7.5px] font-bold app-theme-text-muted px-1">
            <span>SEN</span>
            <span>SEL</span>
            <span>RAB</span>
            <span>KAM</span>
            <span>JUM</span>
            <span>SAB</span>
            <span>AHU</span>
          </div>
        </div>

        {/* Graph 2: Quiz Completion By Category */}
        <div className="w-full p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-3.5 shadow-xl">
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Completion By Subject</span>
            <span className="text-[9px] app-theme-text-muted font-semibold mt-0.5">Quiz volume solved by discipline</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { name: "Coding", count: 512, percent: 90 },
              { name: "Matematika", count: 432, percent: 75 },
              { name: "Science", count: 320, percent: 55 },
              { name: "Bahasa Inggris", count: 290, percent: 50 },
            ].map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] font-bold text-[var(--text-color)]/70">
                  <span>{cat.name}</span>
                  <span>{cat.count} Selesai</span>
                </div>
                <div className="w-full bg-[var(--text-color)]/5 rounded-full h-1.5 overflow-hidden border border-[var(--border-color)]/20">
                  <div
                    className="h-full bg-[var(--text-color)] rounded-full opacity-80"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
