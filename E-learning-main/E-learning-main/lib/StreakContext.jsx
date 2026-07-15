"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, Sparkles } from "lucide-react";

const StreakContext = createContext(undefined);

const defaultDays = [
  { name: "Min", active: true, min: "1" },
  { name: "Sen", active: true, min: "5" },
  { name: "Sel", active: false, min: "10", isToday: true },
  { name: "Rab", active: false, min: "20" },
  { name: "Kam", active: false, min: "30" },
  { name: "Jum", active: false, min: "40" },
  { name: "Sab", active: false, min: "50" },
];

export function StreakProvider({ children }) {
  const [streakData, setStreakData] = useState(defaultDays);
  const [totalStreak, setTotalStreak] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [modalStreakVal, setModalStreakVal] = useState(0);

  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem("studee_streak_data");
      if (savedData) {
        setStreakData(JSON.parse(savedData));
      }
      const savedStreak = localStorage.getItem("studee_total_streak");
      if (savedStreak) {
        setTotalStreak(parseInt(savedStreak, 10) || 2);
      }
    } catch (e) {
      console.error("Error loading streak data from localStorage", e);
    }
  }, []);

  React.useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const markAsCompleted = () => {
    const todayIndex = streakData.findIndex((day) => day.isToday);
    let newTotal = totalStreak;
    let updatedData = [...streakData];

    if (todayIndex !== -1 && !streakData[todayIndex].active) {
      updatedData[todayIndex] = {
        ...updatedData[todayIndex],
        active: true,
      };

      newTotal = totalStreak + 1;
      setStreakData(updatedData);
      setTotalStreak(newTotal);

      // Save to localStorage
      localStorage.setItem("studee_total_streak", newTotal.toString());
      localStorage.setItem("studee_streak_data", JSON.stringify(updatedData));
    }

    // Connect to database directly by POSTing to API
    try {
      const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
      if (email) {
        fetch("/api/user-dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, duration: 30 })
        }).catch(err => console.error("Error saving log to db:", err));
      }
    } catch (e) {
      console.error("Gagal menyimpan log belajar ke DB:", e);
    }

    // Trigger streak celebration modal
    setModalStreakVal(newTotal);
    setShowModal(true);
  };

  return (
    <StreakContext.Provider
      value={{ streakData, totalStreak, markAsCompleted }}
    >
      {children}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-black/90 dark:bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-[0_0_40px_rgba(255,255,255,0.15)] flex flex-col items-center gap-6 relative overflow-hidden z-10"
            >
              {/* Decorative sparkles in background */}
              <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />

              {/* Close Button 'X' */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Sparkle Icons floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8], y: [-10, -30, -50] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.5 }}
                className="absolute left-8 top-12 text-white/30"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8], y: [-5, -25, -45] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                className="absolute right-8 top-16 text-white/30"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>

              {/* Flame Icon with beautiful animated scales, shockwave and floating embers */}
              <div className="relative mt-4 flex items-center justify-center w-36 h-36">
                {/* Big monochrome glowing aura halo background */}
                <div className="absolute w-44 h-44 bg-white/10 rounded-full blur-[40px] animate-pulse pointer-events-none z-0" />
                
                {/* Shockwave expanding circle */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-20 h-20 rounded-full border border-white/20 pointer-events-none z-0"
                />

                {/* Floating embers/sparkles rising */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 15, scale: 0.5, opacity: 0 }}
                    animate={{
                      x: [0, (i % 2 === 0 ? 25 : -25) * Math.random(), (i % 3 === 0 ? 10 : -10)],
                      y: [15, -70 - Math.random() * 50],
                      scale: [0.6, 1.4, 0.4],
                      opacity: [0, 0.9, 0]
                    }}
                    transition={{
                      duration: 2.0 + Math.random() * 1.5,
                      repeat: Infinity,
                      delay: i * 0.35,
                      ease: "easeOut"
                    }}
                    className="absolute w-1.5 h-1.5 bg-white/70 rounded-full blur-[0.3px] pointer-events-none z-0"
                  />
                ))}

                {/* Main Flame Card Container */}
                <motion.div
                  initial={{ scale: 0.3, rotate: -25, opacity: 0 }}
                  animate={{ scale: [1.3, 0.95, 1], rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 120, delay: 0.1 }}
                  className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shadow-lg relative z-10"
                >
                  <Flame className="w-10 h-10 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                </motion.div>
              </div>

              {/* Text Streak */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none">
                  Streak Konsistensi
                </span>
                
                <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2 font-outfit mt-1">
                  <span>{modalStreakVal}</span>
                  <span className="text-xl font-bold uppercase tracking-wider text-white/60">
                    Hari!
                  </span>
                </h2>
                
                <p className="text-xs text-white/60 font-medium leading-relaxed max-w-[240px] mx-auto mt-2">
                  Luar biasa! Konsistensi belajar Anda hari ini telah diperpanjang. Teruskan journey belajarmu!
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-white text-black hover:bg-white/90 rounded-2xl py-3.5 px-4 text-xs font-black tracking-wider transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.15)] mt-2"
              >
                LANJUT BELAJAR
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
}
