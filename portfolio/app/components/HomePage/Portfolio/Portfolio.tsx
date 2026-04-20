"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ACFPortfolio, WPTaxonomy, WPPortfolioItem } from '@/types/acf';
import './Portfolio.css';

export interface PortfolioDataProps {
    data: ACFPortfolio | null;
    items: WPPortfolioItem[];
    taxonomies: WPTaxonomy[];
}

const ProjectCard = ({ item, taxonomies }: { item: WPPortfolioItem, taxonomies: WPTaxonomy[] }) => {
    const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
    const itemTax = item['portfolio-taxonomy'] || [];
    const tags = itemTax.map(id => taxonomies.find(t => t.id === id)?.name).filter(Boolean);
    const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <Link href={`/portfolio/${item.slug}`} className="project-card">
            <div className="project-image-wrapper">
                {featuredMedia?.source_url ? (
                    <Image className="project-image" src={featuredMedia.source_url} alt={featuredMedia.alt_text || item.title.rendered} width={1000} height={320} unoptimized />
                ) : (
                    <div className="project-image" style={{ backgroundColor: '#2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
                        No Image
                    </div>
                )}
                <div className="project-date-badge">{date}</div>
                <div className="curve-overlay"></div>
            </div>
            <div className="project-tags">
                {tags.map((tag, i) => <span className="tag" key={i}>{tag}</span>)}
            </div>
            <div className="project-content">
                <div className="project-info-row">
                    <h3 className="project-title" dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                    <div className="primary-btn">
                        <span className="primary-btn-icon">
                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                        </span>
                        View Project
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Portfolio = ({ data, items, taxonomies }: PortfolioDataProps) => {
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const activeData = activeTab === 'all' 
        ? { label: 'All Projects', count: items?.length || 0 }
        : (taxonomies?.find(t => t.id === activeTab)
            ? { label: taxonomies.find(t => t.id === activeTab)!.name, count: taxonomies.find(t => t.id === activeTab)!.count }
            : { label: 'Select Category', count: '' });
    
    // Construct the data-selected string properly
    const dataSelectedString = activeData.count !== '' && activeData.count !== undefined
        ? `${activeData.label} (${activeData.count})` 
        : activeData.label;

    const handleTabClick = (id: number | 'all') => {
        setActiveTab(id);
        if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
            setTimeout(() => setIsDropdownOpen(false), 300);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth <= 1024 && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
            const sidebar = document.querySelector("#home-portfolio .filter-column") as HTMLElement;
            const projectsColumn = document.querySelector("#home-portfolio .projects-column") as HTMLElement;
            const portfolioContent = document.querySelector("#home-portfolio .portfolio-content") as HTMLElement;
            
            if (!sidebar || !projectsColumn || !portfolioContent) return;

            const HEADER_OFFSET = 100;
            
            ScrollTrigger.create({
                id: "portfolioSidebarPin",
                trigger: portfolioContent,
                start: "top+=" + HEADER_OFFSET + " top",
                end: () => {
                    const diff = projectsColumn.offsetHeight - sidebar.offsetHeight;
                    return "+=" + (diff > 0 ? diff : 0);
                },
                pin: sidebar,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });
            ScrollTrigger.refresh();
        });

        return () => mm.revert();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        }, 150);
        return () => clearTimeout(timeoutId);
    }, [activeTab]);

    if (!data) return null;

    return (
        <React.Fragment>
            <section id="home-portfolio" className="portfolio-section section-spacing">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Header Section */}
                            <div className="section-header">
                                <div className="header-left">
                                    <div className="section-title">
                                        <span className="sub-heading-tag-1">
                                            <div className="sub-heading-image">
                                                <picture>
                                                    <img src="/images/user-1.svg" alt="Icon" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                                </picture>
                                            </div>
                                            {data.sub_heading}
                                        </span>
                                        <h2 dangerouslySetInnerHTML={{ __html: data.heading || "" }}></h2>
                                        <div className="section-para-left">
                                            <p>{data.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href={data.button_link || "#"} className="primary-btn d-none d-lg-inline-flex">
                                    <span className="primary-btn-icon">
                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    {data.button_label}
                                </Link>
                            </div>

                            {/* Two Column Layout */}
                            <div className="portfolio-content">
                                {/* LEFT COLUMN - Filter */}
                                <div className="filter-column">
                                    <div className="filter-container">
                                        <div className="filter-header">
                                            <div className="filter-icon">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </div>
                                            <div className="filter-title">
                                                <h3>{data.filter_title}</h3>
                                                <p>{data.filter_subtitle}</p>
                                            </div>
                                            <div className="filter-count" id="totalCount">{items?.length || 0}</div>
                                        </div>
                                        <div 
                                            className={`filter-tabs ${isDropdownOpen ? 'open' : ''}`} 
                                            id="portfolioTabs" 
                                            role="tablist"
                                            ref={dropdownRef}
                                            data-selected={dataSelectedString}
                                            onClick={(e) => {
                                                if (window.innerWidth <= 1024 && !(e.target as HTMLElement).closest('.filter-tab')) {
                                                    setIsDropdownOpen(!isDropdownOpen);
                                                }
                                            }}
                                        >
                                            {/* All Projects */}
                                            <div className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`} id="all-tab" role="tab" data-count={items?.length || 0} onClick={() => handleTabClick('all')}>
                                                <div className="filter-tab-icon">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                                <div className="filter-tab-content">
                                                    <div className="filter-tab-label">All Projects</div>
                                                    <p className="filter-tab-desc">View everything</p>
                                                </div>
                                                <div className="filter-tab-count">{items?.length || 0}</div>
                                            </div>

                                            {/* Dynamic Taxonomies */}
                                            {taxonomies?.map(tax => (
                                                <div className={`filter-tab ${activeTab === tax.id ? 'active' : ''}`} id={`${tax.slug}-tab`} role="tab" data-count={tax.count} key={tax.id} onClick={() => handleTabClick(tax.id)}>
                                                    <div className="filter-tab-icon">
                                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                                        </svg>
                                                    </div>
                                                    <div className="filter-tab-content">
                                                        <div className="filter-tab-label">{tax.name}</div>
                                                        <p className="filter-tab-desc">{tax.description || `${tax.name} Projects`}</p>
                                                    </div>
                                                    <div className="filter-tab-count">{tax.count}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN - Projects */}
                                <div className="tab-content projects-column" id="portfolioTabsContent">
                                    {/* All Projects Pane */}
                                    <div className={`tab-pane fade ${activeTab === 'all' ? 'show active' : ''}`} id="all" role="tabpanel">
                                        {items?.map(item => (
                                            <ProjectCard key={item.id} item={item} taxonomies={taxonomies} />
                                        ))}
                                    </div>
                                    
                                    {/* Taxonomy Panes */}
                                    {taxonomies?.map(tax => (
                                        <div className={`tab-pane fade ${activeTab === tax.id ? 'show active' : ''}`} id={tax.slug} key={tax.id} role="tabpanel">
                                            {items?.filter(item => item['portfolio-taxonomy']?.includes(tax.id)).map(item => (
                                                <ProjectCard key={item.id} item={item} taxonomies={taxonomies} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <Link href={data.button_link || "#"} className="primary-btn d-inline-flex d-lg-none">
                                    <span className="primary-btn-icon">
                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    {data.button_label}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Portfolio;
