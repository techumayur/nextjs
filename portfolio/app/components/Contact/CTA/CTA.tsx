import React from 'react';
import Image from 'next/image';
import { ACFCTA2, ACFImage } from '@/types/acf';
import './CTA.css';

interface ContactCTAProps {
    data?: ACFCTA2 | null;
}

const ContactCTA = ({ data }: ContactCTAProps) => {
    if (!data) return null;

    const getImageUrl = (image: ACFImage | string | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        if (typeof image === "object" && "url" in image) return image.url || "";
        return "";
    };

    const subHeading = data.sub_heading || data.sub_heading_text || "Let&apos;s Work Together";
    const subHeadingIcon = data.sub_heading_icon || data.sub_heading_image;

    const title = data.title || "Ready to Start Your <span class=\"highlight\">Next Project?</span>";
    const description = data.description || "Get in touch and let's discuss how I can help bring your vision to life.";

    const primaryLabel = data.primary_button_label || "Start a Project";
    const primaryLink = data.primary_button_link || "#";
    const secondaryLabel = data.secondary_button_label || "View Portfolio";
    const secondaryLink = data.secondary_button_link || "#";

    return (
        <section id="contact-closing-cta" className="cta-2 section-spacing">
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
                            <div className="corner-decoration corner-top-left"></div>
                            <div className="corner-decoration corner-bottom-right"></div>
                            <div className="text-center">
                                <div className="section-title section-title-center">
                                    <span className="sub-heading-tag-1">
                                        <div className="sub-heading-image">
                                            {(() => {
                                                const iconUrl = getImageUrl(subHeadingIcon);
                                                if (typeof subHeadingIcon === 'string' && subHeadingIcon.startsWith('<svg')) {
                                                    return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: subHeadingIcon }} />;
                                                }
                                                return (
                                                    <Image 
                                                        src={iconUrl || "/images/home/fast-load.svg"} 
                                                        alt="Icon" 
                                                        width={20} 
                                                        height={20} 
                                                        className="img-fluid" 
                                                        unoptimized
                                                    />
                                                );
                                            })()}
                                        </div>
                                        <span dangerouslySetInnerHTML={{ __html: subHeading }} />
                                    </span>
                                    <h2 dangerouslySetInnerHTML={{ __html: title }} />
                                    <div className="section-para-center">
                                        <p dangerouslySetInnerHTML={{ __html: description }} />
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
                                            const icon = getImageUrl(item.icon) || "/images/home/seo-icon.svg";
                                            return (
                                                <div className="cta-stat-item" key={index}>
                                                    <div className="cta-stat-icon">
                                                        <Image 
                                                            src={icon} 
                                                            className="img-fluid" 
                                                            alt={item.title} 
                                                            height={30} 
                                                            width={30} 
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <h3 className="cta-stat-title">{item.title}</h3>
                                                    <p className="cta-stat-text">{item.text}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* SEO Links */}
                                {data.seo_links && data.seo_links.length > 0 && (
                                    <div className="cta-seo-section">
                                        <p className="cta-seo-title">Explore Our Services</p>
                                        <div className="cta-seo-links">
                                            {data.seo_links.map((link, index) => {
                                                const icon = getImageUrl(link.icon) || "/images/home/seo-icon.svg";
                                                return (
                                                    <a href={link.link} className="cta-seo-link" key={index}>
                                                        <Image 
                                                            src={icon} 
                                                            className="img-fluid" 
                                                            alt={link.label} 
                                                            height={14} 
                                                            width={14} 
                                                            unoptimized
                                                        />
                                                        {link.label}
                                                    </a>
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

export default ContactCTA;
