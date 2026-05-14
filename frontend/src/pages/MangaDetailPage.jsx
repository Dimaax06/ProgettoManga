import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaBookOpen, FaUser, FaCalendar, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageTransition from '../components/ui/PageTransition';
import StarRating from '../components/ui/StarRating';
import GlowButton from '../components/ui/GlowButton';

const statusColors = { ongoing: 'badge-green', completed: 'badge-blue', hiatus: 'badge-yellow', cancelled: 'badge-red' };

const ReviewCard = ({ review, currentUser, onDelete, onEdit }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card rounded-xl p-5 border border-white/6"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-dark-400 flex items-center justify-center font-bold text-red-400 border border-white/10 flex-shrink-0">
          {review.avatar ? (
            <img src={review.avatar} alt={review.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            review.username?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-white">{review.username}</p>
          <p className="text-xs text-gray-600">{new Date(review.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarRating value={review.rating} size="sm" />
        {currentUser && (currentUser.id === review.user_id || currentUser.role === 'admin') && (
          <div className="flex gap-1 ml-2">
            {currentUser.id === review.user_id && (
              <button onClick={() => onEdit(review)} className="w-7 h-7 rounded flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                <FaEdit className="w-3 h-3" />
              </button>
            )}
            <button onClick={() => onDelete(review.id)} className="w-7 h-7 rounded flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <FaTrash className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
    {review.comment && (
      <p className="mt-3 text-sm text-gray-400 leading-relaxed">{review.comment}</p>
    )}
  </motion.div>
);

const MangaDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [manga, setManga] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/manga/${id}`),
      api.get(`/reviews/manga/${id}`),
    ]).then(([m, r]) => {
      setManga(m.data);
      setFavorited(Boolean(m.data.is_favorited));
      setReviews(r.data);
      if (user) {
        const ur = r.data.find(rv => rv.user_id === user.id);
        setUserReview(ur || null);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) { toast.error('Login required'); return; }
    setFavLoading(true);
    try {
      const { data } = await api.post('/favorites/toggle', { manga_id: id });
      setFavorited(data.favorited);
      setManga(m => ({ ...m, fav_count: (m.fav_count || 0) + (data.favorited ? 1 : -1) }));
      toast.success(data.favorited ? 'Added to favorites!' : 'Removed from favorites');
    } finally {
      setFavLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      if (editingReview) {
        const { data } = await api.put(`/reviews/${editingReview.id}`, reviewForm);
        setReviews(r => r.map(rv => rv.id === data.id ? data : rv));
        setUserReview(data);
        toast.success('Review updated!');
      } else {
        const { data } = await api.post('/reviews', { ...reviewForm, manga_id: id });
        setReviews(r => [data, ...r]);
        setUserReview(data);
        toast.success('Review posted!');
      }
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 0, comment: '' });
      const { data: m } = await api.get(`/manga/${id}`);
      setManga(m);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving review');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(r => r.filter(rv => rv.id !== reviewId));
      if (userReview?.id === reviewId) setUserReview(null);
      toast.success('Review deleted');
    } catch {
      toast.error('Error deleting review');
    }
  };

  const startEdit = (review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment || '' });
    setShowReviewForm(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center space-y-4">
        <motion.div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full mx-auto"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );

  if (!manga) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <p className="text-gray-500 text-xl mb-4">Manga not found</p>
        <Link to="/search" className="btn-neon">Browse Catalog</Link>
      </div>
    </div>
  );

  const genres = typeof manga.genres === 'string' ? JSON.parse(manga.genres || '[]') : (manga.genres || []);
  const rating = parseFloat(manga.avg_rating || 0);

  return (
    <PageTransition>
      {/* Hero backdrop */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 h-96">
          {manga.cover_url && (
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${manga.cover_url})`, filter: 'blur(80px) brightness(0.1)' }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <Link to="/search" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
            <FaArrowLeft className="w-3 h-3" /> Back to catalog
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12">
            {/* Cover */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col items-center md:items-start gap-4">
              <div className="relative w-56 md:w-full aspect-[2/3] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-red-500/10 blur-xl" />
                <img src={manga.cover_url || 'https://via.placeholder.com/300x450/1f1f1f/ef4444?text=Cover'}
                  alt={manga.title} className="relative w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1f1f1f/ef4444?text=Cover'; }} />
              </div>

              {/* Actions */}
              <div className="w-full space-y-3">
                <GlowButton onClick={handleFavorite} loading={favLoading}
                  variant={favorited ? 'filled' : 'outline'}
                  className="w-full justify-center gap-2">
                  <FaHeart className="w-4 h-4" />
                  {favorited ? 'Remove Favorite' : 'Add to Favorites'}
                </GlowButton>
                {user && !userReview && (
                  <GlowButton onClick={() => { setShowReviewForm(!showReviewForm); setEditingReview(null); setReviewForm({ rating: 0, comment: '' }); }}
                    variant="ghost" className="w-full justify-center">
                    Write a Review
                  </GlowButton>
                )}
              </div>

              {/* Quick stats */}
              <div className="w-full glass-card rounded-xl p-4 space-y-3">
                {[
                  { label: 'Status', value: <span className={`badge ${statusColors[manga.status] || 'badge-gray'}`}>{manga.status}</span> },
                  { label: 'Author', value: manga.author },
                  { label: 'Year', value: manga.year },
                  { label: 'Chapters', value: manga.chapters || '?' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 uppercase tracking-wider">{label}</span>
                    <span className="text-sm text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="font-display text-4xl md:text-6xl text-white tracking-wider leading-none mb-3">
                {manga.title}
              </h1>
              <p className="text-gray-500 text-sm font-mono mb-4">by {manga.author}</p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-5 mb-5">
                <div className="flex items-center gap-2">
                  <StarRating value={rating} size="md" />
                  <span className="font-bold text-yellow-400 text-lg">{rating.toFixed(1)}</span>
                  <span className="text-gray-500 text-sm">({manga.review_count || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-red-400">
                  <FaHeart className="w-4 h-4" />
                  <span className="font-semibold">{manga.fav_count || 0}</span>
                  <span className="text-gray-600 text-sm">favorites</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map(g => (
                  <Link key={g} to={`/search?genre=${encodeURIComponent(g)}`}
                    className="px-3 py-1.5 rounded-lg text-sm border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                    {g}
                  </Link>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Synopsis</h3>
                <p className="text-gray-400 leading-relaxed">{manga.description || 'No description available.'}</p>
              </div>

              {/* Review form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 overflow-hidden"
                  >
                    <div className="glass-card-red rounded-xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-4">
                        {editingReview ? 'Edit Your Review' : 'Write a Review'}
                      </h3>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">Your Rating</label>
                          <StarRating value={reviewForm.rating} interactive onChange={(r) => setReviewForm(f => ({ ...f, rating: r }))} size="lg" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-2">Comment (optional)</label>
                          <textarea value={reviewForm.comment} onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                            rows={4} placeholder="Share your thoughts..." className="w-full resize-none" />
                        </div>
                        <div className="flex gap-3">
                          <GlowButton type="submit" variant="filled" loading={submitting}>
                            {editingReview ? 'Update Review' : 'Post Review'}
                          </GlowButton>
                          <GlowButton type="button" variant="ghost" onClick={() => { setShowReviewForm(false); setEditingReview(null); }}>
                            Cancel
                          </GlowButton>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-white">Reviews <span className="text-gray-600 font-normal">({reviews.length})</span></h3>
                  {user && userReview && (
                    <button onClick={() => startEdit(userReview)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <FaEdit className="w-3 h-3" /> Edit my review
                    </button>
                  )}
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-gray-600">
                    <p className="mb-3">No reviews yet. Be the first!</p>
                    {user && !userReview && (
                      <button onClick={() => setShowReviewForm(true)} className="text-red-400 text-sm hover:text-red-300 transition-colors">
                        Write a review
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <ReviewCard key={r.id} review={r} currentUser={user} onDelete={deleteReview} onEdit={startEdit} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MangaDetailPage;
