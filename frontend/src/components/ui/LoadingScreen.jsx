import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.6 } }}
  >
    {/* Scan line */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>

    {/* Particles */}
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-red-500"
        style={{ left: `${8 + i * 8}%`, bottom: 0 }}
        animate={{ y: [-20, -window.innerHeight], opacity: [0, 1, 0] }}
        transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2, ease: 'easeOut' }}
      />
    ))}

    <div className="relative z-10 flex flex-col items-center gap-8">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center"
      >
        <div className="font-display text-7xl md:text-9xl tracking-widest">
          <span className="text-white">DiManga</span>
          <span
            className="text-red-500"
            style={{
              textShadow: '0 0 30px rgba(239,68,68,0.9), 0 0 60px rgba(239,68,68,0.5), 0 0 100px rgba(239,68,68,0.3)',
            }}
          >
            X
          </span>
        </div>
        <motion.div
          className="text-xs tracking-[0.4em] text-gray-500 mt-2 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Anime · Manga · Universe
        </motion.div>
      </motion.div>

      {/* Loading bar */}
      <div className="w-48 h-0.5 bg-dark-400 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ boxShadow: '0 0 10px rgba(239,68,68,0.8)' }}
        />
      </div>

      <motion.p
        className="text-gray-600 text-xs tracking-widest uppercase font-mono"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Initializing...
      </motion.p>
    </div>

    {/* Corner decorations */}
    <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-red-500/30" />
    <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-red-500/30" />
    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-red-500/30" />
    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-red-500/30" />
  </motion.div>
);

export default LoadingScreen;
