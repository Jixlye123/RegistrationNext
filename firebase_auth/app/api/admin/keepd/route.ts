// New optional API
// /api/admin/keep-dispute.ts
import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { fineId } = await req.json();

  try {
    const fine = await Fine.findById(fineId);
    if (!fine) return NextResponse.json({ error: "Fine not found" }, { status: 404 });

    fine.status = "pending"; // or "waived" if you add such a status
    fine.disputeReason = "";
    await fine.save();

    return NextResponse.json({ message: "Fine kept as pending." });
  } catch (error) {
    console.error("Error updating fine:", error);
    return NextResponse.json({ error: "Error updating fine" }, { status: 500 });
  }
}
