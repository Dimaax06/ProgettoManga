import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaStar, FaHeart, FaEdit, FaCheck, FaTimes, FaCalendar } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import PageTransition from '../components/ui/PageTransition';
import GlowButton from '../components/ui/GlowButton';
import StarRating from '../components/ui/StarRating';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', bio: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    Promise.all([
      api.get('/users/profile'),
      api.get('/reviews/my'),
    ]).then(([p, r]) => {
      setProfile(p.data);
      setReviews(r.data);
      setForm({ username: p.data.username, bio: p.data.bio || '', password: '' });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = { username: form.username, bio: form.bio };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/users/profile', payload);
      setProfile(data);
      updateUser(data);
      setEditMode(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(r => r.filter(rv => rv.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Error deleting review');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <motion.div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        {/* Header backdrop */}
        <div className="relative h-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-[#0a0a0a] to-purple-950/20" />
          <div className="absolute inset-0"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(239,68,68,0.02) 20px, rgba(239,68,68,0.02) 21px)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-16">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card rounded-2xl p-6 border border-white/6 text-center relative">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-400 border-2 border-red-500/30 mx-auto flex items-center justify-center">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-red-400">{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {user.role === 'admin' && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">ADMIN</div>
                  )}
                </div>

                {editMode ? (
                  <div className="space-y-3 text-left">
                    <input value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="Username" className="w-full text-sm" />
                    <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                      placeholder="Bio..." rows={3} className="w-full text-sm resize-none" />
                    <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="New password (optional)" className="w-full text-sm" />
                    <div className="flex gap-2">
                      <GlowButton onClick={saveProfile} loading={saving} variant="filled" className="flex-1 justify-center text-xs py-2">
                        <FaCheck className="w-3 h-3" /> Save
                      </GlowButton>
                      <GlowButton onClick={() => setEditMode(false)} variant="ghost" className="flex-1 justify-center text-xs py-2">
                        <FaTimes className="w-3 h-3" /> Cancel
                      </GlowButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="font-bold text-xl text-white mb-1">{profile?.username}</h2>
                    <p className="text-xs text-gray-500 mb-3 font-mono">{user.email}</p>
                    {profile?.bio && <p className="text-sm text-gray-400 leading-relaxed mb-4">{profile.bio}</p>}
                    <GlowButton onClick={() => setEditMode(true)} variant="outline" className="w-full justify-center text-xs py-2">
                      <FaEdit className="w-3 h-3" /> Edit Profile
                    </GlowButton>
                  </>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-white/5">
                  <div>
                    <div className="font-display text-2xl text-red-400">{profile?.review_count || 0}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Reviews</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl text-red-400">{profile?.fav_count || 0}</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Favorites</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-600">
                  <FaCalendar className="w-3 h-3" />
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
                </div>
              </div>

              <div className="mt-4">
                <Link to="/favorites" className="btn-neon w-full justify-center flex items-center gap-2 py-3 text-sm">
                  <FaHeart className="w-4 h-4" /> View Favorites
                </Link>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="font-display text-3xl text-white tracking-wider mb-6">My Reviews</h3>

              {reviews.length === 0 ? (
                <div className="text-center py-16 text-gray-600">
                  <FaStar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No reviews yet</p>
                  <p className="text-sm mt-1">Start rating manga to see your reviews here.</p>
                  <Link to="/search" className="inline-block mt-4 btn-neon text-sm px-5 py-2">Browse Manga</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-xl p-5 border border-white/6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 aspect-[2/3] rounded-lg overflow-hidden bg-dark-400 flex-shrink-0">
                          <img src={r.cover_url} alt={r.manga_title} className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120/1f1f1f/ef4444?text=?'; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link to={`/manga/${r.manga_id}`} className="font-semibold text-white hover:text-red-400 transition-colors text-sm truncate">
                              {r.manga_title}
                            </Link>
                            <button onClick={() => deleteReview(r.id)}
                              className="w-7 h-7 flex-shrink-0 rounded flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="mt-1.5"><StarRating value={r.rating} size="sm" /></div>
                          {r.comment && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.comment}</p>}
                          <p className="text-[10px] text-gray-700 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
