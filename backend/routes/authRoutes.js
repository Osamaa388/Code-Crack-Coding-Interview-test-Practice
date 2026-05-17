import express from 'express';
import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 })], asyncHandler(registerUser));
router.post('/login', [body('email').isEmail(), body('password').exists()], asyncHandler(loginUser));
router.post('/logout', asyncHandler(logoutUser));
router.post('/forgot-password', [body('email').isEmail()], asyncHandler(forgotPassword));
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], asyncHandler(resetPassword));
router.get('/verify-email/:token', asyncHandler(verifyEmail));

export default router;
