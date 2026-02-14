'use client';
import { motion } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { useEffect } from 'react';
import ExperienceTimeline from "./ExperienceTimeline";
import SkillSection from "./SkillSection";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PortfolioUI({ profile, experience, education, projects, skills }) {

    return (
        <div className="bg-white text-dark min-vh-100">
            {/* Sticky Navbar */}
            <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="navbar navbar-expand-lg navbar-light glass-nav fixed-top px-3"
                style={{ zIndex: 1000 }}
            >
                <div className="container">
                    <Link href="/" className="navbar-brand fw-bold text-gradient fs-4">{profile.name}</Link>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto fw-medium">
                            <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
                            <li className="nav-item"><a className="nav-link" href="#skills">Skills</a></li>
                            <li className="nav-item"><a className="nav-link" href="#experience">Experience</a></li>
                            <li className="nav-item"><a className="nav-link" href="#education">Education</a></li>
                            <li className="nav-item"><a className="nav-link" href="#portfolio">Portfolio</a></li>
                        </ul>
                        <div className="ms-3">
                            <a href={`mailto:${profile.email}`} className="btn btn-primary-glow rounded-pill px-4 btn-sm">Hire Me</a>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section id="about" className="min-vh-100 d-flex align-items-center justify-content-center pt-5">
                <div className="container pt-5">
                    <div className="row align-items-center flex-column-reverse flex-lg-row">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeInUp}
                            className="col-lg-7 text-center text-lg-start mt-5 mt-lg-0"
                        >
                            <span className="badge bg-surface text-primary border mb-3 px-3 py-2 rounded-pill"> Software Developer</span>
                            <h1 className="display-3 fw-bold mb-4 lh-sm">
                                Hello, I'm <br />
                                <span className="text-gradient">{profile.name}</span>
                            </h1>
                            <h2 className="h3 text-secondary mb-4 fw-normal">{profile.role}</h2>
                            <p className="lead text-muted mb-5 w-lg-75">{profile.bio}</p>

                            <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                                <a href="#portfolio" className="btn btn-primary-glow btn-lg rounded-pill px-5">View My Work</a>
                                {profile.resume && <a href={profile.resume} className="btn btn-outline-dark btn-lg rounded-pill px-5" target="_blank" download>Download CV</a>}
                            </div>
                            <div className="mt-5 text-muted small">
                                {profile.github && <a href={profile.github} target="_blank" className="text-dark me-4 text-decoration-none"><i className="fab fa-github fa-lg me-2"></i>Github</a>}
                                {profile.linkedin && <a href={profile.linkedin} target="_blank" className="text-dark me-4 text-decoration-none"><i className="fab fa-linkedin fa-lg me-2"></i>LinkedIn</a>}
                                <a href={`mailto:${profile.email}`} className="text-dark text-decoration-none"><i className="fas fa-envelope fa-lg me-2"></i>Email</a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="col-lg-5 text-center"
                        >
                            <div className="position-relative d-inline-block">
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-10 rounded-circle blur-3xl" style={{ filter: 'blur(60px)', transform: 'scale(1.2)', zIndex: -1 }}></div>
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    width={350}
                                    height={350}
                                    className="rounded-circle shadow-lg border border-4 border-white object-fit-cover"
                                    unoptimized
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="py-5 bg-surface">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Professional Skills</h2>
                        <p className="text-muted lead">My technical proficiency and tools</p>
                    </motion.div>
                    <SkillSection skills={skills} />
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-5">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Work Experience</h2>
                        <p className="text-muted lead">My professional journey and career path</p>
                    </motion.div>
                    <ExperienceTimeline experience={experience} />
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className="py-5 bg-surface">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Education</h2>
                        <p className="text-muted lead">Academic background and qualifications</p>
                    </motion.div>
                    <div className="row g-4">
                        {education.map((edu, index) => (
                            <motion.div
                                key={edu.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="col-md-6"
                            >
                                <div className="glass-panel p-4 h-100 hover-card">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="icon-box bg-primary-glow text-white rounded p-3 me-3 mb-3">
                                            <i className="fas fa-graduation-cap fa-lg"></i>
                                        </div>
                                        <span className="badge bg-light text-dark border">{edu.period}</span>
                                    </div>
                                    <h3 className="h4 fw-bold">{edu.degree}</h3>
                                    <h4 className="h6 text-primary mb-3">{edu.school}</h4>
                                    <div className="markdown-content text-secondary" dangerouslySetInnerHTML={{ __html: edu.content }} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portfolio" className="py-5">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-5"
                    >
                        <h2 className="display-5 fw-bold mb-3">Featured Projects</h2>
                        <p className="text-muted lead">A selection of my best work</p>
                    </motion.div>

                    <div className="row g-4">
                        {projects.map((project, index) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                key={project.slug}
                                className="col-md-6 col-lg-4"
                            >
                                <div className="card h-100 glass-panel border-0 hover-card overflow-hidden">
                                    {project.thumbnail && (
                                        <div className="position-relative" style={{ height: '240px', overflow: 'hidden' }}>
                                            <img src={project.thumbnail} className="card-img-top object-fit-cover w-100 h-100 transition-transform hover:scale-105" alt={project.title} />
                                        </div>
                                    )}
                                    <div className="card-body p-4 d-flex flex-column">
                                        <h3 className="h5 fw-bold mb-2">{project.title}</h3>
                                        <p className="small text-muted mb-3">{new Date(project.date).getFullYear()}</p>
                                        <p className="card-text text-secondary mb-4 flex-grow-1">{project.description}</p>

                                        <div className="mb-4">
                                            {project.tags && project.tags.map(tag => (
                                                <span key={tag} className="badge bg-surface text-secondary border me-1 mb-1">{tag}</span>
                                            ))}
                                        </div>

                                        <div className="d-flex gap-2 mt-auto">
                                            {project.projectUrl && <a href={project.projectUrl} className="btn btn-primary-glow btn-sm flex-fill" target="_blank">Live Demo</a>}
                                            {project.repoUrl && <a href={project.repoUrl} className="btn btn-outline-dark btn-sm flex-fill" target="_blank"><i className="fab fa-github"></i> Code</a>}
                                        </div>

                                        {/* Store Badges for Projects */}
                                        {(project.appStoreUrl || project.playStoreUrl) && (
                                            <div className="d-flex gap-2 mt-3 pt-3 border-top justify-content-center">
                                                {project.appStoreUrl && (
                                                    <a href={project.appStoreUrl} target="_blank" className="d-inline-block hover:opacity-75">
                                                        <img src="/assets/badge-appstore.png" alt="App Store" height="30" />
                                                    </a>
                                                )}
                                                {project.playStoreUrl && (
                                                    <a href={project.playStoreUrl} target="_blank" className="d-inline-block hover:opacity-75">
                                                        <img src="/assets/badge-playstore.png" alt="Play Store" height="30" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-dark text-white text-center py-5">
                <div className="container">
                    <h2 className="mb-4">Let's Work Together</h2>
                    <p className="mb-4 text-light opacity-75">Interested in my work? Feel free to reach out.</p>
                    <a href={`mailto:${profile.email}`} className="btn btn-primary-glow btn-lg rounded-pill px-5 mb-5">Say Hello</a>

                    <div className="border-top border-secondary opacity-25 mb-4"></div>

                    <div className="d-flex justify-content-center gap-4 mb-3">
                        {profile.github && <a href={profile.github} className="text-white hover:text-primary"><i className="fab fa-github fa-lg"></i></a>}
                        {profile.linkedin && <a href={profile.linkedin} className="text-white hover:text-primary"><i className="fab fa-linkedin fa-lg"></i></a>}
                    </div>

                    <p className="small opacity-50 mb-0">
                        Copyright &copy; {new Date().getFullYear()} {profile.name}. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
