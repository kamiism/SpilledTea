import { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    
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
            <div className="skeleton w-48 h-8 rounded mb-2"></div>
            <div className="skeleton w-12 h-0.5 rounded"></div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-surface p-4 rounded-xl" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="skeleton w-full h-48 mb-4 rounded-lg"></div>
                <div className="skeleton w-3/4 h-5 mb-2 rounded"></div>
                <div className="skeleton w-1/2 h-4 rounded"></div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='w-full py-10'>
      <Container>
        <div className="mb-8 animate-fade-in">
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-taupe)' }}
          >
            All Posts
          </h1>
          <div className="w-12 h-0.5 mt-2" style={{ background: 'var(--color-burgundy)' }}></div>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state empty-state-border mx-auto max-w-lg animate-fade-in glass-surface">
            <div className="empty-state-icon text-4xl mb-4">🌍</div>
            <p className="empty-state-text text-xl" style={{ color: 'var(--color-ivory)' }}>No global posts yet</p>
            <p className="empty-state-subtext mt-2">The SpilledTea feed is currently empty.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
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

export default AllPosts