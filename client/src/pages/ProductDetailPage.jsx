import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? 'text-brew-500' : 'text-cream-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-brew-600 font-semibold ml-1">{rating.toFixed(1)}</span>
    <span className="text-brew-400 text-sm">({product?.numReviews} reviews)</span>
  </div>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        const rel = await api.get(`/products?category=${data.category}&limit=4`);
        setRelated(rel.data.products.filter((p) => p._id !== id).slice(0, 3));
      } catch { navigate('/404'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded-xl w-full" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brew-500 mb-8">
          <Link to="/" className="hover:text-brew-700">Home</Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-brew-700">Menu</Link>
          <span>/</span>
          <Link to={`/menu?category=${product.category}`} className="hover:text-brew-700 capitalize">{product.category.replace('-', ' ')}</Link>
          <span>/</span>
          <span className="text-espresso font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'; }}
              />
            </div>
            {product.featured && (
              <div className="absolute top-4 left-4 bg-brew-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                ⭐ Staff Pick
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block bg-cream-200 text-brew-800 text-sm font-semibold px-3 py-1 rounded-full mb-3 w-fit capitalize">
              {product.category.replace('-', ' ')}
            </span>
            <h1 className="font-display text-4xl font-bold text-espresso mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-brew-500' : 'text-cream-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-brew-600 font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-brew-400 text-sm">({product.numReviews} reviews)</span>
            </div>

            <p className="text-brew-600 leading-relaxed mb-6 text-base">{product.description}</p>

            <div className="text-4xl font-display font-bold text-brew-700 mb-6">
              ${product.price.toFixed(2)}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-700' : product.stock > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-cream-100 text-brew-700 text-xs px-3 py-1 rounded-full border border-cream-200">#{tag}</span>
                ))}
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border-2 border-cream-300 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-brew-600 hover:bg-cream-100 transition-colors font-bold text-lg">−</button>
                <span className="w-12 text-center font-bold text-espresso">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-brew-600 hover:bg-cream-100 transition-colors font-bold text-lg">+</button>
              </div>

              <button
                onClick={() => { addToCart(product, quantity); }}
                disabled={product.stock === 0}
                className="flex-1 btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart · ${(product.price * quantity).toFixed(2)}
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 transition-all font-semibold ${
                inWishlist ? 'border-red-400 text-red-500 bg-red-50' : 'border-cream-300 text-brew-600 hover:border-brew-400'
              }`}
            >
              <svg className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Info badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-cream-200">
              {[['🚚', 'Free delivery', 'on orders $30+'], ['🔄', 'Easy returns', 'within 24 hrs'], ['💳', 'Secure payment', 'SSL encrypted']].map(([icon, title, sub]) => (
                <div key={title} className="text-center p-3 bg-cream-50 rounded-xl">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="text-xs font-bold text-espresso">{title}</div>
                  <div className="text-xs text-brew-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="card group overflow-hidden flex gap-4 p-4 hover:shadow-lg">
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200'; }} />
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-espresso line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-brew-500 mt-0.5 line-clamp-2">{p.description}</p>
                    <div className="font-bold text-brew-700 mt-2">${p.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
