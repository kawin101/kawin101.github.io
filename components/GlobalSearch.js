'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function GlobalSearch({ isOpen, onClose, data }) {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Cleanup search on close
    useEffect(() => {
        if (!isOpen) setSearchTerm('');
    }, [isOpen]);

    const results = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase();
        const matches = [];

        // 1. Projects
        data.projects?.forEach(item => {
            if (item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.tags?.some(tag => tag.toLowerCase().includes(term))) {
                matches.push({
                    type: 'Project',
                    title: item.title,
                    subtitle: item.tags?.join(', '),
                    link: '#portfolio',
                    icon: 'fas fa-project-diagram'
                });
            }
        });

        // 2. Experience
        data.experience?.forEach(item => {
            if (item.title.toLowerCase().includes(term) ||
                item.company.toLowerCase().includes(term) ||
                item.content?.toLowerCase().includes(term)) {
                matches.push({
                    type: 'Experience',
                    title: item.title,
                    subtitle: item.company,
                    link: '#experience',
                    icon: 'fas fa-briefcase'
                });
            }
        });

        // 3. Blog
        data.blogPosts?.forEach(item => {
            if (item.title.toLowerCase().includes(term) ||
                item.content?.toLowerCase().includes(term)) {
                matches.push({
                    type: 'Blog',
                    title: item.title,
                    subtitle: new Date(item.date).toLocaleDateString(),
                    link: `/blog/${item.slug}`,
                    isExternal: true, // Navigate to blog page
                    icon: 'fas fa-newspaper'
                });
            }
        });

        // 4. Education
        data.education?.forEach(item => {
            if (item.school.toLowerCase().includes(term) ||
                item.degree.toLowerCase().includes(term) ||
                item.major?.toLowerCase().includes(term)) {
                matches.push({
                    type: 'Education',
                    title: item.degree,
                    subtitle: item.school,
                    link: '#education',
                    icon: 'fas fa-graduation-cap'
                });
            }
        });

        return matches.slice(0, 8); // Limit results
    }, [searchTerm, data]);

    const handleResultClick = (item) => {
        onClose();
        if (item.isExternal) return; // Link will handle it

        // Custom scroll for hash links if needed, or let standard anchors handles it
        const element = document.querySelector(item.link);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 3000 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="modal-dialog modal-lg modal-dialog-centered"
                >
                    <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
                        <div className="modal-header border-0 pb-0 px-4 pt-4">
                            <div className="input-group input-group-lg bg-light rounded-pill px-3 py-1">
                                <span className="input-group-text bg-transparent border-0 text-muted">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="form-control bg-transparent border-0 shadow-none ps-0"
                                    placeholder="Search anything (skills, posts, projects...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button type="button" className="btn-close ms-2 mt-2" onClick={onClose} aria-label="Close"></button>
                            </div>
                        </div>
                        <div className="modal-body p-4" style={{ minHeight: '300px' }}>
                            {searchTerm.trim() === '' ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-bolt fa-3x text-primary opacity-25 mb-3"></i>
                                    <p className="text-muted">Start typing to see magic...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {results.map((item, idx) => (
                                        item.isExternal ? (
                                            <Link
                                                key={idx}
                                                href={item.link}
                                                className="list-group-item list-group-item-action border-0 mb-2 rounded-3 d-flex align-items-center p-3"
                                                onClick={onClose}
                                            >
                                                <div className="icon-box bg-primary-glow text-white rounded p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className={item.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{item.title}</div>
                                                    <div className="small text-muted">{item.type} • {item.subtitle}</div>
                                                </div>
                                                <i className="fas fa-chevron-right ms-auto text-muted small"></i>
                                            </Link>
                                        ) : (
                                            <a
                                                key={idx}
                                                href={item.link}
                                                className="list-group-item list-group-item-action border-0 mb-2 rounded-3 d-flex align-items-center p-3"
                                                onClick={() => handleResultClick(item)}
                                            >
                                                <div className="icon-box bg-secondary-glow text-white rounded p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className={item.icon}></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{item.title}</div>
                                                    <div className="small text-muted">{item.type} • {item.subtitle}</div>
                                                </div>
                                                <i className="fas fa-chevron-right ms-auto text-muted small"></i>
                                            </a>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="far fa-frown fa-3x text-muted opacity-25 mb-3"></i>
                                    <p className="text-muted">No results found for "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer bg-light border-0 py-2 px-4 justify-content-center">
                            <small className="text-muted">Pro tip: Type what you're looking for!</small>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
