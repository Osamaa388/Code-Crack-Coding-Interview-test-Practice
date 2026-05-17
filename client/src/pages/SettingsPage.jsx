import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { isRemembered } from '../utils/token.js';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-8"
    >
      <SectionHeading title="Settings" subtitle="Preferences & security" />
      <div className="glass-card space-y-6 p-8">
        <motion.div>
          <h3 className="text-sm font-medium text-slate-400">Account</h3>
          <p className="mt-1 text-white">{user?.email}</p>
        </motion.div>
        <motion.div>
          <h3 className="text-sm font-medium text-slate-400">Session</h3>
          <p className="mt-1 text-slate-300">
            {isRemembered() ? 'Persistent login enabled (Remember me)' : 'Session expires when browser closes'}
          </p>
        </motion.div>
        <motion.div>
          <h3 className="text-sm font-medium text-slate-400">Role</h3>
          <p className="mt-1 capitalize text-slate-300">{user?.role}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
