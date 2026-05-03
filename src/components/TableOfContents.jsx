import { useEffect, useState } from 'react';

export default function TableOfContents({ contentHtml }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Parse headings from article content after DOM renders
    const timer = setTimeout(() => {
      const proseEl = document.querySelector('.prose-spilled');
      if (!proseEl) return;

      const hElements = proseEl.querySelectorAll('h1, h2, h3');
      const items = [];
      hElements.forEach((el, i) => {
        const id = `heading-${i}`;
        el.id = id;
        items.push({
          id,
          text: el.textContent.replace(/^\/\/\s*/, ''),
          level: parseInt(el.tagName.charAt(1)),
        });
      });
      setHeadings(items);
    }, 300);

    return () => clearTimeout(timer);
  }, [contentHtml]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      style={{
        position: 'sticky',
        top: '100px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        padding: '16px',
        background: 'var(--color-eva-panel)',
        border: '1px solid var(--color-eva-border)',
        fontFamily: 'var(--font-heading)',
        fontSize: '11px',
      }}
      className="no-scrollbar"
    >
      <div style={{
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-eva-cyan)',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--color-eva-border)',
      }}>
        &gt; TABLE_OF_CONTENTS
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'block',
                paddingLeft: `${(h.level - 1) * 12}px`,
                color: activeId === h.id ? 'var(--color-eva-cyan)' : 'var(--color-eva-muted)',
                textShadow: activeId === h.id ? '0 0 8px var(--color-eva-cyan)' : 'none',
                borderLeft: activeId === h.id ? '2px solid var(--color-eva-cyan)' : '2px solid transparent',
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingRight: '4px',
                transition: 'all 0.2s',
                textDecoration: 'none',
                lineHeight: '1.4',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
