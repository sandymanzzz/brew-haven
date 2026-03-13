import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeletons';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'cold-drinks', label: 'Cold Drinks', icon: '🧊' },
  { id: 'tea', label: 'Tea', icon: '🍵' },
  { id: 'sandwiches', label: 'Sandwiches', icon: '🥪' },
  { id: 'cakes', label: 'Cakes', icon: '🎂' },
  { id: 'pastries', label: 'Pastries', icon: '🥐' },
  { id: 'cookies', label: 'Cookies', icon: '🍪' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
];

const SORTS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || '';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (sort) params.set('sort', sort);
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('limit', '20');
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch {}
    finally { setLoading(false); }
  }, [category, sort, debouncedSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-espresso py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-cream-100 mb-2">Our Menu</h1>
          <p className="text-cream-400">Handcrafted with love, fresh every day</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brew-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search coffees, pastries, sandwiches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brew-400 hover:text-espresso">✕</button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="input-field sm:w-52"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setParam('category', cat.id === 'all' ? '' : cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                category === cat.id || (cat.id === 'all' && !searchParams.get('category'))
                  ? 'bg-brew-600 text-white border-brew-600 shadow-md'
                  : 'bg-white text-brew-700 border-cream-300 hover:border-brew-400 hover:bg-brew-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-brew-500 mb-6">
            Showing <span className="font-bold text-espresso">{products.length}</span> of {total} items
            {debouncedSearch && <span> for "<span className="font-medium">{debouncedSearch}</span>"</span>}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl text-espresso mb-2">Nothing found</h3>
            <p className="text-brew-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setSearchParams({}); }} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
