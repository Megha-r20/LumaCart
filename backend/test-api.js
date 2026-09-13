import http from 'http';

const testEndpoint = (path, method = 'GET', postData = null, token = null) => {
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

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

async function runVerification() {
  console.log('--- Lumacart API Verification ---');
  
  // 1. Check Health & Product list
  const productsRes = await testEndpoint('/api/products');
  console.log('Products API Status:', productsRes.status);
  console.log('Total Products returned:', productsRes.data.products?.length);

  // 2. Test Customer Login
  const userLoginRes = await testEndpoint('/api/users/login', 'POST', {
    email: 'user@lumacart.com',
    password: 'password123'
  });
  console.log('Customer Login Status:', userLoginRes.status);
  console.log('Customer Name:', userLoginRes.data.name);

  // 3. Test Admin Login
  const adminLoginRes = await testEndpoint('/api/users/login', 'POST', {
    email: 'admin@lumacart.com',
    password: 'password123'
  });
  console.log('Admin Login Status:', adminLoginRes.status);
  console.log('Admin Role:', adminLoginRes.data.role);

  // 4. Test Admin Dashboard Analytics Endpoint
  const adminToken = adminLoginRes.data.token;
  const dashRes = await testEndpoint('/api/admin/dashboard', 'GET', null, adminToken);
  console.log('Admin Dashboard API Status:', dashRes.status);
  console.log('Total Gross Revenue:', '$' + dashRes.data.totalRevenue);
  console.log('Total Orders:', dashRes.data.totalOrders);
  console.log('-----------------------------------');
}

runVerification();
