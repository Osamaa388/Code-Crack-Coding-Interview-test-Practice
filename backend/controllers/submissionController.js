import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Bookmark from '../models/Bookmark.js';
import { executeCode, runTestCases } from '../utils/judge0.js';

const updateUserProgress = async (user, question, passed) => {
  if (!passed) return { xpEarned: 0, alreadySolved: false };

  const existing = await Submission.findOne({
    user: user._id,
    question: question._id,
    status: 'Passed'
  });

  if (existing) return { xpEarned: 0, alreadySolved: true };

  user.questionsSolved += 1;
  user.points += question.points;
  user.streak += 1;
  user.recentActivity.push(`Solved ${question.title}`);
  if (user.recentActivity.length > 20) user.recentActivity = user.recentActivity.slice(-20);
  if (user.questionsSolved >= 10 && !user.badges.includes('Problem Solver')) {
    user.badges.push('Problem Solver');
  }
  await user.save();

  await Progress.findOneAndUpdate(
    { user: user._id, category: question.category },
    { $inc: { solved: 1 }, $set: { lastActive: new Date() } },
    { upsert: true, new: true }
  );

  return { xpEarned: question.points, alreadySolved: false };
};

const runCode = async (req, res) => {
  const { questionId, language, code, customInput } = req.body;
  if (!code) return res.status(400).json({ message: 'Code is required' });

  let stdin = customInput || '';
  if (questionId) {
    const question = await Question.findById(questionId);
    if (question?.examples?.[0]?.input) {
      stdin = customInput || question.examples[0].input;
    }
  }

  const execution = await executeCode({ language: language || 'javascript', code, stdin });
  res.json({
    output: execution.stdout,
    stderr: execution.stderr,
    status: execution.status,
    time: execution.time,
    memory: execution.memory
  });
};

const submitCode = async (req, res) => {
  const { questionId, language, code } = req.body;
  if (!questionId || !code) {
    return res.status(400).json({ message: 'Question ID and code are required' });
  }

  const question = await Question.findById(questionId);
  if (!question) return res.status(404).json({ message: 'Question not found' });

  const visibleTests = (question.testCases || []).map((t) => ({ ...t.toObject?.() || t, hidden: false }));
  const hiddenTests = (question.hiddenTestCases || []).map((t) => ({ ...t.toObject?.() || t, hidden: true }));
  const allTests = [...visibleTests, ...hiddenTests];

  if (!allTests.length) {
    return res.status(400).json({ message: 'No test cases configured for this question' });
  }

  const evaluation = await runTestCases({
    language: language || 'javascript',
    code,
    testCases: allTests
  });

  const status = evaluation.allPassed ? 'Passed' : 'Failed';
  const submission = await Submission.create({
    user: req.user._id,
    question: questionId,
    language: language || 'javascript',
    code,
    status,
    output: evaluation.results.map((r) => `Test ${r.index}: ${r.passed ? 'PASS' : 'FAIL'}`).join('\n'),
    testResults: evaluation.results,
    score: Math.round((evaluation.passedCount / evaluation.total) * 100),
    passedTests: evaluation.passedCount,
    totalTests: evaluation.total
  });

  let xpEarned = 0;
  if (evaluation.allPassed) {
    const user = await User.findById(req.user._id);
    const progress = await updateUserProgress(user, question, true);
    xpEarned = progress.xpEarned;
  }

  res.json({
    message: evaluation.allPassed ? 'All test cases passed!' : 'Some test cases failed',
    submission,
    evaluation,
    xpEarned,
    passed: evaluation.allPassed
  });
};

const submitSolution = async (req, res) => {
  return submitCode(req, res);
};

const getSubmissions = async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate('question', 'title difficulty points')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(submissions);
};

const toggleBookmark = async (req, res) => {
  const { questionId } = req.body;
  if (!questionId) return res.status(400).json({ message: 'Question ID required' });

  const existing = await Bookmark.findOne({ user: req.user._id, question: questionId });
  if (existing) {
    await existing.deleteOne();
    const user = await User.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== questionId);
    await user.save();
    return res.json({ message: 'Bookmark removed', bookmarked: false });
  }

  await Bookmark.create({ user: req.user._id, question: questionId });
  const user = await User.findById(req.user._id);
  if (!user.bookmarks.includes(questionId)) {
    user.bookmarks.push(questionId);
    await user.save();
  }
  res.json({ message: 'Question bookmarked', bookmarked: true });
};

export { runCode, submitCode, submitSolution, getSubmissions, toggleBookmark };
