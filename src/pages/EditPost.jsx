import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import appwriteService from "../appwrite/config";
import { Container, PostForm } from '../components';

function EditPost() {
    const [post, setPosts] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPosts(post)
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    if (!post) {
        return (
            <div className="w-full py-12">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="skeleton-shimmer w-full h-16"></div>
                        <div className="skeleton-shimmer w-full h-72"></div>
                        <div className="skeleton-shimmer w-full h-48"></div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='py-10 bg-eva-black min-h-[80vh]'>
            <Container>
                <div className="animate-slide-up">
                    <PostForm post={post} />
                </div>
            </Container>
        </div>
    )
}

export default EditPost