'use client';

export default function JobDescriptionInput({ value, onChange }) {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-success"><i className="fas fa-briefcase me-2"></i>Job Description</h5>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label small text-muted">Paste the Job Description (JD) here</label>
                    <textarea
                        className="form-control"
                        rows="15"
                        placeholder="Paste the job description content here..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        style={{ resize: 'none', fontSize: '0.9rem' }}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
