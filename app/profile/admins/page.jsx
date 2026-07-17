"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, User, Trash2, Plus } from "lucide-react";
import "../../../lib/i18n";

export default function AdminsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchAdmins();
  }, []);

  const fetchAdmins = () => {
    fetch("/api/admins")
      .then(res => res.json())
      .then(emails => {
        if (Array.isArray(emails)) {
          setAdminsList(emails);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteAdmin = (email) => {
    if (!email) return;
    if (email.toLowerCase() === "muhammadusamahabdurrahman@gmail.com") {
      alert("Super Admin tidak dapat dihapus.");
      return;
    }
    if (!confirm(`Hapus hak akses admin untuk ${email}?`)) return;

    fetch("/api/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          alert("Admin berhasil dihapus!");
          setAdminsList(prev => prev.filter(e => e !== email));
        } else {
          alert(data.error || "Gagal menghapus admin.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Terjadi kesalahan.");
      });
  };

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
            Manage Admins
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Add Admin Navigation Button */}
        <button
          onClick={() => router.push("/profile/admins/add")}
          className="w-full py-3.5 bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-90 rounded-2xl text-[10px] font-black tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tambah Admin Baru
        </button>

        {/* Admins List */}
        <div className="flex flex-col gap-3 w-full">
          <h4 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted text-left">Authorized Admin Accounts</h4>

          {loading ? (
            <div className="text-xs font-bold text-center app-theme-text-muted py-10">Memuat data admin...</div>
          ) : (
            <div className="flex flex-col gap-2.5 w-full">
              {adminsList.map((adminItem, idx) => {
                const adminEmail = typeof adminItem === "string" ? adminItem : adminItem.email || "";
                const isSuper = adminEmail.toLowerCase() === "muhammadusamahabdurrahman@gmail.com";
                return (
                  <div
                    key={idx}
                    className="w-full flex items-center justify-between p-4.5 rounded-2xl app-theme-card border border-white/5 bg-white/[0.01]"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <User className="w-4.5 h-4.5 text-[var(--text-color)]/70" />
                      </div>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-xs font-bold app-theme-text truncate">{adminEmail}</span>
                        <span className="text-[8px] app-theme-text-muted font-bold mt-1 uppercase tracking-wider">
                          {isSuper ? "Super Administrator" : "Administrator"}
                        </span>
                      </div>
                    </div>

                    {!isSuper && (
                      <button
                        onClick={() => handleDeleteAdmin(adminEmail)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all cursor-pointer"
                        title="Revoke Admin Access"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
