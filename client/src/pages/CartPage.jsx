import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cartItems, cartCount, subtotal, deliveryFee, tax, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartCount === 0) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="font-display text-3xl font-bold text-espresso mb-3">Your cart is empty</h2>
        <p className="text-brew-500 mb-8">Looks like you haven't added anything yet. Browse our menu and treat yourself!</p>
        <Link to="/menu" className="btn-primary text-base px-8 py-3.5">Browse Menu</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">Shopping Cart <span className="text-brew-500 font-body text-xl font-normal">({cartCount} items)</span></h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
            <span>🗑️</span> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card p-4 flex gap-4 animate-slide-up">
                <Link to={`/product/${item._id}`} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200'; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <Link to={`/product/${item._id}`} className="font-display font-semibold text-espresso hover:text-brew-700 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <span className="text-xs text-brew-500 capitalize">{item.category?.replace('-', ' ')}</span>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-cream-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-brew-600 hover:bg-cream-100 transition-colors font-bold">−</button>
                      <span className="w-10 text-center text-sm font-bold text-espresso">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-brew-600 hover:bg-cream-100 transition-colors font-bold">+</button>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-bold text-brew-700 text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                      {item.quantity > 1 && <div className="text-xs text-brew-400">${item.price.toFixed(2)} each</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-espresso mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-brew-600">Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brew-600">Delivery Fee</span>
                  <span className="font-semibold">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brew-600">Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                {subtotal >= 30 && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs p-2.5 rounded-lg">
                    <span>🎉</span> Free delivery on orders $30+!
                  </div>
                )}
                {subtotal < 30 && (
                  <div className="bg-brew-50 text-brew-700 text-xs p-2.5 rounded-lg">
                    Add <span className="font-bold">${(30 - subtotal).toFixed(2)}</span> more for free delivery!
                  </div>
                )}
              </div>
              <div className="border-t border-cream-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-espresso text-lg">Total</span>
                  <span className="font-display font-bold text-brew-700 text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(user ? '/checkout' : '/login?redirect=/checkout')}
                className="btn-primary w-full py-3.5 text-base"
              >
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              <Link to="/menu" className="btn-secondary w-full py-3 text-sm mt-3 text-center block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
