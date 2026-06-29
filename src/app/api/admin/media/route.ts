import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const items = await db.mediaItem.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as any;
    const altText = formData.get("altText") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads folder inside public/ if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name to prevent collisions
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${fileName}`;

    const mediaItem = await db.mediaItem.create({
      data: {
        url: relativeUrl,
        filename: file.name,
        mimeType: file.type || "image/jpeg",
        size: file.size || buffer.length,
        altText: altText || "",
      }
    });

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (e) {
    console.error("Error uploading file:", e);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Media item ID is required" }, { status: 400 });
    }

    await db.mediaItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Media metadata deleted successfully" });
  } catch (e) {
    console.error("Error deleting media item:", e);
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 });
  }
}
