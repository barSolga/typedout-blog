import express, {Router} from 'express';
import {protect} from '../middleware/auth.middleware';

import {
    // 
    addThread,
    updateThread,
    deleteThread,
    // 
    getAllAcceptedThreads,
    searchAcceptedThreads,
    getThreadsForCategory,
    // 
    getAllUnacceptedThreads,
    
} from '../controllers/thread.controller'

const router: Router = express.Router();

// PROTECTED DATA MANIPULATION ROUTES
router.route('/').post(protect, addThread);
router.route('/:id').put(protect, updateThread);
router.route('/:id').delete(protect, deleteThread);

// USER OPEN GET DATA ROUTES
router.route('/').get(getAllAcceptedThreads);
router.route('/search').get(searchAcceptedThreads);
router.route('/category/:id').get(getThreadsForCategory);

// MAINTENANCE DATA MANIPULATION ROUTES
router.route('/unaccepted').get(protect, getAllUnacceptedThreads);




module.exports = router;