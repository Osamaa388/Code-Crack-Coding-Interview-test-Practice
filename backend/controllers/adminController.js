import User from '../models/User.js';
import Question from '../models/Question.js';

const getAdminSummary = async (req, res) => {
  const userCount = await User.countDocuments();
  const questionCount = await Question.countDocuments();
  const topUsers = await User.find().sort({ points: -1 }).limit(5).select('name points questionsSolved');
  res.json({ userCount, questionCount, topUsers });
};

const manageUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json(users);
};

const manageQuestions = async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
};

export { getAdminSummary, manageUsers, manageQuestions };
