import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { licenseNumber, violationType, amount } = await req.json();

    const user = await User.findOne({ licenseNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fine = await Fine.create({
      userId: user._id,
      licenseNumber,
      violationType,
      amount,
      status: "pending",
    });

    return NextResponse.json(fine, { status: 201 });
  } catch (error) {
    console.error("Error assigning fine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
