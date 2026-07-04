"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Bell, Globe, LogOut, Database, Settings } from "lucide-react";
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

  useEffect(() => {
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

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[130px] pointer-events-none" />

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
          <div className="w-full flex items-center justify-between p-4 rounded-2xl app-theme-card shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-650 dark:text-purple-300">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
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
                notificationsPaused ? "bg-purple-500" : "bg-black/10 dark:bg-white/10"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                notificationsPaused ? "translate-x-4" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* Language Selection */}
          <div 
            onClick={() => setIsLanguageModalOpen(true)}
            className="w-full flex items-center justify-between p-4 rounded-2xl app-theme-card hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-650 dark:text-purple-300">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{t("settings.language")}</span>
                <span className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5">{getLanguageLabel()}</span>
              </div>
            </div>
            
            <span className="text-[10px] text-purple-600 dark:text-purple-300 font-bold">{i18n.language === "en" ? "Change" : "Ubah"}</span>
          </div>



          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-in-out cursor-pointer shadow-sm mt-4 text-red-600 dark:text-red-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                <LogOut className="w-4.5 h-4.5 text-red-650 dark:text-red-400" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
          >
            <div className="max-w-xs w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-center w-full pb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t("settings.languageModalTitle")}</h3>
                  <span className="text-[9px] text-slate-500 dark:text-white/40 font-semibold mt-0.5">{t("settings.languageModalDesc")}</span>
                </div>
                <button 
                  onClick={() => setIsLanguageModalOpen(false)}
                  className="text-slate-450 hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70 transition-colors p-1 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                      ? "bg-purple-50 dark:bg-purple-600/10 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-200"
                      : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Bahasa Indonesia</span>
                  {i18n.language === "id" && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-md">Aktif</span>}
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
                      ? "bg-purple-50 dark:bg-purple-600/10 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-200"
                      : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-700 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>English (US)</span>
                  {i18n.language === "en" && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-md">Active</span>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
