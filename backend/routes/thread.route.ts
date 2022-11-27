import express, {Router} from 'express';
import {protect} from '../middleware/auth.middleware';

import {
    getAllThreads,
    addThread,
    updateThread,
    deleteThread,
    searchThreads,
    getThreadsForCategory
} from '../controllers/thread.controller'

const router: Router = express.Router();

router.route('/').get(getAllThreads).post(protect, addThread);
router.route('/:id').put(protect, updateThread).delete(protect, deleteThread);
router.route('/search').get(searchThreads);
router.route('/category/:id').get(getThreadsForCategory);


module.exports = router;