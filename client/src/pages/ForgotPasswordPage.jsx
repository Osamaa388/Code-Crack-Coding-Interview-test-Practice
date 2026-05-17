import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Forgot password</h1>
      <p className="mt-2 text-slate-400">Enter your email and we’ll send reset instructions.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <button type="submit" className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white transition hover:opacity-90">Send reset link</button>
      </form>
      {sent && <p className="mt-4 text-sm text-slate-300">Check your inbox for password instructions.</p>}
    </div>
  );
};

export default ForgotPasswordPage;
