import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { fetchMockInterview, submitMockInterview } from '../controllers/mockController.js';

const router = express.Router();
router.get('/', protect, fetchMockInterview);
router.post('/submit', protect, submitMockInterview);
export default router;
