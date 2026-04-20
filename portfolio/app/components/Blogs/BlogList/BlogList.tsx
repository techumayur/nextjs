'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import './BlogList.css';
import type { WPBlogPostExtended, ACFBlogListSection } from '@/types/blogs';

// ─── Props ───────────────────────────────────────────────────────────────────
interface BlogListProps {
    posts?: WPBlogPostExtended[];
    categories?: { id: number; name: string; slug: string; count: number }[];
    config?: ACFBlogListSection | null;
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' }
];

// Dynamic years will be computed from posts


export default function BlogList(props: BlogListProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogListContent {...props} />
        </Suspense>
    );
}

const BlogListContent = ({ posts = [], categories = [], config }: BlogListProps) => {
    // ── Derive data source: real WP posts or static fallback ──
    const catNamesMap = useMemo(() => {
        const m: Record<number, string> = {};
        categories.forEach(c => { m[c.id] = c.name; });
        return m;
    }, [categories]);

    const catMap = useMemo(() => {
        const m: Record<number, string> = {};
        categories.forEach(c => { m[c.id] = c.slug; });
        return m;
    }, [categories]);

    // Map WP posts → internal format
    const allBlogs = useMemo(() => {
        if (posts.length > 0) return posts.map(p => {
            const d = new Date(p.date);
            const dateBadge = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            let featuredImage = p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
            if (!featuredImage && p.acf?.featured_image) {
                const acfImage = p.acf.featured_image;
                featuredImage = typeof acfImage === 'string' ? acfImage : (acfImage.url ?? '');
            }
            if (!featuredImage) featuredImage = '/images/blogs/blogs-banner-mayur.jpg';

            const author = p._embedded?.author?.[0]?.name ?? 'Techu Mayur';
            const catIds: number[] = p.categories ?? [];
            const cat = catIds.length > 0 ? catMap[catIds[0]] ?? 'uncategorized' : 'uncategorized';
            const categoryName = catIds.length > 0 ? catNamesMap[catIds[0]] ?? '' : '';

            return {
                id: p.id,
                cat,
                categoryName,
                date: p.date.slice(0, 10),
                dateBadge,
                tag: p.acf?.tag_code ?? 'POST',
                title: p.title.rendered.replace(/&amp;/g, '&').replace(/&#8217;/g, "'"),
                author,
                views: parseInt(p.acf?.views_count ?? '0') || 0,
                viewsLabel: p.acf?.views_count ?? '0',
                image: featuredImage,
                excerpt: p.excerpt?.rendered.replace(/<[^>]+>/g, '').trim() ?? '',
                link: p.link ? `/blog/${p.slug}` : '#',
                readTime: p.acf?.read_time ?? '5 min read',
                isFeatured: p.acf?.is_featured ?? false,
            };
        });
        return [];
    }, [posts, catMap, catNamesMap]);

    // Category options: dynamically generated
    const categoryOptions = useMemo(() => {
        if (categories.length > 0) {
            return [
                { value: 'all', label: 'All Categories' },
                ...categories.filter(c => c.count > 0).map(c => ({ value: c.slug, label: c.name }))
            ];
        }
        return [{ value: 'all', label: 'All Categories' }];
    }, [categories]);

    // Dynamic years based on fetched posts
    const dynamicYears = useMemo(() => {
        const yearsSet = new Set<string>();
        posts.forEach(p => {
            const y = p.date?.slice(0, 4);
            if (y) yearsSet.add(y);
        });
        const uniqYears = Array.from(yearsSet).sort().reverse();
        return [{ value: 'all', label: 'All Years' }, ...uniqYears.map(y => ({ value: y, label: y }))];
    }, [posts]);

    const initialCount = config?.posts_per_page === -1 ? 999999 : (config?.posts_per_page || 6);
    const batchSize = config?.load_more_batch || 3;

    const searchParams = useSearchParams();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['all']);
    
    // Sync URL params to state
    useEffect(() => {
        const query = searchParams.get('search');
        const cat = searchParams.get('category');
        
        if (query) setSearchQuery(query);
        if (cat) setSelectedCategories([cat]);
    }, [searchParams]);

    const [sortBy, setSortBy] = useState('newest');
    const [selectedYears, setSelectedYears] = useState(['all']);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>('category');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const blogSuggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return allBlogs.filter(b => 
            b.title.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [searchQuery, allBlogs]);

    const toggleMobileAccordion = (key: string) => {
        setOpenMobileAccordion(prev => prev === key ? null : key);
    };

    const sentinelRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown && filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
            if (showSuggestions && searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown, showSuggestions]);

    const filteredBlogs = useMemo(() => {
        let blogs = [...allBlogs];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            blogs = blogs.filter(b => b.title.toLowerCase().includes(query) || b.excerpt.toLowerCase().includes(query));
        }
        if (!selectedCategories.includes('all')) {
            blogs = blogs.filter(b => selectedCategories.includes(b.cat));
        }
        if (!selectedYears.includes('all')) {
            blogs = blogs.filter(b => selectedYears.some(y => b.date.startsWith(y)));
        }
        if (sortBy === 'newest') blogs.sort((a, b) => b.date.localeCompare(a.date));
        else if (sortBy === 'oldest') blogs.sort((a, b) => a.date.localeCompare(b.date));
        else if (sortBy === 'popular') blogs.sort((a, b) => b.views - a.views);
        return blogs;
    }, [allBlogs, searchQuery, selectedCategories, sortBy, selectedYears]);

    const displayedBlogs = filteredBlogs.slice(0, visibleCount);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !isLoading && visibleCount < filteredBlogs.length) {
                setIsLoading(true);
                setTimeout(() => {
                    setVisibleCount(prev => prev + batchSize);
                    setIsLoading(false);
                }, 800);
            }
        }, { rootMargin: '100px' });
        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [isLoading, visibleCount, filteredBlogs.length, batchSize]);

    const toggleMultiSelect = (val: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (val === 'all') {
            setter(['all']);
        } else {
            const next = current.includes(val) ? current.filter(v => v !== val) : [...current.filter(v => v !== 'all'), val];
            setter(next.length === 0 ? ['all'] : next);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategories(['all']);
        setSortBy('newest');
        setSelectedYears(['all']);
        setVisibleCount(initialCount);
    };

    return (
        <>
            {/* ==============================
               BLOG FILTERS + VIEW TOGGLE
               ============================== */}
            <section id="blog-filters" className="section-spacing pt-4 pb-0" aria-label="Blog filters and view toggle">
                <div className="container">
                <div className="blog-controls">
                    <div className="blog-filter-bar" ref={filterBarRef}>
                        {/* Search */}
                        <div className="search-wrapper blog-filter-search" ref={searchRef}>
                            <div className="search-form">
                                <input
                                    type="search"
                                    placeholder="Search insights..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                <button className="search-btn">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            </div>

                            {showSuggestions && blogSuggestions.length > 0 && (
                                <div className="search-suggestions main-search-suggestions">
                                    {blogSuggestions.map(blog => (
                                        <Link 
                                            key={blog.id} 
                                            href={blog.link}
                                            className="suggestion-item"
                                            onClick={() => setShowSuggestions(false)}
                                        >
                                            <div className="suggestion-thumb">
                                                <Image src={blog.image} alt="" width={40} height={40} unoptimized />
                                            </div>
                                            <span className="suggestion-title">{blog.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <span className="blog-filter-divider"></span>

                        {/* DESKTOP FILTERS */}
                        <div className="blog-filter-inline-controls">
                            {/* Categories */}
                            <div className={`cd ${openDropdown === 'cat' ? 'is-open' : ''}`}>
                                <button className="cd__trigger" onClick={() => setOpenDropdown(openDropdown === 'cat' ? null : 'cat')}>
                                    <span className="cd__label">
                                        {!selectedCategories.includes('all') ? `Category (${selectedCategories.length})` : 'Category'}
                                    </span>
                                    <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="cd__menu">
                                    {categoryOptions.map(cat => (
                                        <li key={cat.value} className={`cd__option ${selectedCategories.includes(cat.value) ? 'active' : ''}`}
                                            onClick={() => toggleMultiSelect(cat.value, selectedCategories, setSelectedCategories)}>
                                            <span className="cd__check"></span><span className="cd__opt-text">{cat.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sort */}
                            <div className={`cd cd--radio ${openDropdown === 'sort' ? 'is-open' : ''}`}>
                                <button className="cd__trigger" onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}>
                                    <span className="cd__label">{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                                    <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="cd__menu">
                                    {SORT_OPTIONS.map(opt => (
                                        <li key={opt.value} className={`cd__option ${sortBy === opt.value ? 'active' : ''}`}
                                            onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}>
                                            <span className="cd__check"></span><span className="cd__opt-text">{opt.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Year */}
                            <div className={`cd ${openDropdown === 'year' ? 'is-open' : ''}`}>
                                <button className="cd__trigger" onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}>
                                    <span className="cd__label">
                                        {!selectedYears.includes('all') ? `Year (${selectedYears.length})` : 'Year'}
                                    </span>
                                    <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="cd__menu">
                                    {dynamicYears.map(y => (
                                        <li key={y.value} className={`cd__option ${selectedYears.includes(y.value) ? 'active' : ''}`}
                                            onClick={() => toggleMultiSelect(y.value, selectedYears, setSelectedYears)}>
                                            <span className="cd__check"></span><span className="cd__opt-text">{y.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <span className="blog-filter-divider"></span>

                            <div className="blog-view-toggle">
                                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                                </button>
                                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                                </button>
                            </div>

                            <button className="blog-reset-btn" onClick={resetFilters}>Reset All</button>
                        </div>

                        {/* MOBILE TOGGLE */}
                        <button className="blog-filter-toggle-btn" onClick={() => setIsMobileDrawerOpen(true)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>

                {/* MOBILE DRAWER */}
                <div className={`blog-filter-overlay ${isMobileDrawerOpen ? 'is-open' : ''}`} onClick={() => setIsMobileDrawerOpen(false)}></div>
                <div className={`blog-filter-drawer ${isMobileDrawerOpen ? 'is-open' : ''}`}>
                    <div className="blog-filter-drawer__head">
                        <p className="blog-filter-drawer__title">Filters</p>
                        <div className="blog-filter-drawer__head-actions">
                            <button className="blog-reset-btn blog-reset-btn--sm" onClick={resetFilters}>Reset</button>
                            <button className="blog-filter-drawer__close" onClick={() => setIsMobileDrawerOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>
                    </div>
                    <div className="blog-filter-drawer__body">

                        {/* Drawer: Category accordion */}
                        <div className={`cd ${openMobileAccordion === 'category' ? 'is-open' : ''}`} data-filter="category" data-single="false">
                            <button className="cd__trigger" aria-haspopup="listbox" aria-expanded={openMobileAccordion === 'category'} onClick={() => toggleMobileAccordion('category')}>
                                <span className="cd__label">Category</span>
                                <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <ul className="cd__menu" role="listbox" aria-multiselectable="true">
                                {categoryOptions.map(cat => (
                                    <li key={cat.value}
                                        className={`cd__option ${selectedCategories.includes(cat.value) ? 'active' : ''}`}
                                        onClick={() => toggleMultiSelect(cat.value, selectedCategories, setSelectedCategories)}>
                                        <span className="cd__check"></span><span className="cd__opt-text">{cat.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Drawer: Sort By accordion */}
                        <div className={`cd cd--radio ${openMobileAccordion === 'sort' ? 'is-open' : ''}`} data-filter="sort" data-single="true">
                            <button className="cd__trigger" aria-haspopup="listbox" aria-expanded={openMobileAccordion === 'sort'} onClick={() => toggleMobileAccordion('sort')}>
                                <span className="cd__label">Sort By</span>
                                <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <ul className="cd__menu" role="listbox">
                                {SORT_OPTIONS.map(opt => (
                                    <li key={opt.value}
                                        className={`cd__option ${sortBy === opt.value ? 'active' : ''}`}
                                        onClick={() => setSortBy(opt.value)}>
                                        <span className="cd__check"></span><span className="cd__opt-text">{opt.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Drawer: Year accordion */}
                        <div className={`cd ${openMobileAccordion === 'year' ? 'is-open' : ''}`} data-filter="year" data-single="false">
                            <button className="cd__trigger" aria-haspopup="listbox" aria-expanded={openMobileAccordion === 'year'} onClick={() => toggleMobileAccordion('year')}>
                                <span className="cd__label">Year</span>
                                <svg className="cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <ul className="cd__menu" role="listbox" aria-multiselectable="true">
                                {dynamicYears.map(y => (
                                    <li key={y.value}
                                        className={`cd__option ${selectedYears.includes(y.value) ? 'active' : ''}`}
                                        onClick={() => toggleMultiSelect(y.value, selectedYears, setSelectedYears)}>
                                        <span className="cd__check"></span><span className="cd__opt-text">{y.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button className="primary-btn w-100 mt-4" onClick={() => setIsMobileDrawerOpen(false)}>Apply Filters</button>
                    </div>
                </div>
            </div>
            </section>
            {/* /BLOG FILTERS */}

            {/* ==============================
               BLOG GRID / LIST
               ============================== */}
            <section id="blog-grid-section" className="section-spacing pt-4" aria-label="Blog articles">
                <div className="container">
                    <div aria-live="polite" aria-atomic="true" className="visually-hidden" id="blog-status"></div>

                {/* Blog Grid */}
                <div className={`blog-grid ${viewMode === 'list' ? 'blog-grid--list' : ''}`} id="blog-grid" role="feed" aria-label="Blog articles grid">
                    {displayedBlogs.length > 0 ? (
                        displayedBlogs.map((blog) => (
                            <article key={blog.id} className="modern-blog-card blog-card" data-cat={blog.cat}>
                                <Link href={blog.link || '#'}>
                                    <div className="modern-blog-image-wrapper">
                                        {blog.image && (
                                            <Image src={blog.image} alt={blog.title} width={800} height={600} className="modern-blog-image" unoptimized />
                                        )}
                                        <div className="modern-blog-date-badge">{blog.dateBadge}</div>
                                        <div className="curve-overlay"></div>
                                    </div>
                                    <div className="modern-blog-tags">
                                        {blog.categoryName && <span className="tag">{blog.categoryName}</span>}
                                    </div>
                                    <div className="modern-blog-content">
                                        <h3 className="modern-blog-title">{blog.title}</h3>
                                        <div className="modern-blog-meta">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg> {blog.author}
                                            </span>
                                            <span className="separator">|</span>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg> {blog.viewsLabel ?? `${blog.views} Views`}
                                            </span>
                                        </div>
                                        <div className="modern-blog-footer">
                                            <div className="primary-btn">
                                                <span className="primary-btn-icon">
                                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                                                </span>
                                                Read More
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))
                    ) : (
                        <div className="blog-empty-state col-12 text-center py-5">
                            <h3>No articles found</h3>
                            <p className="text-secondary">Try adjusting your search or filters to find what youre looking for.</p>
                            <button className="primary-btn mt-4" onClick={resetFilters}>Clear All Filters</button>
                        </div>
                    )}
                </div>

                {/* Skeletons/Spinner */}
                {isLoading && (
                    <div className="is-spinner">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton skeleton-image"></div>
                                <div className="skeleton skeleton-title"></div>
                                <div className="skeleton skeleton-text"></div>
                            </div>
                        ))}
                    </div>
                )}

                <div ref={sentinelRef} style={{ height: '40px' }}></div>
            </div>
        </section>
        </>
    );
};



