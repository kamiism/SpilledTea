import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RTE } from "..";
import appwriteService from "../../appwrite/config";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, setError, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    
    // Mock states for UI
    const [wordCount, setWordCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const subscription = watch((value) => {
            const text = value.content?.replace(/<[^>]*>?/gm, '') || '';
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            setWordCount(words);
            
            // Auto-save mock effect
            setIsSaving(true);
            const timeout = setTimeout(() => setIsSaving(false), 800);
            return () => clearTimeout(timeout);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const submit = async (data) => {
        try {
            if (!userData?.$id) throw new Error("Please log in again before submitting.");
            if (post) {
                const selectedFile = data?.image?.[0];
                const file = selectedFile ? await appwriteService.uploadFile(selectedFile, userData.$id) : null;
                if (file) appwriteService.deleteFile(post.featuredImage);

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });
                if (dbPost) navigate(`/post/${dbPost.$id}`);
            } else {
                const selectedFile = data?.image?.[0];
                if (!selectedFile) throw new Error("Please choose a featured image.");
                
                const file = await appwriteService.uploadFile(selectedFile, userData.$id);
                if (file) {
                    data.featuredImage = file.$id;
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id, authorName: userData.name });
                    if (dbPost) navigate(`/post/${dbPost.$id}`);
                }
            }
        } catch (error) {
            setError("root", { type: "manual", message: error?.message || "Failed to submit post. Please try again." });
        }
    };

    const slugTransform = useCallback((value) => {
        return (typeof value === "string" ? value : String(value ?? ""))
            .trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") setValue("slug", slugTransform(value.title), { shouldValidate: true });
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const selectedImage = watch("image");
    const hasImage = selectedImage && selectedImage.length > 0;

    return (
        <form onSubmit={handleSubmit(submit)} className="max-w-4xl mx-auto border border-[var(--color-eva-border)] bg-[var(--color-eva-panel)] relative">
            <div className="corner-brackets absolute inset-0 pointer-events-none z-10"></div>
            
            {/* Form Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-eva-border)] bg-[rgba(0,255,65,0.02)]">
                <div className="font-heading text-[var(--color-eva-orange)] text-xl tracking-widest uppercase">
                    &gt; {post ? 'EDIT TRANSMISSION' : 'COMPOSE TRANSMISSION'}
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-eva-green)] uppercase tracking-widest">
                    <span className={`w-2 h-2 rounded-full bg-[var(--color-eva-green)] ${isSaving ? 'animate-pulse' : ''}`} style={{ boxShadow: '0 0 8px var(--color-eva-green)'}}></span>
                    {isSaving ? 'BUFFER_SYNC: ACTIVE' : 'BUFFER_SYNC: SAVED'}
                </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col gap-8">
                {/* Title & Slug */}
                <div className="flex flex-col">
                    <input
                        type="text"
                        placeholder="Post Title"
                        className="w-full bg-transparent border-none border-b border-[var(--color-eva-orange)] pb-2 text-2xl md:text-3xl text-[var(--color-eva-white)] font-heading outline-none placeholder:text-[rgba(232,232,232,0.3)] transition-all focus:shadow-[0_4px_12px_rgba(255,102,0,0.15)] rounded-none"
                        {...register("title", { required: true })}
                    />
                    {errors.title && <p className="text-[var(--color-eva-red)] text-xs mt-1 font-mono uppercase tracking-widest">⚠ TITLE_REQUIRED</p>}
                    
                    <div className="flex items-center mt-3 text-[var(--color-eva-muted)] font-mono text-xs uppercase tracking-widest">
                        <span>AUTO_SLUG: </span>
                        <input
                            type="text"
                            placeholder="pending..."
                            className="bg-transparent border-none outline-none ml-2 text-[var(--color-eva-green)] w-full placeholder:text-[rgba(0,255,65,0.3)]"
                            {...register("slug", { required: true })}
                            onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
                        />
                    </div>
                </div>

                {/* File Upload (Tactical styling) */}
                <div className="flex flex-col gap-2">
                    <label className="font-mono text-[var(--color-eva-green)] text-xs uppercase tracking-widest">Cover Image:</label>
                    <div className="border border-dashed border-[var(--color-eva-border)] bg-[rgba(10,10,15,0.5)] p-4 hover:border-[var(--color-eva-green)] transition-colors cursor-pointer relative overflow-hidden group">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })}
                        />
                        <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                            <div className={`w-10 h-10 border flex items-center justify-center font-mono transition-colors ${hasImage ? 'border-[var(--color-eva-orange)] bg-[var(--color-eva-orange)] text-black' : 'border-[var(--color-eva-green)] text-[var(--color-eva-green)] group-hover:bg-[var(--color-eva-green)] group-hover:text-black'}`}>
                                {hasImage ? '✓' : '+'}
                            </div>
                            <div className="flex flex-col font-mono text-xs uppercase tracking-widest">
                                <span className={hasImage ? "text-[var(--color-eva-orange)]" : "text-[var(--color-eva-white)]"}>
                                    {hasImage ? selectedImage[0].name : "SELECT_IMAGE_FILE"}
                                </span>
                                <span className="text-[var(--color-eva-muted)]">
                                    {hasImage ? "VISUAL DATA ACQUIRED" : "PNG, JPG // MAX 10MB"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {errors.image && <p className="text-[var(--color-eva-red)] text-xs font-mono uppercase tracking-widest">⚠ VISUAL_DATA_REQUIRED</p>}
                    
                    {post && post.featuredImage && (
                        <div className="mt-2 border border-[var(--color-eva-border)] w-48 relative overflow-hidden">
                            <div className="absolute top-0 left-0 bg-[var(--color-eva-black)] text-[var(--color-eva-orange)] text-[10px] px-2 font-mono z-10 border-b border-r border-[var(--color-eva-border)]">CURRENT_DATA</div>
                            <img src={appwriteService.getFilePreview(post.featuredImage)} alt="Current" className="w-full opacity-80" />
                        </div>
                    )}
                </div>

                {/* RTE Content */}
                <div className="flex flex-col relative border border-[var(--color-eva-border)]">
                    <div className="bg-[var(--color-eva-black)] px-4 py-2 border-b border-[var(--color-eva-border)] flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                        <span className="text-[var(--color-eva-green)]">Content</span>
                        <div className="flex gap-4 text-[var(--color-eva-muted)]">
                            <span>WORD_COUNT: <span className="text-[var(--color-eva-green)]">{wordCount}</span></span>
                            <span>EST. READ: <span className="text-[var(--color-eva-orange)]">{readTime} MIN</span></span>
                        </div>
                    </div>
                    <RTE name="content" control={control} defaultValue={getValues("content")} />
                </div>

                {/* Status select (minimal) */}
                <div className="flex items-center gap-4 border border-[var(--color-eva-border)] p-4 bg-[rgba(10,10,15,0.5)]">
                    <label className="font-mono text-[var(--color-eva-green)] text-xs uppercase tracking-widest">TRANSMISSION_STATUS:</label>
                    <select
                        className="bg-transparent border border-[var(--color-eva-border)] text-[var(--color-eva-white)] font-mono text-xs p-2 outline-none uppercase tracking-widest hover:border-[var(--color-eva-orange)]"
                        {...register("status", { required: true })}
                    >
                        <option className="bg-[var(--color-eva-panel)]" value="active">ACTIVE [PUBLIC]</option>
                        <option className="bg-[var(--color-eva-panel)]" value="inactive">INACTIVE [DRAFT]</option>
                    </select>
                </div>

                {errors.root && (
                    <div className="border border-[var(--color-eva-red)] bg-[rgba(255,32,32,0.1)] p-4 font-mono text-xs text-[var(--color-eva-red)] uppercase tracking-widest">
                        ⚠ {errors.root.message}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-[var(--color-eva-orange)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative border-2 border-[var(--color-eva-orange)] px-8 py-5 flex items-center justify-center transition-colors duration-200 group-hover:border-[var(--color-eva-orange)]">
                        <span className="font-heading text-xl uppercase tracking-widest text-[var(--color-eva-orange)] group-hover:text-[var(--color-eva-black)]">
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    TRANSMITTING<span className="flex gap-1"><span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '100ms'}}>.</span><span className="animate-bounce" style={{animationDelay: '200ms'}}>.</span></span>
                                </span>
                            ) : (
                                `> ${post ? 'UPDATE' : 'TRANSMIT'} POST`
                            )}
                        </span>
                    </div>
                </button>
            </div>
        </form>
    );
}