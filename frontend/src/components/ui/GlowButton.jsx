import { motion } from 'framer-motion';

const GlowButton = ({ children, onClick, type = 'button', variant = 'outline', className = '', disabled = false, loading = false }) => {
  const base = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  const variants = {
    outline: `${base} border border-red-500 text-red-500 hover:bg-red-500/10 hover:shadow-neon-red`,
    filled: `${base} bg-gradient-to-r from-red-700 to-red-500 text-white hover:from-red-600 hover:to-red-400 hover:shadow-neon-red`,
    ghost: `${base} text-gray-400 hover:text-white hover:bg-white/5`,
    purple: `${base} border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-neon-purple`,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant] || variants.outline} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      ) : children}
    </motion.button>
  );
};

export default GlowButton;
