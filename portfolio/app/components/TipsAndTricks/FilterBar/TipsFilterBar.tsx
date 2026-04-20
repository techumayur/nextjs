import { WPBlogPost, WPTutorialTaxonomy } from '@/types/acf';
import './TipsFilterBar.css';

interface TipsFilterBarProps {
    tips: WPBlogPost[];
    taxonomies: {
        categories: WPTutorialTaxonomy[];
        tags: WPTutorialTaxonomy[];
    };
}

export default function TipsFilterBar({ tips, taxonomies }: TipsFilterBarProps) {
  const { categories, tags } = taxonomies;

  // Extract unique years from tips
  const years = Array.from(new Set(tips.map(tip => {
      if (tip.date) {
          return new Date(tip.date).getFullYear().toString();
      }
      return "";
  }).filter(y => y !== ""))).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <section id="tips-filters" className="section-spacing pt-4 pb-0">
        <div className="container">
            <div className="tips-filter-container">

                <div className="tips-filter-top">
                    {/* Search Bar */}
                    <div className="tips-search-box">
                        <input type="text" placeholder="Search tips, tricks, and tutorials..." id="tips-search-input" />
                        <button className="tips-search-btn" aria-label="Submit search">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="tips-desktop-actions">
                        <div className="tips-actions-group">
                            <div className="tips-view-toggle">
                                <button className="view-btn active" id="tips-grid-view" title="Grid View">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                    </svg>
                                </button>
                                <button className="view-btn" id="tips-list-view" title="List View">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="8" y1="6" x2="21" y2="6"></line>
                                        <line x1="8" y1="12" x2="21" y2="12"></line>
                                        <line x1="8" y1="18" x2="21" y2="18"></line>
                                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <button className="tips-reset-btn" id="tips-reset-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <polyline points="1 20 1 14 7 14"></polyline>
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                </svg> Reset
                            </button>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="tips-filter-toggle-btn" id="tips-filter-toggle" aria-label="Open filters">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="8" y1="12" x2="20" y2="12"></line>
                            <line x1="12" y1="18" x2="20" y2="18"></line>
                        </svg>
                        Filters
                    </button>
                </div>

                {/* Desktop Bottom Filters */}
                <div className="tips-filter-bottom tips-desktop-filters">
                    {/* Category Dropdown */}
                    <div className="tips-dropdown" data-filter="category" data-single="false">
                        <div className="tips-dropdown-trigger">
                            <span className="tips-dropdown-label">Category</span>
                            <svg className="tips-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className="tips-dropdown-menu">
                            <label className="tips-option active">
                                <input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Categories
                            </label>
                            {categories.map((cat) => (
                                <label key={cat.id} className="tips-option">
                                    <input type="checkbox" value={cat.slug} /> <span className="tips-check"></span> {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Year Dropdown */}
                    <div className="tips-dropdown" data-filter="year" data-single="false">
                        <div className="tips-dropdown-trigger">
                            <span className="tips-dropdown-label">Year</span>
                            <svg className="tips-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className="tips-dropdown-menu">
                            <label className="tips-option active">
                                <input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Years
                            </label>
                            {years.map((year) => (
                                <label key={year} className="tips-option">
                                    <input type="checkbox" value={year} /> <span className="tips-check"></span> {year}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="tips-dropdown" data-filter="sort" data-single="true">
                        <div className="tips-dropdown-trigger">
                            <span className="tips-dropdown-label">New to Old</span>
                            <svg className="tips-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className="tips-dropdown-menu">
                            <label className="tips-option active">
                                <input type="radio" name="tips_sort" value="newest" defaultChecked /> <span className="tips-check tips-radio"></span> New to Old
                            </label>
                            <label className="tips-option">
                                <input type="radio" name="tips_sort" value="oldest" /> <span className="tips-check tips-radio"></span> Old to New
                            </label>
                            <label className="tips-option">
                                <input type="radio" name="tips_sort" value="popular" /> <span className="tips-check tips-radio"></span> Most Popular
                            </label>
                        </div>
                    </div>

                    {/* Tags Dropdown */}
                    <div className="tips-dropdown" data-filter="tags" data-single="false">
                        <div className="tips-dropdown-trigger">
                            <span className="tips-dropdown-label">Tags</span>
                            <svg className="tips-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                        <div className="tips-dropdown-menu">
                            <label className="tips-option active">
                                <input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Tags
                            </label>
                            {tags.map((tag) => (
                                <label key={tag.id} className="tips-option">
                                    <input type="checkbox" value={tag.slug} /> <span className="tips-check"></span> {tag.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            <div className="tips-filter-overlay" id="tips-filter-overlay"></div>

            {/* Mobile Filter Drawer */}
            <div className="tips-filter-drawer" id="tips-filter-drawer">
                <div className="tips-drawer-head">
                    <p className="tips-drawer-title">Filters</p>
                    <div className="tips-drawer-actions">
                        <button className="tips-drawer-close" id="tips-filter-close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="tips-drawer-body">
                    {/* Categories (Drawer) */}
                    <div className="tips-drawer-item" data-filter="category" data-single="false">
                        <div className="tips-drawer-trigger">Category <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></div>
                        <div className="tips-drawer-content">
                            <label className="tips-option active"><input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Categories</label>
                            {categories.map((cat) => (
                                <label key={cat.id} className="tips-option"><input type="checkbox" value={cat.slug} /> <span className="tips-check"></span> {cat.name}</label>
                            ))}
                        </div>
                    </div>
                    {/* Year (Drawer) */}
                    <div className="tips-drawer-item" data-filter="year" data-single="false">
                        <div className="tips-drawer-trigger">Year <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></div>
                        <div className="tips-drawer-content">
                            <label className="tips-option active"><input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Years</label>
                            {years.map((year) => (
                                <label key={year} className="tips-option"><input type="checkbox" value={year} /> <span className="tips-check"></span> {year}</label>
                            ))}
                        </div>
                    </div>
                    {/* Sort (Drawer) */}
                    <div className="tips-drawer-item" data-filter="sort" data-single="true">
                        <div className="tips-drawer-trigger">Sort By <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></div>
                        <div className="tips-drawer-content">
                            <label className="tips-option active"><input type="radio" name="tips_sort_m" value="newest" defaultChecked /> <span className="tips-check tips-radio"></span> New to Old</label>
                            <label className="tips-option"><input type="radio" name="tips_sort_m" value="oldest" /> <span className="tips-check tips-radio"></span> Old to New</label>
                        </div>
                    </div>
                    {/* Tags (Drawer) */}
                    <div className="tips-drawer-item" data-filter="tags" data-single="false">
                        <div className="tips-drawer-trigger">Tags <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg></div>
                        <div className="tips-drawer-content">
                            <label className="tips-option active"><input type="checkbox" value="all" defaultChecked /> <span className="tips-check"></span> All Tags</label>
                            {tags.map((tag) => (
                                <label key={tag.id} className="tips-option"><input type="checkbox" value={tag.slug} /> <span className="tips-check"></span> {tag.name}</label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tips-drawer-footer d-flex gap-3">
                    <button className="tips-reset-btn w-50 justify-content-center" id="tips-reset-btn-mob">
                        Reset
                    </button>
                    <button className="primary-btn w-50 justify-content-center border-0" id="tips-apply-btn-mob" style={{ minHeight: '45px', borderRadius: '5px' }}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
}

