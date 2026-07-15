"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ChevronLeft,
  Flame,
  Check,
  Award
} from "lucide-react";
import { useStreak } from "../../lib/StreakContext";
import { useCourseData } from "../../lib/CourseDataContext";
import { motion } from "framer-motion";

export default function StatsPage() {
  const router = useRouter();
  const { streakData, totalStreak } = useStreak();
  const { loading } = useCourseData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen app-theme-bg flex items-center justify-center relative overflow-hidden">
        <div className="app-theme-card rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--text-color)]/20 border-t-[var(--text-color)] rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest app-theme-text-muted animate-pulse">Loading Stats...</span>
        </div>
      </div>
    );
  }

  // Milestone targets mapping
  const milestoneTargets = [1, 5, 10, 20, 30, 40, 50];
  
  // Calculate active columns
  const activeCount = milestoneTargets.filter(target => totalStreak >= target).length;

  // Reward milestones definition
  const rewardMilestones = [
    { target: 7, reward: "+50 XP" },
    { target: 14, reward: "+200 XP" },
    { target: 21, reward: "+500 XP" },
    { target: 28, reward: "Spesial" }
  ];

  // Determine current next reward milestone
  let nextRewardIndex = 0;
  if (totalStreak >= 28) {
    nextRewardIndex = 3;
  } else if (totalStreak >= 21) {
    nextRewardIndex = 3;
  } else if (totalStreak >= 14) {
    nextRewardIndex = 2;
  } else if (totalStreak >= 7) {
    nextRewardIndex = 1;
  } else {
    nextRewardIndex = 0;
  }
  const nextRewardTarget = rewardMilestones[nextRewardIndex];

  return (
    <main className="min-h-screen pb-24 bg-black text-white font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10 flex-grow justify-between">
        
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1 text-sm font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Back to Home"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Home</span>
            </button>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Central Flame & Stats */}
          <div className="flex flex-col items-center text-center mt-6 relative">
            {/* Background Halo Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-[50px] animate-pulse pointer-events-none" />

            {/* Glowing Flame Wrapper */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-white/5 rounded-full blur-2xl"
              />
              <Flame 
                className="w-24 h-24 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              />
            </div>

            {/* Streak Number */}
            <h1 className="text-6xl font-black tracking-tight text-white leading-none">
              {totalStreak}
            </h1>
            <span className="text-sm font-bold uppercase tracking-widest text-white/50 mt-1">
              days streak
            </span>
            <p className="text-xs text-white/60 font-medium max-w-[280px] mt-3 leading-relaxed">
              Terus konsisten belajar setiap hari untuk meningkatkan motivasi belajarmu.
            </p>
          </div>

          {/* Calendar Milestone Capsule Block */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col gap-5 w-full shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Day Names Grid */}
            <div className="grid grid-cols-7 text-center text-[10px] text-white/40 font-bold uppercase tracking-wider">
              {streakData.map((day, idx) => (
                <span key={idx} className={day.isToday ? "text-white font-extrabold" : ""}>
                  {day.name}
                </span>
              ))}
            </div>

            {/* Status Grid with connected Pill */}
            <div className="grid grid-cols-7 relative items-center justify-items-center h-10 w-full">
              {/* Connected Active Pill Background */}
              {activeCount > 0 && (
                <div 
                  className="h-10 bg-white/10 border border-white/15 rounded-full absolute left-0 z-0 transition-all duration-500"
                  style={{ 
                    width: `${(activeCount / 7) * 100}%`,
                    boxShadow: "inset 0 0 10px rgba(255,255,255,0.05)"
                  }}
                />
              )}

              {/* Day Indicators */}
              {streakData.map((day, idx) => {
                const target = milestoneTargets[idx];
                const isActive = totalStreak >= target;

                return (
                  <div key={idx} className="relative z-10 w-full flex items-center justify-center">
                    {isActive ? (
                      <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-all duration-300">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-white/30 transition-all duration-300">
                        {target}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewards Milestones Section */}
          <div className="mt-8 flex flex-col gap-4 w-full">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              NEXT REWARD: {nextRewardTarget.reward}
            </span>

            <div className="grid grid-cols-4 gap-3 w-full">
              {rewardMilestones.map((item, idx) => {
                const isAchieved = totalStreak >= item.target;
                const isNext = idx === nextRewardIndex;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-3 flex flex-col justify-between items-center text-center gap-1.5 transition-all duration-300 border ${
                      isNext
                        ? "bg-white/10 border-white/30 border-dashed shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.03]"
                        : isAchieved
                          ? "bg-white/5 border-white/5 opacity-40"
                          : "bg-white/3 border-white/5"
                    }`}
                  >
                    <span className="text-[9px] font-bold text-white/50 tracking-tight">
                      {item.target} Hari
                    </span>
                    <Award className={`w-4 h-4 ${isNext ? "text-white animate-bounce" : isAchieved ? "text-white/40" : "text-white/20"}`} />
                    <span className={`text-[10px] font-bold ${isNext ? "text-white" : "text-white/40"}`}>
                      {item.reward}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full mt-8">
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            Lanjutkan
          </button>
        </div>

      </div>
    </main>
  );
}
