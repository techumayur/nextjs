"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WPBlogPost, WPTutorialTaxonomy } from '@/types/acf';

interface TipsSidebarProps {
    categories: WPTutorialTaxonomy[];
    tags: WPTutorialTaxonomy[];
    recentTips: WPBlogPost[];
    allTips?: WPBlogPost[];
}

// --- Widget Search ---
const WidgetSearch = ({ tips }: { tips: WPBlogPost[] }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<WPBlogPost[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (query.length > 1) {
            const filtered = tips.filter(tip =>
                tip.title.rendered.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query, tips]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/tips-and-tricks?search=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    const getThumb = (tip: WPBlogPost) => {
        return tip._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
            tip._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    };

    return (
        <div className="sidebar-widget widget-search" ref={wrapperRef} style={{ overflow: 'visible' }}>
            <h3 className="widget-title">Search Tips</h3>
            <form className="sidebar-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search tips..."
                    autoComplete="off"
                />
                <button type="submit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </form>

            {isOpen && query.length > 1 && (
                <div className="search-suggestions-container">
                    {suggestions.length > 0 ? (
                        suggestions.map((tip) => (
                            <Link
                                key={tip.id}
                                href={`/tips-and-tricks/${tip.slug}`}
                                className="suggestion-item"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="suggestion-thumb">
                                    {getThumb(tip) ? (
                                        <Image src={getThumb(tip)!} alt="" width={40} height={40} unoptimized />
                                    ) : (
                                        <div className="thumb-placeholder" />
                                    )}
                                </div>
                                <div className="suggestion-info">
                                    <h4 className="suggestion-title" dangerouslySetInnerHTML={{ __html: tip.title.rendered }}></h4>
                                    <span className="suggestion-cat">Tip Article</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="no-suggestions-found">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="12"></line>
                                <line x1="11" y1="16" x2="11.01" y2="16"></line>
                            </svg>
                            <span>No tips found for "{query}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TipsSidebar: React.FC<TipsSidebarProps> = ({ categories, tags, recentTips, allTips = [] }) => {
    const getThumbnail = (tip: WPBlogPost) => {
        const media = tip._embedded?.['wp:featuredmedia']?.[0];
        if (!media) return null;

        return media.media_details?.sizes?.['thumbnail']?.source_url ||
            media.media_details?.sizes?.['medium']?.source_url ||
            media.source_url ||
            null;
    };

    return (
        <aside className="bd-sidebar sticky-sidebar">
            {/* Search Widget */}
            <WidgetSearch tips={allTips.length > 0 ? allTips : recentTips} />

            {/* Author Widget */}
            <div className="sidebar-widget widget-author">
                <h3 className="widget-title">Project Creator</h3>
                <div className="author-card-sidebar">
                    <div className="author-header-sidebar">
                        <div className="author-portrait-sidebar">
                            <Image src="/images/Techu-Mayur.png" alt="Mayur Creator" width={100} height={100} />
                            <div className="author-badge-sidebar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        </div>
                        <div className="author-meta-sidebar">
                            <h4 className="author-name-sidebar">Techu <span>Mayur</span></h4>
                            <p className="author-role-sidebar">Full Stack Developer</p>
                        </div>
                    </div>
                    <p className="author-bio-sidebar">Passionate Web Developer dedicated to helping others build faster, more beautiful digital experiences.</p>
                </div>
            </div>

            {/* Categories Widget */}
            {categories.length > 0 && (
                <div className="sidebar-widget widget-categories">
                    <h3 className="widget-title">Categories</h3>
                    <ul className="category-list">
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Link href={`/tips-and-tricks?category=${cat.id}`}>
                                    {cat.name}
                                    <span className="cat-count">{cat.count}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recent Posts Widget */}
            {recentTips.length > 0 && (
                <div className="sidebar-widget widget-popular">
                    <h3 className="widget-title">Recent Tips</h3>
                    <div className="popular-posts-list">
                        {recentTips.map((tip) => {
                            const thumbnail = getThumbnail(tip);
                            return (
                                <Link key={tip.id} href={`/tips-and-tricks/${tip.slug}`} className="mini-post-card">
                                    <div className="mini-post-thumb">
                                        {thumbnail ? (
                                            <Image
                                                src={thumbnail}
                                                alt={tip.title.rendered}
                                                width={75}
                                                height={75}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="mini-post-thumb-placeholder bg-dark text-white-50 d-flex align-items-center justify-content-center">
                                                <small>N/A</small>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mini-post-content">
                                        <h4 className="mini-post-title" dangerouslySetInnerHTML={{ __html: tip.title.rendered }}></h4>
                                        <span className="mini-post-date">{new Date(tip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tags Widget */}
            {tags.length > 0 && (
                <div className="sidebar-widget widget-tags">
                    <h3 className="widget-title">Popular Tags</h3>
                    <div className="sidebar-tags-cloud">
                        {tags.map((tag) => (
                            <Link key={tag.id} href={`/tips-and-tricks?tag=${tag.id}`} className="sidebar-tag">
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default TipsSidebar;
