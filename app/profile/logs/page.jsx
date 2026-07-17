"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Terminal, Search, RefreshCw } from "lucide-react";
import "../../../lib/i18n";

export default function LogsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    const now = new Date();
    const timestamp = now.toTimeString().split(" ")[0];
    const messages = [
      "INFO: Successfully synced cache with MongoDB cluster",
      "INFO: User activity log compiled",
      "WARN: Slow API response on /api/user-dashboard (230ms)",
      "INFO: Pre-rendering complete for dynamic lesson paths",
      "INFO: GC run reclaimed 12MB memory",
      "ERROR: MongoDB connection timeout (retrying...)"
    ];
    const chosen = messages[Math.floor(Math.random() * messages.length)];
    const type = chosen.startsWith("ERROR") ? "ERROR" : chosen.startsWith("WARN") ? "WARN" : "INFO";
    const cleanMsg = chosen.substring(chosen.indexOf(":") + 1).trim();

    setSystemLogs(prev => [
      { time: timestamp, type, message: cleanMsg },
      ...prev.slice(0, 15)
    ]);
  };

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "ALL" || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
            Platform System Logs
          </span>
          <button
            onClick={handleRefresh}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-3 w-full">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner text-[var(--text-color)]"
            />
          </div>

          <div className="flex app-theme-card rounded-2xl p-1 gap-1 w-full">
            {["ALL", "INFO", "WARN", "ERROR"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 py-1.5 text-[9px] font-extrabold rounded-xl transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${
                  filterType === type
                    ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-[0_0_15px_rgba(255,255,255,0.12)]"
                    : "text-[var(--text-color)]/55 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Logs terminal box */}
        <div className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-black dark:bg-black/40 backdrop-blur-md flex flex-col gap-3 shadow-xl">
          <div className="flex items-center gap-1.5 flex-shrink-0 text-left border-b border-white/10 pb-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Live Transaction Stream</span>
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-[9px] text-left max-h-[400px] overflow-y-auto pr-1">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start leading-relaxed border-b border-white/5 pb-2">
                  <span className="text-slate-500 font-semibold flex-shrink-0">[{log.time}]</span>
                  <span className={`font-black flex-shrink-0 ${
                    log.type === "ERROR" ? "text-red-500" : log.type === "WARN" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {log.type}:
                  </span>
                  <span className="text-slate-300 font-medium break-all">{log.message}</span>
                </div>
              ))
            ) : (
              <div className="text-center italic text-slate-500 py-10">No matching logs found.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
