import { motion } from 'framer-motion';
import { Send2 as Send } from 'iconsax-react';
import { useState } from 'react';
import { useToast } from './ToastNotification';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const addToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubmitted(true);
    addToast('NETWORK ACCESS GRANTED — SUBSCRIPTION ACTIVE', 'success');
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{
      background: 'var(--color-eva-panel)',
      border: '1px solid var(--color-eva-border)',
      padding: '32px',
      marginTop: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Corner brackets */}
      <div className="corner-brackets" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Decorative hex grid */}
      <div className="hex-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-eva-green)',
          marginBottom: '8px',
        }}>
          &gt; SECURE_CHANNEL
        </div>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          color: 'var(--color-eva-cyan)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '8px',
          textShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
        }}>
          JOIN THE NETWORK
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-eva-muted)',
          marginBottom: '20px',
          lineHeight: '1.6',
        }}>
          Subscribe to receive classified briefings and transmission updates from the MAGI system.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ENTER_COMLINK_ADDRESS..."
            style={{
              flex: 1,
              background: 'rgba(0, 212, 255, 0.03)',
              border: '1px solid var(--color-eva-cyan)',
              borderRight: 'none',
              padding: '12px 16px',
              color: 'var(--color-eva-cyan)',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              letterSpacing: '0.05em',
              outline: 'none',
              caretColor: 'var(--color-eva-cyan)',
            }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitted}
            style={{
              padding: '12px 24px',
              background: submitted ? 'var(--color-eva-green)' : 'var(--color-eva-cyan)',
              border: '1px solid var(--color-eva-cyan)',
              color: 'var(--color-eva-black)',
              fontFamily: 'var(--font-heading)',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: submitted ? 'default' : 'pointer',
              fontWeight: 700,
            }}
          >
            {submitted ? 'LINKED' : <><Send size={14} /> CONNECT</>}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
