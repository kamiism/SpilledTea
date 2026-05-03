export default function SkeletonCard() {
  return (
    <div className="skeleton-card" style={{
      background: 'var(--color-eva-panel)',
      border: '1px solid var(--color-eva-border)',
      overflow: 'hidden',
    }}>
      {/* Image placeholder */}
      <div className="skeleton-shimmer" style={{
        width: '100%',
        aspectRatio: '16/9',
      }} />
      {/* Content placeholders */}
      <div style={{ padding: '16px' }}>
        <div className="skeleton-shimmer" style={{ width: '70%', height: '16px', marginBottom: '10px' }} />
        <div className="skeleton-shimmer" style={{ width: '50%', height: '12px', marginBottom: '8px' }} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <div className="skeleton-shimmer" style={{ width: '60px', height: '10px' }} />
          <div className="skeleton-shimmer" style={{ width: '40px', height: '10px' }} />
        </div>
      </div>
      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--color-eva-border)',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <div className="skeleton-shimmer" style={{ width: '80px', height: '10px' }} />
        <div className="skeleton-shimmer" style={{ width: '40px', height: '10px' }} />
      </div>
    </div>
  );
}
