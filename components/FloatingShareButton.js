'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingShareButton({ title, slug }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(`${window.location.origin}/blog/${slug}`);
    }, [slug]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            icon: 'fab fa-facebook-f',
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            icon: 'fab fa-twitter',
            label: 'Twitter',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
        },
        {
            icon: 'fab fa-linkedin-in',
            label: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        }
    ];

    return (
        <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="d-flex flex-column gap-2 mb-3 align-items-center"
                    >
                        {shareLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white transition-transform hover:scale-110"
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    backgroundColor: link.color,
                                    border: 'none'
                                }}
                                title={`Share on ${link.label}`}
                            >
                                <i className={`${link.icon}`}></i>
                            </a>
                        ))}
                        <button
                            onClick={handleCopy}
                            className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                            style={{ width: '45px', height: '45px' }}
                            title="Copy Link"
                        >
                            <i className={`fas ${copied ? 'fa-check text-success' : 'fa-link text-dark'}`}></i>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center ${isOpen ? 'rotate-45' : ''}`}
                style={{ width: '60px', height: '60px', transition: 'transform 0.3s' }}
            >
                <i className={`fas ${isOpen ? 'fa-times' : 'fa-share-alt'} fa-lg`}></i>
            </button>
        </div>
    );
}
