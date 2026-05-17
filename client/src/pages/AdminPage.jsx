import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';

const AdminPage = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then((res) => setSummary(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-10">
      <SectionHeading title="Admin dashboard" subtitle="Manage the platform" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Users</p>
          <p className="mt-4 text-4xl font-semibold text-white">{summary?.userCount ?? '–'}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Questions</p>
          <p className="mt-4 text-4xl font-semibold text-white">{summary?.questionCount ?? '–'}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Top user</p>
          <p className="mt-4 text-xl font-semibold text-white">{summary?.topUsers?.[0]?.name || 'Loading...'}</p>
        </div>
      </div>
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold text-white">Admin actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <button className="rounded-3xl bg-slate-900 px-5 py-4 text-left text-white transition hover:bg-slate-800">Manage users</button>
          <button className="rounded-3xl bg-slate-900 px-5 py-4 text-left text-white transition hover:bg-slate-800">Manage questions</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
