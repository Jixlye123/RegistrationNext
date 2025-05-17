// app/api/fines/dispute/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // Adjust path as needed
import { Fine } from '@/models/Fine'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    await connectDB();

    const { fineId, disputeReason } = await request.json();

    if (!fineId || !disputeReason) {
      return NextResponse.json({ error: 'Fine ID and dispute reason are required.' }, { status: 400 });
    }

    // Find the fine and update its status
    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { status: 'disputed', disputeReason: disputeReason }, //add disputeReason
      { new: true } // Return the updated document
    );

    if (!updatedFine) {
      return NextResponse.json({ error: 'Fine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fine status updated to disputed.', fine: updatedFine }, { status: 200 });
  } catch (error) {
    console.error('Error disputing fine:', error);
    return NextResponse.json({ error: 'Failed to dispute fine.' }, { status: 500 });
  }
}
