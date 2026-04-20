'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { ACFTutorialsPage, WPTutorial, WPTutorialTaxonomy, ACFImage } from '@/types/acf';
import Link from 'next/link';
import { parseHtml } from '@/app/lib/parseHtml';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface TutorialsClientProps {
    pageData: ACFTutorialsPage;
    tutorials: WPTutorial[];
    taxonomies: {
        categories: WPTutorialTaxonomy[];
        tags: WPTutorialTaxonomy[];
    };
}

const getImageUrl = (img: ACFImage | undefined): string => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'number') return '';
    return img.url || '';
};

export default function TutorialsClient({ pageData, tutorials, taxonomies }: TutorialsClientProps) {
    const filterBarRef = React.useRef<HTMLDivElement>(null);
    const categoryDropdownRef = React.useRef<HTMLDivElement>(null);
    const yearDropdownRef = React.useRef<HTMLDivElement>(null);
    const sortDropdownRef = React.useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [openMobileSections, setOpenMobileSections] = useState<string[]>(['categories']);

    const toggleMobileSection = (section: string) => {
        setOpenMobileSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    // Extract unique years from tutorials
    const uniqueYears = useMemo(() => {
        const years = tutorials.map(t => new Date(t.date).getFullYear().toString());
        return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
    }, [tutorials]);

    // Helper to get video URL with fallbacks (Matches Home Page logic)
    const getTutorialVideoUrl = (tut: WPTutorial): string => {
        const tutorialGroupLinks = tut.acf.tutorial?.links;
        const homeLinks = tut.acf.home_page?.links;
        const acfLinks = tut.acf.links;
        const videoUrl = tut.acf.video_url;

        if (tutorialGroupLinks) return tutorialGroupLinks;
        if (homeLinks) return homeLinks;
        if (typeof acfLinks === 'string' && acfLinks) return acfLinks;
        if (typeof acfLinks === 'object' && acfLinks !== null && 'url' in acfLinks) return acfLinks.url;
        if (videoUrl) return videoUrl;

        return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    };

    // Helper to get Category names for dropdown (tutorials-taxonomy)
    const getTutorialCategoryName = (selectedNames: string[]) => {
        if (selectedNames.includes('all')) return 'Category';
        const matching = taxonomies.categories
            .filter(c => selectedNames.includes(c.name.toLowerCase()))
            .map(c => c.name);

        if (matching.length === 0) return 'Category';
        if (matching.length === 1) return matching[0];
        return `${matching[0]} +${matching.length - 1}`;
    };

    // Helper to get Individual Tag names for cards (tutorials-tag)
    const getTutorialTagsText = (tut: WPTutorial) => {
        const tagIds = tut['tutorials-tag'] || [];
        const matchingTags = taxonomies.tags
            .filter(t => tagIds.includes(t.id))
            .map(t => t.name);
        return matchingTags.length > 0 ? matchingTags.join(', ') : (tut.acf.category || 'Tutorial');
    };

    // Helper for Platform Label (Matches Home Page logic with dynamic taxonomy field)
    const getPlatformInfo = (tut: WPTutorial) => {
        // Find matching category from taxonomies
        const catIds = tut['tutorials-taxonomy'] || tut['tutorials_taxonomy'] || [];
        const idList = Array.isArray(catIds) ? catIds : [];
        const matchingCat = taxonomies.categories.find(c => idList.some(id => id.toString() === c.id.toString()));

        // Use ACF platform_label if it exists, otherwise fallback to name or description
        const platformName = matchingCat?.acf?.platform_label || matchingCat?.name || tut.acf.category || "YouTube";
        const platformLower = platformName.toLowerCase();

        // Try to get icon from taxonomy ACF
        const acfIcon = matchingCat?.acf?.icon;
        const iconUrl = getImageUrl(acfIcon);

        const platformClass = platformLower.includes('short') ? 'shorts' : platformLower.includes('reel') ? 'reels' : 'youtube';
        const defaultIcon = platformLower.includes('short') ? '/images/home/youtubeshorts.svg' :
            platformLower.includes('reel') ? '/images/home/instagram.svg' : '/images/home/youtube-icon.svg';

        return {
            label: platformName,
            class: platformClass,
            icon: iconUrl || defaultIcon
        };
    };

    // Helper for Relative Time (Matches Home Page)
    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        // Use a consistent format on server to avoid hydration mismatch
        if (!isMounted) {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        }
        return date.toLocaleDateString();
    };

    // Filtering logic
    const filteredTutorials = useMemo(() => {
        return tutorials.filter(t => {
            // Search Match
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                t.title.rendered.toLowerCase().includes(searchLower) ||
                t.acf.description?.toLowerCase().includes(searchLower);

            // Category Match
            const matchesCategory = selectedCategories.includes('all') ||
                taxonomies.categories.some(cat => {
                    const catSlugLower = cat.slug.toLowerCase();
                    const catNameLower = cat.name.trim().toLowerCase();
                    const isSelected = selectedCategories.includes(catNameLower) || selectedCategories.includes(catSlugLower);
                    if (!isSelected) return false;

                    // Access taxonomy directly with type safety
                    const tutorialCatIds = t['tutorials-taxonomy'] || t['tutorials_taxonomy'] || [];
                    const idList = Array.isArray(tutorialCatIds) ? tutorialCatIds : [];

                    // Match by ID
                    if (idList.some(id => id.toString() === cat.id.toString())) return true;
                    if (idList.some(id => id.toString() === cat.slug.toString())) return true; // Sometimes slugs are in the array

                    // Robust check for t.acf.category
                    const acfCat = t.acf.category;
                    if (acfCat) {
                        if (Array.isArray(acfCat)) {
                            return acfCat.some(c => {
                                const cStr = c?.toString().trim().toLowerCase();
                                return cStr === catNameLower || cStr === catSlugLower;
                            });
                        }
                        if (typeof acfCat === 'string' || typeof acfCat === 'number') {
                            const cStr = acfCat.toString().trim().toLowerCase();
                            return cStr === catNameLower || cStr === catSlugLower ||
                                acfCat.toString().split(',').map(s => s.trim().toLowerCase()).some(s => s === catNameLower || s === catSlugLower);
                        }
                    }

                    return false;
                });

            // Year Match
            const tutorialYear = new Date(t.date).getFullYear().toString();
            const matchesYear = selectedYear === 'all' || tutorialYear === selectedYear;

            return matchesSearch && matchesCategory && matchesYear;
        }).sort((a, b) => {
            if (sortOption === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortOption === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
            const aLikes = Number(a.acf.likes) || 0;
            const bLikes = Number(b.acf.likes) || 0;
            if (sortOption === 'popular') return bLikes - aLikes;
            const aViews = Number(a.acf.views) || 0;
            const bViews = Number(b.acf.views) || 0;
            if (sortOption === 'views') return bViews - aViews;
            return 0;
        });
    }, [tutorials, searchQuery, selectedCategories, taxonomies, selectedYear, sortOption]);

    const featuredTutorial = tutorials[0];
    const miniTutorials = tutorials.slice(1, 5);

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            setIsMounted(true);
        });
        
        // @ts-expect-error - Fancybox v5 config differs from types but works as intended
        Fancybox.bind('[data-fancybox="gallery"]', {
            Thumbs: false,
            Counter: false,
            Carousel: {
                infinite: false,
                Navigation: false,
            },
            Toolbar: {
                display: {
                    left: [],
                    middle: [],
                    right: ["close"]
                }
            },
            Video: {
                youtube: {
                    enablejsapi: 1,
                    rel: 0,
                    fs: 1
                }
            },
            Html: {
                video: {
                    autoplay: true,
                }
            }
        });

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (filterBarRef.current && !filterBarRef.current.contains(target)) {
                setIsCategoryDropdownOpen(false);
                setIsYearDropdownOpen(false);
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            cancelAnimationFrame(handle);
            Fancybox.destroy();
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, []);

    const handleCategoryToggle = (cat: string) => {
        if (cat === 'all') {
            setSelectedCategories(['all']);
        } else {
            setSelectedCategories(prev => {
                const filtered = prev.filter(c => c !== 'all');
                if (filtered.includes(cat)) {
                    const next = filtered.filter(c => c !== cat);
                    return next.length === 0 ? ['all'] : next;
                }
                return [...filtered, cat];
            });
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategories(['all']);
        setSelectedYear('all');
        setSortOption('newest');
        setIsCategoryDropdownOpen(false);
        setIsYearDropdownOpen(false);
        setIsSortDropdownOpen(false);
    };

    const toggleFilterDrawer = (open: boolean) => {
        setIsFilterDrawerOpen(open);
        if (open) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    };

    return (
        <main className="tutorials-page-wrapper">
            {/* Tutorials Banner Start */}
            <section id="tutorials-banner" className="inner-banner section-spacing" style={{ background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${getImageUrl(pageData.banner?.background_image) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=800&fit=crop'}')` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="banner-content-wrapper text-center">
                                <span className="sub-heading-tag-1">
                                    <div className="sub-heading-image">
                                        <picture>
                                            <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                        </picture>
                                    </div>
                                    {pageData.banner?.sub_heading || 'Knowledge for Everyone'}
                                </span>
                                <h1 dangerouslySetInnerHTML={{ __html: parseHtml(pageData.banner?.heading || 'Tutorials – <br>Master the Modern Web') }} />
                                <p>{pageData.banner?.description || 'Free, comprehensive guides designed to take you from zero to mastery in tech.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner-scroll-indicator">
                    <div className="scroll-mouse"></div>
                </div>
            </section>
            {/* Tutorials Banner End */}

            {/* Breadcrumb Start */}
            <section id="breadcrumb" className="section-spacing">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb-modern" itemScope itemType="https://schema.org/BreadcrumbList">
                                    <li className="breadcrumb-item-modern" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <Link href="/" itemProp="item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                            <span itemProp="name">Home</span>
                                        </Link>
                                        <meta itemProp="position" content="1" />
                                        <span className="separator">/</span>
                                    </li>
                                    <li className="breadcrumb-item-modern active" aria-current="page" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <span itemProp="name">Tutorials</span>
                                        <meta itemProp="position" content="2" />
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb End */}

            {/* Heading / Content Section Start */}
            <section id="tutorials-heading" className="section-spacing text-center pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-header">
                                <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                                    <div className="sub-heading-image">
                                        <picture>
                                            <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                        </picture>
                                    </div>
                                    {pageData.video_tutorials?.sub_heading || 'Step-by-Step Learning'}
                                </span>
                                <h2 dangerouslySetInnerHTML={{ __html: parseHtml(pageData.video_tutorials?.title || 'Premium <span class="highlight">Web Tutorials</span> & Bootcamps') }} />
                                <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                    <p className="fs-5 mt-3">{pageData.video_tutorials?.description || 'Curated paths and deep-dive tutorials focusing on performance, scalability, and modern best practices.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Heading / Content Section End */}

            {/* Featured Tutorials Start */}
            <section id="featured-tutorials" className="section-spacing">
                <div className="container">
                    <div className="row g-4">
                        {/* Large Featured Card */}
                        {featuredTutorial && (() => {
                            const videoUrl = getTutorialVideoUrl(featuredTutorial);
                            return (
                                <div className="col-lg-6">
                                    <div className="tutorial-card tutorial-card--featured h-100">
                                        <a 
                                            href={videoUrl.includes('instagram.com') && !videoUrl.includes('/embed/') ? `${videoUrl.replace(/\/$/, '').replace('/reels/', '/reel/')}/embed/` : videoUrl} 
                                            className="tutorial-card__link h-100 d-flex flex-column" 
                                            data-fancybox="gallery"
                                            data-type={videoUrl.includes('instagram.com') ? 'iframe' : undefined}
                                            data-width={videoUrl.includes('instagram.com') ? "400" : undefined}
                                            data-height={videoUrl.includes('instagram.com') ? "720" : undefined}

                                        >
                                            <div className="tutorial-card__image-wrap">
                                                <img src={getImageUrl(featuredTutorial.acf.thumbnail)} alt={featuredTutorial.title.rendered} className="tutorial-card__image" />
                                                <div className="tutorial-card__badge">FEATURED BOOTCAMP</div>
                                                <span className={`platform-label ${getPlatformInfo(featuredTutorial).class}`} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 5 }}>
                                                    <img src={getPlatformInfo(featuredTutorial).icon} alt={getPlatformInfo(featuredTutorial).label} height="13" width="13" /> {getPlatformInfo(featuredTutorial).label}
                                                </span>
                                                <div className="tutorial-card__overlay">
                                                    <div className="play-btn-circle">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tutorial-card__content flex-grow-1 d-flex flex-column">
                                                <div className="tutorial-card__meta">
                                                    <span className="tutorial-card__tag">{getTutorialTagsText(featuredTutorial)}</span>
                                                    <span className="tutorial-card__duration">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg> {featuredTutorial.acf.duration} Content
                                                    </span>
                                                </div>
                                                <h3 className="tutorial-card__title" dangerouslySetInnerHTML={{ __html: parseHtml(featuredTutorial.title.rendered) }} />
                                                <div className="tutorial-card__excerpt" dangerouslySetInnerHTML={{ __html: featuredTutorial.acf.description || featuredTutorial.excerpt?.rendered || "" }} />
                                                <div className="tutorial-card__footer mt-auto">
                                                    <span className="tutorial-card__author">
                                                        <img src="/images/user-1.svg" alt="Techu Mayur" />
                                                        By Techu Mayur
                                                    </span>
                                                    <div className="primary-btn primary-btn--sm">
                                                        <span className="primary-btn-icon">
                                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                            </svg>
                                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                            </svg>
                                                        </span>
                                                        Watch Now
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            );
                        })()}
                        {/* Side Featured Items */}
                        <div className="col-lg-6 d-grid gap-4 h-100">
                            {miniTutorials.map((tut) => {
                                const videoUrl = getTutorialVideoUrl(tut);
                                return (
                                    <div key={tut.id} className="tutorial-card tutorial-card--mini h-100">
                                        <a 
                                            href={videoUrl.includes('instagram.com') && !videoUrl.includes('/embed/') ? `${videoUrl.replace(/\/$/, '').replace('/reels/', '/reel/')}/embed/` : videoUrl} 
                                            className="tutorial-card__link d-flex align-items-center" 
                                            data-fancybox="gallery"
                                            data-type={videoUrl.includes('instagram.com') ? 'iframe' : undefined}
                                            data-width={videoUrl.includes('instagram.com') ? "400" : undefined}
                                            data-height={videoUrl.includes('instagram.com') ? "720" : undefined}

                                        >
                                            <div className="tutorial-card__image-mini-wrap">
                                                <img src={getImageUrl(tut.acf.thumbnail)} alt={tut.title.rendered} className="tutorial-card__image-mini" />
                                                <span className={`platform-label platform-label--mini ${getPlatformInfo(tut).class}`} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5 }}>
                                                    <img src={getPlatformInfo(tut).icon} alt={getPlatformInfo(tut).label} height="11" width="11" />
                                                </span>
                                                <div className="play-btn-mini">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="tutorial-card__content-mini">
                                                <span className="tutorial-card__tag tutorial-card__tag--sm">{getTutorialTagsText(tut)}</span>
                                                <h4 className="tutorial-card__title-mini" dangerouslySetInnerHTML={{ __html: tut.title.rendered }} />
                                                <div className="tutorial-card__meta-mini">
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                        </svg> {tut.acf.level || 'All Levels'}
                                                    </span>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <polyline points="12 6 12 12 16 14"></polyline>
                                                        </svg> {tut.acf.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            {/* Featured Tutorials End */}

            {/* ✅ TUTORIALS HIGHLIGHTS SECTION */}
            <section id="tutorials-highlights" className="section-spacing pt-0">
                <div className="container">
                    <div className="row g-4">
                        {pageData.sidebar_cards && pageData.sidebar_cards.length > 0 ? (
                            pageData.sidebar_cards.map((card, idx) => (
                                <div key={idx} className="col-12 col-md-4">
                                    <div className="sidebar-card h-100">
                                        <h3 className="sidebar-title">
                                            <picture>
                                                <img src={getImageUrl(card.icon) || "/images/home/youtube-icon.svg"} className="img-fluid" alt={card.title} height="25" width="25" />
                                            </picture>
                                            {card.title}
                                        </h3>
                                        <div className="stat-item">
                                            <div className="stat-icon">
                                                <picture>
                                                    <img src={getImageUrl(card.icon) || "/images/home/youtube-icon.svg"} className="img-fluid" alt={card.title} height="25" width="25" />
                                                </picture>
                                            </div>
                                            <div className="stat-content">
                                                <div className="stat-value" data-target={card.stat_value.replace(/\D/g, '')}>{card.stat_value}</div>
                                                <div className="stat-label">{card.stat_label}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="col-12 col-md-4">
                                    <div className="sidebar-card h-100">
                                        <h3 className="sidebar-title">
                                            <picture><img src="/images/home/youtube-icon.svg" className="img-fluid" alt="YouTube" height="25" width="25" /></picture>
                                            Video Tutorials
                                        </h3>
                                        <div className="stat-item">
                                            <div className="stat-icon"><picture><img src="/images/home/youtube-icon.svg" className="img-fluid" alt="YouTube" height="25" width="25" /></picture></div>
                                            <div className="stat-content"><div className="stat-value" data-target="150">150+</div><div className="stat-label">Full Length Tutorials</div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="sidebar-card h-100" style={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)' }}>
                                        <h3 className="sidebar-title" style={{ color: '#000' }}>
                                            <picture><img src="/images/home/youtubeshorts.svg" className="img-fluid" alt="YouTube Shorts" height="25" width="25" /></picture>
                                            Quick Shorts
                                        </h3>
                                        <div className="stat-item">
                                            <div className="stat-icon"><picture><img src="/images/home/youtubeshorts.svg" className="img-fluid" alt="YouTube Shorts" height="25" width="25" /></picture></div>
                                            <div className="stat-content"><div className="stat-value" data-target="200" style={{ color: '#000' }}>200+</div><div className="stat-label">Short Format Videos</div></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="sidebar-card h-100" style={{ boxShadow: '0 8px 30px rgba(228, 64, 95, 0.1)' }}>
                                        <h3 className="sidebar-title" style={{ color: '#E4405F' }}>
                                            <picture><img src="/images/home/camera-reels.svg" className="img-fluid" alt="Instagram Reels" height="25" width="25" /></picture>
                                            Instagram Reels
                                        </h3>
                                        <div className="stat-item">
                                            <div className="stat-icon"><picture><img src="/images/home/instagram.svg" className="img-fluid" alt="Instagram Reels" height="25" width="25" /></picture></div>
                                            <div className="stat-content"><div className="stat-value" data-target="85" style={{ color: '#E4405F' }}>85+</div><div className="stat-label">Creative Reels</div></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* TUTORIALS FILTERS UI */}
            <section id="tutorials-filter-section" className="section-spacing pt-0 pb-0">
                <div className="container">
                    <div ref={filterBarRef} className="tutorial-premium-filter-bar">
                        <div className="filter-bar-inner">
                            {/* Search Component */}
                            <div className="filter-search-wrap">
                                <div className="filter-search-input-group">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input type="text" id="tutorial-search-input" placeholder="Search tutorials by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <div className="search-actions">
                                        <button
                                            className={`search-clear-btn ${searchQuery ? 'is-visible' : ''}`}
                                            id="search-clear-btn"
                                            title="Clear Search"
                                            onClick={() => setSearchQuery('')}
                                            style={{ opacity: searchQuery ? 1 : 0, visibility: searchQuery ? 'visible' : 'hidden' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                        <button className="search-submit-btn" id="search-submit-btn" aria-label="Find tutorials">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Desktop Filters */}
                            <div className="filter-controls-wrap d-none d-lg-flex">
                                {/* Category Dropdown */}
                                <div className={`premium-dropdown ${isCategoryDropdownOpen ? 'active' : ''}`} ref={categoryDropdownRef}>
                                    <button className="premium-dropdown-btn" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                                        <span className="dropdown-label-text">
                                            {getTutorialCategoryName(selectedCategories)}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">Filter by Category</div>
                                        <label className={`premium-option ${selectedCategories.includes('all') ? 'active' : ''}`}>
                                            <input type="checkbox" checked={selectedCategories.includes('all')} onChange={() => handleCategoryToggle('all')} />
                                            <span className="option-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                                            All Categories
                                        </label>
                                        {taxonomies.categories.map(cat => {
                                            const isSelected = selectedCategories.includes(cat.name.toLowerCase());
                                            return (
                                                <label key={cat.id} className={`premium-option ${isSelected ? 'active' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleCategoryToggle(cat.name.toLowerCase())}
                                                    />
                                                    <span className="option-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                                                    {cat.name}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Year Dropdown */}
                                <div className={`premium-dropdown ${isYearDropdownOpen ? 'active' : ''}`} ref={yearDropdownRef}>
                                    <button className="premium-dropdown-btn" onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span className="dropdown-label-text">{selectedYear === 'all' ? 'Post Year' : selectedYear}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">Select Year</div>
                                        <label className={`premium-option ${selectedYear === 'all' ? 'active' : ''}`} onClick={() => setSelectedYear('all')}>
                                            <input type="radio" checked={selectedYear === 'all'} readOnly />
                                            <span className="option-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                                            All Years
                                        </label>
                                        {uniqueYears.map(year => (
                                            <label key={year} className={`premium-option ${selectedYear === year ? 'active' : ''}`} onClick={() => setSelectedYear(year)}>
                                                <input type="radio" checked={selectedYear === year} readOnly />
                                                <span className="option-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                                                {year} Edition
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* Sort Dropdown */}
                                <div className={`premium-dropdown ${isSortDropdownOpen ? 'active' : ''}`} ref={sortDropdownRef}>
                                    <button className="premium-dropdown-btn" onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                                        <span className="dropdown-label-text">Sort By</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">Order By</div>
                                        <label className={`premium-option ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => setSortOption('newest')}>
                                            <input type="radio" checked={sortOption === 'newest'} readOnly />
                                            <span className="option-check radio"></span>
                                            Newest First
                                        </label>
                                        <label className={`premium-option ${sortOption === 'oldest' ? 'active' : ''}`} onClick={() => setSortOption('oldest')}>
                                            <input type="radio" checked={sortOption === 'oldest'} readOnly />
                                            <span className="option-check radio"></span>
                                            Oldest First
                                        </label>
                                    </div>
                                </div>
                                {/* Reset Action */}
                                <button className="premium-reset-btn" id="tutorial-reset-btn" onClick={resetFilters} title="Reset All Filters">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                                </button>
                            </div>
                            {/* Mobile Toggle */}
                            <div className="mobile-filter-actions d-lg-none">
                                <button className="mobile-toggle-btn" id="tutorial-filter-toggle" onClick={() => toggleFilterDrawer(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                    <span>Explore Filters</span>
                                </button>
                            </div>
                            {/* View Toggle */}
                            <div className="view-toggle-wrap">
                                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </button>
                                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TUTORIALS GRID SECTION */}
            <section id="tutorials-grid-section" className="section-spacing">
                <div className="container">
                    <div id="tutorials-feed" className={`tutorials-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                        {filteredTutorials.length > 0 ? (
                            filteredTutorials.map(tut => {
                                const videoUrl = getTutorialVideoUrl(tut);
                                return (
                                    <div key={tut.id} className="video-item">
                                        <div 
                                            className="video-thumb-wrapper" 
                                            data-fancybox="gallery" 
                                            data-src={videoUrl.includes('instagram.com') && !videoUrl.includes('/embed/') ? `${videoUrl.replace(/\/$/, '').replace('/reels/', '/reel/')}/embed/` : videoUrl}
                                            data-type={videoUrl.includes('instagram.com') ? 'iframe' : undefined}
                                        >
                                            <img src={getImageUrl(tut.acf.thumbnail)} alt={tut.title.rendered} />
                                            <div className="video-overlay">
                                                <div className="play-btn-large">
                                                    <img src="/images/home/play-btn.svg" alt="Play" height="20" width="20" />
                                                </div>
                                            </div>
                                            <span className={`platform-label ${getPlatformInfo(tut).class}`}>
                                                <img src={getPlatformInfo(tut).icon} alt={getPlatformInfo(tut).label} height="13" width="13" /> {getPlatformInfo(tut).label}
                                            </span>
                                            <span className="time-badge">{tut.acf.duration}</span>
                                        </div>
                                        <div className="video-info">
                                            <div 
                                                className="video-info-trigger" 
                                                data-fancybox="gallery" 
                                                data-src={videoUrl.includes('instagram.com') && !videoUrl.includes('/embed/') ? `${videoUrl.replace(/\/$/, '').replace('/reels/', '/reel/')}/embed/` : videoUrl} 
                                                data-type={videoUrl.includes('instagram.com') ? 'iframe' : undefined}
                                                data-width={videoUrl.includes('instagram.com') ? "400" : undefined}
                                                data-height={videoUrl.includes('instagram.com') ? "720" : undefined}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="video-category">{getTutorialTagsText(tut)}</span>
                                                <h3 className="video-heading" dangerouslySetInnerHTML={{ __html: parseHtml(tut.title.rendered) }} />
                                                <div className="video-text" dangerouslySetInnerHTML={{ __html: parseHtml(tut.acf.description || tut.excerpt?.rendered || "") }} />
                                                <div className="video-metrics">
                                                    {(() => {
                                                        const linksData = typeof tut.acf.links === 'object' && tut.acf.links !== null
                                                            ? tut.acf.links as { url: string; views?: string; likes?: string; time_ago?: string }
                                                            : null;
                                                        const viewsCount = tut.acf.tutorial?.views || tut.acf.home_page?.views || linksData?.views || tut.acf.views || "0";
                                                        const likesCount = tut.acf.tutorial?.likes || tut.acf.home_page?.likes || linksData?.likes || tut.acf.likes || "0";
                                                        const timeAgoStr = linksData?.time_ago || tut.acf.time_ago || getRelativeTime(tut.date);

                                                        return (
                                                            <>
                                                                <span className="metric"><img src="/images/home/view.svg" alt="Views" height="18" width="18" /> {viewsCount}</span>
                                                                <span className="metric"><img src="/images/home/heart.svg" alt="Likes" height="18" width="18" /> {likesCount}</span>
                                                                <span className="metric"><img src="/images/home/clock.svg" alt="Time" height="18" width="18" /> {timeAgoStr}</span>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                            <div className="video-buttons">
                                                <div className="primary-btn" data-fancybox="gallery" data-src={videoUrl}>
                                                    <span className="primary-btn-icon">
                                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                        </svg>
                                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                        </svg>
                                                    </span>
                                                    Watch Now
                                                </div>
                                                <button className="btn-share" onClick={(e) => { e.stopPropagation(); const shareUrlInput = document.getElementById('shareUrl') as HTMLInputElement; if (shareUrlInput) shareUrlInput.value = videoUrl; }} data-bs-toggle="modal" data-bs-target="#shareModal">
                                                    <img src="/images/home/share.svg" alt="Share" height="20" width="20" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-results-premium">
                                <div className="no-results-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                                <h3>No tutorials found</h3>
                                <p>We couldn&apos;t find any tutorials matching your current filters. Try adjusting your search or category selection.</p>
                                <button className="primary-btn" onClick={resetFilters}>
                                    <span className="primary-btn-icon">
                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                    <div id="tutorials-infinite-scroll-sentinel-wrap" className="mt-5">
                        <div id="tutorials-infinite-scroll-spinner" className="is-spinner" aria-label="Loading more tutorials" style={{ display: 'none' }}>
                            <div className="tutorials-skeleton-container" id="tutorials-skeletons"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ Share Modal */}
            <div className="modal fade" id="shareModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <button type="button" className="share-close" data-bs-dismiss="modal"></button>
                        <div className="modal-body p-0">
                            <h3 className="share-title">Share This Tutorial</h3>
                            <div className="social-buttons">
                                <a href="#" className="social-btn facebook" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); }}>
                                    <img src="/images/social-media/facebook.svg" alt="Facebook" height="32" width="32" />
                                    <span>Facebook</span>
                                </a>
                                <a href="#" className="social-btn twitter" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank'); }}>
                                    <img src="/images/social-media/twitter.svg" alt="Twitter" height="32" width="32" />
                                    <span>Twitter</span>
                                </a>
                                <a href="#" className="social-btn linkedin" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'); }}>
                                    <img src="/images/social-media/linkedin.svg" alt="LinkedIn" height="32" width="32" />
                                    <span>LinkedIn</span>
                                </a>
                                <a href="#" className="social-btn whatsapp" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, '_blank'); }}>
                                    <img src="/images/social-media/whatsapp.svg" alt="WhatsApp" height="32" width="32" />
                                    <span>WhatsApp</span>
                                </a>
                                <a href="#" className="social-btn telegram" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}`, '_blank'); }}>
                                    <img src="/images/social-media/telegram.svg" alt="Telegram" height="32" width="32" />
                                    <span>Telegram</span>
                                </a>
                                <a href="#" className="social-btn email" onClick={(e) => { e.preventDefault(); const url = (document.getElementById('shareUrl') as HTMLInputElement)?.value; if (url) window.location.href = `mailto:?body=${encodeURIComponent(url)}`; }}>
                                    <img src="/images/social-media/gmail.svg" alt="Email" height="32" width="32" />
                                    <span>Email</span>
                                </a>
                            </div>
                            <div className="copy-link-section">
                                <div className="copy-link-wrapper">
                                    <input type="text" className="copy-link-input" id="shareUrl" readOnly />
                                    <button className="copy-link-btn" onClick={() => {
                                        const input = document.getElementById('shareUrl') as HTMLInputElement;
                                        input.select();
                                        document.execCommand('copy');
                                    }}>
                                        <span>Copy Link</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Mobile Drawer */}
            <div className={`filter-overlay-glass ${isFilterDrawerOpen ? 'is-open' : ''}`} onClick={() => toggleFilterDrawer(false)}></div>
            <div className={`premium-filter-drawer ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                <div className="drawer-header">
                    <h3>Filter Tutorials</h3>
                    <button className="drawer-close-btn" onClick={() => toggleFilterDrawer(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div className="drawer-content">
                    {/* Category */}
                    <div className={`drawer-accordion ${openMobileSections.includes('categories') ? 'is-open' : ''}`}>
                        <button className="accordion-trigger" onClick={() => toggleMobileSection('categories')}>
                            <span className="trigger-label">Category</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus chevron"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <div className="accordion-content">
                            <label className={`premium-option ${selectedCategories.includes('all') ? 'active' : ''}`}>
                                <input type="checkbox" checked={selectedCategories.includes('all')} onChange={() => handleCategoryToggle('all')} />
                                <span className="option-check">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list option-icon"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                All Categories
                            </label>
                            {taxonomies.categories.map(cat => {
                                const isSelected = selectedCategories.includes(cat.name.toLowerCase()) ||
                                    selectedCategories.includes(cat.slug.toLowerCase());
                                return (
                                    <label key={cat.id} className={`premium-option ${isSelected ? 'active' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleCategoryToggle(cat.name.toLowerCase())}
                                        />
                                        <span className="option-check">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-code option-icon"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                                        {cat.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    {/* Year */}
                    <div className={`drawer-accordion ${openMobileSections.includes('year') ? 'is-open' : ''}`}>
                        <button className="accordion-trigger" onClick={() => toggleMobileSection('year')}>
                            <span className="trigger-label">Year</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus chevron"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <div className="accordion-content">
                            <label className={`premium-option ${selectedYear === 'all' ? 'active' : ''}`} onClick={() => setSelectedYear('all')}>
                                <input type="radio" checked={selectedYear === 'all'} readOnly />
                                <span className="option-check">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-infinity option-icon"><path d="M18.15 8.15a6 6 0 0 0-8.3 0L3.54 14.46a6 6 0 0 0 0 8.3 6 6 0 0 0 8.3 0l6.31-6.31a6 6 0 0 0 0-8.3z"></path></svg>
                                All Years
                            </label>
                            {uniqueYears.map(year => (
                                <label key={year} className={`premium-option ${selectedYear === year ? 'active' : ''}`} onClick={() => setSelectedYear(year)}>
                                    <input type="radio" checked={selectedYear === year} readOnly />
                                    <span className="option-check">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock option-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    {year} Edition
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Sort */}
                    <div className={`drawer-accordion ${openMobileSections.includes('sort') ? 'is-open' : ''}`}>
                        <button className="accordion-trigger" onClick={() => toggleMobileSection('sort')}>
                            <span className="trigger-label">Sort By</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus chevron"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <div className="accordion-content">
                            <label className={`premium-option ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => setSortOption('newest')}>
                                <input type="radio" checked={sortOption === 'newest'} readOnly />
                                <span className="option-check radio"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down option-icon"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                Newest First
                            </label>
                            <label className={`premium-option ${sortOption === 'oldest' ? 'active' : ''}`} onClick={() => setSortOption('oldest')}>
                                <input type="radio" checked={sortOption === 'oldest'} readOnly />
                                <span className="option-check radio"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up option-icon"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                Oldest First
                            </label>
                        </div>
                    </div>
                </div>
                <div className="drawer-footer">
                    <button className="premium-apply-btn w-100 mb-2" onClick={() => toggleFilterDrawer(false)}>Apply Filters</button>
                    <button className="premium-reset-btn-alt w-100" onClick={() => { resetFilters(); toggleFilterDrawer(false); }}>Reset Filters</button>
                </div>
            </div>
        </main>
    );
}

