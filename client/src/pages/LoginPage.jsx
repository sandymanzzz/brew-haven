import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream-50 flex animate-fade-in">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-espresso relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 opacity-5 bg-center bg-cover"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-brew-500 rounded-full flex items-center justify-center text-2xl">☕</div>
            <div>
              <div className="font-display text-2xl font-bold text-cream-100">Brew Haven</div>
              <div className="font-accent text-sm text-brew-400">Café & Bakery</div>
            </div>
          </div>
          <h2 className="font-display text-4xl font-bold text-cream-100 leading-tight mb-4">
            Welcome back to your favorite café
          </h2>
          <p className="text-cream-400 text-lg leading-relaxed">
            Sign in to access your orders, wishlist, and personalized experience.
          </p>
          <div className="mt-12 space-y-4">
            {[['☕', 'Order your favorites in seconds'], ['❤️', 'Save items to your wishlist'], ['📦', 'Track your orders in real time']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-cream-300">
                <span className="text-xl">{icon}</span>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-espresso rounded-full flex items-center justify-center text-2xl mx-auto mb-3">☕</div>
            <div className="font-display text-2xl font-bold text-espresso">Brew Haven</div>
          </div>

          <h1 className="font-display text-3xl font-bold text-espresso mb-2">Sign In</h1>
          <p className="text-brew-500 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="input-field" placeholder="you@example.com" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="input-field pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brew-400 hover:text-brew-700 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-brew-50 border border-brew-200 rounded-xl p-3 text-xs text-brew-700">
              <span className="font-bold">Demo Admin:</span> admin@brewhaven.com / admin123
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-70">
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-brew-500">Don't have an account? </span>
            <Link to="/register" className="text-brew-700 font-bold hover:text-brew-900 transition-colors">Sign up for free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
