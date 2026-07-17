"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Trophy, Star, CheckCircle2, Circle } from "lucide-react";
import "../../../../lib/i18n";

export default function ChallengeDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const challengeDetails = {
    "1": {
      title: "7-Day Code Warrior",
      description: "Tulis kode / selesaikan materi coding selama 7 hari berturut-turut.",
      difficulty: "Medium",
      reward: "Badge Streak Master + 200 XP",
      daysCompleted: 5,
      totalDays: 7,
      milestones: [
        { day: 1, completed: true, activity: "Selesai Kelas Coding Dasar" },
        { day: 2, completed: true, activity: "Menyelesaikan Kuis Syntax JavaScript" },
        { day: 3, completed: true, activity: "Membuat Component React Pertama" },
        { day: 4, completed: true, activity: "Selesai Kelas Array & Object Operations" },
        { day: 5, completed: true, activity: "Menyelesaikan Kuis State Management" },
        { day: 6, completed: false, activity: "Selesai Kelas React Router" },
        { day: 7, completed: false, activity: "Membuat Aplikasi Portofolio Interaktif" },
      ]
    },
    "2": {
      title: "Math Genius Elite",
      description: "Selesaikan 3 buah kuis Matematika dengan skor sempurna 100%.",
      difficulty: "Hard",
      reward: "Badge Math Genius + 500 XP",
      daysCompleted: 2,
      totalDays: 3,
      milestones: [
        { day: 1, completed: true, activity: "Kuis Aljabar Linear - Skor 100%" },
        { day: 2, completed: true, activity: "Kuis Kalkulus Integral - Skor 100%" },
        { day: 3, completed: false, activity: "Kuis Statistika Deskriptif - Belum Selesai" },
      ]
    }
  };

  const challenge = challengeDetails[id] || challengeDetails["1"];

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile/challenge")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Detail Challenge
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Challenge details */}
        <div className="w-full p-6 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-4 shadow-xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-left">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-wider">{challenge.title}</h3>
              <span className="text-[9px] text-slate-500 dark:text-white/40 font-bold mt-0.5">Difficulty: {challenge.difficulty}</span>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-white/80 leading-relaxed">
            {challenge.description}
          </p>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-bold app-theme-text-muted">Reward</span>
            </div>
            <span className="text-[10px] font-black app-theme-text">{challenge.reward}</span>
          </div>
        </div>

        {/* Timeline / Milestones */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted text-left">Milestones</h4>

          <div className="flex flex-col gap-3 w-full">
            {challenge.milestones.map((m, idx) => (
              <div
                key={idx}
                className="w-full flex items-center justify-between p-4 rounded-2xl app-theme-card border border-white/5 bg-white/[0.01]"
              >
                <div className="flex items-center gap-3 text-left">
                  {m.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-bold app-theme-text">{m.activity}</span>
                    <span className="text-[9px] app-theme-text-muted font-medium mt-0.5">Target {id === "1" ? `Hari ${m.day}` : `Kuis ${m.day}`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
