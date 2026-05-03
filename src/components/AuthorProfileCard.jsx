import { User } from 'iconsax-react';

export default function AuthorProfileCard({ authorName, postCount = 0 }) {
  const initial = authorName ? authorName.charAt(0).toUpperCase() : '?';

  return (
    <div style={{
      background: 'var(--color-eva-panel)',
      border: '1px solid var(--color-eva-border)',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Corner brackets */}
      <div className="corner-brackets" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* Header label */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-eva-green)',
        marginBottom: '20px',
        opacity: 0.8,
      }}>
        &gt; UNIT_PROFILE // ACTIVE_PILOT
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Avatar */}
        <div style={{
          width: '64px',
          height: '64px',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'linear-gradient(135deg, var(--color-eva-cyan), var(--color-eva-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            color: 'var(--color-eva-black)',
            fontWeight: 700,
          }}>
            {initial}
          </span>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            color: 'var(--color-eva-white)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '4px',
          }}>
            {authorName || 'UNKNOWN'}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-eva-muted)',
            lineHeight: '1.6',
            marginBottom: '8px',
          }}>
            Classified personnel with active transmission clearance. Contributing to the MAGI data network.
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            <span style={{ color: 'var(--color-eva-cyan)' }}>
              <User size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              PILOT_ACTIVE
            </span>
            <span style={{ color: 'var(--color-eva-orange)' }}>
              TRANSMISSIONS: {postCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
