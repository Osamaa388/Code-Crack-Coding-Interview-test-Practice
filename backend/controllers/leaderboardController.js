import User from '../models/User.js';

const getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ points: -1, questionsSolved: -1 }).limit(20).select('name username points questionsSolved streak profileImage');
  const leaderboard = users.map((user, idx) => ({ rank: idx + 1, name: user.name, username: user.username, points: user.points, solved: user.questionsSolved, streak: user.streak, profileImage: user.profileImage }));
  res.json(leaderboard);
};

export { getLeaderboard };
