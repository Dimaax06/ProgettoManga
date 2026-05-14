import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';

const NotFoundPage = () => (
  <PageTransition>
    <div className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      {['404', '迷', '失'].map((c, i) => (
        <motion.div key={c} className="absolute font-japanese text-9xl font-black pointer-events-none"
          style={{ left: `${20 + i * 28}%`, top: `${15 + i * 20}%`, color: `rgba(239,68,68,${0.02 + i * 0.01})` }}
          animate={{ y: [0, -15, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i }}
        >{c}</motion.div>
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="font-display text-[12rem] md:text-[16rem] leading-none tracking-widest"
          style={{ color: '#1f1f1f', textShadow: '0 0 60px rgba(239,68,68,0.2)' }}
        >
          4
          <span style={{ color: '#ef4444', textShadow: '0 0 40px rgba(239,68,68,0.9)' }}>X</span>
          4
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl text-white tracking-wider mb-3"
        >
          Page Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8"
        >
          This page seems to have been erased by a cursed technique.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-neon-filled px-6 py-3">Return Home</Link>
          <Link to="/search" className="btn-neon px-6 py-3">Browse Manga</Link>
        </motion.div>
      </div>
    </div>
  </PageTransition>
);

export default NotFoundPage;
