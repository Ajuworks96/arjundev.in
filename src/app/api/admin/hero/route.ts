import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hero = await db.heroSettings.findUnique({
      where: { id: "singleton" }
    });
    return NextResponse.json(hero || {});
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch hero settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { headline, animatedText, subtitle, ctaPrimary, ctaPrimaryUrl, ctaSecondary, ctaSecondaryUrl, bgSettings } = body;

    const hero = await db.heroSettings.upsert({
      where: { id: "singleton" },
      update: {
        headline,
        animatedText,
        subtitle,
        ctaPrimary,
        ctaPrimaryUrl,
        ctaSecondary,
        ctaSecondaryUrl,
        bgSettings,
      },
      create: {
        id: "singleton",
        headline,
        animatedText,
        subtitle,
        ctaPrimary,
        ctaPrimaryUrl,
        ctaSecondary,
        ctaSecondaryUrl,
        bgSettings,
      }
    });

    return NextResponse.json(hero);
  } catch (e) {
    console.error("Error updating hero settings:", e);
    return NextResponse.json({ error: "Failed to save hero settings" }, { status: 500 });
  }
}
