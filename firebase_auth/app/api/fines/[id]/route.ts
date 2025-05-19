import { connectDB } from "@/lib/db";
import { Fine } from "@/models/Fine";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

interface Params {
  id: string;
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  await connectDB();
  try {
    const { id } = params;

    // Validate the id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid fine ID" }, { status: 400 });
    }

    const fine = await Fine.findByIdAndDelete(id);
    if (!fine) {
      return NextResponse.json({ error: "Fine not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Fine deleted successfully" });
  } catch (error) {
    console.error("Error deleting fine:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
