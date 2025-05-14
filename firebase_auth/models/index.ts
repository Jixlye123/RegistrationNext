// models/index.js - Create this file to ensure models are registered properly

import mongoose from 'mongoose';
import { UserSchema } from './User';
import { PaymentSchema } from './Payment'; // Import the schema, not the model

// Explicitly register all models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

// Export all models from a single file
export default {
  User,
  Payment
};