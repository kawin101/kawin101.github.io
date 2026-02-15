'use client';

import { useEffect } from 'react';
import Link from 'next/link';




export default function BlogPostContent({ post, content }) {
    useEffect(() => {
        // Mark post as read
        const readPosts = JSON.parse(localStorage.getItem('read_posts') || '[]');
        if (!readPosts.includes(post.slug)) {
            readPosts.push(post.slug);
            localStorage.setItem('read_posts', JSON.stringify(readPosts));
            // Trigger storage event for cross-tab sync if needed, 
            // but for same-page update we might need a custom event or context.
            // For now, simpler implementation.
        }
    }, [post.slug]);

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container py-5 mt-5">
                <article className="mx-auto" style={{ maxWidth: '800px' }}>
                    <div className="mb-5 text-center">
                        <div className="mb-4">
                            <Link href="/blog" className="btn btn-sm btn-outline-secondary rounded-pill">
                                <i className="fas fa-arrow-left me-2"></i> Back to Blog
                            </Link>
                        </div>
                        <h1 className="display-4 fw-bold mb-3">{post.title}</h1>
                        <div className="d-flex justify-content-center gap-3 text-muted">
                            <span>
                                <i className="far fa-calendar-alt me-1"></i>
                                {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {post.thumbnail && (
                        <div className="mb-5 rounded overflow-hidden shadow-sm" style={{ height: '400px' }}>
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-100 h-100 object-fit-cover"
                                style={{ objectPosition: post.image_position || 'center center' }}
                            />
                        </div>
                    )}

                    <div className="markdown-content lead text-secondary" dangerouslySetInnerHTML={{ __html: content }} />
                </article>
            </div>

            <div className="container pb-5">
            </div>
        </div>
    );
}
