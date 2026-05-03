import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScanlineSweep() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ top: 0 }}
      animate={{ top: '100vh' }}
      transition={{ duration: 1, ease: 'linear' }}
      onAnimationComplete={() => setShow(false)}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, var(--color-eva-cyan) 20%, var(--color-eva-cyan) 80%, transparent 100%)',
        boxShadow: '0 0 20px var(--color-eva-cyan), 0 0 60px var(--color-eva-cyan)',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  );
}
