import { Link } from 'react-router-dom';
import { FaHeart, FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

const Footer = () => (
  <footer className="relative mt-20 bg-[#0d0d0d] border-t border-white/5">
    {/* Top glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="font-display text-3xl tracking-wider mb-3">
            <span className="text-white">DiManga</span>
            <span className="text-red-500" style={{ textShadow: '0 0 15px rgba(239,68,68,0.6)' }}>X</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            The next-generation anime & manga platform. Discover, collect, and review your favorite titles in an immersive universe.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {[FaGithub, FaTwitter, FaDiscord].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Explore</h4>
          <ul className="space-y-2">
            {[
              { label: 'Browse Manga', to: '/search' },
              { label: 'Trending Now', to: '/search?sort=favorites' },
              { label: 'Top Rated', to: '/search?sort=rating' },
              { label: 'New Releases', to: '/search?sort=created_at' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Community</h4>
          <ul className="space-y-2">
            {[
              { label: 'Sign Up', to: '/register' },
              { label: 'Login', to: '/login' },
              { label: 'My Profile', to: '/profile' },
              { label: 'My Favorites', to: '/favorites' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} DiMangaX. All rights reserved.
        </p>
        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          Built with <FaHeart className="w-3 h-3 text-red-500" /> for the anime community
        </p>
      </div>
    </div>

    {/* Katana decorations */}
    <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-red-500/30 to-transparent" />
    <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-red-500/30 to-transparent" />
  </footer>
);

export default Footer;
