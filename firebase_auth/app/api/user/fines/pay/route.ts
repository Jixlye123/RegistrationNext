import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Fine } from '@/models/Fine';
import { auth } from '@/firebase/firebase';

export async function POST(req: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Parse the request body
    const { fineId } = await req.json();
    
    if (!fineId) {
      return NextResponse.json(
        { error: 'Fine ID is required' },
        { status: 400 }
      );
    }

    // Verify the Firebase token
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const firebaseUid = decodedToken.uid;
      
      // Connect to the database
      await connectDB();
      
      // Find the fine and verify it belongs to the user
      const fine = await Fine.findOne({ _id: fineId, firebaseUid });
      
      if (!fine) {
        return NextResponse.json(
          { error: 'Fine not found or does not belong to this user' },
          { status: 404 }
        );
      }
      
      if (fine.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending fines can be paid' },
          { status: 400 }
        );
      }
      
      // Update the fine status to paid
      fine.status = 'paid';
      await fine.save();
      
      return NextResponse.json({ 
        message: 'Payment successful',
        fine
      });
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment', details: error.message },
      { status: 500 }
    );
  }
}