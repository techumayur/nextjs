'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ACFPortfolioPage } from "@/types/acf";
import './PortfolioSEOCTA.css';

interface PortfolioSEOCTAProps {
    data: ACFPortfolioPage['intro'];
}

const PortfolioSEOCTA: React.FC<PortfolioSEOCTAProps> = ({ data }) => {
    const [counts, setCounts] = useState<number[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!data?.stats || !Array.isArray(data.stats)) return;
        setCounts(data.stats.map(() => 0));

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, [data]);

    useEffect(() => {
        if (!isVisible || !data?.stats || !Array.isArray(data.stats)) return;

        const duration = 2000; // ms
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);

        let currentFrame = 0;
        const timer = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;

            const newCounts = data.stats.map((stat) => {
                const target = stat.target_number;
                return Math.floor(target * progress);
            });

            setCounts(newCounts);

            if (currentFrame === totalFrames) {
                clearInterval(timer);
                setCounts(data.stats.map(s => s.target_number));
            }
        }, frameDuration);

        return () => clearInterval(timer);
    }, [isVisible, data]);

    if (!data) return null;

    const renderIcon = (type: string) => {
        switch (type) {
            case 'seo':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'dev':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'delivery':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const cleanHeading = (html: string) => {
        if (!html) return "";
        return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
    };

    const features = Array.isArray(data.features) ? data.features : [];
    const stats = Array.isArray(data.stats) ? data.stats : [];
    const trustBadges = Array.isArray(data.trust_badges) ? data.trust_badges : [];

    return (
        <section id="portfolio-seo-cta" className="section-spacing" ref={sectionRef}>
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="cta-content-wrap text-lg-start text-center">
                            <span className="sub-heading-tag-1">
                                {(() => {
                                    const icon = typeof data.sub_heading_icon === 'string' ? data.sub_heading_icon :
                                        (typeof data.sub_heading_icon === 'object' && data.sub_heading_icon !== null && 'url' in data.sub_heading_icon ? data.sub_heading_icon.url : '');
                                    if (!icon) return null;
                                    return (
                                        <div className="sub-heading-image">
                                            <Image
                                                src={icon}
                                                alt="Sub Heading Icon"
                                                width={20}
                                                height={20}
                                                className="img-fluid"
                                            />
                                        </div>
                                    );
                                })()}
                                <span dangerouslySetInnerHTML={{ __html: data.sub_heading }} />
                            </span>
                            <h2 className="mb-3" dangerouslySetInnerHTML={{ __html: cleanHeading(data.heading) }} />
                            <p className="cta-para mb-4" dangerouslySetInnerHTML={{ __html: cleanHeading(data.description) }} />
                        </div>

                        <div className="feature-row mb-4">
                            <div className="row g-3">
                                {features.map((feature, i) => (
                                    <div key={i} className="col-md-4 col-6">
                                        <div className="feature-item horizontal mini">
                                            <div className={`feature-icon ${feature.icon_type}-icon`}>
                                                {renderIcon(feature.icon_type)}
                                            </div>
                                            <div className="feature-text text-start">
                                                <h4 dangerouslySetInnerHTML={{ __html: feature.title }} />
                                                <p dangerouslySetInnerHTML={{ __html: feature.description }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cta-btns d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-lg-0 mb-5">
                            <Link href={data.primary_button_link || "#"} className="primary-btn">
                                <span className="primary-btn-icon">
                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                {data.primary_button_label || "Start Project"}
                            </Link>
                            <Link href={data.secondary_button_link || "#"} className="secondary-btn">
                                <span>{data.secondary_button_label || "Contact Me"}</span>
                                <svg width="15px" height="10px" viewBox="0 0 13 10">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                </svg>
                            </Link>
                        </div>

                        <div className="trust-container mt-5 pt-4 border-top">
                            <div className="trust-grid d-flex gap-3 align-items-center justify-content-center justify-content-lg-start">
                                <span className="trust-label text-nowrap">{data.trust_label}:</span>
                                <div className="trust-badges-wrapper d-flex gap-3 flex-wrap justify-content-center justify-content-lg-start">
                                    {trustBadges.map((badge, i) => (
                                        <div key={i} className="trust-badge-v2">
                                            <span className="badge-icon">{badge.icon}</span>
                                            <span className="badge-text">{badge.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="stats-grid">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-card">
                                    <div className={`stat-icon-wrap bg-soft-orange`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
                                        </svg>
                                    </div>
                                    <div className="stat-value">
                                        <h3 className="counter-val">{counts[i] || 0}</h3>{stat.value && stat.value.includes('%') ? '%' : '+'}
                                    </div>
                                    <p className="stat-label">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSEOCTA;
