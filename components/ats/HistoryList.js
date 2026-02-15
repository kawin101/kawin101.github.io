import { useState, useEffect } from 'react';
import logger from '../../lib/logger';

export default function HistoryList({ onSelect, onRefresh }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = () => {
        setLoading(true);
        try {
            const storedHistory = localStorage.getItem('ats_history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            } else {
                setHistory([]);
            }
        } catch (error) {
            logger.error('Failed to fetch history from localStorage', { error });
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [onRefresh]);

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            const updatedHistory = history.filter(h => h.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('ats_history', JSON.stringify(updatedHistory));
        } catch (error) {
            logger.error('Failed to delete history from localStorage', { error });
        }
    };

    if (loading) return <div className="text-center p-3"><span className="spinner-border spinner-border-sm text-primary"></span></div>;

    if (history.length === 0) return <div className="text-muted small text-center p-3">No history found.</div>;

    return (
        <div className="list-group list-group-flush">
            {history.map((item) => (
                <button
                    key={item.id}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    onClick={() => onSelect(item)}
                >
                    <div>
                        <div className="d-flex align-items-center mb-1">
                            <span className={`badge me-2 ${item.score >= 80 ? 'bg-success' : item.score >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                {item.score}%
                            </span>
                            <span className="fw-bold text-dark">{item.role}</span>
                        </div>
                        <div className="small text-muted">
                            <i className="far fa-building me-1"></i> {item.company} &bull; {new Date(item.date).toLocaleDateString()}
                        </div>
                    </div>
                    <span
                        className="text-danger p-2 hover-bg-light rounded-circle"
                        onClick={(e) => handleDelete(e, item.id)}
                        title="Delete"
                    >
                        <i className="fas fa-trash-alt"></i>
                    </span>
                </button>
            ))}
        </div>
    );
}
