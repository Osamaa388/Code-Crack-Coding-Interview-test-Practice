import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { toggleBookmark } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', protect, toggleBookmark);

export default router;
