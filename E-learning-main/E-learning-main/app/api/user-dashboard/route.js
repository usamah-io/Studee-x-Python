import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let totalStudyTime = 0;
    let streakCount = 0;
    let lastStudyDate = null;

    if (email) {
      // Find or create user
      let dbUser = await prisma.user.findUnique({
        where: { email },
        include: { logs: true }
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0],
            streak: 0
          },
          include: { logs: true }
        });
      }

      // Calculate real stats
      totalStudyTime = dbUser.logs.reduce((sum, log) => sum + log.duration, 0);
      streakCount = dbUser.streak;

      if (dbUser.logs.length > 0) {
        const sortedLogs = [...dbUser.logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        lastStudyDate = sortedLogs[0].date.toISOString().split("T")[0];
      }
    }

    let dbSubjects = await prisma.subject.findMany();
    
    // Seed default subjects if database is empty
    if (dbSubjects.length === 0) {
      const defaultSeedSubjects = [
        {
          title: "Dasar-Dasar Aljabar Linear",
          description: "Pengenalan sistem persamaan linear, matriks, determinan, dan vektor ruang.",
          category: "Matematika",
          driveLink: "https://drive.google.com/drive/folders/math101",
          videoUrl: "https://www.youtube.com/watch?v=fNk_zzaMoEs",
          quizStatus: "Sudah Ada",
        },
        {
          title: "Struktur Sel & Fungsi Organel",
          description: "Membedakan sel hewan dan tumbuhan, serta peran ribosom, mitokondria, dan nukleus.",
          category: "Science",
          driveLink: "https://drive.google.com/drive/folders/bio202",
          videoUrl: "https://www.youtube.com/watch?v=URUJD5NEXC8",
          quizStatus: "Belum Ada",
        },
        {
          title: "Pengembangan Rute Dinamis Next.js",
          description: "Bagaimana cara membuat halaman detail dinamis menggunakan router.push dan file folder opsional.",
          category: "Coding",
          driveLink: "https://drive.google.com/drive/folders/dev303",
          videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
          quizStatus: "Sudah Ada",
        }
      ];
      await prisma.subject.createMany({
        data: defaultSeedSubjects
      });
      dbSubjects = await prisma.subject.findMany();
    }

    // Map database subjects to UI courses with styling defaults
    const courseList = dbSubjects.map((subj) => {
      const category = (subj.category || "").toLowerCase();
      let color = "from-blue-400 to-indigo-500";
      let icon = "Globe";
      let level = "Beginner";
      let duration = "8 Jam";
      let hasCertificate = false;
      let defaultProgress = 0;

      if (category.includes("math") || category.includes("matematika")) {
        color = "from-amber-400 to-orange-500";
        icon = "GraduationCap";
        level = "Intermediate";
        duration = "12 Jam";
        hasCertificate = true;
        defaultProgress = 0;
      } else if (category.includes("science") || category.includes("ipa")) {
        color = "from-teal-400 to-emerald-500";
        icon = "FlaskConical";
        level = "Advanced";
        duration = "18 Jam";
        hasCertificate = true;
        defaultProgress = 0;
      } else if (category.includes("coding") || category.includes("program")) {
        color = "from-purple-400 to-pink-500";
        icon = "Code";
        level = "Beginner to Pro";
        duration = "24 Jam";
        hasCertificate = true;
        defaultProgress = 0;
      }

      return {
        id: subj.id,
        name: subj.title,
        title: subj.title,
        description: subj.description,
        category: subj.category,
        driveLink: subj.driveLink,
        videoUrl: subj.videoUrl,
        quizStatus: subj.quizStatus,
        progress: defaultProgress,
        color,
        icon,
        level,
        duration,
        hasCertificate,
      };
    });

    const data = {
      stats: {
        totalStudyTime: totalStudyTime || 185, // Fallback to initial dummy data if newly created user
        streakCount: streakCount || 2,         // Fallback to initial dummy data if newly created user
        lastStudyDate: lastStudyDate || "2026-07-01",
      },
      courseList,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET API user-dashboard Error:", error);
    return NextResponse.json({ error: "Gagal memproses data dashboard." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, duration } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Find or create user
    let dbUser = await prisma.user.findUnique({
      where: { email },
      include: { logs: true }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          streak: 0
        },
        include: { logs: true }
      });
    }

    // Calculate if we should increment streak
    const todayStr = new Date().toISOString().split("T")[0];
    const studiedToday = dbUser.logs.some(log => log.date.toISOString().split("T")[0] === todayStr);

    let newStreak = dbUser.streak;
    if (!studiedToday) {
      newStreak = dbUser.streak + 1;
    }

    // Create study log
    const newLog = await prisma.dailyLog.create({
      data: {
        userId: dbUser.id,
        duration: duration || 30
      }
    });

    // Update user streak count in DB
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        streak: newStreak
      }
    });

    return NextResponse.json({ success: true, user: updatedUser, log: newLog });
  } catch (error) {
    console.error("POST API user-dashboard Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan log belajar." }, { status: 500 });
  }
}
