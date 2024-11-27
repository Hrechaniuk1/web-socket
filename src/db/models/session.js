import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false,
});

sessionSchema.methods.isAccessTokenValid = function () {
    return new Date() < this.accessTokenValidUntil;
};

sessionSchema.methods.isRefreshTokenValid = function () {
    return new Date() < this.refreshTokenValidUntil;
};

export const sessionCollection = model('sessions', sessionSchema);
