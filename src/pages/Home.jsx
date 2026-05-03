import { motion } from 'framer-motion';
import { Activity, Clock, DocumentText, Eye, Profile2User, Radio } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import AnimatedCounter from '../components/AnimatedCounter';
import SkeletonCard from '../components/SkeletonCard';

/* ── Hero Background (unchanged from original) ── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <div className="absolute inset-0 hex-grid opacity-30"></div>
      <div className="absolute top-10 left-10 font-mono text-[8px] text-eva-cyan opacity-40 animate-pulse">
        MAGI_01: MELCHIOR // STATUS: ACTIVE<br/>
        PRIORITY_LEVEL: 01 // ARCHIVE_SCAN: RUNNING
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-[8px] text-eva-purple opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>
        MAGI_02: BALTHASAR // STATUS: STANDBY<br/>
        ENCRYPTION: LEVEL_5 // SECURE_LINK: ENABLED
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-eva-cyan/5 to-transparent h-1/2 animate-[vertical-scan_10s_linear_infinite]"></div>
    </div>
  );
}

/* ── Letter-by-letter reveal using motion.span ── */
function LetterReveal({ text, className, delay = 0 }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.04, duration: 0.3 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Typewriter for subtitle ── */
function TypewriterText({ text, delay = 40, className }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);
  return <span className={className}>{displayed}<span className="nav-cursor">▮</span></span>;
}

/* ── Stats Ticker ── */
function StatsTicker({ totalPosts, totalAuthors }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: 'var(--font-heading)',
      textTransform: 'uppercase',
    }}>
      <div style={{
        fontSize: '10px',
        letterSpacing: '0.3em',
        color: 'var(--color-eva-green)',
        opacity: 0.7,
      }}>
        &gt; LIVE_SYSTEM_STATUS
      </div>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-eva-muted)' }}>
            POSTS
          </span>
          <span style={{ fontSize: '28px', color: 'var(--color-eva-cyan)', textShadow: '0 0 15px rgba(0,212,255,0.5)', lineHeight: 1 }}>
            <AnimatedCounter target={totalPosts} />
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'var(--color-eva-muted)' }}>
            WRITERS
          </span>
          <span style={{ fontSize: '28px', color: 'var(--color-eva-purple)', textShadow: '0 0 15px rgba(123,47,255,0.5)', lineHeight: 1 }}>
            <AnimatedCounter target={totalAuthors} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Featured Latest Transmission Card ── */
function LatestTransmission({ post }) {
  if (!post) return null;

  const formattedDate = post.$createdAt
    ? new Date(post.$createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.')
    : '';

  const readTime = () => {
    if (!post.content) return '2 min';
    const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{ marginBottom: '48px' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <Radio size={14} color="var(--color-eva-red)" className="animate-pulse" />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '14px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-eva-orange)',
        }}>
          LATEST TRANSMISSION
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-eva-orange)', opacity: 0.3 }} />
      </div>

      <Link to={`/post/${post.$id}`} style={{ textDecoration: 'none' }}>
        <motion.div
          whileHover={{ scale: 1.005 }}
          style={{
            background: 'var(--color-eva-panel)',
            border: '1px solid var(--color-eva-border)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'border-color 0.3s',
          }}
          className="group hover:border-eva-cyan"
        >
          <div className="featured-card-grid">
            {/* Image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '240px' }} className="col-span-1">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s',
                }}
                className="group-hover:scale-105"
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, transparent 50%, var(--color-eva-panel) 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Content */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }} className="col-span-1">
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                {post.category && (
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-eva-cyan)',
                    border: '1px solid var(--color-eva-cyan)',
                    padding: '2px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <DocumentText size={10} color="currentColor" /> {post.category}
                  </span>
                )}
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-eva-purple)',
                  border: '1px solid var(--color-eva-purple)',
                  padding: '2px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={10} color="currentColor" /> {readTime()}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(20px, 3vw, 32px)',
                color: 'var(--color-eva-white)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.2,
                marginBottom: '12px',
                transition: 'color 0.3s',
              }}
              className="group-hover:text-eva-cyan"
              >
                {post.title}
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontFamily: 'var(--font-heading)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-eva-muted)',
              }}>
                <span style={{ color: 'var(--color-eva-orange)' }}>
                  @{post.authorName?.toLowerCase() || 'unknown'}
                </span>
                <span style={{ opacity: 0.4 }}>//</span>
                <span>{formattedDate}</span>
                <span style={{ opacity: 0.4 }}>//</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={10} color="currentColor" /> {post.views || 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ── Stats Bar ── */
