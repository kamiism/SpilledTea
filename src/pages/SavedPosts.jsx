import { motion } from 'framer-motion';
import { Bookmark } from 'iconsax-react';
import { useEffect, useState } from 'react';
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

export default function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all bookmarked post IDs from localStorage
    const bookmarkedIds = Object.keys(localStorage)
      .filter(key => key.startsWith('bookmark-') && localStorage.getItem(key) === 'true')
      .map(key => key.replace('bookmark-', ''));

    if (bookmarkedIds.length === 0) {
      setLoading(false);
      return;
    }

    appwriteService.getPosts([]).then((res) => {
      const all = res?.rows ?? [];
      const saved = all.filter(p => bookmarkedIds.includes(p.$id));
      saved.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      setSavedPosts(saved);
    }).catch(() => setSavedPosts([]))
    .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12">
        <Container>
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '40px',
            paddingBottom: '24px',
            borderBottom: '1px solid var(--color-eva-border)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-eva-green)',
            marginBottom: '8px',
            opacity: 0.7,
          }}>
            &gt; PERSONAL_ARCHIVE // SAVED_TRANSMISSIONS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bookmark size={24} color="var(--color-eva-orange)" variant="Bold" />
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '32px',
              color: 'var(--color-eva-white)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              SAVED POSTS
            </h1>
          </div>
          <div style={{
            marginTop: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--color-eva-muted)',
          }}>
            {savedPosts.length} transmission{savedPosts.length !== 1 ? 's' : ''} saved to your local archive
          </div>
        </motion.div>

        {/* Posts Grid */}
        {savedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '80px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Bookmark size={48} color="var(--color-eva-muted)" style={{ opacity: 0.3 }} />
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-eva-muted)',
            }}>
              NO SAVED TRANSMISSIONS
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-eva-muted)',
              opacity: 0.6,
            }}>
              Bookmark posts by clicking the bookmark icon on any card
            </div>
          </motion.div>
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
            {savedPosts.map(post => (
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