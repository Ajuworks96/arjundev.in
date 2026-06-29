import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const whereClause = type ? { type } : {};
  try {
    const leads = await db.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(leads);
  } catch (e) {
    return NextResponse.json({ error: "Failed to retrieve leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type } = body;
    
    if (!name || !email || !message || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        subject: subject || "",
        message,
        type,
        status: "Pending"
      }
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (e) {
    console.error("Error creating lead:", e);
    return NextResponse.json({ error: "Failed to submit lead data" }, { status: 500 });
  }
}
