import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardPage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/users/me/stats').then((res) => setStats(res.data)).catch(() => {});
    api.get('/users/me').then((res) => updateUser(res.data)).catch(() => {});
  }, [updateUser]);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{user?.name || 'CodeCrack User'}</h1>
          <p className="mt-3 text-slate-400">Continue your streak and track your interview readiness.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['Points', 'Solved', 'Streak'].map((item, idx) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <p className="text-sm text-slate-400">{item}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item === 'Points' ? user?.points : item === 'Solved' ? user?.questionsSolved : user?.streak}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white">Weekly activity</h2>
          <p className="mt-2 text-slate-400">Analyze your recent progress and focus areas.</p>
          <div className="mt-6">
            <Bar data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Problems solved', data: [2, 3, 1, 4, 2, 3, 5], backgroundColor: 'rgba(99, 102, 241, 0.8)' }] }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </motion.div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-8">
          <SectionHeading title="Progress overview" subtitle="Your performance" />
          {stats ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries({ Accuracy: '92%', 'Avg time': '18m', Strength: 'Arrays', Weakness: 'DP' }).map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-slate-400">Loading stats…</p>}
        </div>
        <div className="glass-card p-8">
          <SectionHeading title="Bookmark summary" subtitle="Saved problems" />
          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <Doughnut data={{ labels: ['Solved', 'Pending', 'Bookmarked'], datasets: [{ data: [user?.questionsSolved || 0, 12, stats?.bookmarks || 0], backgroundColor: ['#6366f1', '#22c55e', '#38bdf8'] }] }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
