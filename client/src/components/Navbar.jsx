import { useContext, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { FiMenu, FiX, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const guestLinks = [
  { label: 'Home', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Signup', to: '/signup' }
];

const authLinks = [
  { label: 'Home', to: '/' },
  { label: 'Questions', to: '/questions' },
  { label: 'Playground', to: '/playground' },
  { label: 'Dashboard', to: '/dashboard' }
];

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const links = isAuthenticated ? authLinks : guestLinks;

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CC';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 text-sm font-bold shadow-xl">
            CC
          </span>
          <span className="hidden sm:inline">CodeCrack AI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm transition ${
                  isActive ? 'bg-white/10 text-sky-300' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <motion.div ref={dropdownRef} className="relative ml-2">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 py-1.5 pl-1.5 pr-3 text-sm text-white transition hover:border-sky-400/40"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-xs font-semibold">
                  {initials}
                </span>
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <FiChevronDown className={`transition ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 py-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                      <p className="truncate text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <FiUser /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <FiSettings /> Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/10"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <Link
              to="/signup"
              className="ml-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
            >
              Get started
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-slate-950/98 md:hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              className="flex flex-col gap-1 px-4 py-4"
            >
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-slate-200 transition ${
                      isActive ? 'bg-sky-500/15 text-sky-300' : 'hover:bg-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-slate-200 hover:bg-slate-900">
                    Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-2xl bg-rose-500/10 px-4 py-3 text-left text-rose-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
