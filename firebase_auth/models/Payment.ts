import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  fineId: { type: mongoose.Schema.Types.ObjectId, ref: "Fine", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  stripePaymentIntentId: { type: String, required: true },
  status: { type: String, enum: ["succeeded", "failed"], required: true },
  paidAt: { type: Date, default: Date.now },
});

export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
