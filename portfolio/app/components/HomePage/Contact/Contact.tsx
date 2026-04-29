"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ACFContactSection } from '@/types/acf';
import { parseHtml } from '@/app/lib/parseHtml';
import './Contact.css';

interface ContactProps {
    sectionData: ACFContactSection | null;
}

const Contact = ({ sectionData }: ContactProps) => {
    // --- Form State ---
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
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
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
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
        <section id="home-contact" className="contact section-spacing">
            <div className="container">
                <div className="row justify-content-center g-0">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                    <div className="sub-heading-image">
                                        <Image 
                                            src={(typeof sectionData?.sub_heading_icon === 'string' && sectionData.sub_heading_icon !== "") 
                                                ? sectionData.sub_heading_icon 
                                                : (typeof sectionData?.sub_heading_image === 'string' && sectionData.sub_heading_image !== "")
                                                  ? sectionData.sub_heading_image
                                                  : "/images/user-2.svg"} 
                                            alt="Techu Mayur" 
                                            width={20} 
                                            height={20} 
                                            loading="lazy" 
                                            className="img-fluid"
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                    </div>
                                {sectionData?.sub_heading}
                            </span>
                            <h2>
                                {sectionData?.title && (
                                    <span dangerouslySetInnerHTML={{ __html: parseHtml(sectionData.title) }} />
                                )}
                            </h2>
                            <div className="section-para-center">
                                <p dangerouslySetInnerHTML={{ __html: parseHtml(sectionData?.description) }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="contact-wrapper">
                            <div className="row g-0">
                                {/* Form Side */}
                                <div className="col-lg-6">
                                    <div className="contact-form-side">
                                            <div className="form-header">
                                                <h3 className="form-title" dangerouslySetInnerHTML={{ __html: sectionData?.form_heading || "" }} />
                                                <div className="form-subtitle" dangerouslySetInnerHTML={{ __html: sectionData?.form_paragraph || "" }} />
                                            </div>

                                        {/* Error Message Inline */}
                                        {submitStatus === 'error' && (
                                            <div className="success-message show" style={{ borderColor: 'red', color: 'red', backgroundColor: '#fff5f5', marginBottom: '20px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                                </svg>
                                                <span>{errorMessage}</span>
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit} id="contactForm">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                            placeholder="John Doe"
                                                            value={formData.name}
                                                            onChange={handleInputChange} />
                                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email" className="form-label">Email Address *</label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                            placeholder="john.doe@example.com"
                                                            value={formData.email}
                                                            onChange={handleInputChange} />
                                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                            placeholder="+1 (234) 567-8900"
                                                            value={formData.phone}
                                                            onChange={handleInputChange} />
                                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="subject" className="form-label">Subject *</label>
                                                        <input
                                                            type="text"
                                                            id="subject"
                                                            name="subject"
                                                            className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                            placeholder="Project Inquiry"
                                                            value={formData.subject}
                                                            onChange={handleInputChange} />
                                                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="message" className="form-label">Your Message *</label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                    placeholder="Tell me about your project or inquiry..."
                                                    value={formData.message}
                                                    onChange={handleInputChange}></textarea>
                                                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                            </div>
                                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                                <span className="primary-btn-icon">
                                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                </span>
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Info Side */}
                                <div className="col-lg-6">
                                    <div className="contact-info-side">
                                        <div className="info-header">
                                            <h3 className="info-title" dangerouslySetInnerHTML={{ __html: sectionData?.contact_info_heading || "" }} />
                                            <div className="info-subtitle" dangerouslySetInnerHTML={{ __html: sectionData?.contact_info_paragraph || "" }} />
                                        </div>

                                        {sectionData?.contact_info?.map((item, idx) => (
                                            <div className="contact-info-item" key={idx}>
                                                <div className="info-icon">
                                                    <Image 
                                                        src={typeof item.icon === 'string' ? item.icon : (item.icon as { url: string })?.url || ""} 
                                                        alt={item.title} 
                                                        width={24} 
                                                        height={24} 
                                                        style={{ height: 'auto' }}
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="info-content">
                                                    <h4>{item.title}</h4>
                                                    {item.link ? (
                                                        <a href={item.link}>{item.details}</a>
                                                    ) : (
                                                        <p dangerouslySetInnerHTML={{ __html: parseHtml(item.details.replace(/\n/g, '<br/>')) }} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Social Links */}
                                        <div className="social-section">
                                            <h4 className="social-title mb-2">Connect With Me</h4>
                                            <div className="social-links">
                                                {sectionData?.social_links?.map((social, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={social.link}
                                                        className="social-link"
                                                        aria-label={social.label}
                                                        title={social.label}
                                                    >
                                                        <Image 
                                                            src={typeof social.icon === 'string' ? social.icon : (social.icon as { url: string })?.url || ""} 
                                                            alt={social.label} 
                                                            width={16} 
                                                            height={16} 
                                                            style={{ height: 'auto' }}
                                                            unoptimized
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thank You Popup */}
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

export default Contact;
