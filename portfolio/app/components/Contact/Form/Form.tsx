"use client";

import React, { useState } from 'react';
import './Form.css';

interface ContactFormProps {
    sub_heading?: string;
    title?: string;
    description?: string;
}

const ContactForm = ({
    sub_heading,
    title,
    description
}: ContactFormProps) => {
    // --- Form State ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showThankYou, setShowThankYou] = useState(false);

    // --- Form Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Please enter your full name.';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.subject.trim()) {
            newErrors.subject = 'Please enter a subject.';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Please enter your message.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
                setShowThankYou(true);
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error: unknown) {
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact-form-section" className="section-spacing canvas-section">
            <div className="container relative-z">
                <div className="row g-5 justify-content-center">
                    <div className="col-lg-11">
                        <div className="workspace-container">
                            <div className="workspace-header">
                                <div className="window-controls">
                                    <span className="control-btn red"></span>
                                    <span className="control-btn yellow"></span>
                                    <span className="control-btn green"></span>
                                </div>
                                <div className="editor-tabs">
                                    <div className="tab active">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        <span>contact.json</span>
                                    </div>
                                    <div className="tab">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-terminal">
                                            <polyline points="4 17 10 11 4 5"></polyline>
                                            <line x1="12" y1="19" x2="20" y2="19"></line>
                                        </svg>
                                        <span>message.sh</span>
                                    </div>
                                </div>
                            </div>
                            <div className="canvas-form-wrapper">
                                <div className="section-title canvas-form-header mb-5">
                                    <span className="sub-heading-tag-2">{sub_heading}</span>
                                    <h2 className="display-5 fw-bold" dangerouslySetInnerHTML={{ __html: title || "" }}></h2>
                                    <p className="lead mt-3">{description}</p>
                                </div>
                                
                                {submitStatus === 'error' && (
                                    <div className="alert alert-danger mb-4">{errorMessage}</div>
                                )}

                                <form onSubmit={handleSubmit} id="contactForm" className="canvas-form" aria-label="Contact Form">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="canvas-input-group">
                                                <input 
                                                    type="text" 
                                                    id="userName" 
                                                    name="name" 
                                                    className={`canvas-input ${errors.name ? 'is-invalid' : ''}`} 
                                                    required 
                                                    placeholder=" "
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="userName" className="canvas-label"><span className="syntax-prop">name:</span> &quot;Your Name&quot;</label>
                                                {errors.name && <div className="invalid-feedback-canvas">{errors.name}</div>}
                                                <div className="canvas-line"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="canvas-input-group">
                                                <input 
                                                    type="email" 
                                                    id="userEmail" 
                                                    name="email" 
                                                    className={`canvas-input ${errors.email ? 'is-invalid' : ''}`} 
                                                    required 
                                                    placeholder=" "
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="userEmail" className="canvas-label"><span className="syntax-prop">email:</span> &quot;hello@example.com&quot;</label>
                                                {errors.email && <div className="invalid-feedback-canvas">{errors.email}</div>}
                                                <div className="canvas-line"></div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="canvas-input-group">
                                                <input 
                                                    type="text" 
                                                    id="userSubject" 
                                                    name="subject" 
                                                    className={`canvas-input ${errors.subject ? 'is-invalid' : ''}`} 
                                                    required 
                                                    placeholder=" "
                                                    value={formData.subject}
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="userSubject" className="canvas-label"><span className="syntax-prop">subject:</span> &quot;Project Inquiry&quot;</label>
                                                {errors.subject && <div className="invalid-feedback-canvas">{errors.subject}</div>}
                                                <div className="canvas-line"></div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="canvas-input-group">
                                                <textarea 
                                                    id="userMessage" 
                                                    name="message" 
                                                    className={`canvas-input ${errors.message ? 'is-invalid' : ''}`} 
                                                    rows={4} 
                                                    required 
                                                    placeholder=" "
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                ></textarea>
                                                <label htmlFor="userMessage" className="canvas-label"><span className="syntax-prop">message:</span> &quot;Your Vision...&quot;</label>
                                                {errors.message && <div className="invalid-feedback-canvas">{errors.message}</div>}
                                                <div className="canvas-line"></div>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-4 text-center">
                                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                                <span className="primary-btn-icon">
                                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                </span>
                                                {isSubmitting ? 'Sending...' : 'Initiate Project'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Same to Same Thank You Overlay from Home Page */}
            {showThankYou && (
                <div className="thank-you-overlay">
                    <div className="thank-you-content">
                        <div className="thank-you-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully. I will get back to you as soon as possible.</p>
                        <button onClick={() => setShowThankYou(false)} className="primary-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ContactForm;
