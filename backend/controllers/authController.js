import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        phone: user.phone,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        phone: user.phone,
        wishlist: user.wishlist,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        phone: user.phone,
        wishlist: user.wishlist
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        addresses: updatedUser.addresses,
        phone: updatedUser.phone,
        wishlist: updatedUser.wishlist,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update address
// @route   POST /api/users/address
// @access  Private
export const saveAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { _id, title, fullName, street, city, state, postalCode, country, phone, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    if (_id) {
      // Edit existing address
      const addrIndex = user.addresses.findIndex(a => a._id.toString() === _id);
      if (addrIndex !== -1) {
        user.addresses[addrIndex] = {
          _id,
          title: title || 'Home',
          fullName,
          street,
          city,
          state,
          postalCode,
          country,
          phone,
          isDefault: !!isDefault
        };
      }
    } else {
      // Add new address
      const newIsDefault = user.addresses.length === 0 ? true : !!isDefault;
      user.addresses.push({
        title: title || 'Home',
        fullName,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: newIsDefault
      });
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user address
// @route   DELETE /api/users/address/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const existsIndex = user.wishlist.findIndex(id => id.toString() === productId);
    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate('wishlist');
    res.json(updatedUser.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
