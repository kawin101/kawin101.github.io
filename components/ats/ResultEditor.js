import { useState } from 'react';
import { jsPDF } from "jspdf";

export default function ResultEditor({ initialText, onClose, onReAnalyze }) {
    const [text, setText] = useState(initialText || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Split text into lines to fit PDF width
        const splitText = doc.splitTextToSize(text, 180); // 180mm width (A4 is 210mm)

        let y = 15; // Start Y position
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont("times", "normal");
        doc.setFontSize(11);

        splitText.forEach(line => {
            if (y > pageHeight - 15) {
                doc.addPage();
                y = 15;
            }
            doc.text(line, 15, y);
            y += 7; // Line height
        });

        doc.save("Optimized_Resume.pdf");
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg h-100">
                    <div className="modal-header bg-dark text-white border-bottom-0">
                        <h5 className="modal-title fw-bold"><i className="fas fa-pen-nib me-2"></i>AI Optimized Resume Editor</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0">
                        <textarea
                            className="form-control border-0 h-100 p-4"
                            style={{
                                fontFamily: 'Monaco, "Courier New", monospace',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                resize: 'none',
                                outline: 'none'
                            }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="modal-footer border-top-0 bg-light">
                        <div className="me-auto text-muted small">
                            <i className="fas fa-info-circle me-1"></i> You can edit the text before downloading.
                        </div>
                        <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Close</button>
                        {/* Optional Re-Analyze button if needed in future */}
                        {/* <button type="button" className="btn btn-outline-primary rounded-pill px-4" onClick={() => onReAnalyze(text)}>Re-Analyze Score</button> */}
                        <button type="button" className="btn btn-success rounded-pill px-4 shadow-sm" onClick={handleDownloadPDF}>
                            <i className="fas fa-file-pdf me-2"></i>Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
