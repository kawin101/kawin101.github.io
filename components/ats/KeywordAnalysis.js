'use client';

export default function KeywordAnalysis({ analysis }) {
    if (!analysis) return null;

    // Handle both old format (flat arrays) and new format (nested objects)
    const hardSkills = analysis.hard_skills || { match: analysis.matches || [], missing: analysis.missing || [] };
    const softSkills = analysis.soft_skills || { match: [], missing: [] };

    return (
        <div className="card shadow-sm h-100">
            <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4">Detailed Analysis</h4>

                {/* Summary Section */}
                {analysis.summary && (
                    <div className="alert alert-light border mb-4">
                        <h6 className="fw-bold text-dark"><i className="fas fa-info-circle me-2"></i>Executive Summary</h6>
                        <p className="mb-0 text-muted">{analysis.summary}</p>
                    </div>
                )}

                {/* Hard Skills (Technical) */}
                <div className="mb-4">
                    <h6 className="fw-bold text-uppercase text-secondary small mb-3">Hard Skills / Technical</h6>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="p-3 bg-success-subtle rounded border border-success-subtle h-100">
                                <h6 className="fw-bold text-success mb-2"><i className="fas fa-check-circle me-2"></i>Matched</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {hardSkills.match.length > 0 ? (
                                        hardSkills.match.map((kw, i) => (
                                            <span key={i} className="badge bg-white text-success border border-success-subtle shadow-sm">{kw}</span>
                                        ))
                                    ) : (
                                        <span className="text-muted small fst-italic">No exact matches found.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 bg-danger-subtle rounded border border-danger-subtle h-100">
                                <h6 className="fw-bold text-danger mb-2"><i className="fas fa-times-circle me-2"></i>Missing</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {hardSkills.missing.length > 0 ? (
                                        hardSkills.missing.map((kw, i) => (
                                            <span key={i} className="badge bg-white text-danger border border-danger-subtle shadow-sm">{kw}</span>
                                        ))
                                    ) : (
                                        <span className="text-muted small fst-italic">Great job! No key skills missing.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Soft Skills (If available) */}
                {(softSkills.match.length > 0 || softSkills.missing.length > 0) && (
                    <div className="mb-4">
                        <h6 className="fw-bold text-uppercase text-secondary small mb-3">Soft Skills / Leadership</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <ul className="list-group list-group-flush bg-transparent">
                                    {softSkills.match.map((kw, i) => (
                                        <li key={i} className="list-group-item bg-transparent px-0 py-1 text-success small">
                                            <i className="fas fa-check me-2"></i>{kw}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="list-group list-group-flush bg-transparent">
                                    {softSkills.missing.map((kw, i) => (
                                        <li key={i} className="list-group-item bg-transparent px-0 py-1 text-danger small">
                                            <i className="fas fa-exclamation-triangle me-2"></i>{kw}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Feedback */}
                {analysis.experience_relevance && (
                    <div className="mb-3">
                        <h6 className="fw-bold text-dark mb-1">Experience Relevance</h6>
                        <p className="text-muted small">{analysis.experience_relevance}</p>
                    </div>
                )}

                {analysis.formatting_check && (
                    <div className="mb-3">
                        <h6 className="fw-bold text-dark mb-1">Formatting & Structure</h6>
                        <p className="text-muted small">{analysis.formatting_check}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
