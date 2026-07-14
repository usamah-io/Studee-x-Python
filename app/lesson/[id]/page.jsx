"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Share2, 
  Bookmark, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Code, 
  Globe, 
  FlaskConical,
  GraduationCap,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LessonItem from "./LessonItem";
import { useStreak } from "../../../lib/StreakContext";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { markAsCompleted } = useStreak();
  const id = params?.id;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAllSyllabus, setShowAllSyllabus] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Student Quiz Player States
  const [quizActive, setQuizActive] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIdx]: selectedOptionString }
  const [quizResult, setQuizResult] = useState(null); // { score, passed, correctCount }

  // Simple count-up micro-interactions
  const [animatedLessons, setAnimatedLessons] = useState(0);
  const [animatedQuizzes, setAnimatedQuizzes] = useState(0);
  const [animatedHours, setAnimatedHours] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && id) {
      setLoading(true);
      fetch(`/api/subjects?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data && !data.error) {
            const finalSyllabus = (data.syllabus && data.syllabus.length > 0) ? data.syllabus : [
              { title: "Pengenalan Materi", duration: "15 Menit" }
            ];
            
            // Calculate mock metadata sizes based on category / syllabus length
            let hours = 8;
            let quizzes = 4;
            const cat = (data.category || "").toLowerCase();
            if (cat.includes("math") || cat.includes("matematika")) {
              hours = 12;
              quizzes = 6;
            } else if (cat.includes("science") || cat.includes("ipa")) {
              hours = 18;
              quizzes = 10;
            } else if (cat.includes("coding") || cat.includes("program")) {
              hours = 24;
              quizzes = 14;
            }

            setLesson({
              id: data.id,
              name: data.title,
              level: data.level || "Beginner",
              description: data.description,
              lessonsCount: finalSyllabus.length,
              quizzesCount: data.questions && data.questions.length > 0 ? data.questions.length : quizzes,
              hoursCount: hours,
              iconType: data.category || "Matematika",
              syllabus: finalSyllabus,
              videoUrl: data.videoUrl || "",
              questions: data.questions || []
            });
          } else {
            setLesson(null);
          }
        })
        .catch((err) => {
          console.error("Error loading dynamic subject details from database:", err);
          setLoading(false);
          setLesson(null);
        });
    }
  }, [id]);

  useEffect(() => {
    if (!lesson) return;

    let startTimestamp = null;
    const duration = 1000;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setAnimatedLessons(Math.floor(progress * lesson.lessonsCount));
      setAnimatedQuizzes(Math.floor(progress * lesson.quizzesCount));
      setAnimatedHours(Math.floor(progress * lesson.hoursCount));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAnimatedLessons(lesson.lessonsCount);
        setAnimatedQuizzes(lesson.quizzesCount);
        setAnimatedHours(lesson.hoursCount);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [lesson]);

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
          <span className="text-xs font-bold uppercase tracking-widest text-white/70 animate-pulse">Memuat Materi...</span>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-center backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6">
          <h3 className="text-lg font-black uppercase tracking-wider text-red-400">Kelas Tidak Ditemukan</h3>
          <p className="text-xs text-white/60 leading-relaxed">Mata pelajaran yang Anda cari tidak terdaftar atau telah dihapus.</p>
          <button onClick={() => router.push("/library")} className="w-full py-3.5 bg-white text-black font-bold rounded-2xl text-xs active:scale-95 transition-all cursor-pointer">Kembali ke Library</button>
        </div>
      </div>
    );
  }

  const renderIcon = () => {
    const cat = (lesson.iconType || "").toLowerCase();
    if (cat.includes("math") || cat.includes("matematika")) return <GraduationCap className="w-10 h-10 text-black dark:text-white" />;
    if (cat.includes("science") || cat.includes("ipa")) return <FlaskConical className="w-10 h-10 text-black dark:text-white" />;
    if (cat.includes("coding") || cat.includes("program")) return <Code className="w-10 h-10 text-black dark:text-white" />;
    if (cat.includes("english") || cat.includes("inggris") || cat.includes("bahasa")) return <Globe className="w-10 h-10 text-black dark:text-white" />;
    return <GraduationCap className="w-10 h-10 text-black dark:text-white" />;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson.name,
        text: lesson.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Link pembelajaran berhasil disalin ke clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="min-h-screen pb-32 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-bold tracking-wider app-theme-text">Detail Pelajaran</span>
          
          <button
            onClick={handleShare}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-20 h-20 rounded-3xl bg-black/10 dark:bg-white/10 flex items-center justify-center border border-black/10 dark:border-white/20 mb-5 transform hover:rotate-6 transition-all duration-300">
            {renderIcon()}
          </div>
          
          <span className="px-3 py-1 bg-black/10 dark:bg-white/10 border border-[var(--border-color)] text-[10px] font-extrabold uppercase tracking-widest rounded-full app-theme-text-muted">
            {lesson.level}
          </span>
          
          <h1 className="text-3xl font-extrabold app-theme-text mt-3 tracking-tight leading-tight">
            {lesson.name}
          </h1>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 app-theme-card rounded-2xl py-3 px-4 shadow-lg text-center mt-2">
          <div>
            <span className="text-[10px] app-theme-text-muted block font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <BookOpen className="w-3 h-3" /> Lessons
            </span>
            <span className="text-lg font-bold app-theme-text mt-0.5 block">{animatedLessons}</span>
          </div>
          <div className="border-l border-[var(--border-color)]">
            <span className="text-[10px] app-theme-text-muted block font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3" /> Quizzes
            </span>
            <span className="text-lg font-bold app-theme-text mt-0.5 block">{animatedQuizzes}</span>
          </div>
          <div className="border-l border-[var(--border-color)]">
            <span className="text-[10px] app-theme-text-muted block font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Hours
            </span>
            <span className="text-lg font-bold app-theme-text mt-0.5 block">{animatedHours}h</span>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-2 mt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider app-theme-text-muted">TENTANG KELAS</h3>
          <p className="text-xs app-theme-text leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* List Lessons / Syllabus */}
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider app-theme-text-muted">DAFTAR MATERI</h3>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            {(showAllSyllabus ? lesson.syllabus : lesson.syllabus.slice(0, 4)).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => router.push(`/lesson/${id}/${idx}`)}
                className="cursor-pointer transition-transform active:scale-[0.97]"
              >
                <LessonItem 
                  title={item.title}
                  index={idx + 1}
                  duration={item.duration}
                />
              </div>
            ))}
          </div>

          {lesson.syllabus.length > 4 && (
            <button
              onClick={() => setShowAllSyllabus(!showAllSyllabus)}
              className="mt-2 w-full py-3 app-theme-card hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl text-xs font-bold text-[var(--text-color)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {showAllSyllabus ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
            </button>
          )}
        </div>

        {/* Kuis Section */}
        {lesson.questions && lesson.questions.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider app-theme-text-muted">KUIS EVALUASI</h3>
            <div className="p-5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3 border border-emerald-500/10 dark:border-emerald-500/25 bg-emerald-500/[0.02] backdrop-blur-md text-left shadow-lg">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <span className="text-xs font-black app-theme-text">Kuis Akhir Kelas</span>
                  <span className="text-[9px] app-theme-text-muted mt-1 uppercase font-semibold tracking-wider">
                    {lesson.questions.length} Pertanyaan Pilihan Ganda • KKM 60%
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-[10px] app-theme-text-muted leading-relaxed">
                Uji pemahaman Anda tentang materi ini untuk mendapatkan poin konsistensi dan memperpanjang streak belajar harian Anda.
              </p>
              <button
                onClick={() => {
                  setQuizActive(true);
                  setCurrentQIdx(0);
                  setSelectedAnswers({});
                  setQuizResult(null);
                }}
                className="mt-1.5 w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3.5 text-xs font-bold transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1 shadow-md"
              >
                Mulai Kuis Sekarang
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Action Button at the Bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2.5rem)] px-6 z-40 flex gap-3">
        <button
          onClick={() => {
            setIsFavorited(!isFavorited);
            alert(isFavorited ? "Dihapus dari Favorit!" : "Berhasil ditambah ke Favorit!");
          }}
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer shadow-md active:scale-95 flex-shrink-0 ${
            isFavorited 
              ? "bg-black/20 dark:bg-white/20 border-[var(--border-color)] text-[var(--text-color)]" 
              : "app-theme-card text-[var(--text-color)]/75 hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          aria-label="Add to Favorites"
        >
          <Bookmark className={`w-5 h-5 ${isFavorited ? "fill-[var(--text-color)]" : ""}`} />
        </button>

        <button
          onClick={() => {
            markAsCompleted();
            router.push("/");
          }}
          className="flex-grow bg-[var(--text-color)] hover:bg-[var(--text-color)]/90 py-4 rounded-2xl text-center font-bold text-sm text-[var(--bg-color)] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-in-out cursor-pointer border border-[var(--border-color)]"
        >
          START LESSONS
        </button>
      </div>

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
                  <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">{lesson.name}</h3>
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
                    onClick={() => setQuizActive(false)}
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
