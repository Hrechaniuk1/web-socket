import mongoose from "mongoose";
import { env } from "../helpers/env.js";

export async function innitMongoDBConnection() {
    try {
        const user = env('MG_USERNAME');
        const pwd = env('MG_PWD');
        const url = env('MG_URL');
        const db = env('MG_DB');

        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=ChatClaster`, {connectTimeoutMS: 20000,
            socketTimeoutMS: 45000,});
        console.log('MDB conected');
    }  catch (err) {
        console.log('init MDB err', err);
    }
};


