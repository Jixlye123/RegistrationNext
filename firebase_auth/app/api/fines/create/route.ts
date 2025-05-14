// app/api/fines/create/route.ts
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
      status,         // optional
      disputeReason   // optional
    } = await req.json();

    // create the Fine
    const fine = await Fine.create({
      userId,
      licenseNumber,
      violationType,
      amount,
      status,         // omit if undefined
      disputeReason   // omit if undefined
    });

    return NextResponse.json(fine, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating fine:", error);
    return NextResponse.json({ error: "Failed to create fine" }, { status: 500 });
  }
}
