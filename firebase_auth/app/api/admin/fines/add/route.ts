// API route to add a new payment
// Create this file at: app/api/admin/fines/add/route.ts

import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { licenseNumber, email, amount, stripePaymentIntentId, status = "succeeded" } = await request.json();
    
    // Validate required fields
    if (!licenseNumber || !email || !amount || !stripePaymentIntentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    await connectDB();
    
    // Find user by license number or email or create a new one
    let user = await User.findOne({
      $or: [
        { licenseNumber: licenseNumber },
        { email: email }
      ]
    });
    
    // If user doesn't exist, create a new one
    if (!user) {
      // Generate a random Firebase UID (in a real app, this would come from Firebase Auth)
      const randomFirebaseUid = `manual_${Math.random().toString(36).substring(2, 15)}`;
      
      user = await User.create({
        firebaseUid: randomFirebaseUid,
        email: email,
        licenseNumber: licenseNumber,
      });
      
      console.log(`Created new user with ID: ${user._id}`);
    } else {
      console.log(`Found existing user with ID: ${user._id}`);
    }
    
    // Create a fake fine ID if needed (in a real app, you'd likely have a real fine)
    // You may need to create a real fine in your database depending on your app's requirements
    const fineId = new mongoose.Types.ObjectId();
    
    // Create the payment record
    const payment = await Payment.create({
      fineId: fineId,
      userId: user._id,
      amount: amount,
      stripePaymentIntentId: stripePaymentIntentId,
      status: status,
      paidAt: new Date()
    });
    
    console.log(`Created new payment with ID: ${payment._id}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Payment added successfully",
      payment: {
        _id: payment._id,
        amount: payment.amount,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        paidAt: payment.paidAt,
        userId: {
          licenseNumber: user.licenseNumber,
          email: user.email
        }
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error("Error adding payment:", error);
    return NextResponse.json({ 
      error: "Failed to add payment", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}