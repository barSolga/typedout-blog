import express, {Router} from 'express';
import {protect} from '../middleware/auth.middleware';

import {
    getAllThreads,
    addThread
} from '../controllers/thread.controller'

const router: Router = express.Router();


router.route('/').get(getAllThreads).post(protect, addThread);
router.route('/:id').put(protect, ).delete(protect, );

module.exports = router;