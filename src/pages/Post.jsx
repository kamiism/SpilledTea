import { motion } from 'framer-motion';
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Comments, Container } from "../components";
import AuthorProfileCard from "../components/AuthorProfileCard";
import BackToTop from "../components/BackToTop";
import ReactionSystem from "../components/ReactionSystem";
import TableOfContents from "../components/TableOfContents";

export default function Post() {
    const [post, setPost] = useState(null);
    const [authorPostCount, setAuthorPostCount] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [focusMode, setFocusMode] = useState(false);
    const [localLikes, setLocalLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLocalLikes(post.likes || []);
                    // Fetch author's post count
                    appwriteService.getPosts([]).then(res => {
                        const authorPosts = (res?.rows ?? []).filter(p => p.authorName === post.authorName);
                        setAuthorPostCount(authorPosts.length);
                    }).catch(() => {});
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    useEffect(() => {
        if (userData?.$id && localLikes.length >= 0) {
            setIsLiked(localLikes.includes(userData.$id));
        }
    }, [userData?.$id, localLikes]);

    const handleLike = async () => {
        if (!userData) {
            alert("Please login to like posts");
            return;
        }

        try {
            const response = await appwriteService.toggleLikePost(post.$id, userData.$id, localLikes);
            if (response) {
                setLocalLikes(response.likes);
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && focusMode) setFocusMode(false);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [focusMode]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    // Reading time estimate
    const getReadTime = () => {
        if (!post?.content) return '2 min';
        const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        return `${Math.max(1, Math.ceil(words / 200))} min read`;
    };

    if (!post) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="skeleton-shimmer w-full h-72"></div>
                        <div className="skeleton-shimmer w-2/3 h-8"></div>
                        <div className="skeleton-shimmer w-full h-4"></div>
                        <div className="skeleton-shimmer w-full h-4"></div>
                        <div className="skeleton-shimmer w-3/4 h-4"></div>
                    </div>
                </Container>
            </div>
        );
    }

    const formattedDate = post.$createdAt ? new Date(post.$createdAt).toLocaleDateString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric'
    }).replace(/\//g, '.') : '';

    return (
        <>
            {/* Reading Progress Bar — thin cyan line at top */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '3px',
                    zIndex: 99999,
                    width: `${scrollProgress}%`,
                    background: 'linear-gradient(90deg, #4e8ca0, #6b5a8a)',
                    boxShadow: 'none',
                    transition: 'width 0.1s linear',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`py-10 transition-all duration-500 ${focusMode ? 'opacity-100 bg-eva-black min-h-screen z-50 absolute inset-0' : ''}`}
            >
                <Container>
                    <div className={`max-w-6xl mx-auto ${focusMode ? 'mt-20' : ''}`}>
                        {/* Hero Image */}
                        <div className="w-full mb-12 relative overflow-hidden border border-eva-border">
                            <div className="corner-brackets absolute inset-0 z-20 pointer-events-none"></div>
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full max-h-125 object-cover"
                            />
                            {/* Category tag */}
                            {post.category && (
                                <div className="absolute top-4 left-4 z-10 bg-[rgba(10,10,15,0.8)] border border-[rgba(78,140,160,0.5)] px-3 py-1 font-mono text-xs uppercase tracking-widest" style={{ color: '#8ab4c4' }}>
                                    {post.category}
                                </div>
                            )}
                            
                            {/* Dark gradient fade for aesthetics */}
                            <div className="absolute inset-0 bg-linear-to-t from-eva-black via-[rgba(10,10,15,0.3)] to-transparent pointer-events-none"></div>

                            <div className="absolute right-4 bottom-4 flex gap-4 z-30">
                                {isAuthor && !focusMode && (
                                    <>
                                        <Link to={`/edit-post/${post.$id}`}>
                                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-nerv bg-[rgba(0,0,0,0.6)]">
                                                EDIT_DATA
                                            </motion.button>
                                        </Link>
                                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="btn-nerv bg-[rgba(0,0,0,0.6)] border-eva-red text-eva-red hover:bg-eva-red hover:text-white" onClick={deletePost}>
                                            PURGE
                                        </motion.button>
                                    </>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleLike}
                                    className={`btn-nerv ${isLiked ? 'bg-eva-red text-white border-eva-red' : 'bg-[rgba(0,0,0,0.6)]'}`}
                                >
                                    {isLiked ? '♥ LIKED' : '♡ LIKE'} [{localLikes.length}]
                                </motion.button>
                            </div>
                        </div>

                        {/* Article Header */}
                        <div className="mb-12 border-b border-eva-border pb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-eva-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                                <span className="text-eva-green mr-4">&gt;</span>
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>
                                <span style={{ color: 'var(--color-eva-green)' }}>PILOT-{post.authorName || 'UNKNOWN'}</span>
                                <span style={{ opacity: 0.3 }}>//</span>
                                <span style={{ color: 'var(--color-eva-muted)' }}>TRANSMITTED: {formattedDate}</span>
                                <span style={{ opacity: 0.3 }}>//</span>
                                <span style={{ color: '#8a7ab5' }}>{getReadTime()}</span>
                                <span style={{ opacity: 0.3 }}>//</span>
                                <span style={{ color: 'var(--color-eva-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    VIEWS: {post.views || 0}
                                </span>
                            </div>
                        </div>

                        {/* Content + TOC Sidebar Layout */}
                        <div className="post-content-layout">
                            {/* Main Content */}
                            <div>
                                <div className="prose-spilled pb-12">
                                    {parse(post.content)}
                                </div>

                                {/* Reaction System */}
                                <div style={{
                                    padding: '20px 0',
                                    borderTop: '1px solid var(--color-eva-border)',
                                    borderBottom: '1px solid var(--color-eva-border)',
                                    marginBottom: '32px',
                                }}>
                                    <ReactionSystem postId={post.$id} />
                                </div>

                                {/* Author Profile Card */}
                                <div style={{ marginBottom: '40px' }}>
                                    <AuthorProfileCard
                                        authorName={post.authorName}
                                        postCount={authorPostCount}
                                    />
                                </div>

                                {/* Comments Section */}
                                <div className="mt-12 border-t border-eva-border pt-10">
                                    <h2 className="font-heading text-2xl text-eva-orange mb-10 tracking-widest uppercase">&gt; COMLINK_TRANSCRIPTS</h2>
                                    <Comments postId={post.$id} />
                                </div>
                            </div>

                            {/* TOC Sidebar */}
                            <div className="post-toc-sidebar">
                                <TableOfContents contentHtml={post.content} />
                            </div>
                        </div>
                    </div>
                </Container>
            </motion.div>

            {/* Back to Top Button */}
            <BackToTop />

            {/* Focus Mode Toggle */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFocusMode(!focusMode)}
                className="fixed bottom-8 right-8 z-10000 font-mono text-xs tracking-widest px-4 py-2 border border-eva-border bg-[rgba(10,10,15,0.8)] text-eva-muted hover:text-eva-white hover:border-eva-white transition-all"
            >
                {focusMode ? '[▣ EXIT FOCUS]' : '[⊞ FOCUS]'}
            </motion.button>
        </>
    );
}