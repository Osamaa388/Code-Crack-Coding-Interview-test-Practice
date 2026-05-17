import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiBookmark,
  FiHeart,
  FiShare2,
  FiPlay,
  FiSend,
  FiMaximize,
  FiMinimize,
  FiClock,
  FiChevronLeft
} from 'react-icons/fi';
import api from '../utils/api.js';
import { AuthContext } from '../context/AuthContext.jsx';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { id: 'python', label: 'Python', monaco: 'python' },
  { id: 'java', label: 'Java', monaco: 'java' },
  { id: 'cpp', label: 'C++', monaco: 'cpp' },
  { id: 'c', label: 'C', monaco: 'c' },
  { id: 'csharp', label: 'C#', monaco: 'csharp' },
  { id: 'go', label: 'Go', monaco: 'go' }
];

const STARTER = {
  javascript: 'function solve(input) {\n  // Write your solution\n  return input;\n}\n',
  python: 'def solve(input):\n    # Write your solution\n    return input\n',
  java: 'public class Solution {\n  public static void main(String[] args) {\n    // Write your solution\n  }\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your solution\n  return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n  // Write your solution\n  return 0;\n}\n',
  csharp: 'using System;\n\nclass Solution {\n  static void Main() {\n    // Write your solution\n  }\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n  // Write your solution\n}\n'
};

const difficultyClass = {
  Easy: 'bg-emerald-500/15 text-emerald-300',
  Medium: 'bg-amber-500/15 text-amber-300',
  Hard: 'bg-rose-500/15 text-rose-300'
};

