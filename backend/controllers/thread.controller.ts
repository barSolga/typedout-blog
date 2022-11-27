import {client} from '../config/database';
import { Response } from 'express';
import { IUserRequest } from '../config/interfaces';
import asyncHandler from 'express-async-handler';

enum Roles {
    admin = 1,
    moderator = 2,
    regular = 3
}

// * DONE add pagination to threads
// TODO 
// ? get all Threads
// ? GET all moderated Threads
// ? GET all unmoderated Threads
// ? GET accepted Threads
// ? GET Threads by category
// ? Paginate all req for threads


// * DONE
// @desc    Get all threads
// @route   GET /api/threads?page=1&size=5
// @access  * ~ open to everybody
export const getAllThreads = asyncHandler(async (req: IUserRequest, res: Response) => {

    let query: string;
    let countItems;
    const page = req.query.page;
    const size = req.query.size;
    
    countItems = await client.query(`
        SELECT COUNT(*) 
        FROM Threads
    `);

    query = `
        SELECT Threads.*, Users.username, Categories.category_name
        FROM Threads 
        LEFT JOIN Users ON Threads.user_id = Users.user_id
        LEFT JOIN Categories ON Threads.category_id = Categories.category_id
        ORDER BY thread_id DESC
        LIMIT ${size}
        OFFSET ((${page} - 1) * ${size})
    ` 
    
    const totalItems = Number(countItems.rows[0].count);
    const totalPages = Math.ceil(totalItems / Number(size));


    try {
        const allItems = await client.query(query);
        res.status(200).json({
            totalItems: totalItems,
            items: allItems.rows,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        throw error
    }
});

// * DONE
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

// * DONE
// @desc    Update single category
// @route   PUT /api/categories/:id
// @access  * ~ private / admin
export const updateThread = asyncHandler(async (req: IUserRequest, res: Response) => {
    const {category_id, thread_title, thread_body, is_approved, is_closed} = req.body;

     // Check if user is admin or moderator
     if(req.user.role_id !== Roles.admin) {
        if(req.user.role_id !== Roles.moderator) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }
    
    // check if user provided required data
    if (!category_id || !thread_title || !thread_body || !is_approved || !is_closed) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const query = `
        UPDATE Threads SET 
        category_id='${category_id}', 
        thread_title='${thread_title}',
        thread_body='${thread_body}',
        is_approved='${is_approved}',
        is_closed='${is_closed}'
        WHERE thread_id=${req.params.id}
    `
    
    try {
        const updatedThread = await client.query(query);

        // Check if db conatins user with specified ID
        if (updatedThread.rowCount === 0) res.json({message: `Thread with id ${req.params.id} doesn't exist`});
        else res.status(200).json(updatedThread);

    } catch (error) {
        res.status(400)
        throw error;
    }
});

// * DONE
// @desc    DELETE category
// @route   DELETE /api/categories/:id
// @access  * ~ private / admin or moderator
export const deleteThread = asyncHandler(async (req: IUserRequest, res: Response) => {

    // Check if user is admin or moderator
    if(req.user.role_id !== Roles.admin) {
        if(req.user.role_id !== Roles.moderator) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    try {
        const thread = await client.query('DELETE from Threads WHERE thread_id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (thread.rowCount === 0) res.json({message: `Thread with id ${req.params.id} doesn't exist`});
        else res.status(200).json({message: `Deleted thread with id: ${req.params.id}`});

    } catch (error) {
        res.status(400)
        throw error;
    }
});

// * DONE
// @desc    Get all threads
// @route   GET /api/threads
// @access  * ~ open to everybody
export const searchThreads = asyncHandler(async (req: IUserRequest, res: Response) => {

    const searchTitle = req.query.query;

    console.log(searchTitle);
    
    const countItems = await client.query(`
        SELECT COUNT(*) 
        FROM Threads 
        WHERE thread_title 
        LIKE '%${searchTitle}%'
    `);

    const query = `
        SELECT Threads.*, Users.username, Categories.category_name
        FROM Threads 
        LEFT JOIN Users ON Threads.user_id = Users.user_id
        LEFT JOIN Categories ON Threads.category_id = Categories.category_id
        WHERE thread_title
        LIKE '%${searchTitle}%'
    ` 

    const totalItems = Number(countItems.rows[0].count);

    try {
        const allItems = await client.query(query);
        res.status(200).json({
            totalItems: totalItems,
            items: allItems.rows
        });
    } catch (error) {
        throw error
    }
});

// * DONE
// @desc    Get threads by categories
// @route   GET /api/threads/categories/:id/?page=1&size=5
// @access  * ~ open to everybody
export const getThreadsForCategory = asyncHandler(async (req: IUserRequest, res: Response) => {

    let query: string;
    let countItems;
    const category_id = req.params.id;
    const page = req.query.page;
    const size = req.query.size;


    
    countItems = await client.query(
        `SELECT COUNT(*) 
        FROM Threads 
        WHERE category_id=${category_id}
    `);

    query = `
        SELECT Threads.*, Users.username, Categories.category_name
        FROM Threads 
        LEFT JOIN Users ON Threads.user_id = Users.user_id
        LEFT JOIN Categories ON Threads.category_id = Categories.category_id
        WHERE Threads.category_id=${category_id}
        ORDER BY thread_id DESC
        LIMIT ${size}
        OFFSET ((${page} - 1) * ${size})
    ` 
    
    const totalItems = Number(countItems.rows[0].count);
    const totalPages = Math.ceil(totalItems / Number(size));


    try {
        const allItems = await client.query(query);
        res.status(200).json({
            totalItems: totalItems,
            items: allItems.rows,
            totalPages: totalPages,
            currentPage: page
        });
    } catch (error) {
        throw error
    }
});
