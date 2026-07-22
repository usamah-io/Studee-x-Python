// app/api/live-class/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
let mongoClient = null;

async function getDb() {
  if (!uri) {
    throw new Error("DATABASE_URL atau MONGODB_URI tidak dikonfigurasi di environment variables.");
  }
  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
  }
  return mongoClient.db();
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection("Settings");
    let liveClass = await collection.findOne({ key: "liveClassLink" });

    if (!liveClass) {
      // Seed default link if not exists
      const defaultDoc = { key: "liveClassLink", link: "https://meet.google.com" };
      await collection.insertOne(defaultDoc);
      liveClass = defaultDoc;
    }

    return NextResponse.json({ link: liveClass.link });
  } catch (error) {
    console.error("GET Live Class Error:", error);
    return NextResponse.json({ link: "https://meet.google.com", error: "Gagal mengambil link dari database." });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const collection = db.collection("Settings");
    const { link } = await request.json();

    if (!link || link.trim() === "") {
      return NextResponse.json({ error: "Link wajib diisi." }, { status: 400 });
    }

    const trimmedLink = link.trim();
    if (!trimmedLink.startsWith("http://") && !trimmedLink.startsWith("https://")) {
      return NextResponse.json({ error: "Link harus berformat URL valid (diawali http:// atau https://)." }, { status: 400 });
    }

    await collection.updateOne(
      { key: "liveClassLink" },
      { $set: { link: trimmedLink } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, link: trimmedLink });
  } catch (error) {
    console.error("POST Live Class Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan link ke database." }, { status: 500 });
  }
}
