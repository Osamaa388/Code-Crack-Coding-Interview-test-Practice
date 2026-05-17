import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      login(response.data.token, response.data.user, true);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Create your account</h1>
      <p className="mt-2 text-slate-400">Join hundreds of engineers practicing for interviews daily.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Username</span>
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Password</span>
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white transition hover:opacity-90">
          {loading ? 'Creating account…' : 'Get started'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">Already a member? <Link to="/login" className="text-sky-300">Login</Link></p>
    </div>
  );
};

export default SignupPage;
