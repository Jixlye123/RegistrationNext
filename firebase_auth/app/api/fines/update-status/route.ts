import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '@/models/Fine'; 

export async function PUT(request: Request) { 
  try {
    await connectDB();

    const { fineId, status } = await request.json();

    if (!fineId || !status) {
      return NextResponse.json({ error: 'Fine ID and status are required.' }, { status: 400 });
    }

  
    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { status: status },
      { new: true } 
    );

    if (!updatedFine) {
      return NextResponse.json({ error: 'Fine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fine status updated successfully.', fine: updatedFine }, { status: 200 }); 
  } catch (error) {
    console.error('Error updating fine status:', error);
    return NextResponse.json({ error: 'Failed to update fine status.' }, { status: 500 });
  }
}
