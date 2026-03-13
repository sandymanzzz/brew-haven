import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode, country: form.country },
      });
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await api.put('/auth/profile', { password: form.newPassword });
      toast.success('Password updated!');
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error('Failed to update password');
    } finally { setLoading(false); }
  };

  const inputCls = 'input-field text-sm';
  const labelCls = 'block text-xs font-semibold text-brew-700 mb-1.5';

  return (
    <div className="min-h-screen bg-cream-50 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8 p-6 bg-espresso rounded-2xl text-white">
          <div className="w-16 h-16 bg-brew-500 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {user?.name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-cream-100">{user?.name}</h1>
            <p className="text-cream-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 bg-brew-700 text-brew-300 text-xs px-3 py-0.5 rounded-full capitalize">{user?.role}</span>
          </div>
          {user?.role === 'admin' && (
            <div className="ml-auto">
              <button onClick={() => navigate('/admin')} className="bg-brew-500 hover:bg-brew-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                Admin Panel ⚙️
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-cream-100 p-1 rounded-xl w-fit">
          {['profile', 'address', 'security'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? 'bg-white shadow text-brew-700' : 'text-brew-500 hover:text-brew-700'}`}>
              {t === 'profile' ? '👤 Profile' : t === 'address' ? '📍 Address' : '🔒 Security'}
            </button>
          ))}
        </div>

        <div className="card p-6 animate-slide-up">
          {tab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-espresso mb-4">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Full Name</label>
                  <input className={inputCls} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
                <div><label className={labelCls}>Email Address</label>
                  <input className={`${inputCls} bg-cream-100 cursor-not-allowed`} value={user?.email} disabled /></div>
                <div><label className={labelCls}>Phone Number</label>
                  <input className={inputCls} value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 000-0000" /></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'address' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-espresso mb-4">Default Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className={labelCls}>Street Address</label>
                  <input className={inputCls} value={form.street} onChange={(e) => setForm({...form, street: e.target.value})} placeholder="123 Main St" /></div>
                <div><label className={labelCls}>City</label>
                  <input className={inputCls} value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} /></div>
                <div><label className={labelCls}>State</label>
                  <input className={inputCls} value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} /></div>
                <div><label className={labelCls}>ZIP Code</label>
                  <input className={inputCls} value={form.zipCode} onChange={(e) => setForm({...form, zipCode: e.target.value})} /></div>
                <div><label className={labelCls}>Country</label>
                  <input className={inputCls} value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} /></div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          )}

          {tab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-espresso mb-4">Change Password</h2>
              <div><label className={labelCls}>New Password</label>
                <input type="password" className={inputCls} value={form.newPassword} onChange={(e) => setForm({...form, newPassword: e.target.value})} placeholder="Min. 6 characters" /></div>
              <div><label className={labelCls}>Confirm New Password</label>
                <input type="password" className={inputCls} value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} placeholder="Repeat password" /></div>
              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <div className="pt-6 mt-6 border-t border-cream-200">
                <h3 className="font-semibold text-espresso mb-3">Danger Zone</h3>
                <button type="button" onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm border-2 border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-all">
                  🚪 Sign Out of Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
