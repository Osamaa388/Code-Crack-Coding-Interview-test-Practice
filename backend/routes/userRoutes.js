import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCurrentUser,
  updateUserProfile,
  getUserStats,
  bookmarkQuestion,
  removeBookmark,
  getBookmarks
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateUserProfile);
router.get('/me/stats', protect, getUserStats);
router.post('/me/bookmarks/:questionId', protect, bookmarkQuestion);
router.delete('/me/bookmarks/:questionId', protect, removeBookmark);
router.get('/me/bookmarks', protect, getBookmarks);

export default router;
