import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAdminSummary, manageUsers, manageQuestions } from '../controllers/adminController.js';

const router = express.Router();
router.use(protect, authorize('admin'));
router.get('/summary', getAdminSummary);
router.get('/users', manageUsers);
router.get('/questions', manageQuestions);
export default router;
