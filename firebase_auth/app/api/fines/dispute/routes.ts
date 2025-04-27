import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  const { fineId, reason } = await req.json();

  if (!fineId || !reason) {
    return NextResponse.json({ error: "Fine ID and reason are required" }, { status: 400 });
  }

  try {
    const fine = await Fine.findById(fineId);

    if (!fine) {
      return NextResponse.json({ error: "Fine not found" }, { status: 404 });
    }

    fine.status = "disputed";
    fine.save();

    return NextResponse.json({ message: "Fine disputed successfully" });
  } catch (error) {
    console.error("Error disputing fine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
