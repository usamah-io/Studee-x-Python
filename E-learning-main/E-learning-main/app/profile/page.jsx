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
  X,
  Activity,
  Database,
  Terminal,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCourseData } from "../../lib/CourseDataContext";

export default function ProfilePage() {
  const router = useRouter();
  const { statsData, courseData } = useCourseData();
  const [activeTab, setActiveTab] = useState("feed"); // feed, challenge, badge
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("Pengguna Konsisten");
  const [userEmail, setUserEmail] = useState("@penggunakonsisten");
  const [userPicture, setUserPicture] = useState("");
  const [mounted, setMounted] = useState(false);

  // Secret Admin States
  const [subjectsList, setSubjectsList] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editPdfUrl, setEditPdfUrl] = useState("");
  const [isSavingSubject, setIsSavingSubject] = useState(false);
  const [systemLogs, setSystemLogs] = useState([
    { time: "10:45:22", type: "INFO", message: "Session active for admin@stry.com (Main Admin)" },
    { time: "10:43:10", type: "INFO", message: "API request - POST /api/subjects (updated course routing)" },
    { time: "10:39:15", type: "WARN", message: "Deprecated Next.js middleware format warning" },
    { time: "10:30:02", type: "INFO", message: "Database client successfully connected to MongoDB Atlas" },
    { time: "10:25:44", type: "INFO", message: "Route pre-fetching optimized for lesson players" },
    { time: "10:15:20", type: "INFO", message: "Server initialized on port 3000" },
    { time: "10:02:11", type: "INFO", message: "Log collection daemon initialized" },
    { time: "09:55:00", type: "INFO", message: "Routine maintenance checks completed: 0 errors" },
  ]);

  const [adminsList, setAdminsList] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPicture = localStorage.getItem("userPicture");

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
    if (storedPicture) setUserPicture(storedPicture);

    // Fetch authorized admins list from API
    fetch("/api/admins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const emails = data.map(item => item.email.toLowerCase());
          setAdminsList(emails);
          
          const currentEmail = storedEmail ? storedEmail.toLowerCase() : "";
          const hasAdminAccess = emails.includes(currentEmail) || currentEmail === "muhammadusamahabdurrahman@gmail.com" || localStorage.getItem("userRole") === "admin";
          setIsAdmin(hasAdminAccess);

          if (hasAdminAccess) {
            // Load courses/subjects for routing tool
            fetch("/api/subjects")
              .then((res) => res.json())
              .then((subjData) => {
                if (subjData && Array.isArray(subjData)) {
                  setSubjectsList(subjData);
                }
              })
              .catch((err) => console.error("Error loading subjects in profile:", err));
          }
        }
      })
      .catch((err) => {
        console.error("Error loading admins list:", err);
        // Fallback checks
        const fallbackAdmins = ["muhammadusamahabdurrahman@gmail.com", "admin@stry.com", "admin@example.com"];
        const currentEmail = storedEmail ? storedEmail.toLowerCase() : "";
        const hasAdminAccess = fallbackAdmins.includes(currentEmail) || localStorage.getItem("userRole") === "admin";
        setIsAdmin(hasAdminAccess);
      });
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
              <span className="text-sm font-black app-theme-text">
                {statsData 
                  ? (statsData.totalStudyTime >= 60 
                      ? `${(statsData.totalStudyTime / 60).toFixed(1)} Jam` 
                      : `${statsData.totalStudyTime} Min`) 
                  : "0 Min"}
              </span>
              <span className="text-[10px] app-theme-text-muted font-medium">
                Total Belajar
              </span>
            </div>
            <div className="h-3 border-l border-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-black app-theme-text">
                {courseData ? courseData.filter(c => c.progress === 100).length : 0}
              </span>
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
        {(() => {
          const isMainAdmin = userEmail && (adminsList.includes(userEmail.toLowerCase()) || userEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com" || isAdmin);
          const isSuperAdmin = userEmail && userEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com";
          
          const tabsList = ["feed", "challenge", "badge"];
          if (isMainAdmin) {
            tabsList.push("courses", "analytics", "logs");
          }
          if (isSuperAdmin) {
            tabsList.push("admins");
          }

          return (
            <div className="flex flex-wrap app-theme-card rounded-2xl p-1 gap-1 w-full mt-2">
              {tabsList.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-3 text-[10px] font-bold rounded-xl transition-all duration-300 ease-in-out cursor-pointer active:scale-95 capitalize ${
                    activeTab === tab
                      ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                      : "text-[var(--text-color)]/55 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {tab === "courses" ? "Courses" : tab === "logs" ? "Logs" : tab === "admins" ? "Admins" : tab}
                </button>
              ))}
            </div>
          );
        })()}

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

            {/* Tab: Courses (Manage Courses & Media Routing) */}
            {activeTab === "courses" && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full text-[var(--text-color)]"
              >
                <div className="p-4 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-2 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="text-xs font-black tracking-widest uppercase opacity-60 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> Manage Courses & Media
                  </h3>
                  <p className="text-[10px] app-theme-text-muted">Configure PDF documents and Video routing for student syllabus items.</p>
                </div>

                {subjectsList.map((subj) => (
                  <div
                    key={subj.id}
                    className="w-full p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold app-theme-text leading-tight">{subj.title}</span>
                        <span className="text-[9px] app-theme-text-muted mt-1 uppercase font-semibold tracking-wider">Kategori: {subj.category}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1 text-[10px] text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold opacity-60">Video:</span>
                        <span className="truncate opacity-80 font-mono text-[9px] max-w-[200px]">
                          {subj.videoUrl || "Tidak ada Video"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold opacity-60">PDF/Drive:</span>
                        <span className="truncate opacity-80 font-mono text-[9px] max-w-[200px]">
                          {subj.driveLink || "Tidak ada PDF"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingSubject(subj);
                        setEditTitle(subj.title);
                        setEditVideoUrl(subj.videoUrl || "");
                        setEditPdfUrl(subj.driveLink || "");
                      }}
                      className="mt-2 w-full py-2 bg-[var(--text-color)]/5 border border-[var(--border-color)] hover:bg-[var(--text-color)]/10 text-[var(--text-color)] rounded-xl text-[10px] font-bold transition-all cursor-pointer text-center"
                    >
                      Edit Routing
                    </button>
                  </div>
                ))}

                {/* Edit Routing Modal Overlay */}
                <AnimatePresence>
                  {editingSubject && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
                        onClick={() => setEditingSubject(null)}
                      />
                      <div className="fixed inset-x-6 top-1/2 -translate-y-1/2 mx-auto max-w-sm w-[90%] bg-white dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl z-50 flex flex-col gap-4 overflow-hidden backdrop-blur-xl text-slate-900 dark:text-white">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col text-left">
                            <h3 className="text-xs font-black uppercase tracking-wider">Edit Media Routing</h3>
                            <span className="text-[9px] opacity-50 font-semibold mt-0.5">{editTitle}</span>
                          </div>
                          <button
                            onClick={() => setEditingSubject(null)}
                            className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-2 text-left">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Video URL (YouTube / Embed)</label>
                            <input
                              type="text"
                              value={editVideoUrl}
                              onChange={(e) => setEditVideoUrl(e.target.value)}
                              placeholder="https://youtube.com/..."
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">PDF / Drive Link</label>
                            <input
                              type="text"
                              value={editPdfUrl}
                              onChange={(e) => setEditPdfUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner"
                            />
                          </div>

                          <button
                            onClick={() => {
                              setIsSavingSubject(true);
                              fetch("/api/subjects", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  id: editingSubject.id,
                                  title: editingSubject.title,
                                  description: editingSubject.description,
                                  category: editingSubject.category,
                                  driveLink: editPdfUrl,
                                  videoUrl: editVideoUrl,
                                  quizStatus: editingSubject.quizStatus,
                                  questions: editingSubject.questions,
                                  syllabus: editingSubject.syllabus
                                })
                              })
                              .then((res) => res.json())
                              .then((updatedSubj) => {
                                setIsSavingSubject(false);
                                if (updatedSubj && !updatedSubj.error) {
                                  alert("Media routing updated successfully!");
                                  setSubjectsList((prev) => prev.map((s) => s.id === updatedSubj.id ? updatedSubj : s));
                                  setEditingSubject(null);
                                } else {
                                  alert("Failed to update media routing.");
                                }
                              })
                              .catch((err) => {
                                setIsSavingSubject(false);
                                console.error(err);
                                alert("Error updating media routing.");
                              });
                            }}
                            disabled={isSavingSubject}
                            className="mt-2 w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black rounded-2xl py-3.5 text-xs font-black shadow-lg border border-black/10 dark:border-white/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            {isSavingSubject ? "Saving..." : "Save Routing"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Tab: Analytics (User & Student Analytics) */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full"
              >
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
              </motion.div>
            )}

            {/* Tab: Logs (Platform System Logs) */}
            {activeTab === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full"
              >
                <div className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col gap-3 shadow-xl">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" /> Platform Live Logs
                      </span>
                      <span className="text-[9px] app-theme-text-muted font-semibold mt-0.5">Real-time transaction events</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const now = new Date();
                          const timestamp = now.toTimeString().split(" ")[0];
                          const messages = [
                            "INFO: Successfully synced cache with MongoDB cluster",
                            "INFO: User activity log compiled",
                            "WARN: Slow API response on /api/user-dashboard (230ms)",
                            "INFO: Pre-rendering complete for dynamic lesson paths",
                            "INFO: GC run reclaimed 12MB memory"
                          ];
                          const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                          setSystemLogs((prev) => [
                            { time: timestamp, type: randomMsg.startsWith("WARN") ? "WARN" : "INFO", message: randomMsg },
                            ...prev
                          ]);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-[var(--text-color)]/5 border border-[var(--border-color)] text-[8px] font-bold hover:bg-[var(--text-color)]/10 text-[var(--text-color)] transition-all cursor-pointer"
                      >
                        Simulate
                      </button>
                      <button
                        onClick={() => setSystemLogs([])}
                        className="px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-[8px] font-bold hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Terminal console style */}
                  <div className="w-full max-h-[300px] overflow-y-auto bg-black/60 border border-[var(--border-color)] rounded-2xl p-4 font-mono text-[9px] text-white/80 select-none scrollbar-none flex flex-col gap-1.5">
                    {systemLogs.length > 0 ? (
                      systemLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2 leading-relaxed text-left">
                          <span className="text-white/40">[{log.time}]</span>
                          <span className={log.type === "WARN" ? "text-yellow-400 font-bold" : "text-white/60 font-bold"}>
                            {log.type}:
                          </span>
                          <span className="text-white/90">{log.message}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-white/30 italic">No system logs available. Click simulate to generate logs.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Admins (Manage Admins) - Super Admin Only */}
            {activeTab === "admins" && userEmail && userEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com" && (
              <motion.div
                key="admins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4 w-full text-[var(--text-color)]"
              >
                <div className="p-4 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-2 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
                  <h3 className="text-xs font-black tracking-widest uppercase opacity-60 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Manage Admins
                  </h3>
                  <p className="text-[10px] app-theme-text-muted">Register and authorize other admin accounts to manage course syllabi and routing.</p>
                </div>

                {/* Add Admin Form */}
                <div className="p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3.5 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Email Gmail Admin Baru</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="contoh@gmail.com"
                        className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner"
                      />
                      <button
                        onClick={() => {
                          if (!newAdminEmail || newAdminEmail.trim() === "") {
                            alert("Masukkan email admin.");
                            return;
                          }
                          setIsAddingAdmin(true);
                          fetch("/api/admins", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: newAdminEmail.trim() })
                          })
                          .then((res) => res.json())
                          .then((data) => {
                            setIsAddingAdmin(false);
                            if (data && !data.error) {
                              alert("Admin berhasil ditambahkan!");
                              setAdminsList(prev => [...prev, data.email.toLowerCase()]);
                              setNewAdminEmail("");
                            } else {
                              alert(data.error || "Gagal menambahkan admin.");
                            }
                          })
                          .catch((err) => {
                            setIsAddingAdmin(false);
                            console.error(err);
                            alert("Terjadi kesalahan.");
                          });
                        }}
                        disabled={isAddingAdmin}
                        className="px-4 py-3 bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-90 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        {isAddingAdmin ? "Menambahkan..." : "Tambah"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Admins List */}
                <div className="flex flex-col gap-3">
                  {adminsList.map((email, idx) => (
                    <div
                      key={idx}
                      className="w-full p-4 rounded-3xl app-theme-card relative overflow-hidden flex items-center justify-between shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold app-theme-text leading-none">{email}</span>
                        {email === "muhammadusamahabdurrahman@gmail.com" ? (
                          <span className="text-[7.5px] text-white/50 uppercase font-black tracking-widest mt-1">Super Admin / Founder</span>
                        ) : (
                          <span className="text-[7.5px] text-white/40 uppercase font-bold tracking-widest mt-1">Authorized Admin</span>
                        )}
                      </div>

                      {email !== "muhammadusamahabdurrahman@gmail.com" && (
                        <button
                          onClick={() => {
                            if (!confirm(`Hapus admin ${email}?`)) return;
                            fetch("/api/admins", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email })
                            })
                            .then((res) => res.json())
                            .then((data) => {
                              if (data && data.success) {
                                alert("Admin berhasil dihapus!");
                                setAdminsList(prev => prev.filter(e => e !== email));
                              } else {
                                alert(data.error || "Gagal menghapus admin.");
                              }
                            })
                            .catch((err) => {
                              console.error(err);
                              alert("Terjadi kesalahan.");
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-300 text-[9px] font-bold transition-all cursor-pointer active:scale-95 border border-red-500/20"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