function StatsBar({ totalPosts, totalReaders, newestAuthor }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0',
        marginBottom: '32px',
        borderTop: '1px solid rgba(0,212,255,0.15)',
        borderBottom: '1px solid rgba(0,212,255,0.15)',
        background: 'var(--color-eva-panel)',
      }}
    >
      {[
        { label: 'Posts', value: totalPosts, icon: DocumentText, color: 'var(--color-eva-cyan)' },
        { label: 'Readers', value: totalReaders, icon: Profile2User, color: 'var(--color-eva-green)' },
        { label: 'Latest', value: newestAuthor, icon: Activity, color: 'var(--color-eva-orange)', isText: true },
      ].map((item, i) => (
        <div key={i} style={{
          flex: '1 1 200px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRight: i < 2 ? '1px solid var(--color-eva-border)' : 'none',
          fontFamily: 'var(--font-heading)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          <item.icon size={14} color={item.color} style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--color-eva-muted)' }}>{item.label}:</span>
          <span style={{ color: item.color, fontWeight: 700 }}>
            {item.isText ? item.value : <AnimatedCounter target={item.value} />}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ── Hot Transmissions (unchanged from original) ── */
function HotTransmissions({ posts }) {
    return (
        <div className="w-full mb-16 overflow-hidden">
            <div className="container-strict px-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-eva-purple opacity-30 shadow-[0_0_8px_eva-purple]"></div>
                    <h2 className="font-heading text-xl md:text-2xl text-eva-purple purple-glow tracking-[0.2em]">
                        HOT_TRANSMISSIONS
                    </h2>
                    <div className="h-px flex-1 bg-eva-purple opacity-30 shadow-[0_0_8px_eva-purple]"></div>
                </div>
                
                <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x scroll-smooth">
                    {posts.map((post) => (
                        <div key={post.$id} className="min-w-70 md:min-w-85 snap-start">
                            <PostCard {...post} featured={true} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Main Home Component ── */
function Home() {
    const [posts, setPosts] = useState([])
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        appwriteService.getPosts()
            .then((response) => {
                const fetchedPosts = response?.rows ?? [];
                // Sort newest first
                fetchedPosts.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
                setAllPosts(fetchedPosts);
                if (authStatus && userData) {
                    setPosts(fetchedPosts.filter(post => post.userId === userData.$id));
                }
            })
            .catch(() => {
                setError(true)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [authStatus, userData])

    // Compute stats
    const uniqueAuthors = [...new Set(allPosts.map(p => p.authorName).filter(Boolean))];
    const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
    const newestAuthor = allPosts.length > 0 ? (allPosts[0].authorName || 'UNKNOWN').toUpperCase() : 'N/A';
  
    if (loading) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="text-center mb-12">
                        <div className="text-eva-cyan font-heading uppercase text-2xl animate-pulse terminal-glow">
                            &gt; SYNCHRONIZING_ARCHIVE_DATA...
                        </div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                    </div>
                </Container>
            </div>
        )
    }

    /* ──── UNAUTHENTICATED VIEW ──── */
    if (!authStatus) {
        return (
            <div className="w-full flex-1 flex flex-col bg-eva-black py-0 relative overflow-hidden">
                {/* Compact Hero Section */}
                <div className="relative w-full pt-12 pb-10 md:pt-12 md:pb-10 border-b border-eva-cyan/20">
                    <HeroBackground />
                    <Container>
                        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                            <div className="text-eva-cyan font-mono text-xs md:text-sm mb-6 uppercase tracking-[0.5em] terminal-glow">
                                &gt; NERV // CLASSIFIED_ARCHIVE_SYSTEM
                            </div>
                            <h1 className="text-5xl md:text-8xl mb-4 text-eva-white accent-glow font-heading leading-tight">
                                <LetterReveal text="SPILLEDTEA" />
                            </h1>
                            <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-eva-muted font-body leading-relaxed">
                                <TypewriterText
                                  text="Secure communication protocol for NERV personnel."
                                  delay={30}
                                />
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Link to="/login" className="btn-nerv text-lg px-12 py-5 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                                    JACK_IN_PROTOCOL →
                                  </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                  <Link to="/signup" className="btn-nerv text-lg px-12 py-5 border-eva-purple text-eva-purple hover:bg-eva-purple hover:text-eva-white hover:shadow-[0_0_20px_rgba(123,47,255,0.4)]">
                                    REGISTER_UNIT
                                  </Link>
                                </motion.div>
                            </div>
                        </div>
                    </Container>
                </div>

                {/* Hot Transmissions Section */}
                {allPosts.length > 0 && <HotTransmissions posts={allPosts.slice(0, 5)} />}
            </div>
        )
    }

    /* ──── AUTHENTICATED VIEW ──── */
    return (
        <div className='w-full'>
            {/* Compact 2-Column Hero */}
            <div className="relative w-full pt-12 pb-10 md:pt-12 md:pb-10 bg-eva-navy border-b border-eva-cyan/20 overflow-hidden mb-0">
                <HeroBackground />
                <Container>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2">
                        {/* Left: Title + Typewriter */}
                        <div>
                            <div className="text-eva-cyan font-mono text-xs mb-2 uppercase tracking-widest terminal-glow">
                                &gt; SYSTEM_ONLINE // USER_RECOGNIZED
                            </div>
                            <h1 className="text-2xl md:text-4xl text-eva-white mb-2 accent-glow" style={{ fontFamily: 'var(--font-heading)' }}>
                                YOUR ARCHIVE
                            </h1>
                            <p className="text-eva-muted text-xs md:text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                                <TypewriterText
                                  text="Classified log of your transmissions to the MAGI system."
                                  delay={25}
                                />
                            </p>
                        </div>

                        {/* Right: Live Stats Ticker */}
                        <StatsTicker
                          totalPosts={allPosts.length}
                          totalAuthors={uniqueAuthors.length}
                        />
                    </div>
                </Container>
            </div>

            <Container>
                {/* Stats Bar */}
                <div style={{ marginTop: '24px' }}>
                  <StatsBar
                    totalPosts={allPosts.length}
                    totalReaders={totalViews}
                    newestAuthor={newestAuthor}
                  />
                </div>

                {/* Latest Transmission Featured Card */}
                {allPosts.length > 0 && (
                  <LatestTransmission post={allPosts[0]} />
                )}

                {/* User's Posts Grid */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--color-eva-orange)',
                    }}>
                      &gt; Your Spills
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/add-post" className="btn-nerv py-2 px-6 text-xs">
                        NEW_TRANSMISSION →
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {posts.length === 0 ? (
                    <div className="empty-state max-w-lg mx-auto mt-6 mb-20">
                        <h2 className="text-eva-red mb-2">⚠ SYSTEM ALERT</h2>
                        <p className="mb-6">NO_TRANSMISSIONS_FOUND // SECTOR SILENT</p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Link to="/add-post" className="btn-nerv">
                            INITIATE FIRST UPLOAD
                          </Link>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}
                    >
                        {posts.map((post) => (
                            <motion.div
                                key={post.$id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                                style={{ height: 'auto', alignSelf: 'start' }}
                            >
                                <PostCard {...post} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </Container>
        </div>
    )
}

export default Home