import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import api from '../utils/api.js';
import SectionHeading from '../components/SectionHeading.jsx';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.difficulty) params.difficulty = filters.difficulty;

    try {
      const response = await api.get('/questions', { params });
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  return (
    <div className="space-y-10">
      <SectionHeading title="Explore coding problems" subtitle="Questions library" />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.21em] text-sky-300/80">Filters</p>
            <div className="mt-6 space-y-4">
            <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search by title or tag" className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" />
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
              <option value="">All categories</option>
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="graphs">Graphs</option>
              <option value="dynamic-programming">Dynamic Programming</option>
            </select>
            <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })} className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none">
              <option value="">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button type="button" onClick={fetchQuestions} className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white">Apply filters</button>
          </div>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-400">Loading questions…</div>
          ) : error ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-rose-300">{error}</div>
          ) : questions.length ? (
            questions.map((question) => (
              <Link key={question._id} to={`/questions/${question._id}`}>
                <motion.div whileHover={{ y: -4 }} className="glass-card block p-6 transition hover:border-sky-400/30">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{question.title}</h3>
                      <p className="mt-2 text-slate-400">{question.category} • {question.subCategory || 'General'} • {question.points} points</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm ${question.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-300' : question.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-300' : 'bg-rose-500/15 text-rose-300'}`}>{question.difficulty}</span>
                  </div>
                  <p className="mt-4 text-slate-300">{question.problemStatement.slice(0, 120)}...</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-300">
                    Solve problem <FiArrowRight />
                  </span>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-400">No matching problems found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
