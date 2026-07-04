"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Settings,
  Flame,
  CheckCircle,
  GraduationCap,
  FlaskConical,
  Code,
  Globe,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("feed"); // feed, challenge, badge
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("Pengguna Konsisten");
  const [userEmail, setUserEmail] = useState("@penggunakonsisten");
  const [userPicture, setUserPicture] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    setIsAdmin(localStorage.getItem("userRole") === "admin");
    
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPicture = localStorage.getItem("userPicture");

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedPicture) setUserPicture(storedPicture);
  }, []);

  if (!mounted) {
    return null;
  }

  const feeds = [
    {
      id: 1,
      subject: "Science (IPA)",
      activity: "Selesai menyelesaikan modul Struktur Sel Hewan dan Tumbuhan",
      streak: 5,
      time: "1 jam yang lalu",
      icon: <FlaskConical className="w-5 h-5 text-black dark:text-white" />,
    },
    {
      id: 2,
      subject: "Matematika",
      activity: "Menyelesaikan Kuis Aljabar Linear tingkat Menengah",
      streak: 3,
      time: "4 jam yang lalu",
      icon: <GraduationCap className="w-5 h-5 text-black dark:text-white" />,
    },
    {
      id: 3,
      subject: "Coding",
      activity: "Membuat aplikasi kalkulator interaktif menggunakan React",
      streak: 8,
      time: "Kemarin",
      icon: <Code className="w-5 h-5 text-black dark:text-white" />,
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "7-Day Code Warrior",
      description:
        "Tulis kode / selesaikan materi coding selama 7 hari berturut-turut.",
      progress: 71, // 5 of 7 days
      daysCompleted: 5,
      totalDays: 7,
    },
    {
      id: 2,
      title: "Math Genius Elite",
      description:
        "Selesaikan 3 buah kuis Matematika dengan skor sempurna 100%.",
      progress: 66, // 2 of 3 quizzes
      daysCompleted: 2,
      totalDays: 3,
    },
  ];

  const badges = [
    {
      id: 1,
      name: "Fast Learner",
      desc: "Selesaikan materi di bawah 15 menit",
      icon: <GraduationCap className="w-6 h-6 text-black dark:text-white" />,
    },
    {
      id: 2,
      name: "Streak Master",
      desc: "Pertahankan 5 hari streak belajar",
      icon: <Flame className="w-6 h-6 text-black dark:text-white" />,
    },
    {
      id: 3,
      name: "Quiz Conqueror",
      desc: "Dapatkan skor 100% pada kuis pertama",
      icon: <Award className="w-6 h-6 text-black dark:text-white" />,
    },
    {
      id: 4,
      name: "Global Explorer",
      desc: "Mulai kelas lintas kategori mapel",
      icon: <Globe className="w-6 h-6 text-black dark:text-white" />,
    },
  ];

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

          <span className="text-sm font-bold tracking-wider app-theme-text">
            My Profile
          </span>

          <button
            onClick={() => router.push("/profile/settings")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Social-Style Header */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Avatar frame */}
          <div className="w-24 h-24 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center border border-black/10 dark:border-white/20 shadow-2xl mb-4 relative overflow-hidden">
            {userPicture ? (
              <img 
                src={userPicture} 
                alt={userName} 
                className="w-full h-full object-cover rounded-full border-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg
                className="w-12 h-12 text-[var(--text-color)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-black dark:bg-white border border-[var(--border-color)] rounded-full flex items-center justify-center shadow-lg z-10">
              <CheckCircle className="w-4 h-4 text-white dark:text-black fill-none" />
            </div>
          </div>

          {/* Verified Name */}
          <div className="flex items-center gap-1.5 justify-center">
            <h2 className="text-2xl font-extrabold app-theme-text tracking-tight leading-none">
              {userName}
            </h2>
            <CheckCircle className="w-5 h-5 text-[var(--text-color)] fill-none" />
          </div>
          <span className="text-xs app-theme-text-muted font-semibold mt-1.5">
            {userEmail}
          </span>

          {/* Learning Progress Stats */}
          <div className="flex items-center gap-6 mt-5 app-theme-card rounded-full px-6 py-2.5 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black app-theme-text">154 Jam</span>
              <span className="text-[10px] app-theme-text-muted font-medium">
                Total Belajar
              </span>
            </div>
            <div className="h-3 border-l border-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-black app-theme-text">85</span>
              <span className="text-[10px] app-theme-text-muted font-medium">
                Quiz Selesai
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => router.push("/profile/edit")}
            className="mt-4.5 mb-2 w-full py-3.5 app-theme-card hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] rounded-2xl text-xs font-bold text-[var(--text-color)] shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex app-theme-card rounded-2xl p-1 gap-1 w-full mt-2">
          {["feed", "challenge", "badge"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all duration-300 ease-in-out cursor-pointer active:scale-95 capitalize ${
                activeTab === tab
                  ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                  : "text-[var(--text-color)]/55 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mt-2 min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* Tab: Feed */}
            {activeTab === "feed" && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full"
              >
                {feeds.map((feed) => (
                  <div
                    key={feed.id}
                    className="w-full p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 shadow-xl hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/10 flex items-center justify-center"
                        >
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
              </motion.div>
            )}

            {/* Tab: Challenge */}
            {activeTab === "challenge" && (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full"
              >
                {challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="w-full p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 shadow-xl hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start w-full">
                      <h4 className="text-xs font-bold app-theme-text tracking-tight leading-tight">
                        {challenge.title}
                      </h4>
                      <span className="text-[9px] app-theme-text font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
                        {challenge.daysCompleted}/{challenge.totalDays} Selesai
                      </span>
                    </div>

                    <p className="text-[11px] app-theme-text-muted leading-relaxed font-medium -mt-1">
                      {challenge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1.5 w-full mt-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold app-theme-text-muted">
                        <span>Penyelesaian</span>
                        <span className="app-theme-text">{challenge.progress}%</span>
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden border border-black/5 dark:border-white/5">
                        <div
                          className="h-full bg-black dark:bg-white rounded-full"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab: Badge */}
            {activeTab === "badge" && (
              <motion.div
                key="badge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-4 w-full"
              >
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="app-theme-card rounded-3xl p-4.5 flex flex-col items-center text-center justify-between min-h-[140px] shadow-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] transition-all duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center border border-black/5 dark:border-white/10 shadow-lg"
                    >
                      {badge.icon}
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <h4 className="text-[11px] font-bold app-theme-text leading-tight">
                        {badge.name}
                      </h4>
                      <span className="text-[9px] app-theme-text-muted font-medium leading-tight">
                        {badge.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
