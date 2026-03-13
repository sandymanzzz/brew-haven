import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', category: 'coffee', image: '', rating: '4.5', stock: '100', featured: false, tags: '' };
const CATEGORIES = ['coffee', 'cold-drinks', 'tea', 'sandwiches', 'cakes', 'pastries', 'cookies', 'breakfast'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, price: p.price.toString(), rating: p.rating.toString(), stock: p.stock.toString(), tags: p.tags?.join(', ') || '' });
    setEditProduct(p);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating),
        stock: parseInt(form.stock),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editProduct) {
        const { data } = await api.put(`/products/${editProduct._id}`, payload);
        setProducts((prev) => prev.map((p) => p._id === data._id ? data : p));
        toast.success('Product updated!');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts((prev) => [data, ...prev]);
        toast.success('Product created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
      setConfirmDelete(null);
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = 'input-field text-sm';
  const labelCls = 'block text-xs font-semibold text-brew-700 mb-1.5';

  return (
    <AdminLayout title="Product Management">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-sm text-sm" />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <span className="text-lg">+</span> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-brew-700 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }} />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-espresso truncate max-w-[200px]">{p.name}</div>
                          <div className="text-xs text-brew-400 truncate max-w-[200px]">{p.description.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="badge bg-cream-100 text-brew-700 capitalize text-xs">{p.category.replace('-', ' ')}</span></td>
                    <td className="px-4 py-3 font-bold text-brew-700 text-sm">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
                        {p.stock === 0 ? '❌ Out' : p.stock < 10 ? `⚠️ ${p.stock}` : `✓ ${p.stock}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-brew-600">⭐ {p.rating}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${p.featured ? 'text-brew-600' : 'text-gray-400'}`}>
                        {p.featured ? '✅ Yes' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-brew-600 hover:bg-brew-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setConfirmDelete(p)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-brew-400">No products found</div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-cream-200 flex justify-between items-center">
              <h2 className="font-display text-xl font-bold text-espresso">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-brew-400 hover:text-espresso p-1 rounded-lg hover:bg-cream-100">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={labelCls}>Product Name *</label>
                  <input className={inputCls} required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Description *</label>
                  <textarea className={inputCls} required rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></div>
                <div><label className={labelCls}>Price ($) *</label>
                  <input className={inputCls} type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} /></div>
                <div><label className={labelCls}>Category *</label>
                  <select className={inputCls} value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c.replace('-', ' ')}</option>)}
                  </select></div>
                <div><label className={labelCls}>Stock</label>
                  <input className={inputCls} type="number" min="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} /></div>
                <div><label className={labelCls}>Rating (0–5)</label>
                  <input className={inputCls} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({...form, rating: e.target.value})} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Image URL</label>
                  <input className={inputCls} value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." /></div>
                {form.image && <div className="sm:col-span-2"><img src={form.image} alt="Preview" className="h-24 w-24 object-cover rounded-xl border border-cream-200" onError={(e) => { e.target.style.display='none'; }} /></div>}
                <div className="sm:col-span-2"><label className={labelCls}>Tags (comma-separated)</label>
                  <input className={inputCls} value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} placeholder="espresso, hot, classic" /></div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                    className="w-4 h-4 accent-brew-600 cursor-pointer" />
                  <label htmlFor="featured" className="text-sm font-semibold text-brew-700 cursor-pointer">Mark as Featured</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-cream-200">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 disabled:opacity-70">
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="font-display text-xl font-bold text-espresso mb-2">Delete Product?</h3>
            <p className="text-brew-500 text-sm mb-6">Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
