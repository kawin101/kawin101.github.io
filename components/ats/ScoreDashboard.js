'use client';
import { motion } from "framer-motion";

export default function ScoreDashboard({ score, isAnalyzing }) {
    // Color based on score
    const getColor = (s) => {
        if (s >= 80) return '#198754'; // Success
        if (s >= 50) return '#ffc107'; // Warning
        return '#dc3545'; // Danger
    };

    const strokeColor = getColor(score);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body text-center py-4">
                <h4 className="fw-bold mb-4">ATS Match Score</h4>

                <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                    {/* Background Circle */}
                    <svg width="150" height="150" className="transform-rotate-90">
                        <circle
                            cx="75"
                            cy="75"
                            r={radius}
                            fill="transparent"
                            stroke="#e9ecef"
                            strokeWidth="12"
                        />
                        <motion.circle
                            cx="75"
                            cy="75"
                            r={radius}
                            fill="transparent"
                            stroke={strokeColor}
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            strokeLinecap="round"
                            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                        />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                        {isAnalyzing ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <>
                                <div className="display-4 fw-bold" style={{ color: strokeColor }}>{score}%</div>
                            </>
                        )}
                    </div>
                </div>

                <p className="mt-3 text-muted">
                    {score >= 80 ? "Excellent Match!" : score >= 50 ? "Good start, needs optimization." : "Low match, requires significant changes."}
                </p>
            </div>
        </div>
    );
}
