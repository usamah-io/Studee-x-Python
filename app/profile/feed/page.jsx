"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Flame, FlaskConical, GraduationCap, Code, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../lib/i18n";

export default function FeedPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const feeds = [
    {
      id: 1,
      subject: "Science (IPA)",
      activity: "Selesai menyelesaikan modul Struktur Sel Hewan dan Tumbuhan",
      streak: 5,
      time: "1 jam yang lalu",
      detail: "Modul ini mencakup pemahaman mendalam tentang perbedaan organel sel hewan (seperti lisosom dan sentrosom) dan sel tumbuhan (seperti dinding sel dan kloroplas). Nilai kuis evaluasi akhir sangat memuaskan.",
      icon: <FlaskConical className="w-5 h-5 text-black dark:text-white" />,
    },
    {
      id: 2,
      subject: "Matematika",
      activity: "Menyelesaikan Kuis Aljabar Linear tingkat Menengah",
      streak: 3,
      time: "4 jam yang lalu",
      detail: "Kuis aljabar linear tingkat menengah mencakup operasi perkalian matriks, pencarian nilai determinan matriks 3x3, serta pengenalan awal vektor eigen. Skor kelulusan 100%.",
      icon: <GraduationCap className="w-5 h-5 text-black dark:text-white" />,
    },
    {
      id: 3,
      subject: "Coding",
      activity: "Membuat aplikasi kalkulator interaktif menggunakan React",
      streak: 8,
      time: "Kemarin",
      detail: "Mengimplementasikan fitur dasar penambahan, pengurangan, pembagian, dan perkalian. Menggunakan React Hooks (useState) untuk state management serta Tailwind CSS untuk layout minimalis monokrom.",
      icon: <Code className="w-5 h-5 text-black dark:text-white" />,
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
            {t("profile.feed") || "Feed"}
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Feed List */}
        <div className="flex flex-col gap-4 w-full">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              onClick={() => setSelectedFeed(feed)}
              className="w-full p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 shadow-xl hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-center">
                    {feed.icon}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs font-bold app-theme-text leading-tight">
                      {feed.subject}
                    </h4>
                    <span className="text-[9px] app-theme-text-muted font-medium mt-0.5">
                      {feed.time}
                    </span>
                  </div>
                </div>

                {/* Streak badge */}
                <span className="text-[10px] app-theme-text font-bold flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg border border-[var(--border-color)]">
                  <Flame className="w-3.5 h-3.5 fill-[var(--text-color)] text-[var(--text-color)]" />
                  {feed.streak} Hari Streak
                </span>
              </div>

              {/* Body */}
              <p className="text-xs app-theme-text leading-relaxed font-medium pl-1">
                {feed.activity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Detail Modal */}
      <AnimatePresence>
        {selectedFeed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-6"
            onClick={() => setSelectedFeed(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="max-w-xs w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    {selectedFeed.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider">{selectedFeed.subject}</span>
                </div>
                <button
                  onClick={() => setSelectedFeed(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center cursor-pointer active:scale-90"
                >
                  <X className="w-4 h-4 text-slate-800 dark:text-white" />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-2 text-left">
                <span className="text-[10px] text-slate-400 dark:text-white/40 font-semibold">{selectedFeed.time}</span>
                <h3 className="text-sm font-bold leading-snug">{selectedFeed.activity}</h3>
                <p className="text-xs text-slate-600 dark:text-white/70 leading-relaxed mt-2 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                  {selectedFeed.detail}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 py-2 rounded-xl text-xs font-black mt-1">
                <Flame className="w-4 h-4 fill-orange-600 dark:fill-orange-400" />
                <span>Mempertahankan {selectedFeed.streak} Hari Streak</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
