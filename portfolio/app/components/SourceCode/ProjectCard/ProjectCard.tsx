import React from 'react';
import Link from 'next/link';
import { WPSourceCodeItem, WPSourceCodeTaxonomy } from '@/types/acf';
import './ProjectCard.css';

interface ProjectCardProps {
    project: WPSourceCodeItem;
    taxonomies?: WPSourceCodeTaxonomy[];
    tags?: WPSourceCodeTaxonomy[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, taxonomies = [], tags = [] }) => {
    const year = new Date(project.date).getFullYear().toString();

    const getImageUrl = () => {
        if (project.acf?.thumbnail) {
            const thumb = project.acf.thumbnail;
            if (typeof thumb === 'string') return thumb;
            if (typeof thumb === 'object' && thumb !== null && 'url' in thumb) return thumb.url;
        }
        if (project._embedded && project._embedded['wp:featuredmedia']?.[0]?.source_url) {
            return project._embedded['wp:featuredmedia'][0].source_url;
        }
        return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&h=500&fit=crop";
    };

    const getCategoryInfo = () => {
        const catIds = project['source-code-taxonomy'] || project.source_code_taxonomy || [];
        let matchingCats: (WPSourceCodeTaxonomy | { name: string; slug: string })[] = [];

        if (catIds.length && taxonomies.length) {
            matchingCats = taxonomies.filter(c => catIds.includes(c.id));
        }

        // Fallback to _embedded if present
        if (!matchingCats.length && project._embedded?.['wp:term']) {
            const terms = project._embedded['wp:term'].flat();
            matchingCats = terms.filter(t => t.taxonomy === 'source-code-taxonomy');
        }

        if (!matchingCats.length) return { name: 'Source Code', slug: '' };

        return {
            name: matchingCats[0]?.name || 'Source Code',
            slug: matchingCats.map(c => c.slug).join(',')
        };
    };

    const getTechInfo = () => {
        const tagIds = project['source-code-tag'] || project.source_code_tag || [];
        let matchingTags: (WPSourceCodeTaxonomy | { name: string; slug: string })[] = [];

        if (tagIds.length && tags.length) {
            matchingTags = tags.filter(t => tagIds.includes(t.id));
        }

        // Fallback to _embedded if present
        if (!matchingTags.length && project._embedded?.['wp:term']) {
            const terms = project._embedded['wp:term'].flat();
            matchingTags = terms.filter(t => t.taxonomy === 'source-code-tag');
        }

        // Final fallback to ACF technologies
        if (!matchingTags.length) {
            const rawTechs = project.acf?.technologies || [];
            const acfTechs = Array.isArray(rawTechs) ? rawTechs : (rawTechs ? [rawTechs] : []);
            
            return {
                names: acfTechs.map((t) => typeof t === 'string' ? t : t.name),
                slugs: acfTechs.map((t) => (typeof t === 'string' ? t : t.name).toLowerCase().replace(/\s+/g, '-')).join(',')
            };
        }

        return {
            names: matchingTags.map(t => t.name),
            slugs: matchingTags.map(t => t.slug).join(',')
        };
    };

    const catInfo = getCategoryInfo();
    const techInfo = getTechInfo();

    return (
        <article
            className="sc-project-card"
            itemScope
            itemType="https://schema.org/SoftwareSourceCode"
            data-category={catInfo.slug}
            data-tech={techInfo.slugs}
            data-year={year}
            data-title={project.title.rendered.toLowerCase()}
        >
            <div className="sc-card__terminal-header">
                <div className="sc-terminal-dot sc-terminal-dot--red"></div>
                <div className="sc-terminal-dot sc-terminal-dot--yellow"></div>
                <div className="sc-terminal-dot sc-terminal-dot--green"></div>
            </div>

            <div className="sc-card__image">
                <img src={getImageUrl()}
                    alt={project.title.rendered}
                    loading="lazy"
                    itemProp="image" />

                <div className="sc-card__overlay">
                    <Link href={`/source-code/${project.slug}`} className="sc-card__quick-view" aria-label="View Details">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-terminal">
                            <polyline points="4 17 10 11 4 5"></polyline>
                            <line x1="12" y1="19" x2="20" y2="19"></line>
                        </svg> peek_code()
                    </Link>
                </div>
            </div>

            <div className="sc-card__body">
                <div className="sc-card__code-peek">
                    {project.acf?.description?.slice(0, 80) || project.excerpt?.rendered.replace(/<[^>]*>?/gm, '').slice(0, 80) || ""}...
                </div>
                <span className="sc-card__tag">{catInfo.name}</span>
                <div className="sc-card__badges">
                    {techInfo.names.map((tech, i) => (
                        <span key={i} className="sc-badge sc-badge--tech">{tech}</span>
                    ))}
                    {project.acf?.difficulty_level && (
                         <span className="sc-badge sc-badge--level">{project.acf.difficulty_level}</span>
                    )}
                </div>
                <Link href={`/source-code/${project.slug}`}>
                    <h3 className="sc-card__title" itemProp="name" dangerouslySetInnerHTML={{ __html: project.title.rendered }}></h3>
                </Link>
                <div className="sc-card__desc" itemProp="description" dangerouslySetInnerHTML={{ __html: project.acf?.description || project.excerpt?.rendered || "" }} />

                <div className="sc-card__footer">
                    <div className="sc-card__stats">
                        {project.acf?.downloads && (
                            <div className="sc-stat">
                                <span className="sc-stat__val">{project.acf.downloads}</span>
                                <span className="sc-stat__label">Downloads</span>
                            </div>
                        )}
                        {project.acf?.rating && (
                            <div className="sc-stat">
                                <span className="sc-stat__val">{project.acf.rating}</span>
                                <span className="sc-stat__label">Rating</span>
                            </div>
                        )}
                    </div>
                    <div className="sc-card__actions">
                        <Link href={`/source-code/${project.slug}`} className="sc-btn sc-btn--view" aria-label="View Project">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>View</span>
                        </Link>
                        <a href={project.acf?.download_button || project.acf?.download_link || project.acf?.license_section?.download_link || "#"} className="sc-btn sc-btn--download" aria-label="Download Project">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span>Download</span>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProjectCard;
