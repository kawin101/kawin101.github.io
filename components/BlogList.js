'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';



export default function BlogList({ posts }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // Filter and Sort Logic
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(lowerTerm) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(lowerTerm))
            );
        }

        // 2. Sort
        result.sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
            if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
            if (sortOrder === 'az') return a.title.localeCompare(b.title);
            if (sortOrder === 'za') return b.title.localeCompare(a.title);
            return 0;
        });

        return result;
    }, [posts, searchTerm, sortOrder]);

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container py-5 mt-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">Blog</h1>
                    <p className="lead text-muted">Thoughts, updates, and stories.</p>
                </div>

                {/* Controls */}
                <div className="row justify-content-center mb-5">
                    <div className="col-md-8">
                        <div className="d-flex flex-column flex-md-row gap-3">
                            <div className="flex-grow-1 position-relative">
                                <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-lg ps-5 rounded-pill"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex-shrink-0" style={{ minWidth: '200px' }}>
                                <select
                                    className="form-select form-select-lg rounded-pill"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="az">Title (A-Z)</option>
                                    <option value="za">Title (Z-A)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => {
                            return (
                                <div key={post.slug} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm hover-card">
                                        {post.thumbnail && (
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="card-img-top object-fit-cover w-100 h-100"
                                                    style={{ objectPosition: post.image_position || 'center center' }}
                                                />
                                            </div>
                                        )}
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                                                <span>
                                                    <i className="far fa-calendar-alt me-1"></i>
                                                    {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h2 className="h4 fw-bold mb-3">
                                                <Link href={`/blog/${post.slug}`} className="text-dark text-decoration-none stretched-link">
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="card-text text-secondary mb-4 flex-grow-1">{post.excerpt}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h3 className="h5 text-muted">No posts found matching "{searchTerm}"</h3>
                        </div>
                    )}
                </div>

                <div className="text-center mt-5">
                    <Link href="/" className="btn btn-outline-primary rounded-pill px-4">
                        <i className="fas fa-arrow-left me-2"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
