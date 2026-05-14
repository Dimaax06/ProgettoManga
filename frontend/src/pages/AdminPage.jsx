import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt, FaUsers, FaBook, FaStar, FaHeart,
  FaBan, FaUnlock, FaCrown, FaTrash, FaPlus, FaEdit,
  FaTimes, FaCheck, FaSearch, FaChartBar
} from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageTransition from '../components/ui/PageTransition';
import GlowButton from '../components/ui/GlowButton';

const StatCard = ({ icon: Icon, label, value, color = 'red' }) => {
  const colors = { red: 'text-red-400 bg-red-500/10', purple: 'text-purple-400 bg-purple-500/10', blue: 'text-blue-400 bg-blue-500/10', yellow: 'text-yellow-400 bg-yellow-500/10' };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 border border-white/6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className={`font-display text-4xl tracking-wider ${colors[color].split(' ')[0]}`}>{value?.toLocaleString() ?? '—'}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </motion.div>
  );
};

const MangaModal = ({ manga, onClose, onSave }) => {
  const [form, setForm] = useState(manga || { title: '', author: '', description: '', cover_url: '', genres: [], status: 'ongoing', chapters: 0, year: new Date().getFullYear(), is_featured: 0 });
  const [saving, setSaving] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Seinen', 'Shonen', 'Shoujo', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];

  const currentGenres = typeof form.genres === 'string' ? JSON.parse(form.genres || '[]') : (form.genres || []);
  const toggleGenre = (g) => {
    const updated = currentGenres.includes(g) ? currentGenres.filter(x => x !== g) : [...currentGenres, g];
    setForm(f => ({ ...f, genres: updated }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (manga?.id) {
        await api.put(`/manga/${manga.id}`, form);
        toast.success('Manga updated!');
      } else {
        await api.post('/manga', form);
        toast.success('Manga created!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving manga');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl glass-card rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl text-white tracking-wider">{manga?.id ? 'Edit Manga' : 'Add Manga'}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Title *</label>
              <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Manga title" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Author *</label>
              <input value={form.author} onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} required placeholder="Author name" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm(f => ({ ...f, year: parseInt(e.target.value) }))} min="1900" max="2030" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Chapters</label>
              <input type="number" value={form.chapters} onChange={(e) => setForm(f => ({ ...f, chapters: parseInt(e.target.value) }))} min="0" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
                {['ongoing', 'completed', 'hiatus', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Cover URL</label>
              <input value={form.cover_url} onChange={(e) => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full resize-none" placeholder="Manga synopsis..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-3 uppercase tracking-wider">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button type="button" key={g} onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all
                      ${currentGenres.includes(g) ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={Boolean(form.is_featured)}
                onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked ? 1 : 0 }))}
                className="w-4 h-4 accent-red-500" />
              <label htmlFor="featured" className="text-sm text-gray-400">Featured on homepage hero</label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <GlowButton type="submit" variant="filled" loading={saving}>
              {manga?.id ? 'Update Manga' : 'Create Manga'}
            </GlowButton>
            <GlowButton type="button" variant="ghost" onClick={onClose}>Cancel</GlowButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [manga, setManga] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [mangaSearch, setMangaSearch] = useState('');
  const [showMangaModal, setShowMangaModal] = useState(false);
  const [editingManga, setEditingManga] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u, m] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users?limit=50'),
        api.get('/manga?limit=50&sort=created_at&order=DESC'),
      ]);
      setStats(s.data);
      setUsers(u.data.users || []);
      setManga(m.data.manga || []);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error';
      toast.error(`Failed to load admin data: ${msg}`);
      console.error('Admin load error:', err.response?.status, msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) loadData();
  }, [user, isAdmin, loadData]);

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const toggleBan = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/ban`);
      setUsers(u => u.map(usr => usr.id === id ? { ...usr, is_banned: data.is_banned } : usr));
      toast.success(data.is_banned ? 'User banned' : 'User unbanned');
    } catch { toast.error('Error'); }
  };

  const togglePromote = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/promote`);
      setUsers(u => u.map(usr => usr.id === id ? { ...usr, role: data.role } : usr));
      toast.success(`User is now ${data.role}`);
    } catch { toast.error('Error'); }
  };

  const deleteManga = async (id) => {
    if (!confirm('Delete this manga? This will also delete all reviews and favorites.')) return;
    try {
      await api.delete(`/manga/${id}`);
      setManga(m => m.filter(mg => mg.id !== id));
      toast.success('Manga deleted');
    } catch { toast.error('Error'); }
  };

  const filteredUsers = userSearch ? users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) : users;
  const filteredManga = mangaSearch ? manga.filter(m => m.title.toLowerCase().includes(mangaSearch.toLowerCase())) : manga;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: FaChartBar },
    { id: 'manga', label: 'Manga', icon: FaBook },
    { id: 'users', label: 'Users', icon: FaUsers },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        {/* Header */}
        <div className="relative py-10 border-b border-white/5 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <FaShieldAlt className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="font-display text-4xl text-white tracking-wider">Admin Panel</h1>
              <p className="text-gray-500 text-sm">DiMangaX Control Center</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-dark-200 rounded-xl p-1 mb-8 w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${tab === id ? 'bg-dark-400 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {tab === 'overview' && stats && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={FaBook} label="Total Manga" value={stats.total_manga} color="red" />
                <StatCard icon={FaUsers} label="Total Users" value={stats.total_users} color="purple" />
                <StatCard icon={FaStar} label="Reviews" value={stats.total_reviews} color="yellow" />
                <StatCard icon={FaHeart} label="Favorites" value={stats.total_favorites} color="blue" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent users */}
                <div className="glass-card rounded-xl border border-white/6 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5">
                    <h3 className="font-semibold text-white text-sm">Recent Users</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {stats.recentUsers?.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="w-8 h-8 rounded-full bg-dark-400 flex items-center justify-center text-xs font-bold text-red-400">
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{u.username}</p>
                          <p className="text-xs text-gray-600 truncate">{u.email}</p>
                        </div>
                        {u.role === 'admin' && <span className="badge badge-purple text-[10px]">admin</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top manga */}
                <div className="glass-card rounded-xl border border-white/6 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5">
                    <h3 className="font-semibold text-white text-sm">Top Manga</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    {stats.topManga?.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="text-xs font-black text-gray-600 w-4">{i + 1}</span>
                        <div className="w-8 h-10 rounded overflow-hidden bg-dark-400 flex-shrink-0">
                          <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40x50/1f1f1f/ef4444?text=?'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{m.title}</p>
                          <p className="text-xs text-gray-600">★ {parseFloat(m.avg_rating).toFixed(1)} · {m.fav_count} fans</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manga tab */}
          {tab === 'manga' && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input type="text" placeholder="Search manga..." value={mangaSearch}
                    onChange={(e) => setMangaSearch(e.target.value)} className="w-full pl-10 py-2.5 text-sm" />
                </div>
                <GlowButton onClick={() => { setEditingManga(null); setShowMangaModal(true); }} variant="filled" className="gap-2">
                  <FaPlus className="w-4 h-4" /> Add Manga
                </GlowButton>
              </div>

              <div className="glass-card rounded-xl border border-white/6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-600">
                        <th className="text-left px-5 py-3">Manga</th>
                        <th className="text-left px-3 py-3 hidden md:table-cell">Author</th>
                        <th className="text-left px-3 py-3 hidden lg:table-cell">Status</th>
                        <th className="text-left px-3 py-3 hidden lg:table-cell">Featured</th>
                        <th className="text-right px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredManga.map(m => (
                        <tr key={m.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-10 rounded overflow-hidden bg-dark-400 flex-shrink-0">
                                <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40x50/1f1f1f/ef4444?text=?'; }} />
                              </div>
                              <span className="text-white font-medium truncate max-w-[160px]">{m.title}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-gray-400 hidden md:table-cell">{m.author}</td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            <span className={`badge text-[10px] capitalize ${m.status === 'ongoing' ? 'badge-green' : m.status === 'completed' ? 'badge-blue' : 'badge-yellow'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            {m.is_featured ? <FaCheck className="w-4 h-4 text-green-400" /> : <FaTimes className="w-4 h-4 text-gray-700" />}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditingManga(m); setShowMangaModal(true); }}
                                className="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                                <FaEdit className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteManga(m.id)}
                                className="w-8 h-8 rounded flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <FaTrash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users tab */}
          {tab === 'users' && (
            <div>
              <div className="mb-6">
                <div className="relative max-w-sm">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                  <input type="text" placeholder="Search users..." value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)} className="w-full pl-10 py-2.5 text-sm" />
                </div>
              </div>

              <div className="glass-card rounded-xl border border-white/6 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-600">
                        <th className="text-left px-5 py-3">User</th>
                        <th className="text-left px-3 py-3 hidden md:table-cell">Email</th>
                        <th className="text-left px-3 py-3">Role</th>
                        <th className="text-left px-3 py-3">Status</th>
                        <th className="text-right px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className={`hover:bg-white/2 transition-colors ${u.is_banned ? 'opacity-60' : ''}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-dark-400 flex items-center justify-center text-xs font-bold text-red-400 flex-shrink-0">
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-white font-medium">{u.username}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-gray-500 hidden md:table-cell text-xs">{u.email}</td>
                          <td className="px-3 py-3">
                            <span className={`badge text-[10px] ${u.role === 'admin' ? 'badge-purple' : 'badge-gray'}`}>{u.role}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`badge text-[10px] ${u.is_banned ? 'badge-red' : 'badge-green'}`}>
                              {u.is_banned ? 'banned' : 'active'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {u.id !== user.id && (
                                <>
                                  <button onClick={() => toggleBan(u.id)}
                                    className={`w-8 h-8 rounded flex items-center justify-center transition-all
                                      ${u.is_banned ? 'text-gray-600 hover:text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10'}`}
                                    title={u.is_banned ? 'Unban' : 'Ban'}>
                                    {u.is_banned ? <FaUnlock className="w-3.5 h-3.5" /> : <FaBan className="w-3.5 h-3.5" />}
                                  </button>
                                  <button onClick={() => togglePromote(u.id)}
                                    className={`w-8 h-8 rounded flex items-center justify-center transition-all
                                      ${u.role === 'admin' ? 'text-purple-400 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-600 hover:text-purple-400 hover:bg-purple-500/10'}`}
                                    title={u.role === 'admin' ? 'Demote' : 'Promote to Admin'}>
                                    <FaCrown className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showMangaModal && (
        <MangaModal
          manga={editingManga}
          onClose={() => { setShowMangaModal(false); setEditingManga(null); }}
          onSave={loadData}
        />
      )}
    </PageTransition>
  );
};

export default AdminPage;
