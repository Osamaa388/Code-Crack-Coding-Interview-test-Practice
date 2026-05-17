import mongoose from 'mongoose';

const mockInterviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  score: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MockInterview = mongoose.model('MockInterview', mockInterviewSchema);
export default MockInterview;
