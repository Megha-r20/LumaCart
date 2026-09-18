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
        countInStock: 8,
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
        countInStock: 5,
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
      },
      {
        user: adminUser._id,
        name: 'Zenith Studio Monitor 2.0',
        slug: 'zenith-studio-monitor-2-0',
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1518444065439-e933c06ce9a9?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Reference-class studio monitors tuned for nuanced detail, deep low-end response, and balanced room acoustics.',
        price: 25999,
        originalPrice: 30999,
        countInStock: 16,
        rating: 4.7,
        numReviews: 12,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Power', value: '110W RMS' },
          { name: 'Frequency Response', value: '35Hz - 22kHz' },
          { name: 'Connectivity', value: 'Bluetooth, USB-C, XLR' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Voyager Portable Bluetooth Speaker',
        slug: 'voyager-portable-bluetooth-speaker',
        images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80'],
        brand: 'EchoNest',
        category: catMap['audio-acoustics'],
        description: 'Travel-ready wireless speaker with punchy bass, immersive stereo pairing, and rugged waterproof shell.',
        price: 8999,
        originalPrice: 11999,
        countInStock: 31,
        rating: 4.4,
        numReviews: 17,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '18 Hours' },
          { name: 'Waterproof', value: 'IP67' },
          { name: 'Pairing', value: 'Stereo Pairing' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Nimbus Beam Desk Lamp',
        slug: 'nimbus-beam-desk-lamp',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=80'],
        brand: 'AetherHome',
        category: catMap['smart-home'],
        description: 'Adaptive task lighting with touch dimming, motion sensor activation, and wireless charging pad.',
        price: 5999,
        originalPrice: 7999,
        countInStock: 44,
        rating: 4.5,
        numReviews: 9,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Brightness', value: '900 Lumens' },
          { name: 'Charging', value: 'Qi Wireless' },
          { name: 'Sensors', value: 'Motion + Ambient' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Halo Smart Thermostat',
        slug: 'halo-smart-thermostat',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'],
        brand: 'AetherHome',
        category: catMap['smart-home'],
        description: 'AI-assisted climate control with geofencing, voice commands, and intelligent energy-saving scheduling.',
        price: 18999,
        originalPrice: 22999,
        countInStock: 22,
        rating: 4.8,
        numReviews: 15,
        isFeatured: true,
        isTrending: true,
        specs: [
          { name: 'Compatibility', value: 'HVAC + Alexa + Google' },
          { name: 'Display', value: 'Touchscreen' },
          { name: 'Energy Saving', value: 'Up to 25%' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Volt Mini Robot Vacuum',
        slug: 'volt-mini-robot-vacuum',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'],
        brand: 'CasaNova',
        category: catMap['smart-home'],
        description: 'Compact autonomous cleaning robot with lidar mapping, pet-hair rescue brush, and silent mode.',
        price: 21999,
        originalPrice: 27999,
        countInStock: 18,
        rating: 4.6,
        numReviews: 19,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Battery', value: '120 Minutes' },
          { name: 'Mapping', value: 'LiDAR' },
          { name: 'Noise', value: 'Quiet Mode' }
        ]
      },
      {
        user: adminUser._id,
        name: 'AirFrame Air Purifier Pro',
        slug: 'airframe-air-purifier-pro',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'],
        brand: 'PureAir',
        category: catMap['smart-home'],
        description: 'HEPA-grade purification for bedrooms and workspaces, with app monitoring and automatic filter alerts.',
        price: 16999,
        originalPrice: 20999,
        countInStock: 24,
        rating: 4.7,
        numReviews: 13,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'CADR', value: '420 m³/h' },
          { name: 'Filter', value: 'HEPA + Carbon' },
          { name: 'App', value: 'AQI Monitoring' }
        ]
      },
      {
        user: adminUser._id,
        name: 'AeroFold Laptop Stand',
        slug: 'aerofold-laptop-stand',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaDesk',
        category: catMap['laptops-computing'],
        description: 'Foldable aluminum laptop stand engineered for posture support, cooling airflow, and ergonomic desk space.',
        price: 4999,
        originalPrice: 6999,
        countInStock: 51,
        rating: 4.3,
        numReviews: 8,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Material', value: 'Aluminum' },
          { name: 'Height', value: 'Adjustable' },
          { name: 'Weight', value: '1.2kg' }
        ]
      },
      {
        user: adminUser._id,
        name: 'NovaBook Air 13',
        slug: 'novabook-air-13',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaTech',
        category: catMap['laptops-computing'],
        description: 'Ultra-portable lightweight laptop with long battery life, sharp 13.3-inch display, and quiet performance.',
        price: 79999,
        originalPrice: 89999,
        countInStock: 27,
        rating: 4.5,
        numReviews: 14,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Display', value: '13.3" Retina' },
          { name: 'Weight', value: '1.05kg' },
          { name: 'Battery', value: '18 Hours' }
        ]
      },
      {
        user: adminUser._id,
        name: 'PulseBook 14 Studio',
        slug: 'pulsebook-14-studio',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaTech',
        category: catMap['laptops-computing'],
        description: 'Creator-focused 14-inch laptop balancing performance, portability, and vibrant color-rich display.',
        price: 94999,
        originalPrice: 112999,
        countInStock: 12,
        rating: 4.8,
        numReviews: 11,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'CPU', value: 'Intel Core i7' },
          { name: 'GPU', value: 'RTX 4060' },
          { name: 'Display', value: '14" 2.8K' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Orbit Workstation 17',
        slug: 'orbit-workstation-17',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'ForgeCore',
        category: catMap['laptops-computing'],
        description: 'High-performance 17-inch workstation laptop built for rendering, simulations, and heavy productivity workflows.',
        price: 189999,
        originalPrice: 219999,
        countInStock: 7,
        rating: 4.9,
        numReviews: 10,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'CPU', value: 'AMD Ryzen 9' },
          { name: 'RAM', value: '64GB DDR5' },
          { name: 'Storage', value: '2TB SSD' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Aster Keyboard Pro',
        slug: 'aster-keyboard-pro',
        images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaDesk',
        category: catMap['laptops-computing'],
        description: 'Mechanical keyboard with hot-swappable switches, programmable RGB lighting, and premium aluminum base.',
        price: 8999,
        originalPrice: 11999,
        countInStock: 39,
        rating: 4.7,
        numReviews: 16,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Switches', value: 'Hot-swap Mechanical' },
          { name: 'Layout', value: 'Full Size' },
          { name: 'Lighting', value: 'RGB Backlit' }
        ]
      },
      {
        user: adminUser._id,
        name: 'PixelView Mirrorless XF',
        slug: 'pixelview-mirrorless-xf',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaOptics',
        category: catMap['cameras-gear'],
        description: 'Compact APS-C camera with 4K capture, weather-sealed body, and smart subject tracking for travel creators.',
        price: 74999,
        originalPrice: 83999,
        countInStock: 15,
        rating: 4.8,
        numReviews: 13,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Sensor', value: '24MP APS-C' },
          { name: 'Video', value: '4K 60fps' },
          { name: 'Body', value: 'Weather Sealed' }
        ]
      },
      {
        user: adminUser._id,
        name: 'FrameMax 35mm Prime Lens',
        slug: 'framemax-35mm-prime-lens',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaOptics',
        category: catMap['cameras-gear'],
        description: 'Fast 35mm prime lens with cinematic depth, crisp edge rendering, and low-light creativity.',
        price: 31999,
        originalPrice: 39999,
        countInStock: 21,
        rating: 4.7,
        numReviews: 10,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Aperture', value: 'f/1.8' },
          { name: 'Mount', value: 'APS-C Compatible' },
          { name: 'Use', value: 'Street & Portrait' }
        ]
      },
      {
        user: adminUser._id,
        name: 'SonicEdge Microphone Kit',
        slug: 'sonicedge-microphone-kit',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaCast',
        category: catMap['cameras-gear'],
        description: 'USB studio microphone set with shock mount, pop filter, and high-fidelity voice capture.',
        price: 14999,
        originalPrice: 18999,
        countInStock: 26,
        rating: 4.6,
        numReviews: 12,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Polar Pattern', value: 'Cardioid' },
          { name: 'Interface', value: 'USB-C' },
          { name: 'Use', value: 'Podcast & Voice' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Drift Camera Drone Mini',
        slug: 'drift-camera-drone-mini',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'],
        brand: 'SkyLuma',
        category: catMap['cameras-gear'],
        description: 'Portable drone with 4K stabilization, intelligent tracking, and auto-return for aerial moments.',
        price: 68999,
        originalPrice: 79999,
        countInStock: 9,
        rating: 4.7,
        numReviews: 8,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Camera', value: '4K UHD' },
          { name: 'Flight Time', value: '31 Minutes' },
          { name: 'Tracking', value: 'AI Follow' }
        ]
      },
      {
        user: adminUser._id,
        name: 'NovaLink Wireless Earbuds',
        slug: 'novalink-wireless-earbuds',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1572536147248-ac59a8abfa4d?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Compact in-ear earbuds with adaptive EQ, low-latency gaming mode, and sweat proof design.',
        price: 6999,
        originalPrice: 9999,
        countInStock: 48,
        rating: 4.4,
        numReviews: 20,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '32 Hours' },
          { name: 'Latency', value: 'Low Latency' },
          { name: 'Waterproof', value: 'IPX4' }
        ]
      },
      {
        user: adminUser._id,
        name: 'PulseFit Smart Watch Lite',
        slug: 'pulsefit-smart-watch-lite',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'VortexWear',
        category: catMap['wearable-tech'],
        description: 'Slim daily fitness tracker with body metrics, notifications, and all-day comfort design.',
        price: 8999,
        originalPrice: 10999,
        countInStock: 58,
        rating: 4.2,
        numReviews: 18,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Display', value: '1.3" AMOLED' },
          { name: 'Battery', value: '5 Days' },
          { name: 'Sensors', value: 'HR, SpO2, Sleep' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Grid Pro Fitness Band',
        slug: 'grid-pro-fitness-band',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'MoveWell',
        category: catMap['wearable-tech'],
        description: 'Lightweight fitness band with multi-sport tracking, recovery insights, and quick charge support.',
        price: 5999,
        originalPrice: 7999,
        countInStock: 64,
        rating: 4.3,
        numReviews: 14,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Tracking', value: '12 Sports' },
          { name: 'Battery', value: '7 Days' },
          { name: 'Material', value: 'Silicone' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Orbit Sleep Monitor',
        slug: 'orbit-sleep-monitor',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'VortexWear',
        category: catMap['wearable-tech'],
        description: 'Sleep and recovery wearable helping you track nightly patterns, deep sleep, and daily readiness.',
        price: 12999,
        originalPrice: 16999,
        countInStock: 29,
        rating: 4.5,
        numReviews: 12,
        isFeatured: true,
        isTrending: true,
        specs: [
          { name: 'Tracking', value: 'Sleep & Recovery' },
          { name: 'Battery', value: '4 Days' },
          { name: 'Comfort', value: 'Ultra Light' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Mira Smart Ring',
        slug: 'mira-smart-ring',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'AuroraFit',
        category: catMap['wearable-tech'],
        description: 'Minimalist smart ring for continuous wellness insights, heart rate, and stress monitoring.',
        price: 14999,
        originalPrice: 18999,
        countInStock: 22,
        rating: 4.6,
        numReviews: 11,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Material', value: 'Titanium' },
          { name: 'Battery', value: '5 Days' },
          { name: 'Metrics', value: 'HR + Recovery' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Summit Outdoor Watch',
        slug: 'summit-outdoor-watch',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'TrailPro',
        category: catMap['wearable-tech'],
        description: 'Adventure-ready watch with rugged design, GPS, route tracking, and sunlight-readable display.',
        price: 21999,
        originalPrice: 26999,
        countInStock: 19,
        rating: 4.7,
        numReviews: 15,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'GPS', value: 'Dual Frequency' },
          { name: 'Battery', value: '20 Days' },
          { name: 'Waterproof', value: '100m' }
        ]
      },
      {
        user: adminUser._id,
        name: 'FlexFit Smart Band X',
        slug: 'flexfit-smart-band-x',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'MoveWell',
        category: catMap['wearable-tech'],
        description: 'Comfort-first smart band built for active routines, coaching insights, and persistent battery life.',
        price: 7499,
        originalPrice: 9999,
        countInStock: 72,
        rating: 4.1,
        numReviews: 7,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '8 Days' },
          { name: 'Sensors', value: 'HR + GPS' },
          { name: 'Comfort', value: 'Soft Silicone' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Wave Bass Wireless Headset',
        slug: 'wave-bass-wireless-headset',
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Comfort-focused wireless headset with deep bass response, ambient mode, and all-day battery life.',
        price: 12999,
        originalPrice: 15999,
        countInStock: 18,
        rating: 4.5,
        numReviews: 9,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '34 Hours' },
          { name: 'Noise Control', value: 'Hybrid ANC' },
          { name: 'Weight', value: '290g' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Echo Mini Party Speaker',
        slug: 'echo-mini-party-speaker',
        images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80'],
        brand: 'EchoNest',
        category: catMap['audio-acoustics'],
        description: 'Pocket-sized party speaker with vibrant playback, splash protection, and instant stereo pairing.',
        price: 10999,
        originalPrice: 14999,
        countInStock: 28,
        rating: 4.4,
        numReviews: 10,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '20 Hours' },
          { name: 'Waterproof', value: 'IPX5' },
          { name: 'Pairing', value: 'TWS Stereo' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Signal Pro Gaming Headset',
        slug: 'signal-pro-gaming-headset',
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'Immersive gaming audio with directional cues, crystal-clear mic, and ultra-low latency connection.',
        price: 15999,
        originalPrice: 19999,
        countInStock: 17,
        rating: 4.6,
        numReviews: 11,
        isFeatured: false,
        isTrending: true,
        specs: [
          { name: 'Mic', value: 'Noise Canceling' },
          { name: 'Latency', value: '39ms' },
          { name: 'Audio', value: '7.1 Surround' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Soundwave Smart Speaker Mini',
        slug: 'soundwave-smart-speaker-mini',
        images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80'],
        brand: 'EchoNest',
        category: catMap['audio-acoustics'],
        description: 'Compact smart speaker for ambient sound, voice commands, and room-filling daily listening.',
        price: 6999,
        originalPrice: 8999,
        countInStock: 34,
        rating: 4.3,
        numReviews: 8,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Voice Assistant', value: 'Alexa + Google' },
          { name: 'Connectivity', value: 'Wi-Fi 5' },
          { name: 'Sound', value: '360° Audio' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Roam Smart Watch Active',
        slug: 'roam-smart-watch-active',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'VortexWear',
        category: catMap['wearable-tech'],
        description: 'Active lifestyle smartwatch designed for training, sleep tracking, and water-ready workouts.',
        price: 16999,
        originalPrice: 21999,
        countInStock: 23,
        rating: 4.4,
        numReviews: 9,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Display', value: 'AMOLED' },
          { name: 'Battery', value: '6 Days' },
          { name: 'Waterproof', value: '50m' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Bezel Health Smart Band',
        slug: 'bezel-health-smart-band',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'MoveWell',
        category: catMap['wearable-tech'],
        description: 'Performance-oriented wearable with recovery metrics, heart health insights, and soft-touch comfort.',
        price: 8999,
        originalPrice: 11999,
        countInStock: 33,
        rating: 4.3,
        numReviews: 8,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Metrics', value: 'HR + Recovery' },
          { name: 'Battery', value: '7 Days' },
          { name: 'Fit', value: 'Adaptive Strap' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Phase GPS Running Watch',
        slug: 'phase-gps-running-watch',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'TrailPro',
        category: catMap['wearable-tech'],
        description: 'Performance watch for runners with best-route maps, pace coaching, and workout summaries.',
        price: 23999,
        originalPrice: 28999,
        countInStock: 14,
        rating: 4.7,
        numReviews: 12,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'GPS', value: 'Dual Band' },
          { name: 'Workout', value: 'Coaching' },
          { name: 'Battery', value: '18 Days' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Zenith UltraBook 12',
        slug: 'zenith-ultrabook-12',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaTech',
        category: catMap['laptops-computing'],
        description: 'Compact ultrabook with fast SSD access, crisp display, and all-day battery efficiency.',
        price: 68999,
        originalPrice: 79999,
        countInStock: 31,
        rating: 4.5,
        numReviews: 9,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Weight', value: '980g' },
          { name: 'Storage', value: '512GB SSD' },
          { name: 'Battery', value: '17 Hours' }
        ]
      },
      {
        user: adminUser._id,
        name: 'TerraBook Flex 16',
        slug: 'terrabook-flex-16',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'ForgeCore',
        category: catMap['laptops-computing'],
        description: '2-in-1 design with responsive touchscreen, convertible form factor, and reliable performance.',
        price: 109999,
        originalPrice: 129999,
        countInStock: 11,
        rating: 4.6,
        numReviews: 10,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Display', value: '16" Touchscreen' },
          { name: 'CPU', value: 'Ryzen 7' },
          { name: 'Battery', value: '14 Hours' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Quantum Mini PC',
        slug: 'quantum-mini-pc',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaDesk',
        category: catMap['laptops-computing'],
        description: 'Compact desktop computer for focused workspaces, streaming, and lightweight creative tasks.',
        price: 55999,
        originalPrice: 65999,
        countInStock: 30,
        rating: 4.4,
        numReviews: 7,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'CPU', value: 'Intel i5' },
          { name: 'RAM', value: '16GB' },
          { name: 'Storage', value: '1TB SSD' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Breeze Smart Air Purifier',
        slug: 'breeze-smart-air-purifier',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'],
        brand: 'PureAir',
        category: catMap['smart-home'],
        description: 'Quiet, room-sensitive air purifier with adaptive fan speed and app-based air quality tracking.',
        price: 13999,
        originalPrice: 17999,
        countInStock: 26,
        rating: 4.5,
        numReviews: 10,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'CADR', value: '350 m³/h' },
          { name: 'Filter', value: 'Multi-layer' },
          { name: 'Noise', value: '24 dB' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Spindle Smart Lock Pro',
        slug: 'spindle-smart-lock-pro',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80'],
        brand: 'CasaNova',
        category: catMap['smart-home'],
        description: 'Keyless home security lock with app access, activity tracking, and remote unlocking features.',
        price: 17999,
        originalPrice: 21999,
        countInStock: 21,
        rating: 4.6,
        numReviews: 8,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Security', value: 'AES 256' },
          { name: 'Access', value: 'App + Keypad' },
          { name: 'Battery', value: '12 Months' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Astra Travel Camera Grip',
        slug: 'astra-travel-camera-grip',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaOptics',
        category: catMap['cameras-gear'],
        description: 'Portable camera grip for smoother handheld shooting, long-form vlogs, and travel documentation.',
        price: 8999,
        originalPrice: 11999,
        countInStock: 32,
        rating: 4.3,
        numReviews: 6,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Material', value: 'Aluminum' },
          { name: 'Use', value: 'Travel & Vlogging' },
          { name: 'Mount', value: 'Tripod Ready' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Capture Pocket 4K Cam',
        slug: 'capture-pocket-4k-cam',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'],
        brand: 'SkyLuma',
        category: catMap['cameras-gear'],
        description: 'Pocket-sized 4K camera built for quick clips, hikes, family moments, and everyday storytelling.',
        price: 45999,
        originalPrice: 56999,
        countInStock: 13,
        rating: 4.5,
        numReviews: 9,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Video', value: '4K 30fps' },
          { name: 'Zoom', value: '5x Optical' },
          { name: 'Battery', value: '2 Hours' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Drift Wireless Earbuds Studio',
        slug: 'drift-wireless-earbuds-studio',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1572536147248-ac59a8abfa4d?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaAudio',
        category: catMap['audio-acoustics'],
        description: 'High-resolution wireless earbuds tuned for balanced detail, low-latency streaming, and all-day comfort.',
        price: 7999,
        originalPrice: 9999,
        countInStock: 35,
        rating: 4.4,
        numReviews: 7,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '30 Hours' },
          { name: 'Case', value: 'USB-C Fast Charge' },
          { name: 'Fit', value: 'Secure In-Ear' }
        ]
      },
      {
        user: adminUser._id,
        name: 'PulseDesk Speaker Bar',
        slug: 'pulsedesk-speaker-bar',
        images: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&auto=format&fit=crop&q=80'],
        brand: 'EchoNest',
        category: catMap['audio-acoustics'],
        description: 'Desk-friendly soundbar with room-filling audio and wireless subwoofer support for immersive entertainment.',
        price: 18999,
        originalPrice: 22999,
        countInStock: 16,
        rating: 4.5,
        numReviews: 9,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Output', value: '2.1 Channel' },
          { name: 'Connectivity', value: 'Bluetooth + HDMI' },
          { name: 'Audio', value: 'Smart EQ' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Peak Health Tracker',
        slug: 'peak-health-tracker',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'AuroraFit',
        category: catMap['wearable-tech'],
        description: 'Slim wellness wearable focused on sleep, movement, and recovery for everyday momentum.',
        price: 6599,
        originalPrice: 8999,
        countInStock: 41,
        rating: 4.2,
        numReviews: 6,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Battery', value: '5 Days' },
          { name: 'Sensors', value: 'HR + Sleep' },
          { name: 'Comfort', value: 'Ultra Light' }
        ]
      },
      {
        user: adminUser._id,
        name: 'Rider Outdoor Watch',
        slug: 'rider-outdoor-watch',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'],
        brand: 'TrailPro',
        category: catMap['wearable-tech'],
        description: 'All-terrain watch built for hiking, trail navigation, and training with dependable battery life.',
        price: 20999,
        originalPrice: 25999,
        countInStock: 20,
        rating: 4.6,
        numReviews: 8,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'GPS', value: 'Multi-band' },
          { name: 'Battery', value: '21 Days' },
          { name: 'Waterproof', value: '100m' }
        ]
      },
      {
        user: adminUser._id,
        name: 'NovaSlate 14',
        slug: 'novaslate-14',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaTech',
        category: catMap['laptops-computing'],
        description: 'Balanced productivity laptop offering slick design, quick boot times, and dependable performance.',
        price: 62999,
        originalPrice: 74999,
        countInStock: 28,
        rating: 4.4,
        numReviews: 6,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'CPU', value: 'Intel Core i5' },
          { name: 'RAM', value: '16GB' },
          { name: 'Display', value: '14" FHD' }
        ]
      },
      {
        user: adminUser._id,
        name: 'StudioFlex 17 Pro',
        slug: 'studioflex-17-pro',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'],
        brand: 'ForgeCore',
        category: catMap['laptops-computing'],
        description: 'Large-screen workstation laptop optimized for creative production, editing, and multitasking.',
        price: 159999,
        originalPrice: 179999,
        countInStock: 9,
        rating: 4.7,
        numReviews: 8,
        isFeatured: true,
        isTrending: false,
        specs: [
          { name: 'Display', value: '17.3" 4K' },
          { name: 'GPU', value: 'RTX 4070' },
          { name: 'Storage', value: '2TB SSD' }
        ]
      },
      {
        user: adminUser._id,
        name: 'NestSense Wake Lamp',
        slug: 'nestsense-wake-lamp',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80'],
        brand: 'AetherHome',
        category: catMap['smart-home'],
        description: 'Smart bedside lamp that wakes you gently, syncs with your routine, and adapts night lighting.',
        price: 7499,
        originalPrice: 9999,
        countInStock: 27,
        rating: 4.3,
        numReviews: 7,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Brightness', value: '900 Lumens' },
          { name: 'Control', value: 'App + Voice' },
          { name: 'Hue', value: 'Adaptive Warm Light' }
        ]
      },
      {
        user: adminUser._id,
        name: 'FieldPro Lens Kit',
        slug: 'fieldpro-lens-kit',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'],
        brand: 'LumaOptics',
        category: catMap['cameras-gear'],
        description: 'Versatile lens kit for portraits, action scenes, and travel photography with crisp edge performance.',
        price: 27999,
        originalPrice: 33999,
        countInStock: 12,
        rating: 4.5,
        numReviews: 8,
        isFeatured: false,
        isTrending: false,
        specs: [
          { name: 'Aperture', value: 'f/1.8' },
          { name: 'Mount', value: 'APS-C' },
          { name: 'Use', value: 'Travel + Portrait' }
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
