
import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all fines with 'disputed' status
    const disputedFines = await Fine.find({ status: "disputed" })
      .sort({ issuedDate: -1 }) // Sort by issue date, newest first
      .lean();
    
    // For each fine, find the user by licenseNumber
    const finesWithUserData = await Promise.all(disputedFines.map(async (fine) => {
      const user = await User.findOne({ licenseNumber: fine.licenseNumber }).lean();
      
      return {
        ...fine,
        userId: user ? {
          licenseNumber: user.licenseNumber,
          email: user.email,
          name: user.name
        } : {
          licenseNumber: fine.licenseNumber,
          email: 'N/A'
        }
      };
    }));
    
    return NextResponse.json(finesWithUserData);
    
  } catch (error: any) {
    console.error("Error fetching disputed fines:", error);
    return NextResponse.json({ 
      error: "Failed to fetch disputed fines", 
      details: error.message 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}