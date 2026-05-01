import { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'

const MAGI_FILTERS = ['ALL', 'ANIME', 'MUSIC', 'TECH', 'ART', 'CULTURE', 'OPINION'];

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    
    useEffect(() => {
        appwriteService.getPosts([]).then((response) => {
            if (response) {
                const allPosts = response.rows ?? [];
                // Sort by createdAt descending (Newest first)
                allPosts.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
                setPosts(allPosts);
            }
        }).catch(() => {
            setPosts([])
        }).finally(() => {
            setLoading(false)
        })
    }, [])

  if (loading) {
    return (
      <div className='w-full py-10'>
        <Container>
          <div className="mb-8">
            <div className="skeleton w-full h-12 rounded-none mb-4"></div>
            <div className="skeleton w-full h-12 rounded-none"></div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-surface p-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="skeleton w-full h-48 mb-4"></div>
                <div className="skeleton w-3/4 h-5 mb-2"></div>
                <div className="skeleton w-1/2 h-4"></div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='w-full py-10 min-h-[80vh]'>
      <Container>
        {/* Filter & Search Rail */}
        <div className="mb-10 border-b border-[var(--color-eva-border)] pb-6 animate-fade-in">
          {/* MAGI System selector */}
          <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
            {MAGI_FILTERS.map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="font-heading text-sm px-4 py-1.5 transition-all duration-150 whitespace-nowrap uppercase tracking-widest"
                    style={{
                        border: '1px solid var(--color-eva-border)',
                        background: activeFilter === filter ? 'var(--color-eva-orange)' : 'transparent',
                        color: activeFilter === filter ? 'var(--color-eva-black)' : 'var(--color-eva-muted)',
                        boxShadow: activeFilter === filter ? '0 0 12px rgba(255,102,0,0.4)' : 'none'
                    }}
                >
                    {filter}
                </button>
            ))}
          </div>

          {/* Search bar directly below */}
          <div className="relative mt-2 flex items-center bg-[rgba(0,255,65,0.02)] border border-[var(--color-eva-border)] p-3">
            <span className="text-[var(--color-eva-green)] font-mono mr-3 font-bold">&gt;</span>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="QUERY_INPUT: search all posts..."
                className="bg-transparent border-none outline-none w-full font-mono text-[var(--color-eva-green)] placeholder:text-[rgba(0,255,65,0.4)] caret-[var(--color-eva-green)]"
                style={{ cursor: 'none' }}
            />
            {searchQuery === '' && <span className="nav-cursor text-[var(--color-eva-green)] absolute left-[260px] pointer-events-none opacity-50"></span>}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state max-w-lg mx-auto animate-fade-in">
            <h2 className="text-[var(--color-eva-red)] mb-2">⚠ SYSTEM ALERT</h2>
            <p className="text-[var(--color-eva-white)] uppercase mb-2">NO_TRANSMISSIONS_FOUND // SECTOR SILENT</p>
            <p className="text-[var(--color-eva-muted)] text-sm">The SpilledTea archive is currently empty.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {posts.map((post, index) => {
                // Determine if it matches search
                const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
                
                return (
                    <div 
                        key={post.$id} 
                        className="transition-all duration-300 h-full"
                        style={{ 
                            animationDelay: `${index * 80}ms`,
                            opacity: matchesSearch ? 1 : 0.15,
                            pointerEvents: matchesSearch ? 'auto' : 'none',
                        }}
                    >
                        <PostCard {...post} />
                    </div>
                )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}

export default AllPosts