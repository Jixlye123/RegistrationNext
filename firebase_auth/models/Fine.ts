import mongoose from "mongoose";

const FineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  licenseNumber: { type: String, required: true },
  violationType: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "disputed"], default: "pending" },
  issuedDate: { type: Date, default: Date.now },
  disputeReason: { type: String }, // 👈 added this!
});

export const Fine = mongoose.models.Fine || mongoose.model("Fine", FineSchema);
