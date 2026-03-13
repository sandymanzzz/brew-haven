import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '☕' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-espresso flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-brew-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brew-500 rounded-full flex items-center justify-center text-lg">☕</div>
            <div>
              <div className="font-display font-bold text-cream-100 text-sm">Brew Haven</div>
              <div className="text-xs text-brew-400">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-brew-600 text-white shadow-md' : 'text-cream-300 hover:bg-brew-800 hover:text-white'
              }`}>
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-brew-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 bg-brew-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
              {user?.name[0]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-cream-200 truncate">{user?.name}</div>
              <div className="text-xs text-brew-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-brew-900 rounded-xl transition-colors">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-espresso">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/" className="text-sm text-brew-600 hover:text-brew-800 font-medium">
              ← Back to Store
            </NavLink>
          </div>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden bg-espresso px-4 py-2 flex gap-2 overflow-x-auto">
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'bg-brew-600 text-white' : 'text-cream-300'
              }`}>
              {icon} {label}
            </NavLink>
          ))}
        </div>

        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
