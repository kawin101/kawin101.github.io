'use client';
import { useState } from 'react';

export default function ContactModal({ show, onClose, formActionUrl }) {
    const [formData, setFormData] = useState({
        name: '',
        contactMethod: 'Email', // Default
        contactValue: '',
        service: 'Web Development',
        budget: '',
        message: ''
    });

    const [status, setStatus] = useState(''); // '', 'submitting', 'success', 'error'

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formActionUrl) {
            setStatus('error');
            alert("Contact Form URL is not configured in CMS.");
            return;
        }

        setStatus('submitting');

        try {
            const response = await fetch(formActionUrl, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('success');
                setFormData({
                    name: '',
                    contactMethod: 'Email',
                    contactValue: '',
                    service: 'Web Development',
                    budget: '',
                    message: ''
                });
                setTimeout(() => {
                    onClose();
                    setStatus('');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content glass-panel border-0">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold">Let's Work Together</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {status === 'success' ? (
                            <div className="text-center py-4">
                                <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                                <h4>Message Sent!</h4>
                                <p className="text-muted">I'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-12 mb-2">
                                        <label className="form-label small fw-bold">Preferred Contact Method</label>
                                        <div className="d-flex gap-3">
                                            {['Email', 'Phone', 'Line ID'].map(method => (
                                                <div className="form-check" key={method}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="contactMethod"
                                                        id={`method-${method}`}
                                                        value={method}
                                                        checked={formData.contactMethod === method}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={`method-${method}`}>
                                                        {method}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <input
                                            type={formData.contactMethod === 'Email' ? 'email' : (formData.contactMethod === 'Phone' ? 'tel' : 'text')}
                                            name="contactValue"
                                            className="form-control"
                                            required
                                            value={formData.contactValue}
                                            onChange={handleChange}
                                            placeholder={
                                                formData.contactMethod === 'Email' ? "name@example.com" :
                                                    formData.contactMethod === 'Phone' ? "+66 81 234 5678" :
                                                        "Line ID"
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Service</label>
                                        <select
                                            name="service"
                                            className="form-select"
                                            value={formData.service}
                                            onChange={handleChange}
                                        >
                                            <option>Web Development</option>
                                            <option>Mobile App</option>
                                            <option>UI/UX Design</option>
                                            <option>Consultation</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small fw-bold">Budget (Optional)</label>
                                        <select
                                            name="budget"
                                            className="form-select"
                                            value={formData.budget}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Range</option>
                                            <option>&lt; $1,000</option>
                                            <option>$1,000 - $5,000</option>
                                            <option>$5,000 - $10,000</option>
                                            <option>&gt; $10,000</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold">Project Details</label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows="3"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell me a bit about your project..."
                                    ></textarea>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary-glow rounded-pill text-white" disabled={status === 'submitting'}>
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                                {status === 'error' && (
                                    <p className="text-danger small text-center mt-3">Something went wrong. Please try again or email directly.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
