"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { WPPortfolioItem, WPTaxonomy } from "@/types/acf";
import { getPortfolioItems, getPortfolioTaxonomies } from "@/app/lib/getPortfolio";
import "./PortfolioProjects.css";

const PER_PAGE = 6;

interface PortfolioProjectsProps {
    initialTaxId?: number | null;
    title?: React.ReactNode;
    subtitle?: string;
    description?: string;
    showFilters?: boolean;
}

const PortfolioProjects = ({
    initialTaxId = null,
    title = null,
    subtitle = "Dive into my full range of work, from experiments to production-grade applications.",
    description,
    showFilters = true
}: PortfolioProjectsProps) => {
    const [projects, setProjects] = useState<WPPortfolioItem[]>([]);
    const [taxonomies, setTaxonomies] = useState<WPTaxonomy[]>([]);
    const [selectedTaxId, setSelectedTaxId] = useState<number | null>(initialTaxId);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const fetchCounter = useRef(0);

    // Fetch taxonomies on mount
    useEffect(() => {
        getPortfolioTaxonomies().then(setTaxonomies);
    }, []);

    const fetchProjects = useCallback(async (reset: boolean = false) => {
        if (isLoadingRef.current && !reset) return;

        const currentFetchId = ++fetchCounter.current;
        isLoadingRef.current = true;
        setLoading(true);

        const nextPage = reset ? 1 : page + 1;

        try {
            const newProjects = await getPortfolioItems(nextPage, PER_PAGE, selectedTaxId || undefined);

            // Only update state if this is still the most recent request
            if (currentFetchId !== fetchCounter.current) return;

            if (reset) {
                setProjects(newProjects);
                setPage(1);
            } else {
                setProjects((prev) => [...prev, ...newProjects]);
                setPage(nextPage);
            }

            setHasMore(newProjects.length === PER_PAGE);
        } catch (error) {
            console.error("Error fetching projects", error);
            if (currentFetchId === fetchCounter.current) setHasMore(false);
        } finally {
            if (currentFetchId === fetchCounter.current) {
                isLoadingRef.current = false;
                setLoading(false);
            }
        }
    }, [page, selectedTaxId]);

    // Handle category change or initial load
    useEffect(() => {
        fetchProjects(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTaxId]);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingRef.current) {
                fetchProjects();
            }
        }, { threshold: 0.1 });

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) observer.disconnect();
        };
    }, [hasMore, fetchProjects]);

    // Outside click for mobile dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (id: number | null) => {
        if (selectedTaxId === id) return;
        setSelectedTaxId(id);
        setIsDropdownOpen(false);
        setPage(1);
        setHasMore(true);
    };

    const selectedTaxName = selectedTaxId === null ? "All Projects" : taxonomies.find(t => t.id === selectedTaxId)?.name || "All Projects";

    const getTags = (itemTaxIds: number[] = []) => {
        return itemTaxIds
            .map(id => {
                const tax = taxonomies.find(t => t.id === id);
                return tax ? { name: tax.name, slug: tax.slug } : null;
            })
            .filter((t): t is { name: string, slug: string } => t !== null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="portfolio-projects" className="section-spacing pt-0">
            <div className="container">
                <div className="section-header">
                    <span className="sub-heading-tag-2">
                        <div className="sub-heading-image">
                            <picture>
                                <Image src="/images/user-2.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                            </picture>
                        </div>
                        My Projects
                    </span>
                    {selectedTaxId === null ? (
                        typeof title === 'string' ? (
                            <h2 dangerouslySetInnerHTML={{ __html: title }} />
                        ) : (
                            <h2>{title || <>All <span className="highlight">Projects</span></>}</h2>
                        )
                    ) : (
                        <h2>Projects in <span className="highlight">{selectedTaxName}</span></h2>
                    )}
                    <div className="section-para-center">
                        <p dangerouslySetInnerHTML={{ __html: description || subtitle || "" }} />
                    </div>
                </div>

                {showFilters && (
                    <div className="filter-nav-container">
                        <div className="filter-nav d-none d-md-flex">
                            <button
                                className={`filter-pill ${selectedTaxId === null ? 'active' : ''}`}
                                onClick={() => handleTabClick(null)}
                            >
                                All
                            </button>
                            {taxonomies.map(tax => (
                                <button
                                    key={tax.id}
                                    className={`filter-pill ${selectedTaxId === tax.id ? 'active' : ''}`}
                                    onClick={() => handleTabClick(tax.id)}
                                >
                                    {tax.name}
                                </button>
                            ))}
                        </div>

                        <div className="mobile-filter-dropdown d-md-none" ref={dropdownRef}>
                            <button
                                className="filter-dropdown-toggle"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>{selectedTaxName}</span>
                            </button>
                            {isDropdownOpen && (
                                <div className="filter-dropdown-menu show">
                                    <button
                                        className={`filter-dropdown-item ${selectedTaxId === null ? 'active' : ''}`}
                                        onClick={() => handleTabClick(null)}
                                    >
                                        All Projects
                                    </button>
                                    {taxonomies.map(tax => (
                                        <button
                                            key={tax.id}
                                            className={`filter-dropdown-item ${selectedTaxId === tax.id ? 'active' : ''}`}
                                            onClick={() => handleTabClick(tax.id)}
                                        >
                                            {tax.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="portfolio-grid">
                    {projects.map((item) => {
                        const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
                        const imageUrl = featuredMedia?.media_details?.sizes?.['medium']?.source_url ||
                            featuredMedia?.media_details?.sizes?.['thumbnail']?.source_url ||
                            featuredMedia?.source_url;
                        const tags = getTags(item['portfolio-taxonomy']);

                        return (
                            <div key={item.id} className="project-card">
                                <Link href={`/portfolio/${item.slug}`} className="project-image-wrapper">
                                    {imageUrl ? (
                                        <Image
                                            className="project-image"
                                            src={imageUrl}
                                            alt={featuredMedia?.alt_text || item.title.rendered}
                                            loading="lazy"
                                            width={800}
                                            height={500}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="project-image bg-dark d-flex align-items-center justify-content-center text-white">
                                            No Image
                                        </div>
                                    )}
                                    <div className="project-date-badge">{formatDate(item.date)}</div>
                                    <div className="curve-overlay"></div>
                                </Link>
                                <div className="project-content">
                                    <div className="project-tags">
                                        {tags.map((tag, i) => (
                                            <Link href={`/portfolio/category/${tag.slug}`} className="tag" key={i}>{tag.name}</Link>
                                        ))}
                                    </div>
                                    <Link href={`/portfolio/${item.slug}`} className="project-info-row d-block text-decoration-none">
                                        <h3 className="project-title" dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
                                        <div className="project-description" dangerouslySetInnerHTML={{ __html: item.excerpt?.rendered || item.content?.rendered || "" }} />
                                    </Link>
                                    <Link href={`/portfolio/${item.slug}`} className="primary-btn mt-auto text-decoration-none">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        View Project
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div id="sentinel" ref={sentinelRef} className="loader-container">
                    {loading && (
                        <div className="loader-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioProjects;
