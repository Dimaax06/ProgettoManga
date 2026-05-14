import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import MangaCard from '../ui/MangaCard';

const FeaturedSection = ({ title, subtitle, manga, icon: Icon, viewAllLink, viewAllLabel = 'View All' }) => {
  if (!manga?.length) return null;
  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-4 h-4 text-red-400" />}
                <span className="text-xs font-mono tracking-widest text-red-400 uppercase">{subtitle}</span>
              </div>
            )}
            <h2 className="section-title text-white">{title}</h2>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors group">
              {viewAllLabel}
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Decorative line */}
        <div className="mb-8 h-px bg-gradient-to-r from-red-500/50 via-red-500/20 to-transparent" />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {manga.map((m, i) => (
            <MangaCard key={m.id} manga={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
