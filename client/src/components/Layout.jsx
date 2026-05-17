import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className={isAuthPage ? '' : 'px-4 py-6 lg:px-10 lg:py-8'}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
