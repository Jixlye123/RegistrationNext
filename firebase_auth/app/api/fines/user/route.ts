import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import { Fine } from '@/models/Fine'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const licenseNumber = searchParams.get('licenseNumber');

  if (!licenseNumber || typeof licenseNumber !== 'string') {
    return NextResponse.json({ error: 'License number is required.' }, { status: 400 });
  }

  try {
    await connectDB();
    const fines = await Fine.find({ licenseNumber });
    return NextResponse.json(fines, { status: 200 });
  } catch (error) {
    console.error('Error fetching user fines:', error);
    return NextResponse.json({ error: 'Failed to fetch fines.' }, { status: 500 });
  }
}