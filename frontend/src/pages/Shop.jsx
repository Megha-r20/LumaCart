import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Check } from 'lucide-react';
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
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Product Catalog</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Showing {totalProducts} products
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</label>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <aside style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Filter size={18} className="text-gradient" />
              <span>Filters</span>
            </div>
            <button onClick={handleResetFilters} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="form-group">
            <label className="form-label">Search Keyword</label>
            <input
              type="text"
              placeholder="e.g. Headphones"
              className="form-control"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          {/* Categories Filter */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 200, overflowY: 'auto' }}>
              <button
                className={`btn btn-sm ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start' }}
                onClick={() => { setSelectedCategory(''); setPage(1); }}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`btn btn-sm ${selectedCategory === cat.slug ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="form-group">
            <label className="form-label">Price Range ($)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="form-group">
            <label className="form-label">Rating</label>
            <select
              className="form-control"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4 Stars & Above</option>
              <option value="4.5">4.5 Stars & Above</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input
              type="checkbox"
              id="inStockCheck"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
            />
            <label htmlFor="inStockCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>In Stock Only</label>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main>
          {loading ? (
            <div className="flex-center" style={{ padding: '6rem 0' }}>
              <div className="loading-spinner" />
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing filters or searching for different keywords.</p>
              <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
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

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setPage(p)}
                      style={{ width: 38, height: 38, padding: 0 }}
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
