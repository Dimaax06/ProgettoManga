import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaBookOpen } from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const statusColors = {
  ongoing: 'badge-green',
  completed: 'badge-blue',
  hiatus: 'badge-yellow',
  cancelled: 'badge-red',
};

const MangaCard = ({ manga, index = 0 }) => {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(Boolean(manga.is_favorited));
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Login to add favorites'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/favorites/toggle', { manga_id: manga.id });
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Added to favorites!' : 'Removed from favorites');
    } catch {
      toast.error('Error updating favorites');
    } finally {
      setLoading(false);
    }
  };

  const genres = typeof manga.genres === 'string' ? JSON.parse(manga.genres || '[]') : (manga.genres || []);
  const rating = parseFloat(manga.avg_rating || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link to={`/manga/${manga.id}`} className="block">
        <div className="manga-card group">
          {/* Cover */}
          <div className="relative aspect-[2/3] overflow-hidden bg-dark-300">
            <img
              src={manga.cover_url || 'https://via.placeholder.com/300x450/1f1f1f/ef4444?text=No+Cover'}
              alt={manga.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1f1f1f/ef4444?text=No+Cover'; }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              disabled={loading}
              className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${favorited ? 'bg-red-500 shadow-neon-red' : 'bg-black/60 hover:bg-red-500/20 border border-white/10'}
              `}
            >
              <FaHeart className={`w-3.5 h-3.5 ${favorited ? 'text-white' : 'text-gray-400'}`} />
            </button>

            {/* Status badge */}
            <div className={`absolute top-3 left-3 z-20 badge text-[10px] ${statusColors[manga.status] || 'badge-gray'}`}>
              {manga.status}
            </div>

            {/* Rating overlay on hover */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-1 mb-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-bold">{rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({manga.review_count || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {genres.slice(0, 2).map(g => (
                  <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">{g}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-white truncate group-hover:text-red-400 transition-colors">
              {manga.title}
            </h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{manga.author}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-400">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBookOpen className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-500">{manga.chapters || '?'} ch.</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MangaCard;
