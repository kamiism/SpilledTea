import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, $createdAt, authorName, likes = [], views = 0, featured = false }) {
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
        className={`h-full flex flex-col transition-all duration-300 bg-eva-panel overflow-hidden relative border ${featured ? 'border-eva-purple shadow-[0_0_15px_rgba(123,47,255,0.2)]' : 'border-eva-border'} hover:border-eva-cyan group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(0,212,255,0.2)]`}
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
            <div className="bg-eva-black/80 border border-eva-cyan px-2 py-0.5 text-[9px] text-eva-cyan font-mono uppercase tracking-widest terminal-glow">
              INTEL_LOG
            </div>
            <div className="bg-eva-black/80 border border-eva-purple px-2 py-0.5 text-[9px] text-eva-purple font-mono uppercase tracking-widest purple-glow">
              3_MIN_SCAN
            </div>
          </div>

          <div className="absolute top-3 right-3 border border-eva-cyan/40 px-1.5 py-0.5 bg-eva-black/60 text-eva-cyan text-[8px] font-mono tracking-widest z-10">
            RT: {views}
          </div>

          <div className='absolute inset-0 bg-gradient-to-t from-eva-black via-transparent to-transparent pointer-events-none'></div>

          <div className="absolute bottom-3 left-4 right-4 z-10">
            <h3 className={`text-lg text-white leading-tight font-heading group-hover:text-eva-cyan transition-colors`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Bottom metadata bar */}
        <div className="bg-black/40 px-4 py-3 flex items-center justify-between text-[10px] uppercase tracking-wider mt-auto font-mono text-eva-cyan/70">
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="text-eva-cyan">UNIT_{authorName?.substring(0,8).toUpperCase() || 'UNKNOWN'}</span>
              <span className="opacity-50 text-[9px]">{formattedDate}</span>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleLike} className={`hover:text-eva-cyan transition-colors ${isLiked ? 'text-eva-cyan accent-glow' : ''}`}>
                [{isLiked ? '●' : '○'} {localLikes.length}]
              </button>
              <button onClick={handleBookmark} className={`hover:text-eva-purple transition-colors ${bookmarked ? 'text-eva-purple purple-glow' : ''}`}>
                [◈]
              </button>
            </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;