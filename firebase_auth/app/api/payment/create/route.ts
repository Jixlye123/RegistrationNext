// app/api/fines/create/route.ts
import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const {
      fineId,  
      userId,
      licenseNumber,
      stripePaymentIntentId,
      amount,
      status,         // optional
      paidAt   // optional
    } = await req.json();

    // create the Fine
    const payment = await Payment.create({
      fineId,
      userId,
      licenseNumber,
      stripePaymentIntentId,
      amount,
      status,         // omit if undefined
      paidAt   // omit if undefined
    });

    return NextResponse.json(payment, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating fine:", error);
    return NextResponse.json({ error: "Failed to create fine" }, { status: 500 });
  }
}
