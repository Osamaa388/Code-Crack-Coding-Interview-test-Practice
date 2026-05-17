import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 text-center shadow-glow">
    <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">404 error</p>
    <h1 className="mt-6 text-5xl font-semibold text-white">Page not found</h1>
    <p className="mt-4 text-slate-400">The page you are looking for does not exist or has been moved.</p>
    <Link to="/" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white">Back home</Link>
  </div>
);

export default NotFoundPage;
