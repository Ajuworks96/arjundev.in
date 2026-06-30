import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing lesson slug" }, { status: 400 });
  }

  try {
    const lesson = await db.lesson.findUnique({
      where: { slug },
      include: {
        downloads: true,
        quizzes: true,
        assignments: true,
        module: {
          select: {
            title: true,
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if current user completed this lesson
    const session = await getServerSession(authOptions);
    let completed = false;

    if ((session?.user as any)?.id) {
      const progress = await db.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: (session?.user as any).id,
            lessonId: lesson.id
          }
        }
      });
      completed = progress?.completed || false;
    }

    return NextResponse.json({ lesson, completed });
  } catch (e) {
    console.error("Failed to load lesson data:", e);
    return NextResponse.json({ error: "Failed to load lesson data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session?.user as any).id;

  try {
    const body = await request.json();
    const { courseId, lessonId } = body;

    if (!courseId || !lessonId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create or Update progress
    const progress = await db.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        completed: true,
        lastVisited: new Date()
      },
      create: {
        userId,
        courseId,
        lessonId,
        completed: true,
        lastVisited: new Date()
      }
    });

    // 2. Award XP (+10 XP) and calculate Streak
    let stats = await db.userStats.findUnique({ where: { userId } });
    if (!stats) {
      stats = await db.userStats.create({
        data: { userId, xp: 0, streak: 0, badgeList: ["Explorer"] }
      });
    }

    let xpEarned = 10;
    const now = new Date();
    let streakIncremented = false;
    let newStreak = stats.streak;

    if (stats.lastActive) {
      const lastActiveDate = new Date(stats.lastActive);
      const isToday = lastActiveDate.toDateString() === now.toDateString();
      const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === lastActiveDate.toDateString();

      if (isYesterday) {
        newStreak += 1;
        streakIncremented = true;
      } else if (!isToday) {
        // Streak broken
        newStreak = 1;
        streakIncremented = true;
      }
    } else {
      newStreak = 1;
      streakIncremented = true;
    }

    // 3. Evaluate Badges
    const completedCount = await db.userProgress.count({
      where: { userId, completed: true }
    });

    const currentBadges = new Set(stats.badgeList);
    if (completedCount >= 1 && !currentBadges.has("Explorer")) currentBadges.add("Explorer");
    if (completedCount >= 5 && !currentBadges.has("Builder")) currentBadges.add("Builder");
    if (completedCount >= 10 && !currentBadges.has("Creator")) currentBadges.add("Creator");

    const updatedStats = await db.userStats.update({
      where: { userId },
      data: {
        xp: stats.xp + xpEarned,
        streak: newStreak,
        lastActive: now,
        badgeList: Array.from(currentBadges)
      }
    });

    return NextResponse.json({
      success: true,
      xpEarned,
      streak: updatedStats.streak,
      badgeList: updatedStats.badgeList,
      streakIncremented
    });
  } catch (e) {
    console.error("Failed to complete lesson workflow:", e);
    return NextResponse.json({ error: "Failed to submit progress" }, { status: 500 });
  }
}
