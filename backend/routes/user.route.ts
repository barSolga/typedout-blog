import express, {Router} from 'express';
import {protect} from '../middleware/auth.middleware';

import {
    registerUser,
    loginUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser,
    deleteUser
} from '../controllers/user.controller'

const router: Router = express.Router();


router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.route('/').get(protect, getAllUsers).post(registerUser);
router.route('/:id').get(protect, getSingleUser).put(protect, updateUser).delete(protect, deleteUser);


module.exports = router;