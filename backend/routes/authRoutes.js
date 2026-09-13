import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  saveAddress,
  deleteAddress,
  toggleWishlist,
  getUsers
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/', registerUser);
router.get('/', protect, admin, getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/address', protect, saveAddress);
router.delete('/address/:id', protect, deleteAddress);

router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;
