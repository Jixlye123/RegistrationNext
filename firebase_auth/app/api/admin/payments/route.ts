// API route to get all payments
// Path: app/api/admin/payments/route.ts

import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all payments and populate user data
    const payments = await Payment.find()
      .populate('userId', 'licenseNumber email')
      .sort({ paidAt: -1 }) // Sort by payment date, newest first
      .lean();
    
    return NextResponse.json(payments);
    
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ 
      error: "Failed to fetch payments", 
      details: error.message 
    }, { status: 500 });
  }
}

// If you need to handle POST requests to this endpoint as well, you can add:
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}