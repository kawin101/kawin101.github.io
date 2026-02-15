'use client';
import { useState, useEffect } from 'react';

export default function SettingsModal({ show, onClose, onSave, initialApiKey, initialLang, initialAiProvider }) {
    const [apiKey, setApiKey] = useState(initialApiKey || '');
    const [lang, setLang] = useState(initialLang || 'en');
    const [aiProvider, setAiProvider] = useState(initialAiProvider || 'cloud'); // 'cloud' or 'local'

    useEffect(() => {
        setApiKey(initialApiKey || '');
        setLang(initialLang || 'en');
        setAiProvider(initialAiProvider || 'cloud');
    }, [initialApiKey, initialLang, initialAiProvider, show]);

    if (!show) return null;

    const handleSave = () => {
        onSave(apiKey, lang, aiProvider);
        onClose();
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold"><i className="fas fa-cog me-2 text-primary"></i>ATS Settings</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Language Selection */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Language / ภาษา</label>
                            <div className="d-flex gap-2">
                                <button
                                    className={`btn flex-grow-1 ${lang === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setLang('en')}
                                >
                                    🇬🇧 English
                                </button>
                                <button
                                    className={`btn flex-grow-1 ${lang === 'th' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setLang('th')}
                                >
                                    🇹🇭 ภาษาไทย
                                </button>
                            </div>
                        </div>

                        {/* AI Provider Selection */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">AI Engine</label>
                            <div className="btn-group w-100" role="group">
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="aiProvider"
                                    id="aiCloud"
                                    autoComplete="off"
                                    checked={aiProvider === 'cloud'}
                                    onChange={() => setAiProvider('cloud')}
                                />
                                <label className="btn btn-outline-primary" htmlFor="aiCloud">
                                    <i className="fas fa-cloud me-2"></i>Gemini (Cloud)
                                </label>

                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="aiProvider"
                                    id="aiLocal"
                                    autoComplete="off"
                                    checked={aiProvider === 'local'}
                                    onChange={() => setAiProvider('local')}
                                />
                                <label className="btn btn-outline-success" htmlFor="aiLocal">
                                    <i className="fas fa-laptop-code me-2"></i>Local AI (WebLLM)
                                </label>
                            </div>
                            <div className="form-text mt-2">
                                {aiProvider === 'cloud'
                                    ? "Fast & Accurate. Requires API Key. Data sent to Google."
                                    : "Runs 100% Offline in your browser. Requires download (~1.5GB). Private."}
                            </div>
                        </div>

                        {/* API Key Input (Only if Cloud) */}
                        {aiProvider === 'cloud' && (
                            <div className="mb-3">
                                <label className="form-label fw-bold">Gemini API Key</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <div className="form-text">
                                    Get key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>. stored locally in browser.
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-top-0">
                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-primary-glow text-white rounded-pill px-4" onClick={handleSave}>Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
