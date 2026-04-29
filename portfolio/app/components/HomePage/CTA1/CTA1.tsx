"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ACFCTA, ACFImage } from '@/types/acf';

interface CTA1Props {
    data: ACFCTA | null;
}

export default function CTA1({ data }: CTA1Props) {
    if (!data) return null;

    const getImageUrl = (image: ACFImage | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        if (typeof image === "object" && "url" in image) return image.url || "";
        return "";
    };

    const badgeIcon = getImageUrl(data.sub_heading_icon || data.icon) || "/images/home/fast-load.svg";
    const heading = data.heading || data.title || "Let's Build Something Amazing Together";
    const content = data.content || data.description || "I'm excited to hear about your ideas and help bring them to life. Whether you have a clear vision or need guidance, I'm here to collaborate and create something amazing together.";
    const primaryLabel = data.primary_button_label;
    const primaryLink = data.primary_button_link || "#";
    const secondaryLabel = data.secondary_button_label;
    const secondaryLink = data.secondary_button_link || "#";
    const iconLabel = data.icon_label || "Let's Get Started";
    const infoItems = data.info_items || [];

    return (
        <section id="home-cta-1" className="cta-1 section-spacing">
            <div className="container">
                <div className="cta-card position-relative">
                    <div className="float-circle circle-1"></div>
                    <div className="float-circle circle-2"></div>
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7 text-lg-start text-center">
                            <span className="badge mb-3">
                                    <Image 
                                        src={badgeIcon} 
                                        alt="Badge Icon" 
                                        width={20} 
                                        height={20} 
                                        className="img-fluid" 
                                        loading="lazy" 
                                        style={{ height: 'auto' }}
                                        unoptimized
                                    />
                                {iconLabel}
                            </span>
                            <h2 className="main-heading" dangerouslySetInnerHTML={{ __html: heading }} />
                            <div className="sub-text mx-auto mx-lg-0" dangerouslySetInnerHTML={{ __html: content }} />
                            <div className="cta-1-btn-group py-5">
                                <Link href={primaryLink} className="primary-btn">
                                    <span className="primary-btn-icon">
                                        <svg
                                            width="10"
                                            className="primary-btn-svg-after"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15">
                                            <path
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg
                                            className="primary-btn-svg-before"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15">
                                            <path
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    {primaryLabel}
                                </Link>
                                <Link href={secondaryLink} className="secondary-btn">
                                    <span>{secondaryLabel}</span>
                                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                                        <path d="M1,5 L11,5"></path>
                                        <polyline points="8 1 12 5 8 9"></polyline>
                                    </svg>
                                </Link>
                            </div>
                            <div className="d-flex flex-wrap justify-content-lg-start justify-content-center gap-3 stats-badges">
                                {infoItems.slice(0, 3).map((item, index) => (
                                    <div key={index} className="stat-badge text-center">
                                        <span className="stat-number">{item.value}</span>
                                        <span className="stat-label">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-lg-5 text-center">
                            <div className="illustration-container mx-auto">
                                <div className="browser-bar">
                                    <div className="browser-dot dot-red"></div>
                                    <div className="browser-dot dot-yellow"></div>
                                    <div className="browser-dot dot-green"></div>
                                </div>
                                <div className="monitor-screen text-start">
                                    <p className="mb-1 text-muted"><code>&lt;{data.right_side_title || "Frontend Developer"}&gt;</code></p>
                                    <p className="mb-1 text-muted"><code>{data.right_side_subtitle || "HTML • CSS • JS • React • WordPress"}</code></p>
                                    <p className="text-muted mb-0"><code>{data.right_side_description || "Building creative digital experiences ⚡"}</code></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
