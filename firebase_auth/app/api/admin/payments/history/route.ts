import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import {  NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const payments = await Payment.find().populate("userId", "licenseNumber email");
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
