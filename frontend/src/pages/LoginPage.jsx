import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageTransition from '../components/ui/PageTransition';
import GlowButton from '../components/ui/GlowButton';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(239,68,68,0.01) 4px, rgba(239,68,68,0.01) 5px)' }}
        />

        {/* Anime eye decoration */}
        <div className="absolute left-1/4 top-1/4 w-32 h-32 opacity-5 rounded-full border-2 border-red-500" />
        <div className="absolute right-1/4 bottom-1/4 w-20 h-20 opacity-5 border border-red-500 rotate-45" />

        {/* Floating kanji */}
        {['侍', '力', '炎'].map((c, i) => (
          <motion.div key={c} className="absolute font-japanese text-8xl font-bold text-red-500/3 pointer-events-none"
            style={{ left: `${20 + i * 30}%`, top: `${20 + i * 20}%` }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i }}
          >{c}</motion.div>
        ))}

        <div className="relative z-10 w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 border border-white/8"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="font-display text-4xl tracking-wider mb-2">
                <span className="text-white">DiManga</span>
                <span className="text-red-500" style={{ textShadow: '0 0 15px rgba(239,68,68,0.8)' }}>X</span>
              </div>
              <p className="text-gray-500 text-sm">Welcome back, warrior</p>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-red-500/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-red-500/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-red-500/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-red-500/30" />

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handle}
                    placeholder="your@email.com"
                    className="w-full pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handle}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="filled" className="w-full justify-center" loading={loading}>
                  Enter the Universe
                </GlowButton>
              </div>
            </form>

            {/* Demo credentials */}
            <div className="mt-4 p-3 rounded-lg bg-white/3 border border-white/5">
              <p className="text-xs text-gray-600 text-center mb-1.5">Demo credentials</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Admin: </span>
                  <span className="text-gray-400 font-mono">admin@dimangax.com</span>
                </div>
                <div>
                  <span className="text-gray-600">Pass: </span>
                  <span className="text-gray-400 font-mono">admin123</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-5">
              New here?{' '}
              <Link to="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
