import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  await connectDB();

  const { userId, stripePaymentIntentId, amount } = await req.json();

  if (!userId || !stripePaymentIntentId || !amount) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const payment = await Payment.create({ userId, stripePaymentIntentId, amount });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error adding payment:", error);
    return NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
  }
}
