import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiBookOpen, FiBarChart2, FiStar } from 'react-icons/fi';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';

const stats = [
  { icon: FiBookOpen, label: 'Questions', value: '120+' },
  { icon: FiBarChart2, label: 'Companies', value: '50+' },
  { icon: FiStar, label: 'Success Rate', value: '98%' }
];

const categories = ['Arrays', 'Strings', 'Graphs', 'Dynamic Programming', 'Recursion', 'Sorting'];

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState('');

  useEffect(() => {
    api.get('/questions/trending')
      .then((res) => setTrending(res.data))
      .catch((err) => setTrendingError(err.response?.data?.message || err.message || 'Failed to load trending questions'))
      .finally(() => setTrendingLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-16">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm text-sky-200">Premium interview practice for modern engineers</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl xl:text-6xl">Master Coding Interviews Smarter</h1>
          <p className="max-w-2xl text-slate-300">Practice coding problems, track progress, solve challenges, and ace your interviews with data-driven learning and live playgrounds.</p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/questions" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.01]">Start Practicing</Link>
            <Link to="/playground" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900 px-6 py-3 text-sm text-slate-200 transition hover:border-sky-300">Explore Playground</Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="glass-card p-8 shadow-glow">
          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                <span>Monaco Editor</span>
                <span>JavaScript</span>
              </div>
              <div className="rounded-3xl bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                <p>{`function twoSum(nums, target) {`}</p>
                <p className="pl-4">{`const seen = new Map();`}</p>
                <p className="pl-4">{`for (let i = 0; i < nums.length; i++) {`}</p>
                <p className="pl-8">{`const diff = target - nums[i];`}</p>
                <p className="pl-8">{`if (seen.has(diff)) return [seen.get(diff), i];`}</p>
                <p className="pl-8">{`seen.set(nums[i], i);`}</p>
                <p className="pl-4">{`}`}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sky-300"><item.icon size={20} /></div>
                  <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card p-8">
          <SectionHeading title="Browse categories" subtitle="Explore tracks" />
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:bg-slate-900">
                <p className="text-sm text-sky-300">{category}</p>
                <p className="mt-3 text-white">Curated problems across difficulty and company patterns.</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8">
          <SectionHeading title="Trending problems" subtitle="Hot challenges" />
          <div className="space-y-4">
            {trendingLoading ? (
              <p className="text-slate-400">Loading trending questions…</p>
            ) : trendingError ? (
              <p className="text-rose-300">{trendingError}</p>
            ) : trending.length ? (
              trending.map((question) => (
                <Link key={question._id} to="/questions" className="group block rounded-3xl border border-white/10 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:border-sky-300">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{question.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{question.category} • {question.difficulty}</p>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">{question.difficulty}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <span>{question.companiesAsked?.slice(0, 2).join(', ')}</span>
                    <span className="flex items-center gap-1 text-sky-300">Explore <FiChevronRight /></span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-slate-400">No trending questions available.</p>
            )}
          </div>
        </div>
      </section>

      <section className="glass-card p-8">
        <SectionHeading title="How it works" subtitle="Designed for progress" />
        <div className="grid gap-4 md:grid-cols-3">
          {['Track progress', 'Build confidence', 'Mock interviews'].map((text, index) => (
            <div key={text} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 text-indigo-300 grid place-items-center text-xl">{index + 1}</div>
              <h3 className="mt-5 text-xl font-semibold text-white">{text}</h3>
              <p className="mt-3 text-slate-400">Practice in an immersive environment built to mirror real interview flow.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
