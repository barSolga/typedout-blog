import {client} from '../config/database';
import {Request, Response} from 'express';
import asyncHandler from 'express-async-handler';


// @desc    Get users
// @route   GET /api/users
// @access  * ~ private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allUsers = await client.query('SELECT * from users ORDER BY id DESC')
        res.status(200).json(allUsers.rows);
    } catch (error) {
        res.status(400)
        throw error;
    }
})