import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaHeart, FaUser, FaBars, FaTimes, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(''); }
  };

  const handleLogout = () => { logout(); toast.success('See you next time!'); navigate('/'); };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              className="font-display text-2xl tracking-wider"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white">DiManga</span>
              <span
                className="text-red-500"
                style={{ textShadow: '0 0 15px rgba(239,68,68,0.8)' }}
              >X</span>
            </motion.div>
          </Link>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Explore', to: '/search' },
              { label: 'Trending', to: '/search?sort=favorites' },
              { label: 'Top Rated', to: '/search?sort=rating' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search manga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 text-sm bg-white/5 border border-white/10 rounded-lg placeholder-gray-600 focus:border-red-500/50 focus:bg-white/8"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400">
                <FaSearch className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/favorites" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FaHeart className="w-4 h-4" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all">
                    <FaShieldAlt className="w-4 h-4" />
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-dark-400 border border-white/10 flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-red-400">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300 font-medium max-w-[80px] truncate">{user.username}</span>
                  </button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 glass-card rounded-xl overflow-hidden shadow-2xl border border-white/8"
                      >
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FaUser className="w-3.5 h-3.5 text-red-400" /> Profile
                        </Link>
                        <Link to="/favorites" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                          <FaHeart className="w-3.5 h-3.5 text-red-400" /> Favorites
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <FaShieldAlt className="w-3.5 h-3.5 text-purple-400" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-white/5" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <FaSignOutAlt className="w-3.5 h-3.5" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">Sign In</Link>
                <Link to="/register" className="btn-neon-filled text-xs px-4 py-2">Join Free</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400"
            >
              {mobileOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0d0d0d]/98 border-t border-white/5"
            >
              <div className="p-4 space-y-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search manga..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 text-sm"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <FaSearch className="w-4 h-4" />
                  </button>
                </form>
                {[{ label: 'Explore', to: '/search' }, { label: 'Trending', to: '/search?sort=favorites' }, { label: 'Top Rated', to: '/search?sort=rating' }].map(({ label, to }) => (
                  <Link key={label} to={to} className="block py-2 text-gray-300 hover:text-white transition-colors">{label}</Link>
                ))}
                {user && <Link to="/favorites" className="block py-2 text-gray-300 hover:text-white transition-colors">Favorites</Link>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop for user menu */}
      {userMenu && <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />}
    </>
  );
};

export default Navbar;
