import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
  };

  if (wishlistItems.length === 0) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6">❤️</div>
        <h2 className="font-display text-3xl font-bold text-espresso mb-3">Your wishlist is empty</h2>
        <p className="text-brew-500 mb-8">Save your favorite items for later by clicking the heart icon on any product.</p>
        <Link to="/menu" className="btn-primary text-base px-8 py-3.5">Discover Products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">My Wishlist</h1>
        <p className="text-brew-500 mb-8">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="card group overflow-hidden flex flex-col animate-slide-up">
              <div className="relative overflow-hidden h-48">
                <img src={product.image} alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'; }} />
                <button onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-red-500 fill-current" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span className="text-xs text-brew-500 capitalize mb-1">{product.category?.replace('-', ' ')}</span>
                <Link to={`/product/${product._id}`} className="font-display font-semibold text-espresso hover:text-brew-700 transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-sm text-brew-600 mt-1 line-clamp-2 flex-1">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-brew-700">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => moveToCart(product)}
                    className="flex-1 btn-primary py-2.5 text-sm">
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
