import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', bio: '', profileImage: '' });
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', bio: user.bio || '', profileImage: user.profileImage || '' });
    }
    api.get('/users/me/stats').then((res) => setStats(res.data)).catch(() => {});
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/me', form);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <SectionHeading title="Your profile" subtitle="Account overview" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <motion.div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-500 text-2xl font-bold text-white">
            {user?.name?.charAt(0) || 'U'}
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user?.name}</h2>
            <p className="text-slate-400">@{user?.username} · {user?.email}</p>
            <p className="mt-1 text-sm capitalize text-sky-300">{user?.role || 'user'}</p>
          </div>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Points', value: user?.points ?? 0 },
            { label: 'Solved', value: user?.questionsSolved ?? 0 },
            { label: 'Streak', value: user?.streak ?? 0 }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSave}
        className="glass-card space-y-5 p-8"
      >
        <h3 className="text-lg font-semibold text-white">Edit profile</h3>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          <span>Bio</span>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-400"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </motion.form>

      {stats?.recentActivity?.length > 0 && (
        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold text-white">Recent activity</h3>
          <ul className="mt-4 space-y-2">
            {stats.recentActivity.map((item, i) => (
              <li key={i} className="rounded-xl bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
