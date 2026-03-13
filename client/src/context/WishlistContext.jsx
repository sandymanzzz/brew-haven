import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlistItems([]);
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlistItems(data.products || []);
    } catch {}
  };

  const toggleWishlist = async (product) => {
    if (!user) { toast.error('Please login to use wishlist'); return; }
    const isIn = wishlistItems.some((i) => i._id === product._id);
    // Optimistic update
    setWishlistItems((prev) =>
      isIn ? prev.filter((i) => i._id !== product._id) : [...prev, product]
    );
    toast.success(isIn ? 'Removed from wishlist' : `${product.name} added to wishlist! ❤️`);
    try {
      await api.post('/wishlist/toggle', { productId: product._id });
    } catch {
      // Revert on error
      setWishlistItems((prev) =>
        isIn ? [...prev, product] : prev.filter((i) => i._id !== product._id)
      );
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => wishlistItems.some((i) => i._id === productId);
  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount, loading, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
};
