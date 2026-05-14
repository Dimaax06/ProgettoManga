import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaStar, FaClock, FaCompass } from 'react-icons/fa';
import api from '../utils/api';
import PageTransition from '../components/ui/PageTransition';
import HeroSection from '../components/home/HeroSection';
import FeaturedSection from '../components/home/FeaturedSection';
import TrendingSection from '../components/home/TrendingSection';

// Manga panel decoration
const MangaPanelDecor = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 opacity-5"
      style={{
        background: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 1px, transparent 1px, transparent 20px)',
      }}
    />
    <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5"
      style={{
        background: 'repeating-linear-gradient(-45deg, #7c3aed, #7c3aed 1px, transparent 1px, transparent 20px)',
      }}
    />
  </div>
);

const StatsBar = ({ stats }) => (
  <div className="bg-[#111]/80 border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex items-center justify-center gap-8 md:gap-16 overflow-x-auto scrollbar-hide">
        {[
          { label: 'Manga Titles', value: stats.manga },
          { label: 'Community Members', value: stats.users },
          { label: 'Reviews Written', value: stats.reviews },
          { label: 'Active Fans', value: stats.favorites },
        ].map(({ label, value }) => (
          <div key={label} className="flex-shrink-0 text-center">
            <div className="font-display text-2xl text-red-400 tracking-wider">{value?.toLocaleString() || '---'}</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GenreCloud = ({ genres }) => (
  <section className="py-16 relative">
    <MangaPanelDecor />
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <span className="text-xs font-mono tracking-widest text-red-400 uppercase">Browse by</span>
        <h2 className="section-title text-white mt-1">Genres</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {genres.map((genre, i) => (
          <motion.a
            key={genre}
            href={`/search?genre=${encodeURIComponent(genre)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-300
              ${i % 4 === 0 ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' :
                i % 4 === 1 ? 'border-purple-500/30 text-purple-400 hover:bg-purple-500/10' :
                i % 4 === 2 ? 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10' :
                'border-gray-700 text-gray-400 hover:bg-white/5'}`}
          >
            {genre}
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

const CinematicBanner = () => (
  <section className="relative py-20 overflow-hidden my-8">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-[#0a0a0a] to-purple-950/20" />
    <div className="absolute inset-0" style={{
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(239,68,68,0.02) 3px, rgba(239,68,68,0.02) 4px)',
    }} />

    {/* Floating symbols */}
    {['鬼', '侍', '忍', '力', '炎'].map((char, i) => (
      <motion.div
        key={char}
        className="absolute font-japanese text-6xl font-bold text-red-500/5"
        style={{ left: `${15 + i * 18}%`, top: '10%' }}
        animate={{ y: [0, -20, 0], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
      >
        {char}
      </motion.div>
    ))}

    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-4">Join the Universe</div>
        <h2 className="font-display text-5xl md:text-7xl text-white tracking-wider mb-4">
          Your Anime Journey<br />
          <span className="text-red-500" style={{ textShadow: '0 0 20px rgba(239,68,68,0.6)' }}>Starts Here</span>
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Discover thousands of manga titles, track your reading, write reviews and connect with fans worldwide.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="/register" className="btn-neon-filled px-8 py-4 text-base">Create Account — Free</a>
          <a href="/search" className="btn-neon px-8 py-4 text-base">Explore Catalog</a>
        </div>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    Promise.all([
      api.get('/manga/featured'),
      api.get('/manga/trending'),
      api.get('/manga?sort=created_at&order=DESC&limit=12'),
      api.get('/manga?sort=rating&order=DESC&limit=12'),
      api.get('/manga/genres'),
      api.get('/admin/stats').catch(() => ({ data: {} })),
    ]).then(([f, t, r, top, g, s]) => {
      setFeatured(f.data);
      setTrending(t.data);
      setRecent(r.data.manga || []);
      setTopRated(top.data.manga || []);
      setGenres(g.data);
      setStats({ manga: s.data?.total_manga, users: s.data?.total_users, reviews: s.data?.total_reviews, favorites: s.data?.total_favorites });
    }).catch(console.error);
  }, []);

  return (
    <PageTransition>
      <HeroSection featured={featured} />
      <StatsBar stats={stats} />
      <TrendingSection manga={trending} />
      <FeaturedSection
        title="Top Rated"
        subtitle="Community Favorites"
        icon={FaStar}
        manga={topRated}
        viewAllLink="/search?sort=rating&order=DESC"
        viewAllLabel="See All"
      />
      <FeaturedSection
        title="Latest Additions"
        subtitle="Fresh Arrivals"
        icon={FaClock}
        manga={recent}
        viewAllLink="/search?sort=created_at&order=DESC"
        viewAllLabel="See All"
      />
      <GenreCloud genres={genres} />
      <CinematicBanner />
    </PageTransition>
  );
};

export default HomePage;
