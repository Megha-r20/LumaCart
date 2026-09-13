import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create new review
// @route   POST /api/reviews/:productId
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed by you');
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar,
      rating: Number(rating),
      title: title || '',
      comment
    });

    // Update product rating stats
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('product', 'name slug images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin or reviewer)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;
      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