const QuestionDetail = () => {
  const { id } = useParams();
  const { updateUser } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER.javascript);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('Run your code to see output here.');
  const [consoleLog, setConsoleLog] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolutions, setShowSolutions] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fullscreen, setFullscreen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const editorRef = useRef(null);
  const storageKey = `codecrack_code_${id}_${language}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCode(saved);
    else setCode(STARTER[language]);
  }, [id, language, storageKey]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/questions/${id}`)
      .then((res) => {
        setQuestion(res.data);
        if (res.data.examples?.[0]?.input) setCustomInput(res.data.examples[0].input);
      })
      .catch(() => toast.error('Failed to load question'))
      .finally(() => setLoading(false));
  }, [id]);

  const autosave = useCallback(
    (value) => {
      setCode(value);
      localStorage.setItem(storageKey, value || '');
    },
    [storageKey]
  );

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const saved = localStorage.getItem(`codecrack_code_${id}_${lang}`);
    setCode(saved || STARTER[lang]);
    setOutput('Run your code to see output here.');
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running…');
    try {
      const res = await api.post('/submissions/run', {
        questionId: id,
        language,
        code,
        customInput
      });
      setOutput(res.data.output || res.data.stderr || 'No output');
      setConsoleLog(res.data.stderr || '');
      if (res.data.status === 'success') toast.success('Code executed');
      else toast.error('Execution error');
    } catch (err) {
      setOutput(err.response?.data?.message || 'Execution failed');
      toast.error('Run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/submissions/submit', { questionId: id, language, code });
      const { evaluation, xpEarned, passed } = res.data;
      setOutput(
        evaluation.results
          .map((r) => `Test ${r.index}: ${r.passed ? '✓ PASS' : '✗ FAIL'}${r.hidden ? ' (hidden)' : ''}`)
          .join('\n')
      );
      if (passed) {
        toast.success(`Accepted! +${xpEarned} XP`);
        updateUser({
          questionsSolved: (res.data.submission?.user?.questionsSolved) || undefined
        });
        api.get('/users/me').then((r) => updateUser(r.data));
      } else {
        toast.error(`${evaluation.passedCount}/${evaluation.total} tests passed`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await api.post('/bookmarks', { questionId: id });
      setBookmarked(res.data.bookmarked);
      toast.success(res.data.message);
    } catch {
      toast.error('Bookmark failed');
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-slate-800/50" />
        ))}
      </div>
    );
  }

  if (!question) {
    return (
      <motion.div className="glass-card p-8 text-center">
        <p className="text-slate-400">Question not found.</p>
        <Link to="/questions" className="mt-4 inline-block text-sky-300">Back to questions</Link>
      </motion.div>
    );
  }

  const solutions = question.solutions || {};
  const bruteForce = solutions.bruteForce || question.solution;
  const optimized = solutions.optimized || question.solution;
  const complexity = solutions.complexity || `${question.timeComplexity || '—'} time · ${question.spaceComplexity || '—'} space`;

  return (
    <div className={`space-y-4 ${fullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4' : ''}`}>
      <Link to="/questions" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-300">
        <FiChevronLeft /> Back to questions
      </Link>

      <div className={`grid gap-6 ${fullscreen ? 'h-full grid-cols-1 lg:grid-cols-2' : 'xl:grid-cols-2'}`}>
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pr-2"
        >
          <div className="glass-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <motion.div>
                <h1 className="text-2xl font-semibold text-white">{question.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyClass[question.difficulty]}`}>
                    {question.difficulty}
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{question.category}</span>
                  <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-300">{question.points} pts</span>
                </div>
              </motion.div>
              <div className="flex gap-2">
                <button type="button" onClick={toggleBookmark} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-sky-300">
                  <FiBookmark className={bookmarked ? 'fill-sky-400 text-sky-400' : ''} />
                </button>
                <button type="button" onClick={() => { setLiked(!liked); toast.success('Thanks for the like!'); }} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-rose-300">
                  <FiHeart className={liked ? 'fill-rose-400 text-rose-400' : ''} />
                </button>
                <button type="button" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); }} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-white">
                  <FiShare2 />
                </button>
              </div>
            </div>

            {question.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span key={tag} className="rounded-lg bg-slate-900 px-2 py-1 text-xs text-slate-400">{tag}</span>
                ))}
              </div>
            )}

            {question.companiesAsked?.length > 0 && (
              <p className="mt-4 text-sm text-slate-400">
                Companies: <span className="text-slate-300">{question.companiesAsked.join(', ')}</span>
              </p>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white">Problem</h2>
            <p className="mt-4 whitespace-pre-wrap text-slate-300">{question.problemStatement}</p>
            {question.constraints?.length > 0 && (
              <>
                <h3 className="mt-6 font-medium text-white">Constraints</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-400">
                  {question.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
            {question.examples?.map((ex, i) => (
              <div key={i} className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm font-medium text-sky-300">Example {i + 1}</p>
                <p className="mt-2 text-sm text-slate-400">Input: <span className="text-slate-200">{ex.input}</span></p>
                <p className="mt-1 text-sm text-slate-400">Output: <span className="text-slate-200">{ex.output}</span></p>
              </div>
            ))}
          </div>

          <motion.div className="glass-card p-6">
            <h3 className="font-semibold text-white">Hints</h3>
            <div className="mt-4 space-y-3">
              {(question.hints || []).slice(0, 3).map((hint, i) => (
                <AnimatePresence key={i}>
                  {i < revealedHints ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-slate-900/80 p-3 text-sm text-slate-300">
                      <span className="text-sky-400">Hint {i + 1}:</span> {hint}
                    </motion.p>
                  ) : i === revealedHints ? (
                    <button
                      type="button"
                      onClick={() => setRevealedHints(revealedHints + 1)}
                      className="w-full rounded-xl border border-dashed border-white/20 py-3 text-sm text-slate-400 hover:border-sky-400/50 hover:text-sky-300"
                    >
                      Reveal hint {i + 1}
                    </button>
                  ) : null}
                </AnimatePresence>
              ))}
            </div>
          </motion.div>

          <div className="glass-card p-6">
            <button type="button" onClick={() => setShowSolutions(!showSolutions)} className="text-sm font-medium text-sky-300">
              {showSolutions ? 'Hide' : 'Show'} solutions
            </button>
            <AnimatePresence>
              {showSolutions && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 space-y-4 overflow-hidden">
                  <motion.div>
                    <p className="text-xs uppercase text-slate-500">Brute force</p>
                    <p className="mt-1 text-sm text-slate-300">{bruteForce}</p>
                  </motion.div>
                  <motion.div>
                    <p className="text-xs uppercase text-slate-500">Optimized</p>
                    <p className="mt-1 text-sm text-slate-300">{optimized}</p>
                  </motion.div>
                  <motion.div>
                    <p className="text-xs uppercase text-slate-500">Complexity</p>
                    <p className="mt-1 text-sm text-slate-300">{complexity}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white">Discussion</h3>
            <p className="mt-2 text-sm text-slate-400">Share approaches with the community. Coming soon.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex flex-col ${fullscreen ? 'h-full' : ''}`}
        >
          <div className="glass-card flex flex-1 flex-col overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/90 px-4 py-3">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <FiClock /> {formatTime(seconds)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300">
                  {theme === 'vs-dark' ? 'Light' : 'Dark'}
                </button>
                <button type="button" onClick={() => setFullscreen(!fullscreen)} className="rounded-lg border border-white/10 p-2 text-slate-300">
                  {fullscreen ? <FiMinimize /> : <FiMaximize />}
                </button>
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={running}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  <FiPlay /> {running ? 'Running…' : 'Run'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  <FiSend /> {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </div>

            <div className={fullscreen ? 'min-h-0 flex-1' : ''}>
              <Editor
                height={fullscreen ? '100%' : '360px'}
                language={LANGUAGES.find((l) => l.id === language)?.monaco || 'javascript'}
                theme={theme}
                value={code}
                onChange={autosave}
                onMount={(editor) => { editorRef.current = editor; }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12 }
                }}
              />
            </div>

            <div className="grid gap-0 border-t border-white/10 lg:grid-cols-2">
              <div className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
                <p className="text-xs font-medium uppercase text-slate-500">Custom input</p>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 p-3 font-mono text-sm text-slate-200 outline-none focus:border-sky-400"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase text-slate-500">Output</p>
                <pre className="mt-2 max-h-32 overflow-auto rounded-xl border border-white/10 bg-slate-900 p-3 font-mono text-sm text-emerald-300">
                  {output}
                </pre>
                {consoleLog && (
                  <>
                    <p className="mt-3 text-xs font-medium uppercase text-slate-500">Console</p>
                    <pre className="mt-1 max-h-20 overflow-auto rounded-xl bg-slate-950 p-2 font-mono text-xs text-amber-200">{consoleLog}</pre>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionDetail;
