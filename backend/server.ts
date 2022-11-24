import express, { Express, Request, Response } from "express";
import {connectDatabase} from './config/database';
import {errorHandler} from './middleware/error.middleware';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT);

// app setup
app.use(cors());
app.use(express.json());

// Imported routes
app.use('/api/users/', require('./routes/user.route'));
app.use('/api/categories/', require('./routes/category.route'));
app.use('/api/threads/', require('./routes/thread.route'));

// API Health check
app.get('/api/status', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'OK'
    });
});

app.use(errorHandler);

app.listen(port, () => {
    connectDatabase();
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});