'use client';

export default function SuggestionCard({ title, content, type = 'info', onApply }) {
    // Type: 'info', 'warning', 'success', 'ai'

    const icons = {
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle',
        success: 'fas fa-check-circle',
        ai: 'fas fa-robot'
    };

    const colors = {
        info: 'text-info',
        warning: 'text-warning',
        success: 'text-success',
        ai: 'text-primary'
    };

    const borders = {
        info: 'border-info',
        warning: 'border-warning',
        success: 'border-success',
        ai: 'border-primary'
    };

    return (
        <div className={`card shadow-sm mb-3 border-start border-4 ${borders[type]}`}>
            <div className="card-body">
                <div className="d-flex align-items-start">
                    <i className={`${icons[type]} ${colors[type]} fa-lg mt-1 me-3`}></i>
                    <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{title}</h6>
                        <div className="text-muted small mb-2" dangerouslySetInnerHTML={{ __html: content }} />
                        {onApply && (
                            <button className="btn btn-sm btn-outline-primary rounded-pill mt-2" onClick={onApply}>
                                <i className="fas fa-magic me-1"></i> Apply Fix
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
