import {client} from '../config/database';
import {Request, Response} from 'express';
import { IUserRequest } from '../config/interfaces';
import asyncHandler from 'express-async-handler';


enum Roles {
    admin = 1,
    moderator = 2,
    regular = 3
}

// * DONE
// @desc    Get all threads
// @route   GET /api/threads
// @access  * ~ open to everybody
export const getAllThreads = asyncHandler(async (req: IUserRequest, res: Response) => {

    const query = `
        SELECT * 
        FROM Threads 
        ORDER BY thread_id DESC 
    `

    try {
        const allItems = await client.query(query);
        res.status(200).json(allItems.rows);
    } catch (error) {
        throw error
    }
});

// TODO
// @desc    Add threads
// @route   POST /api/threads
// @access  * ~ protected / users
export const addThread = asyncHandler(async (req: IUserRequest, res: Response) => {
    const {category_id, thread_title, thread_body } = req.body;
    
    // check if user provided required data
    if (!category_id || !thread_title || !thread_body ) {
        res.status(400);
        throw new Error('Please provide all fields');
    }

    // TODO check if category exists
    // ? if exists go further 
    // ? if doesn`t exists create category


    // SQL query
    const query = `
        INSERT INTO Threads (user_id, category_id, thread_title, thread_body) 
        VALUES (
            '${req.user.user_id}', 
            '${category_id}',
            '${thread_title}',
            '${thread_body}'
        )
        RETURNING *
    `

    // Add category to database
    try {
        const newThread = await client.query(query);   
        res.status(201).json({
            ...newThread.rows[0]
        });
    } catch (error) {
        res.status(400)
        throw error;
    }
    
});