import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('Verifying');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('Verified');
        toast.success('Email verified successfully');
      } catch (error) {
        setStatus('Failed');
        toast.error('Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow text-center">
      <h1 className="text-3xl font-semibold text-white">Email verification</h1>
      <p className="mt-4 text-slate-400">{status === 'Verifying' ? 'Validating your account...' : status === 'Verified' ? 'Your account is now verified!' : 'Verification could not be completed.'}</p>
      <Link to="/login" className="mt-8 inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-white transition hover:opacity-90">Go to login</Link>
    </div>
  );
};

export default VerifyEmailPage;
