"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ACFSourceCodeSection, WPSourceCodeItem, WPSourceCodeTaxonomy } from '@/types/acf';
import './SourceCode.css';

interface SourceCodeProps {
    sectionData: ACFSourceCodeSection | null;
    projects: WPSourceCodeItem[];
    taxonomies: WPSourceCodeTaxonomy[];
}

const SourceCode = ({ sectionData, projects, taxonomies }: SourceCodeProps) => {
    // Helper to get image URL with full project context for better fallbacks
    const getProjectImage = (project: WPSourceCodeItem): string => {
        // 1. Try ACF thumbnail (if resolved to string or has URL)
        const acfThumb = project.acf?.thumbnail;
        if (typeof acfThumb === 'string' && acfThumb) return acfThumb;
        if (typeof acfThumb === 'object' && acfThumb?.url) return acfThumb.url;
        
        // 2. Try Embedded Featured Media (Direct from WordPress response)
        const embeddedThumb = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        if (embeddedThumb) return embeddedThumb;
        
        // 3. Fallback to any string result from getImageUrl (for legacy support if needed)
        return getImageUrl(acfThumb);
    };

    const getTaxonomyNames = (ids: number[] | undefined) => {
        if (!ids || !taxonomies) return [];
        return taxonomies
            .filter(term => ids.includes(term.id))
            .map(term => term.name);
    };

    const getImageUrl = (image: string | number | { url: string } | undefined): string => {
        if (!image) return '';
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && image.url) return image.url;
        return '';
    };

    return (
        <section id="home-source-code" className="source-code section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <picture>
                                        <Image 
                                            src={(typeof sectionData?.sub_heading_icon === 'string' && sectionData.sub_heading_icon !== "")
                                                ? sectionData.sub_heading_icon
                                                : getImageUrl(sectionData?.sub_heading_image) || "/images/user-1.svg"} 
                                            alt="Icon" 
                                            width={20} 
                                            height={20} 
                                            loading="lazy" 
                                            className="img-fluid"
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                    </picture>
                                </div>
                                {sectionData?.sub_heading}
                            </span>
                            <h2>
                                {sectionData?.title && (
                                    <span dangerouslySetInnerHTML={{ __html: sectionData.title }} />
                                )}
                            </h2>
                            <div className="section-para-center">
                                <p>{sectionData?.description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12">
                        {/* Desktop View (Bento Grid) */}
                        <div className="bento-grid d-none d-lg-grid">
                            {/* Debug data for the first project */}
                            {/* <pre style={{ display: 'none' }}>{JSON.stringify(projects[0]?.acf, null, 2)}</pre> */}
                            {(projects || []).map((project, idx) => {
                                const sizeClass = project.acf?.bento_size || (idx === 0 || idx === 5 ? 'large' : idx === 1 || idx === 4 ? 'medium' : 'small');
                                return (
                                    <div key={project.id} className={`bento-card bento-${sizeClass}`}>
                                        {project.acf?.is_featured && <span className="feature-tag">Featured</span>}
                                        <div className="bento-image">
                                            {getProjectImage(project) && (
                                                <Image 
                                                    src={getProjectImage(project)} 
                                                    alt={project.title?.rendered || "Project Thumbnail"} 
                                                    width={500}
                                                    height={300}
                                                    style={{ height: 'auto' }}
                                                    unoptimized
                                                />
                                            )}
                                        </div>
                                        <div className="bento-content">
                                            <div className="code-badges">
                                                {getTaxonomyNames(project['source-code-taxonomy']).map((name, tIdx) => (
                                                    <span key={tIdx} className="code-badge badge-tech">{name}</span>
                                                ))}
                                                {Array.isArray(project.acf?.technologies) && project.acf.technologies.map((tech: { name: string }, tIdx: number) => (
                                                    <span key={tIdx} className="code-badge badge-tech">{tech.name}</span>
                                                ))}
                                                {project.acf?.difficulty_level && (
                                                    <span className="code-badge badge-level">{project.acf.difficulty_level}</span>
                                                )}
                                            </div>
                                            <h3 dangerouslySetInnerHTML={{ __html: project.title?.rendered }} />
                                            <div className="bento-description" dangerouslySetInnerHTML={{ __html: project.acf?.description || project.content?.rendered }} />
                                            <div className="bento-footer">
                                                <div className="bento-actions">
                                                    <Link href={`/source-code/${project.slug}`} className="icon-btn btn-view" title="View Details">
                                                        <Image src="/images/home/view.svg" alt="View" width={25} height={25} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                                                    </Link>
                                                    <a href={project.acf?.download_button || project.acf?.download_link || project.acf?.license_section?.download_link || "#"} className="icon-btn btn-download" title="Download Source" target="_blank" rel="noopener noreferrer">
                                                        <Image src="/images/home/downloads.svg" alt="Download" width={25} height={25} loading="lazy" className="img-fluid" style={{ height: 'auto' }} />
                                                    </a>
                                                </div>
                                                <div className="code-stats">
                                                    {project.acf?.downloads && (
                                                        <div className="stat-item">
                                                            <Image src="/images/home/downloads.svg" alt="Downloads" width={15} height={15} loading="lazy" style={{ height: 'auto' }} />
                                                            <span>{project.acf.downloads}</span>
                                                        </div>
                                                    )}
                                                    {project.acf?.rating && (
                                                        <div className="stat-item">
                                                            <Image src="/images/home/star-icon.svg" alt="Rating" width={15} height={15} loading="lazy" style={{ height: 'auto' }} />
                                                            <span>{project.acf.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile View (Swiper) */}
                        <div className="d-block d-lg-none mt-4">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000 }}
                                className="sourceCodeSwiper"
                            >
                                {(projects || []).map((project) => (
                                    <SwiperSlide key={project.id} className="mb-5">
                                        <div className="bento-card bento-medium h-100">
                                            <div className="bento-image">
                                                {getProjectImage(project) && (
                                                    <Image 
                                                        src={getProjectImage(project)} 
                                                        alt={project.title?.rendered || "Project Thumbnail"} 
                                                        width={500}
                                                        height={300}
                                                        style={{ height: 'auto' }}
                                                        unoptimized
                                                    />
                                                )}
                                            </div>
                                            <div className="bento-content">
                                            <div className="code-badges">
                                                {getTaxonomyNames(project['source-code-taxonomy']).slice(0, 2).map((name, tIdx) => (
                                                    <span key={tIdx} className="code-badge badge-tech">{name}</span>
                                                ))}
                                                {Array.isArray(project.acf?.technologies) && project.acf.technologies.slice(0, 2).map((tech: { name: string }, tIdx: number) => (
                                                    <span key={tIdx} className="code-badge badge-tech">{tech.name}</span>
                                                ))}
                                                <span className="code-badge badge-level">{project.acf?.difficulty_level}</span>
                                            </div>
                                                <h3 dangerouslySetInnerHTML={{ __html: project.title?.rendered }} />
                                                <div className="bento-description" dangerouslySetInnerHTML={{ __html: project.acf?.description || project.content?.rendered }} />
                                                <div className="bento-footer">
                                                    <div className="bento-actions">
                                                        <Link href={`/source-code/${project.slug}`} className="icon-btn btn-view" title="View Details">
                                                            <Image src="/images/home/view.svg" alt="View" width={25} height={25} loading="lazy" style={{ height: 'auto' }} />
                                                        </Link>
                                                        <a href={project.acf?.download_button || project.acf?.download_link || project.acf?.license_section?.download_link || "#"} className="icon-btn btn-download" title="Download Source" target="_blank" rel="noopener noreferrer">
                                                            <Image src="/images/home/downloads.svg" alt="Download" width={25} height={25} loading="lazy" style={{ height: 'auto' }} />
                                                        </a>
                                                    </div>
                                                    <div className="code-stats">
                                                        {project.acf?.downloads && (
                                                            <div className="stat-item">
                                                                <Image src="/images/home/downloads.svg" alt="Downloads" width={15} height={15} loading="lazy" style={{ height: 'auto' }} />
                                                                <span>{project.acf.downloads}</span>
                                                            </div>
                                                        )}
                                                        {project.acf?.rating && (
                                                            <div className="stat-item">
                                                                <Image src="/images/home/star-icon.svg" alt="Rating" width={15} height={15} loading="lazy" style={{ height: 'auto' }} />
                                                                <span>{project.acf.rating}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="cta-card">
                            <div className="cta-pattern"></div>
                            <div className="cta-content-wrapper">
                                <div className="cta-left">
                                    <div className="cta-badge">
                                        <Image src={getImageUrl(sectionData?.cta_badge_icon) || "/images/home/star-icon.svg"} alt="Icon" width={15} height={15} loading="lazy" style={{ height: 'auto' }} unoptimized />
                                        <span>{sectionData?.cta_badge_text}</span>
                                    </div>
                                    <h3>
                                        {sectionData?.cta_title && (
                                            <span dangerouslySetInnerHTML={{ __html: sectionData.cta_title }} />
                                        )}
                                    </h3>
                                    <p>{sectionData?.cta_description}</p>
                                    
                                    <div className="cta-stats-grid">
                                        {sectionData?.cta_stats?.map((stat, idx) => (
                                            <div key={idx} className="cta-stat-box">
                                                <strong>{stat.number}</strong>
                                                <span>{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Link href="/source-code" className="primary-btn">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        {sectionData?.cta_button_label || "Explore All Source Code"}
                                    </Link>
                                </div>
                                
                                <div className="cta-right">
                                    <div className="cta-visual-grid">
                                        {sectionData?.cta_features?.map((feature, idx) => (
                                            <div key={idx} className="cta-visual-card">
                                                <div className="cta-visual-icon">
                                                        <Image src={getImageUrl(feature.icon) || "/images/home/star-icon.svg"} alt={feature.title} width={30} height={30} loading="lazy" style={{ height: 'auto' }} unoptimized />
                                                </div>
                                                <div className="cta-visual-text">
                                                    <strong>{feature.title}</strong>
                                                    <span>{feature.description}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SourceCode;