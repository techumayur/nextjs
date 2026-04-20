"use client";

import React, { useState, useEffect } from 'react';
import './TutorialsFilterBar.css';

interface TutorialsFilterBarProps {
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const TutorialsFilterBar: React.FC<TutorialsFilterBarProps> = ({ viewMode, setViewMode }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const [activeDrawerGroup, setActiveDrawerGroup] = useState<string | null>('category');

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const toggleDropdown = (name: string) => setActiveDropdown(activeDropdown === name ? null : name);
    const toggleDrawerGroup = (name: string) => setActiveDrawerGroup(activeDrawerGroup === name ? null : name);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && !(event.target as HTMLElement).closest('.premium-dropdown')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    return (
        <>
            <section id="tutorials-filter-section" className="section-spacing pt-0 pb-0">
                <div className="container">
                    <div className="tutorial-premium-filter-bar">
                        <div className="filter-bar-inner">
                            {/* Search Component */}
                            <div className="filter-search-wrap">
                                <div className="filter-search-input-group">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search search-icon">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input type="text" id="tutorial-search-input" placeholder="Search tutorials by name..." />
                                    <div className="search-actions">
                                        <button className="search-clear-btn" id="search-clear-btn" title="Clear Search">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
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

                            {/* Desktop Filters (Pill Style) */}
                            <div className="filter-controls-wrap d-none d-lg-flex">
                                {/* Category Dropdown */}
                                <div className={`premium-dropdown ${activeDropdown === 'category' ? 'active' : ''}`}>
                                    <button className="premium-dropdown-btn" onClick={() => toggleDropdown('category')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                            <polyline points="2 17 12 22 22 17"></polyline>
                                            <polyline points="2 12 12 17 22 12"></polyline>
                                        </svg>
                                        <span className="dropdown-label-text">Category</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> 
                                            Filter by Category
                                        </div>
                                        <label className="premium-option active">
                                            <input type="checkbox" value="all" defaultChecked />
                                            <span className="option-check">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </span>
                                            All Categories
                                        </label>
                                        <label className="premium-option">
                                            <input type="checkbox" value="frontend" />
                                            <span className="option-check">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </span>
                                            Frontend Dev
                                        </label>
                                    </div>
                                </div>

                                {/* Year Dropdown */}
                                <div className={`premium-dropdown ${activeDropdown === 'year' ? 'active' : ''}`}>
                                    <button className="premium-dropdown-btn" onClick={() => toggleDropdown('year')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        <span className="dropdown-label-text">Post Year</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">Select Year</div>
                                        <label className="premium-option active">
                                            <input type="checkbox" value="all" defaultChecked />
                                            <span className="option-check">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </span>
                                            All Years
                                        </label>
                                    </div>
                                </div>

                                {/* Sort Dropdown */}
                                <div className={`premium-dropdown ${activeDropdown === 'sort' ? 'active' : ''}`}>
                                    <button className="premium-dropdown-btn" onClick={() => toggleDropdown('sort')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                        </svg>
                                        <span className="dropdown-label-text">Sort By</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    <div className="premium-dropdown-menu">
                                        <div className="menu-header">Order By</div>
                                        <label className="premium-option active">
                                            <input type="radio" name="tutorial_sort" value="newest" defaultChecked />
                                            <span className="option-check radio"></span>
                                            Newest First
                                        </label>
                                        <label className="premium-option">
                                            <input type="radio" name="tutorial_sort" value="oldest" />
                                            <span className="option-check radio"></span>
                                            Oldest First
                                        </label>
                                    </div>
                                </div>

                                {/* Reset Action */}
                                <button className="premium-reset-btn" id="tutorial-reset-btn" title="Reset All Filters">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <div className="mobile-filter-actions d-lg-none">
                                <button className="mobile-toggle-btn" id="tutorial-filter-toggle" onClick={toggleDrawer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                    <span>Explore Filters</span>
                                </button>
                            </div>

                            {/* View Toggle Buttons */}
                            <div className="view-toggle-wrap">
                                <button 
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} 
                                    id="tutorial-grid-view" 
                                    title="Grid View"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                </button>
                                <button 
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                                    id="tutorial-list-view" 
                                    title="List View"
                                    onClick={() => setViewMode('list')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <div className={`filter-overlay-glass ${isDrawerOpen ? 'is-open' : ''}`} id="tutorial-filter-overlay" onClick={toggleDrawer}></div>
                <div className={`premium-filter-drawer ${isDrawerOpen ? 'is-open' : ''}`} id="tutorial-filter-drawer">
                    <div className="drawer-header">
                        <h3>Filter Tutorials</h3>
                        <button className="drawer-close-btn" id="tutorial-filter-close" onClick={toggleDrawer}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="drawer-content">
                        {/* Mobile Drawer Groups */}
                        <div className={`drawer-group ${activeDrawerGroup === 'category' ? 'active' : ''}`}>
                            <h4 className="trigger-label" onClick={() => toggleDrawerGroup('category')}>
                                Category
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </h4>
                            <div className="options-container">
                                <label className="premium-option active">
                                    <input type="checkbox" value="all" defaultChecked />
                                    <span className="option-check">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </span>
                                    All Categories
                                </label>
                                <label className="premium-option">
                                    <input type="checkbox" value="frontend" />
                                    <span className="option-check">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </span>
                                    Frontend Dev
                                </label>
                            </div>
                        </div>

                        <div className={`drawer-group ${activeDrawerGroup === 'year' ? 'active' : ''}`}>
                            <h4 className="trigger-label" onClick={() => toggleDrawerGroup('year')}>
                                Post Year
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </h4>
                            <div className="options-container">
                                <label className="premium-option active">
                                    <input type="checkbox" value="all" defaultChecked />
                                    <span className="option-check">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </span>
                                    All Years
                                </label>
                            </div>
                        </div>

                        <div className={`drawer-group ${activeDrawerGroup === 'sort' ? 'active' : ''}`}>
                            <h4 className="trigger-label" onClick={() => toggleDrawerGroup('sort')}>
                                Sort By
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </h4>
                            <div className="options-container">
                                <label className="premium-option active">
                                    <input type="radio" name="tutorial_sort_mob" value="newest" defaultChecked />
                                    <span className="option-check radio"></span>
                                    Newest First
                                </label>
                                <label className="premium-option">
                                    <input type="radio" name="tutorial_sort_mob" value="oldest" />
                                    <span className="option-check radio"></span>
                                    Oldest First
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="drawer-footer">
                        <button className="premium-apply-btn w-100 mb-2" id="tutorial-apply-mob" onClick={toggleDrawer}>Apply Filters</button>
                        <button className="premium-reset-btn-alt w-100" id="tutorial-reset-btn-mob">Reset Filters</button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TutorialsFilterBar;

