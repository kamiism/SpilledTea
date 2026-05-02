import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, Comments } from "../components";

export default function Post() {
    const [post, setPost] = useState(null);
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

    if (!post) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="skeleton w-full h-72"></div>
                        <div className="skeleton w-2/3 h-8"></div>
                        <div className="skeleton w-full h-4"></div>
                        <div className="skeleton w-full h-4"></div>
                        <div className="skeleton w-3/4 h-4"></div>
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
            {/* Reading Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-[3px] z-[9999] transition-all duration-100"
                style={{
                    width: `${scrollProgress}%`,
                    background: 'linear-gradient(90deg, var(--color-eva-green), var(--color-eva-orange))'
                }}
            />

            <div className={`py-10 animate-fade-in transition-all duration-500 ${focusMode ? 'opacity-100 bg-[var(--color-eva-black)] min-h-screen z-50 absolute inset-0' : ''}`}>
                {/* When focus mode is active, hide everything else. By absolute positioning this div over the rest */}
                
                <Container>
                    <div className={`max-w-4xl mx-auto ${focusMode ? 'mt-20' : ''}`}>
                        {/* Hero Image */}
                        <div className="w-full mb-12 relative overflow-hidden border border-[var(--color-eva-border)]">
                            <div className="corner-brackets absolute inset-0 z-20 pointer-events-none"></div>
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full max-h-[500px] object-cover"
                            />
                            {/* Category tag */}
                            <div className="absolute top-4 left-4 z-10 bg-[rgba(10,10,15,0.8)] border border-[var(--color-eva-orange)] px-3 py-1 font-mono text-[var(--color-eva-orange)] text-xs uppercase tracking-widest shadow-[0_0_12px_rgba(255,102,0,0.3)]">
                                VIEWS: {post.views || 0} // TRANSMISSION_ARCHIVE
                            </div>
                            
                            {/* Dark gradient fade for aesthetics */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-eva-black)] via-[rgba(10,10,15,0.3)] to-transparent pointer-events-none"></div>

                            <div className="absolute right-4 bottom-4 flex gap-4 z-30">
                                {isAuthor && !focusMode && (
                                    <>
                                        <Link to={`/edit-post/${post.$id}`}>
                                            <button className="btn-nerv bg-[rgba(0,0,0,0.6)]">
                                                EDIT_DATA
                                            </button>
                                        </Link>
                                        <button className="btn-nerv bg-[rgba(0,0,0,0.6)] border-[var(--color-eva-red)] text-[var(--color-eva-red)] hover:bg-[var(--color-eva-red)] hover:text-white" onClick={deletePost}>
                                            PURGE
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={handleLike}
                                    className={`btn-nerv ${isLiked ? 'bg-[var(--color-eva-red)] text-white border-[var(--color-eva-red)]' : 'bg-[rgba(0,0,0,0.6)]'}`}
                                >
                                    {isLiked ? '♥ LIKED' : '♡ LIKE'} [{localLikes.length}]
                                </button>
                            </div>
                        </div>

                        {/* Article Header */}
                        <div className="mb-12 border-b border-[var(--color-eva-border)] pb-8">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-[var(--color-eva-white)] tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                                <span className="text-[var(--color-eva-green)] mr-4">&gt;</span>
                                {post.title}
                            </h1>
                            <div className="flex items-center text-[var(--color-eva-green)] font-mono text-sm uppercase tracking-widest">
                                <span>PILOT-{post.authorName || 'UNKNOWN'}</span>
                                <span className="mx-3 opacity-50">//</span>
                                <span>TRANSMITTED: {formattedDate}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose-spilled pb-20">
                            {parse(post.content)}
                        </div>

                        {/* Comments Section placeholder */}
                        <div className="mt-20 border-t border-[var(--color-eva-border)] pt-10">
                            <h2 className="font-heading text-2xl text-[var(--color-eva-orange)] mb-10 tracking-widest uppercase">&gt; COMLINK_TRANSCRIPTS</h2>
                            {/* We will insert Comments component here */}
                            <Comments postId={post.$id} />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Focus Mode Toggle */}
            <button 
                onClick={() => setFocusMode(!focusMode)}
                className="fixed bottom-8 right-8 z-[10000] font-mono text-xs tracking-widest px-4 py-2 border border-[var(--color-eva-border)] bg-[rgba(10,10,15,0.8)] text-[var(--color-eva-muted)] hover:text-[var(--color-eva-white)] hover:border-[var(--color-eva-white)] transition-all"
            >
                {focusMode ? '[▣ EXIT FOCUS]' : '[⊞ FOCUS]'}
            </button>
        </>
    );
}