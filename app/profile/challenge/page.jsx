"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Flame, Trophy, ChevronRight } from "lucide-react";
import "../../../lib/i18n";

export default function ChallengePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const challenges = [
    {
      id: 1,
      title: "7-Day Code Warrior",
      description: "Tulis kode / selesaikan materi coding selama 7 hari berturut-turut.",
      progress: 71,
      daysCompleted: 5,
      totalDays: 7,
    },
    {
      id: 2,
      title: "Math Genius Elite",
      description: "Selesaikan 3 buah kuis Matematika dengan skor sempurna 100%.",
      progress: 66,
      daysCompleted: 2,
      totalDays: 3,
    },
  ];

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
            {t("profile.challenge") || "Challenge"}
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Challenges List */}
        <div className="flex flex-col gap-4 w-full">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => router.push(`/profile/challenge/${challenge.id}`)}
              className="w-full p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 shadow-xl hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer text-left"
            >
              {/* Title row */}
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wide app-theme-text">
                    {challenge.title}
                  </h4>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <p className="text-[10px] app-theme-text-muted leading-relaxed font-semibold">
                {challenge.description}
              </p>

              {/* Progress bar */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between text-[9px] font-bold app-theme-text-muted">
                  <span>Progress</span>
                  <span>{challenge.daysCompleted} / {challenge.totalDays}</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-white transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
