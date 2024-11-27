// gen imports
import mongoose from 'mongoose';


// server code

const messageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },

});

messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const messageCollection =  mongoose.model('message', messageSchema);
