"use client";

import React from "react";
import { WPPortfolioItem, WPTerm } from "@/types/acf";
import Link from 'next/link';

interface TaxonomiesProps {
    project: WPPortfolioItem;
}

const Taxonomies = ({ project }: TaxonomiesProps) => {
    // Extract categories and tags from the embedded terms
    const terms = project._embedded?.['wp:term'] || [];

    // Portfolio taxonomy categories
    const categories = terms.find(group => group.length > 0 && group[0].taxonomy === 'portfolio-taxonomy') || [];

    // Portfolio tags - Checking for multiple common slug variations
    const tags = terms.find(group => 
        group.length > 0 && (
            group[0].taxonomy === 'post_tag' || 
            group[0].taxonomy === 'portfolio-tag' || 
            group[0].taxonomy === 'portfolio-tags' || 
            group[0].taxonomy === 'portfolio_tag' ||
            group[0].taxonomy === 'portfolio_tags' ||
            group[0].taxonomy === 'portfolios-tags' ||
            group[0].taxonomy === 'portfolios_tags'
        )
    ) || [];


    // Custom Taxonomy logic from ACF
    const taxData = project.acf?.taxonomies;
    const focus = taxData?.project_focus;
    const keywords = Array.isArray(taxData?.keywords) ? taxData.keywords : [];
    const statNum = taxData?.stats?.number;
    const statText = taxData?.stats?.text;

    if (categories.length === 0 && tags.length === 0 && !focus && keywords.length === 0 && !statNum) return null;

    return (
        <section id="pd-project-taxonomies" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="bento-taxonomy-grid">
                            {/* Categories Block */}
                            {categories.length > 0 && (
                                <div className="bento-block category-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Project Categories</h3>
                                        <div className="bento-category-list">
                                            {categories.map((cat: WPTerm) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/portfolio?category=${cat.id}`}
                                                    className="bento-cat-item"
                                                >
                                                    <span>{cat.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tags Block */}
                            {tags.length > 0 && (
                                <div className="bento-block tags-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Project Tags</h3>
                                        <div className="bento-tags-cloud">
                                            {tags.map((tag: WPTerm) => (
                                                <Link
                                                    key={tag.id}
                                                    href={`/portfolio?tag=${tag.id}`}
                                                    className="bento-tag"
                                                >
                                                    {tag.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Focus Block */}
                            {(focus || keywords.length > 0) && (
                                <div className="bento-block glass-block">
                                    <div className="bento-content">
                                        <h3 className="bento-title">Focus</h3>
                                        {focus && <div className="bento-text" dangerouslySetInnerHTML={{ __html: focus }}></div>}
                                        <div className="bento-links-mini">
                                            {keywords.map((kw, idx) => (
                                                <Link key={idx} href={kw.link}>{kw.text}</Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats Block */}
                            {(statNum || statText) && (
                                <div className="bento-block stats-block">
                                    <div className="bento-content text-center">
                                        <span className="bento-stat-num">{statNum}</span>
                                        <span className="bento-stat-text">{statText}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Taxonomies;
