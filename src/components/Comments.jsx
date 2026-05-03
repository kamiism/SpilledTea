import { motion } from 'framer-motion';
import { ArrowRight2 as CornerDownRight, Message as MessageSquare, Trash as Trash2 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import appwriteService from '../appwrite/config';
import { useToast } from './ToastNotification';

/* ── Single Comment (recursive for nested replies) ── */
function CommentItem({ comment, userData, onDelete, onReply, depth = 0 }) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onReply(comment.$id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
                marginLeft: depth > 0 ? `${Math.min(depth * 24, 72)}px` : 0,
                borderLeft: depth > 0 ? '2px solid var(--color-eva-cyan)' : '2px solid var(--color-eva-orange)',
            }}
            className="relative p-4 bg-[rgba(255,102,0,0.02)] transition-all hover:bg-[rgba(255,102,0,0.04)] group"
        >
            {depth > 0 && (
                <CornerDownRight
                    size={12}
                    style={{
                        position: 'absolute',
                        left: '-13px',
                        top: '16px',
                        color: 'var(--color-eva-cyan)',
                    }}
                />
            )}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <span style={{
                        color: depth > 0 ? 'var(--color-eva-cyan)' : 'var(--color-eva-orange)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '13px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}>
                        &gt; {comment.authorName}
                    </span>
                    <span style={{
                        fontSize: '10px',
                        color: 'var(--color-eva-muted)',
                        fontFamily: 'var(--font-body)',
                    }}>
                        [{new Date(comment.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} // {new Date(comment.$createdAt).toLocaleDateString()}]
                    </span>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {userData && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            style={{
                                fontSize: '10px',
                                color: 'var(--color-eva-cyan)',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <MessageSquare size={10} /> REPLY
                        </button>
                    )}
                    {userData && userData.$id === comment.userId && (
                        <button 
                            onClick={() => onDelete(comment.$id)}
                            style={{
                                fontSize: '10px',
                                color: 'var(--color-eva-red)',
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <Trash2 size={10} /> PURGE
                        </button>
                    )}
                </div>
            </div>
            <p style={{
                color: 'var(--color-eva-white)',
                fontSize: '14px',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-body)',
            }}>
                {comment.content}
            </p>

            {/* Reply Form */}
            {showReplyForm && userData && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleReplySubmit}
                    style={{ marginTop: '12px', display: 'flex', gap: '8px' }}
                >
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="INPUT_REPLY..."
                        style={{
                            flex: 1,
                            background: 'rgba(0,212,255,0.03)',
                            border: '1px solid var(--color-eva-border)',
                            padding: '8px 12px',
                            color: 'var(--color-eva-white)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            outline: 'none',
                        }}
                        className="focus:border-[var(--color-eva-cyan)]"
                        autoFocus
                    />
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="btn-nerv text-xs py-1.5 px-4"
                        style={{ fontSize: '10px' }}
                    >
                        SEND
                    </motion.button>
                </motion.form>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.$id}
                            comment={reply}
                            userData={userData}
                            onDelete={onDelete}
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

export default function Comments({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const userData = useSelector((state) => state.auth.userData);
    let addToast;
    try { addToast = useToast(); } catch { addToast = () => {}; }

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
                const allComments = response.rows || [];
                // Build nested structure from flat list
                const nested = buildNested(allComments);
                setComments(nested);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Build nested comment tree from flat list
    const buildNested = (flatComments) => {
        const map = {};
        const roots = [];
        
        flatComments.forEach(c => {
            map[c.$id] = { ...c, replies: [] };
        });
        
        flatComments.forEach(c => {
            if (c.parentId && map[c.parentId]) {
                map[c.parentId].replies.push(map[c.$id]);
            } else {
                roots.push(map[c.$id]);
            }
        });
        
        return roots;
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
                addToast('TRANSCRIPT TRANSMITTED SUCCESSFULLY', 'success');
                fetchComments();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            addToast('TRANSMISSION FAILED — CHECK TERMINAL CONNECTION', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId, content) => {
        if (!userData) return;
        try {
            await appwriteService.addComment({
                postId,
                userId: userData.$id,
                authorName: userData.name,
                content,
                parentId,
            });
            addToast('REPLY TRANSMITTED', 'success');
            fetchComments();
        } catch (error) {
            console.error("Error adding reply:", error);
            addToast('REPLY TRANSMISSION FAILED', 'error');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("PURGE THIS TRANSCRIPT?")) return;
        
        try {
            await appwriteService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.$id !== commentId));
            addToast('TRANSCRIPT PURGED', 'info');
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
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="btn-nerv text-xs py-1.5 px-6 disabled:opacity-50"
                        >
                            {isSubmitting ? 'TRANSMITTING...' : 'SEND_DATA'}
                        </motion.button>
                    </div>
                </form>
            ) : (
                <div className="border border-dashed border-[var(--color-eva-border)] p-6 text-center text-[var(--color-eva-muted)] text-sm uppercase tracking-widest">
                    [AUTHENTICATION_REQUIRED_FOR_COMLINK_ACCESS]
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 mt-12">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="skeleton-shimmer" style={{ height: '80px', border: '1px solid var(--color-eva-border)' }}></div>
                        ))}
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.$id}
                            comment={comment}
                            userData={userData}
                            onDelete={handleDelete}
                            onReply={handleReply}
                        />
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
