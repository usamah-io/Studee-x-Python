"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  FlaskConical, 
  Code, 
  Globe, 
  Award, 
  TrendingUp, 
  Flame,
  ChevronLeft
} from "lucide-react";
import { useStreak } from "../../lib/StreakContext";
import { useCourseData } from "../../lib/CourseDataContext";
import { motion } from "framer-motion";
import { calculateStreakStatus } from "../../constants/statsData";
import ProtectedCourse from "../../components/ProtectedCourse";

export default function StatsPage() {
  const router = useRouter();
  const { streakData, totalStreak } = useStreak();
  const { courseData, statsData, loading } = useCourseData();
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

  // Calculate dynamic stats
  const totalMinutes = streakData
    .filter(day => day.active)
    .reduce((acc, day) => acc + (parseInt(day.min) || 0), 0);
  const activeDaysCount = streakData.filter(day => day.active).length;
  const avgMinutes = activeDaysCount > 0 ? Math.round(totalMinutes / activeDaysCount) : 0;
  const completionPercent = Math.round((activeDaysCount / 7) * 100);

  const renderWeeklyStreakCalendar = () => {
    return (
      <div className="app-theme-card rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6 w-full animate-fade-in">
        {/* Header (Top Bar) */}
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-[var(--text-color)]">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h4 className="text-[13px] font-bold app-theme-text tracking-tight leading-tight">Belajar minimal 30 menit hari ini</h4>
              <span className="text-[10px] app-theme-text-muted font-medium mt-0.5">7 hari terakhir</span>
            </div>
          </div>
          
          <button className="app-theme-text-muted hover:text-[var(--text-color)] transition-colors p-1" onClick={() => alert("Pengaturan Streak")}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 10a2 2 0 11-2 2 2 2 0 012-2zm6 0a2 2 0 11-2 2 2 2 0 012-2zM6 10a2 2 0 11-2 2 2 2 0 012-2z" />
            </svg>
          </button>
        </div>

        {/* Sub-Header text */}
        <div className="text-[10px] app-theme-text-muted font-medium -mt-2">
          Progres Mingguan: <span className="app-theme-text font-bold">{activeDaysCount} dari 7 hari selesai</span> ({completionPercent}%)
        </div>

        {/* Days Row */}
        <div className="flex justify-between items-center w-full gap-1 mt-1">
          {streakData.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3 flex-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                day.isToday 
                  ? "bg-[var(--text-color)]/10 border border-[var(--border-color)] text-[var(--text-color)]" 
                  : "app-theme-text-muted"
              }`}>
                {day.name}
              </span>
              
              <div className="relative">
                {day.isToday && (
                  <svg className="absolute inset-0 w-9 h-9 -rotate-90 pointer-events-none z-10">
                    <circle cx="18" cy="18" r="16" className="stroke-[var(--text-color)]/10 fill-none" strokeWidth="1.5" />
                    <motion.circle 
                      cx="18" 
                      cy="18" 
                      r="16" 
                      className="stroke-[var(--text-color)] fill-none" 
                      strokeWidth="2.5" 
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: day.active ? 0 : 50 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                )}

                <motion.div 
                  initial={day.active ? { scale: 0.9, opacity: 0.8 } : false}
                  animate={day.active ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 0.6 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    day.active 
                      ? "bg-black/10 dark:bg-white/10 border border-[var(--border-color)] text-[var(--text-color)] shadow-inner" 
                      : "bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-color)]/10"
                  }`}
                >
                  <Flame className={`w-4 h-4 ${day.active ? "text-[var(--text-color)] fill-[var(--text-color)]" : "text-[var(--text-color)]/20"}`} />
                </motion.div>
              </div>

              <span className={`text-[10px] font-semibold ${day.isToday ? "app-theme-text" : "app-theme-text-muted"}`}>
                {day.active ? day.min.replace("m", "") : "-"}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Summary (Unified Pill Capsule) */}
        <div className="app-theme-card rounded-full py-3.5 px-6 flex items-center justify-between mt-2 shadow-inner">
          <div className="flex flex-col flex-1 pl-2">
            <span className="text-[15px] font-bold app-theme-text tracking-tight leading-none">{totalMinutes} min</span>
            <span className="text-[9px] app-theme-text-muted uppercase tracking-wider font-semibold mt-1 block">Total Belajar</span>
          </div>
          
          <div className="h-7 border-l border-[var(--border-color)] mx-2" />
          
          <div className="flex flex-col flex-1 pl-6">
            <span className="text-[15px] font-bold app-theme-text tracking-tight leading-none">{avgMinutes}m / day</span>
            <span className="text-[9px] app-theme-text-muted uppercase tracking-wider font-semibold mt-1 block">Rata-rata Harian</span>
          </div>

          <div className="relative w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full border border-[var(--border-color)] shadow-inner flex-shrink-0">
            <svg className="absolute inset-0 w-10 h-10 -rotate-90 pointer-events-none">
              <circle cx="20" cy="20" r="16" className="stroke-black/5 dark:stroke-white/5 fill-none" strokeWidth="2" />
              <circle 
                cx="20" 
                cy="20" 
                r="16" 
                className="stroke-black dark:stroke-white fill-none" 
                strokeWidth="2.5" 
                strokeDasharray="100" 
                strokeDashoffset={100 - completionPercent} 
              />
            </svg>
            <Flame className={`w-4.5 h-4.5 animate-pulse ${
              calculateStreakStatus(statsData.lastStudyDate)
                ? "text-[var(--text-color)] fill-[var(--text-color)]"
                : "text-[var(--text-color)]/20 fill-none"
            }`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-bold tracking-wider app-theme-text">My Journey</span>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Streak Calendar (Kartu Utama) */}
        {renderWeeklyStreakCalendar()}
        
        {/* Stats Summary (Row) */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Card 1: Total Belajar */}
          <div className="app-theme-card rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[110px] hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] app-theme-text-muted font-bold uppercase tracking-wider">Total Belajar</span>
              <Flame className={`w-4 h-4 ${
                calculateStreakStatus(statsData.lastStudyDate)
                  ? "text-[var(--text-color)] fill-[var(--text-color)]"
                  : "text-[var(--text-color)]/20 fill-none"
              }`} />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black app-theme-text">{statsData.totalStudyTime} min</span>
              <span className="text-[10px] app-theme-text-muted block mt-0.5">Minggu ini</span>
            </div>
          </div>
          
          {/* Card 2: Rata-rata Harian */}
          <div className="app-theme-card rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[110px] hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all">
            <div className="flex justify-between items-start w-full">
              <span className="text-[10px] app-theme-text-muted font-bold uppercase tracking-wider">Rata-rata Harian</span>
              <div className="relative w-5 h-5 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full border border-[var(--border-color)] flex-shrink-0">
                <svg className="absolute inset-0 w-5 h-5 -rotate-90 pointer-events-none">
                  <circle cx="10" cy="10" r="8" className="stroke-black/5 dark:stroke-white/5 fill-none" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="8" className="stroke-black dark:stroke-white fill-none" strokeWidth="2" strokeDasharray="50" strokeDashoffset="12" />
                </svg>
                <span className="text-[8px] text-black dark:text-white font-bold">%</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-black app-theme-text">{statsData.streakCount > 0 ? Math.round(statsData.totalStudyTime / statsData.streakCount) : 0}m / day</span>
              <span className="text-[10px] app-theme-text-muted block mt-0.5">Konsistensi: 85%</span>
            </div>
          </div>
        </div>

        {/* Course Progress List */}
        <div className="flex flex-col gap-3.5 w-full">
          <h3 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted">Course Progress</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {courseData.map((subj) => (
              <ProtectedCourse key={subj.id} subjectId={subj.id}>
                <div 
                  className="app-theme-card rounded-3xl p-5 flex flex-col justify-between aspect-square hover:scale-[1.02] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300 shadow-xl cursor-pointer"
                >
                  {/* Top: Icon */}
                  <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center border border-black/5 dark:border-white/10 flex-shrink-0">
                    {(() => {
                      const iconName = subj.icon || "";
                      const category = (subj.category || "").toLowerCase();
                      const name = (subj.name || subj.title || "").toLowerCase();
                      
                      if (iconName === "GraduationCap" || category.includes("math") || category.includes("matematika") || name.includes("math") || name.includes("matematika")) {
                        return <GraduationCap className="w-5 h-5 text-black dark:text-white" />;
                      }
                      if (iconName === "FlaskConical" || category.includes("science") || category.includes("ipa") || name.includes("science") || name.includes("ipa")) {
                        return <FlaskConical className="w-5 h-5 text-black dark:text-white" />;
                      }
                      if (iconName === "Code" || category.includes("coding") || category.includes("program") || name.includes("coding") || name.includes("program")) {
                        return <Code className="w-5 h-5 text-black dark:text-white" />;
                      }
                      if (iconName === "Globe" || category.includes("english") || category.includes("inggris") || name.includes("english") || name.includes("inggris")) {
                        return <Globe className="w-5 h-5 text-black dark:text-white" />;
                      }
                      return <GraduationCap className="w-5 h-5 text-black dark:text-white" />;
                    })()}
                  </div>
                  
                  {/* Middle: Course Name & Level */}
                  <div className="flex flex-col min-w-0 mt-3 flex-grow justify-center">
                    <h4 className="font-bold app-theme-text text-sm line-clamp-1 leading-tight">{subj.name || subj.title}</h4>
                    <span className="text-[10px] app-theme-text-muted font-semibold uppercase tracking-wider mt-1">{subj.level}</span>
                  </div>
                  
                  {/* Bottom: Progress Bar & Percentage */}
                  <div className="flex flex-col gap-1.5 w-full mt-2">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-semibold app-theme-text-muted uppercase tracking-wider">Progress</span>
                      <span className="text-xs font-bold app-theme-text">{subj.progress}%</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden border border-black/5 dark:border-white/5">
                      <div 
                        className="h-full bg-black dark:bg-white rounded-full"
                        style={{ width: `${subj.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </ProtectedCourse>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
