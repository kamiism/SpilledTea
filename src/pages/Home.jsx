import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';

function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      {/* Hexagonal/Grid Overlay */}
      <div className="absolute inset-0 hex-grid opacity-30"></div>
      
      {/* MAGI Readouts (Faint floating text) */}
      <div className="absolute top-10 left-10 font-mono text-[8px] text-eva-cyan opacity-40 animate-pulse">
        MAGI_01: MELCHIOR // STATUS: ACTIVE<br/>
        PRIORITY_LEVEL: 01 // ARCHIVE_SCAN: RUNNING
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-[8px] text-eva-purple opacity-40 animate-pulse" style={{ animationDelay: '1s' }}>
        MAGI_02: BALTHASAR // STATUS: STANDBY<br/>
        ENCRYPTION: LEVEL_5 // SECURE_LINK: ENABLED
      </div>

      {/* Floating particles/Scanlines */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-eva-cyan/5 to-transparent h-1/2 animate-[vertical-scan_10s_linear_infinite]"></div>
    </div>
  );
}

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
  return <span className={className}>{displayed}</span>;
}

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
  
    if (loading) {
        return (
            <div className="w-full py-24 min-h-[60vh] flex flex-col justify-center bg-eva-black">
                <Container>
                    <div className="text-center mb-12">
                        <div className="text-eva-cyan font-heading uppercase text-2xl animate-pulse terminal-glow">
                            &gt; SYNCHRONIZING_ARCHIVE_DATA...
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (!authStatus) {
        return (
            <div className="w-full flex-1 flex flex-col bg-eva-black py-0 relative overflow-hidden">
                {/* Hero Section */}
                <div className="relative w-full py-32 md:py-48 border-b border-eva-cyan/20">
                    <HeroBackground />
                    <Container>
                        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                            <div className="text-eva-cyan font-mono text-xs md:text-sm mb-6 uppercase tracking-[0.5em] terminal-glow">
                                &gt; NERV // CLASSIFIED_ARCHIVE_SYSTEM
                            </div>
                            <h1 className="text-5xl md:text-8xl mb-8 text-eva-white accent-glow font-heading leading-tight">
                                <TypewriterText text="SPILLEDTEA SYSTEM" delay={60} />
                            </h1>
                            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-eva-muted font-body leading-relaxed">
                                Secure communication protocol for NERV personnel. Access the global grid to share categorized briefings, technical readouts, and tactical observations.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link to="/login" className="btn-nerv text-lg px-12 py-5 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                                    JACK_IN_PROTOCOL →
                                </Link>
                                <Link to="/signup" className="btn-nerv text-lg px-12 py-5 border-eva-purple text-eva-purple hover:bg-eva-purple hover:text-eva-white hover:shadow-[0_0_20px_rgba(123,47,255,0.4)]">
                                    REGISTER_UNIT
                                </Link>
                            </div>
                        </div>
                    </Container>
                </div>

                {/* Hot Transmissions Section */}
                {allPosts.length > 0 && <HotTransmissions posts={allPosts.slice(0, 5)} />}
            </div>
        )
    }

    return (
        <div className='w-full'>
            {/* Authenticated Hero Section */}
            <div className="relative w-full py-12 md:py-16 bg-eva-navy flex items-center justify-center border-b border-eva-cyan/20 overflow-hidden mb-12">
                <HeroBackground />
                <div className="corner-brackets absolute inset-4 md:inset-6"></div>
                <div className="relative z-10 text-center px-4">
                    <div className="text-eva-cyan font-mono text-xs mb-2 uppercase tracking-widest terminal-glow">
                        &gt; SYSTEM_ONLINE // USER_RECOGNIZED
                    </div>
                    <h1 className="text-3xl md:text-5xl text-eva-white mb-4 accent-glow">
                        <TypewriterText text="YOUR ARCHIVE" delay={40} />
                    </h1>
                    <p className="text-eva-muted mb-6 max-w-lg mx-auto text-xs md:text-sm">
                        Classified log of your previous transmissions to the MAGI system.
                    </p>
                    <Link to="/add-post" className="btn-nerv py-2 px-6 text-sm">
                        NEW_TRANSMISSION →
                    </Link>
                </div>
            </div>

            <Container>
                {posts.length === 0 ? (
                    <div className="empty-state max-w-lg mx-auto mt-10">
                        <h2 className="text-eva-red mb-2">⚠ SYSTEM ALERT</h2>
                        <p className="mb-6">NO_TRANSMISSIONS_FOUND // SECTOR SILENT</p>
                        <Link to="/add-post" className="btn-nerv">
                            INITIATE FIRST UPLOAD
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20'>
                        {posts.map((post, index) => (
                            <div 
                                key={post.$id} 
                                className="animate-slide-up h-full"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home