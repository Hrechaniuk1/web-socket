// custom imports
import { sessionCollection } from "../db/models/session";
import { usersCollection } from "../db/models/user";

// main code

export const validateAccessToken = async (accessToken) => {
    const session = await sessionCollection.findOne({ accessToken });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    if (!session.isAccessTokenValid()) {
        throw createHttpError(401, 'Access token expired');
    }

    return session.userId;
};

export const getUserById = async (userId) => {
    const user = await usersCollection.findById(userId);
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    return user;
};
