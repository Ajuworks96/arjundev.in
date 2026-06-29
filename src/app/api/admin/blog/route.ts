import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await db.article.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(articles);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, tags, categories, draft, seoTitle, seoDescription } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        tags: tags || [],
        categories: categories || [],
        draft: draft ?? true,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        publishedAt: draft ? null : new Date(),
      }
    });

    return NextResponse.json(article, { status: 201 });
  } catch (e) {
    console.error("Error creating article:", e);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, content, tags, categories, draft, seoTitle, seoDescription } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: "ID, title, and slug are required" }, { status: 400 });
    }

    const currentArticle = await db.article.findUnique({
      where: { id }
    });

    if (!currentArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const publishedAt = currentArticle.draft && !draft ? new Date() : currentArticle.publishedAt;

    const article = await db.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        tags: tags || [],
        categories: categories || [],
        draft: draft ?? true,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        publishedAt,
      }
    });

    return NextResponse.json(article);
  } catch (e) {
    console.error("Error updating article:", e);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
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
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.article.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (e) {
    console.error("Error deleting article:", e);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
