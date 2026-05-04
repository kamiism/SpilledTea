import { motion } from 'framer-motion';
import { Eye, TrendUp } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Container, PostCard } from '../components';
import NewsletterWidget from '../components/NewsletterWidget';
import SkeletonCard from '../components/SkeletonCard';

const MAGI_FILTERS = ['ALL', 'ANIME', 'MUSIC', 'TECH', 'ART', 'CULTURE', 'OPINION'];

/* ── Card entrance animation variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

/* ── Trending Sidebar ── */
function TrendingSidebar({ posts }) {
  const sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  if (sorted.length === 0) return null;

  return (
    <div style={{
      position: 'sticky',
      top: '80px',
      background: '#0c1520',
      borderLeft: '2px solid rgba(78,140,160,0.2)',
      padding: '20px',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--color-eva-border)',
      }}>
        <TrendUp size={14} color="var(--color-eva-orange)" />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-eva-orange)',
        }}>
          TRENDING_SIGNALS
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {sorted.map((post, i) => (
          <Link
            key={post.$id}
            to={`/post/${post.$id}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 8px',
              margin: '0 -8px',
              borderBottom: i < sorted.length - 1 ? '1px solid var(--color-eva-border)' : 'none',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            className="search-result-item"
          >
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              color: 'var(--color-eva-cyan)',
              opacity: 0.4,
              minWidth: '30px',
              lineHeight: 1,
              paddingTop: '2px',
            }}>
              [{String(i + 1).padStart(2, '0')}]
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
                color: 'var(--color-eva-white)',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: 1.3,
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {post.title}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                color: 'var(--color-eva-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Eye size={9} color="currentColor" /> {post.views || 0}
                </span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>@{post.authorName?.toLowerCase() || 'unknown'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    
    useEffect(() => {
        appwriteService.getPosts([]).then((response) => {
            if (response) {
                const allPosts = response.rows ?? [];
                allPosts.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
                setPosts(allPosts);
            }
        }).catch(() => {
            setPosts([])
        }).finally(() => {
            setLoading(false)
        })
    }, [])

  if (loading) {
    return (
      <div className='w-full py-10'>
        <Container>
          <div className="mb-8">
            <div className="skeleton-shimmer" style={{ width: '100%', height: '48px', marginBottom: '16px' }}></div>
            <div className="skeleton-shimmer" style={{ width: '100%', height: '48px' }}></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </Container>
      </div>
    )
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || post.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className='w-full pt-12 pb-10 min-h-[80vh]'>
      <Container>
        {/* Filter & Search Rail */}
        <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--color-eva-border)', paddingBottom: '24px' }}>
          {/* MAGI System selector */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '16px' }} className="no-scrollbar">
            {MAGI_FILTERS.map(filter => (
                <motion.button
                    key={filter}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveFilter(filter)}
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '14px',
                        padding: '6px 16px',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        border: '1px solid var(--color-eva-border)',
                        background: activeFilter === filter ? 'var(--color-eva-orange)' : 'transparent',
                        color: activeFilter === filter ? 'var(--color-eva-black)' : 'var(--color-eva-muted)',
                        boxShadow: activeFilter === filter ? '0 0 12px rgba(255,102,0,0.4)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                >
                    {filter}
                </motion.button>
            ))}
          </div>

          {/* Search bar directly below */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0,255,65,0.02)',
            border: '1px solid var(--color-eva-border)',
            padding: '12px',
          }}>
            <span style={{ color: 'var(--color-eva-green)', fontFamily: 'monospace', marginRight: '12px', fontWeight: 'bold' }}>&gt;</span>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'monospace',
                  color: 'var(--color-eva-green)',
                  caretColor: 'var(--color-eva-green)',
                  fontSize: '14px',
                }}
            />
          </div>
        </div>

        {posts.length === 0 ? (
          <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-eva-red)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>⚠ SYSTEM ALERT</h2>
            <p style={{ color: 'var(--color-eva-white)', textTransform: 'uppercase', marginBottom: '8px' }}>NO_TRANSMISSIONS_FOUND // SECTOR SILENT</p>
            <p style={{ color: 'var(--color-eva-muted)', fontSize: '14px' }}>The SpilledTea archive is currently empty.</p>
          </div>
        ) : (
          /* Main layout: 70% posts grid | 30% trending sidebar */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
          }}
          className="allposts-layout"
          >
            {/* Posts Grid — responsive 3col desktop, 2col tablet, 1col mobile */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '24px',
                alignItems: 'start',
                width: '100%',
              }}
              className="responsive-grid"
            >
              <style>{`
                @media (min-width: 640px) {
                  .responsive-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                  }
                }
                @media (min-width: 1024px) {
                  .responsive-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                  }
                }
              `}</style>
              {filteredPosts.map((post) => (
                  <motion.div
                      key={post.$id}
                      variants={cardVariants}
                      style={{ height: 'auto', width: '100%', flexGrow: 0, alignSelf: 'start' }}
                  >
                      <PostCard {...post} />
                  </motion.div>
              ))}
              {filteredPosts.length === 0 && searchQuery && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '48px 0',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-eva-red)',
                  }}>
                    ⚠ NO MATCHING TRANSMISSIONS
                  </p>
                </div>
              )}
            </motion.div>

            {/* Trending Sidebar — visible on lg+ */}
            <div className="allposts-sidebar">
              <TrendingSidebar posts={posts} />
            </div>
          </div>
        )}

        {/* Newsletter Widget */}
        <NewsletterWidget />
      </Container>
    </div>
  )
}

export default AllPosts