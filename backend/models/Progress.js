import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: '' },
  solved: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
