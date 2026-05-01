import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';

function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'; // Eva green tint

      particles.forEach(p => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
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

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (!authStatus || !userData) {
            setPosts([])
            setLoading(false)
            return
        }

        appwriteService.getPosts()
            .then((response) => {
                const userPosts = (response?.rows ?? []).filter(post => post.userId === userData.$id)
                setPosts(userPosts)
            })
            .catch(() => {
                setError(true)
                setPosts([])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [authStatus, userData])
  
    if (loading) {
        return (
            <div className="w-full py-12 min-h-[60vh] flex flex-col justify-center">
                <Container>
                    <div className="text-center mb-8">
                        <div className="text-[var(--color-eva-orange)] font-heading uppercase text-xl animate-pulse">
                            &gt; SYNCHRONIZING_DATA...
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 border border-[var(--color-eva-border)] bg-[var(--color-eva-panel)]" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="skeleton w-full h-40 mb-4"></div>
                                <div className="skeleton w-3/4 h-5 mb-3"></div>
                                <div className="skeleton w-1/2 h-3"></div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full py-24">
                <Container>
                    <div className="empty-state max-w-lg mx-auto">
                        <h2 className="text-[var(--color-eva-red)] mb-2">⚠ SYSTEM ALERT</h2>
                        <p className="mb-6">CONNECTION_LOST // SECTOR UNREACHABLE</p>
                        <button onClick={() => window.location.reload()} className="btn-nerv border-[var(--color-eva-red)] text-[var(--color-eva-red)] hover:bg-[var(--color-eva-red)] hover:text-white hover:shadow-none">
                            RE-ESTABLISH CONNECTION
                        </button>
                    </div>
                </Container>
            </div>
        )
    }

    if (!authStatus) {
        return (
            <div className="w-full flex-1 flex flex-col justify-center bg-[var(--color-eva-black)] py-20 relative">
                <HeroParticles />
                <Container>
                    <div className="corner-brackets relative z-10 max-w-4xl mx-auto p-12 bg-[rgba(13,17,23,0.8)] border border-[var(--color-eva-border)] backdrop-blur-sm text-center">
                        <div className="text-[var(--color-eva-green)] font-mono text-sm mb-4 uppercase tracking-widest">
                            &gt; INCOMING_TRANSMISSION // SECTOR-07
                        </div>
                        <h1 className="text-5xl md:text-7xl mb-6 text-[var(--color-eva-orange)] accent-glow tracking-tighter uppercase" style={{ fontFamily: 'var(--font-heading)'}}>
                            <TypewriterText text="SPILL WHAT'S ON YOUR MIND." delay={50} />
                        </h1>
                        <p className="text-lg mb-10 max-w-2xl mx-auto opacity-80" style={{ fontFamily: 'var(--font-body)'}}>
                            Access the global communication network. Share categorized briefings, technical readouts, and cultural observations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link to="/login" className="btn-nerv text-lg px-8 py-4">
                                JACK IN →
                            </Link>
                            <Link to="/signup" className="btn-nerv text-lg px-8 py-4 border-[var(--color-eva-green)] text-[var(--color-eva-green)] hover:bg-[var(--color-eva-green)] hover:text-[var(--color-eva-black)] hover:shadow-[0_0_16px_rgba(0,255,65,0.4)]">
                                REGISTER_UNIT
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full'>
            {/* Authenticated Hero Section */}
            <div className="relative w-full min-h-[340px] bg-[var(--color-eva-navy)] flex items-center justify-center border-b border-[var(--color-eva-orange)] overflow-hidden mb-12">
                <HeroParticles />
                <div className="corner-brackets absolute inset-4 md:inset-8"></div>
                <div className="relative z-10 text-center px-4">
                    <div className="text-[var(--color-eva-green)] font-mono text-xs md:text-sm mb-3 uppercase tracking-widest">
                        &gt; SYSTEM_ONLINE // USER_RECOGNIZED
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-[var(--color-eva-orange)] mb-6 accent-glow">
                        <TypewriterText text="YOUR SPILLS" delay={40} />
                    </h1>
                    <p className="text-[var(--color-eva-white)] opacity-70 mb-8 max-w-lg mx-auto text-sm md:text-base">
                        Archive log of your previous transmissions to the MAGI system.
                    </p>
                    <Link to="/add-post" className="btn-nerv bg-[rgba(255,102,0,0.1)]">
                        NEW TRANSMISSION →
                    </Link>
                </div>
            </div>

            <Container>
                {posts.length === 0 ? (
                    <div className="empty-state max-w-lg mx-auto mt-10">
                        <h2 className="text-[var(--color-eva-red)] mb-2">⚠ SYSTEM ALERT</h2>
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