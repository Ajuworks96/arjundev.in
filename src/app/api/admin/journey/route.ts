import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const milestones = await db.milestone.findMany({
      orderBy: { orderIndex: "asc" }
    });
    return NextResponse.json(milestones);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { role, organization, period, description, lessons, achievements, technologies, mindset, orderIndex } = body;

    if (!role || !organization || !period || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const milestone = await db.milestone.create({
      data: {
        role,
        organization,
        period,
        description,
        lessons: lessons || [],
        achievements: achievements || [],
        technologies: technologies || [],
        mindset: mindset || "",
        orderIndex: orderIndex || 0,
      }
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (e) {
    console.error("Error creating milestone:", e);
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Check if bulk reordering or single update
    if (Array.isArray(body)) {
      // Bulk update order indexes
      const updates = body.map((item) =>
        db.milestone.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex }
        })
      );
      await db.$transaction(updates);
      return NextResponse.json({ success: true, message: "Milestones reordered successfully" });
    } else {
      // Single milestone update
      const { id, role, organization, period, description, lessons, achievements, technologies, mindset, orderIndex } = body;
      if (!id) {
        return NextResponse.json({ error: "Milestone ID required" }, { status: 400 });
      }

      const milestone = await db.milestone.update({
        where: { id },
        data: {
          role,
          organization,
          period,
          description,
          lessons: lessons || [],
          achievements: achievements || [],
          technologies: technologies || [],
          mindset: mindset || "",
          orderIndex: orderIndex ?? 0,
        }
      });
      return NextResponse.json(milestone);
    }
  } catch (e) {
    console.error("Error updating milestone:", e);
    return NextResponse.json({ error: "Failed to update milestone" }, { status: 500 });
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
      return NextResponse.json({ error: "Milestone ID required" }, { status: 400 });
    }

    await db.milestone.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Milestone deleted successfully" });
  } catch (e) {
    console.error("Error deleting milestone:", e);
    return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
  }
}
