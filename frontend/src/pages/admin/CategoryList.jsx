import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import API from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(NotificationContext);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/categories');
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, { name, description, image });
        addToast('Category updated!', 'success');
      } else {
        await API.post('/categories', { name, description, image });
        addToast('Category created!', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Error saving category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await API.delete(`/categories/${id}`);
        addToast('Category deleted', 'info');
        fetchCategories();
      } catch (err) {
        addToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Product Categories Manager</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}><div className="loading-spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: 140, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{cat.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleOpenEdit(cat)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" value={image} onChange={(e) => setImage(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
