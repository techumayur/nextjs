"use client";
import React from 'react';
import Link from 'next/link';
import { ACFCTA, ACFImage } from '@/types/acf';

interface SourceCodeCTAProps {
    data: ACFCTA | null | undefined;
}

export default function SourceCodeCTA({ data }: SourceCodeCTAProps) {
    if (!data) return null;

    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const badgeIcon = data?.icon;
    const title = data?.heading;
    const description = data?.content;
    const primaryLabel = data?.primary_button_label;
    const primaryLink = data?.primary_button_link;
    const secondaryLabel = data?.secondary_button_label;
    const secondaryLink = data?.secondary_button_link;
    const iconLabel = data?.icon_label;
    const infoItems = data?.info_items || [];

    return (
        <section id="source-code-cta" className="cta-1 section-spacing">
            <div className="container">
                <div className="cta-card position-relative">
                    <div className="float-circle circle-1"></div>
                    <div className="float-circle circle-2"></div>
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7 text-lg-start text-center">
                            {(iconLabel || badgeIcon) && (
                                <span className="sub-heading-tag-2 mb-3">
                                    <div className="sub-heading-image">
                                        {badgeIcon ? (
                                            (typeof badgeIcon === 'string' && badgeIcon.trim().startsWith('<svg')) ? (
                                                <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: badgeIcon }} />
                                            ) : (
                                                <picture>
                                                    <img
                                                        src={getImageUrl(badgeIcon)}
                                                        alt="Icon"
                                                        width="14"
                                                        height="14"
                                                        className="img-fluid"
                                                    />
                                                </picture>
                                            )
                                        ) : null}
                                    </div>
                                    {iconLabel}
                                </span>
                            )}
                            {title && <h2 className="main-heading" dangerouslySetInnerHTML={{ __html: title }} />}
                            {description && (
                                <div className="sub-text mx-auto mx-lg-0" dangerouslySetInnerHTML={{ __html: description }} />
                            )}
                            {(primaryLink || secondaryLink) && (
                                <div className="cta-1-btn-group py-5">
                                    {primaryLink && primaryLabel && (
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
                                    )}
                                    {secondaryLink && secondaryLabel && (
                                        <Link href={secondaryLink} className="secondary-btn">
                                            <span>{secondaryLabel}</span>
                                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                                <path d="M1,5 L11,5"></path>
                                                <polyline points="8 1 12 5 8 9"></polyline>
                                            </svg>
                                        </Link>
                                    )}
                                </div>
                            )}
                            {infoItems && infoItems.length > 0 && (
                                <div className="d-flex flex-wrap justify-content-lg-start justify-content-center gap-3 stats-badges">
                                    {infoItems.slice(0, 3).map((item, index) => (
                                        <div key={index} className="stat-badge text-center">
                                            <span className="stat-number">{item.value}</span>
                                            <span className="stat-label">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-lg-5 text-center">
                            {(data.right_side_title || data.right_side_subtitle || data.right_side_description) && (
                                <div className="illustration-container mx-auto">
                                    <div className="browser-bar">
                                        <div className="browser-dot dot-red"></div>
                                        <div className="browser-dot dot-yellow"></div>
                                        <div className="browser-dot dot-green"></div>
                                    </div>
                                    <div className="monitor-screen text-start">
                                        {data.right_side_title && <p className="mb-1 text-muted"><code>&lt;{data.right_side_title}&gt;</code></p>}
                                        {data.right_side_subtitle && <p className="mb-1 text-muted"><code>{data.right_side_subtitle}</code></p>}
                                        {data.right_side_description && <p className="text-muted mb-0"><code>{data.right_side_description}</code></p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
