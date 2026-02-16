'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function ProjectList({ projects }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    // Filter and Sort Logic
    const filteredProjects = useMemo(() => {
        let result = [...projects];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(project =>
                project.title.toLowerCase().includes(lowerTerm) ||
                (project.content && project.content.toLowerCase().includes(lowerTerm)) ||
                (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
            );
        }

        // 2. Sort
        result.sort((a, b) => {
            const dateA = new Date(a.startDate || a.date);
            const dateB = new Date(b.startDate || b.date);
            if (sortOrder === 'newest') return dateB - dateA;
            if (sortOrder === 'oldest') return dateA - dateB;
            if (sortOrder === 'az') return a.title.localeCompare(b.title);
            if (sortOrder === 'za') return b.title.localeCompare(a.title);
            return 0;
        });

        return result;
    }, [projects, searchTerm, sortOrder]);

    // Helper to truncate content
    const truncateContent = (content, length = 150) => {
        if (!content) return '';
        // Remove HTML tags and markdown artifacts
        const cleanContent = content
            .replace(/<[^>]*>/g, '') // Strip HTML tags
            .replace(/[#*`\\]/g, '') // Strip markdown artifacts
            .replace(/\n/g, ' ')     // Replace newlines with spaces
            .trim();
        if (cleanContent.length <= length) return cleanContent;
        return cleanContent.substring(0, length) + '...';
    };

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container py-5 mt-5">
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-3">Projects</h1>
                    <p className="lead text-muted">A selection of my best work and professional journey.</p>
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
                                    placeholder="Search projects..."
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
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => {
                            return (
                                <div key={project.slug} className="col-md-6 col-lg-4">
                                    <div className="card h-100 border-0 shadow-sm hover-card">
                                        {project.thumbnail && (
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img
                                                    src={project.thumbnail}
                                                    alt={project.title}
                                                    className="card-img-top object-fit-cover w-100 h-100"
                                                    style={{ objectPosition: project.image_position || 'center center' }}
                                                />
                                            </div>
                                        )}
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                                                <span>
                                                    <i className="far fa-calendar-alt me-1"></i>
                                                    {new Date(project.startDate || project.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <h2 className="h4 fw-bold mb-3">
                                                <Link href={`/project/${project.slug}`} className="text-dark text-decoration-none transition-colors hover:text-primary">
                                                    {project.title}
                                                </Link>
                                            </h2>
                                            <div
                                                className="card-text text-secondary mb-4 flex-grow-1 small"
                                                dangerouslySetInnerHTML={{ __html: truncateContent(project.content) }}
                                            />
                                            <div className="mb-4">
                                                {project.tags && project.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="badge bg-surface text-secondary border me-1 mb-1">{tag}</span>
                                                ))}
                                                {project.tags && project.tags.length > 3 && <span className="text-muted small">+{project.tags.length - 3} more</span>}
                                            </div>
                                            <Link href={`/project/${project.slug}`} className="btn btn-link p-0 text-primary text-decoration-none fw-bold mt-auto stretched-link">
                                                Read More <i className="fas fa-chevron-right ms-1 small"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h3 className="h5 text-muted">No projects found matching "{searchTerm}"</h3>
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
