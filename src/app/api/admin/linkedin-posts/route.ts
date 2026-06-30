import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await db.linkedinPost.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Failed to fetch LinkedIn posts:", e);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, url, description, date } = body;

    if (!title || !url || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await db.linkedinPost.create({
      data: {
        title,
        url,
        description,
        date: date || new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      }
    });

    return NextResponse.json(post);
  } catch (e) {
    console.error("Error creating LinkedIn post:", e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await db.linkedinPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting LinkedIn post:", e);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
