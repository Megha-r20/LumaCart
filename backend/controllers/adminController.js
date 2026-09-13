import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Stats & Chart Data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments({});
    
    const lowStockCount = await Product.countDocuments({ countInStock: { $lt: 10 } });

    // Calculate total revenue from paid orders
    const orders = await Order.find({});
    const totalRevenue = orders
      .filter(o => o.isPaid || o.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalPrice, 0);

    // Count orders by status
    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    // Recent 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products list
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
      .select('name countInStock price category images')
      .populate('category', 'name')
      .limit(6);

    // Group sales by month (last 6 months)
    const monthlySalesMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seed with current date range
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear().toString().substr(-2)}`;
      monthlySalesMap[label] = 0;
    }

    orders.forEach(order => {
      if (order.isPaid || order.status !== 'Cancelled') {
        const date = new Date(order.createdAt);
        const label = `${months[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
        if (monthlySalesMap[label] !== undefined) {
          monthlySalesMap[label] += order.totalPrice;
        }
      }
    });

    const salesChart = Object.keys(monthlySalesMap).map(key => ({
      month: key,
      revenue: Math.round(monthlySalesMap[key] * 100) / 100
    }));

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      lowStockCount,
      statusCounts,
      salesChart,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};
