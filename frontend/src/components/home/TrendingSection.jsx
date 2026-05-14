import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaStar, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TrendingSection = ({ manga }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!manga?.length) return null;

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <FaTrophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs font-mono tracking-widest text-yellow-500 uppercase">Hot Right Now</span>
            </div>
            <h2 className="section-title text-white">Trending</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-lg border border-white/10 hover:border-red-500/50 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all">
              <FaChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => scroll(1)} className="w-9 h-9 rounded-lg border border-white/10 hover:border-red-500/50 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all">
              <FaChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {manga.map((m, i) => {
            const genres = typeof m.genres === 'string' ? JSON.parse(m.genres || '[]') : (m.genres || []);
            const rating = parseFloat(m.avg_rating || 0);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex-shrink-0 w-44"
              >
                <Link to={`/manga/${m.id}`}>
                  <div className="manga-card">
                    {/* Rank badge */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-dark-300">
                      <img src={m.cover_url} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x300/1f1f1f/ef4444?text=Cover'; }} />
                      <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-20
                        ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-300 text-black' : i === 2 ? 'bg-amber-600 text-white' : 'bg-dark-400 text-gray-400'}`}>
                        {i + 1}
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="font-semibold text-xs text-white truncate">{m.title}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center gap-1">
                          <FaStar className="w-2.5 h-2.5 text-yellow-500" />
                          <span className="text-xs text-gray-400">{rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaHeart className="w-2.5 h-2.5 text-red-400" />
                          <span className="text-xs text-gray-500">{m.fav_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
