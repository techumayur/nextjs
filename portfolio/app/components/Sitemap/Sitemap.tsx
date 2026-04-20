"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Sitemap.css';
import Breadcrumb from '@/app/components/Common/Breadcrumb';
import { ACFSitemapPage, ACFImage } from '@/types/acf';


const PreviewMock = ({ style }: { style: string }) => {
    switch (style) {
        case 'hero':
            return <div className="sm-prev-hero"></div>;
        case 'profile':
            return (
                <div className="sm-prev-profile">
                    <span className="sm-prev-avatar"></span>
                    <div className="sm-prev-lines">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            );
        case 'form':
            return (
                <div className="sm-prev-form">
                    <span></span><span></span><span></span>
                    <span className="sm-prev-btn"></span>
                </div>
            );
        case 'grid':
            return (
                <div className="sm-prev-grid2">
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                </div>
            );
        case 'masonry':
            return (
                <div className="sm-prev-masonry">
                    <span></span><span></span><span></span><span></span>
                </div>
            );
        case 'acc':
            return (
                <div className="sm-prev-acc">
                    <span></span><span></span><span></span>
                </div>
            );
        case 'blog':
            return (
                <div className="sm-prev-bloglist">
                    <div className="sm-prev-blogitem">
                        <span className="sm-prev-blogthumb"></span>
                        <div><span></span><span></span></div>
                    </div>
                    <div className="sm-prev-blogitem">
                        <span className="sm-prev-blogthumb"></span>
                        <div><span></span><span></span></div>
                    </div>
                </div>
            );
        case 'tags':
            return (
                <div className="sm-prev-tags">
                    <span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span>
                </div>
            );
        case 'code':
            return (
                <div className="sm-prev-code">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
            );
        default:
            return (
                <div className="sm-prev-lines">
                    <span></span><span></span><span></span><span></span>
                </div>
            );
    }
};

const Sitemap = ({ data }: { data: ACFSitemapPage }) => {
    const banner = data?.sitemap_banner;
    const intro = data?.sitemap_intro;
    const categories = data?.sitemap_categories || [];

    const [expandedCategories, setExpandedCategories] = React.useState<Record<number, boolean>>({});

    const toggleExpand = (index: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Sitemap", active: true }
    ];

    // Helper to extract image URL
    const getImageUrl = (image: ACFImage | undefined | null): string => {
        if (!image) return '';
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && image && 'url' in image) return image.url || '';
        return '';
    };

    const DEFAULT_MAX = 4;

    return (
        <main className="main-content">
            
            
            {/* Sitemap Banner */}
            <section
                id="sitemap-banner"
                className="inner-banner section-spacing"
                style={{
                    background: `linear-gradient(135deg, rgba(11, 102, 106, 0.8), rgba(11, 102, 106, 0.7)), url('${getImageUrl(banner?.background_image)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="banner-content-wrapper text-center">
                                <span className="sub-heading-tag-1">
                                    <div className="sub-heading-image">
                                        {(() => {
                                            const icon = banner?.sub_heading_icon || banner?.sub_heading_image;
                                            const iconUrl = getImageUrl(icon);
                                            if (typeof icon === 'string' && icon.startsWith('<svg')) {
                                                return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: icon }} />;
                                            }
                                            return (
                                                <Image 
                                                    src={iconUrl || "/images/user-1.svg"} 
                                                    alt="Icon" 
                                                    width={20} 
                                                    height={20} 
                                                    className="img-fluid" 
                                                    unoptimized
                                                />
                                            );
                                        })()}
                                    </div>
                                    {banner?.sub_heading || "Sitemap"}
                                </span>
                                <h1 dangerouslySetInnerHTML={{ __html: banner?.title || "Sitemap" }} />
                                <p>{banner?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner-scroll-indicator">
                    <div className="scroll-mouse"></div>
                </div>
            </section>

            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Sitemap Content */}
            <section id="sitemap-content" className="section-spacing pt-0">
                <div className="container">
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8 text-center">
                            <div className="section-title section-title-center">
                                <span className="sub-heading-tag-2">
                                    <div className="sub-heading-image">
                                        {(() => {
                                            const icon = intro?.badge_icon;
                                            const iconUrl = getImageUrl(icon);
                                            if (typeof icon === 'string' && icon.startsWith('<svg')) {
                                                return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: icon }} />;
                                            }
                                            return (
                                                <Image 
                                                    src={iconUrl || "/images/user-2.svg"} 
                                                    alt="Icon" 
                                                    width={20} 
                                                    height={20} 
                                                    className="img-fluid" 
                                                    unoptimized
                                                />
                                            );
                                        })()}
                                    </div>
                                    {intro?.badge_text || "Navigation"}
                                </span>
                                <h2 className="mt-3" dangerouslySetInnerHTML={{ __html: intro?.title || "Complete Sitemap" }} />
                                <div className="section-para-center">
                                    <p>{intro?.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sm-rows">
                        {categories.map((row, index) => {
                            const isExpanded = expandedCategories[index];
                            const visibleLinks = isExpanded ? row.links : row.links?.slice(0, DEFAULT_MAX);
                            const canExpand = row.links && row.links.length > DEFAULT_MAX;

                            return (
                                <div key={index} className="sm-row">
                                    <div className="sm-row-label">
                                        <span 
                                            className="sm-row-icon" 
                                            dangerouslySetInnerHTML={{ __html: row.icon_svg }} 
                                        />
                                        <span className="sm-row-title">{row.title}</span>
                                        <span className="sm-row-count">{row.count || row.links?.length || 0}</span>
                                    </div>
                                    <div className="sm-cards">
                                        {visibleLinks?.map((link, lIndex) => (
                                            <Link
                                                key={lIndex}
                                                href={link.url}
                                                className={`sm-page-card ${link.is_primary ? 'sm-page-card--primary' : ''}`}
                                            >
                                                <div className="sm-page-preview">
                                                    <div className="sm-prev-bar">
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                    <div className="sm-prev-body">
                                                        <PreviewMock style={link.preview_style} />
                                                    </div>
                                                </div>
                                                <span className="sm-page-name">{link.name}</span>
                                            </Link>
                                        ))}

                                        {canExpand && (
                                            <button 
                                                className="sm-show-toggle"
                                                onClick={() => toggleExpand(index)}
                                            >
                                                <span className="sm-toggle-icon">
                                                    {isExpanded ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                                    )}
                                                </span>
                                                <span className="sm-toggle-label">
                                                    {isExpanded ? 'Show Less' : `Show All`}
                                                </span>
                                                {!isExpanded && (
                                                    <span className="sm-toggle-count">({row.links.length})</span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Sitemap;


