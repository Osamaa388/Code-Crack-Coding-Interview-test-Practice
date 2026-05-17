import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow">
      <h1 className="text-3xl font-semibold text-white">Reset password</h1>
      <p className="mt-2 text-slate-400">Set a secure new password for your account.</p>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>New password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400" />
        </label>
        <button type="submit" className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white transition hover:opacity-90">Reset password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
