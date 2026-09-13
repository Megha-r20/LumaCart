import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Check, Sparkles, Star } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [ratingFilter, setRatingFilter] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Pagination State
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch Categories
  useEffect(() => {
    API.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch Products on Filter Change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (keyword) params.set('keyword', keyword);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (inStockOnly) params.set('inStock', 'true');
        if (ratingFilter) params.set('rating', ratingFilter);
        if (sortBy) params.set('sortBy', sortBy);
        params.set('pageNumber', page);

        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, keyword, minPrice, maxPrice, inStockOnly, ratingFilter, sortBy, page]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setKeyword('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setRatingFilter('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem', gap: '0.4rem' }}>
            <Sparkles size={14} /> Catalog Discovery
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Explore Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Showing {totalProducts} items available
          </p>
        </div>

        {/* Sorting Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 700 }}>Sort By:</label>
          <select
            className="form-control"
            style={{
              width: 'auto',
              padding: '0.55rem 1.25rem',
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600
            }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest" style={{ background: '#0F172A', color: '#F8FAFC' }}>Newest Arrivals</option>
            <option value="price-asc" style={{ background: '#0F172A', color: '#F8FAFC' }}>Price: Low to High</option>
            <option value="price-desc" style={{ background: '#0F172A', color: '#F8FAFC' }}>Price: High to Low</option>
            <option value="rating-desc" style={{ background: '#0F172A', color: '#F8FAFC' }}>Highest Rated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
        {/* Polished Sidebar Filters */}
        <aside
          style={{
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            height: 'fit-content',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800, fontSize: '1.1rem' }}>
              <Filter size={18} color="#818CF8" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.82rem', color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Search Keyword */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Search Keyword
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="e.g. Headphones"
                className="form-control"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  paddingLeft: '2.4rem',
                  background: '#07090E',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)'
                }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: 220, overflowY: 'auto' }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  textAlign: 'left',
                  background: selectedCategory === '' ? undefined : '#07090E',
                  borderColor: selectedCategory === '' ? undefined : 'rgba(255, 255, 255, 0.08)',
                  fontSize: '0.88rem'
                }}
                onClick={() => { setSelectedCategory(''); setPage(1); }}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{
                      justifyContent: 'flex-start',
                      width: '100%',
                      textAlign: 'left',
                      background: isSelected ? undefined : '#07090E',
                      borderColor: isSelected ? undefined : 'rgba(255, 255, 255, 0.08)',
                      fontSize: '0.88rem'
                    }}
                    onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Price Range ($)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.65rem' }}>
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  background: '#07090E',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.85rem'
                }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                style={{
                  width: '100%',
                  minWidth: 0,
                  boxSizing: 'border-box',
                  background: '#07090E',
                  color: '#F8FAFC',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.85rem'
                }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rating Threshold
            </label>
            <select
              className="form-control"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#07090E',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.85rem'
              }}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="" style={{ background: '#0F172A', color: '#F8FAFC' }}>Any Rating</option>
              <option value="4" style={{ background: '#0F172A', color: '#F8FAFC' }}>4★ & Above</option>
              <option value="4.5" style={{ background: '#0F172A', color: '#F8FAFC' }}>4.5★ & Above</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="inStockCheck" style={{ fontSize: '0.92rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main>
          {loading ? (
            <div className="flex-center" style={{ padding: '6rem 0' }}>
              <div className="loading-spinner" />
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-lg)', padding: '5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', fontWeight: 800 }}>No products match your filters</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                Try adjusting your search terms, price range, or category selection.
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3.5rem' }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setPage(p)}
                      style={{ width: 42, height: 42, padding: 0, borderRadius: 'var(--radius-md)' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
