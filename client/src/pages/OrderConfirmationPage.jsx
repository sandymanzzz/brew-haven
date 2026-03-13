import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const STATUS_STEPS = ['confirmed', 'preparing', 'out-for-delivery', 'delivered'];
const STATUS_LABELS = { confirmed: 'Order Confirmed', preparing: 'Being Prepared', 'out-for-delivery': 'Out for Delivery', delivered: 'Delivered' };
const STATUS_ICONS = { confirmed: '✅', preparing: '👨‍🍳', 'out-for-delivery': '🛵', delivered: '🎉' };

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl animate-bounce mb-4">☕</div><p className="text-brew-600">Loading your order...</p></div>
    </div>
  );

  if (!order) return <div className="min-h-screen bg-cream-50 flex items-center justify-center"><p>Order not found.</p></div>;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🎉</div>
          <h1 className="font-display text-3xl font-bold text-espresso mb-2">Order Confirmed!</h1>
          <p className="text-brew-500">Thank you for your order. We're preparing your items with love.</p>
          <div className="inline-block bg-cream-100 border border-cream-300 rounded-lg px-4 py-2 mt-3 font-mono text-sm text-brew-700">
            Order #{order._id.slice(-8).toUpperCase()}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-bold text-espresso mb-6">Order Status</h2>
          <div className="flex items-start">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    i <= currentStepIndex ? 'bg-brew-600 text-white shadow-md' : 'bg-cream-200 text-brew-300'
                  }`}>
                    {i <= currentStepIndex ? STATUS_ICONS[s] : i + 1}
                  </div>
                  <div className={`text-xs font-medium mt-2 text-center ${i <= currentStepIndex ? 'text-brew-700' : 'text-brew-300'}`}>
                    {STATUS_LABELS[s]}
                  </div>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-all ${i < currentStepIndex ? 'bg-brew-600' : 'bg-cream-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-bold text-espresso mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-espresso line-clamp-1">{item.name}</div>
                  <div className="text-sm text-brew-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                </div>
                <div className="font-bold text-brew-700">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-cream-200 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-brew-600">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-brew-600">Delivery</span><span>${order.deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-brew-600">Tax</span><span>${order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-cream-200">
              <span className="font-display text-espresso">Total</span>
              <span className="font-display text-brew-700 text-xl">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="card p-6 mb-8">
          <h2 className="font-display font-bold text-espresso mb-4">Delivering To</h2>
          <div className="text-sm text-brew-600 space-y-1">
            <p className="font-semibold text-espresso">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-1">📧 {order.shippingAddress.email}</p>
            <p>📞 {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="btn-secondary flex-1 py-3 text-center">View All Orders</Link>
          <Link to="/menu" className="btn-primary flex-1 py-3 text-center">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
