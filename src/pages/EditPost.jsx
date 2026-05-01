import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { Container, PostForm } from '../components';

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    },[slug, navigate])

  if (!post) {
    return (
      <div className='py-10'>
        <Container>
          <div className="mb-8">
            <div className="skeleton w-48 h-8 rounded"></div>
            <div className="skeleton w-12 h-0.5 mt-2 rounded"></div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="w-full lg:w-2/3 glass-container p-6 space-y-5">
              <div className="skeleton w-full h-10 rounded"></div>
              <div className="skeleton w-full h-10 rounded"></div>
              <div className="skeleton w-full h-64 rounded"></div>
            </div>
            <div className="w-full lg:w-1/3 glass-container p-6 space-y-5">
              <div className="skeleton w-full h-32 rounded"></div>
              <div className="skeleton w-full h-10 rounded"></div>
              <div className="skeleton w-full h-10 rounded"></div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='py-10'>
      <Container>
        <div className="mb-8 animate-fade-in">
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-taupe)' }}
          >
            Edit Post
          </h1>
          <div className="w-12 h-0.5 mt-2" style={{ background: 'var(--color-burgundy)' }}></div>
        </div>
        <div className="animate-slide-up">
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  )
}

export default EditPost