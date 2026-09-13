import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Package, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const { addToast } = useContext(NotificationContext);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    brand: '',
    category: '',
    countInStock: '',
    description: '',
    imageUrl: '',
    isFeatured: false,
    isTrending: false
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?pageSize=100'),
        API.get('/categories')
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      brand: '',
      category: categories[0]?._id || '',
      countInStock: '20',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      isFeatured: false,
      isTrending: false
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      brand: prod.brand,
      category: prod.category?._id || prod.category,
      countInStock: prod.countInStock,
      description: prod.description,
      imageUrl: prod.images && prod.images[0] ? prod.images[0] : '',
      isFeatured: !!prod.isFeatured,
      isTrending: !!prod.isTrending
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || 0),
        countInStock: Number(formData.countInStock),
        images: [formData.imageUrl]
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await API.post('/products', payload);
        addToast('Product created successfully!', 'success');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        addToast('Product removed', 'info');
        fetchProducts();
      } catch (err) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.brand.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Product Catalog Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage product listings, inventory levels, prices, and features</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter Search Field */}
      <div style={{ marginBottom: '1.75rem', maxWidth: 400, position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter by product title or brand..."
          className="form-control"
          style={{ paddingLeft: '2.5rem', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '5rem' }}><div className="loading-spinner" /></div>
      ) : (
        <div className="data-table-wrap" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Badges</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(prod => (
                <tr key={prod._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img src={prod.images?.[0]} alt={prod.name} style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover', background: '#07090E' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFF' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating: {prod.rating}★ ({prod.numReviews} reviews)</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 600, color: '#A5B4FC' }}>{prod.brand}</span></td>
                  <td>{prod.category?.name || 'Category'}</td>
                  <td style={{ fontWeight: 800, color: '#FFF' }}>₹{prod.price?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`badge ${prod.countInStock < 10 ? 'badge-danger' : 'badge-success'}`}>
                      ● {prod.countInStock} items
                    </span>
                  </td>
                  <td>
                    {prod.isFeatured && <span className="badge badge-primary" style={{ marginRight: '0.25rem' }}>Featured</span>}
                    {prod.isTrending && <span className="badge badge-warning">Trending</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-badge-btn" style={{ width: 34, height: 34 }} onClick={() => handleOpenEditModal(prod)} title="Edit Product">
                        <Edit2 size={14} />
                      </button>
                      <button className="icon-badge-btn" style={{ width: 34, height: 34, color: '#F87171' }} onClick={() => handleDeleteProduct(prod._id)} title="Delete Product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-lg)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{editingId ? 'Edit Product Catalog Item' : 'Create New Product Item'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} color="var(--text-muted)" /></button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Title</label>
                <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input type="text" className="form-control" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" step="0.01" className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price</label>
                  <input type="number" step="0.01" className="form-control" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Count</label>
                  <input type="number" className="form-control" value={formData.countInStock} onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(7, 9, 14, 0.6)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <label className="toggle-switch-group">
                  <input 
                    type="checkbox" 
                    className="toggle-switch"
                    checked={formData.isFeatured} 
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} 
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F8FAFC' }}>Featured Hero Showcase</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Display in main homepage hero banner</div>
                  </div>
                </label>

                <label className="toggle-switch-group">
                  <input 
                    type="checkbox" 
                    className="toggle-switch"
                    checked={formData.isTrending} 
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })} 
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F8FAFC' }}>Trending Section</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highlight in trending items strip</div>
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Item' : 'Create Item'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
