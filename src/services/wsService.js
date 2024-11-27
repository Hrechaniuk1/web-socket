// custom imports
import { messageCollection } from "../db/models/message";

// server code
export const saveMessage = async (username, text) => {
    const message = {
        username,
        text,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    const savedMessage = await messageCollection.create(message);
    return savedMessage;
};


export const getChatHistory = async (limit = 100) => {
    return await messageCollection
        .find({})
        .sort({ timestamp: -1 }) // sort from oldest yo newest
        .limit(limit)
        .exec();
};
