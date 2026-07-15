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

const lessonsData = {
  mtk: {
    id: "mtk",
    name: "Matematika (MTK)",
    level: "Intermediate",
    syllabus: [
      { 
        title: "Pengenalan Aljabar Linear", 
        duration: "45 Menit",
        videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoEs",
        notes: "Aljabar Linear mempelajari sistem persamaan linear, vektor, matriks, dan ruang vektor. Konsep ini adalah pilar utama di balik pemrograman grafis 3D, kecerdasan buatan (AI), dan analisis data modern."
      },
      { 
        title: "Matriks & Transformasi Ruang", 
        duration: "60 Menit",
        videoUrl: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
        notes: "Matriks digunakan untuk mentransformasikan objek grafis (translasi, rotasi, scaling) dalam ruang 2D dan 3D. Di sini Anda akan memahami konsep Eigenvalue dan Eigenvector secara mendalam."
      },
      { 
        title: "Kalkulus: Turunan Pertama", 
        duration: "50 Menit",
        videoUrl: "https://www.youtube.com/watch?v=juKGHh3_DNY",
        notes: "Kalkulus diferensial berfokus pada laju perubahan instan dari suatu fungsi. Konsep turunan pertama sangat krusial dalam algoritma optimasi seperti Gradient Descent pada Machine Learning."
      },
      { 
        title: "Kalkulus: Integral & Luas Daerah", 
        duration: "75 Menit",
        videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoEs",
        notes: "Integral adalah operasi kebalikan dari turunan yang memungkinkan kita menghitung akumulasi total atau luas daerah di bawah kurva non-linear dengan presisi matematis tinggi."
      },
      { 
        title: "Probabilitas Dasar & Distribusi", 
        duration: "90 Menit",
        videoUrl: "https://www.youtube.com/watch?v=kYB8IZa5AuE",
        notes: "Teori probabilitas mengukur tingkat ketidakpastian suatu peristiwa. Kita akan mengeksplorasi Distribusi Normal, Teorema Bayes, dan bagaimana data statistik membantu pengambilan keputusan."
      },
    ],
  },
  science: {
    id: "science",
    name: "Science (IPA)",
    level: "Advanced",
    syllabus: [
      { 
        title: "Dasar Fisika Quantum", 
        duration: "60 Menit",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        notes: "Fisika Quantum mempelajari mekanika partikel pada skala sub-atomik. Konsep probabilitas keadaan menggantikan determinisme fisika klasik, membuka pintu bagi komputasi kuantum masa depan."
      },
      { 
        title: "Dualisme Gelombang Partikel", 
        duration: "75 Menit",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        notes: "Percobaan celah ganda membuktikan bahwa partikel seperti elektron bertingkah sebagai gelombang ketika tidak diamati, dan runtuh menjadi materi padat saat proses observasi dilakukan."
      },
      { 
        title: "Struktur & Fungsi Sel Eukariotik", 
        duration: "55 Menit",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        notes: "Mempelajari perbedaan mendasar sel hewan dan tumbuhan. Organel seperti Mitokondria bertindak sebagai generator energi (ATP), sementara Nukleus menyimpan blueprint DNA makhluk hidup."
      },
      { 
        title: "Sintesis Protein & Asam Nukleat", 
        duration: "80 Menit",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        notes: "Proses transkripsi dan translasi DNA menjadi rantai asam amino (protein) yang menyusun tubuh kita. Pemahaman materi genetik ini krusial untuk bioteknologi dan pengembangan vaksin."
      },
      { 
        title: "Termodinamika Sistem Tertutup", 
        duration: "90 Menit",
        videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
        notes: "Hukum kekekalan energi dan entropi dalam wadah tertutup. Memahami perpindahan panas, usaha kerja mekanik, serta efisiensi ideal mesin Carnot dalam memproses daya energi."
      },
    ],
  },
  coding: {
    id: "coding",
    name: "Coding & Algoritma",
    level: "Beginner to Pro",
    syllabus: [
      { 
        title: "Pengenalan Struktur Data & Array", 
        duration: "30 Menit",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        notes: "Array dan List adalah struktur data linear dasar. Di sini Anda akan belajar kompleksitas waktu (Big O) pencarian, penyisipan, dan penghapusan data."
      },
      { 
        title: "Algoritma Rekursi & Dynamic Programming", 
        duration: "90 Menit",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        notes: "Rekursi memecah masalah besar menjadi sub-masalah kecil. Dynamic Programming mengoptimasi rekursi dengan menyimpan hasil perhitungan (memoization)."
      },
      { 
        title: "Pengenalan Routing Dinamis Next.js", 
        duration: "45 Menit",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        notes: "Pelajari cara kerja routing folder-based di Next.js App Router, menangkap segmen dinamis [id], dan menyajikan data berbasis parameter URL secara cepat."
      },
      { 
        title: "Manajemen State dengan React Hooks", 
        duration: "60 Menit",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        notes: "Memahami siklus hidup komponen React melalui useState, useEffect, dan useContext guna membangun antarmuka web interaktif yang reaktif."
      },
      { 
        title: "Deployment Aplikasi ke Vercel", 
        duration: "40 Menit",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        notes: "Panduan lengkap mendeploy aplikasi Next.js ke Vercel secara otomatis dari repositori GitHub, mengkonfigurasi environment variables, dan memantau analitik."
      },
    ],
  },
  english: {
    id: "english",
    name: "Bahasa Inggris",
    level: "Beginner",
    syllabus: [
      { 
        title: "Penyusunan Kalimat Akademik", 
        duration: "45 Menit",
        videoUrl: "https://www.youtube.com/watch?v=juKGHh3_DNY",
        notes: "Mempelajari struktur kalimat formal (compound & complex sentences) untuk esai ilmiah, menyusun argumen yang logis, dan menghindari bias bahasa."
      },
      { 
        title: "Penguasaan 16 Tenses Utama", 
        duration: "90 Menit",
        videoUrl: "https://www.youtube.com/watch?v=juKGHh3_DNY",
        notes: "Memahami kapan harus menggunakan Simple Past, Present Perfect, atau Future Continuous dalam percakapan sehari-hari maupun dokumen bisnis resmi."
      },
      { 
        title: "Teknik Presentasi & Public Speaking", 
        duration: "60 Menit",
        videoUrl: "https://www.youtube.com/watch?v=juKGHh3_DNY",
        notes: "Tips mengatasi kecemasan berbicara di depan umum, intonasi vokal, bahasa tubuh, serta pemilihan kosakata transisi profesional untuk meyakinkan audiens dalam bahasa Inggris."
      },
      { 
        title: "Percakapan Formal di Tempat Kerja", 
        duration: "50 Menit",
        videoUrl: "https://www.youtube.com/watch?v=juKGHh3_DNY",
        notes: "Mempraktikkan negosiasi bisnis, mengirim email formal, serta tata bahasa sopan (politeness markers) saat berinteraksi dengan kolega kerja maupun klien internasional."
      },
    ],
  },
};

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { markAsCompleted } = useStreak();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const id = params?.id;
  const lessonIdx = parseInt(params?.lessonIdx || "0", 10);
  const [mounted, setMounted] = useState(false);

  // Media type state: 'video' (Mode A) or 'pdf' (Mode B)
  const [mediaType, setMediaType] = useState("video");
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isPdfFullScreen, setIsPdfFullScreen] = useState(false);

  const [lesson, setLesson] = useState(() => {
    return lessonsData[id] || lessonsData.coding;
  });

  const [currentMateri, setCurrentMateri] = useState(() => {
    const parentLesson = lessonsData[id] || lessonsData.coding;
    return parentLesson.syllabus[lessonIdx] || parentLesson.syllabus[0];
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      fetch("/api/subjects")
        .then((res) => res.json())
        .then((subjects) => {
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
                syllabus: mappedSyllabus
              });

              setCurrentMateri({
                title: targetMateri.title,
                duration: targetMateri.duration || "15 Menit",
                videoUrl: found.videoUrl || "",
                pdfUrl: targetMateri.pdfUrl || found.driveLink || "",
                notes: found.description || "Silakan pelajari materi dokumen di bawah secara mendalam."
              });
            }
          }
        })
        .catch((err) => console.error("Error loading dynamic subject details inside LessonPlayer:", err));
    }
  }, [id, lessonIdx]);

  if (!mounted) {
    return null;
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
            onClick={() => router.push(`/lesson/${id}`)}
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
              markAsCompleted();
              router.push(`/lesson/${id}`);
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

      {/* Floating Bottom Navigation Bar (ST6) */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2.5rem)] backdrop-blur-[16px] rounded-full py-2 px-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between z-50 border transition-all duration-300 ${
        isDarkMode ? 'bg-[#0C0813]/85 border-white/10' : 'bg-[#F8F9FC]/90 border-black/10'
      }`}>
        {/* Dashboard (Home) */}
        <button 
          onClick={() => router.push("/")}
          className="flex flex-col items-center gap-1 py-2.5 px-4 rounded-full text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
          title="Dashboard"
        >
          <HomeIcon className="w-5 h-5" />
        </button>

        {/* Learn (Highlight / Active) */}
        <button 
          onClick={() => router.push("/library")}
          className={`flex items-center gap-2 py-2 px-4 rounded-full font-extrabold text-[10px] tracking-widest active:scale-95 transition-all border cursor-pointer ${
            isDarkMode
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-black/10 border-black/20 text-slate-900'
          }`}
          title="Learn"
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>LEARN</span>
        </button>

        {/* Stats */}
        <button 
          onClick={() => router.push("/stats")}
          className="flex flex-col items-center gap-1 py-2.5 px-4 rounded-full text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
          title="Stats"
        >
          <BarChart2 className="w-5 h-5" />
        </button>

        {/* Profile */}
        <button 
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center gap-1 py-2.5 px-4 rounded-full text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
          title="Profile"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Settings */}
        <button 
          onClick={() => router.push("/profile/settings")}
          className="flex flex-col items-center gap-1 py-2.5 px-4 rounded-full text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white active:scale-90 transition-all cursor-pointer"
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
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
              <h2 className="text-sm font-bold text-white tracking-tight mt-0.5 text-left">Computer Science 101</h2>
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
                    <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">Computer Science 101</h1>
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
    </main>
  );
}
