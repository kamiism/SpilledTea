import { Link } from 'react-router-dom'
import appwriteService from "../appwrite/config"

function PostCard({$id, title, featuredImage}) {
  return (
    <Link to={`/post/${$id}`} className='block group h-full'>
      <div 
        className='h-full flex flex-col p-4 transition-material animate-fade-in glass-surface elevation-1'
        style={{ overflow: 'hidden' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-elevation-3)'
          e.currentTarget.style.borderColor = 'var(--color-glass-border-strong)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-elevation-1)'
          e.currentTarget.style.borderColor = 'var(--color-glass-border)'
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
            <h3 
              className='text-xl font-semibold transition-material line-clamp-2'
              style={{ 
                fontFamily: 'var(--font-heading)', 
                color: 'var(--color-ivory)',
              }}
            >
                {title}
            </h3>
            {/* Optional subtle read more link to indicate clickability */}
            <span 
              className="text-xs uppercase tracking-wider font-semibold mt-4 transition-material opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              style={{ color: 'var(--color-taupe)' }}
            >
                Read Story →
            </span>
        </div>
      </div>
    </Link>
  )
}

export default PostCard