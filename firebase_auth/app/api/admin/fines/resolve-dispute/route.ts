// API route to resolve disputed fines
// Path: app/api/admin/fines/resolve-dispute/route.ts

import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { fineId, action } = await request.json();
    
    // Validate required fields
    if (!fineId || !action || !['keep', 'remove'].includes(action)) {
      return NextResponse.json({ 
        error: "Invalid request", 
        details: "Missing or invalid fineId or action" 
      }, { status: 400 });
    }
    
    await connectDB();
    
    // Find the disputed fine
    const fine = await Fine.findById(fineId);
    
    if (!fine) {
      return NextResponse.json({ 
        error: "Fine not found" 
      }, { status: 404 });
    }
    
    if (fine.status !== 'disputed') {
      return NextResponse.json({ 
        error: "Fine is not in disputed status" 
      }, { status: 400 });
    }
    
    if (action === 'keep') {
      // Keep the fine but change status back to pending
      fine.status = 'pending';
      fine.disputeResolutionDate = new Date(); // You might need to add this field to your schema
      await fine.save();
      
      return NextResponse.json({
        success: true,
        message: "Fine maintained and dispute rejected",
        fine: fine
      });
    } else {
      // Cancel the fine
      // Instead of deleting, you could add a 'cancelled' status option to your schema
      await Fine.findByIdAndDelete(fineId);
      
      return NextResponse.json({
        success: true,
        message: "Fine removed and dispute accepted"
      });
    }
    
  } catch (error: any) {
    console.error("Error resolving disputed fine:", error);
    return NextResponse.json({ 
      error: "Failed to resolve disputed fine", 
      details: error.message 
    }, { status: 500 });
  }
}