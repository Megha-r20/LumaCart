import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import CategoryList from './pages/admin/CategoryList';
import OrderList from './pages/admin/OrderList';
import CustomerList from './pages/admin/CustomerList';
import ReviewList from './pages/admin/ReviewList';

const StorefrontLayout = ({ children }) => (
  <div className="page-wrapper">
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Storefront Routes */}
        <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
        <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
        <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
        <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
        <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
        <Route path="/order-success/:id" element={<StorefrontLayout><OrderSuccess /></StorefrontLayout>} />
        <Route path="/orders" element={<StorefrontLayout><OrderHistory /></StorefrontLayout>} />
        <Route path="/orders/:id" element={<StorefrontLayout><OrderDetail /></StorefrontLayout>} />
        <Route path="/wishlist" element={<StorefrontLayout><Wishlist /></StorefrontLayout>} />
        <Route path="/profile" element={<StorefrontLayout><Profile /></StorefrontLayout>} />
        <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
        <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />

        {/* Executive Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="reviews" element={<ReviewList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
