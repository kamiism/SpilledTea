import { motion } from 'framer-motion';
import { Bookmark, Clock, Eye, Heart, Tag } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, $createdAt, authorName, content, likes = [], views = 0, featured = false, category }) {
  const userData = useSelector((state) => state.auth.userData);
  const [localLikes, setLocalLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (userData?.$id) {
      setIsLiked(localLikes.includes(userData.$id));
      // Load bookmark state from localStorage
      const saved = localStorage.getItem(`bookmark-${$id}`);
      setBookmarked(saved === 'true');
    }
  }, [userData?.$id, localLikes, $id]);

  const formattedDate = $createdAt ? new Date($createdAt).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.') : '';

  // Estimate reading time from content
  const getReadTime = () => {
    if (!content) return '2 min';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userData) {
      alert("Please login to like posts");
      return;
    }

    try {
      const response = await appwriteService.toggleLikePost($id, userData.$id, localLikes);
      if (response) {
        setLocalLikes(response.likes);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userData) {
      alert("Please login to bookmark posts");
      return;
    }
    const newState = !bookmarked;
    setBookmarked(newState);
    localStorage.setItem(`bookmark-${$id}`, String(newState));
  };

  return (
    <Link to={`/post/${$id}`} className='block group h-full relative'>
      <motion.div
        className={`h-full flex flex-col transition-all duration-300 bg-eva-panel overflow-hidden relative border ${featured ? 'border-eva-purple shadow-[0_0_15px_rgba(123,47,255,0.2)]' : 'border-[rgba(0,212,255,0.1)]'} hover:border-eva-cyan group-hover:shadow-[0_10px_30px_rgba(0,212,255,0.2)]`}
        style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div className='w-full relative aspect-video overflow-hidden border-b border-eva-border'>
          <img 
            src={appwriteService.getFilePreview(featuredImage)} 
            alt={title} 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
          {/* Cyan Scanline Overlay */}
          <div className='absolute inset-0 bg-eva-cyan/5 pointer-events-none' style={{ mixBlendMode: 'screen' }}></div>
          
          {/* Tags Overlay */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {category && (
              <div className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ backgroundColor: 'rgba(78, 140, 160, 0.2)', color: '#8ab4c4', border: '1px solid rgba(78, 140, 160, 0.3)' }}>
                <Tag size={8} color="currentColor" />
                {category}
              </div>
            )}
            <div className="bg-eva-black/80 border border-eva-purple px-2 py-0.5 text-[9px] text-eva-purple font-mono uppercase tracking-widest purple-glow flex items-center gap-1">
              <Clock size={8} color="currentColor" />
              {getReadTime()} read
            </div>
          </div>



          <div className='absolute inset-0 bg-linear-to-t from-eva-black via-transparent to-transparent pointer-events-none'></div>

          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className={`text-lg text-white leading-tight font-heading group-hover:text-eva-cyan transition-colors`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="bg-black/40 px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider mt-auto font-mono text-eva-cyan/70">
            <div className="flex flex-col gap-0.5 leading-none">
              <Link
              to={`/author/${authorName?.toLowerCase()}`}
              onClick={e => e.stopPropagation()}
              style={{ color: 'var(--color-eva-cyan)', textDecoration: 'none' }}
              >
                @{authorName?.toLowerCase() || 'unknown'}
              </Link>
              <span className="opacity-50 text-[9px]">{formattedDate}</span>
            </div>
            
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-[rgba(255,255,255,0.06)] rounded-sm px-2 py-1 text-[#00d4ff]">
                <Eye size={18} color="#00d4ff" />
                <span className="text-[12px]">{views}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-1 bg-[rgba(255,255,255,0.06)] rounded-sm px-2 py-1 transition-colors ${isLiked ? 'text-[#ff4466]' : 'text-eva-muted hover:text-[#ff4466]'}`}
              >
                <Heart size={18} variant={isLiked ? 'Bold' : 'Linear'} color="#ff4466" />
                <span className="text-[12px] text-[#ff4466]">{localLikes.length}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className="flex items-center gap-1 bg-[rgba(255,255,255,0.06)] rounded-sm px-2 py-1 transition-colors"
                style={{ color: bookmarked ? '#8a7ab5' : 'var(--color-eva-muted)' }}
                title={bookmarked ? 'Remove from saved' : 'Save post'}
              >
                  <Bookmark size={16} variant={bookmarked ? 'Bold' : 'Linear'} color="currentColor" />
                  <span style={{ fontSize: '10px' }}>{bookmarked ? '★' : '☆'}</span>
              </motion.button>
            </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default PostCard;