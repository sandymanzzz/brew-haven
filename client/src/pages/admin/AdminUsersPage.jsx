import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const toggleRole = async (user) => {
    if (user._id === currentUser._id) { toast.error("You can't change your own role"); return; }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const { data } = await api.put(`/users/${user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u._id === data._id ? data : u));
      toast.success(`${user.name} is now ${newRole}`);
    } catch { toast.error('Failed to update role'); }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) { toast.error("You can't delete yourself"); return; }
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
      setConfirmDelete(null);
    } catch { toast.error('Delete failed'); }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="User Management">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input-field max-w-sm text-sm" />
        <div className="text-sm text-brew-500">
          <span className="font-bold text-espresso">{filtered.length}</span> users total
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-brew-700 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-brew-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-espresso">{user.name}</div>
                          {user._id === currentUser._id && (
                            <span className="text-xs text-brew-400">(you)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-brew-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${user.role === 'admin' ? 'bg-brew-100 text-brew-800' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-brew-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRole(user)}
                          disabled={user._id === currentUser._id}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border-2 border-brew-300 text-brew-600 hover:bg-brew-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {user.role === 'admin' ? '↓ Demote' : '↑ Promote'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(user)}
                          disabled={user._id === currentUser._id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-brew-400">No users found</div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="font-display text-xl font-bold text-espresso mb-2">Delete User?</h3>
            <p className="text-brew-500 text-sm mb-6">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This will permanently remove their account and data.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
