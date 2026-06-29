import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await db.profile.findUnique({
      where: { id: "singleton" }
    });
    return NextResponse.json(profile || {});
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch profile settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, tagline, about, biography, journeyIntro, mission, vision, socialLinks, availability, avatarUrl, resumeUrl } = body;

    const profile = await db.profile.upsert({
      where: { id: "singleton" },
      update: {
        name,
        tagline,
        about,
        biography,
        journeyIntro,
        mission,
        vision,
        socialLinks,
        availability,
        avatarUrl,
        resumeUrl,
      },
      create: {
        id: "singleton",
        name,
        tagline,
        about,
        biography,
        journeyIntro,
        mission,
        vision,
        socialLinks,
        availability,
        avatarUrl,
        resumeUrl,
      }
    });

    return NextResponse.json(profile);
  } catch (e) {
    console.error("Error updating profile settings:", e);
    return NextResponse.json({ error: "Failed to save profile settings" }, { status: 500 });
  }
}
