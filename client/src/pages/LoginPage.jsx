import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const redirectTo = searchParams.get('redirect') || location.state?.from || '/dashboard';

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      login(response.data.token, response.data.user, remember);
      toast.success('Welcome back!');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google login coming soon', { icon: '🔐' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="-mx-4 -my-6 min-h-[calc(100vh-4rem)] lg:-mx-10 lg:-my-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
          className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8"
      >
        <div className="hidden flex-col justify-center lg:flex">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">CodeCrack AI</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white xl:text-5xl">
            Level up your interview prep with a premium coding workspace
          </h1>
          <p className="mt-4 max-w-md text-slate-400">
            Solve real problems, run code instantly, track streaks, and build confidence before your next onsite.
          </p>
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur-xl">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="font-mono text-sm leading-7 text-slate-300"
            >
              <p className="text-sky-400">// binary search.ts</p>
              <p><span className="text-purple-400">function</span> search(nums, target) {'{'}</p>
              <p className="pl-4">let lo = 0, hi = nums.length - 1;</p>
              <p className="pl-4">while (lo &lt;= hi) {'{'}</p>
              <p className="pl-8">const mid = (lo + hi) &gt;&gt; 1;</p>
              <p className="pl-8">if (nums[mid] === target) return mid;</p>
              <p className="pl-4">{'}'}</p>
              <p className="pl-4">return -1;</p>
              <p>{'}'}</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto w-full max-w-md"
        >
          <motion.div
            className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur-2xl"
          >
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to continue your practice streak</p>

            {searchParams.get('expired') && (
              <p className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
                Your session expired. Please sign in again.
              </p>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="block space-y-2 text-sm text-slate-300">
                <span>Email</span>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  autoComplete="email"
                  className={`w-full rounded-2xl border bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-sky-400 ${
                    errors.email ? 'border-rose-500/50' : 'border-white/10'
                  }`}
                  placeholder="you@company.com"
                />
                {errors.email && <span className="text-xs text-rose-400">{errors.email}</span>}
              </label>

              <label className="block space-y-2 text-sm text-slate-300">
                <span>Password</span>
                <motion.div className="relative">
                  <input
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`w-full rounded-2xl border bg-slate-900/80 px-4 py-3 pr-12 text-white outline-none transition focus:border-sky-400 ${
                      errors.password ? 'border-rose-500/50' : 'border-white/10'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </motion.div>
                {errors.password && <span className="text-xs text-rose-400">{errors.password}</span>}
              </label>

              <motion.div className="flex items-center justify-between text-sm">
                <label className="inline-flex cursor-pointer items-center gap-2 text-slate-400">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-500"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sky-300 hover:text-sky-200">
                  Forgot password?
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 font-medium text-white transition disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>

            <div className="relative my-6">
              <motion.div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </motion.div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-500">or continue with</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
              >
                <FcGoogle size={18} /> Google
              </button>
              <button
                type="button"
                onClick={() => toast('GitHub login coming soon', { icon: '🔐' })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white transition hover:bg-slate-800"
              >
                <FiGithub size={18} /> GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              New to CodeCrack AI?{' '}
              <Link to="/signup" className="font-medium text-sky-300 hover:text-sky-200">
                Create account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
