// app/api/admins/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;
let mongoClient = null;

async function getDb() {
  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
  }
  return mongoClient.db();
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("AdminEmail");
    let admins = await collection.find({}).toArray();

    if (admins.length === 0) {
      // Seed default admin emails if collection is empty
      const defaultAdmins = [
        { email: "muhammadusamahabdurrahman@gmail.com" },
        { email: "admin@stry.com" },
        { email: "admin@example.com" }
      ];
      await collection.insertMany(defaultAdmins);
      admins = await collection.find({}).toArray();
    }

    // Map _id to id string representation for client convenience
    const mappedAdmins = admins.map(a => ({
      id: a._id.toString(),
      email: a.email
    }));

    return NextResponse.json(mappedAdmins);
  } catch (error) {
    console.error("GET Admin Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data admin dari database." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const collection = db.collection("AdminEmail");
    const { email } = await request.json();

    if (!email || email.trim() === "") {
      return NextResponse.json({ error: "Email diperlukan." }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const existing = await collection.findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json({ error: "Email admin sudah terdaftar." }, { status: 400 });
    }

    const result = await collection.insertOne({ email: emailLower });
    return NextResponse.json({ id: result.insertedId.toString(), email: emailLower });
  } catch (error) {
    console.error("POST Admin Error:", error);
    return NextResponse.json({ error: "Gagal menambahkan admin ke database." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = await getDb();
    const collection = db.collection("AdminEmail");
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email diperlukan." }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    if (emailLower === "muhammadusamahabdurrahman@gmail.com") {
      return NextResponse.json({ error: "Super admin tidak dapat dihapus." }, { status: 400 });
    }

    const result = await collection.deleteOne({ email: emailLower });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Admin tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: emailLower });
  } catch (error) {
    console.error("DELETE Admin Error:", error);
    return NextResponse.json({ error: "Gagal menghapus admin dari database." }, { status: 500 });
  }
}
