"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Clock, 
  FileText,
  CheckCircle,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Home as HomeIcon,
  BookOpen,
  BarChart2,
  User,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  X
} from "lucide-react";
import { useStreak } from "../../../../lib/StreakContext";
import { useTheme } from "../../../../lib/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { markAsCompleted } = useStreak();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const id = params?.id;
  const lessonIdx = parseInt(params?.lessonIdx || "0", 10);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Media type state: 'video' (Mode A) or 'pdf' (Mode B)
  const [mediaType, setMediaType] = useState("video");
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isPdfFullScreen, setIsPdfFullScreen] = useState(false);

  const [lesson, setLesson] = useState(null);
  const [currentMateri, setCurrentMateri] = useState(null);

  // Student Quiz Player States
  const [quizActive, setQuizActive] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIdx]: selectedOptionString }
  const [quizResult, setQuizResult] = useState(null); // { score, passed, correctCount }

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && id) {
      setLoading(true);
      fetch("/api/subjects")
        .then((res) => res.json())
        .then((subjects) => {
          setLoading(false);
          if (subjects && !subjects.error) {
            const found = subjects.find((s) => String(s.id) === String(id));
            if (found) {
              const mappedSyllabus = (found.syllabus && found.syllabus.length > 0) ? found.syllabus : [
                { title: "Pengenalan Materi", duration: "15 Menit" }
              ];
              const targetMateri = mappedSyllabus[lessonIdx] || mappedSyllabus[0];

              const hasVideo = !!(found.videoUrl && found.videoUrl.trim() !== "");
              if (!hasVideo) {
                setMediaType("pdf");
              } else {
                setMediaType("video");
              }

              setLesson({
                id: found.id,
                name: found.title,
                level: found.level || "Beginner",
                syllabus: mappedSyllabus,
                questions: found.questions || []
              });

              setCurrentMateri({
                title: targetMateri.title,
                duration: targetMateri.duration || "15 Menit",
                videoUrl: found.videoUrl || "",
                pdfUrl: targetMateri.pdfUrl || found.driveLink || "",
                notes: found.description || "Silakan pelajari materi dokumen di bawah secara mendalam."
              });
            } else {
              setLesson(null);
            }
          }
        })
        .catch((err) => {
          console.error("Error loading dynamic subject details inside LessonPlayer:", err);
          setLoading(false);
          setLesson(null);
        });
    }
  }, [id, lessonIdx]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 animate-pulse">Memuat Player...</span>
        </div>
      </div>
    );
  }

  if (!lesson || !currentMateri) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6">
          <h3 className="text-lg font-black uppercase tracking-wider text-red-400">Materi Tidak Ditemukan</h3>
          <p className="text-xs text-white/60 leading-relaxed">Materi pelajaran yang Anda cari tidak terdaftar atau telah dihapus.</p>
          <button onClick={() => router.push("/library")} className="w-full py-3.5 bg-white text-black font-bold rounded-2xl text-xs active:scale-95 transition-all cursor-pointer">Kembali ke Library</button>
        </div>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const ytMatch = url.match(ytReg);
    if (ytMatch && ytMatch[2].length === 11) {
      return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&rel=0`;
    }
    const gdReg = /\/file\/d\/([^\/]+)/;
    const gdMatch = url.match(gdReg);
    if (gdMatch && gdMatch[1]) {
      return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    }
    if (url.includes("embed") || url.includes("preview")) {
      return url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(currentMateri.videoUrl);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 60));
  const handleZoomReset = () => setZoom(100);

  // Dynamic CSS classes based on theme (ST1 Constraints)
  const pageBgClass = isDarkMode ? "bg-[#0B0813] text-white" : "bg-[#F8F9FC] text-slate-900";
  
  const glassCardClass = `w-full backdrop-blur-[12px] shadow-sm rounded-[2rem] p-4 transition-all duration-300 ${
    isDarkMode 
      ? 'bg-white/[0.05] border border-white/10' 
      : 'bg-black/[0.03] border border-black/10'
  }`;

  const bottomPanelClass = `w-full backdrop-blur-[12px] shadow-sm rounded-[2rem] p-6 transition-all duration-300 ${
    isDarkMode 
      ? 'bg-white/[0.03] border border-white/[0.08]' 
      : 'bg-black/[0.02] border border-black/[0.08]'
  }`;

  const backButtonClass = `w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 border ${
    isDarkMode
      ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
      : 'bg-black/5 border-black/10 text-slate-800 hover:bg-black/10'
  }`;

  return (
    <main className={`min-h-screen pb-36 font-sans relative overflow-hidden flex flex-col items-center transition-colors duration-300 ${pageBgClass}`}>
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Top Header Bar (ST4) */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.back()}
            className={backButtonClass}
            aria-label="Back to Subject"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-xs font-black tracking-widest uppercase opacity-55">LESSON PLAYER</span>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Lesson Metadata Section (ST4) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            {/* Badge: "MATERI 1" (Monochrome Glass Border) */}
            <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wider border ${
              isDarkMode 
                ? 'bg-white/5 border-white/20 text-white' 
                : 'bg-black/5 border-black/20 text-slate-800'
            }`}>
              MATERI {lessonIdx + 1}
            </div>

            {/* Badge: "10 Menit" (Semi-Transparent Glass) */}
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-[9px] font-bold border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-white/90' 
                : 'bg-black/5 border-black/10 text-slate-800'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`} />
              <span>{currentMateri.duration}</span>
            </div>
          </div>

          <h1 className="text-2xl font-black leading-tight tracking-tight mt-1">
            {currentMateri.title}
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            KELAS: {lesson.name.toUpperCase()}
          </span>
        </div>

        {/* Media Switcher (ST2 - TEXT-ONLY TAB SWITCHER, NO ICONS) */}
        {currentMateri.videoUrl && currentMateri.videoUrl.trim() !== "" && (
          <div className={`flex items-center p-1 border rounded-full w-fit gap-1 transition-colors duration-300 ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          }`}>
            <button
              onClick={() => setMediaType("video")}
              className={`px-5 py-2 rounded-full text-[10px] font-extrabold tracking-widest transition-all duration-300 cursor-pointer border ${
                mediaType === "video"
                  ? (isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-black/85 text-white border-black/20")
                  : "border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              VIDEO
            </button>
            <button
              onClick={() => setMediaType("pdf")}
              className={`px-5 py-2 rounded-full text-[10px] font-extrabold tracking-widest transition-all duration-300 cursor-pointer border ${
                mediaType === "pdf"
                  ? (isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-black/85 text-white border-black/20")
                  : "border-transparent text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              PDF DOKUMEN
            </button>
          </div>
        )}

        {/* Media Container (ST3) */}
        <div className={glassCardClass}>
          {mediaType === "video" && currentMateri.videoUrl && currentMateri.videoUrl.trim() !== "" ? (
            /* MODE A: VIDEO */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
              {!isPlaying ? (
                /* Custom Thumbnail Overlay matching visual theme */
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-[#1b1535]/90 to-[#0B0813]/95 cursor-pointer group transition-all duration-300"
                >
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Glowing Play Button - Monochrome */}
                  <div className="w-14 h-14 bg-white/10 border border-white/30 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 active:scale-95 z-10">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>

                  <span className="text-[10px] text-white/70 font-extrabold uppercase tracking-widest mt-4 group-hover:text-white transition-colors z-10">
                    KLIK UNTUK MEMUTAR VIDEO
                  </span>
                </div>
              ) : (
                embedUrl && (
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full border-0 z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Video Player"
                  />
                )
              )}
            </div>
          ) : (
            /* MODE B: PDF/DOCUMENT */
            <div className="flex flex-col gap-3 w-full">
              {/* PDF Toolbar */}
              <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors duration-300 ${
                isDarkMode ? 'bg-black/30 border-white/5' : 'bg-black/[0.06] border-black/5'
              }`}>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleZoomOut}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer active:scale-90 transition-all font-bold ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-800'
                    }`}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono w-10 text-center opacity-85">{zoom}%</span>
                  <button 
                    onClick={handleZoomIn}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer active:scale-90 transition-all font-bold ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                        : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-800'
                    }`}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleZoomReset}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer active:scale-90 transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60' 
                        : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-500'
                    }`}
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-wider opacity-40">
                    HALAMAN 1 / 15
                  </span>
                  
                  {/* Full Screen / Expand Button */}
                  <button
                    onClick={() => setIsPdfFullScreen(true)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border cursor-pointer active:scale-90 transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80' 
                        : 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-700'
                    }`}
                    title="Full Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Document Container */}
              <div className={`w-full rounded-2xl flex justify-center relative border transition-colors duration-300 ${
                isDarkMode ? 'bg-black/40 border-white/5' : 'bg-black/[0.04] border-black/5'
              } ${
                !currentMateri.videoUrl || currentMateri.videoUrl.trim() === "" 
                  ? 'h-[460px]' 
                  : 'h-[320px]'
              } ${currentMateri.pdfUrl ? 'p-0 overflow-hidden' : 'p-4 overflow-auto'}`}>
                {currentMateri.pdfUrl ? (
                  <iframe
                    src={`${currentMateri.pdfUrl}#toolbar=0`}
                    className="w-full h-full border-0 rounded-2xl transition-all duration-300"
                    style={{ 
                      zoom: zoom / 100,
                      MozTransform: `scale(${zoom / 100})`,
                      MozTransformOrigin: 'top left'
                    }}
                    title="PDF Viewer"
                  />
                ) : (
                  <div 
                    className="bg-white text-slate-800 rounded-xl p-6 shadow-2xl transition-all duration-300 w-full max-w-[340px] origin-top"
                    style={{ 
                      transform: `scale(${zoom / 100})`, 
                      transformOrigin: 'top center',
                      minHeight: '400px'
                    }}
                  >
                    <div className="flex flex-col gap-6 text-slate-800 font-serif leading-relaxed text-[11px] sm:text-xs text-left">
                      <div className="text-center pb-4 border-b border-slate-300">
                        <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Computer Science 101</h1>
                        <p className="text-[9px] text-slate-500 font-sans mt-1">Introduction to Algorithms & Data Structures</p>
                        <p className="text-[7px] text-slate-400 font-sans mt-0.5">Author: Department of Computer Science</p>
                      </div>

                      <div>
                        <h2 className="text-xs font-bold text-slate-900 mb-2">1. Pengenalan Algoritma</h2>
                        <p className="mb-3">
                          Algoritma adalah serangkaian instruksi logis yang terdefinisi dengan jelas untuk memecahkan suatu masalah atau melakukan komputasi tertentu. Dalam dunia pemrograman, efisiensi algoritma diukur menggunakan notasi matematis yang disebut <strong>Big O Notation</strong>.
                        </p>
                        <p>
                          Setiap program komputer pada dasarnya adalah implementasi dari satu atau lebih algoritma yang memproses struktur data tertentu di dalam memori komputer. Pemilihan struktur data yang tepat akan sangat memengaruhi kecepatan eksekusi algoritma tersebut.
                        </p>
                      </div>

                      <div>
                        <h2 className="text-xs font-bold text-slate-900 mb-2">2. Dasar-dasar Pemrograman JavaScript</h2>
                        <p className="mb-3">
                          JavaScript adalah bahasa pemrograman dinamis yang digunakan secara luas untuk membangun interaktivitas pada halaman web. Sebagai bahasa yang bersifat <i>asynchronous</i>, JavaScript sangat efisien dalam menangani operasi I/O seperti memanggil API tanpa memblokir thread utama.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-[9px] text-slate-700 my-2 shadow-inner leading-normal white-space-pre">
                          {`// Contoh Fungsi Rekursif: Faktorial
function faktorial(n) {
  if (n <= 1) return 1;
  return n * faktorial(n - 1);
}
console.log(faktorial(5)); // Output: 120`}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 text-center text-[8px] text-slate-400 font-sans mt-4">
                        Halaman 1 dari 15 • Universitas Studee Global
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Additional Resources (ST5) */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-wider opacity-50 flex items-center gap-1.5">
            <FileText className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`} /> 
            <span>CATATAN PENDUKUNG MATERI</span>
          </h3>
          
          <div className={bottomPanelClass}>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {currentMateri.title}
            </h4>
            <p className="text-[11px] sm:text-xs opacity-75 leading-relaxed font-normal mt-1 whitespace-pre-wrap">
              {currentMateri.notes}
            </p>
            {lesson.id === "coding" && (
              <>
                <div className="h-[1px] bg-black/10 dark:bg-white/10 my-3" />
                <ul className="flex flex-col gap-2 text-[10px] sm:text-[11px] opacity-70">
                  <li className="flex gap-2">
                    <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-bold`}>•</span>
                    <span><strong>Reaktivitas Klien:</strong> Mengubah konten secara dinamis tanpa memuat ulang halaman.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-bold`}>•</span>
                    <span><strong>Asynchronous Execution:</strong> Menggunakan Promises dan Async/Await untuk fetch data secara non-blocking.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={`${isDarkMode ? 'text-white' : 'text-slate-900'} font-bold`}>•</span>
                    <span><strong>Ekosistem Luas:</strong> Framework modern seperti React, Next.js, dan Vue berbasis JavaScript/TypeScript.</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Bottom Action Button (above bottom nav padding) */}
        <div className="w-full mt-2">
          <button
            onClick={() => {
              if (lesson && lesson.questions && lesson.questions.length > 0) {
                // If subject has a quiz, open the quiz player
                setQuizActive(true);
                setCurrentQIdx(0);
                setSelectedAnswers({});
                setQuizResult(null);
                alert("Selesaikan kuis terlebih dahulu agar streak konsistensi belajar harian kamu bertambah!");
              } else {
                // Otherwise complete lesson normally
                markAsCompleted();
                router.back();
              }
            }}
            className={`w-full py-4 rounded-2xl text-center font-bold text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center gap-2 border ${
              isDarkMode 
                ? 'bg-white/[0.08] hover:bg-white/[0.15] border-white/20 text-white' 
                : 'bg-black/[0.8] hover:bg-black/[0.9] border-black/20 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-white" />
            SELESAI MENONTON & BACA
          </button>
        </div>

      </div>

      {/* PDF Full Screen Overlay Mode (ST3 Expansion) */}
      {isPdfFullScreen && (
        <div className="fixed inset-0 z-[200] bg-[#0B0813] flex flex-col p-6 overflow-hidden">
          {/* Decorative background orbs in fullscreen */}
          <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[130px] pointer-events-none" />

          {/* Fullscreen Header / Toolbar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 z-10 relative">
            <div className="flex flex-col">
              <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest text-left">FULL SCREEN MODE</span>
              <h2 className="text-sm font-bold text-white tracking-tight mt-0.5 text-left font-sans">{lesson?.name || "Mata Pelajaran"}</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom controls inside fullscreen */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                <button 
                  onClick={handleZoomOut}
                  className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-md flex items-center justify-center border border-white/5 cursor-pointer text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-white/80 w-10 text-center">{zoom}%</span>
                <button 
                  onClick={handleZoomIn}
                  className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-md flex items-center justify-center border border-white/5 cursor-pointer text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Close Full Screen button (X icon) with monochrome border */}
              <button
                onClick={() => setIsPdfFullScreen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/20 text-white' 
                    : 'bg-black/5 border-black/20 text-slate-800'
                }`}
                title="Tutup Full Screen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Document scroll view */}
          <div className={`flex-1 w-full mt-6 flex justify-center bg-black/30 border border-white/5 rounded-2xl relative z-10 ${
            currentMateri.pdfUrl ? 'overflow-hidden' : 'overflow-auto p-4'
          }`}>
            {currentMateri.pdfUrl ? (
              <iframe
                src={`${currentMateri.pdfUrl}#toolbar=0`}
                className="w-full h-full border-0 rounded-2xl transition-all duration-300"
                style={{ 
                  zoom: (zoom + 20) / 100,
                  MozTransform: `scale(${(zoom + 20) / 100})`,
                  MozTransformOrigin: 'top left'
                }}
                title="PDF Viewer Fullscreen"
              />
            ) : (
              <div 
                className="bg-white text-slate-800 rounded-xl p-8 sm:p-10 shadow-2xl transition-all duration-300 w-full max-w-[480px] sm:max-w-[600px] origin-top"
                style={{ 
                  transform: `scale(${(zoom + 20) / 100})`, // Scale up appropriately in fullscreen for optimal mobile readability
                  transformOrigin: 'top center',
                  minHeight: '600px'
                }}
              >
                <div className="flex flex-col gap-6 text-slate-800 font-serif leading-relaxed text-xs sm:text-sm text-left">
                  <div className="text-center pb-6 border-b border-slate-300">
                    <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">{lesson?.name || "Mata Pelajaran"}</h1>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-sans mt-1">Introduction to Algorithms & Data Structures</p>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-sans mt-0.5">Author: Department of Computer Science</p>
                  </div>

                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">1. Pengenalan Algoritma</h2>
                    <p className="mb-3">
                      Algoritma adalah serangkaian instruksi logis yang terdefinisi dengan jelas untuk memecahkan suatu masalah atau melakukan komputasi tertentu. Dalam dunia pemrograman, efisiensi algoritma diukur menggunakan notasi matematis yang disebut <strong>Big O Notation</strong>.
                    </p>
                    <p>
                      Setiap program komputer pada dasarnya adalah implementasi dari satu atau lebih algoritma yang memproses struktur data tertentu di dalam memori komputer. Pemilihan struktur data yang tepat akan sangat memengaruhi kecepatan eksekusi algoritma tersebut.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">2. Dasar-dasar Pemrograman JavaScript</h2>
                    <p className="mb-3">
                      JavaScript adalah bahasa pemrograman dinamis yang digunakan secara luas untuk membangun interaktivitas pada halaman web. Sebagai bahasa yang bersifat <i>asynchronous</i>, JavaScript sangat efisien dalam menangani operasi I/O seperti memanggil API tanpa memblokir thread utama.
                    </p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-[10px] sm:text-xs text-slate-700 my-2 shadow-inner leading-normal white-space-pre">
                      {`// Contoh Fungsi Rekursif: Faktorial
function faktorial(n) {
  if (n <= 1) return 1;
  return n * faktorial(n - 1);
}
console.log(faktorial(5)); // Output: 120`}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 text-center text-[9px] sm:text-[10px] text-slate-400 font-sans mt-8">
                    Halaman 1 dari 15 • Universitas Studee Global
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Quiz Player Overlay Modal */}
      <AnimatePresence>
        {quizActive && (
          <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]" />
            <div className="fixed inset-x-6 top-12 bottom-12 mx-auto max-w-md w-[90%] bg-slate-950 border border-white/10 rounded-[2.5rem] p-6 shadow-[0_0_40px_rgba(255,255,255,0.15)] z-[120] flex flex-col gap-5 overflow-hidden text-white">
              
              {/* Header */}
              <div className="flex justify-between items-center w-full flex-shrink-0">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest font-sans">EVALUASI AKHIR</span>
                  <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">{lesson?.name || "Kuis"}</h3>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Apakah Anda yakin ingin keluar dari kuis? Seluruh jawaban Anda akan hilang.")) {
                      setQuizActive(false);
                    }
                  }}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar & Index */}
              {!quizResult && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div className="flex justify-between items-center text-[10px] font-bold text-white/60">
                    <span>Pertanyaan {currentQIdx + 1} dari {lesson.questions.length}</span>
                    <span>{Math.round(((currentQIdx + 1) / lesson.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${((currentQIdx + 1) / lesson.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Active Quiz Question Screen */}
              {!quizResult ? (
                <>
                  {/* Question text */}
                  <div className="flex-grow overflow-y-auto py-2 flex flex-col justify-center text-center">
                    <p className="text-sm sm:text-base font-extrabold leading-relaxed text-white/90">
                      {lesson.questions[currentQIdx]?.question}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    {lesson.questions[currentQIdx]?.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQIdx] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setSelectedAnswers(prev => ({ ...prev, [currentQIdx]: opt }));
                          }}
                          className={`w-full py-4 px-5 rounded-2xl text-xs text-left font-bold border transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center gap-3.5 ${
                            isSelected 
                              ? "bg-white text-black border-white shadow-lg transform translate-x-1"
                              : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                            isSelected ? "bg-black text-white border-black" : "bg-white/10 border-white/20 text-white"
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex justify-between items-center w-full mt-2 pt-4 border-t border-white/10 flex-shrink-0">
                    <button
                      onClick={() => setCurrentQIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentQIdx === 0}
                      className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white/80 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                    >
                      Sebelumnya
                    </button>

                    {currentQIdx < lesson.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIdx(prev => prev + 1)}
                        disabled={!selectedAnswers[currentQIdx]}
                        className="px-5 py-3 bg-white text-black hover:bg-white/95 disabled:opacity-40 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                      >
                        Berikutnya
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          // Calculate score
                          let correctCount = 0;
                          lesson.questions.forEach((q, idx) => {
                            if (selectedAnswers[idx] === q.correct) {
                              correctCount++;
                            }
                          });
                          const score = Math.round((correctCount / lesson.questions.length) * 100);
                          const passed = score >= 60;
                          
                          setQuizResult({
                            score,
                            passed,
                            correctCount
                          });

                          if (passed) {
                            markAsCompleted();
                          }
                        }}
                        disabled={Object.keys(selectedAnswers).length < lesson.questions.length}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-md uppercase tracking-wider"
                      >
                        Kirim Jawaban
                      </button>
                    )}
                  </div>
                </>
              ) : (
                /* Score & Answers Review Screen */
                <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-1">
                  
                  {/* Circular Scoreboard */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-inner mt-2 flex-shrink-0">
                    <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 ${
                      quizResult.passed ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"
                    }`}>
                      <span className="text-3xl font-black">{quizResult.score}%</span>
                      <span className="text-[7px] font-black uppercase tracking-wider text-white/50">{quizResult.passed ? "LULUS" : "GAGAL"}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-4 uppercase tracking-wider">
                      {quizResult.passed ? "Selamat, Anda Lulus!" : "Ayo Coba Lagi!"}
                    </h4>
                    <p className="text-[10px] text-white/60 mt-1 leading-normal text-center max-w-[200px]">
                      Anda menjawab benar <strong>{quizResult.correctCount}</strong> dari <strong>{lesson.questions.length}</strong> pertanyaan.
                    </p>
                  </div>

                  {/* Answers review list */}
                  <div className="flex flex-col gap-3.5 text-left mt-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 block">Tinjauan Hasil Jawaban</span>
                    
                    {lesson.questions.map((q, idx) => {
                      const ans = selectedAnswers[idx];
                      const isCorrect = ans === q.correct;
                      return (
                        <div key={idx} className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2.5">
                          <div className="flex justify-between items-start gap-2 w-full">
                            <span className="text-[10px] font-black text-white/50">Pertanyaan {idx + 1}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isCorrect 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                              {isCorrect ? "Benar" : "Salah"}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-white/90 leading-relaxed">{q.question}</p>
                          
                          <div className="flex flex-col gap-1.5 mt-1 text-[10px]">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8px] font-bold uppercase tracking-wider opacity-45 pl-0.5">Jawaban Anda</span>
                              <span className={`py-1.5 px-3 rounded-lg border font-medium ${
                                isCorrect 
                                  ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/5 border-red-500/10 text-red-400"
                              }`}>{ans}</span>
                            </div>
                            {!isCorrect && (
                              <div className="flex flex-col gap-0.5 mt-1">
                                <span className="text-[8px] font-bold uppercase tracking-wider opacity-45 pl-0.5">Kunci Jawaban</span>
                                <span className="py-1.5 px-3 rounded-lg border bg-emerald-500/5 border-emerald-500/10 text-emerald-400 font-medium">{q.correct}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Close button inside review screen */}
                  <button
                    onClick={() => {
                      setQuizActive(false);
                      if (quizResult.passed) {
                        router.back();
                      }
                    }}
                    className="w-full mt-4 bg-white text-black hover:bg-white/90 py-3.5 rounded-2xl text-xs font-black shadow-lg uppercase tracking-widest cursor-pointer transition-all active:scale-95 text-center flex-shrink-0"
                  >
                    Tutup Kuis
                  </button>
                </div>
              )}

            </div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
