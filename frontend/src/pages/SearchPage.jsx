import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaSortAmountDown } from 'react-icons/fa';
import api from '../utils/api';
import MangaCard from '../components/ui/MangaCard';
import GlowButton from '../components/ui/GlowButton';
import PageTransition from '../components/ui/PageTransition';

const SORTS = [
  { value: 'created_at', label: 'Latest' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'favorites', label: 'Most Popular' },
  { value: 'title', label: 'A–Z' },
];
const STATUSES = ['', 'ongoing', 'completed', 'hiatus', 'cancelled'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [manga, setManga] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const genre = searchParams.get('genre') || '';
  const sort = searchParams.get('sort') || 'created_at';
  const status = searchParams.get('status') || '';
  const order = searchParams.get('order') || 'DESC';

  useEffect(() => {
    api.get('/manga/genres').then(r => setGenres(r.data));
  }, []);

  const fetchManga = useCallback(async (pg = 1, reset = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 24, sort, order });
      if (query) params.set('search', query);
      if (genre) params.set('genre', genre);
      if (status) params.set('status', status);

      const { data } = await api.get(`/manga?${params}`);
      setManga(prev => reset ? data.manga : [...prev, ...data.manga]);
      setTotal(data.total);
      setHasMore(pg < data.pages);
      setPage(pg);
    } finally {
      setLoading(false);
    }
  }, [query, genre, sort, status, order]);

  useEffect(() => { fetchManga(1, true); }, [fetchManga]);

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams(query ? { q: query } : {});

  const hasActiveFilters = genre || status || (sort !== 'created_at');

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-5xl md:text-6xl text-white tracking-wider mb-2">
              {query ? `"${query}"` : 'Explore'}
            </h1>
            <p className="text-gray-500 text-sm">
              {loading ? 'Searching...' : `${total.toLocaleString()} manga found`}
            </p>
          </div>

          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                defaultValue={query}
                placeholder="Search titles, authors..."
                className="w-full pl-11 pr-4 py-3"
                onKeyDown={(e) => { if (e.key === 'Enter') set('q', e.target.value); }}
                onChange={(e) => { if (!e.target.value) set('q', ''); }}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm font-medium
                ${showFilters || hasActiveFilters ? 'border-red-500/50 text-red-400 bg-red-500/5' : 'border-white/10 text-gray-400 hover:border-white/20'}`}
            >
              <FaFilter className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-500" />}
            </button>

            {/* Sort */}
            <select value={sort} onChange={(e) => set('sort', e.target.value)}
              className="px-4 py-3 pr-8 rounded-lg border border-white/10 bg-dark-300 text-gray-300 text-sm">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-5 mb-6 border border-white/6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Genres */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {['', ...genres].map(g => (
                      <button key={g || 'all'} onClick={() => set('genre', g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                          ${genre === g ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                        {g || 'All'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-3">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button key={s || 'all'} onClick={() => set('status', s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize
                          ${status === s ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                        {s || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-4 flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors">
                  <FaTimes className="w-3 h-3" /> Clear all filters
                </button>
              )}
            </motion.div>
          )}

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {genre && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                  Genre: {genre}
                  <button onClick={() => set('genre', '')}><FaTimes className="w-3 h-3" /></button>
                </span>
              )}
              {status && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20 capitalize">
                  Status: {status}
                  <button onClick={() => set('status', '')}><FaTimes className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Results grid */}
          {loading && manga.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
              ))}
            </div>
          ) : manga.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-japanese text-8xl text-gray-800 mb-4">無</div>
              <p className="text-gray-500 text-lg">No manga found</p>
              <p className="text-gray-700 text-sm mt-1">Try different filters or search terms</p>
              <button onClick={clearFilters} className="mt-4 btn-neon text-sm px-6 py-2">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {manga.map((m, i) => <MangaCard key={m.id} manga={m} index={i} />)}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <GlowButton onClick={() => fetchManga(page + 1, false)} loading={loading} variant="outline">
                    Load More ({total - manga.length} remaining)
                  </GlowButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default SearchPage;
