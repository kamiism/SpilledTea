import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, $createdAt, authorName, likes = [], views = 0 }) {
  const userData = useSelector((state) => state.auth.userData);
  const [localLikes, setLocalLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (userData?.$id) {
      setIsLiked(localLikes.includes(userData.$id));
    }
  }, [userData?.$id, localLikes]);

  const formattedDate = $createdAt ? new Date($createdAt).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.') : '';

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
    setBookmarked(!bookmarked);
  };

  return (
    <Link to={`/post/${$id}`} className='block group h-full relative'>
      <div 
        className='h-full flex flex-col transition-all duration-300 bg-[var(--color-eva-panel)] overflow-hidden relative border border-[var(--color-eva-border)] hover:border-[var(--color-eva-orange)] group-hover:shadow-[0_0_20px_rgba(255,102,0,0.15)]'
      >
        {/* Top-left marker */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[10px] border-l-[10px] border-t-[var(--color-eva-orange)] border-l-[var(--color-eva-orange)] border-b-[10px] border-b-transparent border-r-[10px] border-r-transparent z-10"></div>

        <div className='w-full relative aspect-video overflow-hidden border-b border-[var(--color-eva-border)]'>
          <img 
            src={appwriteService.getFilePreview(featuredImage)} 
            alt={title} 
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {/* Scanline overlay & gradient */}
          <div className='absolute inset-0 bg-[rgba(0,255,65,0.05)] pointer-events-none' style={{ mixBlendMode: 'screen' }}></div>
          <div className='absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-transparent pointer-events-none' style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85))' }}></div>

          {/* Category tag alert badge */}
          <div className="absolute top-2 right-2 border border-[var(--color-eva-orange)] px-1.5 py-0.5 bg-[rgba(10,10,15,0.8)] text-[var(--color-eva-orange)] text-[9px] uppercase font-mono tracking-widest z-10 shadow-[0_0_8px_rgba(255,102,0,0.3)]">
            VIEW:{views}
          </div>

          {/* Title inside image gradient */}
          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className='text-[18px] text-white leading-tight' style={{ fontFamily: 'var(--font-heading)' }}>
              {title}
            </h3>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="bg-[rgba(0,0,0,0.6)] px-3 py-2 flex items-center justify-between text-[10px] uppercase tracking-wider mt-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-eva-green)' }}>
            <div className="flex flex-col gap-0.5 leading-none">
              <span>UNIT_{authorName?.substring(0,8).toUpperCase() || 'UNKNOWN'}</span>
              <span className="opacity-70 text-[9px]">{formattedDate}</span>
            </div>
            
            <div className="flex gap-2">
              <button onClick={handleLike} className={`hover:scale-110 transition-transform ${isLiked ? 'text-[var(--color-eva-red)]' : ''}`}>
                [{isLiked ? '♥' : '♡'} {localLikes.length}]
              </button>
              <button onClick={handleBookmark} className={`hover:scale-110 transition-transform ${bookmarked ? 'text-[var(--color-eva-orange)]' : ''}`}>
                [◈]
              </button>
            </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;