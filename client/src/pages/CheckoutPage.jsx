import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'United States',
  });

  const [payment, setPayment] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [notes, setNotes] = useState('');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const required = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const f of required) {
      if (!shipping[f]) { toast.error(`Please fill in ${f}`); return; }
    }
    setStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!payment.cardName || !payment.cardNumber || !payment.expiry || !payment.cvv) {
      toast.error('Please fill all payment fields'); return;
    }
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      }));

      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: shipping,
        paymentMethod: 'card',
        subtotal,
        deliveryFee,
        tax,
        totalAmount: total,
        notes,
      });

      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const inputCls = 'input-field text-sm';

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Checkout</h1>

        {/* Step Indicators */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all ${
                i <= step ? 'bg-brew-600 text-white shadow-md' : 'bg-cream-200 text-brew-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${i <= step ? 'text-brew-700' : 'text-brew-400'}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 w-16 sm:w-24 transition-all ${i < step ? 'bg-brew-600' : 'bg-cream-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Forms */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <form onSubmit={handleShippingSubmit} className="card p-6 space-y-4 animate-slide-up">
                <h2 className="font-display text-xl font-bold text-espresso mb-2">Shipping Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Full Name *</label>
                    <input className={inputCls} value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} placeholder="John Doe" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Email *</label>
                    <input className={inputCls} type="email" value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})} placeholder="john@example.com" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Phone *</label>
                    <input className={inputCls} value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} placeholder="+1 (555) 000-0000" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Country</label>
                    <input className={inputCls} value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} /></div>
                  <div className="sm:col-span-2"><label className="block text-xs font-semibold text-brew-700 mb-1.5">Street Address *</label>
                    <input className={inputCls} value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} placeholder="123 Main Street, Apt 4B" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">City *</label>
                    <input className={inputCls} value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} placeholder="New York" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">State *</label>
                    <input className={inputCls} value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} placeholder="NY" /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">ZIP Code *</label>
                    <input className={inputCls} value={shipping.zipCode} onChange={(e) => setShipping({...shipping, zipCode: e.target.value})} placeholder="10001" /></div>
                </div>
                <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Order Notes (optional)</label>
                  <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." /></div>
                <button type="submit" className="btn-primary w-full py-3.5">Continue to Payment →</button>
              </form>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <form onSubmit={handlePaymentSubmit} className="card p-6 space-y-4 animate-slide-up">
                <h2 className="font-display text-xl font-bold text-espresso mb-2">Payment Details</h2>
                <div className="bg-brew-50 border border-brew-200 rounded-xl p-3 text-sm text-brew-700">
                  🔒 This is a mock payment system. No real charges will be made.
                </div>
                <div className="flex gap-3 mb-4">
                  {['💳 Card', '📱 Apple Pay', '🅿️ PayPal'].map((m) => (
                    <button type="button" key={m}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${m.includes('Card') ? 'border-brew-500 bg-brew-50 text-brew-700' : 'border-cream-300 text-brew-400'}`}>
                      {m}
                    </button>
                  ))}
                </div>
                <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Name on Card</label>
                  <input className={inputCls} value={payment.cardName} onChange={(e) => setPayment({...payment, cardName: e.target.value})} placeholder="John Doe" /></div>
                <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Card Number</label>
                  <input className={inputCls} value={payment.cardNumber}
                    onChange={(e) => setPayment({...payment, cardNumber: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()})}
                    placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">Expiry Date</label>
                    <input className={inputCls} value={payment.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g,'');
                        if (v.length >= 2) v = v.slice(0,2)+'/'+v.slice(2,4);
                        setPayment({...payment, expiry: v});
                      }}
                      placeholder="MM/YY" maxLength={5} /></div>
                  <div><label className="block text-xs font-semibold text-brew-700 mb-1.5">CVV</label>
                    <input className={inputCls} value={payment.cvv}
                      onChange={(e) => setPayment({...payment, cvv: e.target.value.replace(/\D/g,'').slice(0,4)})}
                      placeholder="123" maxLength={4} type="password" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button type="submit" className="btn-primary flex-1 py-3">Review Order →</button>
                </div>
              </form>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="card p-6 animate-slide-up">
                <h2 className="font-display text-xl font-bold text-espresso mb-5">Review Your Order</h2>
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 py-2 border-b border-cream-100 last:border-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100'; }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-espresso text-sm line-clamp-1">{item.name}</div>
                        <div className="text-xs text-brew-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-brew-700 text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-cream-50 rounded-xl p-4 mb-5 text-sm space-y-1">
                  <div className="font-semibold text-espresso mb-2">📍 Delivering to:</div>
                  <div className="text-brew-600">{shipping.fullName} · {shipping.phone}</div>
                  <div className="text-brew-600">{shipping.street}, {shipping.city}, {shipping.state} {shipping.zipCode}</div>
                  <div className="text-brew-600">{shipping.email}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button onClick={placeOrder} disabled={loading}
                    className="btn-primary flex-1 py-3 disabled:opacity-70">
                    {loading ? '⏳ Placing Order...' : `Place Order · $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-display font-bold text-espresso mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-brew-600 truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                    <span className="font-semibold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brew-600">Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-brew-600">Delivery</span><span className="font-semibold">${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-brew-600">Tax</span><span className="font-semibold">${tax.toFixed(2)}</span></div>
              </div>
              <div className="border-t border-cream-200 mt-3 pt-3 flex justify-between">
                <span className="font-display font-bold text-espresso">Total</span>
                <span className="font-display font-bold text-brew-700 text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
