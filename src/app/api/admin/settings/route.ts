import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await db.cmsConfig.findUnique({
      where: { id: "singleton" }
    });
    return NextResponse.json(config || {});
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch CMS settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { provider, apiUrl, apiKey, youtubeChannelId, youtubeApiKey, instagramAccessToken, linkedinFeedUrl, linkedinAccessToken, linkedinPersonUrn, linkedinWidgetCode } = body;

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 });
    }

    const config = await db.cmsConfig.upsert({
      where: { id: "singleton" },
      update: {
        provider,
        apiUrl: apiUrl || "",
        apiKey: apiKey || "",
        youtubeChannelId: youtubeChannelId || "",
        youtubeApiKey: youtubeApiKey || "",
        instagramAccessToken: instagramAccessToken || "",
        linkedinFeedUrl: linkedinFeedUrl || "",
        linkedinAccessToken: linkedinAccessToken || "",
        linkedinPersonUrn: linkedinPersonUrn || "",
        linkedinWidgetCode: linkedinWidgetCode || "",
      },
      create: {
        id: "singleton",
        provider,
        apiUrl: apiUrl || "",
        apiKey: apiKey || "",
        youtubeChannelId: youtubeChannelId || "",
        youtubeApiKey: youtubeApiKey || "",
        instagramAccessToken: instagramAccessToken || "",
        linkedinFeedUrl: linkedinFeedUrl || "",
        linkedinAccessToken: linkedinAccessToken || "",
        linkedinPersonUrn: linkedinPersonUrn || "",
        linkedinWidgetCode: linkedinWidgetCode || "",
      }
    });

    return NextResponse.json(config);
  } catch (e) {
    console.error("Error updating CMS settings:", e);
    return NextResponse.json({ error: "Failed to save CMS settings" }, { status: 500 });
  }
}
