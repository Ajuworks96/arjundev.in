import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  // For courses we allow both guest view (public roadmap catalog) and authenticated progress view
  const userId = (session?.user as any)?.id;

  try {
    const courses = await db.course.findMany({
      include: {
        modules: {
          orderBy: { orderIndex: "asc" },
          include: {
            lessons: {
              orderBy: { orderIndex: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                durationMinutes: true,
                orderIndex: true
              }
            }
          }
        }
      },
      orderBy: { orderIndex: "asc" }
    });

    let stats = null;
    let progress: any[] = [];

    if (userId) {
      // Find or create stats for the authenticated student
      stats = await db.userStats.findUnique({
        where: { userId }
      });
      
      if (!stats) {
        stats = await db.userStats.create({
          data: {
            userId,
            xp: 0,
            streak: 0,
            badgeList: ["Explorer"]
          }
        });
      }

      progress = await db.userProgress.findMany({
        where: { userId }
      });
    }

    return NextResponse.json({
      courses,
      stats,
      progress
    });
  } catch (e) {
    console.error("Failed to load courses routing data:", e);
    return NextResponse.json({ error: "Failed to load courses data" }, { status: 500 });
  }
}
