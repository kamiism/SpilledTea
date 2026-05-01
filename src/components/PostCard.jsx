import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage, $createdAt, authorName }) {
  // Format date
  const formattedDate = $createdAt ? new Date($createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  return (
    <Link to={`/post/${$id}`} className='block group h-full'>
      <div 
        className='h-full flex flex-col p-4 transition-material animate-fade-in glass-surface elevation-1'
        style={{ overflow: 'hidden' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-elevation-3)';
          e.currentTarget.style.borderColor = 'var(--color-glass-border-strong)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-elevation-1)';
          e.currentTarget.style.borderColor = 'var(--color-glass-border)';
        }}
      >
        <div className='w-full mb-5 rounded-lg overflow-hidden relative elevation-1 aspect-video'>
          <img 
            src={appwriteService.getFilePreview(featuredImage)} 
            alt={title} 
            className='w-full h-full object-cover transition-material duration-500 group-hover:scale-105'
          />
          {/* Hover overlay gradient */}
          <div 
            className='absolute inset-0 transition-material opacity-0 group-hover:opacity-100'
            style={{
              background: 'linear-gradient(to top, rgba(73, 17, 28, 0.6) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          ></div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <h3 
                className='text-xl font-semibold transition-material line-clamp-2'
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  color: 'var(--color-taupe)',
                }}
              >
                  {/* CSS rule below handles the hover state to ivory without inline JS events on the h3 */}
                  <span className="group-hover:text-[var(--color-ivory)] transition-colors duration-300">
                    {title}
                  </span>
              </h3>
            </div>

            <div className="mt-auto flex flex-col gap-3">
                {/* Meta info: Author and Date */}
                <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-taupe-muted)' }}>
                  <span className="truncate max-w-[60%] text-[var(--color-ivory-muted)]">
                    By {authorName || 'Unknown Author'}
                  </span>
                  <span>{formattedDate}</span>
                </div>

                {/* Read more indicator */}
                <span 
                  className="text-xs uppercase tracking-wider font-semibold transition-material opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  style={{ color: 'var(--color-taupe)' }}
                >
                    Read Story →
                </span>
            </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;