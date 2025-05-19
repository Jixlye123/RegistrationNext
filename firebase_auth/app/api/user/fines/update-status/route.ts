// app/api/fines/update-status/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // Adjust path as needed
import { Fine } from '@/models/Fine'; // Adjust path as needed

export async function PUT(request: Request) { // Changed to PUT
  try {
    await connectDB();

    const { fineId, status } = await request.json();

    if (!fineId || !status) {
      return NextResponse.json({ error: 'Fine ID and status are required.' }, { status: 400 });
    }

    // Find the fine and update its status
    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!updatedFine) {
      return NextResponse.json({ error: 'Fine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fine status updated successfully.', fine: updatedFine }, { status: 200 }); // Ensure you are sending back JSON
  } catch (error) {
    console.error('Error updating fine status:', error);
    return NextResponse.json({ error: 'Failed to update fine status.' }, { status: 500 });
  }
}
