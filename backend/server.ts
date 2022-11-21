import express, { Express, Request, Response } from "express";
import {connectDatabase} from './config/database';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/', require('./routes/user.route'));


app.get('/api/status', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'OK'
    });
});


app.listen(port, () => {
    connectDatabase();
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});