import express, {Router} from 'express';

import {
    getAllUsers,
    addUser,
    getSingleUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller'

const router: Router = express.Router();


router.route('/users').get(getAllUsers).post(addUser);
router.route('/users/:id').get(getSingleUser).put(updateUser).delete(deleteUser);


module.exports = router;