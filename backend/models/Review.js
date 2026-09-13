import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment']
  },
  verifiedPurchase: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Enforce 1 review per product per user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
