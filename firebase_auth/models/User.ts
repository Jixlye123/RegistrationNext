import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  licenseNumber: { type: String }, // Optional: for fast searches
},
{ timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

export { UserSchema };