import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '@/models/Fine'; 

export async function POST(request: Request) {
  try {
    await connectDB();

    const { fineId, disputeReason } = await request.json();

    if (!fineId || !disputeReason) {
      return NextResponse.json({ error: 'Fine ID and dispute reason are required.' }, { status: 400 });
    }

  
    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { status: 'disputed', disputeReason: disputeReason }, 
      { new: true } 
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
