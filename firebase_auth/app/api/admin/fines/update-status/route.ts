import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Fine } from '@/models/Fine';

export async function PUT(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { fineId, status } = body;

    // Validate required fields
    if (!fineId || !status) {
      return NextResponse.json(
        { error: 'Fine ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'paid', 'disputed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Update the fine
    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { 
        status,
        ...(status === 'disputed' && { disputeResolutionDate: null }),
        ...(status !== 'disputed' && 
           status !== 'pending' && { disputeResolutionDate: new Date() })
      },
      { new: true }
    );

    if (!updatedFine) {
      return NextResponse.json(
        { error: 'Fine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Fine status updated successfully', fine: updatedFine }
    );
  } catch (error: any) {
    console.error('Error updating fine status:', error);
    return NextResponse.json(
      { error: 'Failed to update fine status', details: error.message },
      { status: 500 }
    );
  }
}