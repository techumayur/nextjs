import React from 'react';
import './Intro.css';
import Link from 'next/link';

interface ResumeIntroProps {
    badge_text?: string;
    title?: string;
    subtitle?: string;
    stats?: {
        value: string;
        label: string;
    }[];
    cta_heading?: string;
    cta_text?: string;
    pdf_url?: string;
    primary_btn_text?: string;
    secondary_btn_text?: string;
    secondary_btn_url?: string;
    features?: string[];
}

const ResumeIntro = ({
    badge_text = "Web Developer",
    title = "Let's Build Something Great Together",
    subtitle = "Passionate about creating beautiful, functional web experiences that make a difference.",
    stats = [
        { value: "5+", label: "Years Exp." },
        { value: "50+", label: "Projects" },
        { value: "100%", label: "Satisfied" }
    ],
    cta_heading = "Get My Complete Resume",
    cta_text = "Download my detailed resume to explore my technical skills, work experience, and achievements in web development.",
    pdf_url = "/docs/resume.pdf",
    primary_btn_text = "Download Resume",
    secondary_btn_text = "Lets Connect",
    secondary_btn_url = "/contact-me",
    features = ["Quick Response", "Professional"]
}: ResumeIntroProps) => {
    return (
        <section id="resume-intro" className="resume-cta-section section-spacing">
            <div className="container cta-container">
                <div className="row g-0 cta-row">
                    {/* Left Side */}
                    <div className="col-xl-6 d-flex">
                        <div className="cta-left w-100">
                            <div className="cta-badge">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                {badge_text}
                            </div>
                            <h2 className="cta-title">{title}</h2>
                            <p className="cta-subtitle">{subtitle}</p>
                            <div className="cta-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <div className="stat-number">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="col-xl-6 d-flex">
                        <div className="cta-right w-100">
                            <div className="cta-icon-box">
                                <picture>
                                    <img src="/images/home/resume.svg" alt="Resume" width="40" height="40" fetchPriority="high" className="img-fluid" loading="lazy" />
                                </picture>
                            </div>
                            <h3 className="cta-heading">{cta_heading}</h3>
                            <p className="cta-text">{cta_text}</p>
                            <div className="resume-btn-group pt-3">
                                <a href={pdf_url} className="primary-btn" target="_blank" rel="noopener noreferrer">
                                    <span className="primary-btn-icon">
                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    {primary_btn_text}
                                </a>
                                <Link href={secondary_btn_url} className="secondary-btn">
                                    <span>{secondary_btn_text}</span>
                                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                                        <path d="M1,5 L11,5"></path>
                                        <polyline points="8 1 12 5 8 9"></polyline>
                                    </svg>
                                </Link>
                            </div>
                            <div className="cta-features">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-tag">
                                        <picture>
                                            <img src="/images/home/check.svg" alt="Check" width="15" height="15" fetchPriority="high" className="img-fluid" loading="lazy" />
                                        </picture>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResumeIntro;
