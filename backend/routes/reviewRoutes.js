import express from 'express';
import {
  createProductReview,
  getProductReviews,
  getAllReviews,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllReviews);
router.get('/product/:productId', getProductReviews);
router.post('/:productId', protect, createProductReview);
router.delete('/:id', protect, deleteReview);

export default router;
