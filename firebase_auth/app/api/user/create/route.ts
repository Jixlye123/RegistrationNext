// app/api/fines/create/route.ts
import { connectDB } from "@/lib/db";
import { User } from "@/models/User"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const {
      firebaseUid,
      email,
      name,
      licenseNumber
        // optional
    } = await req.json();

    // create the Fine
    const user = await User.create({
      firebaseUid,
      email,
      name,
      licenseNumber  // omit if undefined
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating fine:", error);
    return NextResponse.json({ error: "Failed to create fine" }, { status: 500 });
  }
}
