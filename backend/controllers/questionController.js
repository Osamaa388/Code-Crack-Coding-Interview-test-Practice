import Question from '../models/Question.js';

const getQuestions = async (req, res) => {
  const { page = 1, limit = 12, category, difficulty, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (search) query.title = { $regex: search, $options: 'i' };
  const total = await Question.countDocuments(query);
  const questions = await Question.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json({ questions, total, page: Number(page), pages: Math.ceil(total / limit) });
};

const getQuestionById = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });
  res.json(question);
};

const createQuestion = async (req, res) => {
  const question = await Question.create(req.body);
  res.status(201).json(question);
};

const updateQuestion = async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!question) return res.status(404).json({ message: 'Question not found' });
  res.json(question);
};

const deleteQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });
  await question.remove();
  res.json({ message: 'Question deleted' });
};

const getTrendingQuestions = async (req, res) => {
  const questions = await Question.find().sort({ points: -1 }).limit(6);
  res.json(questions);
};

export { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion, getTrendingQuestions };
