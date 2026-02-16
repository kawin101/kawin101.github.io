'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Navbar({ profile, onSearchClick }) {
    useEffect(() => {
        // Initialize Bootstrap JS for Navbar toggler
        import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const handleNavClick = (e) => {
        const target = e.currentTarget.getAttribute('href');
        if (target?.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

        const navbarCollapse = document.getElementById("navbarNav");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const toggler = document.querySelector(".navbar-toggler");
            if (toggler) toggler.click();
        }
    };

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="navbar navbar-expand-lg navbar-light glass-nav fixed-top px-3"
            style={{ zIndex: 1000 }}
        >
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold text-gradient fs-4" onClick={handleNavClick}>
                    {profile.name}
                </Link>

                <div className="d-flex align-items-center ms-auto d-lg-none">
                    <button
                        className="btn btn-link text-dark p-2 me-2"
                        onClick={onSearchClick}
                        aria-label="Open Search"
                    >
                        <i className="fas fa-search fa-lg"></i>
                    </button>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto fw-medium align-items-center">
                        <li className="nav-item d-none d-lg-block">
                            <button
                                className="btn btn-link nav-link text-dark p-2 me-2 border-0 shadow-none"
                                onClick={onSearchClick}
                                aria-label="Open Search"
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" href="/" onClick={handleNavClick}>Home</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" href="/blog" onClick={handleNavClick}>Blog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/project" onClick={handleNavClick}>Projects</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href="/ats" onClick={handleNavClick}>ATS Tool</Link>
                        </li>
                    </ul>
                    <div className="ms-lg-3 mt-3 mt-lg-0 text-center">
                        <a href={`mailto:${profile.email}`} onClick={handleNavClick} className="btn btn-primary-glow rounded-pill px-4 btn-sm">Hire Me</a>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
