import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { OrderCardSkeleton } from '../components/common/Skeletons';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  'out-for-delivery': 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = { pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', 'out-for-delivery': '🛵', delivered: '🎉', cancelled: '❌' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="skeleton h-10 w-48 rounded-xl mb-8" />
        {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-4">📦</div>
            <h3 className="font-display text-2xl text-espresso mb-2">No orders yet</h3>
            <p className="text-brew-500 mb-6">Your order history will appear here once you make a purchase.</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card p-5 hover:shadow-lg transition-shadow animate-slide-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-brew-500">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>
                        {STATUS_ICONS[order.status]} {order.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-brew-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-brew-700 text-xl">${order.totalAmount.toFixed(2)}</div>
                    <div className="text-xs text-brew-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-sm"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }} />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-brew-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 bg-cream-100 rounded-lg flex items-center justify-center text-xs font-bold text-brew-600 flex-shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <div className="ml-2 text-sm text-brew-600 truncate">
                    {order.items.slice(0, 2).map((i) => i.name).join(', ')}{order.items.length > 2 ? '...' : ''}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-cream-100">
                  <div className="text-sm text-brew-500">
                    📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                  </div>
                  <Link to={`/order-confirmation/${order._id}`}
                    className="text-sm font-semibold text-brew-600 hover:text-brew-800 flex items-center gap-1 transition-colors">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
