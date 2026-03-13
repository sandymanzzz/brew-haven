import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800', 'out-for-delivery': 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/admin/all');
        setOrders(data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: data.status } : o));
      if (selected?._id === orderId) setSelected((prev) => ({ ...prev, status: data.status }));
      toast.success(`Order status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filterStatus ? orders.filter((o) => o.status === filterStatus) : orders;

  return (
    <AdminLayout title="Orders Management">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field max-w-xs text-sm">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s.replace('-', ' ')}</option>)}
        </select>
        <div className="text-sm text-brew-500 self-center">
          Showing <span className="font-bold text-espresso">{filtered.length}</span> of {orders.length} orders
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-brew-700 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brew-600">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-espresso">{order.user?.name || 'N/A'}</div>
                      <div className="text-xs text-brew-400">{order.user?.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-brew-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-bold text-brew-700 text-sm">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${STATUS_COLORS[order.status]}`}>{order.status.replace('-', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-brew-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(order)} className="text-xs font-semibold text-brew-600 hover:text-brew-800 bg-brew-50 hover:bg-brew-100 px-3 py-1.5 rounded-lg transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-brew-400">No orders found</div>}
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-cream-200 flex justify-between items-center">
              <h2 className="font-display font-bold text-espresso">Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} className="text-brew-400 hover:text-espresso p-1 rounded-lg">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs font-bold text-brew-700 uppercase mb-2">Update Status</div>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`text-xs py-2 px-3 rounded-xl font-semibold capitalize transition-all border-2 ${
                        selected.status === s ? 'border-brew-600 bg-brew-600 text-white' : 'border-cream-200 hover:border-brew-400 text-brew-600'
                      }`}>
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-brew-700 uppercase mb-2">Customer</div>
                <div className="bg-cream-50 rounded-xl p-3 text-sm space-y-0.5">
                  <div className="font-semibold text-espresso">{selected.shippingAddress.fullName}</div>
                  <div className="text-brew-600">{selected.shippingAddress.email}</div>
                  <div className="text-brew-600">{selected.shippingAddress.phone}</div>
                  <div className="text-brew-600 mt-1">{selected.shippingAddress.street}, {selected.shippingAddress.city}, {selected.shippingAddress.state} {selected.shippingAddress.zipCode}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-brew-700 uppercase mb-2">Items</div>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-cream-50 rounded-xl p-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }} />
                      <div className="flex-1 text-sm">
                        <div className="font-semibold text-espresso">{item.name}</div>
                        <div className="text-brew-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                      </div>
                      <div className="font-bold text-brew-700 text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-cream-50 rounded-xl p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>${selected.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>${selected.deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold pt-1 border-t border-cream-200 text-base">
                  <span>Total</span><span className="text-brew-700">${selected.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
