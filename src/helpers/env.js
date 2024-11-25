import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultName) {
    const value = process.env[name];
    if(value) return value;
    console.log(name)
    if(defaultName) return defaultName;
    throw new Error('Error with env function');
};
