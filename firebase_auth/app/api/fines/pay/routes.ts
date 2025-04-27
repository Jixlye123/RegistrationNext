import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { fineId } = await req.json();

    if (!fineId) {
      return NextResponse.json({ error: "Fine ID is required" }, { status: 400 });
    }

    const fine = await Fine.findById(fineId);

    if (!fine) {
      return NextResponse.json({ error: "Fine not found" }, { status: 404 });
    }

    fine.status = "paid";
    await fine.save();

    return NextResponse.json({ message: "Fine marked as paid successfully" });
  } catch (error) {
    console.error("Error updating fine status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
