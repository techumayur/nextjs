"use client";
import React from 'react';
import { ACFCTA2 } from '@/types/acf';

interface CTA2Props {
    data: ACFCTA2 | null;
}

const CTA2 = ({ data }: CTA2Props) => {
    if (!data) return null;

    const subHeading = data.sub_heading || "Partnership Opportunity";
    const subHeadingImage = typeof data.sub_heading_image === 'string' ? data.sub_heading_image : "/images/user-1.svg";
    const title = data.title || "Want to Grow with <span class=\"highlight\">My Expertise?</span>";
    const description = data.description || "Let's transform your digital presence together. I offer expert SEO consulting and cutting-edge web development services to help you achieve measurable growth and stand out in the competitive digital landscape.";

    const primaryLabel = data.primary_button_label || "Free Consultation";
    const primaryLink = data.primary_button_link || "#";
    const secondaryLabel = data.secondary_button_label || "Lets Connect";
    const secondaryLink = data.secondary_button_link || "#";

    return (
        <section id="home-cta-2" className="cta-2 section-spacing">
            <div className="cta-bg-wrapper">
                <div className="bg-dots-pattern"></div>
                <div className="bg-lines-pattern"></div>
                <div className="cta-bg-shape bg-shape-1"></div>
                <div className="cta-bg-shape bg-shape-2"></div>
                <div className="cta-bg-shape bg-shape-3"></div>
                <div className="cta-bg-shape bg-shape-4"></div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="cta-main-container">
                            {/* Corner Decorations */}
                            <div className="corner-decoration corner-top-left"></div>
                            <div className="corner-decoration corner-bottom-right"></div>
                            <div className="text-center">
                                <div className="section-title section-title-center">
                                    <span className="sub-heading-tag-1">
                                        <div className="sub-heading-image">
                                            <picture>
                                                <img src="/images/user-1.svg" alt="Icon" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                            </picture>
                                        </div>
                                        {subHeading}
                                    </span>
                                    <h2 dangerouslySetInnerHTML={{ __html: title }} />
                                    <div className="section-para-center">
                                        <p>{description}</p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="cta-2-actions">
                                    <a href={primaryLink} className="primary-btn">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        {primaryLabel}
                                    </a>
                                    <a href={secondaryLink} className="secondary-btn">
                                        <span>{secondaryLabel}</span>
                                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                                            <path d="M1,5 L11,5"></path>
                                            <polyline points="8 1 12 5 8 9"></polyline>
                                        </svg>
                                    </a>
                                </div>

                                {/* Stats Grid */}
                                {data.stats_grid && data.stats_grid.length > 0 && (
                                    <div className="cta-stats-grid">
                                        {data.stats_grid.map((item, index) => {
                                            const icon = typeof item.icon === 'string' ? item.icon : "/images/home/seo-icon.svg";
                                            return (
                                                <div className="cta-stat-item" key={index}>
                                                    <div className="cta-stat-icon">
                                                        <picture>
                                                            <img src={icon} className="img-fluid" alt={item.title} height="30" width="30" />
                                                        </picture>
                                                    </div>
                                                    <h3 className="cta-stat-title">{item.title}</h3>
                                                    <p className="cta-stat-text">{item.text}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* SEO Links Section */}
                                {data.seo_links && data.seo_links.length > 0 && (
                                    <div className="cta-seo-section">
                                        <p className="cta-seo-title">Explore Our Services</p>
                                        <div className="cta-seo-links">
                                            {data.seo_links.map((link, index) => {
                                                const icon = typeof link.icon === 'string' ? link.icon : "/images/home/seo-icon.svg";
                                                return (
                                                    <div className="cta-seo-link" key={index}>
                                                        <picture>
                                                            <img src={icon} className="img-fluid" alt={link.label} height="14" width="14" />
                                                        </picture>
                                                        {link.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA2;
