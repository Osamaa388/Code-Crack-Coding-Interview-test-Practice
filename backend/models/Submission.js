import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  language: { type: String, default: 'javascript' },
  code: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
  output: { type: String, default: '' },
  testResults: { type: [mongoose.Schema.Types.Mixed], default: [] },
  score: { type: Number, default: 0 },
  passedTests: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
