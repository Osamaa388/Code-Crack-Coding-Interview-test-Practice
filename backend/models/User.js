import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: 'Coding interview enthusiast.' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  rank: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  questionsSolved: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  recentActivity: { type: [String], default: [] },
  emailVerified: { type: Boolean, default: false },
  resetToken: String,
  resetExpires: Date,
  verificationToken: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
