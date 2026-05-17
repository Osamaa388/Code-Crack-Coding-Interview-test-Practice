import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  subCategory: { type: String, default: '' },
  problemStatement: { type: String, required: true },
  examples: { type: [{ input: String, output: String }], default: [] },
  constraints: { type: [String], default: [] },
  input: { type: String, default: '' },
  output: { type: String, default: '' },
  testCases: { type: [{ input: mongoose.Schema.Types.Mixed, expected: mongoose.Schema.Types.Mixed }], default: [] },
  hiddenTestCases: { type: [{ input: mongoose.Schema.Types.Mixed, expected: mongoose.Schema.Types.Mixed }], default: [] },
  hints: { type: [String], default: [] },
  solutions: {
    bruteForce: { type: String, default: '' },
    optimized: { type: String, default: '' },
    complexity: { type: String, default: '' }
  },
  solution: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  videoExplanation: { type: String, default: '' },
  tags: { type: [String], default: [] },
  companiesAsked: { type: [String], default: [] },
  timeComplexity: { type: String, default: '' },
  spaceComplexity: { type: String, default: '' },
  points: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
