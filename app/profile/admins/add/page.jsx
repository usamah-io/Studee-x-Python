"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, UserPlus } from "lucide-react";
import "../../../../lib/i18n";

export default function AddAdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.trim()) {
      alert("Masukkan email admin.");
      return;
    }

    setIsAddingAdmin(true);
    fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newAdminEmail.trim().toLowerCase() })
    })
      .then(res => res.json())
      .then(data => {
        setIsAddingAdmin(false);
        if (data && !data.error) {
          alert("Admin berhasil ditambahkan!");
          router.push("/profile/admins");
        } else {
          alert(data.error || "Gagal menambahkan admin.");
        }
      })
      .catch(err => {
        setIsAddingAdmin(false);
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
            onClick={() => router.push("/profile/admins")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Tambah Admin
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Add Admin Form */}
        <div className="p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-4 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
          <h4 className="text-xs font-black uppercase tracking-wider opacity-70 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-[var(--text-color)]" /> Daftarkan Akun Admin Baru
          </h4>
          <p className="text-[10px] app-theme-text-muted -mt-1">
            Akun admin baru akan diberikan akses penuh untuk mengelola modul kuis, membuat silabus materi pelajaran, dan mengubah setting live class.
          </p>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Email Gmail Admin Baru</label>
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner text-[var(--text-color)]"
            />
          </div>

          <button
            onClick={handleAddAdmin}
            disabled={isAddingAdmin}
            className="mt-2 w-full bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-95 rounded-2xl py-3.5 text-xs font-black transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isAddingAdmin ? "Memproses..." : "Daftarkan Admin"}
          </button>
        </div>
      </div>
    </main>
  );
}
