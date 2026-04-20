"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { WPPortfolioItem, WPTerm } from "@/types/acf";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './RelatedProjects.css';

interface RelatedProjectsProps {
    projects: WPPortfolioItem[];
}

const RelatedProjects = ({ projects }: RelatedProjectsProps) => {
    if (!projects || projects.length === 0) return null;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getImageUrl = (project: WPPortfolioItem) => {
        const featuredMedia = project._embedded?.['wp:featuredmedia']?.[0];
        return featuredMedia?.media_details?.sizes?.['medium']?.source_url ||
               featuredMedia?.media_details?.sizes?.['thumbnail']?.source_url ||
               featuredMedia?.source_url ||
               null;
    };

    const getTags = (project: WPPortfolioItem) => {
        const terms = project._embedded?.['wp:term'] || [];
        const cats = terms.find(group => group[0]?.taxonomy === 'portfolio-taxonomy') || [];
        return cats.slice(0, 2).map((cat: WPTerm) => cat.name as string);
    };

    return (
        <section id="pd-related-projects" className="section-spacing">
            <div className="container">
                <div className="section-title text-center mb-5">
                    <span className="sub-heading-tag-1">
                        <div className="sub-heading-image">
                            <picture>
                                <Image src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" className="img-fluid" />
                            </picture>
                        </div>
                        DISCOVER MORE
                    </span>
                    <h2>Related <span className="highlight">Projects</span></h2>
                </div>

                {/* Related Projects: Desktop Grid */}
                <div className="row g-4 justify-content-center d-none d-md-flex">
                    {projects.map((project) => (
                        <div className="col-lg-4 col-md-6" key={project.id}>
                            <Link href={`/portfolio/${project.slug}`} className="project-card">
                                <div className="project-image-wrapper">
                                    {getImageUrl(project) ? (
                                        <Image
                                            className="project-image"
                                            src={getImageUrl(project)!}
                                            alt={project._embedded?.['wp:featuredmedia']?.[0]?.alt_text || project.title.rendered}
                                            width={800}
                                            height={500}
                                            loading="lazy"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="project-image bg-dark d-flex align-items-center justify-content-center text-white">No Image</div>
                                    )}
                                    <div className="project-date-badge">{formatDate(project.date)}</div>
                                    <div className="curve-overlay"></div>
                                </div>
                                <div className="project-content">
                                    <div className="project-tags">
                                        {getTags(project).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="project-info-row">
                                        <h4 className="project-title" dangerouslySetInnerHTML={{ __html: project.title.rendered }} />
                                        <div className="project-description" dangerouslySetInnerHTML={{ __html: project.excerpt?.rendered || "" }} />
                                    </div>
                                    <div className="primary-btn">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        View Project
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Related Projects: Mobile Slider */}
                <div id="related-projects-slider" className="d-md-none">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1.5,
                                spaceBetween: 25,
                            }
                        }}
                        className="related-projects-container"
                    >
                        {projects.map((project) => (
                            <SwiperSlide key={project.id}>
                                <Link href={`/portfolio/${project.slug}`} className="project-card">
                                    <div className="project-image-wrapper">
                                        {getImageUrl(project) ? (
                                            <Image
                                                className="project-image"
                                                src={getImageUrl(project)!}
                                                alt={project._embedded?.['wp:featuredmedia']?.[0]?.alt_text || project.title.rendered}
                                                width={800}
                                                height={500}
                                                loading="lazy"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="project-image bg-dark d-flex align-items-center justify-content-center text-white">No Image</div>
                                        )}
                                        <div className="project-date-badge">{formatDate(project.date)}</div>
                                        <div className="curve-overlay"></div>
                                    </div>
                                    <div className="project-content">
                                        <h4 className="project-title" dangerouslySetInnerHTML={{ __html: project.title.rendered }} />
                                        <div className="project-description" dangerouslySetInnerHTML={{ __html: project.excerpt?.rendered || "" }} />
                                        <div className="primary-btn">View Project</div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default RelatedProjects;
