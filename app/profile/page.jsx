"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  Settings,
  CheckCircle,
} from "lucide-react";
import "../../lib/i18n";
import { useCourseData } from "../../lib/CourseDataContext";
import FaceScannerModal from "../../components/FaceScannerModal";

export default function ProfilePage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { statsData, courseData, hasFaceId, setHasFaceId } = useCourseData();
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("Pengguna Konsisten");
  const [userEmail, setUserEmail] = useState("@penggunakonsisten");
  const [userPicture, setUserPicture] = useState("");
  const [mounted, setMounted] = useState(false);
  const [adminsList, setAdminsList] = useState([]);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const sessionActive = sessionStorage.getItem("sessionActive") === "true";
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (loggedIn && !sessionActive) {
      localStorage.removeItem("isLoggedIn");
      document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
      return;
    }

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    const email = localStorage.getItem("userEmail") || "";
    const name = localStorage.getItem("userName") || "";
    const picture = localStorage.getItem("userPicture") || "";

    if (email) {
      setUserEmail(email);
      setUserName(name || email.split("@")[0]);
      setUserPicture(picture);
    }

    // Check if admin
    fetch("/api/admins")
      .then((res) => res.json())
      .then((emails) => {
        if (Array.isArray(emails)) {
          setAdminsList(emails);
          if (email && emails.map(e => (typeof e === "string" ? e : e.email || "").toLowerCase()).includes(email.toLowerCase())) {
            setIsAdmin(true);
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFaceRegisterSuccess = (data) => {
    setShowFaceScanner(false);
    setHasFaceId(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasFaceId", "true");
    }
  };

  const handleDeleteFaceID = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data Face ID Anda?")) return;
    try {
      const res = await fetch("/api/auth/face/register", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasFaceId(false);
        if (typeof window !== "undefined") {
          localStorage.setItem("hasFaceId", "false");
        }
        alert("Face ID berhasil dinonaktifkan.");
      } else {
        alert(data.error || "Gagal menonaktifkan Face ID.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-bold tracking-wider app-theme-text">
            {t("profile.title")}
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
                      ? `${(statsData.totalStudyTime / 60).toFixed(1)} ${i18n.language === "en" ? "Hrs" : "Jam"}` 
                      : `${statsData.totalStudyTime} Min`) 
                  : `0 ${i18n.language === "en" ? "Min" : "Min"}`}
              </span>
              <span className="text-[10px] app-theme-text-muted font-medium">
                {t("profile.totalLearning")}
              </span>
            </div>
            <div className="h-3 border-l border-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-black app-theme-text">
                {courseData ? courseData.filter(c => c.progress === 100).length : 0}
              </span>
              <span className="text-[10px] app-theme-text-muted font-medium">
                {t("profile.quizzesCompleted")}
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => router.push("/profile/edit")}
            className="mt-4.5 mb-2 w-full py-3.5 app-theme-card hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.06)] rounded-2xl text-xs font-bold text-[var(--text-color)] shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {t("profile.editProfile")}
          </button>
        </div>

        {/* Face ID Security Section */}
        <div className="w-full app-theme-card rounded-3xl p-5 shadow-lg border border-[var(--border-color)] relative overflow-hidden">
          <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 21h4m-2-3v3m-3-9a3 3 0 116 0 3 3 0 01-6 0zm-3 8h12a3 3 0 003-3V9a3 3 0 00-3-3H6a3 3 0 00-3 3v6a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-[var(--text-color)]">{t("profile.faceIdAuth")}</h4>
                <p className="text-[10px] app-theme-text-muted">
                  {hasFaceId ? t("profile.faceIdActive") : t("profile.faceIdInactive")}
                </p>
              </div>
            </div>
            {hasFaceId ? (
              <button
                type="button"
                onClick={handleDeleteFaceID}
                className="py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                {t("profile.btnDelete")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowFaceScanner(true)}
                className="py-2 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              >
                {t("profile.btnEnable")}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Link Menu */}
        {(() => {
          const isMainAdmin = userEmail && (adminsList.map(e => (typeof e === "string" ? e : e.email || "").toLowerCase()).includes(userEmail.toLowerCase()) || userEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com" || isAdmin);
          const isSuperAdmin = userEmail && userEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com";
          
          const menuList = [
            { id: "feed", label: t("profile.feed") || "Feed", path: "/profile/feed" },
            { id: "challenge", label: t("profile.challenge") || "Challenge", path: "/profile/challenge" },
            { id: "badge", label: t("profile.badge") || "Badge", path: "/profile/badge" }
          ];
          
          if (isMainAdmin) {
            menuList.push(
              { id: "courses", label: "Courses", path: "/profile/courses" },
              { id: "analytics", label: "Analytics", path: "/profile/analytics" },
              { id: "logs", label: "Logs", path: "/profile/logs" }
            );
          }
          if (isSuperAdmin) {
            menuList.push(
              { id: "admins", label: "Admins", path: "/profile/admins" }
            );
          }

          return (
            <div className="flex flex-col gap-3.5 w-full mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted text-left pl-1">Menu Navigasi</h4>
              <div className="flex flex-col gap-2.5 w-full">
                {menuList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.path)}
                    className="w-full flex items-center justify-between p-4.5 rounded-2xl app-theme-card border border-white/5 bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left"
                  >
                    <span className="text-xs font-bold app-theme-text">{item.label}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Face Scanner Modal Overlay */}
      {showFaceScanner && (
        <FaceScannerModal
          email={userEmail}
          userName={userName}
          onClose={() => setShowFaceScanner(false)}
          onSuccess={handleFaceRegisterSuccess}
        />
      )}
    </main>
  );
}
