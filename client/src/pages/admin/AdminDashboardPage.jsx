import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: [], products: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders/admin/all'),
          api.get('/products?limit=100'),
          api.get('/users'),
        ]);
        setStats({ orders: ordersRes.data, products: productsRes.data.products, users: usersRes.data });
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const totalRevenue = stats.orders.filter((o) => o.isPaid).reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = stats.orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const recentOrders = stats.orders.slice(0, 5);

  const statCards = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'bg-green-50 border-green-200', textColor: 'text-green-700', link: '/admin/orders' },
    { label: 'Total Orders', value: stats.orders.length, icon: '📦', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', link: '/admin/orders' },
    { label: 'Total Products', value: stats.products.length, icon: '☕', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-700', link: '/admin/products' },
    { label: 'Total Users', value: stats.users.length, icon: '👥', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700', link: '/admin/users' },
    { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700', link: '/admin/orders' },
    { label: 'Out of Stock', value: stats.products.filter((p) => p.stock === 0).length, icon: '⚠️', color: 'bg-red-50 border-red-200', textColor: 'text-red-700', link: '/admin/products' },
  ];

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800', 'out-for-delivery': 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map(({ label, value, icon, color, textColor, link }) => (
              <Link key={label} to={link} className={`card p-5 border-2 ${color} hover:shadow-lg transition-shadow`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{icon}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className={`font-display text-2xl font-bold ${textColor}`}>{value}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">{label}</div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display font-bold text-espresso">Recent Orders</h2>
                <Link to="/admin/orders" className="text-xs text-brew-600 hover:text-brew-800 font-semibold">View All →</Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                    <div>
                      <div className="text-sm font-semibold text-espresso">#{order._id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-brew-500">{order.user?.name || 'Unknown'}</div>
                    </div>
                    <div className="text-right">
                      <span className={`badge text-xs ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      <div className="text-sm font-bold text-brew-700 mt-0.5">${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="card p-5">
              <h2 className="font-display font-bold text-espresso mb-4">Products by Category</h2>
              <div className="space-y-3">
                {['coffee', 'cold-drinks', 'tea', 'sandwiches', 'cakes', 'pastries', 'cookies', 'breakfast'].map((cat) => {
                  const count = stats.products.filter((p) => p.category === cat).length;
                  const pct = stats.products.length ? (count / stats.products.length) * 100 : 0;
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="w-24 text-xs font-medium text-brew-600 capitalize">{cat.replace('-', ' ')}</div>
                      <div className="flex-1 bg-cream-200 rounded-full h-2">
                        <div className="bg-brew-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-6 text-xs text-brew-500 text-right font-bold">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
