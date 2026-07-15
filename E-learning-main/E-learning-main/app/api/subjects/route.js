// app/api/subjects/route.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Default seed data to populate database if empty
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

// GET: Fetch all subjects from MongoDB Atlas
export async function GET() {
  try {
    let subjects = await prisma.subject.findMany();
    
    // Seed default subjects if database is empty
    if (subjects.length === 0) {
      await prisma.subject.createMany({
        data: defaultSeedSubjects
      });
      subjects = await prisma.subject.findMany();
    }
    
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data materi dari database." }, { status: 500 });
  }
}

// POST: Save new subject or update an existing one
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, title, description, category, driveLink, videoUrl, quizStatus, questions, syllabus } = body;

    let result;

    if (id && id.length === 24) {
      // Update Mode
      result = await prisma.subject.update({
        where: { id },
        data: {
          title,
          description,
          category,
          driveLink,
          videoUrl,
          quizStatus,
          questions,
          syllabus
        }
      });
    } else {
      // Create Mode
      result = await prisma.subject.create({
        data: {
          title,
          description,
          category,
          driveLink,
          videoUrl,
          quizStatus: quizStatus || "Belum Ada",
          questions: questions || [],
          syllabus: syllabus || []
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST API Error:", error);
    return NextResponse.json({ error: "Gagal memproses data materi di database." }, { status: 500 });
  }
}

// DELETE: Delete subject
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "ID materi diperlukan." }, { status: 400 });
    }

    const result = await prisma.subject.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, deleted: result });
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json({ error: "Gagal menghapus data materi dari database." }, { status: 500 });
  }
}
