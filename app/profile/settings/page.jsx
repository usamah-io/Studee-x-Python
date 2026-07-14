"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, Globe, LogOut, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "../../../lib/i18n";
 
export default function SettingsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  // Toggles
  const [notificationsPaused, setNotificationsPaused] = useState(false);
 
  // Language modal state
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("userRole") === "admin");
    }
  }, []);
 
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPicture");
      document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    alert(i18n.language === "en" ? "Successfully logged out!" : "Berhasil keluar akun!");
    router.push("/");
  };
 
  const getLanguageLabel = () => {
    return i18n.language === "en" ? "English (US)" : "Bahasa Indonesia";
  };
 
  if (!mounted) {
    return null;
  }
 
  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Monochrome Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/3 blur-[130px] pointer-events-none" />
 
      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/5 dark:border-white/15 rounded-xl flex items-center justify-center text-slate-800 dark:text-white transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800 dark:text-white/90" />
          </button>
          
          <span className="text-sm font-bold tracking-wider text-slate-900 dark:text-white/90">{t("settings.title")}</span>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
 
        {/* Options List */}
        <div className="flex flex-col gap-3 mt-4">
          
          {/* Pause Notifications Toggle */}
          <div className="w-full flex items-center justify-between p-4 rounded-2xl app-theme-card shadow-sm border border-black/5 dark:border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-slate-800 dark:text-white">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{t("settings.pauseNotifications")}</span>
                <span className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5">
                  {i18n.language === "en" ? "Temporarily halt push updates" : "Hentikan sementara pemberitahuan"}
                </span>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button 
              onClick={() => setNotificationsPaused(!notificationsPaused)}
              className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
                notificationsPaused ? "bg-black dark:bg-white" : "bg-black/10 dark:bg-white/10"
              }`}
            >
              <div className={`w-5 h-5 rounded-full shadow-md transition-all duration-300 ${
                notificationsPaused 
                  ? "translate-x-4 bg-white dark:bg-black" 
                  : "translate-x-0 bg-white"
              }`} />
            </button>
          </div>
 
          {/* Language Selection */}
          <div 
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl app-theme-card hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm border border-black/5 dark:border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 flex items-center justify-center text-slate-800 dark:text-white">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{t("settings.language")}</span>
                <span className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5">{getLanguageLabel()}</span>
              </div>
            </div>
            
            <span className="text-[10px] text-slate-800 dark:text-white/80 font-bold">{i18n.language === "en" ? "Change" : "Ubah"}</span>
          </div>
 
          {/* Log Out Button - Clean Monochrome Style */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-in-out cursor-pointer shadow-sm mt-4 text-slate-800 dark:text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
                <LogOut className="w-4.5 h-4.5 text-slate-800 dark:text-white" />
              </div>
              <span className="text-xs font-bold">{t("settings.logOut")}</span>
            </div>
          </button>
 
        </div>
 
      </div>
 
      {/* Language Selection Modal */}
      <AnimatePresence>
        {isLanguageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center px-6"
          >
            <div className="max-w-xs w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden text-slate-900 dark:text-white">
              
              <div className="flex justify-between items-center w-full pb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex flex-col text-left">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t("settings.languageModalTitle")}</h3>
                  <span className="text-[9px] text-slate-500 dark:text-white/40 font-semibold mt-0.5">{t("settings.languageModalDesc")}</span>
                </div>
                <button 
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70 transition-colors p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
 
              {/* Language Options */}
              <div className="flex flex-col gap-2.5">
                {/* Bahasa Indonesia */}
                <button
                  onClick={() => {
                    i18n.changeLanguage("id");
                    localStorage.setItem("studee_language", "id");
                    setIsLanguageModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center cursor-pointer ${
                    i18n.language === "id"
                      ? "bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-slate-900 dark:text-white"
                      : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Bahasa Indonesia</span>
                  {i18n.language === "id" && <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-md">Aktif</span>}
                </button>
 
                {/* English */}
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    localStorage.setItem("studee_language", "en");
                    setIsLanguageModalOpen(false);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center cursor-pointer ${
                    i18n.language === "en"
                      ? "bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/20 text-slate-900 dark:text-white"
                      : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>English (US)</span>
                  {i18n.language === "en" && <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-md">Active</span>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
