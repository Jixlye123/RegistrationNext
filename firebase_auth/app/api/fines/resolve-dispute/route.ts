import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '../../../../models/Fine'; 

export async function PUT(request: Request) {
  try {
    await connectDB();

    const { fineId, status } = await request.json();

    if (!fineId || !status) {
      return NextResponse.json({ error: 'Fine ID and status are required.' }, { status: 400 });
    }

    const allowedStatuses = ['disputed']; 

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status provided.' }, { status: 400 });
    }

    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { status }, 
      { new: true }
    );

    if (!updatedFine) {
      return NextResponse.json({ error: 'Fine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fine status updated.', fine: updatedFine }, { status: 200 });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return NextResponse.json({ error: 'Failed to resolve dispute.' }, { status: 500 });
  }
}



export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { fineId } = await request.json();

    if (!fineId) {
      return NextResponse.json({ error: 'Fine ID is required.' }, { status: 400 });
    }

    const deletedFine = await Fine.findByIdAndDelete(fineId);

    if (!deletedFine) {
      return NextResponse.json({ error: 'Fine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Fine deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting fine:', error);
    return NextResponse.json({ error: 'Failed to delete fine.' }, { status: 500 });
  }
}
