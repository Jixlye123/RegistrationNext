// Update your Fine model to include the new fields needed
// Path: models/Fine.ts

import mongoose from "mongoose";

const FineSchema = new mongoose.Schema({
  fineId: { type: mongoose.Schema.Types.ObjectId, required: true },
  licenseNumber: { type: String, required: true },
  violationType: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "paid", "disputed", "cancelled"], 
    default: "pending" 
  },
  issuedDate: { type: Date, default: Date.now },
  disputeReason: { type: String },
  disputeResolutionDate: { type: Date }, // New field for tracking when disputes are resolved
});

export const Fine = mongoose.models.Fine || mongoose.model("Fine", FineSchema);