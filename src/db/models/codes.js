// gen imports
import mongoose from 'mongoose';

const registrationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },  
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  });


export const RegistrationCodeCollection = mongoose.model('RegistrationCode', registrationCodeSchema);
