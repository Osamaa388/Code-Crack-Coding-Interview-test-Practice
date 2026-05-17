import User from '../models/User.js';

const getCurrentUser = async (req, res) => {
  res.json(req.user);
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, bio, profileImage } = req.body;
  user.name = name || user.name;
  user.bio = bio || user.bio;
  user.profileImage = profileImage || user.profileImage;
  await user.save();
  res.json(user);
};

const getUserStats = async (req, res) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    questionsSolved: user.questionsSolved,
    points: user.points,
    streak: user.streak,
    bookmarks: user.bookmarks.length,
    recentActivity: user.recentActivity.slice(-10)
  });
};

const bookmarkQuestion = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.bookmarks.includes(req.params.questionId)) {
    user.bookmarks.push(req.params.questionId);
    await user.save();
  }
  res.json({ message: 'Bookmarked question' });
};

const removeBookmark = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.bookmarks = user.bookmarks.filter((bookmark) => bookmark.toString() !== req.params.questionId);
  await user.save();
  res.json({ message: 'Bookmark removed' });
};

const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate('bookmarks');
  res.json(user.bookmarks);
};

export { getCurrentUser, updateUserProfile, getUserStats, bookmarkQuestion, removeBookmark, getBookmarks };
