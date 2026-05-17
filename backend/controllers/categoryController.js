import Category from '../models/Category.js';

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ title: 1 });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  await category.remove();
  res.json({ message: 'Category deleted' });
};

export { getCategories, createCategory, updateCategory, deleteCategory };
