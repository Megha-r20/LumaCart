import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.SEED_DB !== 'true') {
    console.log('Production seeding is disabled. Set SEED_DB=true only for explicit setup operations.');
    return;
  }

  if (process.env.SEED_DB !== 'true' && !process.argv[1]?.endsWith('seeder.js')) {
    console.log('Database seeding is disabled. Use the seed script or set SEED_DB=true explicitly.');
    return;
  }

  try {
    console.log('Seeding LumaCart database with Indian Rupee (₹) product catalog...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    // 1. Create Categories
    const categoriesData = [
      {
        name: 'Audio & Acoustics',
        slug: 'audio-acoustics',
        description: 'High fidelity headphones, wireless earbuds, and studio monitors.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        icon: 'Headphones',
        featured: true
      },
      {
        name: 'Wearable Tech',
        slug: 'wearable-tech',
        description: 'Smartwatches, fitness trackers, and modern wristwear.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        icon: 'Watch',
        featured: true
      },
      {
        name: 'Laptops & Computing',
        slug: 'laptops-computing',
        description: 'Ultra-thin notebooks, workstation laptops, and ergonomics.',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
        icon: 'Laptop',
        featured: true
      },
      {
        name: 'Smart Home & Living',
        slug: 'smart-home',
        description: 'Intelligent lighting, ambient speakers, and smart displays.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
        icon: 'Home',
        featured: true
      },
      {
        name: 'Cameras & Gear',
        slug: 'cameras-gear',
        description: 'Mirrorless cameras, lenses, and content creation gear.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        icon: 'Camera',
        featured: false
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    // 2. Create Users
    const adminUser = await User.create({
      name: 'Executive Admin',
      email: 'admin@lumacart.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      phone: '+1 (555) 019-2834',
      addresses: [
        {
          title: 'HQ Office',
          fullName: 'Executive Admin',
          street: '777 Tech Blvd, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          phone: '+1 (555) 019-2834',
          isDefault: true
        }
      ]
    });

    const demoCustomer = await User.create({
      name: 'Alexander Wright',
      email: 'user@lumacart.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      phone: '+1 (555) 432-8765',
      addresses: [
        {
          title: 'Home',
          fullName: 'Alexander Wright',
          street: '1428 Elmwood Ave',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'United States',
          phone: '+1 (555) 432-8765',
          isDefault: true
        }
      ]
    });

    const secondCustomer = await User.create({
      name: 'Sophia Vance',
      email: 'sophia@example.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
    });

    // 3. Create Products
    const productsData = [
      {
        user: adminUser._id,
        name: 'Acoustic Pro Wireless ANC Headphones',
        slug: 'acoustic-pro-wireless-anc-headphones',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Immerse yourself in crystal clear studio sound. Powered by custom 40mm beryllium drivers, active hybrid noise cancellation (ANC), and 45-hour battery longevity.',
        price: 24999,
        originalPrice: 29999,
        countInStock: 24,
        rating: 4.8,
        numReviews: 14,
        isFeatured: true,
        isTrending: true,
        specs: [
          { name: 'Driver Size', value: '40mm Beryllium' },
          { name: 'Battery Life', value: '45 Hours (ANC On)' },
          { name: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm' },
          { name: 'Weight', value: '254g' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Horizon Minimalist Smartwatch Ultra',
        slug: 'horizon-minimalist-smartwatch-ultra',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'VortexWear',
        category: catMap['wearable-tech'],
        description: 'Seamless titanium chassis with edge-to-edge LTPO AMOLED display. Advanced health tracking including ECG, SpO2 sensor, and dual-frequency GPS.',
        price: 32999,
        originalPrice: 36999,
        countInStock: 18,
        rating: 4.9,
        numReviews: 22,
        isFeatured: true,
        isTrending: true,
        specs: [
          { name: 'Case Material', value: 'Aerospace Grade Titanium' },
          { name: 'Display', value: '1.9" Sapphire LTPO OLED' },
          { name: 'Water Resistance', value: '10 ATM (100 meters)' },
          { name: 'Battery', value: 'Up to 7 Days' }
        ]
      },
      {
        user: adminUser._id,
        name: 'AeroBook Pro 15 M-Series OLED',
        slug: 'aerobook-pro-15-m-series-oled',
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'LumaTech',
        category: catMap['laptops-computing'],
        description: 'Engineered for creators and developers. Powered by 12-core ARM processor, 3.2K 120Hz OLED screen, and up to 20 hours of real-world productivity.',
        price: 124999,
        originalPrice: 139999,
        countInStock: 8, // Low stock warning
        rating: 4.7,
        numReviews: 9,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Processor', value: 'Luma Silicon X12 12-Core' },
          { name: 'RAM', value: '32GB Unified LPDDR5' },
          { name: 'Storage', value: '1TB NVMe PCIe Gen4 SSD' },
          { name: 'Display', value: '15.6" 3.2K OLED 120Hz' }
        ]
      },
      {
        user: adminUser._id,
        name: 'OmniSound Spatial Smart Speaker',
        slug: 'omnisound-spatial-smart-speaker',
        images: [
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'Aura',
        category: catMap['smart-home'],
        description: 'Room-filling 360-degree acoustic clarity with Dolby Atmos spatial audio support. Ambient LED atmosphere lighting that syncs with music playback.',
        price: 14999,
        originalPrice: 17999,
        countInStock: 35,
        rating: 4.6,
        numReviews: 11,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Speakers', value: '5 Drivers + Down-firing Subwoofer' },
          { name: 'Voice Assistants', value: 'Alexa, Google & Siri Compatible' },
          { name: 'Connectivity', value: 'Wi-Fi 6E, AirPlay 2, Spotify Connect' }
        ]
      },
      {
        user: adminUser._id,
        name: 'LumaLens X50 Mirrorless Camera 4K',
        slug: 'lumalens-x50-mirrorless-camera-4k',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'LumaOptics',
        category: catMap['cameras-gear'],
        description: 'Unleash your visual storytelling. 26.1MP BSI CMOS sensor, 4K 120fps video recording, and real-time AI eye tracking autofocus for portraits and wildlife.',
        price: 99999,
        originalPrice: 109999,
        countInStock: 5, // Low stock warning
        rating: 4.9,
        numReviews: 18,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Sensor', value: '26.1MP APS-C BSI CMOS' },
          { name: 'Video', value: '4K 10-bit 4:2:2 at 120fps' },
          { name: 'Autofocus', value: '425-Point Hybrid AI AF' }
        ]
      },
      {
        user: adminUser._id,
        name: 'TrueBuds Pro ANC Wireless Earbuds',
        slug: 'truebuds-pro-anc-wireless-earbuds',
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4d?w=800&auto=format&fit=crop&q=80'
        ],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Ergonomic in-ear design with adaptive noise transparency mode. Qi wireless charging case provides 32 hours total playtime.',
        price: 9999,
        originalPrice: 12999,
        countInStock: 42,
        rating: 4.5,
        numReviews: 30,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Noise Control', value: 'Adaptive Active Noise Cancellation' },
          { name: 'Water Resistance', value: 'IPX5 Sweat & Water Resistant' },
          { name: 'Case Battery', value: 'Qi Wireless + USB-C Fast Charge' }
        ]
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    // 4. Create Reviews
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: demoCustomer._id,
        name: demoCustomer.name,
        avatar: demoCustomer.avatar,
        rating: 5,
        title: 'Sensational sound precision and luxury build quality!',
        comment: 'These ANC headphones blow every competitor out of the water. The noise cancellation is dead silent on flights, and the memory foam ear cushions let me wear them for 8 hours without fatigue.',
        verifiedPurchase: true
      },
      {
        product: createdProducts[0]._id,
        user: secondCustomer._id,
        name: secondCustomer.name,
        avatar: secondCustomer.avatar,
        rating: 5,
        title: 'Worth every single penny.',
        comment: 'Unboxing experience felt like a high-end luxury brand. Battery life easily lasts me a full working week on a single charge.',
        verifiedPurchase: true
      },
      {
        product: createdProducts[1]._id,
        user: demoCustomer._id,
        name: demoCustomer.name,
        avatar: demoCustomer.avatar,
        rating: 5,
        title: 'Best titanium smartwatch on the market!',
        comment: 'The AMOLED screen visibility in direct sunlight is unreal. Battery easily gets me 6-7 days of daily workout tracking.',
        verifiedPurchase: true
      }
    ];

    await Review.insertMany(sampleReviews);

    // 5. Create Sample Orders for Dashboard Analytics
    const sampleOrders = [
      {
        user: demoCustomer._id,
        orderItems: [
          {
            name: createdProducts[0].name,
            qty: 1,
            image: createdProducts[0].images[0],
            price: createdProducts[0].price,
            product: createdProducts[0]._id
          }
        ],
        shippingAddress: demoCustomer.addresses[0],
        paymentMethod: 'Stripe',
        paymentResult: {
          id: 'pi_test_32187631287',
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: demoCustomer.email
        },
        itemsPrice: 24999,
        taxPrice: 4499.82,
        shippingPrice: 0.00,
        discountPrice: 0.00,
        totalPrice: 29498.82,
        isPaid: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'Delivered',
        deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        trackingNumber: 'LUMA-X8921B',
        trackingLogs: [
          { status: 'Pending', note: 'Order confirmed and payment authorized.', updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Processing', note: 'Packed at distribution hub.', updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000) },
          { status: 'Shipped', note: 'Out for courier delivery via BlueDart.', updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { status: 'Delivered', note: 'Package left at front doorstep.', updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
        ]
      },
      {
        user: secondCustomer._id,
        orderItems: [
          {
            name: createdProducts[1].name,
            qty: 1,
            image: createdProducts[1].images[0],
            price: createdProducts[1].price,
            product: createdProducts[1]._id
          },
          {
            name: createdProducts[3].name,
            qty: 1,
            image: createdProducts[3].images[0],
            price: createdProducts[3].price,
            product: createdProducts[3]._id
          }
        ],
        shippingAddress: {
          fullName: 'Sophia Vance',
          street: '55 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          postalCode: '33139',
          country: 'United States',
          phone: '+1 (555) 998-1122'
        },
        paymentMethod: 'Stripe',
        paymentResult: {
          id: 'pi_test_9988112233',
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: secondCustomer.email
        },
        itemsPrice: 47998,
        taxPrice: 8639.64,
        shippingPrice: 0.00,
        discountPrice: 0.00,
        totalPrice: 56637.64,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        status: 'Processing',
        trackingNumber: 'LUMA-K7734C',
        trackingLogs: [
          { status: 'Pending', note: 'Order placed.', updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
          { status: 'Processing', note: 'Payment verified, preparing item shipment.', updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }
        ]
      }
    ];

    await Order.insertMany(sampleOrders);

    console.log('Database seeded successfully with Categories, Products, Users, Reviews & Orders!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Allow direct CLI invocation via npm run seed
if (process.argv[1]?.endsWith('seeder.js')) {
  process.env.SEED_DB = 'true';
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
