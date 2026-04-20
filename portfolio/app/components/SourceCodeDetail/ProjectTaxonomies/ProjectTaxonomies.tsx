"use client";

import React from 'react';
import Link from 'next/link';
import './ProjectTaxonomies.css';

interface ProjectTaxonomiesProps {
    categories?: string[];
    tags?: string[];
    data?: {
        focus_text?: string;
        optimization_level?: string;
        edition?: string;
        highlight_title?: string;
    };
}

export default function ProjectTaxonomies({
    categories = [],
    tags = [],
    data
}: ProjectTaxonomiesProps) {
    
    // strictly dynamic data
    const focusText = data?.focus_text;
    const optimizationLevel = data?.optimization_level;
    const edition = data?.edition;
    const highlightTitle = data?.highlight_title;

    // Only hide if we have absolutely no data at all
    if (categories.length === 0 && tags.length === 0 && !focusText && !optimizationLevel && !edition && !highlightTitle) return null;

    return (
        <section id="pd-project-taxonomies" className="section-spacing pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="bento-taxonomy-grid">
                            {/* Categories Block (Large) */}
                            {categories.length > 0 && (
                                <div className="bento-block category-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Project Categories</h3>
                                        <div className="bento-category-list">
                                            {categories.map((cat, index) => (
                                                <Link href="/source-code" key={index} className="bento-cat-item">
                                                    <span>{cat}</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        <polyline points="12 5 19 12 12 19"></polyline>
                                                    </svg>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tags Block (Cloud) */}
                            {tags.length > 0 && (
                                <div className="bento-block tags-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Project Tags</h3>
                                        <div className="bento-tags-cloud">
                                            {tags.map((tag, index) => (
                                                <Link href="/source-code" key={index} className="bento-tag">
                                                    {tag}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Keywords Block (Glass) */}
                            {(focusText || optimizationLevel) && (
                                <div className="bento-block glass-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Focus</h3>
                                        {focusText && <p className="bento-text">{focusText}</p>}
                                        {optimizationLevel && (
                                            <div className="bento-stat">
                                                <span className="bento-stat-num">{optimizationLevel}</span>
                                                <span className="bento-stat-text">Optimized</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Highlights Block (Color) */}
                            {(edition || highlightTitle) && (
                                <div className="bento-block stats-block">
                                    <div className="bento-content text-center">
                                        {edition && <div className="premium-badge mb-3">{edition}</div>}
                                        {highlightTitle && <h4 className="text-white mb-0">{highlightTitle}</h4>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
