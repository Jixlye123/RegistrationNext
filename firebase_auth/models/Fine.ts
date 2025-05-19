import mongoose from "mongoose";

const FineSchema = new mongoose.Schema({
  fineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  firebaseUid: { 
    type: String, 
    required: true 
  },
  licenseNumber: { 
    type: String, 
    required: true 
  },
  violationType: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ["pending", "paid", "disputed", "cancelled"],
    default: "pending"
  },
  issuedDate: { 
    type: Date, 
    default: Date.now 
  },
  disputeReason: { 
    type: String 
  },
  disputeResolutionDate: { 
    type: Date 
  }, 
});

export const Fine = mongoose.models.Fine || mongoose.model("Fine", FineSchema);