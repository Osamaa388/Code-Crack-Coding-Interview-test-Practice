import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTrendingQuestions
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/trending', getTrendingQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

export default router;
