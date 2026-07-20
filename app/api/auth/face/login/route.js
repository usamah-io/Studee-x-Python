export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

// Fungsi helper untuk menghitung Euclidean Distance antara dua face descriptors (128-dimensi)
function getEuclideanDistance(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2);
  }
  return Math.sqrt(sum);
}

export async function POST(request) {
  try {
    const { faceDescriptor } = await request.json();

    if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
      return NextResponse.json(
        { success: false, error: "Data biometrik wajah tidak valid." },
        { status: 400 }
      );
    }

    // Ambil semua user dan filter yang memiliki data Face ID valid (128-dimensi) di memory
    const allUsers = await prisma.user.findMany();
    const users = allUsers.filter(user => user.faceDescriptor && user.faceDescriptor.length === 128);

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Belum ada wajah terdaftar di database." },
        { status: 404 }
      );
    }

    let bestMatchUser = null;
    let minDistance = Infinity;

    // Bandingkan faceDescriptor dengan semua user
    for (const user of users) {
      const distance = getEuclideanDistance(faceDescriptor, user.faceDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatchUser = user;
      }
    }

    // Default threshold dari face-api.js untuk pencocokan wajah adalah < 0.6.
    // Untuk keamanan yang lebih ketat, kita gunakan < 0.5.
    const THRESHOLD = 0.5;

    if (minDistance <= THRESHOLD && bestMatchUser) {
      // Tentukan role berdasarkan email
      const emailLower = bestMatchUser.email.toLowerCase();
      const role = (emailLower === "admin@example.com" || emailLower === "admin@stry.com") ? "admin" : "user";

      return NextResponse.json({
        success: true,
        message: "Login Face ID berhasil!",
        user: {
          email: bestMatchUser.email,
          name: bestMatchUser.name || bestMatchUser.email.split("@")[0],
          role: role
        },
        distance: minDistance
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Wajah tidak cocok dengan akun manapun.", distance: minDistance },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Gagal melakukan verifikasi Face ID:", error);
    return NextResponse.json(
      { success: false, error: `Terjadi kesalahan internal server: ${error.message || error}` },
      { status: 500 }
    );
  }
}
