import {client} from '../config/database';
import {Response} from 'express';
import { IUserRequest } from '../config/interfaces';
import asyncHandler from 'express-async-handler';

enum Roles {
    admin = 1,
    moderator = 2,
    regular = 3
}

// * DONE
// @desc    Get all categories
// @route   GET /api/categories
// @access  * ~ open to everybody
export const getAllCategories = asyncHandler(async (req: IUserRequest, res: Response) => {

    const query = `
        SELECT * 
        FROM Categories 
        WHERE is_approved=true
        ORDER BY category_id DESC 
    `

    try {
        const allItems = await client.query(query);
        res.status(200).json(allItems.rows);
    } catch (error) {
        throw error
    }
});

// * DONE
// @desc    Add category
// @route   POST /api/categories
// @access  * ~ protected
export const addCategory = asyncHandler(async (req: IUserRequest, res: Response) => {
    const {category_name} = req.body;

    
    // check if user provided required data
    if (!category_name) {
        res.status(400);
        throw new Error('Please provide category name');
    }

    // Check if category exists
    const categoryExists = await client.query('SELECT * from Categories WHERE category_name=($1)', [category_name]);

    if (categoryExists.rowCount > 0) {
        res.status(400);
        throw new Error('Category already exists');
    }

    // SQL query
    const query = `
        INSERT INTO Categories (user_id, category_name) 
        VALUES (
            '${req.user.user_id}', 
            '${category_name}'
        )
        RETURNING *
    `

    // Add category to database
    try {
        const newCategory = await client.query(query);   
        res.status(201).json({
            ...newCategory.rows[0]
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
export const updateCategory = asyncHandler(async (req: IUserRequest, res: Response) => {
    const {category_name, is_approved} = req.body;

     // Check if user is admin or moderator
     if(req.user.role_id !== Roles.admin) {
        if(req.user.role_id !== Roles.moderator) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    // Check if category exists
    const categoryExists = await client.query('SELECT * from Categories WHERE category_id=($1)', [req.params.id]);

    if (categoryExists.rowCount === 0) {
        res.status(400);
        throw new Error('Category doesn`t exists');
    }
    
    // check if user provided required data
    if (!category_name || !is_approved) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    

    const query = `
        UPDATE Categories SET 
        category_name='${category_name}', 
        is_approved='${is_approved}'
        WHERE category_id=${req.params.id}
    `
    
    try {
        const updatedCategory = await client.query(query);

        // Check if db conatins user with specified ID
        if (updatedCategory.rowCount === 0) res.json({message: `Category with id ${req.params.id} doesn't exist`});
        else res.status(200).json(updatedCategory);

    } catch (error) {
        res.status(400)
        throw error;
    }
})

// * DONE
// @desc    DELETE category
// @route   DELETE /api/categories/:id
// @access  * ~ private / admin or moderator
export const deleteCategory = asyncHandler(async (req: IUserRequest, res: Response) => {

    console.log(req.user.role_id);
    // Check if user is admin or moderator
    if(req.user.role_id !== Roles.admin) {
        if(req.user.role_id !== Roles.moderator) {
            res.status(403)
            throw new Error('Not Authorized!')
        }
    }

    try {
        const category = await client.query('DELETE from Categories WHERE category_id=($1)', [req.params.id]);

        // Check if db conatins user with specified ID
        if (category.rowCount === 0) res.json({message: `Category with id ${req.params.id} doesn't exist`});
        else res.status(200).json({message: `Deleted category with id: ${req.params.id}`});

    } catch (error) {
        res.status(400)
        throw error;
    }
})