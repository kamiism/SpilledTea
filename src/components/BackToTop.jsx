import { motion } from 'framer-motion';
import { ArrowUp2 as ChevronUp } from 'iconsax-react';
import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 10000,
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-eva-panel)',
        border: '1px solid rgba(107, 163, 184, 0.5)',
        color: 'var(--color-eva-cyan)',
        boxShadow: '0 0 10px rgba(107, 163, 184, 0.15)',
        cursor: 'pointer',
      }}
      aria-label="Back to top"
    >
      <ChevronUp size={24} color="var(--color-eva-cyan)" />
    </motion.button>
  );
}
