import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountPrice,
      totalPrice
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error('No valid order items provided');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      res.status(400);
      throw new Error('Incomplete shipping address');
    }

    // Verify stock availability and prices server-side
    const dbOrderItems = [];
    let calculatedItemsPrice = 0;

    for (const item of orderItems) {
      if (!item.product || !item.qty || item.qty <= 0) {
        res.status(400);
        throw new Error('Invalid order item quantity or product reference');
      }

      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name || item.product}`);
      }

      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.countInStock}`);
      }

      dbOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.images && product.images[0] ? product.images[0] : item.image,
        price: product.price,
        product: product._id
      });

      calculatedItemsPrice += product.price * item.qty;
    }

    const finalDiscount = Number(discountPrice) || 0;
    const finalShipping = Number(shippingPrice) || 0;
    const finalTax = Number((0.08 * Math.max(0, calculatedItemsPrice - finalDiscount)).toFixed(2));
    const calculatedTotal = Number((calculatedItemsPrice - finalDiscount + finalShipping + finalTax).toFixed(2));

    const order = new Order({
      user: req.user._id,
      orderItems: dbOrderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Stripe',
      itemsPrice: calculatedItemsPrice,
      taxPrice: finalTax,
      shippingPrice: finalShipping,
      discountPrice: finalDiscount,
      totalPrice: calculatedTotal,
      trackingLogs: [
        {
          status: 'Pending',
          note: 'Order created successfully.',
          updatedAt: new Date()
        }
      ]
    });

    const createdOrder = await order.save();

    // Decrement inventory counts
    for (const item of dbOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty }
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Enforce BOLA authorization: Owner or Admin only
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Enforce BOLA authorization check
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this order');
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || 'pi_sandbox',
        status: req.body.status || 'succeeded',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user.email
      };

      if (order.status === 'Pending') {
        order.status = 'Processing';
        order.trackingLogs.push({
          status: 'Processing',
          note: 'Payment authorized via Stripe test mode.',
          updatedAt: new Date()
        });
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid order status. Must be one of: ${allowedStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      order.trackingLogs.push({
        status,
        note: note || `Order status set to ${status}.`,
        updatedAt: new Date()
      });

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
