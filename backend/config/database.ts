import {Client} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database details
const DB_USERNAME = process.env.DB_USERNAME as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_NAME = process.env.DB_NAME as string;
const DB_PORT = Number(process.env.DB_PORT) as number;


export const client: Client = new Client({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
});

export async function connectDatabase() {
    try {
        await client.connect();
        console.log(`📦[database]: Database successfully connected`);
    } catch (error) {
        console.error(error);
        return error;
    }
}



