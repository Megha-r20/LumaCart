import mongoose from 'mongoose';

const specSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  images: [{
    type: String,
    required: true
  }],
  brand: {
    type: String,
    required: [true, 'Please add a brand name']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  countInStock: {
    type: Number,
    required: [true, 'Please add stock count'],
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  specs: [specSchema],
  tags: [String]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
