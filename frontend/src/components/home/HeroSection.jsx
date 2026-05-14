import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaHeart, FaStar, FaBookOpen, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// SVG anime decorations
const KatanaSVG = () => (
  <svg viewBox="0 0 400 40" className="w-full opacity-20" fill="none">
    <line x1="0" y1="20" x2="350" y2="20" stroke="#ef4444" strokeWidth="1" />
    <polygon points="350,20 400,14 390,20 400,26" fill="#ef4444" />
    <circle cx="80" cy="20" r="3" fill="#ef4444" opacity="0.6" />
    <circle cx="160" cy="20" r="2" fill="#ef4444" opacity="0.4" />
    <circle cx="240" cy="20" r="2" fill="#ef4444" opacity="0.4" />
  </svg>
);

const AnimeEye = ({ className }) => (
  <svg viewBox="0 0 120 60" className={className} fill="none">
    <ellipse cx="60" cy="30" rx="55" ry="25" stroke="#ef4444" strokeWidth="1.5" fill="none" opacity="0.4" />
    <ellipse cx="60" cy="30" rx="20" ry="20" fill="#1a0505" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
    <circle cx="60" cy="30" r="12" fill="#ef4444" opacity="0.3" />
    <circle cx="60" cy="30" r="5" fill="#ef4444" opacity="0.6" />
    <circle cx="55" cy="25" r="2" fill="white" opacity="0.5" />
    <line x1="5" y1="30" x2="35" y2="30" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
    <line x1="85" y1="30" x2="115" y2="30" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

const HeroSection = ({ featured }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = featured?.length ? featured : [null];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const go = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const manga = slides[current];
  const genres = (() => {
    const g = manga?.genres;
    if (!g) return [];
    if (Array.isArray(g)) return g;
    try { const p = JSON.parse(g); return Array.isArray(p) ? p : []; }
    catch { return String(g).split(',').map(s => s.trim()).filter(Boolean); }
  })();

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {manga?.cover_url && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${manga.cover_url})`, filter: 'blur(60px) brightness(0.15)' }}
              />
            </>
          )}
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />
        </motion.div>
      </AnimatePresence>

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-red-500/60"
          style={{ left: `${10 + i * 12}%` }}
          animate={{ y: ['100vh', '-50px'], opacity: [0, 0.8, 0] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
        />
      ))}

      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }}
      />

      {/* Corner elements */}
      <div className="absolute top-24 left-6 md:left-12">
        <AnimeEye className="w-24 h-12 opacity-30" />
      </div>
      <div className="absolute bottom-24 right-6 md:right-12">
        <div className="w-16 h-16 border border-red-500/20 rotate-45" />
        <div className="w-8 h-8 border border-red-500/30 rotate-45 absolute top-4 left-4" />
      </div>

      {/* Japanese text decoration */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 text-gray-700 font-japanese text-xs">
        {'アニメ・マンガ・宇宙'.split('').map((c, i) => <span key={i}>{c}</span>)}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <motion.div
            key={`${current}-tag`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-8 bg-red-500" />
            <span className="text-red-400 text-xs font-mono uppercase tracking-widest">Featured</span>
            <div className="badge-red badge">#{current + 1}</div>
          </motion.div>

          <motion.h1
            key={`${current}-title`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none text-white mb-4"
          >
            {manga?.title || 'Welcome to'}
            <br />
            {!manga && (
              <span style={{ textShadow: '0 0 30px rgba(239,68,68,0.8)' }} className="text-red-500">
                DiMangaX
              </span>
            )}
          </motion.h1>

          {manga && (
            <>
              <motion.p
                key={`${current}-author`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm font-mono mb-2"
              >
                by <span className="text-gray-300">{manga.author}</span> · {manga.year}
              </motion.p>

              <motion.p
                key={`${current}-desc`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-lg line-clamp-3"
              >
                {manga.description}
              </motion.p>

              <motion.div
                key={`${current}-genres`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {genres.slice(0, 4).map(g => (
                  <span key={g} className="px-3 py-1 text-xs rounded border border-red-500/30 text-red-400 bg-red-500/5">
                    {g}
                  </span>
                ))}
              </motion.div>

              <motion.div
                key={`${current}-stats`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-5 mb-8"
              >
                <div className="flex items-center gap-1.5">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{parseFloat(manga.avg_rating || 0).toFixed(1)}</span>
                  <span className="text-gray-600 text-sm">({manga.review_count || 0})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaHeart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 text-sm">{manga.fav_count || 0} fans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaBookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300 text-sm">{manga.chapters || '?'} ch.</span>
                </div>
              </motion.div>
            </>
          )}

          {!manga && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md"
            >
              The next-generation anime & manga universe. Discover thousands of titles, build your collection, and join the community.
            </motion.p>
          )}

          <motion.div
            key={`${current}-cta`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 flex-wrap"
          >
            {manga ? (
              <>
                <Link to={`/manga/${manga.id}`} className="btn-neon-filled flex items-center gap-2">
                  <FaPlay className="w-3 h-3" /> View Manga
                </Link>
                <Link to="/search" className="btn-neon flex items-center gap-2">
                  <FaBookOpen className="w-3 h-3" /> Explore All
                </Link>
              </>
            ) : (
              <>
                <Link to="/search" className="btn-neon-filled flex items-center gap-2">
                  <FaBookOpen className="w-3 h-3" /> Start Exploring
                </Link>
                <Link to="/register" className="btn-neon">Join the Universe</Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Cover image */}
        {manga && (
          <motion.div
            key={`${current}-cover`}
            initial={{ opacity: 0, scale: 0.9, rotateY: direction * 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Glow behind cover */}
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-3xl scale-110" />
              <div className="relative w-72 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={manga.cover_url}
                  alt={manga.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450/1f1f1f/ef4444?text=Cover'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border border-red-500/20 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border border-red-500/30 rotate-45" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Slide controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          <button onClick={() => go((current - 1 + slides.length) % slides.length)}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-red-500/60 hover:text-red-400 transition-all text-gray-500">
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)}
                className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-red-500' : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'}`}
              />
            ))}
          </div>
          <button onClick={() => go((current + 1) % slides.length)}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-red-500/60 hover:text-red-400 transition-all text-gray-500">
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Katana divider */}
      <div className="absolute bottom-0 left-0 right-0 px-8">
        <KatanaSVG />
      </div>
    </div>
  );
};

export default HeroSection;
