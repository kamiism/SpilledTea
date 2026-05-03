import { AnimatePresence, motion } from 'framer-motion';
import { Warning2 as AlertTriangle, TickCircle as CheckCircle, InfoCircle as Info, CloseCircle as X } from 'iconsax-react';
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: 'var(--color-eva-green)',
  error: 'var(--color-eva-red)',
  info: 'var(--color-eva-cyan)',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = ICONS[toast.type] || Info;
            const color = COLORS[toast.type] || COLORS.info;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  pointerEvents: 'auto',
                  background: 'var(--color-eva-panel)',
                  border: `1px solid ${color}`,
                  boxShadow: `0 0 20px ${color}33, 0 4px 20px rgba(0,0,0,0.5)`,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: color,
                  minWidth: '280px',
                  maxWidth: '400px',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-eva-muted)', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} color="currentColor" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
