import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

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
                        <div className="skeleton w-full h-72 rounded-xl"></div>
                        <div className="skeleton w-2/3 h-8 rounded"></div>
                        <div className="skeleton w-full h-4 rounded"></div>
                        <div className="skeleton w-full h-4 rounded"></div>
                        <div className="skeleton w-3/4 h-4 rounded"></div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="py-10 animate-fade-in">
            <Container>
                <div className="max-w-4xl mx-auto">
                    {/* Hero Image */}
                    <div 
                        className="w-full mb-8 relative rounded-xl overflow-hidden elevation-2"
                    >
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="w-full max-h-[500px] object-cover"
                        />
                        {/* Gradient overlay at bottom */}
                        <div 
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, transparent 50%, rgba(10, 9, 8, 0.7) 100%)',
                                pointerEvents: 'none',
                            }}
                        ></div>

                        {isAuthor && (
                            <div className="absolute right-4 top-4 flex gap-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-500">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-500" onClick={deletePost}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <h1 
                            className="text-3xl md:text-4xl font-bold mb-3"
                            style={{ 
                                fontFamily: 'var(--font-heading)', 
                                color: 'var(--color-taupe)',
                                lineHeight: '1.15',
                            }}
                        >
                            {post.title}
                        </h1>
                        <div className="w-16 h-0.5" style={{ background: 'var(--color-burgundy)' }}></div>
                    </div>

                    {/* Content — prose reading area */}
                    <div 
                        className="glass-surface p-6 md:p-10 elevation-1"
                    >
                        <div className="prose-spilled">
                            {parse(post.content)}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}