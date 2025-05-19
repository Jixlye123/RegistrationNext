import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Fine } from '@/models/Fine';
import { auth } from '@/firebase/firebase';

export async function GET(req: NextRequest) {
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
    
    // Verify the Firebase token
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const firebaseUid = decodedToken.uid;
      
      // Connect to the database
      await connectDB();
      
      // Get all fines for the current user
      const fines = await Fine.find({ firebaseUid }).sort({ issuedDate: -1 });
      
      return NextResponse.json(fines);
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching user fines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fines', details: error.message },
      { status: 500 }
    );
  }
}