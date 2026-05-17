import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏆' },
  criteria: { type: String, default: '' }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
