import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Container, PostCard } from '../components';
import SkeletonCard from '../components/SkeletonCard';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function AuthorProfile() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayName = username?.replace('@', '');
  const initial = displayName?.charAt(0).toUpperCase();

  useEffect(() => {
    appwriteService.getPosts([]).then((res) => {
      const all = res?.rows ?? [];
      const authorPosts = all.filter(
        p => p.authorName?.toLowerCase() === displayName?.toLowerCase()
      );
      authorPosts.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      setPosts(authorPosts);
    }).catch(() => setPosts([]))
    .finally(() => setLoading(false));
  }, [displayName]);

  if (loading) {
    return (
      <div className="w-full py-12">
        <Container>
          <div className="skeleton-shimmer w-full h-48 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full pt-12 pb-16 min-h-[80vh]">
      <Container>
        {/* Author Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'var(--color-eva-panel)',
            border: '1px solid var(--color-eva-border)',
            padding: '40px',
            marginBottom: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="corner-brackets absolute inset-0 pointer-events-none" />

          {/* Header label */}
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-eva-green)',
            marginBottom: '24px',
            opacity: 0.8,
          }}>
            &gt; UNIT_PROFILE // CLASSIFIED_DOSSIER
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(135deg, #4e8ca0, #6b5a8a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '32px',
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
                fontSize: '28px',
                color: 'var(--color-eva-white)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '6px',
              }}>
                {displayName}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--color-eva-muted)',
                marginBottom: '12px',
              }}>
                Classified personnel with active transmission clearance.
              </div>
              <div style={{
                display: 'flex',
                gap: '24px',
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                <span style={{ color: 'var(--color-eva-orange)' }}>
                  TRANSMISSIONS: {posts.length}
                </span>
                <span style={{ color: 'var(--color-eva-green)' }}>
                  PILOT_ACTIVE
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-eva-orange)',
          }}>
            &gt; ALL TRANSMISSIONS BY @{displayName?.toUpperCase()}
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-eva-orange)', opacity: 0.2 }} />
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 0',
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-eva-muted)',
          }}>
            NO TRANSMISSIONS FOUND FOR THIS UNIT
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {posts.map(post => (
              <motion.div key={post.$id} variants={cardVariants} style={{ height: '100%' }}>
                <PostCard {...post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </div>
  );
}