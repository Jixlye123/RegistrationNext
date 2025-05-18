import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '@/models/Fine'; 

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query: any = { status: 'paid' };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.issuedDate = {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString(),
      };
    }

    const paidFines = await Fine.find(query)
      .select('licenseNumber amount issuedDate fineId') 
      .exec();

    const transformedFines = paidFines.map((fine) => ({
      _id: fine._id,
      licenseNumber: fine.licenseNumber,
      amount: fine.amount,
      issuedDate: fine.issuedDate, 
      fineId: fine.fineId,
    }));

    return NextResponse.json(transformedFines, { status: 200 });
  } catch (error) {
    console.error('Error fetching paid fines:', error);
    return NextResponse.json({ error: 'Failed to fetch paid fines.' }, { status: 500 });
  }
}
