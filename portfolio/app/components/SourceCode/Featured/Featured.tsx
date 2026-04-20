import React from 'react';
import './Featured.css';
import { ACFSourceCodePage, WPSourceCodeItem, WPSourceCodeTaxonomy } from '@/types/acf';

interface FeaturedProps {
    data: ACFSourceCodePage['featured_section'];
    projects: WPSourceCodeItem[];
    tags: WPSourceCodeTaxonomy[];
    taxonomies: WPSourceCodeTaxonomy[];
}

const Featured: React.FC<FeaturedProps> = ({ data, projects, tags, taxonomies }) => {
    const featuredProject = projects.find(p => p.acf?.is_featured) || (projects.length > 0 ? projects[0] : null);

    if (!featuredProject) return null;

    const getImageUrl = (project: WPSourceCodeItem) => {
        if (project.acf?.thumbnail) {
            const thumb = project.acf.thumbnail;
            if (typeof thumb === 'string') return thumb;
            if (typeof thumb === 'object' && thumb !== null && 'url' in thumb) return thumb.url;
        }
        if (project._embedded && project._embedded['wp:featuredmedia']?.[0]?.source_url) {
            return project._embedded['wp:featuredmedia'][0].source_url;
        }
        return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=700&fit=crop";
    };

    const formattedDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getTechInfo = (project: WPSourceCodeItem): string[] => {
        const tagIds = project['source-code-tag'] || project.source_code_tag || [];

        let matchingTags: WPSourceCodeTaxonomy[] = [];

        if (tagIds.length) {
            matchingTags = tags.filter(t => tagIds.includes(t.id));
        }

        // Fallback to _embedded if present
        if (!matchingTags.length && project._embedded?.['wp:term']) {
            const terms = project._embedded['wp:term'].flat();
            matchingTags = terms.filter(t => t.taxonomy === 'source-code-tag') as WPSourceCodeTaxonomy[];
        }

        // Fallback to ACF technologies
        if (!matchingTags.length) {
            const rawTechs = project.acf?.technologies || [];
            const acfTechs = Array.isArray(rawTechs) ? rawTechs : (rawTechs ? [rawTechs] : []);
            return acfTechs.map((t) => typeof t === 'string' ? t : t.name);
        }

        return matchingTags.map(t => t.name);
    };

    const getCategoryName = (project: WPSourceCodeItem) => {
        const catIds = project['source-code-taxonomy'] || project.source_code_taxonomy || [];

        let matchingCats: WPSourceCodeTaxonomy[] = [];

        if (catIds.length) {
            matchingCats = taxonomies.filter(c => catIds.includes(c.id));
        }

        if (!matchingCats.length && project._embedded?.['wp:term']) {
            const terms = project._embedded['wp:term'].flat();
            matchingCats = terms.filter(t => t.taxonomy === 'source-code-taxonomy') as WPSourceCodeTaxonomy[];
        }

        return matchingCats[0]?.name || "Code";
    };

    const techNames = getTechInfo(featuredProject);
    const categoryName = getCategoryName(featuredProject);
    const projectDesc = featuredProject.acf?.description || featuredProject.excerpt?.rendered?.replace(/<[^>]*>?/gm, '') || "";

    return (
        <section id="featured-source-code" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        {data.sub_heading && (
                            <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src={typeof data.sub_heading_image === 'string' ? data.sub_heading_image : (typeof data.sub_heading_image === 'object' && data.sub_heading_image !== null && 'url' in data.sub_heading_image ? data.sub_heading_image.url : "/images/user-2.svg")} alt="Techu Mayur" width="20" height="20" loading="lazy" className="img-fluid" />
                                    </picture>
                                </div>
                                {data.sub_heading}
                            </span>
                        )}
                        {data.title && <h2 dangerouslySetInnerHTML={{ __html: data.title }}></h2>}
                        {data.description && (
                            <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                <p className="fs-5 mt-3">{data.description}</p>
                            </div>
                        )}
                    </div>
                </div>

                <article className="fsc-card mt-5" itemScope itemType="https://schema.org/SoftwareSourceCode" aria-label="Featured source code project">
                    <div className="fsc-image-wrap">
                        <div className="fsc-image-inner zoom-hover">
                            <picture>
                                <img src={getImageUrl(featuredProject)}
                                    alt={featuredProject.title.rendered}
                                    width="900" height="700"
                                    className="fsc-img img-fluid"
                                    loading="lazy"
                                    itemProp="image" />
                            </picture>
                        </div>
                        <div className="fsc-floating-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-code">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            {categoryName}
                        </div>
                        <div className="fsc-glow-orb" aria-hidden="true"></div>
                    </div>

                    <div className="fsc-content">
                        <div className="fsc-eyebrow">
                            <span className="fsc-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg> Spotlight Project
                            </span>
                            <span className="fsc-date" itemProp="datePublished" content={featuredProject.date}>{formattedDate(featuredProject.date)}</span>
                        </div>

                        <h3 className="fsc-title" itemProp="name" dangerouslySetInnerHTML={{ __html: featuredProject.title.rendered }}></h3>

                        <meta itemProp="programmingLanguage" content={techNames.join(', ') || ""} />
                        <meta itemProp="runtimePlatform" content="Web" />
                        <link itemProp="codeRepository" href={featuredProject.acf?.view_link} />

                        <p className="fsc-desc" itemProp="description">
                            {projectDesc}
                        </p>

                        <div className="fsc-tags" role="list" aria-label="Technologies used">
                            {techNames.map((tech, idx) => (
                                <span key={idx} className="fsc-tag" role="listitem">
                                    {tech}
                                </span>
                            ))}
                        </div>



                        <div className="fsc-actions">
                            <a href={`/source-code/${featuredProject.slug}`} className="primary-btn fsc-btn-view" id="featured-source-view-btn" aria-label="View featured source code project" itemProp="url">
                                <span className="primary-btn-icon">
                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15" aria-hidden="true">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15" aria-hidden="true">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                View Project
                            </a>

                            <a href={featuredProject.acf?.download_button || featuredProject.acf?.download_link || featuredProject.acf?.license_section?.download_link || "#"} className="secondary-btn" id="featured-source-download-btn" aria-label="Download featured source code project" target='_blank'>
                                <span>Download</span>
                                <svg width="15px" height="10px" viewBox="0 0 13 10" aria-hidden="true">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default Featured;
