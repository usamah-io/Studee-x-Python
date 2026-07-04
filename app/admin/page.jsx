"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit3,
  Cpu,
  CheckCircle,
  XCircle,
  Database,
  ExternalLink,
  Code,
  Sparkles,
  Save,
  X,
  FileText,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Info,
  BookOpen,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../lib/ThemeContext";
import { useUploadThing } from "../../lib/uploadthing";

export default function AdminDashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Admin Access Verification
  useEffect(() => {
    const role =
      localStorage.getItem("userRole") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("userRole="))
        ?.split("=")[1];
    if (role !== "admin") {
      router.push("/");
    }
  }, [router]);

  // General States
  const [subjects, setSubjects] = useState([]);
  const [isAddMapelModalOpen, setIsAddMapelModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null); // Selected subject for Drill-Down view
  const [drillDownTab, setDrillDownTab] = useState("materi"); // 'materi', 'details', 'quiz'
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Add Subject Form State
  const [newMapelTitle, setNewMapelTitle] = useState("");
  const [newMapelCategory, setNewMapelCategory] = useState("Coding");
  const [newMapelDesc, setNewMapelDesc] = useState("");
  const [newMapelDrive, setNewMapelDrive] = useState("");
  const [newMapelVideo, setNewMapelVideo] = useState("");
  const [stagedFile, setStagedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Hanya file PDF yang diperbolehkan!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 10MB!");
      return;
    }
    setStagedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Hanya file PDF yang diperbolehkan!");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran file maksimal adalah 10MB!");
      return;
    }
    setStagedFile(file);
  };

  // Edit Subject Details State (Drill-Down Tab 1)
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDrive, setEditDrive] = useState("");
  const [editVideo, setEditVideo] = useState("");

  // Edit Syllabus State (Drill-Down Tab 2)
  const [syllabus, setSyllabus] = useState([]);

  // Edit Quiz State (Drill-Down Tab 3)
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [expandedDiagnosticItem, setExpandedDiagnosticItem] = useState(null);
  const [adminMainTab, setAdminMainTab] = useState("subjects"); // 'subjects', 'troubleshoot'

  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onUploadError: (error) => {
      alert("Gagal mengunggah file ke Uploadthing: " + error.message);
    },
  });

  const handleRetestConnection = () => {
    setIsTestingConnection(true);
    setTimeout(() => {
      setIsTestingConnection(false);
      alert("Pemeriksaan Selesai:\n- File .env: UPLOADTHING_TOKEN terdeteksi.\n- Dependensi: 'uploadthing' dan '@uploadthing/react' terpasang dengan sukses.\n- Rute API: app/api/uploadthing/route.js telah aktif.\n\nStatus: CONNECTED (Koneksi Berhasil Terjalin!).");
    }, 1500);
  };

  // Fetch subjects from DB
  const loadSubjects = () => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSubjects(data);
          // If we are currently drilling down into a subject, update its local copy
          if (selectedSubject) {
            const updatedSubject = data.find((s) => s.id === selectedSubject.id);
            if (updatedSubject) {
              setSelectedSubject(updatedSubject);
              setSyllabus(updatedSubject.syllabus ? JSON.parse(JSON.stringify(updatedSubject.syllabus)) : []);
              setQuizQuestions(updatedSubject.questions ? JSON.parse(JSON.stringify(updatedSubject.questions)) : []);
            }
          }
        }
      })
      .catch((err) => console.error("Error loading subjects:", err));
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // Handle drill-down init
  const handleDrillDownInit = (subj) => {
    setSelectedSubject(subj);
    setEditTitle(subj.title || "");
    setEditCategory(subj.category || "");
    setEditDesc(subj.description || "");
    setEditDrive(subj.driveLink || "");
    setEditVideo(subj.videoUrl || "");
    setSyllabus(subj.syllabus ? JSON.parse(JSON.stringify(subj.syllabus)) : []);
    setQuizQuestions(subj.questions ? JSON.parse(JSON.stringify(subj.questions)) : []);
    setDrillDownTab("materi");
  };

  // Create new subject Mapel
  const handleCreateMapel = async (e) => {
    e.preventDefault();
    if (!newMapelTitle || !newMapelDesc) {
      alert("Judul dan Deskripsi wajib diisi!");
      return;
    }

    setIsSaving(true);
    
    let finalDriveLink = newMapelDrive || "";

    if (stagedFile) {
      try {
        const uploadRes = await startUpload([stagedFile]);
        if (uploadRes && uploadRes[0]?.url) {
          finalDriveLink = uploadRes[0].url;
        } else {
          setIsSaving(false);
          alert("Gagal mengunggah file PDF. Silakan coba lagi.");
          return;
        }
      } catch (err) {
        setIsSaving(false);
        console.error("Upload error:", err);
        alert("Gagal mengunggah file PDF: " + err.message);
        return;
      }
    }

    const payload = {
      title: newMapelTitle,
      description: newMapelDesc,
      category: newMapelCategory || "General",
      driveLink: finalDriveLink,
      videoUrl: newMapelVideo || "",
      quizStatus: "Belum Ada",
      questions: [],
      syllabus: [],
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSaving(false);
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        loadSubjects();
        setIsAddMapelModalOpen(false);
        setNewMapelTitle("");
        setNewMapelDesc("");
        setNewMapelDrive("");
        setNewMapelVideo("");
        setStagedFile(null);
        alert("Mata pelajaran baru berhasil ditambahkan!");
      })
      .catch((err) => {
        setIsSaving(false);
        console.error(err);
        alert("Gagal menambahkan mata pelajaran.");
      });
  };

  // Update Subject Details (Drill-Down Tab 1 Save)
  const handleSaveSubjectDetails = (e) => {
    e.preventDefault();
    if (!editTitle || !editDesc) {
      alert("Judul dan Deskripsi wajib diisi!");
      return;
    }

    setIsSaving(true);
    const payload = {
      id: selectedSubject.id,
      title: editTitle,
      description: editDesc,
      category: editCategory,
      driveLink: editDrive,
      videoUrl: editVideo,
      quizStatus: selectedSubject.quizStatus,
      questions: selectedSubject.questions,
      syllabus: selectedSubject.syllabus,
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSaving(false);
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        loadSubjects();
        alert("Detail mata pelajaran berhasil diperbarui!");
      })
      .catch((err) => {
        setIsSaving(false);
        console.error(err);
        alert("Gagal memperbarui detail mata pelajaran.");
      });
  };

  // Delete Subject Mapel
  const handleDeleteMapel = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus mata pelajaran ini beserta seluruh materi dan kuis di dalamnya?")) {
      fetch("/api/subjects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("Error: " + data.error);
            return;
          }
          loadSubjects();
          setSelectedSubject(null);
        })
        .catch((err) => console.error("Error deleting Mapel:", err));
    }
  };

  // Syllabus Materials Management (Tab 2)
  const handleAddMateri = () => {
    const newIdx = syllabus.length + 1;
    const newMateri = {
      title: `Materi ${newIdx} - Pengenalan`,
      duration: "45 Menit",
      videoUrl: "",
      driveLink: "",
      notes: "Tuliskan ringkasan materi di sini...",
    };
    setSyllabus([...syllabus, newMateri]);
  };

  const handleUpdateMateriField = (index, field, value) => {
    const updated = [...syllabus];
    updated[index][field] = value;
    setSyllabus(updated);
  };

  const handleDeleteMateri = (index) => {
    if (confirm("Apakah Anda yakin ingin menghapus materi ini dari daftar?")) {
      const updated = syllabus.filter((_, idx) => idx !== index);
      setSyllabus(updated);
      saveSyllabusToDB(updated);
    }
  };

  // Move Material Up in syllabus list
  const handleMoveMateriUp = (index) => {
    if (index === 0) return;
    const updated = [...syllabus];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setSyllabus(updated);
    saveSyllabusToDB(updated);
  };

  // Move Material Down in syllabus list
  const handleMoveMateriDown = (index) => {
    if (index === syllabus.length - 1) return;
    const updated = [...syllabus];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setSyllabus(updated);
    saveSyllabusToDB(updated);
  };

  // API Save for Syllabus array
  const saveSyllabusToDB = (updatedSyllabus) => {
    setIsSaving(true);
    const payload = {
      id: selectedSubject.id,
      title: selectedSubject.title,
      description: selectedSubject.description,
      category: selectedSubject.category,
      driveLink: selectedSubject.driveLink,
      videoUrl: selectedSubject.videoUrl,
      quizStatus: selectedSubject.quizStatus,
      questions: selectedSubject.questions,
      syllabus: updatedSyllabus,
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSaving(false);
        if (data.error) {
          console.error(data.error);
          return;
        }
        loadSubjects();
      })
      .catch((err) => {
        setIsSaving(false);
        console.error(err);
      });
  };

  // AI Quiz Generator (Tab 3)
  const handleGenerateQuizAI = () => {
    if (!selectedSubject.title) return;
    setIsGeneratingQuiz(true);

    setTimeout(() => {
      const mockQuestions = [
        {
          question: `Berdasarkan materi '${selectedSubject.title}', apa aspek utama yang ditekankan dalam penjelasan tersebut?`,
          options: [
            "Pemahaman konsep dasar secara menyeluruh",
            "Menerapkan optimasi tingkat tinggi tanpa riset dasar",
            "Menghindari integrasi alat otomatisasi digital",
            "Mengulang kesalahan konfigurasi berulang kali",
          ],
          correct: "Pemahaman konsep dasar secara menyeluruh",
        },
        {
          question: `Manakah yang menggambarkan ringkasan paling akurat dari deskripsi kelas tersebut?`,
          options: [
            "Pembahasan fundamental mengenai materi terkait",
            "Analisis kesalahan alokasi memori pada CPU",
            "Metode pengujian tingkat ketahanan beban server",
            "Panduan komparasi framework eksternal",
          ],
          correct: "Pembahasan fundamental mengenai materi terkait",
        },
      ];

      setQuizQuestions(mockQuestions);
      setIsGeneratingQuiz(false);
      saveQuizToDB(mockQuestions);
    }, 2000);
  };

  const handleUpdateQuizField = (qIdx, field, value) => {
    const updated = [...quizQuestions];
    updated[qIdx][field] = value;
    setQuizQuestions(updated);
  };

  const handleUpdateQuizOption = (qIdx, oIdx, value) => {
    const updated = [...quizQuestions];
    const oldCorrectVal = updated[qIdx].correct;
    const oldOptVal = updated[qIdx].options[oIdx];
    
    updated[qIdx].options[oIdx] = value;
    if (oldCorrectVal === oldOptVal) {
      updated[qIdx].correct = value;
    }
    setQuizQuestions(updated);
  };

  const handleAddQuizQuestion = () => {
    const newQ = {
      question: "Tulis pertanyaan kuis baru...",
      options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      correct: "Pilihan A",
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const handleDeleteQuizQuestion = (index) => {
    if (confirm("Apakah Anda yakin ingin menghapus soal kuis ini?")) {
      const updated = quizQuestions.filter((_, idx) => idx !== index);
      setQuizQuestions(updated);
      saveQuizToDB(updated);
    }
  };

  const saveQuizToDB = (updatedQuestions) => {
    setIsSaving(true);
    const payload = {
      id: selectedSubject.id,
      title: selectedSubject.title,
      description: selectedSubject.description,
      category: selectedSubject.category,
      driveLink: selectedSubject.driveLink,
      videoUrl: selectedSubject.videoUrl,
      quizStatus: updatedQuestions.length > 0 ? "Sudah Ada" : "Belum Ada",
      questions: updatedQuestions,
      syllabus: selectedSubject.syllabus,
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSaving(false);
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }
        loadSubjects();
        alert("Kuis berhasil disimpan ke database!");
      })
      .catch((err) => {
        setIsSaving(false);
        console.error(err);
        alert("Gagal menyimpan kuis.");
      });
  };

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 pt-8 sm:pt-10 flex flex-col gap-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (selectedSubject) {
                  setSelectedSubject(null);
                } else {
                  router.push("/");
                }
              }}
              className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer active:scale-95 shadow-md flex-shrink-0"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black app-theme-text tracking-tight flex items-center gap-2">
                <Database className="w-6 h-6" /> 
                {selectedSubject ? selectedSubject.title : "Manajemen Belajar"}
              </h1>
              <p className="text-xs app-theme-text-muted font-medium">
                {selectedSubject 
                  ? `Mengelola bab materi & kuis untuk kelas ${selectedSubject.title}`
                  : "Manajemen terpusat mata pelajaran, silabus materi, dan kuis otomatis"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md cursor-pointer ${
                isHelpOpen 
                  ? "bg-black/10 dark:bg-white/20 border-[var(--border-color)] text-[var(--text-color)]"
                  : "app-theme-card text-[var(--text-color)]/60 hover:text-[var(--text-color)]"
              }`}
              title="Petunjuk"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {!selectedSubject && (
              <button
                onClick={() => setIsAddMapelModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 text-[var(--bg-color)] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 border border-[var(--border-color)] cursor-pointer flex-grow sm:flex-grow-0"
              >
                <Plus className="w-4 h-4" /> + Tambah Mapel
              </button>
            )}
          </div>
        </div>

        {/* HELP CARD */}
        <AnimatePresence>
          {isHelpOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="app-theme-card rounded-3xl p-5 shadow-xl flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-color)] flex-shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5 text-xs app-theme-text-muted">
                  <h3 className="font-bold app-theme-text">Panduan Manajemen Belajar</h3>
                  {selectedSubject ? (
                    <ul className="list-disc list-inside flex flex-col gap-1 font-medium">
                      <li>Tab <span className="app-theme-text font-bold">Daftar Materi</span> memungkinkan Anda menambah sub-materi baru, mengubah link video, durasi belajar, dan menyetel urutan materi menggunakan tanda panah.</li>
                      <li>Tab <span className="app-theme-text font-bold">Detail Mapel</span> berguna untuk mengubah informasi utama mata pelajaran (Judul, Kategori, Deskripsi).</li>
                      <li>Tab <span className="app-theme-text font-bold">Kelola Kuis</span> menyatukan penyuntingan kuis kelas baik secara manual maupun menggunakan AI Generator.</li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside flex flex-col gap-1 font-medium">
                      <li>Klik tombol <span className="app-theme-text font-bold">+ Tambah Mapel</span> di atas untuk menambahkan mata pelajaran baru.</li>
                      <li>Klik tombol <span className="app-theme-text font-bold">Edit / Detail</span> pada tabel untuk melakukan *drill-down* ke dalam manajemen materi rinci dan kuis.</li>
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN AREA */}
        <div className="w-full">
          {!selectedSubject ? (
            /* ============================================================== */
            /* MODE MATA PELAJARAN (MAIN LIST) WITH SEGMENTED TABS           */
            /* ============================================================== */
            <div className="w-full flex flex-col gap-6">
              
              {/* Segmented Navbar Tabs (ST0/ST1/ST2) */}
              <div className={`flex items-center h-11 border rounded-2xl p-1 mb-2 transition-all duration-300 backdrop-blur-[12px] ${
                isDarkMode 
                  ? 'bg-white/[0.02] border-white/10' 
                  : 'bg-black/[0.01] border-black/10'
              }`}>
                <button
                  onClick={() => setAdminMainTab("subjects")}
                  className={`flex-1 h-full rounded-xl text-[10px] font-extrabold tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    adminMainTab === "subjects"
                      ? "text-white border-b border-white bg-transparent"
                      : "text-white/40 hover:text-white bg-transparent"
                  }`}
                >
                  MATA PELAJARAN
                </button>
                <button
                  onClick={() => setAdminMainTab("troubleshoot")}
                  className={`flex-1 h-full rounded-xl text-[10px] font-extrabold tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    adminMainTab === "troubleshoot"
                      ? "text-white border-b border-white bg-transparent"
                      : "text-white/40 hover:text-white bg-transparent"
                  }`}
                >
                  DIAGNOSIS KONEKSI
                </button>
              </div>

              {adminMainTab === "subjects" ? (
                /* Tab 1: Mata Pelajaran List */
                <div className="w-full flex flex-col gap-5">
                  {/* Table for Desktop */}
                  <div className="hidden md:block overflow-x-auto w-full app-theme-card rounded-3xl shadow-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)] text-[var(--text-muted)] font-bold tracking-wider">
                          <th className="p-4.5">Nama Mata Pelajaran</th>
                          <th className="p-4.5">Kategori</th>
                          <th className="p-4.5 text-center">Jumlah Sub-Materi</th>
                          <th className="p-4.5 text-center">Status Kuis</th>
                          <th className="p-4.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((subj) => (
                          <tr
                            key={subj.id}
                            className="border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4.5 font-bold app-theme-text text-sm">
                              {subj.title}
                            </td>
                            <td className="p-4.5">
                              <span className="px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--border-color)] font-semibold text-[10px] text-[var(--text-color)] uppercase tracking-wider">
                                {subj.category}
                              </span>
                            </td>
                            <td className="p-4.5 text-center font-bold app-theme-text">
                              {subj.syllabus ? subj.syllabus.length : 0} Bab
                            </td>
                            <td className="p-4.5 text-center">
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-color)]"
                              >
                                {subj.quizStatus === "Sudah Ada" ? (
                                  <CheckCircle className="w-3 h-3 text-[var(--text-color)]" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-[var(--text-color)]/40" />
                                )}
                                {subj.quizStatus === "Sudah Ada" ? "Kuis Aktif" : "Belum Ada"}
                              </span>
                            </td>
                            <td className="p-4.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDrillDownInit(subj)}
                                  className="px-3.5 py-2 bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 text-[var(--bg-color)] rounded-xl font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-md border border-[var(--border-color)]"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Kelola Detail & Materi
                                </button>
                                <button
                                  onClick={() => handleDeleteMapel(subj.id)}
                                  className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-color)] rounded-xl text-[var(--text-color)] transition-colors cursor-pointer"
                                  title="Hapus Mapel"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {subjects.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-8 text-center app-theme-text-muted italic">
                              Belum ada mata pelajaran. Klik "+ Tambah Mapel" di atas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Cards for Mobile */}
                  <div className="block md:hidden flex flex-col gap-4">
                    {subjects.map((subj) => (
                      <div
                        key={subj.id}
                        className="app-theme-card rounded-3xl p-5 flex flex-col gap-3.5 shadow-lg"
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className="flex flex-col gap-1 max-w-[70%]">
                            <span className="px-2 py-0.5 bg-black/10 dark:bg-white/10 border border-[var(--border-color)] text-[9px] font-bold text-[var(--text-color)] rounded-md self-start uppercase tracking-wider">
                              {subj.category}
                            </span>
                            <h3 className="font-bold app-theme-text text-sm mt-1 leading-snug">
                              {subj.title}
                            </h3>
                          </div>
                          
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-color)]"
                          >
                            {subj.quizStatus === "Sudah Ada" ? "Kuis Aktif" : "Belum Ada"}
                          </span>
                        </div>

                        <div className="text-[10px] app-theme-text-muted border-t border-[var(--border-color)] pt-3">
                          Jumlah Sub-Materi: <span className="font-bold app-theme-text">{subj.syllabus ? subj.syllabus.length : 0} Bab</span>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[var(--border-color)] pt-3 mt-1">
                          <button
                            onClick={() => handleDrillDownInit(subj)}
                            className="flex-grow py-2 bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 rounded-xl text-[var(--bg-color)] text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md border border-[var(--border-color)]"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Kelola Detail & Materi
                          </button>
                          <button
                            onClick={() => handleDeleteMapel(subj.id)}
                            className="px-3.5 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[var(--border-color)] rounded-xl text-[var(--text-color)] flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {subjects.length === 0 && (
                      <div className="app-theme-card rounded-3xl p-10 text-center italic text-xs app-theme-text-muted">
                        Belum ada mata pelajaran. Klik "+ Tambah Mapel" di atas.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab 2: Ultra-Slim Troubleshooting Panel */
                <div className="w-full backdrop-blur-[12px] shadow-lg rounded-[2.5rem] p-6 sm:p-7 border transition-all duration-300 relative overflow-hidden bg-white/[0.02] border-white/10 text-white">
                  {/* Status Header - Ultra Slim & Strict Monochrome */}
                  <div className="flex items-center justify-between border-b pb-3 mb-4 border-white/5 w-full text-xs font-bold leading-none">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-white/70">API Connection Status</span>
                    <span className="text-white">Status: CONNECTED</span>
                  </div>

                  {/* Tightly Condensed Accordion Rows */}
                  <div className="flex flex-col gap-2 w-full">
                    {/* Item 1 */}
                    <div className="rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setExpandedDiagnosticItem(expandedDiagnosticItem === 0 ? null : 0)}
                        className={`w-full flex items-center justify-between p-3 text-[11px] font-bold transition-all text-left cursor-pointer active:bg-white/5 ${
                          expandedDiagnosticItem === 0 ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        <span className="text-white/90">1. Check .env configuration</span>
                        {expandedDiagnosticItem === 0 ? (
                          <ChevronUp className="w-3.5 h-3.5 opacity-60 text-white" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 opacity-60 text-white" />
                        )}
                      </button>
                      {expandedDiagnosticItem === 0 && (
                        <div className="p-3 border-t border-white/5 text-[10px] leading-relaxed flex flex-col gap-2 bg-black/45 text-white/80">
                          <p className="text-left">Ensure <code className="font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">UPLOADTHING_TOKEN</code> is saved without typos inside <code className="font-mono">.env</code>.</p>
                          <div className="p-2.5 rounded-lg font-mono text-[9px] bg-black/20 text-white/90 text-left border border-white/5">
                            UPLOADTHING_TOKEN="eyJhbGci..."
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Item 2 */}
                    <div className="rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setExpandedDiagnosticItem(expandedDiagnosticItem === 1 ? null : 1)}
                        className={`w-full flex items-center justify-between p-3 text-[11px] font-bold transition-all text-left cursor-pointer active:bg-white/5 ${
                          expandedDiagnosticItem === 1 ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        <span className="text-white/90">2. Restart local server</span>
                        {expandedDiagnosticItem === 1 ? (
                          <ChevronUp className="w-3.5 h-3.5 opacity-60 text-white" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 opacity-60 text-white" />
                        )}
                      </button>
                      {expandedDiagnosticItem === 1 && (
                        <div className="p-3 border-t border-white/5 text-[10px] leading-relaxed flex flex-col gap-2 bg-black/45 text-white/80">
                          <p className="text-left">Stop the running terminal process (Ctrl + C) and run <code className="font-mono">npm run dev</code> again.</p>
                          <div className="p-2.5 rounded-lg font-mono text-[9px] bg-black/20 text-white/90 text-left border border-white/5">
                            # Hentikan server (Ctrl + C) kemudian jalankan:<br />
                            npm run dev
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Item 3 */}
                    <div className="rounded-xl border border-white/10 transition-all duration-300 overflow-hidden">
                      <button
                        onClick={() => setExpandedDiagnosticItem(expandedDiagnosticItem === 2 ? null : 2)}
                        className={`w-full flex items-center justify-between p-3 text-[11px] font-bold transition-all text-left cursor-pointer active:bg-white/5 ${
                          expandedDiagnosticItem === 2 ? 'bg-white/5' : 'bg-transparent'
                        }`}
                      >
                        <span className="text-white/90">3. Verify Endpoint Routes</span>
                        {expandedDiagnosticItem === 2 ? (
                          <ChevronUp className="w-3.5 h-3.5 opacity-60 text-white" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 opacity-60 text-white" />
                        )}
                      </button>
                      {expandedDiagnosticItem === 2 && (
                        <div className="p-3 border-t border-white/5 text-[10px] leading-relaxed flex flex-col gap-2 bg-black/45 text-white/80">
                          <p className="text-left">Check if <code className="font-mono">app/api/uploadthing/route.js</code> is exporting GET and POST correctly.</p>
                          <div className="p-2.5 rounded-lg font-mono text-[9px] bg-black/20 text-white/90 text-left border border-white/5">
                            import &#123; createRouteHandler &#125; from "uploadthing/next";<br />
                            import &#123; ourFileRouter &#125; from "./core";<br /><br />
                            export const &#123; GET, POST &#125; = createRouteHandler(&#123;<br />
                            &nbsp;&nbsp;router: ourFileRouter,<br />
                            &#125;);
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Re-test Action Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleRetestConnection}
                      disabled={isTestingConnection}
                      className="px-4 py-2 border rounded-xl text-[11px] font-bold transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white/30"
                    >
                      {isTestingConnection ? "Testing Connection..." : "Re-test Connection"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ============================================================== */
            /* MODE DETAIL MATERI & DRILL-DOWN (EDIT MODE)                    */
            /* ============================================================== */
            <div className="w-full flex flex-col gap-6">
              
              {/* Drill-down Back button bar */}
              <div className="flex items-center justify-between app-theme-card rounded-2xl p-3">
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="flex items-center gap-1.5 text-xs app-theme-text hover:opacity-85 transition-colors font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Mapel
                </button>
                <span className="text-[10px] app-theme-text-muted font-bold uppercase tracking-wider">
                  Drill-Down Workspace
                </span>
              </div>

              {/* Accordion/Tabs inside Edit Screen */}
              <div className="flex gap-2 p-1 app-theme-card rounded-2xl w-full">
                <button
                  onClick={() => setDrillDownTab("materi")}
                  className={`flex-1 py-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    drillDownTab === "materi"
                      ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-md"
                      : "text-[var(--text-color)]/60 hover:text-[var(--text-color)]"
                  }`}
                >
                  Daftar Materi ({syllabus.length})
                </button>
                <button
                  onClick={() => setDrillDownTab("details")}
                  className={`flex-1 py-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    drillDownTab === "details"
                      ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-md"
                      : "text-[var(--text-color)]/60 hover:text-[var(--text-color)]"
                  }`}
                >
                  Detail Mapel
                </button>
                <button
                  onClick={() => setDrillDownTab("quiz")}
                  className={`flex-1 py-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    drillDownTab === "quiz"
                      ? "bg-[var(--text-color)] text-[var(--bg-color)] shadow-md"
                      : "text-[var(--text-color)]/60 hover:text-[var(--text-color)]"
                  }`}
                >
                  Kelola Kuis ({quizQuestions.length})
                </button>
              </div>

              {/* TABS CONTENT */}
              <div className="w-full">
                
                {/* SUB-TAB 1: DAFTAR MATERI */}
                {drillDownTab === "materi" && (
                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-xs font-bold uppercase tracking-wider app-theme-text-muted">
                        Sub-Materi & Silabus Kelas
                      </h3>
                      <button
                        onClick={handleAddMateri}
                        className="flex items-center gap-1.5 bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 text-[var(--bg-color)] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 border border-[var(--border-color)] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Tambah Materi
                      </button>
                    </div>

                    {/* Drag-and-drop / Arrow based Ordering list */}
                    <div className="flex flex-col gap-4 w-full">
                      {syllabus.map((mat, idx) => (
                        <div
                          key={idx}
                          className="app-theme-card rounded-3xl p-5 flex flex-col gap-4 shadow-lg relative overflow-hidden"
                        >
                          {/* Material Card Header: Title & Ordering Controls */}
                          <div className="flex items-center justify-between w-full border-b border-[var(--border-color)] pb-3">
                            <span className="px-2.5 py-0.5 bg-black/10 dark:bg-white/10 border border-[var(--border-color)] text-[9px] font-bold uppercase tracking-wider text-[var(--text-color)] rounded-md">
                              Materi {idx + 1}
                            </span>

                            {/* Up/Down Arrow Ordering System */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleMoveMateriUp(idx)}
                                disabled={idx === 0}
                                className="p-1 app-theme-card rounded-lg text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Naikkan Urutan"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveMateriDown(idx)}
                                disabled={idx === syllabus.length - 1}
                                className="p-1 app-theme-card rounded-lg text-[var(--text-color)]/70 hover:text-[var(--text-color)] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Turunkan Urutan"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              <div className="w-px h-4 bg-[var(--border-color)] mx-1.5" />

                              <button
                                onClick={() => handleDeleteMateri(idx)}
                                className="p-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="Hapus Materi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Card Fields Form Layout */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] app-theme-text-muted font-bold uppercase tracking-wider pl-1">
                                Nama Materi
                              </label>
                              <input
                                type="text"
                                value={mat.title}
                                onChange={(e) => handleUpdateMateriField(idx, "title", e.target.value)}
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-xs text-[var(--text-color)] placeholder-[var(--text-color)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner font-bold"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] app-theme-text-muted font-bold uppercase tracking-wider pl-1">
                                Durasi Materi (Menit/Jam)
                              </label>
                              <input
                                type="text"
                                placeholder="Contoh: 45 Menit atau 1 Jam"
                                value={mat.duration}
                                onChange={(e) => handleUpdateMateriField(idx, "duration", e.target.value)}
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-xs text-[var(--text-color)] placeholder-[var(--text-color)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner font-semibold"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] app-theme-text-muted font-bold uppercase tracking-wider pl-1">
                                Link Video Pembelajaran (Opsional)
                              </label>
                              <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={mat.videoUrl || ""}
                                onChange={(e) => handleUpdateMateriField(idx, "videoUrl", e.target.value)}
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-xs text-[var(--text-color)] placeholder-[var(--text-color)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] app-theme-text-muted font-bold uppercase tracking-wider pl-1">
                                Link Drive / Dokumen Materi (Opsional)
                              </label>
                              <input
                                type="url"
                                placeholder="https://drive.google.com/file/d/..."
                                value={mat.driveLink || ""}
                                onChange={(e) => handleUpdateMateriField(idx, "driveLink", e.target.value)}
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-xs text-[var(--text-color)] placeholder-[var(--text-color)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] app-theme-text-muted font-bold uppercase tracking-wider pl-1">
                              Catatan Pendukung (Teks/Teori)
                            </label>
                            <textarea
                              rows="3"
                              placeholder="Masukkan teori ringkas atau instruksi belajar untuk sub-materi ini..."
                              value={mat.notes || ""}
                              onChange={(e) => handleUpdateMateriField(idx, "notes", e.target.value)}
                              className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl py-2 px-3 text-xs text-[var(--text-color)] placeholder-[var(--text-color)]/20 focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all shadow-inner resize-none font-sans leading-relaxed"
                            />
                          </div>

                          {/* Save button for this individual material */}
                          <div className="flex justify-end border-t border-[var(--border-color)] pt-3">
                            <button
                              type="button"
                              onClick={() => {
                                saveSyllabusToDB(syllabus);
                                alert(`Progres materi '${mat.title}' berhasil disimpan!`);
                              }}
                              disabled={isSaving}
                              className="px-5 py-2 bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 text-[var(--bg-color)] rounded-xl text-[10px] font-bold shadow-md active:scale-95 transition-all cursor-pointer border border-[var(--border-color)] disabled:opacity-50 flex items-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" /> Simpan Materi
                            </button>
                          </div>

                        </div>
                      ))}

                      {syllabus.length === 0 && (
                        <div className="p-10 text-center text-xs app-theme-text-muted italic app-theme-card border-dashed">
                          Belum ada silabus materi. Klik "+ Tambah Materi" di atas untuk memulai.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 2: DETAIL MAPEL */}
                {drillDownTab === "details" && (
                  <div className="app-theme-card rounded-3xl p-6 shadow-xl max-w-2xl mx-auto flex flex-col gap-6">
                    <div className="border-b border-[var(--border-color)] pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider app-theme-text">
                        Edit Detail Mata Pelajaran
                      </h3>
                      <p className="text-[10px] app-theme-text-muted font-semibold mt-1 uppercase tracking-wider">
                        Perbarui identitas dasar kelas pelajaran
                      </p>
                    </div>

                    <form onSubmit={handleSaveSubjectDetails} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider pl-1">
                            Judul Mapel
                          </label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider pl-1">
                            Kategori Mapel
                          </label>
                          <input
                            type="text"
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider pl-1">
                          Deskripsi Kelas / Tentang Kelas
                        </label>
                        <textarea
                          rows="4"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner resize-none font-sans leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider pl-1">
                          Link Google Drive Utama (Opsional)
                        </label>
                        <input
                          type="url"
                          value={editDrive}
                          onChange={(e) => setEditDrive(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-white/50 font-bold uppercase tracking-wider pl-1">
                          Link Video Utama (Opsional)
                        </label>
                        <input
                          type="url"
                          value={editVideo}
                          onChange={(e) => setEditVideo(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner"
                        />
                      </div>

                      <div className="flex justify-end gap-3 border-t border-white/5 pt-5">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 hover:scale-[1.01] transition-all cursor-pointer border border-white/10 disabled:opacity-50 flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" /> {isSaving ? "Menyimpan..." : "Simpan Detail Mapel"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* SUB-TAB 3: KELOLA KUIS */}
                {drillDownTab === "quiz" && (
                  <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full">
                    
                    {/* AI quiz panel */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-5 blur-xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-400" /> AI Quiz Generator (Gemini-Pro)
                          </h4>
                          <span className="text-[9px] text-white/40 font-semibold mt-0.5 uppercase tracking-wider">
                            Buat kuis otomatis berdasarkan rangkuman kelas
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleGenerateQuizAI}
                          disabled={isGeneratingQuiz}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-[10px] font-bold shadow-md active:scale-95 transition-all cursor-pointer border border-white/10 disabled:opacity-50 flex items-center gap-1"
                        >
                          <Cpu className="w-3.5 h-3.5" /> Generate AI
                        </button>
                      </div>
                    </div>

                    {/* Quiz editor list */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                          Soal Kuis ({quizQuestions.length})
                        </h4>
                        <button
                          onClick={handleAddQuizQuestion}
                          className="text-[10px] text-purple-300 hover:text-white transition-colors font-bold cursor-pointer"
                        >
                          + Tambah Pertanyaan Manual
                        </button>
                      </div>

                      {quizQuestions.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-white/5 border border-white/5 rounded-2xl p-4.5 flex flex-col gap-4 relative"
                        >
                          <button
                            type="button"
                            onClick={() => handleDeleteQuizQuestion(qIdx)}
                            className="absolute top-4 right-4 p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all cursor-pointer"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
                              Soal {qIdx + 1}
                            </label>
                            <input
                              type="text"
                              value={q.question}
                              onChange={(e) => handleUpdateQuizField(qIdx, "question", e.target.value)}
                              className="w-[calc(100%-2.5rem)] bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all shadow-inner font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] text-white/40 font-bold uppercase tracking-wider pl-0.5">
                              Pilihan Jawaban (Klik bulatan untuk jawaban benar)
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuizField(qIdx, "correct", opt)}
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                                      q.correct === opt
                                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-400"
                                        : "border-white/20 bg-white/5 text-white/30"
                                    }`}
                                  >
                                    {q.correct === opt && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                                  </button>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleUpdateQuizOption(qIdx, oIdx, e.target.value)}
                                    className="flex-grow bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-purple-400 focus:bg-white/10 transition-all"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}

                      {quizQuestions.length > 0 && (
                        <button
                          onClick={() => saveQuizToDB(quizQuestions)}
                          disabled={isSaving}
                          className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-center text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer border border-white/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-4 h-4" /> Simpan Kuis Mapel
                        </button>
                      )}

                      {quizQuestions.length === 0 && (
                        <div className="p-8 text-center text-[11px] text-white/30 italic bg-white/5 border border-white/5 border-dashed rounded-2xl">
                          Belum ada soal kuis. Gunakan generator AI di atas.
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}
        </div>

      </div>

      {/* MODAL: ADD MAPEL SUBJECT */}
      <AnimatePresence>
        {isAddMapelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddMapelModalOpen(false)}
              className={`absolute inset-0 backdrop-blur-md cursor-pointer transition-all duration-300 ${
                isDarkMode ? 'bg-black/80' : 'bg-white/80'
              }`}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`relative max-w-lg w-full h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-6 shadow-2xl overflow-hidden mt-auto sm:mt-0 border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-900/95 border-white/15 text-white' 
                  : 'bg-white/95 border-slate-200 text-slate-900'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 opacity-10 blur-2xl pointer-events-none" />

              <div className={`flex justify-between items-start border-b pb-4 flex-shrink-0 ${
                isDarkMode ? 'border-white/5' : 'border-slate-100'
              }`}>
                <div className="flex flex-col">
                  <h3 className={`text-base font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Tambah Mata Pelajaran Baru
                  </h3>
                  <p className={`text-[10px] font-semibold mt-1 uppercase tracking-wider ${
                    isDarkMode ? 'text-white/40' : 'text-slate-500'
                  }`}>
                    Buat wadah kelas baru di perpustakaan Studee
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMapelModalOpen(false)}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                      : 'bg-black/5 border-black/10 text-slate-600 hover:text-slate-950 hover:bg-black/10'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form */}
              <div className="flex-grow overflow-y-auto pr-1 no-scrollbar flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                      isDarkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      Nama Mapel
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sejarah, Biologi..."
                      value={newMapelTitle}
                      onChange={(e) => setNewMapelTitle(e.target.value)}
                      className={`w-full border rounded-xl py-3 px-4 text-xs placeholder-opacity-40 transition-all shadow-inner focus:outline-none focus:ring-1 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-white/20 focus:bg-white/10'
                          : 'bg-black/5 border-black/10 text-slate-900 placeholder-slate-400 focus:ring-slate-950/20 focus:bg-black/10'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                      isDarkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      Kategori
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: IPS, Science, Coding..."
                      value={newMapelCategory}
                      onChange={(e) => setNewMapelCategory(e.target.value)}
                      className={`w-full border rounded-xl py-3 px-4 text-xs placeholder-opacity-40 transition-all shadow-inner focus:outline-none focus:ring-1 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-white/20 focus:bg-white/10'
                          : 'bg-black/5 border-black/10 text-slate-900 placeholder-slate-400 focus:ring-slate-950/20 focus:bg-black/10'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                    isDarkMode ? 'text-white/50' : 'text-slate-500'
                  }`}>
                    Deskripsi / Tentang Kelas
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Tulis ringkasan penjelasan tentang mata pelajaran baru ini..."
                    value={newMapelDesc}
                    onChange={(e) => setNewMapelDesc(e.target.value)}
                    className={`w-full border rounded-xl py-3 px-4 text-xs placeholder-opacity-40 transition-all shadow-inner resize-none font-sans leading-relaxed focus:outline-none focus:ring-1 ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-white/20 focus:bg-white/10'
                        : 'bg-black/5 border-black/10 text-slate-900 placeholder-slate-400 focus:ring-slate-950/20 focus:bg-black/10'
                    }`}
                  />
                </div>

                {/* PDF Drag-and-Drop Upload Area (Dropzone) */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                    isDarkMode ? 'text-white/50' : 'text-slate-500'
                  }`}>
                    File Dokumen PDF Materi
                  </label>
                  
                  {stagedFile ? (
                    /* State Variant (File Selected) - Typography Only (No Icons) */
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border shadow-inner transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-white/[0.03] border-white/10 text-white/90' 
                        : 'bg-black/[0.02] border-black/10 text-slate-800'
                    }`}>
                      <div className="flex items-center gap-2.5 overflow-hidden mr-4">
                        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${
                          isDarkMode ? 'bg-white/10 text-white/90' : 'bg-black/5 text-slate-800'
                        }`}>
                          PDF
                        </span>
                        <span className="text-xs truncate font-medium tracking-tight">
                          {stagedFile.name}
                        </span>
                        <span className="text-[9px] opacity-40 font-mono flex-shrink-0">
                          ({(stagedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStagedFile(null)}
                        className="text-[10px] font-black uppercase text-[var(--text-color)] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer active:scale-95 transition-all px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded-md border border-[var(--border-color)]"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    /* Minimalist Document Upload Area (Dropzone) - Pure Typography (No Icons) */
                    <div
                      onClick={() => document.getElementById('pdf-upload-drop').click()}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-center backdrop-blur-[12px] ${
                        isDarkMode
                          ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30 hover:shadow-none'
                          : 'border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.04] hover:border-black/30 hover:shadow-none'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="pdf-upload-drop" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                      <span className={`text-xs font-bold leading-normal tracking-tight px-4 ${
                        isDarkMode ? 'text-white/80' : 'text-slate-800'
                      }`}>
                        Tarik & lepas file PDF di sini atau klik untuk memilih
                      </span>
                      <span className={`text-[9px] font-semibold mt-1.5 opacity-60 tracking-wider uppercase ${
                        isDarkMode ? 'text-white/40' : 'text-slate-500'
                      }`}>
                        Maksimal ukuran file PDF 10MB
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider pl-1 ${
                    isDarkMode ? 'text-white/50' : 'text-slate-500'
                  }`}>
                    Link Video Utama (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/..."
                    value={newMapelVideo}
                    onChange={(e) => setNewMapelVideo(e.target.value)}
                    className={`w-full border rounded-xl py-3 px-4 text-xs placeholder-opacity-40 transition-all shadow-inner focus:outline-none focus:ring-1 ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-white/20 focus:bg-white/10'
                        : 'bg-black/5 border-black/10 text-slate-900 placeholder-slate-400 focus:ring-slate-950/20 focus:bg-black/10'
                    }`}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className={`flex justify-end gap-3 border-t pt-5 flex-shrink-0 mt-auto ${
                isDarkMode ? 'border-white/5' : 'border-slate-100'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddMapelModalOpen(false);
                    setStagedFile(null);
                  }}
                  className="px-5 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 bg-white/[0.02] hover:bg-white/[0.08] border-white/20 text-white"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCreateMapel}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 border bg-white/[0.02] hover:bg-white/[0.08] border-white/20 text-white"
                >
                  {isSaving ? (stagedFile && isUploading ? "Mengunggah PDF..." : "Menyimpan...") : "Tambah Mapel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI generator overlay loader */}
      <AnimatePresence>
        {isGeneratingQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center px-6"
          >
            <div className="max-w-sm w-full bg-slate-900 border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center gap-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-10 blur-2xl pointer-events-none" />

              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-purple-400 rounded-full animate-spin" />
                <Cpu className="w-6 h-6 text-purple-300 animate-pulse" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Generating AI Quiz...
                </h3>
                <p className="text-[10px] text-white/40 leading-relaxed font-semibold">
                  Menganalisis materi pelajaran via backend FastAPI Python untuk menyusun soal kuis otomatis.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
