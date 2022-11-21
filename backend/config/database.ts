import {Client} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database details
const DB_USERNAME: string | undefined = process.env.DB_USERNAME;
const DB_HOST: string | undefined = process.env.DB_HOST;
const DB_PASSWORD: string | undefined = process.env.DB_PASSWORD;
const DB_NAME: string | undefined = process.env.DB_NAME;
const DB_PORT: number | undefined = Number(process.env.DB_PORT);


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



