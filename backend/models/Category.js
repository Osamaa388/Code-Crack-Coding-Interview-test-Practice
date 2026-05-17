import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '🧩' },
  description: { type: String, default: '' }
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
