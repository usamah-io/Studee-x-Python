"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import "../../../../../lib/i18n";

export default function DeleteCoursePage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSubject();
  }, [id]);

  const fetchSubject = () => {
    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find(s => String(s.id) === String(id));
          if (found) setSubject(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDeleteSubject = () => {
    if (!subject) return;
    setIsDeleting(true);

    fetch("/api/subjects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: subject.id })
    })
      .then((res) => res.json())
      .then((data) => {
        setIsDeleting(false);
        if (data && data.success) {
          alert("Mata pelajaran berhasil dihapus!");
          router.push("/profile/courses");
        } else {
          alert(data.error || "Gagal menghapus mata pelajaran.");
        }
      })
      .catch((err) => {
        setIsDeleting(false);
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
            onClick={() => router.push(`/profile/courses/${id}`)}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Hapus Kelas
          </span>
          <div className="w-10 h-10" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Memuat detail kelas...</div>
        ) : !subject ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Kelas tidak ditemukan.</div>
        ) : (
          <div className="w-full p-6 rounded-3xl app-theme-card relative overflow-hidden flex flex-col items-center gap-5 shadow-xl border border-red-500/20 bg-red-500/[0.01] backdrop-blur-md text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-black uppercase tracking-wider text-red-500">Konfirmasi Hapus Kelas</h3>
              <p className="text-xs font-bold app-theme-text mt-1">{subject.title}</p>
            </div>

            <p className="text-[10px] app-theme-text-muted leading-relaxed font-semibold">
              Tindakan ini permanen. Seluruh silabus materi, video link, media routing, serta kuis kuesioner yang terkait dengan kelas ini akan dihapus secara permanen dari basis data MongoDB.
            </p>

            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => router.push(`/profile/courses/${id}`)}
                className="flex-1 py-3.5 bg-[var(--text-color)]/5 border border-[var(--border-color)] hover:bg-[var(--text-color)]/10 text-[var(--text-color)] rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={handleDeleteSubject}
                disabled={isDeleting}
                className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Kelas"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
