import mongoose from "mongoose";
import { env } from "../helpers/env.js";

export async function innitMongoDBConnection() {
    try {
        const user = env('MDB_USER');
        const pwd = env('MDB_PASSWORD');
        const url = env('MDB_URL');
        const db = env('MDB_DB');

        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=EventApp`, {connectTimeoutMS: 20000,
            socketTimeoutMS: 45000,});
        console.log('MDB conected');
    }  catch (err) {
        console.log('init MDB err', err);
    }
};
