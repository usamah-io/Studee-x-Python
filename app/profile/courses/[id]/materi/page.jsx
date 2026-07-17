"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Trash2, Layers } from "lucide-react";
import "../../../../../lib/i18n";

export default function ManageSyllabusPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newMateriTitle, setNewMateriTitle] = useState("");
  const [newMateriDuration, setNewMateriDuration] = useState("15 Menit");
  const [isSavingSyllabus, setIsSavingSyllabus] = useState(false);

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

  const handleAddSyllabusMateri = (e) => {
    e.preventDefault();
    if (!newMateriTitle || !newMateriTitle.trim()) {
      alert("Masukkan judul materi.");
      return;
    }
    setIsSavingSyllabus(true);

    const updatedSyllabus = [
      ...(subject.syllabus || []),
      { title: newMateriTitle.trim(), duration: newMateriDuration }
    ];

    fetch("/api/subjects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: subject.id,
        syllabus: updatedSyllabus
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsSavingSyllabus(false);
        if (data && !data.error) {
          alert("Materi baru berhasil ditambahkan!");
          setSubject(data);
          setNewMateriTitle("");
        } else {
          alert("Gagal menambahkan materi.");
        }
      })
      .catch(err => {
        setIsSavingSyllabus(false);
        console.error(err);
        alert("Terjadi kesalahan.");
      });
  };

  const handleDeleteSyllabusMateri = (indexToDelete) => {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;

    const updatedSyllabus = (subject.syllabus || []).filter((_, idx) => idx !== indexToDelete);

    fetch("/api/subjects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: subject.id,
        syllabus: updatedSyllabus
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          alert("Materi berhasil dihapus!");
          setSubject(data);
        } else {
          alert("Gagal menghapus materi.");
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
            onClick={() => router.push(`/profile/courses/${id}`)}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Kelola Materi
          </span>
          <div className="w-10 h-10" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Memuat materi...</div>
        ) : !subject ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Kelas tidak ditemukan.</div>
        ) : (
          <div className="flex flex-col gap-5 w-full">
            {/* Class info banner */}
            <div className="w-full p-4 rounded-2xl app-theme-card text-left flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black app-theme-text leading-tight">{subject.title}</span>
                <span className="text-[8px] app-theme-text-muted mt-1 uppercase font-bold tracking-wider">Silabus Materi Pelajaran</span>
              </div>
            </div>

            {/* Add syllabus item form */}
            <div className="p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3.5 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
              <h4 className="text-xs font-black uppercase tracking-wider opacity-70">+ Tambah Materi Baru</h4>
              
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Judul Materi</label>
                <input
                  type="text"
                  value={newMateriTitle}
                  onChange={(e) => setNewMateriTitle(e.target.value)}
                  placeholder="cth: Pengenalan Mitokondria"
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Estimasi Waktu Belajar</label>
                <select
                  value={newMateriDuration}
                  onChange={(e) => setNewMateriDuration(e.target.value)}
                  className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none text-[var(--text-color)]"
                >
                  <option value="5 Menit">5 Menit</option>
                  <option value="10 Menit">10 Menit</option>
                  <option value="15 Menit">15 Menit</option>
                  <option value="20 Menit">20 Menit</option>
                  <option value="30 Menit">30 Menit</option>
                </select>
              </div>

              <button
                onClick={handleAddSyllabusMateri}
                disabled={isSavingSyllabus}
                className="mt-1 w-full bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-95 rounded-2xl py-3 text-xs font-black transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSavingSyllabus ? "Menyimpan..." : "Tambah Materi"}
              </button>
            </div>

            {/* List of current syllabus materials */}
            <div className="flex flex-col gap-3 w-full">
              <h4 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted text-left">Daftar Materi Terdaftar</h4>
              
              <div className="flex flex-col gap-2.5 w-full">
                {subject.syllabus && subject.syllabus.length > 0 ? (
                  subject.syllabus.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-full flex items-center justify-between p-4.5 rounded-2xl app-theme-card border border-white/5 bg-white/[0.01]"
                    >
                      <div className="flex flex-col text-left max-w-[240px]">
                        <span className="text-xs font-bold app-theme-text truncate">
                          <span className="opacity-50 mr-1.5 font-extrabold">{idx + 1}.</span>
                          {item.title}
                        </span>
                        <span className="text-[9px] app-theme-text-muted mt-1 font-semibold">{item.duration}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSyllabusMateri(idx)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all cursor-pointer"
                        title="Hapus Materi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs italic opacity-40">Belum ada materi pelajaran.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
