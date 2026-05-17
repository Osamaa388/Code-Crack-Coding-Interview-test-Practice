import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, username, password } = req.body;
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

  let user;
  try {
    user = await User.create({ name, email, username, password });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({ message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already registered` });
    }
    throw error;
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:4173'}/verify-email/${verificationToken}`;
  let emailStatus = 'Verification email sent.';
  try {
    await sendEmail({ to: user.email, subject: 'Verify your CodeCrack AI account', text: `Verify your email: ${verificationUrl}` });
  } catch (emailError) {
    console.error('Verification email failed:', emailError);
    emailStatus = 'Verification email could not be sent. Please contact support.';
  }

  res.status(201).json({
    message: `User registered. ${emailStatus}`,
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    res.json({
      token: generateToken(user._id),
      expiresIn,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        points: user.points,
        questionsSolved: user.questionsSolved,
        streak: user.streak,
        profileImage: user.profileImage,
        badges: user.badges
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
};

const logoutUser = (req, res) => {
  res.json({ message: 'Logged out' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email not found' });
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetExpires = Date.now() + 3600000;
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail({ to: user.email, subject: 'Reset your CodeCrack AI password', text: `Reset password: ${resetUrl}` });
  res.json({ message: 'Password reset email sent' });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = password;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful', token: generateToken(user._id) });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ message: 'Invalid verification token' });
  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
};

export { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, verifyEmail };
