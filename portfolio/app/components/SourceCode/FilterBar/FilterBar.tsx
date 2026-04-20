import React from 'react';
import './FilterBar.css';
import { WPSourceCodeItem, WPSourceCodeTaxonomy } from '@/types/acf';

interface FilterBarProps {
    projects: WPSourceCodeItem[];
    taxonomies: WPSourceCodeTaxonomy[];
    tags: WPSourceCodeTaxonomy[];
}

const FilterBar: React.FC<FilterBarProps> = ({ projects, taxonomies, tags }) => {
    // Extract unique Years from project dates
    const allYears = Array.from(new Set(
        projects.map(p => new Date(p.date).getFullYear().toString())
    )).sort((a, b) => b.localeCompare(a)); // Sort descending

    return (
        <section id="sc-filters" className="section-spacing pt-4 pb-0" aria-label="Source code filters and view toggle">
            <div className="container">
                <div className="sc-controls">
                    <div className="sc-filter-bar">
                        {/* Search (always visible) */}
                        <div className="search-wrapper sc-filter-search">
                            <div className="search-form" role="search" aria-label="Search source code">
                                <label htmlFor="sc-search" className="visually-hidden">Search source code</label>
                                <span className="sc-search-prefix" aria-hidden="true">&gt;_</span>
                                <input type="search" placeholder="Search source code projects..." className="search-input" id="sc-search" autoComplete="off" aria-autocomplete="list" />
                                <button type="button" className="sc-search-clear" id="sc-search-clear" aria-label="Clear search" hidden>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                                <button type="button" className="search-btn" aria-label="Submit search">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <span className="sc-filter-divider" aria-hidden="true"></span>

                        {/* Desktop inline filters */}
                        <div className="sc-filter-inline-controls">
                            {/* Category Dropdown */}
                            <div className="sc-cd" id="sc-cd-category" data-filter="category">
                                <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false">
                                    <span className="sc-cd__label">Category</span>
                                    <svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                    <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Categories</span></li>
                                    {taxonomies.map(cat => (
                                        <li key={cat.id} className="sc-cd__option" data-value={cat.slug} role="option" aria-selected="false">
                                            <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{cat.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tech Stack Dropdown (using source-code-tag) */}
                            <div className="sc-cd" id="sc-cd-tech" data-filter="tech">
                                <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false">
                                    <span className="sc-cd__label">Tech Stack</span>
                                    <svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                    <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Stacks</span></li>
                                    {tags.map(tag => (
                                        <li key={tag.id} className="sc-cd__option" data-value={tag.slug} role="option" aria-selected="false">
                                            <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{tag.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sort By Dropdown */}
                            <div className="sc-cd sc-cd--radio" id="sc-cd-sort" data-filter="sort" data-single="true">
                                <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false">
                                    <span className="sc-cd__label">Newest First</span>
                                    <svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="sc-cd__menu" role="listbox">
                                    <li className="sc-cd__option active" data-value="newest" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Newest First</span></li>
                                    <li className="sc-cd__option" data-value="oldest" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Oldest First</span></li>
                                    <li className="sc-cd__option" data-value="popular" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Most Popular</span></li>
                                    <li className="sc-cd__option" data-value="downloads" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Most Downloaded</span></li>
                                </ul>
                            </div>

                            {/* Year Dropdown */}
                            <div className="sc-cd" id="sc-cd-year" data-filter="year">
                                <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false">
                                    <span className="sc-cd__label">Year</span>
                                    <svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                    <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Years</span></li>
                                    {allYears.map(year => (
                                        <li key={year} className="sc-cd__option" data-value={year} role="option" aria-selected="false">
                                            <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{year}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <span className="sc-filter-divider" aria-hidden="true"></span>

                            {/* View Toggle */}
                            <div className="sc-view-toggle" role="group" aria-label="Toggle view layout">
                                <button className="sc-view-btn active" id="sc-grid-view-btn" aria-label="Grid view" aria-pressed="true">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                    </svg>
                                </button>
                                <button className="sc-view-btn" id="sc-list-view-btn" aria-label="List view" aria-pressed="false">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="8" y1="6" x2="21" y2="6" />
                                        <line x1="8" y1="12" x2="21" y2="12" />
                                        <line x1="8" y1="18" x2="21" y2="18" />
                                        <line x1="3" y1="6" x2="3.01" y2="6" />
                                        <line x1="3" y1="12" x2="3.01" y2="12" />
                                        <line x1="3" y1="18" x2="3.01" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <button className="sc-reset-btn" id="sc-reset-filters" aria-label="Reset all filters">
                                Reset All
                            </button>
                        </div>

                        {/* Mobile: Filters hamburger button */}
                        <button className="sc-filter-toggle-btn" id="sc-filter-toggle" aria-label="Open filters" aria-expanded="false" aria-controls="sc-filter-drawer">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="8" y1="12" x2="20" y2="12" />
                                <line x1="12" y1="18" x2="20" y2="18" />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                <div className="sc-filter-overlay" id="sc-filter-overlay" aria-hidden="true"></div>
                <div className="sc-filter-drawer" id="sc-filter-drawer" role="dialog" aria-modal="true" aria-label="Filter options">
                    <div className="sc-filter-drawer__head">
                        <p className="sc-filter-drawer__title">Filters</p>
                        <div className="sc-filter-drawer__head-actions">
                            <button className="sc-reset-btn sc-reset-btn--sm" id="sc-reset-filters-m" aria-label="Reset filters">Reset</button>
                            <button className="sc-filter-drawer__close" id="sc-filter-drawer-close" aria-label="Close filters">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="sc-filter-drawer__body">
                        {/* Drawer content (same filters as desktop but in drawer) */}
                        {/* Drawer: Category */}
                        <div className="sc-cd" data-filter="category" data-single="false">
                            <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false"><span className="sc-cd__label">Category</span><svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></button>
                            <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Categories</span></li>
                                {taxonomies.map(cat => (
                                    <li key={cat.id} className="sc-cd__option" data-value={cat.slug} role="option" aria-selected="false">
                                        <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{cat.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Drawer: Tech Stack */}
                        <div className="sc-cd" data-filter="tech" data-single="false">
                            <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false"><span className="sc-cd__label">Tech Stack</span><svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></button>
                            <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Stacks</span></li>
                                {tags.map(tag => (
                                    <li key={tag.id} className="sc-cd__option" data-value={tag.slug} role="option" aria-selected="false">
                                        <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{tag.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Drawer: Sort */}
                        <div className="sc-cd sc-cd--radio" data-filter="sort" data-single="true">
                            <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false"><span className="sc-cd__label">Sort By</span><svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></button>
                            <ul className="sc-cd__menu" role="listbox">
                                <li className="sc-cd__option active" data-value="newest" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Newest First</span></li>
                                <li className="sc-cd__option" data-value="oldest" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Oldest First</span></li>
                                <li className="sc-cd__option" data-value="popular" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Most Popular</span></li>
                                <li className="sc-cd__option" data-value="downloads" role="option" aria-selected="false"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">Most Downloaded</span></li>
                            </ul>
                        </div>
                        {/* Drawer: Year */}
                        <div className="sc-cd" data-filter="year" data-single="false">
                            <button className="sc-cd__trigger" aria-haspopup="listbox" aria-expanded="false"><span className="sc-cd__label">Year</span><svg className="sc-cd__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></button>
                            <ul className="sc-cd__menu" role="listbox" aria-multiselectable="true">
                                <li className="sc-cd__option active" data-value="all" role="option" aria-selected="true"><span className="sc-cd__check"></span><span className="sc-cd__opt-text">All Years</span></li>
                                {allYears.map(year => (
                                    <li key={year} className="sc-cd__option" data-value={year} role="option" aria-selected="false">
                                        <span className="sc-cd__check"></span><span className="sc-cd__opt-text">{year}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Infinite Scroll Wrapper */}
                <div className="sc-infinite-wrap">
                    <div id="sc-spinner" className="sc-spinner" hidden>
                        <div className="sc-spinner__dot"></div>
                        <div className="sc-spinner__dot"></div>
                        <div className="sc-spinner__dot"></div>
                    </div>
                    <div id="sc-infinite-sentinel" style={{ height: '20px' }}></div>
                </div>
            </div>
        </section>
    );
};

export default FilterBar;

