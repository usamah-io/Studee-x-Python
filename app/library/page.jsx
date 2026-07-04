"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  FlaskConical, 
  Code, 
  Globe, 
  ChevronLeft,
  BookOpen,
  Clock,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProtectedCourse from "../../components/ProtectedCourse";

export default function LibraryPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Show 2 subjects initially for Load More demonstration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSubjects(data);
        }
      })
      .catch((err) => console.error("Error loading subjects from database:", err));
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, subjects.length));
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pb-32 app-theme-bg font-sans relative overflow-hidden"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md mx-auto px-6 pt-12 md:pt-16 flex flex-col gap-6 relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 app-theme-card rounded-full flex items-center justify-center text-[var(--text-color)] transition-colors cursor-pointer active:scale-95"
            title="Kembali"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 app-theme-card px-4 py-1.5 rounded-full">
            <BookOpen className="w-4 h-4 text-[var(--text-color)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider app-theme-text">Course Library</span>
          </div>
          <div className="w-10 h-10 opacity-0 pointer-events-none" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1 mt-2">
          <h2 className="text-2xl font-black app-theme-text tracking-tight">Daftar Pelajaran</h2>
          <p className="text-xs app-theme-text-muted font-medium leading-relaxed">
            Jelajahi seluruh koleksi pelajaran dan silabus unggulan kami untuk menunjang journey belajar Anda.
          </p>
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          <AnimatePresence>
            {subjects.slice(0, visibleCount).map((subj) => (
              <ProtectedCourse key={subj.id} subjectId={subj.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="app-theme-card rounded-3xl p-5 flex flex-col justify-between aspect-square hover:scale-[1.02] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300 shadow-xl cursor-pointer group relative overflow-hidden"
                >
                  {/* Top: Icon */}
                  <div className="w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-center flex-shrink-0">
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

                  {/* Middle: Course Name & Category */}
                  <div className="flex flex-col min-w-0 mt-3 flex-grow justify-center">
                    <h4 className="font-bold app-theme-text text-xs sm:text-sm line-clamp-2 leading-tight">
                      {subj.name || subj.title}
                    </h4>
                    <span className="text-[9px] app-theme-text-muted font-semibold uppercase tracking-wider mt-1">
                      {subj.level}
                    </span>
                  </div>

                  {/* Bottom: Specs (Duration & Certificate) */}
                  <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-[var(--border-color)] text-[9px] app-theme-text-muted font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--text-color)]" />
                      <span>{subj.duration}</span>
                    </div>
                    {subj.hasCertificate && (
                      <div className="flex items-center gap-1" title="Sertifikat Tersedia">
                        <Award className="w-3 h-3 text-[var(--text-color)]" />
                        <span className="text-[var(--text-color)]">Cert</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </ProtectedCourse>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {visibleCount < subjects.length && (
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={handleLoadMore}
              className="app-theme-card hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-3 px-6 text-xs font-bold text-[var(--text-color)] transition-all active:scale-95 cursor-pointer shadow-md"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}
      </div>
    </motion.main>
  );
}
