"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Layers, Cpu, Edit3, Trash2 } from "lucide-react";
import "../../../../lib/i18n";

export default function CourseDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
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
  }, [id]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push("/profile/courses")}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Detail Kelas
          </span>
          <div className="w-10 h-10" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Memuat detail kelas...</div>
        ) : !subject ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Kelas tidak ditemukan.</div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {/* Course Summary Card */}
            <div className="w-full p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3.5 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
              <div className="flex flex-col">
                <span className="text-xs font-black app-theme-text leading-tight">{subject.title}</span>
                <span className="text-[9px] app-theme-text-muted mt-1.5 uppercase font-semibold tracking-wider">
                  Kategori: {subject.category} • {subject.level || "Beginner"}
                </span>
              </div>
              <p className="text-[10px] app-theme-text-muted leading-relaxed font-semibold">
                {subject.description || "Tidak ada deskripsi."}
              </p>
            </div>

            {/* Actions Grid */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted text-left">Opsi Tindakan Kelas</h4>
              
              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Action 1: Kelola Materi */}
                <button
                  onClick={() => router.push(`/profile/courses/${id}/materi`)}
                  className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 flex flex-col items-center gap-2.5 text-center shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">Kelola Materi</span>
                </button>

                {/* Action 2: Kelola Kuis */}
                <button
                  onClick={() => router.push(`/profile/courses/${id}/kuis`)}
                  className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 flex flex-col items-center gap-2.5 text-center shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">Kelola Kuis</span>
                </button>

                {/* Action 3: Edit Detail */}
                <button
                  onClick={() => router.push(`/profile/courses/${id}/edit`)}
                  className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 flex flex-col items-center gap-2.5 text-center shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">Edit Detail</span>
                </button>

                {/* Action 4: Hapus Kelas */}
                <button
                  onClick={() => router.push(`/profile/courses/${id}/delete`)}
                  className="p-4.5 rounded-3xl app-theme-card border border-white/5 bg-white/[0.01] hover:bg-black/5 dark:hover:bg-white/5 flex flex-col items-center gap-2.5 text-center shadow-lg transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-500">Hapus Kelas</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
