"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit3 } from "lucide-react";
import "../../../../../lib/i18n";

export default function EditCoursePage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCat, setEditCat] = useState("Science");
  const [editLevel, setEditLevel] = useState("Beginner");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editPdfUrl, setEditPdfUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
          if (found) {
            setSubject(found);
            setEditTitle(found.title || "");
            setEditDesc(found.description || "");
            setEditCat(found.category || "Science");
            setEditLevel(found.level || "Beginner");
            setEditVideoUrl(found.videoUrl || "");
            setEditPdfUrl(found.driveLink || "");
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleUpdateSubject = (e) => {
    e.preventDefault();
    if (!editTitle || !editDesc) {
      alert("Judul dan Deskripsi kelas wajib diisi.");
      return;
    }

    setIsSaving(true);
    const payload = {
      id: subject.id,
      title: editTitle,
      description: editDesc,
      category: editCat,
      level: editLevel,
      videoUrl: editVideoUrl,
      driveLink: editPdfUrl,
      quizStatus: subject.quizStatus,
      questions: subject.questions,
      syllabus: subject.syllabus
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setIsSaving(false);
        if (data && !data.error) {
          alert("Media routing updated successfully!");
          router.push(`/profile/courses/${id}`);
        } else {
          alert("Failed to update media routing.");
        }
      })
      .catch(err => {
        setIsSaving(false);
        console.error(err);
        alert("Error updating media routing.");
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
            Edit Detail Kelas
          </span>
          <div className="w-10 h-10" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Memuat detail kelas...</div>
        ) : !subject ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Kelas tidak ditemukan.</div>
        ) : (
          <div className="p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-4 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
            <h4 className="text-xs font-black uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" /> Sunting Detail Kelas
            </h4>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Judul Kelas</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-1 text-[var(--text-color)]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Deskripsi Ringkas</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows="3"
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-1 resize-none text-[var(--text-color)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Kategori (Mapel)</label>
                <select
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none text-[var(--text-color)]"
                >
                  <option value="Science">Science (IPA)</option>
                  <option value="Math">Math (Matematika)</option>
                  <option value="Coding">Coding (Komputer)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Level Kesulitan</label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none text-[var(--text-color)]"
                >
                  <option value="Beginner">Beginner (Pemula)</option>
                  <option value="Intermediate">Intermediate (Menengah)</option>
                  <option value="Expert">Expert (Mahir)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Link URL Video Utama</label>
              <input
                type="text"
                value={editVideoUrl}
                onChange={(e) => setEditVideoUrl(e.target.value)}
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none text-[var(--text-color)]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Link PDF/Drive Buku Panduan</label>
              <input
                type="text"
                value={editPdfUrl}
                onChange={(e) => setEditPdfUrl(e.target.value)}
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none text-[var(--text-color)]"
              />
            </div>

            <button
              onClick={handleUpdateSubject}
              disabled={isSaving}
              className="mt-2 w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black rounded-2xl py-3.5 text-xs font-black shadow-lg border border-black/10 dark:border-white/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
