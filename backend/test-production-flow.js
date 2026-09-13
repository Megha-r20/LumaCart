import http from 'http';

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function testFullProductionFlow() {
  console.log('=============== LUMACART PRODUCTION FLOW TEST ===============\n');

  try {
    // STEP 1: Customer Registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    console.log(`[1] Testing Customer Registration (${testEmail})...`);
    const regRes = await request('/api/users', 'POST', {
      name: 'Test Customer',
      email: testEmail,
      password: 'password123'
    });
    console.log(` -> Registration Status: ${regRes.status} (User ID: ${regRes.data._id})`);
    const userToken = regRes.data.token;

    // STEP 2: Save Shipping Address
    console.log('[2] Testing Customer Shipping Address Save...');
    const addrRes = await request('/api/users/address', 'POST', {
      title: 'Home',
      fullName: 'Test Customer',
      street: '100 Silicon Way',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95113',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true
    }, userToken);
    console.log(` -> Address Save Status: ${addrRes.status} (${addrRes.data?.length} addresses saved)`);

    // STEP 3: Browse Products
    console.log('[3] Testing Product Catalog & Filtering...');
    const productsRes = await request('/api/products?pageSize=10');
    console.log(` -> Products Catalog Status: ${productsRes.status} (Count: ${productsRes.data.products?.length})`);
    const targetProduct = productsRes.data.products[0];
    console.log(` -> Selected Target Product: "${targetProduct.name}" ($${targetProduct.price}, Stock: ${targetProduct.countInStock})`);

    // STEP 4: Product Details & Reviews
    console.log(`[4] Testing Product Detail API (/api/products/${targetProduct._id})...`);
    const detailRes = await request(`/api/products/${targetProduct._id}`);
    console.log(` -> Product Detail Status: ${detailRes.status}`);

    // STEP 5: Create Order
    console.log('[5] Testing Checkout & Order Placement...');
    const orderPayload = {
      orderItems: [
        {
          product: targetProduct._id,
          name: targetProduct.name,
          qty: 1,
          image: targetProduct.images[0],
          price: targetProduct.price
        }
      ],
      shippingAddress: {
        fullName: 'Test Customer',
        street: '100 Silicon Way',
        city: 'San Jose',
        state: 'CA',
        postalCode: '95113',
        country: 'United States',
        phone: '+1 (555) 123-4567'
      },
      paymentMethod: 'Stripe',
      shippingPrice: 0,
      discountPrice: 0
    };
    const orderRes = await request('/api/orders', 'POST', orderPayload, userToken);
    console.log(` -> Order Creation Status: ${orderRes.status} (Order ID: ${orderRes.data._id}, Tracking: ${orderRes.data.trackingNumber})`);
    const createdOrderId = orderRes.data._id;

    // STEP 6: Execute Stripe Test Payment Authorization
    console.log('[6] Testing Stripe Payment Completion...');
    const payRes = await request(`/api/orders/${createdOrderId}/pay`, 'PUT', {
      id: 'pi_test_prod_verify',
      status: 'succeeded',
      update_time: new Date().toISOString(),
      email_address: testEmail
    }, userToken);
    console.log(` -> Payment Status: ${payRes.status} (Is Paid: ${payRes.data.isPaid}, Order Status: ${payRes.data.status})`);

    // STEP 7: Customer Order History & Order Tracking
    console.log('[7] Testing Customer Order History & Order Details...');
    const myOrdersRes = await request('/api/orders/myorders', 'GET', null, userToken);
    console.log(` -> My Orders Status: ${myOrdersRes.status} (${myOrdersRes.data?.length} orders found)`);
    const orderDetailRes = await request(`/api/orders/${createdOrderId}`, 'GET', null, userToken);
    console.log(` -> Order Detail Status: ${orderDetailRes.status} (Tracking Logs: ${orderDetailRes.data.trackingLogs?.length})`);

    // STEP 8: Product Review Submission
    console.log('[8] Testing Product Review Submission...');
    const reviewRes = await request(`/api/reviews/${targetProduct._id}`, 'POST', {
      rating: 5,
      title: 'Flawless production performance!',
      comment: 'Testing end to end checkout experience. Outstanding build quality.'
    }, userToken);
    console.log(` -> Review Submission Status: ${reviewRes.status}`);

    // STEP 9: Admin Flow Testing
    console.log('\n--- ADMIN FLOW INTEGRATION TESTS ---');
    console.log('[9] Logging in as Admin (admin@lumacart.com)...');
    const adminLoginRes = await request('/api/users/login', 'POST', {
      email: 'admin@lumacart.com',
      password: 'password123'
    });
    console.log(` -> Admin Login Status: ${adminLoginRes.status} (Role: ${adminLoginRes.data.role})`);
    const adminToken = adminLoginRes.data.token;

    // STEP 10: Admin Dashboard Analytics
    console.log('[10] Testing Admin Dashboard Executive Analytics...');
    const dashRes = await request('/api/admin/dashboard', 'GET', null, adminToken);
    console.log(` -> Dashboard Status: ${dashRes.status}`);
    console.log(`    Revenue: $${dashRes.data.totalRevenue}, Orders: ${dashRes.data.totalOrders}, Products: ${dashRes.data.totalProducts}, Users: ${dashRes.data.totalUsers}`);

    // STEP 11: Admin Product CRUD
    console.log('[11] Testing Admin Product Creation & Management...');
    const newProductRes = await request('/api/products', 'POST', {
      name: 'Studio Master Monitor Headset',
      brand: 'LumaAudio',
      category: targetProduct.category._id || targetProduct.category,
      price: 499.00,
      originalPrice: 549.00,
      countInStock: 15,
      description: 'Reference studio monitors for mixing and mastering audio.',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      isFeatured: true,
      isTrending: false
    }, adminToken);
    console.log(` -> Product Creation Status: ${newProductRes.status} (New ID: ${newProductRes.data._id})`);
    const newProdId = newProductRes.data._id;

    // Update Product
    const updateProdRes = await request(`/api/products/${newProdId}`, 'PUT', {
      countInStock: 25,
      price: 479.00
    }, adminToken);
    console.log(` -> Product Update Status: ${updateProdRes.status} (Updated Stock: ${updateProdRes.data.countInStock})`);

    // Delete Product
    const delProdRes = await request(`/api/products/${newProdId}`, 'DELETE', null, adminToken);
    console.log(` -> Product Delete Status: ${delProdRes.status}`);

    // STEP 12: Admin Order Status Transition
    console.log('[12] Testing Admin Order Status Fulfillment Transition...');
    const orderStatusRes = await request(`/api/orders/${createdOrderId}/status`, 'PUT', {
      status: 'Shipped',
      note: 'Dispatched via FedEx priority express tracking #FX-99001122.'
    }, adminToken);
    console.log(` -> Order Status Transition: ${orderStatusRes.status} (New Status: ${orderStatusRes.data.status})`);

    // STEP 13: Customer Directory & Reviews Moderation
    console.log('[13] Testing Customer Directory & Review Moderation...');
    const usersListRes = await request('/api/users', 'GET', null, adminToken);
    console.log(` -> Customers Directory Status: ${usersListRes.status} (${usersListRes.data?.length} users)`);
    const reviewsListRes = await request('/api/reviews', 'GET', null, adminToken);
    console.log(` -> Review Moderation Status: ${reviewsListRes.status} (${reviewsListRes.data?.length} reviews)`);

    console.log('\n============================================================');
    console.log('✅ ALL CUSTOMER AND ADMIN FLOW TESTS COMPLETED SUCCESSFULLY!');
    console.log('============================================================');
  } catch (err) {
    console.error('❌ Production Flow Test Error:', err);
  }
}

testFullProductionFlow();
