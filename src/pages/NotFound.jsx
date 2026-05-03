import { motion } from 'framer-motion';
import { Warning2, Home2 as Home } from 'iconsax-react';
import { Link } from 'react-router-dom';

const glitchKeyframes = `
@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 96% 0); transform: translate(-2px, 2px); }
  20% { clip-path: inset(30% 0 40% 0); transform: translate(2px, -1px); }
  40% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 1px); }
  60% { clip-path: inset(10% 0 70% 0); transform: translate(1px, -2px); }
  80% { clip-path: inset(50% 0 20% 0); transform: translate(-2px, 0px); }
}
@keyframes glitch-2 {
  0%, 100% { clip-path: inset(96% 0 0 0); transform: translate(2px, -2px); }
  20% { clip-path: inset(40% 0 30% 0); transform: translate(-2px, 1px); }
  40% { clip-path: inset(10% 0 60% 0); transform: translate(1px, -1px); }
  60% { clip-path: inset(70% 0 10% 0); transform: translate(-1px, 2px); }
  80% { clip-path: inset(20% 0 50% 0); transform: translate(2px, 0px); }
}
@keyframes flicker {
  0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
  20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.3; }
}
`;

export default function NotFound() {
  return (
    <>
      <style>{glitchKeyframes}</style>
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Hex grid bg */}
        <div className="hex-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Alert icon */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginBottom: '24px' }}
          >
            <Warning2 size={48} style={{ color: 'var(--color-eva-red)' }} />
          </motion.div>

          {/* Error code */}
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: 'var(--color-eva-red)',
            textTransform: 'uppercase',
            marginBottom: '16px',
            opacity: 0.8,
          }}>
            ERROR_CODE: 404 // SECTOR_UNREACHABLE
          </div>

          {/* Glitch title */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 6vw, 64px)',
              color: 'var(--color-eva-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 1.1,
              textShadow: '0 0 20px rgba(255, 32, 32, 0.5)',
              animation: 'flicker 3s linear infinite',
            }}>
              SIGNAL LOST
            </h1>
            {/* Glitch layers */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 6vw, 64px)',
                color: 'var(--color-eva-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
                animation: 'glitch-1 2.5s infinite',
                opacity: 0.7,
              }}
            >
              SIGNAL LOST
            </span>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 6vw, 64px)',
                color: 'var(--color-eva-purple)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1.1,
                animation: 'glitch-2 2.5s infinite',
                opacity: 0.7,
              }}
            >
              SIGNAL LOST
            </span>
          </div>

          <p style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '16px',
            color: 'var(--color-eva-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '32px',
          }}>
            TRANSMISSION NOT FOUND
          </p>

          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-eva-muted)',
            marginBottom: '32px',
            lineHeight: '1.8',
            maxWidth: '400px',
          }}>
            The requested data block could not be located in the MAGI archive. The transmission may have been purged or relocated to a classified sector.
          </div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/"
              className="btn-nerv"
              style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}
            >
              <Home size={16} color="currentColor" />
              RETURN TO BASE
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
