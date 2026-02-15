'use client';
import { useState } from 'react';
import { fetchUrlContent, extractTextFromHtml } from '../../lib/scraper';

export default function WebsiteImportModal({ show, onClose, onImport }) {
    const [urls, setUrls] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [status, setStatus] = useState('');

    if (!show) return null;

    const handleImport = async () => {
        const urlList = urls.split('\n').map(u => u.trim()).filter(u => u);
        if (urlList.length === 0) return;

        setIsFetching(true);
        setStatus('Starting import...');

        let combinedText = '';

        try {
            for (let i = 0; i < urlList.length; i++) {
                const url = urlList[i];
                setStatus(`Fetching (${i + 1}/${urlList.length}): ${url}...`);

                try {
                    const html = await fetchUrlContent(url);
                    const text = extractTextFromHtml(html);
                    combinedText += `\n\n--- Content from ${url} ---\n\n${text}`;
                } catch (err) {
                    console.error(err);
                    combinedText += `\n\n--- Failed to fetch ${url} ---\n`;
                }
            }

            setStatus('Processing complete!');
            onImport(combinedText);
            onClose();

        } catch (error) {
            setStatus('Error: ' + error.message);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold"><i className="fas fa-globe me-2 text-primary"></i>Import from Website</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isFetching}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Website URLs</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="https://example.com/about&#10;https://example.com/experience"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                disabled={isFetching}
                            ></textarea>
                            <div className="form-text">
                                Enter one URL per line. We will fetch text content from each page.
                            </div>
                        </div>

                        {status && (
                            <div className={`alert ${status.includes('Error') ? 'alert-danger' : 'alert-info'} small py-2`}>
                                {isFetching && <span className="spinner-border spinner-border-sm me-2"></span>}
                                {status}
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-top-0">
                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose} disabled={isFetching}>Cancel</button>
                        <button
                            type="button"
                            className="btn btn-primary-glow text-white rounded-pill px-4"
                            onClick={handleImport}
                            disabled={isFetching || !urls.trim()}
                        >
                            {isFetching ? 'Importing...' : 'Fetch & Extract'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
