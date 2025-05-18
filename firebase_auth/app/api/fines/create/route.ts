
import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const {
      userId,
      licenseNumber,
      violationType,
      amount,
      status,         
      disputeReason   
    } = await req.json();

    
    const fine = await Fine.create({
      userId,
      licenseNumber,
      violationType,
      amount,
      status,         
      disputeReason   
    });

    return NextResponse.json(fine, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating fine:", error);
    return NextResponse.json({ error: "Failed to create fine" }, { status: 500 });
  }
}
