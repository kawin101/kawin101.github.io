'use client';
import { motion } from "framer-motion";

export default function ExperienceTimeline({ experience }) {
    // Calculate total years of experience
    const totalYears = experience.reduce((acc, job) => {
        const start = new Date(job.startDate);
        // If current role, use today, otherwise use endDate if available
        let end;
        if (job.current) {
            end = new Date();
        } else if (job.endDate === 'Present') {
            end = new Date();
        } else if (job.endDate) {
            end = new Date(job.endDate);
        } else {
            // Fallback for old data or missing dates
            return acc;
        }

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return acc;
        }

        const durationDetails = end - start;
        return acc + durationDetails;
    }, 0);

    const years = Math.floor(totalYears / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((totalYears % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    // Handle NaN display
    const displayYears = isNaN(years) ? 0 : years;
    const displayMonths = isNaN(months) ? 0 : months;

    return (
        <div className="container">
            <div className="text-center mb-5">
                <span className="badge bg-primary-glow text-white fs-5 px-4 py-2 rounded-pill shadow-md">
                    {displayYears}+ Years of Professional Experience
                </span>
                <p className="text-muted mt-2">({displayYears} years and {displayMonths} months)</p>
            </div>

            <div className="position-relative">
                <div className="position-absolute top-0 bottom-0 start-0 ms-md-4 border-start border-2 border-primary opacity-25" style={{ left: '20px' }}></div>

                {experience.map((job, index) => {
                    // Format dates for display
                    // User requested "Month Year" e.g., "Jan 2024"
                    const dateFormatOptions = { month: 'short', year: 'numeric' };

                    const startDateStr = new Date(job.startDate).toLocaleDateString('en-GB', dateFormatOptions);
                    let endDateStr = 'Present';

                    if (job.current) {
                        endDateStr = 'Present';
                    } else if (job.endDate === 'Present') {
                        endDateStr = 'Present';
                    } else if (job.endDate) {
                        const date = new Date(job.endDate);
                        if (!isNaN(date.getTime())) {
                            endDateStr = date.toLocaleDateString('en-GB', dateFormatOptions);
                        } else {
                            // Fallback
                            endDateStr = job.endDate;
                        }
                    }

                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={job.slug}
                            className="timeline-item ms-md-4 ps-4 ps-md-5 mb-5 position-relative"
                        >
                            <div className="glass-panel p-4 hover-card">
                                <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
                                    <div>
                                        <h3 className="h4 fw-bold text-primary mb-1">{job.title}</h3>
                                        <h4 className="h6 text-secondary fw-bold mb-2">{job.company}</h4>
                                    </div>
                                    <div className="text-md-end">
                                        <span className="badge bg-light text-dark border fw-normal px-3 py-2">
                                            {startDateStr} - {endDateStr}
                                        </span>
                                        {/* Calculate Duration */}
                                        {(() => {
                                            const start = new Date(job.startDate);
                                            let end = new Date();
                                            if (!job.current && job.endDate && job.endDate !== 'Present') {
                                                end = new Date(job.endDate);
                                            }

                                            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                                                // Calculate difference in months
                                                let months = (end.getFullYear() - start.getFullYear()) * 12;
                                                months -= start.getMonth();
                                                months += end.getMonth();
                                                // Add 1 month to include the starting month (standard practice for work duration)
                                                months += 1;

                                                if (months > 0) {
                                                    const years = Math.floor(months / 12);
                                                    const remainingMonths = months % 12;

                                                    let durationStr = '';
                                                    if (years > 0) {
                                                        durationStr += `${years} year${years > 1 ? 's' : ''}`;
                                                    }
                                                    if (remainingMonths > 0) {
                                                        if (years > 0) durationStr += ' ';
                                                        durationStr += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
                                                    }

                                                    return <div className="small text-muted mt-1">({durationStr})</div>;
                                                }
                                            }
                                            return null;
                                        })()}
                                        <div className="small text-muted mt-1"><i className="fas fa-map-marker-alt me-1"></i> {job.location}</div>
                                    </div>
                                </div>

                                <div className="markdown-content text-secondary mb-4" dangerouslySetInnerHTML={{ __html: job.content }} />

                                {/* Skills/Technologies Used */}
                                {job.technologies && (
                                    <div className="mb-3">
                                        {job.technologies.map(tech => (
                                            <span key={tech} className="badge bg-surface text-secondary border me-1 mb-1">{tech}</span>
                                        ))}
                                    </div>
                                )}

                                {/* App Store Badges */}
                                <div className="d-flex gap-2 flex-wrap">
                                    {job.appStoreUrl && (
                                        <a href={job.appStoreUrl} target="_blank" rel="noopener noreferrer" className="d-inline-block transition-transform hover:scale-105">
                                            <img src="/assets/badge-appstore.png" alt="Download on the App Store" className="store-badge" onError={(e) => e.target.style.display = 'none'} />
                                            {/* Fallback to text if image missing (user needs to add assets) */}
                                            <span className="btn btn-dark btn-sm d-none">App Store</span>
                                        </a>
                                    )}
                                    {job.playStoreUrl && (
                                        <a href={job.playStoreUrl} target="_blank" rel="noopener noreferrer" className="d-inline-block transition-transform hover:scale-105">
                                            <img src="/assets/badge-playstore.png" alt="Get it on Google Play" className="store-badge" onError={(e) => e.target.style.display = 'none'} />
                                            <span className="btn btn-dark btn-sm d-none">Play Store</span>
                                        </a>
                                    )}
                                    {job.links && job.links.map(link => (
                                        <a key={link.url} href={link.url} target="_blank" className={`btn btn-sm rounded-pill px-3 py-2 ${link.platform === 'Apple' ? 'btn-secondary' : 'btn-primary-glow'}`}>
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
