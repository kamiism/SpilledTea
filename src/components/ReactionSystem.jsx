import { motion } from 'framer-motion';
import { useState } from 'react';

const REACTIONS = [
  { emoji: '🔥', label: 'fire' },
  { emoji: '💀', label: 'skull' },
  { emoji: '👁️', label: 'eye' },
  { emoji: '✦', label: 'star' },
];

export default function ReactionSystem({ postId }) {
  // Local state for reactions (in a real app, persist to backend)
  const [counts, setCounts] = useState(() => {
    const saved = localStorage.getItem(`reactions-${postId}`);
    return saved ? JSON.parse(saved) : { fire: 0, skull: 0, eye: 0, star: 0 };
  });
  const [reacted, setReacted] = useState(() => {
    const saved = localStorage.getItem(`reacted-${postId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const handleReaction = (label) => {
    const wasReacted = reacted[label];
    const newCounts = {
      ...counts,
      [label]: wasReacted ? Math.max(0, counts[label] - 1) : counts[label] + 1,
    };
    const newReacted = { ...reacted, [label]: !wasReacted };

    setCounts(newCounts);
    setReacted(newReacted);
    localStorage.setItem(`reactions-${postId}`, JSON.stringify(newCounts));
    localStorage.setItem(`reacted-${postId}`, JSON.stringify(newReacted));
  };

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-eva-muted)',
        marginRight: '4px',
      }}>
        REACT:
      </span>
      {REACTIONS.map(({ emoji, label }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.4 }}
          onClick={() => handleReaction(label)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: reacted[label] ? 'rgba(107, 163, 184, 0.08)' : 'transparent',
            border: `1px solid ${reacted[label] ? 'rgba(107,163,184,0.6)' : 'var(--color-eva-border)'}`,
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            color: 'var(--color-eva-white)',
          }}
        >
          <span style={{ fontSize: '18px' }}>{emoji}</span>
          <span style={{
            fontSize: '11px',
            color: reacted[label] ? '#8ab4c4' : 'var(--color-eva-muted)',
            minWidth: '12px',
          }}>
            {counts[label]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
