import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-brew-500' : 'text-cream-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-xs text-brew-600 ml-1 font-medium">{rating.toFixed(1)}</span>
  </div>
);

const categoryColors = {
  coffee: 'bg-amber-100 text-amber-800',
  'cold-drinks': 'bg-blue-100 text-blue-800',
  tea: 'bg-green-100 text-green-800',
  sandwiches: 'bg-orange-100 text-orange-800',
  cakes: 'bg-pink-100 text-pink-800',
  pastries: 'bg-yellow-100 text-yellow-800',
  cookies: 'bg-red-100 text-red-800',
  breakfast: 'bg-purple-100 text-purple-800',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600`; }}
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-brew-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Low Stock
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {/* Wishlist btn */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <svg className={`w-4 h-4 transition-colors ${inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <span className={`badge text-xs ${categoryColors[product.category] || 'bg-gray-100 text-gray-700'}`}>
            {product.category.replace('-', ' ')}
          </span>
        </div>
        <Link to={`/product/${product._id}`} className="font-display font-semibold text-espresso hover:text-brew-700 transition-colors mt-1 line-clamp-1">
          {product.name}
        </Link>
        <p className="text-sm text-brew-600 mt-1 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-3 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-brew-400 mt-0.5 block">({product.numReviews} reviews)</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-2xl font-bold text-brew-700">${product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-brew-600 hover:bg-brew-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
