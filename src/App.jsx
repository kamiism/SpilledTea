import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import authService from './appwrite/auth';
import { Footer, Header } from './components';
import ScanlineSweep from './components/ScanlineSweep';
import SearchModal from './components/SearchModal';
import { login, logout } from "./store/authSlice";

function App() {
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login(JSON.parse(JSON.stringify(userData))))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  },[])

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return loading ? (
    <div className='min-h-screen bg-eva-black flex flex-col items-center justify-center gap-4'>
      <div className='text-eva-orange font-bold tracking-widest uppercase' style={{ fontFamily: 'var(--font-heading)'}}>SYSTEM INITIALIZING</div>
      <div className='w-48 h-1 bg-eva-navy overflow-hidden'>
        <div className='h-full bg-eva-green animate-[shimmer_1.5s_infinite] w-full origin-left'></div>
      </div>
    </div>
  ) : (
    <div className='app-shell relative'>
      <ScanlineSweep />
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <main className="transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
