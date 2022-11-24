import express, {Router} from 'express';
import {protect} from '../middleware/auth.middleware';

import {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controller'

const router: Router = express.Router();


router.route('/').get(getAllCategories).post(protect, addCategory);
router.route('/:id').put(protect, updateCategory).delete(protect, deleteCategory);

module.exports = router;