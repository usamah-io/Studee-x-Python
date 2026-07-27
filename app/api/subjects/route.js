// app/api/subjects/route.js
export const dynamic = "force-dynamic";
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

// GET: Fetch all subjects or a single subject by ID from MongoDB Atlas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      if (id.length === 24) {
        const subject = await prisma.subject.findUnique({
          where: { id }
        });
        if (!subject) {
          return NextResponse.json({ error: "Mata pelajaran tidak ditemukan." }, { status: 404 });
        }
        return NextResponse.json(subject);
      } else {
        // Fallback for static identifiers
        const subject = await prisma.subject.findFirst({
          where: {
            OR: [
              { category: { contains: id, mode: "insensitive" } },
              { title: { contains: id, mode: "insensitive" } }
            ]
          }
        });
        if (subject) {
          return NextResponse.json(subject);
        }
      }
    }

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
    console.error("GET API Error (Detailed Stack):", error);
    // Fallback to default seed subjects if DB is unreachable to prevent UI 500 error
    return NextResponse.json(defaultSeedSubjects);
  }
}

// POST: Save new subject or update an existing one
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, title, description, category, driveLink, videoUrl, quizStatus, questions, syllabus } = body;

    // Validasi field minimal yang wajib diisi
    if (!title || title.trim() === "" || !description || description.trim() === "") {
      return NextResponse.json({ 
        error: "Validasi Gagal: Judul (title) dan Deskripsi (description) wajib diisi." 
      }, { status: 400 });
    }

    const safeCategory = (category && category.trim() !== "") ? category.trim() : "General";
    const safeDriveLink = (driveLink && driveLink.trim() !== "") ? driveLink.trim() : "";

    let result;

    if (id && id.length === 24) {
      // Update Mode
      result = await prisma.subject.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description.trim(),
          category: safeCategory,
          driveLink: safeDriveLink,
          videoUrl: videoUrl ? videoUrl.trim() : null,
          quizStatus: quizStatus || "Belum Ada",
          questions: questions || [],
          syllabus: syllabus || []
        }
      });
    } else {
      // Create Mode
      result = await prisma.subject.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          category: safeCategory,
          driveLink: safeDriveLink,
          videoUrl: videoUrl ? videoUrl.trim() : null,
          quizStatus: quizStatus || "Belum Ada",
          questions: questions || [],
          syllabus: syllabus || []
        }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST API Error (Detailed Stack):", error);
    return NextResponse.json({ 
      error: "Gagal memproses data materi di database.",
      details: error.message || String(error)
    }, { status: 500 });
  }
}

// PUT: Partial update for subject (e.g. updating syllabus, questions, or specific fields)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, category, driveLink, videoUrl, quizStatus, questions, syllabus } = body;

    if (!id) {
      return NextResponse.json({ error: "ID materi diperlukan." }, { status: 400 });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category.trim();
    if (driveLink !== undefined) updateData.driveLink = driveLink.trim();
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl ? videoUrl.trim() : null;
    if (quizStatus !== undefined) updateData.quizStatus = quizStatus;
    if (questions !== undefined) updateData.questions = questions;
    if (syllabus !== undefined) updateData.syllabus = syllabus;

    const result = await prisma.subject.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT API Error (Detailed Stack):", error);
    return NextResponse.json({ 
      error: "Gagal memperbarui data materi di database.",
      details: error.message || String(error)
    }, { status: 500 });
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
    console.error("DELETE API Error (Detailed Stack):", error);
    return NextResponse.json({ 
      error: "Gagal menghapus data materi dari database.",
      details: error.message || String(error)
    }, { status: 500 });
  }
}
