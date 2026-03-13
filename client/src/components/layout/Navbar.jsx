import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-espresso shadow-lg' : 'bg-espresso'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brew-500 rounded-full flex items-center justify-center group-hover:bg-brew-400 transition-colors">
              <span className="text-white text-lg">☕</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold text-cream-100">Brew Haven</span>
              <span className="hidden sm:block font-accent text-xs text-brew-400 leading-none">Café & Bakery</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === to
                    ? 'bg-brew-600 text-white'
                    : 'text-cream-200 hover:bg-brew-800 hover:text-white'
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 text-cream-300 hover:text-brew-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-cream-300 hover:text-brew-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brew-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative ml-1">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-brew-800 transition-colors">
                  <div className="w-7 h-7 bg-brew-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm text-cream-200 font-medium">{user.name.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-cream-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-cream-200 py-2 z-50">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-espresso hover:bg-cream-50 transition-colors">
                      <span>👤</span> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-espresso hover:bg-cream-50 transition-colors">
                      <span>📦</span> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <>
                        <hr className="my-1 border-cream-200" />
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-brew-700 hover:bg-cream-50 font-semibold transition-colors">
                          <span>⚙️</span> Admin Panel
                        </Link>
                      </>
                    )}
                    <hr className="my-1 border-cream-200" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/login" className="text-sm text-cream-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-brew-800 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="text-sm bg-brew-500 hover:bg-brew-400 text-white px-4 py-1.5 rounded-lg transition-colors font-semibold">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-1 p-2 text-cream-300 hover:text-white">
              <div className="w-5 space-y-1.5">
                <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-brew-800 py-3 pb-4 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="block px-4 py-2 text-cream-200 hover:bg-brew-800 rounded-lg transition-colors font-medium">
                {label}
              </Link>
            ))}
            {!user ? (
              <div className="pt-2 flex gap-2 px-4">
                <Link to="/login" className="flex-1 text-center py-2 border border-brew-500 text-brew-400 rounded-lg text-sm font-medium">Login</Link>
                <Link to="/register" className="flex-1 text-center py-2 bg-brew-500 text-white rounded-lg text-sm font-semibold">Sign Up</Link>
              </div>
            ) : (
              <div className="pt-2 px-4 space-y-1">
                <Link to="/profile" className="block py-2 text-cream-200 text-sm">👤 My Profile</Link>
                <Link to="/orders" className="block py-2 text-cream-200 text-sm">📦 My Orders</Link>
                {user.role === 'admin' && <Link to="/admin" className="block py-2 text-brew-400 text-sm font-semibold">⚙️ Admin Panel</Link>}
                <button onClick={handleLogout} className="block py-2 text-red-400 text-sm">🚪 Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Click outside to close dropdown */}
      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </header>
  );
}
