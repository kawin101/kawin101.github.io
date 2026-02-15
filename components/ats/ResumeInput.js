'use client';

export default function ResumeInput({ value, onChange }) {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-primary"><i className="fas fa-file-alt me-2"></i>Your Resume</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label small text-muted">Paste your resume text here (or upload PDF coming soon)</label>
                    <textarea
                        className="form-control"
                        rows="15"
                        placeholder="Paste your resume content here..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ resize: 'none', fontSize: '0.9rem' }}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
