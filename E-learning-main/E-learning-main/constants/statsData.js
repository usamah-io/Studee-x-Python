// constants/statsData.js

export const statsData = {
  totalStudyTime: 185, // total belajar dalam menit
  streakCount: 5,
  lastStudyDate: "2026-07-01", // Tanggal terakhir belajar (YYYY-MM-DD)
  courseList: [
    {
      id: "mtk",
      name: "Matematika (MTK)",
      level: "Intermediate",
      progress: 80,
      color: "from-amber-400 to-orange-500",
      icon: "GraduationCap",
    },
    {
      id: "science",
      name: "Science (IPA)",
      level: "Advanced",
      progress: 65,
      color: "from-teal-400 to-emerald-500",
      icon: "FlaskConical",
    },
    {
      id: "coding",
      name: "Coding & Algoritma",
      level: "Beginner to Pro",
      progress: 92,
      color: "from-purple-400 to-pink-500",
      icon: "Code",
    },
    {
      id: "english",
      name: "Bahasa Inggris",
      level: "Beginner",
      progress: 45,
      color: "from-blue-400 to-indigo-500",
      icon: "Globe",
    },
  ],
};

/**
 * Memeriksa apakah pengguna telah belajar hari ini berdasarkan lastStudyDate.
 * @param {string} lastStudyDate - Tanggal terakhir belajar dengan format YYYY-MM-DD
 * @returns {boolean} true jika pengguna telah belajar hari ini, false jika belum
 */
export function calculateStreakStatus(lastStudyDate) {
  if (!lastStudyDate) return false;
  
  // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD sesuai dengan zona waktu lokal
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayString = `${year}-${month}-${day}`;
  
  return lastStudyDate === todayString;
}
