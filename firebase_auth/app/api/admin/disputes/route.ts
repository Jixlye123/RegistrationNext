// /api/admin/disputes/route.ts
import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const disputedFines = await Fine.find({ status: "disputed" }).select("licenseNumber disputeReason _id");
    return NextResponse.json(disputedFines, { status: 200 });
  } catch (error) {
    console.error("Error fetching disputed fines:", error);
    return NextResponse.json({ error: "Failed to fetch disputed fines" }, { status: 500 });
  }
}
