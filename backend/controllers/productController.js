import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch all products with filtering, searching, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = req.query.category;
      } else {
        const cat = await Category.findOne({ slug: req.query.category });
        if (cat) query.category = cat._id;
      }
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sortBy === 'price-asc') sort = { price: 1 };
    else if (req.query.sortBy === 'price-desc') sort = { price: -1 };
    else if (req.query.sortBy === 'rating-desc') sort = { rating: -1 };
    else if (req.query.sortBy === 'newest') sort = { createdAt: -1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top featured / trending products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);
    const trending = await Product.find({ isTrending: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ featured, trending });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id).populate('category', 'name slug');
    }
    if (!product) {
      product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      originalPrice,
      brand,
      category,
      countInStock,
      description,
      images,
      specs,
      isFeatured,
      isTrending
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const product = new Product({
      name,
      slug,
      price: Number(price),
      originalPrice: Number(originalPrice || 0),
      user: req.user._id,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      brand,
      category,
      countInStock: Number(countInStock),
      numReviews: 0,
      rating: 0,
      description,
      specs: specs || [],
      isFeatured: !!isFeatured,
      isTrending: !!isTrending
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      originalPrice,
      brand,
      category,
      countInStock,
      description,
      images,
      specs,
      isFeatured,
      isTrending
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
      product.description = description || product.description;
      product.images = images || product.images;
      product.specs = specs || product.specs;
      product.isFeatured = isFeatured !== undefined ? !!isFeatured : product.isFeatured;
      product.isTrending = isTrending !== undefined ? !!isTrending : product.isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
