import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-espresso rounded-full flex items-center justify-center text-2xl">☕</div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-espresso mb-2">Create Account</h1>
          <p className="text-brew-500">Join Brew Haven for a better café experience</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                className="input-field" placeholder="John Doe" autoFocus />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="input-field pr-11" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brew-400 hover:text-brew-700">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3].map((l) => (
                      <div key={l} className={`h-1.5 flex-1 rounded-full transition-all ${strength >= l ? strengthColors[strength] : 'bg-cream-200'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-500' : 'text-green-600'}`}>
                    {strengthLabels[strength]} password
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-brew-700 mb-1.5">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={(e) => setForm({...form, confirm: e.target.value})}
                className={`input-field ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Repeat your password" />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-70">
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-brew-400 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <p className="text-center mt-6 text-brew-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brew-700 font-bold hover:text-brew-900 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
