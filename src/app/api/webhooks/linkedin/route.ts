import { db } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, title, url, description, date } = body;

    const configSecret = process.env.LINKEDIN_WEBHOOK_SECRET;

    if (!configSecret || secret !== configSecret) {
      return NextResponse.json({ error: "Unauthorized webhook access" }, { status: 401 });
    }

    if (!title || !url || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if post already exists to prevent duplicates
    const existing = await db.linkedinPost.findFirst({
      where: { url }
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Post already integrated" });
    }

    const post = await db.linkedinPost.create({
      data: {
        title,
        url,
        description,
        date: date || new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("Webhook processing error:", e);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
