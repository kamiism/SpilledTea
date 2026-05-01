import { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        appwriteService.getPosts()
            .then((response) => {
                setPosts(response?.rows ?? [])
            })
            .catch(() => {
                setError(true)
                setPosts([])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
  
    // Loading — shimmer skeletons
    if (loading) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-surface p-4" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="skeleton w-full h-56 mb-4 rounded-lg"></div>
                                <div className="skeleton w-3/4 h-6 mb-3 rounded"></div>
                                <div className="skeleton w-1/2 h-4 rounded"></div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="w-full py-24">
                <Container>
                    <div className="empty-state empty-state-border mx-auto max-w-lg glass-surface">
                        <div className="empty-state-icon text-4xl">⚠️</div>
                        <p className="empty-state-text text-xl">Connection lost</p>
                        <p className="empty-state-subtext mt-2">We couldn't reach the SpilledTea servers. Please try refreshing.</p>
                    </div>
                </Container>
            </div>
        )
    }

    // Hero Section (Empty / Logged out)
    if (posts.length === 0) {
        return (
            <div className="w-full py-24 md:py-32 flex-1 flex flex-col justify-center">
                <Container>
                    <div className="flex flex-col items-center justify-center text-center px-4 animate-fade-in max-w-3xl mx-auto">
                        <div 
                            className="relative mb-10"
                            style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(73,17,28,0.4) 0%, rgba(94,80,63,0.1) 70%, transparent 80%)',
                            }}
                        >
                            <div 
                                className="absolute inset-0 flex items-center justify-center text-6xl"
                                style={{ filter: 'drop-shadow(0 0 24px rgba(73,17,28,0.5))' }}
                            >
                                ☕
                            </div>
                        </div>
                        <h1 className="hero-title mb-6">
                            Let's Spill The Teas
                        </h1>
                        <p className="text-lg md:text-xl max-w-xl mb-12" style={{ color: 'var(--color-ivory-muted)' }}>
                            A premium space to discover stories, share your thoughts, and engage in meaningful conversations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                            <Link 
                                to="/login"
                                className="px-10 py-4 text-sm font-semibold uppercase tracking-widest rounded-lg tea-ripple transition-material elevation-2 flex-1 sm:flex-none text-center"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    background: 'var(--color-burgundy)',
                                    color: 'var(--color-ivory)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.boxShadow = 'var(--shadow-glow-burgundy)'
                                    e.target.style.transform = 'translateY(-2px)'
                                    e.target.style.background = 'var(--color-burgundy-light)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.boxShadow = 'var(--shadow-elevation-2)'
                                    e.target.style.transform = 'translateY(0)'
                                    e.target.style.background = 'var(--color-burgundy)'
                                }}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup"
                                className="px-10 py-4 text-sm font-semibold uppercase tracking-widest rounded-lg transition-material flex-1 sm:flex-none text-center"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    background: 'var(--color-glass)',
                                    color: 'var(--color-taupe)',
                                    border: '2px solid var(--color-umber)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = 'var(--color-taupe)'
                                    e.target.style.transform = 'translateY(-2px)'
                                    e.target.style.background = 'var(--color-glass-heavy)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'var(--color-umber)'
                                    e.target.style.transform = 'translateY(0)'
                                    e.target.style.background = 'var(--color-glass)'
                                }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    const isFewPosts = posts.length <= 2;

    return (
        <div className='w-full py-12 md:py-16'>
            <Container>
                <div className="mb-10 flex items-center justify-between animate-fade-in">
                    <div>
                        <h2 className="mb-2">Latest Spills</h2>
                        <div className="w-16 h-[3px]" style={{ background: 'var(--color-burgundy)' }}></div>
                    </div>
                </div>

                {isFewPosts ? (
                    // FEATURED LAYOUT (for 1-2 posts)
                    <div className="flex flex-col gap-8">
                        {posts.map((post, index) => (
                            <Link 
                                key={post.$id} 
                                to={`/post/${post.$id}`}
                                className="group block w-full glass-surface elevation-1 transition-material overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-elevation-3)'
                                    e.currentTarget.style.borderColor = 'var(--color-glass-border-strong)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-elevation-1)'
                                    e.currentTarget.style.borderColor = 'var(--color-glass-border)'
                                }}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:min-h-[300px] relative overflow-hidden">
                                        <img 
                                            src={appwriteService.getFilePreview(post.featuredImage)} 
                                            alt={post.title} 
                                            className='w-full h-full object-cover transition-material duration-700 group-hover:scale-105'
                                        />
                                        <div 
                                            className='absolute inset-0 transition-material opacity-0 group-hover:opacity-100'
                                            style={{
                                                background: 'linear-gradient(to right, rgba(73, 17, 28, 0.4) 0%, transparent 100%)',
                                                pointerEvents: 'none',
                                            }}
                                        ></div>
                                    </div>
                                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                        <h3 className="text-2xl md:text-3xl mb-6 line-clamp-3 transition-material text-[var(--color-ivory)]">
                                            {post.title}
                                        </h3>
                                        <div className="mt-auto flex items-center">
                                            <span 
                                                className="text-sm uppercase tracking-widest font-semibold transition-material opacity-80 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2"
                                                style={{ color: 'var(--color-taupe)' }}
                                            >
                                                Read Article →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    // GRID LAYOUT (for 3+ posts)
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
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