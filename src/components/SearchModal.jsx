import { AnimatePresence, motion } from 'framer-motion';
import { SearchNormal as Search, CloseCircle as X } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    appwriteService.getPosts([]).then(res => {
      setAllPosts(res?.rows ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setPosts([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setPosts([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allPosts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.authorName?.toLowerCase().includes(q)
    );
    setPosts(filtered);
  }, [query, allPosts]);

  // Estimate reading time
  const getReadTime = (content) => {
    if (!content) return '1 min';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '12vh',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              padding: '0 20px',
            }}
          >
            {/* MAGI Terminal Header */}
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-eva-cyan)',
              marginBottom: '12px',
              opacity: 0.7,
            }}>
              &gt; MAGI_QUERY_INTERFACE // SEARCH_PROTOCOL_ACTIVE
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'var(--color-eva-panel)',
              border: '1px solid var(--color-eva-cyan)',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.15)',
              padding: '16px 20px',
            }}>
              <Search size={20} style={{ color: 'var(--color-eva-cyan)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ENTER QUERY..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-eva-cyan)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  letterSpacing: '0.1em',
                  caretColor: 'var(--color-eva-cyan)',
                }}
              />
              <button onClick={onClose} style={{
                background: 'none',
                border: '1px solid var(--color-eva-border)',
                color: 'var(--color-eva-muted)',
                padding: '4px 10px',
                fontFamily: 'var(--font-heading)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                ESC <X size={12} color="currentColor" />
              </button>
            </div>

            {/* Results */}
            {query.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: '4px',
                  maxHeight: '50vh',
                  overflowY: 'auto',
                  background: 'var(--color-eva-panel)',
                  border: '1px solid var(--color-eva-border)',
                  borderTop: 'none',
                }}
              >
                {posts.length > 0 ? (
                  posts.slice(0, 8).map((post, i) => (
                    <Link
                      key={post.$id}
                      to={`/post/${post.$id}`}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--color-eva-border)',
                        textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}
                      className="search-result-item"
                    >
                      <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '10px',
                        color: 'var(--color-eva-purple)',
                        opacity: 0.6,
                        minWidth: '24px',
                      }}>
                        [{String(i + 1).padStart(2, '0')}]
                      </span>
                      {post.featuredImage && (
                        <img
                          src={appwriteService.getFilePreview(post.featuredImage)}
                          alt=""
                          style={{
                            width: '48px',
                            height: '36px',
                            objectFit: 'cover',
                            border: '1px solid var(--color-eva-border)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '14px',
                          color: 'var(--color-eva-white)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {post.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '10px',
                          color: 'var(--color-eva-muted)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginTop: '2px',
                        }}>
                          UNIT_{post.authorName?.toUpperCase() || 'UNKNOWN'} // {getReadTime(post.content)} READ
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '12px',
                    color: 'var(--color-eva-red)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}>
                    ⚠ NO MATCHING TRANSMISSIONS FOUND
                  </div>
                )}
              </motion.div>
            )}

            {/* Hint */}
            <div style={{
              marginTop: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: 'var(--color-eva-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
              opacity: 0.5,
            }}>
              PRESS / TO OPEN • ESC TO CLOSE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
