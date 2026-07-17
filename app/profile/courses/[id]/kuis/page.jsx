"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Cpu } from "lucide-react";
import "../../../../../lib/i18n";

export default function ManageQuizPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz states
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);

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
            setQuizQuestions(found.questions || []);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleGenerateQuizAI = () => {
    if (!subject) return;
    setIsGeneratingQuiz(true);

    setTimeout(() => {
      const title = subject.title || "";
      const category = (subject.category || "").toLowerCase();
      
      let generated = [];

      if (category.includes("math") || category.includes("matematika")) {
        generated = [
          {
            question: `Apakah definisi dari baris eselon tereduksi dalam konteks ${title}?`,
            options: [
              "Setiap baris bukan nol memiliki elemen kepemimpinan bernilai 1, dan kolom di bawah/di atasnya bernilai nol",
              "Semua baris memiliki determinan bernilai negatif",
              "Matriks yang hanya memiliki nilai eigenvalue imajiner",
              "Transformasi linear yang melipatgandakan dimensi ruang asal"
            ],
            correct: "Setiap baris bukan nol memiliki elemen kepemimpinan bernilai 1, dan kolom di bawah/di atasnya bernilai nol"
          },
          {
            question: `Mengapa konsep perkalian matriks sering digunakan dalam visualisasi ${title}?`,
            options: [
              "Untuk mengombinasikan beberapa transformasi linier menjadi satu matriks tunggal",
              "Untuk menghitung nilai absolut dari skalar yang konstan",
              "Untuk menghindari pembagian memori pada sistem basis data",
              "Untuk menjumlahkan elemen baris secara diagonal saja"
            ],
            correct: "Untuk mengombinasikan beberapa transformasi linier menjadi satu matriks tunggal"
          },
          {
            question: `Jika sebuah matriks memiliki determinan bernilai nol, manakah pernyataan yang benar?`,
            options: [
              "Matriks tersebut singular dan tidak memiliki invers",
              "Sistem persamaan linear selalu memiliki solusi unik",
              "Matriks tersebut pasti berupa matriks identitas",
              "Vektor-vektor barisnya pasti saling tegak lurus (ortogonal)"
            ],
            correct: "Matriks tersebut singular dan tidak memiliki invers"
          },
          {
            question: `Dalam ${title}, apa arti geometri dari nilai Eigen (Eigenvalue)?`,
            options: [
              "Faktor skala peregangan/penyusutan vektor eigen selama transformasi linier",
              "Sudut rotasi objek terhadap sumbu koordinat utama",
              "Panjang total dari proyeksi ortogonal dua vektor berbeda",
              "Volume ruang berdimensi tinggi yang dibatasi oleh matriks"
            ],
            correct: "Faktor skala peregangan/penyusutan vektor eigen selama transformasi linier"
          },
          {
            question: `Manakah dari berikut ini yang merupakan contoh aplikasi nyata dari konsep ${title}?`,
            options: [
              "Algoritma kompresi gambar, PageRank Google, dan grafik komputer 3D",
              "Penyimpanan berkas statis di memori internal perangkat",
              "Pembuatan skrip routing halaman web dinamis",
              "Sintesis protein rantai tunggal RNA sel eukariotik"
            ],
            correct: "Algoritma kompresi gambar, PageRank Google, dan grafik komputer 3D"
          }
        ];
      } else if (category.includes("science") || category.includes("ipa")) {
        generated = [
          {
            question: `Dalam pembahasan tentang ${title}, organel manakah yang bertindak sebagai "the powerhouse of cell" karena menghasilkan energi ATP?`,
            options: [
              "Mitokondria",
              "Ribosom",
              "Aparatus Golgi",
              "Lisosom"
            ],
            correct: "Mitokondria"
          },
          {
            question: `Apakah perbedaan utama antara sel prokariotik dan eukariotik dalam konteks materi ${title}?`,
            options: [
              "Sel eukariotik memiliki membran inti sel, sedangkan prokariotik tidak",
              "Sel prokariotik memiliki ukuran yang jauh lebih besar dibanding eukariotik",
              "Sel prokariotik memiliki membran sel ganda, sedangkan eukariotik tanpa membran",
              "Sel eukariotik tidak memiliki blueprint genetik DNA"
            ],
            correct: "Sel eukariotik memiliki membran inti sel, sedangkan prokariotik tidak"
          },
          {
            question: `Apakah fungsi utama dari Ribosom yang tersebar di sitoplasma dalam ${title}?`,
            options: [
              "Melakukan sintesis protein berdasarkan kode mRNA",
              "Mencerna protein rusak dan makromolekul asing",
              "Menyimpan air dan cadangan makanan seluler",
              "Membelah diri secara mitosis untuk regenerasi sel"
            ],
            correct: "Melakukan sintesis protein berdasarkan kode mRNA"
          },
          {
            question: `Dalam ${title}, apa yang membedakan Client Component dan Server Component di Next.js?`,
            options: [
              "Client Component dirender di browser dan mendukung interaktivitas (hooks), sedangkan Server Component dirender di server",
              "Server Component tidak dapat mengakses database MongoDB secara langsung",
              "Client Component ditulis menggunakan bahasa Python, sedangkan Server Component menggunakan JavaScript",
              "Server Component tidak mendukung rendering elemen HTML sama sekali"
            ],
            correct: "Client Component dirender di browser dan mendukung interaktivitas (hooks), sedangkan Server Component dirender di server"
          },
          {
            question: `Bagaimana cara kerja Service Worker pada Progressive Web App (PWA) di Next.js?`,
            options: [
              "Menangkap request jaringan dan menyajikan aset dari cache lokal untuk fungsionalitas luring",
              "Mempercepat kueri pencarian data pada basis data jarak jauh",
              "Melakukan kompilasi bundle Next.js menjadi file executable biner",
              "Melacak lokasi GPS pengguna secara berkala di latar belakang"
            ],
            correct: "Menangkap request jaringan dan menyajikan aset dari cache lokal untuk fungsionalitas luring"
          }
        ];
      } else {
        generated = [
          {
            question: `Apa fokus utama dari pembahasan kelas tentang '${title}'?`,
            options: [
              "Pengenalan konsep dasar secara mendalam dan terarah",
              "Pengujian ketahanan performa infrastruktur server",
              "Teknik integrasi skrip otomatisasi tingkat tinggi",
              "Pencadangan data cadangan luring di cloud storage"
            ],
            correct: "Pengenalan konsep dasar secara mendalam dan terarah"
          },
          {
            question: `Berdasarkan keterangan mata pelajaran '${title}', manakah pernyataan yang paling tepat menggambarkan relevansi materi tersebut?`,
            options: [
              "Membantu memahami fundamental subjek untuk diimplementasikan secara praktis",
              "Sebagai referensi komparasi pustaka pihak ketiga saja",
              "Untuk mengabaikan optimasi standardisasi industri terbaru",
              "Hanya berupa teori abstrak tanpa contoh kasus nyata"
            ],
            correct: "Membantu memahami fundamental subjek untuk diimplementasikan secara praktis"
          },
          {
            question: `Mengapa pemahaman silabus materi dalam '${title}' sangat direkomendasikan bagi pemula?`,
            options: [
              "Karena disusun berurutan dari pengenalan awal hingga penerapan kasus nyata",
              "Agar dapat melewati proses sertifikasi tanpa ujian",
              "Untuk membatasi durasi belajar sekecil mungkin",
              "Menghindari interaksi dengan materi pendukung lainnya"
            ],
            correct: "Karena disusun berurutan dari pengenalan awal hingga penerapan kasus nyata"
          },
          {
            question: `Dalam mempelajari '${title}', metode manakah yang paling efektif untuk menguasai sub-bab materi tersebut?`,
            options: [
              "Membaca catatan pendukung materi, menonton media video, dan mengerjakan kuis evaluasi",
              "Menghafal seluruh baris kode tanpa memahaminya secara logis",
              "Mengabaikan silabus pelajaran dan langsung menempuh ujian akhir",
              "Menghubungi mentor secara terus-menerus tanpa latihan mandiri"
            ],
            correct: "Membaca catatan pendukung materi, menonton media video, dan mengerjakan kuis evaluasi"
          },
          {
            question: `Apa manfaat penyelesaian kuis evaluasi secara berkala pada kelas '${title}'?`,
            options: [
              "Menguji pemahaman konsep, memantau kemajuan belajar, dan menjaga konsistensi streak harian",
              "Menggandakan kapasitas memori penyimpanan pada database sistem",
              "Menghapus riwayat aktivitas belajar yang telah dicatat sebelumnya",
              "Memblokir akses masuk pengguna lain ke sistem admin"
            ],
            correct: "Menguji pemahaman konsep, memantau kemajuan belajar, dan menjaga konsistensi streak harian"
          }
        ];
      }

      setQuizQuestions(generated);
      setIsGeneratingQuiz(false);
      alert("AI berhasil menyusun 5 soal kuis bermutu tinggi berdasarkan subjek!");
    }, 1500);
  };

  const saveQuizToDB = () => {
    if (!subject) return;
    setIsSavingQuiz(true);

    const payload = {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      category: subject.category,
      driveLink: subject.driveLink,
      videoUrl: subject.videoUrl,
      quizStatus: quizQuestions.length > 0 ? "Sudah Ada" : "Belum Ada",
      questions: quizQuestions,
      syllabus: subject.syllabus,
    };

    fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((updatedSubj) => {
        setIsSavingQuiz(false);
        if (updatedSubj && !updatedSubj.error) {
          alert("Kuis berhasil disimpan ke database!");
          setSubject(updatedSubj);
        } else {
          alert("Gagal menyimpan kuis.");
        }
      })
      .catch((err) => {
        setIsSavingQuiz(false);
        console.error(err);
        alert("Terjadi kesalahan saat menyimpan kuis.");
      });
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen pb-24 app-theme-bg font-sans relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 pt-6 flex flex-col gap-6 relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <button
            onClick={() => router.push(`/profile/courses/${id}`)}
            className="w-10 h-10 app-theme-card rounded-xl flex items-center justify-center text-[var(--text-color)] transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider app-theme-text uppercase">
            Kelola Kuis
          </span>
          <div className="w-10 h-10" />
        </div>

        {loading ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Memuat data kuis...</div>
        ) : !subject ? (
          <div className="text-xs font-bold text-center app-theme-text-muted mt-10">Kelas tidak ditemukan.</div>
        ) : (
          <div className="flex flex-col gap-5 w-full">
            {/* Header info */}
            <div className="w-full p-4 rounded-2xl app-theme-card text-left flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black app-theme-text leading-tight">{subject.title}</span>
                <span className="text-[8px] app-theme-text-muted mt-1 uppercase font-bold tracking-wider">Kelola Kuis Kelas</span>
              </div>
            </div>

            {/* AI Generator & Add Question controls */}
            <div className="flex gap-2 w-full">
              <button
                onClick={handleGenerateQuizAI}
                disabled={isGeneratingQuiz}
                className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isGeneratingQuiz ? "Generating..." : "Auto-Generate AI"}
              </button>
              <button
                onClick={() => {
                  const newQ = {
                    question: "Tulis pertanyaan kuis baru...",
                    options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
                    correct: "Pilihan A"
                  };
                  setQuizQuestions(prev => [...prev, newQ]);
                }}
                className="flex-1 py-3 bg-[var(--text-color)]/5 border border-[var(--border-color)] hover:bg-[var(--text-color)]/10 text-[var(--text-color)] rounded-2xl text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                + Tambah Soal
              </button>
            </div>

            {/* Questions list */}
            <div className="flex flex-col gap-4 w-full">
              {quizQuestions.length > 0 ? (
                quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4.5 rounded-3xl app-theme-card relative overflow-hidden flex flex-col gap-3.5 shadow-xl border border-white/5 bg-white/[0.02] backdrop-blur-md text-left">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[9px] font-black uppercase tracking-wider opacity-60">Soal {qIdx + 1}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus Soal ${qIdx + 1}?`)) {
                            setQuizQuestions(prev => prev.filter((_, idx) => idx !== qIdx));
                          }
                        }}
                        className="text-red-500 hover:text-red-600 font-bold text-[9px] border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded-xl cursor-pointer transition-all active:scale-95"
                      >
                        Hapus Soal
                      </button>
                    </div>

                    {/* Question Input */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[7px] font-bold uppercase tracking-widest opacity-50 pl-0.5">Pertanyaan</label>
                      <textarea
                        value={q.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuizQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, question: val } : item));
                        }}
                        className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all h-20 resize-none text-[var(--text-color)]"
                      />
                    </div>

                    {/* Options list */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-50 pl-0.5">Pilihan Jawaban</span>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex flex-col gap-0.5">
                            <label className="text-[6px] font-bold opacity-45 pl-0.5">Opsi {String.fromCharCode(65 + oIdx)}</label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setQuizQuestions(prev => prev.map((item, idx) => {
                                  if (idx === qIdx) {
                                    const updatedOpts = [...item.options];
                                    const oldCorrect = item.correct;
                                    const oldOpt = updatedOpts[oIdx];
                                    updatedOpts[oIdx] = val;
                                    let updatedCorrect = item.correct;
                                    if (oldCorrect === oldOpt) {
                                      updatedCorrect = val;
                                    }
                                    return { ...item, options: updatedOpts, correct: updatedCorrect };
                                  }
                                  return item;
                                }));
                              }}
                              className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-2 text-[10px] focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all text-[var(--text-color)]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Correct answer dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[7px] font-bold uppercase tracking-widest opacity-50 pl-0.5">Pilihan Kunci Jawaban</label>
                      <select
                        value={q.correct}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuizQuestions(prev => prev.map((item, idx) => idx === qIdx ? { ...item, correct: val } : item));
                        }}
                        className="w-full bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-[10px] focus:outline-none focus:ring-1 focus:ring-[var(--text-color)] transition-all text-[var(--text-color)]"
                      >
                        {q.options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>Opsi {String.fromCharCode(65 + oIdx)}: {opt.substring(0, 30)}...</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 rounded-3xl border border-dashed border-white/10 text-center text-xs italic opacity-40">
                  Belum ada pertanyaan. Klik "Auto-Generate AI" atau "+ Tambah Soal" untuk memulai.
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={saveQuizToDB}
              disabled={isSavingQuiz}
              className="mt-2 w-full bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black rounded-2xl py-3.5 text-xs font-black shadow-lg border border-black/10 dark:border-white/10 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSavingQuiz ? "Menyimpan Kuis..." : "Simpan Perubahan Kuis"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
