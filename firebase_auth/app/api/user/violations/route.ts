import { connectDB } from "@/lib/db";
import { Payment } from "@/models/Payment";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const licenseNumber = searchParams.get('licenseNumber');
    
    // Validate that at least one search parameter is provided
    if (!email && !licenseNumber) {
      return NextResponse.json({ 
        error: "Missing search criteria. Please provide email or license number" 
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Build the search query based on provided parameters
    const searchQuery: any = {};
    
    if (email && licenseNumber) {
      // Search for exact matches on both fields
      searchQuery.$or = [
        { email: email.toLowerCase() },
        { licenseNumber: licenseNumber }
      ];
    } else if (email) {
      searchQuery.email = email.toLowerCase();
    } else if (licenseNumber) {
      searchQuery.licenseNumber = licenseNumber;
    }
    
    // Find the user with the given criteria
    const user = await User.findOne(searchQuery);
    
    // If no user found, return empty array
    if (!user) {
      console.log('No user found with the provided criteria');
      return NextResponse.json([], { status: 200 });
    }
    
    console.log(`Found user: ${user._id}`);
    
    // Find all payments associated with this user
    const violations = await Payment.find({ userId: user._id })
      .select('_id amount stripePaymentIntentId status paidAt')
      .sort({ paidAt: -1 }); // Most recent first
    
    console.log(`Found ${violations.length} violations for user`);
    
    return NextResponse.json(violations, { status: 200 });
    
  } catch (error: any) {
    console.error("Error fetching user violations:", error);
    return NextResponse.json({ 
      error: "Failed to fetch violations", 
      details: error.message,
    }, { status: 500 });
  }
}