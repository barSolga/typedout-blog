import {client} from '../config/database';
import {Request, Response} from 'express';
import asyncHandler from 'express-async-handler';

// TODO ADD USER PASSWORD ENCRYPTION
// TODO ADD JWT TOKEN GNENERATOR

// @desc    Get users
// @route   GET /api/users
// @access  * ~ private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allUsers = await client.query('SELECT * from users ORDER BY id DESC')
        res.status(200).json(allUsers.rows);
    } catch (error) {
        console.error(error);
        throw error;
    }
})

// @desc    POST user
// @route   POST /api/users
// @access  * ~ open
export const addUser = asyncHandler(async (req: Request, res: Response) => {
    const {username, password} = req.body;
    
    if(!username || !password) {
        res.json({error: 'Missing credentials'})
        return
    }

    const query = `
        INSERT INTO users (username, password) 
        VALUES (
            '${username}', 
            '${password}'
        )
        RETURNING *
    `

    try {
        const newUser = await client.query(query);   
        res.status(201).json(newUser.rows);
    } catch (error) {
        console.error(error);
        throw error;
    }
    
})

// @desc    GET single user
// @route   POST /api/users/:id
// @access  * ~ private
export const getSingleUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await client.query('SELECT * from users WHERE id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (user.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json(user.rows);

    } catch (error) {
        console.error(error);
        throw error;
    }
})

// @desc    PUT single user
// @route   PUT /api/users/:id
// @access  * ~ private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const {username, password} = req.body;

    if(!username || !password) {
        res.json({error: 'Missing credentials'})
        return
    }

    const query = `
        UPDATE users 
        SET username= '${username}', 
        password= '${password}'
        WHERE id = ${req.params.id}
    `
    
    try {
        const updatedUser = await client.query(query);

        // Check if db conatins user with specified ID
        if (updatedUser.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        throw error;
    }
})

// @desc    DELETE user
// @route   DELETE /api/users/:id
// @access  * ~ private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = await client.query('DELETE from users WHERE id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (user.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json({message: `Deleted user with id: ${req.params.id}`});

    } catch (error) {
        console.error(error);
        throw error;
    }
})