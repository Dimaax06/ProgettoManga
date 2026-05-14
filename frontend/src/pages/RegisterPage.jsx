import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageTransition from '../components/ui/PageTransition';
import GlowButton from '../components/ui/GlowButton';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '6+ chars', ok: password.length >= 6 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  return (
    <div className="flex gap-3 mt-2">
      {checks.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1 text-xs transition-colors ${ok ? 'text-green-400' : 'text-gray-600'}`}>
          <FaCheck className="w-2.5 h-2.5" />
          {label}
        </div>
      ))}
    </div>
  );
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const username = form.username.trim();
    const email = form.email.trim();
    if (username.length < 3) { toast.error('Username must be at least 3 characters'); return; }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) { toast.error('Username can only contain letters, numbers, _ and -'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Please enter a valid email'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(username, email, form.password);
      toast.success('Welcome to DiMangaX!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(124,58,237,0.01) 4px, rgba(124,58,237,0.01) 5px)' }}
        />

        {['忍', '武', '道'].map((c, i) => (
          <motion.div key={c} className="absolute font-japanese text-9xl font-bold text-purple-500/3 pointer-events-none"
            style={{ left: `${15 + i * 30}%`, top: `${10 + i * 25}%` }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.5 }}
          >{c}</motion.div>
        ))}

        <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative glass-card rounded-2xl p-8 border border-white/8"
          >
            <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-purple-500/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-purple-500/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-purple-500/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-purple-500/30" />

            <div className="text-center mb-8">
              <div className="font-display text-4xl tracking-wider mb-2">
                <span className="text-white">DiManga</span>
                <span className="text-red-500" style={{ textShadow: '0 0 15px rgba(239,68,68,0.8)' }}>X</span>
              </div>
              <p className="text-gray-500 text-sm">Begin your journey</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" name="username" value={form.username} onChange={handle}
                    placeholder="YourUsername" className="w-full pl-10" required minLength={3} maxLength={30} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="email" name="email" value={form.email} onChange={handle}
                    placeholder="your@email.com" className="w-full pl-10" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                    placeholder="••••••••" className="w-full pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showPass ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && <PasswordStrength password={form.password} />}
              </div>

              <div className="pt-2">
                <GlowButton type="submit" variant="purple" className="w-full justify-center" loading={loading}>
                  Join DiMangaX
                </GlowButton>
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already a member?{' '}
              <Link to="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
