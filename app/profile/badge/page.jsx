"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Flame, Award, Globe, GraduationCap, Trophy, Lock } from "lucide-react";
import "../../../lib/i18n";

export default function BadgePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("streak"); // streak, explore, career

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeCategories = {
    streak: {
      title: "Streak Master",
      desc: "Badges earned by maintaining consistent daily study streaks.",
      badges: [
        {
          id: 1,
          name: "Streak Starter",
          desc: "Maintain a 3-day learning streak",
          unlocked: true,
          icon: <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />,
        },
        {
          id: 2,
          name: "Streak Master",
          desc: "Maintain a 5-day learning streak",
          unlocked: true,
          icon: <Flame className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />,
        },
        {
          id: 3,
          name: "Consistency Legend",
          desc: "Maintain a 30-day learning streak",
          unlocked: false,
          icon: <Flame className="w-6 h-6 text-slate-400" />,
        }
      ]
    },
    explore: {
      title: "Global Explore",
      desc: "Badges earned by exploring multiple categories and diverse topics.",
      badges: [
        {
          id: 4,
          name: "Global Explorer",
          desc: "Start classes in 3 different subjects",
          unlocked: true,
          icon: <Globe className="w-6 h-6 text-blue-500" />,
        },
        {
          id: 5,
          name: "Subject Hopper",
          desc: "Complete at least one lesson in Math, Science, and Coding",
          unlocked: false,
          icon: <Globe className="w-6 h-6 text-slate-400" />,
        }
      ]
    },
    career: {
      title: "Quick Learner / Quiz Career",
      desc: "Badges earned by completing materials super fast and conquering quizzes.",
      badges: [
        {
          id: 6,
          name: "Fast Learner",
          desc: "Complete a lesson in less than 15 minutes",
          unlocked: true,
          icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
        },
        {
          id: 7,
          name: "Quiz Conqueror",
          desc: "Get 100% score on your very first quiz",
          unlocked: true,
          icon: <Award className="w-6 h-6 text-emerald-500" />,
        },
        {
          id: 8,
          name: "Quiz Mastermind",
          desc: "Complete 10 quizzes with a score higher than 90%",
          unlocked: false,
          icon: <Trophy className="w-6 h-6 text-slate-400" />,
        }
      ]
    }
  };

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
            {t("profile.badge") || "Badge"}
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Category switcher */}
        <div className="flex app-theme-card rounded-2xl p-1 gap-1 w-full">
          {Object.keys(badgeCategories).map((categoryKey) => (
            <button
              key={categoryKey}
              onClick={() => setActiveCategory(categoryKey)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${
                activeCategory === categoryKey
                  ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                  : "text-[var(--text-color)]/55 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {badgeCategories[categoryKey].title}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <p className="text-[10px] app-theme-text-muted leading-relaxed font-semibold -mt-2 text-left px-1">
          {badgeCategories[activeCategory].desc}
        </p>

        {/* Badges List */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {badgeCategories[activeCategory].badges.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col items-center gap-3 shadow-xl border text-center transition-all duration-300 ${
                b.unlocked
                  ? "border-emerald-500/20 bg-emerald-500/[0.01] hover:scale-[1.02]"
                  : "border-white/5 bg-white/[0.01] opacity-60"
              }`}
            >
              {/* Badge Icon Frame */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${
                b.unlocked ? "bg-black/5 dark:bg-white/10" : "bg-black/10 dark:bg-white/5"
              }`}>
                {b.icon}
                {!b.unlocked && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neutral-900 border border-white/20 rounded-full flex items-center justify-center shadow-lg">
                    <Lock className="w-3 h-3 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-black app-theme-text">{b.name}</h4>
                <p className="text-[9px] app-theme-text-muted leading-tight font-medium px-1">
                  {b.desc}
                </p>
              </div>

              {/* Status Badge */}
              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                b.unlocked ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
              }`}>
                {b.unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
