import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '@/models/Fine'; 

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const licenseNumber = searchParams.get('licenseNumber');

    if (!licenseNumber) {
      return NextResponse.json({ error: 'License number is required' }, { status: 400 });
    }

    const query = { 
        licenseNumber: licenseNumber,
        status: { $in: ['disputed', 'cancelled'] } 
    };

    const disputedFines = await Fine.find(query)
      .select('licenseNumber amount issuedDate disputeReason fineId status') 
      .exec();

    const transformedFines = disputedFines.map((fine) => ({
      _id: fine._id.toString(),
      licenseNumber: fine.licenseNumber,
      amount: fine.amount,
      issuedDate: fine.issuedDate,
      disputeReason: fine.disputeReason,
      fineId: fine.fineId,
      status: fine.status, 
    }));

    return NextResponse.json(transformedFines, { status: 200 });
  } catch (error) {
    console.error('Error fetching disputed fines:', error);
    return NextResponse.json({ error: 'Failed to fetch disputed fines.' }, { status: 500 });
  }
}
