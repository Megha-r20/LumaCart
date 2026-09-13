import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Headphones, Watch, Laptop, Home as HomeIcon, Star, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, catRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/categories')
        ]);
        setFeaturedProducts(featRes.data.featured || []);
        setTrendingProducts(featRes.data.trending || []);
        setCategories(catRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading home data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      {/* Editorial Hero Section */}
      <section style={{ position: 'relative', background: 'radial-gradient(ellipse at 50% 0%, #1E1B4B 0%, #07090E 75%)', borderRadius: 'var(--radius-xl)', padding: '5rem 2.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Glow Spheres & Lighting Mesh */}
        <div style={{ position: 'absolute', top: '-15%', right: '5%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '0%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '1.5rem', gap: '0.5rem', padding: '0.45rem 1rem', fontSize: '0.8rem' }}>
              <Zap size={14} color="#F59E0B" /> 2026 Spatial Acoustics & Wearable Tech
            </div>
            <h1 style={{ fontSize: '3.4rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.035em' }}>
              Handcrafted Sound. <br />
              <span className="text-gradient">Pure Beryllium Precision.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 540, lineHeight: 1.65 }}>
              Engineered for audiophiles and digital creators. Discover hybrid ANC headphones, titanium LTPO smartwatches, and ultra-thin OLED workstation notebooks.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Explore Collection <ArrowRight size={20} />
              </Link>
              <Link to="/shop?category=audio-acoustics" className="btn btn-secondary btn-lg">
                Acoustic Gear
              </Link>
            </div>
          </div>

          {/* Hero Showcase Card */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Flagship Headphones"
                style={{ borderRadius: 'var(--radius-lg)', maxHeight: 380, width: '100%', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', padding: '0 0.5rem', textAlign: 'left' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Flagship Launch</div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Acoustic Pro ANC</div>
                  <div style={{ color: '#F59E0B', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <Star size={14} fill="#F59E0B" color="#F59E0B" /> 4.8 Rating (14 Reviews)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>$299.99</div>
                  <span className="badge badge-success">In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation Cards */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Categories</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Explore by Category</h2>
          </div>
          <Link to="/shop" style={{ color: '#A5B4FC', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            View Catalog <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all var(--transition-spring)',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="category-card"
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', marginBottom: '1.25rem', border: '2px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)' }}
              />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{cat.name}</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Explore Gear →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Flagships</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Featured Audio & Tech</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '5rem' }}>
            <div className="loading-spinner" />
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Flash Sale Banner */}
      <section className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: 'var(--radius-xl)', padding: '3.5rem 2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', boxShadow: 'var(--shadow-glow)' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.85rem' }}>Limited Internship Special</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.65rem' }}>Save 20% Off Your Entire Order</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Use promo code <strong style={{ color: '#F59E0B', fontSize: '1.15rem' }}>LUMA20</strong> at checkout to unlock instant discounts.
            </p>
          </div>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Shop Special Offer <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Trending Gear Section */}
      {trendingProducts.length > 0 && (
        <section className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Trending</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Popular Innovations</h2>
          </div>
          <div className="products-grid">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
