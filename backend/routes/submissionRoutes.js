import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { runCode, submitCode, submitSolution, getSubmissions } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.post('/', protect, submitSolution);
router.get('/', protect, getSubmissions);

export default router;
