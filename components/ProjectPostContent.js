'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ProjectPostContent({ project, content }) {
    useEffect(() => {
        // Track project views if needed
        const viewedProjects = JSON.parse(localStorage.getItem('viewed_projects') || '[]');
        if (!viewedProjects.includes(project.slug)) {
            viewedProjects.push(project.slug);
            localStorage.setItem('viewed_projects', JSON.stringify(viewedProjects));
        }
    }, [project.slug]);

    return (
        <div className="bg-white min-vh-100 py-5">
            <div className="container py-5 mt-5">
                <article className="mx-auto" style={{ maxWidth: '800px' }}>
                    <div className="mb-5 text-center">
                        <div className="mb-4">
                            <Link href="/project" className="btn btn-sm btn-outline-secondary rounded-pill">
                                <i className="fas fa-arrow-left me-2"></i> Back to Projects
                            </Link>
                        </div>
                        <h1 className="display-4 fw-bold mb-3">{project.title}</h1>
                        <div className="d-flex justify-content-center gap-3 text-muted flex-wrap">
                            <span>
                                <i className="far fa-calendar-alt me-1"></i>
                                {new Date(project.startDate || project.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                                {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
                                {project.current && ' - Present'}
                            </span>
                            {project.tags && project.tags.map(tag => (
                                <span key={tag} className="badge bg-surface text-secondary border rounded-pill px-3">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {project.thumbnail && (
                        <div className="mb-5 rounded overflow-hidden shadow-sm" style={{ height: '450px' }}>
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="w-100 h-100 object-fit-cover"
                                style={{ objectPosition: project.image_position || 'center center' }}
                            />
                        </div>
                    )}

                    <div className="markdown-content lead text-secondary mb-5" dangerouslySetInnerHTML={{ __html: content }} />

                    {/* Action Buttons for Projects */}
                    <div className="d-flex flex-wrap gap-3 justify-content-center pt-5 border-top">
                        {project.projectUrl && (
                            <a href={project.projectUrl} target="_blank" className="btn btn-primary-glow btn-lg rounded-pill px-5 shadow-sm">
                                <i className="fas fa-external-link-alt me-2"></i> Live Demo
                            </a>
                        )}
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" className="btn btn-outline-dark btn-lg rounded-pill px-5 shadow-sm">
                                <i className="fab fa-github me-2"></i> View Code
                            </a>
                        )}
                        {project.pdfUrl && (
                            <a href={project.pdfUrl} target="_blank" className="btn btn-outline-danger btn-lg rounded-pill px-5 shadow-sm">
                                <i className="fas fa-file-pdf me-1"></i> Documentation
                            </a>
                        )}
                    </div>

                    {/* Store Badges */}
                    {(project.appStoreUrl || project.playStoreUrl) && (
                        <div className="d-flex gap-4 mt-5 justify-content-center">
                            {project.appStoreUrl && (
                                <a href={project.appStoreUrl} target="_blank" className="d-inline-block transition-opacity hover:opacity-75">
                                    <img src="/assets/badge-appstore.png" alt="App Store" height="45" />
                                </a>
                            )}
                            {project.playStoreUrl && (
                                <a href={project.playStoreUrl} target="_blank" className="d-inline-block transition-opacity hover:opacity-75">
                                    <img src="/assets/badge-playstore.png" alt="Play Store" height="45" />
                                </a>
                            )}
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}
