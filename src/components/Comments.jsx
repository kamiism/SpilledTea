import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await appwriteService.getComments(postId);
            if (response) {
                setComments(response.rows || []);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData) {
            alert("Please login to post a transcript");
            return;
        }
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await appwriteService.addComment({
                postId,
                userId: userData.$id,
                authorName: userData.name,
                content: newComment
            });
            if (response) {
                setNewComment('');
                fetchComments();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to send transcript. Check terminal connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("PURGE THIS TRANSCRIPT?")) return;
        
        try {
            await appwriteService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.$id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="space-y-8 font-mono">
            {/* Comment Form */}
            {userData ? (
                <form onSubmit={handleSubmit} className="relative group">
                    <div className="corner-brackets absolute inset-0 pointer-events-none opacity-50"></div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="INPUT_TRANSCRIPT_DATA..."
                        className="w-full bg-[rgba(0,255,65,0.02)] border border-[var(--color-eva-border)] p-4 text-[var(--color-eva-white)] focus:border-[var(--color-eva-orange)] outline-none min-h-[100px] transition-all resize-none placeholder:text-[var(--color-eva-muted)]"
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-[var(--color-eva-muted)] uppercase tracking-[0.2em]">
                            ENCRYPTION: ACTIVE // BUFFER_READY
                        </span>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="btn-nerv text-xs py-1.5 px-6 disabled:opacity-50"
                        >
                            {isSubmitting ? 'TRANSMITTING...' : 'SEND_DATA'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="border border-dashed border-[var(--color-eva-border)] p-6 text-center text-[var(--color-eva-muted)] text-sm uppercase tracking-widest">
                    [AUTHENTICATION_REQUIRED_FOR_COMLINK_ACCESS]
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6 mt-12">
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-20 bg-[rgba(255,102,0,0.05)] border border-[var(--color-eva-border)]"></div>
                        ))}
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.$id} className="relative p-4 border-l-2 border-[var(--color-eva-orange)] bg-[rgba(255,102,0,0.02)] transition-all hover:bg-[rgba(255,102,0,0.04)] group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[var(--color-eva-orange)] font-heading text-sm tracking-wider uppercase">
                                        &gt; {comment.authorName}
                                    </span>
                                    <span className="text-[10px] text-[var(--color-eva-muted)]">
                                        [{new Date(comment.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {new Date(comment.$createdAt).toLocaleDateString()}]
                                    </span>
                                </div>
                                {userData && userData.$id === comment.userId && (
                                    <button 
                                        onClick={() => handleDelete(comment.$id)}
                                        className="text-[var(--color-eva-red)] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                    >
                                        [PURGE]
                                    </button>
                                )}
                            </div>
                            <p className="text-[var(--color-eva-white)] text-sm leading-relaxed whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-[var(--color-eva-muted)] text-xs uppercase tracking-[0.3em] text-center py-10 opacity-50">
                        NO_TRANSCRIPTS_FOUND_IN_BUFFER
                    </div>
                )}
            </div>
        </div>
    );
}
