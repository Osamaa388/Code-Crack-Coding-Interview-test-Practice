import Question from '../models/Question.js';

const fetchMockInterview = async (req, res) => {
  const { difficulty = 'Medium', count = 3 } = req.query;
  const questions = await Question.find({ difficulty }).limit(Number(count));
  res.json({ questions, duration: `${count * 10} minutes`, prompt: 'Solve the following mock interview questions with the timer enabled.' });
};

const submitMockInterview = async (req, res) => {
  const { answers } = req.body;
  if (!answers || answers.length === 0) return res.status(400).json({ message: 'No answers provided' });
  res.json({ message: 'Mock interview submitted', score: answers.filter((answer) => answer.passed).length * 100 / answers.length, feedback: 'Great attempt! Review weak categories and try another session.' });
};

export { fetchMockInterview, submitMockInterview };
