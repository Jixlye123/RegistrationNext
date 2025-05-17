import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Fine } from '@/models/Fine';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { email, licenseNumber, violationType, amount, status } = body;

    // Validate required fields
    if (!email || !licenseNumber || !violationType || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find user by email to get firebaseUid
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found with the provided email' },
        { status: 404 }
      );
    }

    // Create a new ObjectId for the fine
    const fineId = new mongoose.Types.ObjectId();

    // Create a new fine document
    const newFine = new Fine({
      fineId,
      licenseNumber,
      violationType,
      amount,
      status: status || 'pending',
      issuedDate: new Date(),
      firebaseUid: user.firebaseUid,
    });

    // Save the fine document
    await newFine.save();

    return NextResponse.json(
      { message: 'Fine added successfully', fine: newFine },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating fine:', error);
    return NextResponse.json(
      { error: 'Failed to create fine', details: error.message },
      { status: 500 }
    );
  }
}