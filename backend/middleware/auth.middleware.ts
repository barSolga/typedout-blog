import { Response, NextFunction} from 'express';
import {IUserRequest} from '../config/interfaces';
import {client} from '../config/database';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';


export const protect = asyncHandler(async (req: IUserRequest, res:Response, next:NextFunction) => {
    let token: string = '';
    const JWT_SECRET = process.env.JWT_SECRET as string;

    if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer'))  {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            
            // Get user from the token
            const user = await client.query('SELECT * from users WHERE email=($1)', [decoded.email])
            req.user = {
                ...user.rows[0],
                token
            };

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})