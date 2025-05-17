import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Fine } from '@/models/Fine';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Get all fines
    const fines = await Fine.find({}).sort({ issuedDate: -1 });

    // Get unique firebaseUids from fines
    const firebaseUids = [...new Set(fines.map(fine => fine.firebaseUid).filter(Boolean))];

    // Fetch email addresses for all users in one query
    const users = await User.find({ firebaseUid: { $in: firebaseUids } }, { firebaseUid: 1, email: 1 });

    // Create a map of firebaseUid to email
    const uidToEmailMap = users.reduce((map, user) => {
      map[user.firebaseUid] = user.email;
      return map;
    }, {});

    // Add email to each fine
    const finesWithEmail = fines.map(fine => {
      const fineObj = fine.toObject();
      if (fineObj.firebaseUid) {
        fineObj.email = uidToEmailMap[fineObj.firebaseUid] || 'Unknown';
      } else {
        fineObj.email = 'Unknown';
      }
      return fineObj;
    });

    return NextResponse.json(finesWithEmail);
  } catch (error: any) {
    console.error('Error fetching fines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fines', details: error.message },
      { status: 500 }
    );
  }
}