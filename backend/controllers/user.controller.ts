import {client} from '../config/database';
import {Request, Response} from 'express';
import {IUserRequest, IUser} from '../config/interfaces';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

enum Roles {
    admin = 1,
    moderator = 2,
    regular = 3
}

// TODO
// ? password strength check & email check
// ? write tests for created routes [start from user]

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

// * DONE
// Generate JWT
const generateToken = (email: string) => {
    return jwt.sign({ email }, JWT_SECRET , {
        expiresIn: JWT_EXPIRES_IN,
    })
}

// * DONE
// @desc    Register a user
// @route   POST /api/users
// @access  * ~ open-public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {username, email, password, password2, role_id} = req.body;

    // prevent user form setting unwanted role
    if(role_id !== Roles.regular) {
        res.status(403)
        throw new Error('You are not allowed to do that')
    }
    
    // check if user provided required data
    if (!username || !email || !password || !password2 || !role_id) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // check if passwords match
    if (password !== password2) {
        res.status(400)
        throw new Error('Passwords do not match')
    }

    // Check if user with email exists
    const userExists = await client.query('SELECT * from users WHERE email=($1)', [email]);

    if (userExists.rowCount > 0) {
        res.status(400)
        throw new Error('User with specified email already exists')
    }

    // Check if username is available
    const usernameCheck = await client.query('SELECT * from users WHERE username=($1)', [username]);

    if(usernameCheck.rowCount > 0) {
        res.status(400)
        throw new Error('User with specified username already exists')
    }


    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // SQL query
    const query = `
        INSERT INTO users (username, email, password, role_id) 
        VALUES (
            '${username}', 
            '${email.toLowerCase()}',
            '${hashedPassword}',
            '${role_id}'
        )
        RETURNING *
    `

    // Add user to database
    try {
        const newUser = await client.query(query);   
        res.status(201).json({
            token: generateToken(email)
        });
    } catch (error) {
        res.status(400)
        throw error;
    }
    
})

// * DONE
// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  * ~ open-public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // Check for user email
    const data = await client.query('SELECT * from users WHERE email=($1)', [email.toLowerCase()]);
    const user: IUser = data.rows[0];

    // Check if user is exists 
    if(data.rowCount === 0) {
        res.status(400)
        throw new Error('There is no user with this email')
    }
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user.email),
      })
    } else {
      res.status(400)
      throw new Error('Invalid Password')
    }
})

// * DONE
// @desc    Get all users
// @route   GET /api/users
// @access  * ~ private
export const getAllUsers = asyncHandler(async (req: IUserRequest, res: Response) => {

    // check if user is admin
    if(req.user.role_id !== Roles.admin) {
        res.status(403)
        throw new Error('Not allowed to do that')
    }

    try {
        const allItems = await client.query(`SELECT * from Users ORDER BY user_id DESC`)
        res.status(200).json(allItems.rows);
    } catch (error) {
        throw error
    }
});

// * DONE
// @desc    GET single user
// @route   POST /api/users/:id
// @access  * ~ private
export const getSingleUser = asyncHandler(async (req: IUserRequest, res: Response) => {

    // Check if user is admin
    if(req.user.role_id !== Roles.admin) {
        // Check if user accesses his details
        if(Number(req.params.id) !== req.user.user_id) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    try {
        const user = await client.query('SELECT * from users WHERE user_id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (user.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json(user.rows);

    } catch (error) {
        res.status(400)
        throw error;
    }
})

// * DONE
// @desc    Update single user
// @route   PUT /api/users/:id
// @access  * ~ private
export const updateUser = asyncHandler(async (req: IUserRequest, res: Response) => {
    const {username, email, password, password2} = req.body;
    
    // Check if user is admin
    if(req.user.role_id !== Roles.admin) {
        // Check if user accesses his details
        if(Number(req.params.id) !== req.user.user_id) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    // check if user provided required data
    if (!username || !email || !password || !password2) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if username is available
    const usernameCheck = await client.query('SELECT * from users WHERE username=($1)', [username]);

    if(usernameCheck.rowCount > 0) {
        if(usernameCheck.rows[0].username !== req.user.username) {
            res.status(400)
            throw new Error('User with specified username already exists')
        }  
    }

    // check if passwords match
    if (password !== password2) {
        res.status(400)
        throw new Error('Passwords do not match')
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
        UPDATE users 
        SET 
        username= '${username}', 
        email= '${email}',
        password= '${hashedPassword}'
        WHERE user_id = ${req.params.id}
    `
    
    try {
        const updatedUser = await client.query(query);

        // Check if db conatins user with specified ID
        if (updatedUser.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json(updatedUser);

    } catch (error) {
        res.status(400)
        throw error;
    }
})

// * DONE
// @desc    DELETE user
// @route   DELETE /api/users/:id
// @access  * ~ private
export const deleteUser = asyncHandler(async (req: IUserRequest, res: Response) => {

    // Check if user is admin
    if(req.user.role_id !== Roles.admin) {
        // Check if user accesses his details
        if(Number(req.params.id) !== req.user.user_id) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    try {
        const user = await client.query('DELETE from users WHERE user_id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (user.rowCount === 0) res.json({message: `User with id ${req.params.id} doesn't exist`});
        else res.status(200).json({message: `Deleted user with id: ${req.params.id}`});

    } catch (error) {
        res.status(400)
        throw error;
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req: IUserRequest, res: Response) => {
    res.status(200).json({
        user_id: req.user.user_id,
        username: req.user.username,
        email: req.user.email,
        role_id: req.user.role_id
    });
})