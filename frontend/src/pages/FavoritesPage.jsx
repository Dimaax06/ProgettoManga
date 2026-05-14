import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaSearch } from 'react-icons/fa';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import MangaCard from '../components/ui/MangaCard';
import PageTransition from '../components/ui/PageTransition';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    api.get('/favorites')
      .then(r => setFavorites(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? favorites.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.author.toLowerCase().includes(search.toLowerCase()))
    : favorites;

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <FaHeart className="w-5 h-5 text-red-500" />
              <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Collection</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider">My Favorites</h1>
            <p className="text-gray-500 text-sm mt-2">
              {favorites.length} {favorites.length === 1 ? 'title' : 'titles'} in your collection
            </p>
          </motion.div>

          {/* Search filter */}
          {favorites.length > 0 && (
            <div className="relative w-full max-w-md mb-8">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input type="text" placeholder="Filter your favorites..." value={search}
                onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 py-3" />
            </div>
          )}

          {/* Stats */}
          {favorites.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
                <FaHeart className="w-4 h-4 text-red-400" />
                <div>
                  <div className="font-bold text-white text-lg">{favorites.length}</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Saved</div>
                </div>
              </div>
              <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
                <FaStar className="w-4 h-4 text-yellow-400" />
                <div>
                  <div className="font-bold text-white text-lg">
                    {(favorites.reduce((s, m) => s + parseFloat(m.avg_rating || 0), 0) / (favorites.length || 1)).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wider">Avg Rating</div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => <div key={i} className="aspect-[2/3] skeleton rounded-lg" />)}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaHeart className="w-16 h-16 text-gray-800 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl text-gray-500 mb-2">No favorites yet</h3>
              <p className="text-gray-700 text-sm mb-6">Start exploring and save the manga you love.</p>
              <Link to="/search" className="btn-neon-filled px-6 py-3">Discover Manga</Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p>No results for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((m, i) => <MangaCard key={m.id} manga={m} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default FavoritesPage;
