import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SuperAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await db.course.findMany({
      include: {
        modules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" }
            }
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });
    return NextResponse.json(courses);
  } catch (e) {
    console.error("Failed to fetch admin courses data:", e);
    return NextResponse.json({ error: "Failed to load admin courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SuperAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!action || !payload) {
      return NextResponse.json({ error: "Missing action or payload parameters" }, { status: 400 });
    }

    if (action === "createCourse") {
      const { title, slug, description, duration, difficulty } = payload;
      const course = await db.course.create({
        data: {
          title,
          slug,
          description,
          duration: duration || "3 Hours",
          difficulty: difficulty || "Beginner"
        }
      });
      return NextResponse.json({ success: true, course });
    }

    if (action === "createModule") {
      const { title, description, courseId, orderIndex } = payload;
      const module = await db.module.create({
        data: {
          title,
          description,
          courseId,
          orderIndex: orderIndex || 0
        }
      });
      return NextResponse.json({ success: true, module });
    }

    if (action === "createLesson") {
      const { 
        title, slug, introMalayalam, explanation, realLifeExample, 
        visualConcept, practicalDemo, summary, miniChallenge, 
        videoUrl, durationMinutes, moduleId, orderIndex 
      } = payload;

      const lesson = await db.lesson.create({
        data: {
          title,
          slug,
          introMalayalam,
          explanation,
          realLifeExample,
          visualConcept: visualConcept || "",
          practicalDemo: practicalDemo || "",
          summary,
          miniChallenge: miniChallenge || "",
          videoUrl: videoUrl || "",
          durationMinutes: durationMinutes || 10,
          moduleId,
          orderIndex: orderIndex || 0
        }
      });
      return NextResponse.json({ success: true, lesson });
    }

    return NextResponse.json({ error: "Unknown action parameter" }, { status: 400 });
  } catch (e) {
    console.error("Admin courses POST execution error:", e);
    return NextResponse.json({ error: "Failed to perform operation" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SuperAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!action || !payload || !payload.id) {
      return NextResponse.json({ error: "Missing action, payload, or id parameter" }, { status: 400 });
    }

    if (action === "updateCourse") {
      const { id, title, slug, description, duration, difficulty } = payload;
      const course = await db.course.update({
        where: { id },
        data: { title, slug, description, duration, difficulty }
      });
      return NextResponse.json({ success: true, course });
    }

    if (action === "updateModule") {
      const { id, title, description } = payload;
      const module = await db.module.update({
        where: { id },
        data: { title, description }
      });
      return NextResponse.json({ success: true, module });
    }

    if (action === "updateLesson") {
      const { 
        id, title, slug, introMalayalam, explanation, realLifeExample, 
        visualConcept, practicalDemo, summary, miniChallenge, 
        videoUrl, durationMinutes 
      } = payload;

      const lesson = await db.lesson.update({
        where: { id },
        data: {
          title,
          slug,
          introMalayalam,
          explanation,
          realLifeExample,
          visualConcept: visualConcept || "",
          practicalDemo: practicalDemo || "",
          summary,
          miniChallenge: miniChallenge || "",
          videoUrl: videoUrl || "",
          durationMinutes: durationMinutes || 10
        }
      });
      return NextResponse.json({ success: true, lesson });
    }

    return NextResponse.json({ error: "Unknown action parameter" }, { status: 400 });
  } catch (e) {
    console.error("Admin courses PUT execution error:", e);
    return NextResponse.json({ error: "Failed to update operation" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "SuperAdmin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // course, module, lesson
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing query parameter parameters" }, { status: 400 });
  }

  try {
    if (type === "course") {
      await db.course.delete({ where: { id } });
    } else if (type === "module") {
      await db.module.delete({ where: { id } });
    } else if (type === "lesson") {
      await db.lesson.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Failed to delete admin course entity:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
