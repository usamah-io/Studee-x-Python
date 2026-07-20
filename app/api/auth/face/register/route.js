export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(request) {
  try {
    const { email, faceDescriptor } = await request.json();

    if (!email || !faceDescriptor || !Array.isArray(faceDescriptor)) {
      return NextResponse.json(
        { success: false, error: "Email dan data Face ID (descriptor) diperlukan." },
        { status: 400 }
      );
    }

    // Update atau buat user faceDescriptor di MongoDB menggunakan upsert
    const emailLower = email.toLowerCase();
    const updatedUser = await prisma.user.upsert({
      where: { email: emailLower },
      update: { faceDescriptor },
      create: {
        email: emailLower,
        name: email.split("@")[0],
        streak: 0,
        faceDescriptor,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Face ID berhasil didaftarkan!",
      user: { email: updatedUser.email, name: updatedUser.name },
    });
  } catch (error) {
    console.error("Gagal mendaftarkan Face ID:", error);
    return NextResponse.json(
      { success: false, error: `Terjadi kesalahan internal server: ${error.message || error}` },
      { status: 500 }
    );
  }
}
