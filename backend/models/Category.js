import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  },
  icon: {
    type: String,
    default: 'Grid'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
