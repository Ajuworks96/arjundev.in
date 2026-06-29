import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(projects);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, category, client, role, duration, technologies, problem, result, githubUrl, liveUrl, featured, status, seoTitle, seoDescription } = body;

    if (!title || !slug || !category || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        slug,
        category,
        client: client || "",
        role: role || "",
        duration: duration || "",
        technologies: technologies || [],
        problem: problem || "",
        result,
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        featured: featured || false,
        status: status || "Draft",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error("Error creating project:", e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, slug, category, client, role, duration, technologies, problem, result, githubUrl, liveUrl, featured, status, seoTitle, seoDescription } = body;

    if (!id || !title || !slug) {
      return NextResponse.json({ error: "Project ID, title, and slug are required" }, { status: 400 });
    }

    const project = await db.project.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        client: client || "",
        role: role || "",
        duration: duration || "",
        technologies: technologies || [],
        problem: problem || "",
        result,
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        featured: featured || false,
        status: status || "Draft",
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      }
    });

    return NextResponse.json(project);
  } catch (e) {
    console.error("Error updating project:", e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await db.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (e) {
    console.error("Error deleting project:", e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
