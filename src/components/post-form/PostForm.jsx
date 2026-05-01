import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";

export default function PostForm({ post }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        try {
            if (!userData?.$id) {
                throw new Error("Please log in again before submitting.");
            }

            if (post) {
                const selectedFile = data?.image?.[0];
                const file = selectedFile
                    ? await appwriteService.uploadFile(selectedFile, userData.$id)
                    : null;

                if (file) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const selectedFile = data?.image?.[0];
                if (!selectedFile) {
                    throw new Error("Please choose a featured image.");
                }

                const file = await appwriteService.uploadFile(selectedFile, userData.$id);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id, authorName: userData.name });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            setError("root", {
                type: "manual",
                message: error?.message || "Failed to submit post. Please try again."
            });
        }
    };

    const slugTransform = useCallback((value) => {
        const safeValue = typeof value === "string" ? value : String(value ?? "");

        return safeValue
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-6 lg:gap-0">
            {/* Main Content Panel */}
            <div className="w-full lg:w-2/3 lg:pr-4">
                <div className="glass-surface-heavy p-6 space-y-5">
                    <Input
                        label="Title"
                        placeholder="Your post title"
                        className="mb-2"
                        {...register("title", { required: true })}
                    />
                    {errors.title && <p className="text-sm" style={{ color: 'var(--color-error)' }}>Title is required.</p>}
                    <Input
                        label="Slug"
                        placeholder="auto-generated-slug"
                        className="mb-2"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e?.currentTarget?.value), { shouldValidate: true });
                        }}
                    />
                    {errors.slug && <p className="text-sm" style={{ color: 'var(--color-error)' }}>Slug is required.</p>}
                    <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>

            {/* Sidebar Panel */}
            <div className="w-full lg:w-1/3 lg:pl-4">
                <div className="glass-surface-heavy p-6 space-y-5">
                    {/* File Upload */}
                    <div>
                        <label className="brutalist-label inline-block mb-2">Featured Image</label>
                        <div 
                            className="rounded-lg p-4 text-center transition-material"
                            style={{
                                border: '2px dashed var(--color-umber)',
                                background: 'var(--color-glass)',
                            }}
                        >
                            <input
                                type="file"
                                className="w-full text-sm cursor-pointer"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                style={{ color: 'var(--color-ivory-muted)' }}
                                {...register("image", { required: !post })}
                            />
                            {!post && (
                                <p className="mt-2 text-xs" style={{ color: 'var(--color-taupe-muted)' }}>
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            )}
                        </div>
                    </div>
                    {errors.image && <p className="text-sm" style={{ color: 'var(--color-error)' }}>Featured image is required.</p>}

                    {/* Image Preview */}
                    {post && (
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg w-full"
                            />
                        </div>
                    )}

                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-2"
                        {...register("status", { required: true })}
                    />

                    {errors.root && (
                        <div className='error-state'>
                            <span style={{ marginRight: '0.5rem' }}>⚠</span>{errors.root.message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        bgColor={post ? "bg-green-500" : undefined}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : post ? "Update" : "Publish"}
                    </Button>
                </div>
            </div>
        </form>
    );
}