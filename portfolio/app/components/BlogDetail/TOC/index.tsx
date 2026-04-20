'use client';
import React, { useState, useEffect, useRef } from 'react';
import './css/TOC.css';

const BlogTOC: React.FC = () => {
    const [headings, setHeadings] = useState<{ id: string, text: string, tagName: string, num: string }[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        const article = document.getElementById('blog-article');
        if (!article) return;

        const foundHeadings = Array.from(article.querySelectorAll('h2[id], h3[id], h4[id]'));
        let h2Count = 0;
        let h3Count = 0;

        const headingData = foundHeadings.map((h) => {
            const tagName = h.tagName;
            let num = '';
            if (tagName === 'H2') {
                h2Count++;
                h3Count = 0;
                num = h2Count.toString();
            } else if (tagName === 'H3') {
                h3Count++;
                num = `${h2Count}.${h3Count}`;
            } else {
                num = '—';
            }

            return {
                id: h.id,
                text: h.textContent?.replace(/^▸\s*/, '') || '',
                tagName,
                num
            };
        });

        setHeadings(headingData);

        // Active tracking with IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, { rootMargin: '-10% 0px -68% 0px', threshold: 0 });

        foundHeadings.forEach((h) => observer.observe(h));

        // Reading progress
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            const artRect = article.getBoundingClientRect();
            const artTop = artRect.top + scrollTop;
            const artHeight = article.offsetHeight;
            const prog = Math.min(Math.max(
                ((scrollTop + window.innerHeight * 0.5 - artTop) / artHeight) * 100, 0), 100);
            setProgress(prog);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollTo = (id: string) => {
        const target = document.getElementById(id);
        if (target) {
            const y = target.getBoundingClientRect().top + window.pageYOffset - 110;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const filled = (progress / 100) * 100;

    return (
        <>
            <section id="blog-toc-wrapper" className="sticky-toc-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="toc-card" id="toc-card">
                                <div 
                                    className="toc-card__toggle" 
                                    id="toc-toggle-btn" 
                                    role="button" 
                                    tabIndex={0} 
                                    aria-expanded={isExpanded} 
                                    aria-controls="toc-body"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <div className="toc-card__title-wrap">
                                        <span className="toc-card__icon" aria-hidden="true">
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                                <line x1="3" y1="12" x2="16" y2="12"></line>
                                                <line x1="3" y1="18" x2="12" y2="18"></line>
                                            </svg>
                                        </span>
                                        <span className="toc-card__title">Table of Contents</span>
                                        <span className="toc-card__count" id="toc-count" aria-hidden="true">
                                            {headings.length} sections
                                        </span>
                                    </div>
                                    <div className="toc-card__toggle-right">
                                        <div className="toc-card__progress" aria-hidden="true">
                                            <svg className="toc-ring" viewBox="0 0 36 36" width="36" height="36">
                                                <circle className="toc-ring__bg" cx="18" cy="18" r="15.9155" />
                                                <circle 
                                                    className="toc-ring__fill" 
                                                    cx="18" cy="18" r="15.9155" 
                                                    strokeDasharray={`${filled.toFixed(1)} ${ (100 - filled).toFixed(1) }`} 
                                                />
                                            </svg>
                                            <span className="toc-ring__pct" id="toc-ring-pct">{Math.round(progress)}%</span>
                                        </div>
                                        <span className="toc-card__chevron" aria-hidden="true" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </span>
                                        <span className="toc-card__sidebar-icon d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#blogSidebarOffcanvas" onClick={(e) => e.stopPropagation()} aria-label="Toggle Sidebar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-grid">
                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                <rect x="3" y="14" width="7" height="7"></rect>
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                <div className={`toc-card__body ${isExpanded ? '' : 'toc-collapsed'}`} id="toc-body">
                                    <nav id="toc-grid-nav" className="toc-card__nav" aria-label="Article sections">
                                        <ol className="toc-grid">
                                            {headings.map((h) => (
                                                <li key={h.id} className={`toc-grid__item ${h.tagName !== 'H2' ? 'toc-grid__item--sub' : ''}`}>
                                                    <a 
                                                        href={`#${h.id}`} 
                                                        className={`toc-grid__link ${activeId === h.id ? 'toc-grid__link--active' : ''}`}
                                                        onClick={(e) => { e.preventDefault(); handleScrollTo(h.id); }}
                                                    >
                                                        <span className="toc-grid__num" aria-hidden="true">{h.num}</span>
                                                        <span>{h.text}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BlogTOC;
