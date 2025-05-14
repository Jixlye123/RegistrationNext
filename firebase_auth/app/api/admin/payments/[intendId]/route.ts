import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { intentId: string } }) {
  await connectDB();

  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: params.intentId });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
