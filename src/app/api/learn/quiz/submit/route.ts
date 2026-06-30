import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { db } from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session?.user as any).id;

  try {
    const body = await request.json();
    const { lessonId, quizId, selectedOptionIndex } = body;

    if (!lessonId || !quizId || selectedOptionIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quiz = await db.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const isCorrect = quiz.answerIndex === selectedOptionIndex;
    let xpEarned = isCorrect ? 15 : 0; // +15 XP bonus for correct answers

    // Update progress table score
    await db.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: {
        quizScore: isCorrect ? 100 : 0,
        lastVisited: new Date()
      },
      create: {
        userId,
        lessonId,
        courseId: quiz.lessonId, // Fallback placeholder
        completed: false, // Completing a quiz doesn't mark lesson as completed unless they watch the video/click complete
        quizScore: isCorrect ? 100 : 0,
        lastVisited: new Date()
      }
    });

    if (isCorrect) {
      let stats = await db.userStats.findUnique({ where: { userId } });
      if (!stats) {
        stats = await db.userStats.create({
          data: { userId, xp: 0, streak: 0, badgeList: ["Explorer"] }
        });
      }

      await db.userStats.update({
        where: { userId },
        data: {
          xp: stats.xp + xpEarned
        }
      });
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswerIndex: quiz.answerIndex,
      xpEarned
    });
  } catch (e) {
    console.error("Quiz submission error:", e);
    return NextResponse.json({ error: "Failed to grade quiz" }, { status: 500 });
  }
}
