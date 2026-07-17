"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Database, Video, Plus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../lib/i18n";

export default function CoursesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // States for subjects list and live class settings
  const [subjectsList, setSubjectsList] = useState([]);
  const [liveClassInputLink, setLiveClassInputLink] = useState("");
  const [isSavingLiveLink, setIsSavingLiveLink] = useState(false);

  // Create course states
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDesc, setNewCourseDesc] = useState("");
  const [newCourseCat, setNewCourseCat] = useState("Science");
  const [newCourseLevel, setNewCourseLevel] = useState("Beginner");
  const [newCourseVideoUrl, setNewCourseVideoUrl] = useState("");
  const [newCourseDriveLink, setNewCourseDriveLink] = useState("");
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch courses
    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSubjectsList(data);
      })
      .catch(err => console.error(err));

    // Fetch live class link
    fetch("/api/live-class")
      .then(res => res.json())
      .then(data => {
        if (data && data.link) setLiveClassInputLink(data.link);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseDesc) {
      alert("Judul dan Deskripsi kelas wajib diisi.");
      return;
    }

    setIsCreatingCourse(true);
    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newCourseTitle,
        desc: newCourseDesc,
        category: newCourseCat,
        level: newCourseLevel,
        videoUrl: newCourseVideoUrl,
        driveLink: newCourseDriveLink,
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsCreatingCourse(false);
        if (data && !data.error) {
          alert("Mata pelajaran baru berhasil ditambahkan!");
          setSubjectsList(prev => [...prev, data]);
          setNewCourseTitle("");
          setNewCourseDesc("");
          setNewCourseVideoUrl("");
          setNewCourseDriveLink("");
          setShowAddCourseForm(false);
        } else {
          alert(data.error || "Gagal menambahkan mata pelajaran.");
        }
      })
      .catch(err => {
        setIsCreatingCourse(false);
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
            Manage Courses
          </span>
          <div className="w-10 h-10" />
        </div>

        {/* Live Class Settings */}
        <div className="p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3.5 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
          <h4 className="text-xs font-black uppercase tracking-wider opacity-70 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-[var(--text-color)]" /> Link Live Class (Webinar Mingguan)
          </h4>
          <p className="text-[9px] app-theme-text-muted -mt-1">Masukkan tautan Google Meet atau Zoom untuk kelas live minggu ini.</p>
          
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={liveClassInputLink}
              onChange={(e) => setLiveClassInputLink(e.target.value)}
              placeholder="https://meet.google.com/... atau https://zoom.us/..."
              className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all"
            />
            <button
              onClick={() => {
                if (!liveClassInputLink || liveClassInputLink.trim() === "") {
                  alert("Masukkan link live class.");
                  return;
                }
                setIsSavingLiveLink(true);
                fetch("/api/live-class", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ link: liveClassInputLink.trim() })
                })
                .then(res => res.json())
                .then(data => {
                  setIsSavingLiveLink(false);
                  if (data && !data.error) {
                    alert("Link Live Class berhasil diperbarui!");
                  } else {
                    alert(data.error || "Gagal memperbarui link.");
                  }
                })
                .catch(err => {
                  setIsSavingLiveLink(false);
                  console.error(err);
                  alert("Terjadi kesalahan.");
                });
              }}
              disabled={isSavingLiveLink}
              className="px-4 py-3 bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-90 rounded-2xl text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSavingLiveLink ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Add Course Toggle */}
        <button
          onClick={() => setShowAddCourseForm(!showAddCourseForm)}
          className="w-full py-3.5 bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-90 rounded-2xl text-[10px] font-black tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {showAddCourseForm ? "Tutup Form Tambah Kelas" : "+ Tambah Pelajaran Baru"}
        </button>

        {/* Add Course Form */}
        {showAddCourseForm && (
          <div className="p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-4 shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md text-left">
            <h4 className="text-xs font-black uppercase tracking-wider opacity-70">Tambah Pelajaran Baru</h4>
            
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Judul Kelas</label>
              <input
                type="text"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="cth: Struktur Sel & Fungsi Organel"
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:ring-1"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Deskripsi Ringkas</label>
              <textarea
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                placeholder="Membahas struktur sel eukariotik dan prokariotik..."
                rows="3"
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none focus:ring-1 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Kategori (Mapel)</label>
                <select
                  value={newCourseCat}
                  onChange={(e) => setNewCourseCat(e.target.value)}
                  className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none text-[var(--text-color)]"
                >
                  <option value="Science">Science (IPA)</option>
                  <option value="Math">Math (Matematika)</option>
                  <option value="Coding">Coding (Komputer)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Level Kesulitan</label>
                <select
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value)}
                  className="bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none text-[var(--text-color)]"
                >
                  <option value="Beginner">Beginner (Pemula)</option>
                  <option value="Intermediate">Intermediate (Menengah)</option>
                  <option value="Expert">Expert (Mahir)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Link URL Video Utama (Opsional)</label>
              <input
                type="text"
                value={newCourseVideoUrl}
                onChange={(e) => setNewCourseVideoUrl(e.target.value)}
                placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest opacity-60 pl-1">Link PDF/Drive Buku Panduan (Opsional)</label>
              <input
                type="text"
                value={newCourseDriveLink}
                onChange={(e) => setNewCourseDriveLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 px-4 text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleCreateCourse}
              disabled={isCreatingCourse}
              className="mt-2 w-full bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-95 rounded-2xl py-3.5 text-xs font-black shadow-lg border border-[var(--border-color)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isCreatingCourse ? "Memproses..." : "Tambah Kelas Baru"}
            </button>
          </div>
        )}

        {/* Subjects List */}
        <div className="flex flex-col gap-4 w-full">
          {subjectsList.map((subj) => (
            <div
              key={subj.id}
              onClick={() => router.push(`/profile/courses/${subj.id}`)}
              className="w-full p-5 rounded-3xl app-theme-card relative overflow-hidden flex items-center justify-between shadow-xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-extrabold app-theme-text leading-tight">{subj.title}</h4>
                <span className="text-[9px] app-theme-text-muted uppercase font-semibold tracking-wider">
                  Kategori: {subj.category} • {subj.level || "Beginner"}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold mt-1">
                  Syllabus: {subj.syllabus ? subj.syllabus.length : 0} items
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
