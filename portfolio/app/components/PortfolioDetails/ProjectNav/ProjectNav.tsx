import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WPPortfolioItem } from '@/types/acf';

interface ProjectNavProps {
    previous: WPPortfolioItem | null;
    next: WPPortfolioItem | null;
}

const ProjectNav: React.FC<ProjectNavProps> = ({ previous, next }) => {
    if (!previous && !next) return null;

    const getThumbnail = (project: WPPortfolioItem) => {
        const media = project._embedded?.['wp:featuredmedia']?.[0];
        if (!media) return null;
        
        return media.media_details?.sizes?.['thumbnail']?.source_url || 
               media.media_details?.sizes?.['medium']?.source_url || 
               media.source_url || 
               null;
    };

    const renderNavContent = (project: WPPortfolioItem, direction: 'prev' | 'next') => {
        const thumbnail = getThumbnail(project);
        const isPrev = direction === 'prev';
        
        return (
            <Link href={`/portfolio/${project.slug}`} className={`nav-item-modern ${isPrev ? 'prev-project' : 'next-project text-end'}`}>
                {isPrev && (
                    <div className="nav-thumb">
                        {thumbnail ? (
                            <Image 
                                src={thumbnail} 
                                alt={project.title.rendered} 
                                width={150} 
                                height={150} 
                                className="img-fluid"
                                unoptimized
                            />
                        ) : (
                            <div className="nav-thumb-placeholder d-flex align-items-center justify-content-center bg-dark text-white-50">
                                <small>No Image</small>
                            </div>
                        )}
                    </div>
                )}
                <div className="nav-content">
                    <span className="nav-label">
                        {isPrev ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg> PREVIOUS</>
                        ) : (
                            <>NEXT <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg></>
                        )}
                    </span>
                    <h4 className="nav-title" dangerouslySetInnerHTML={{ __html: project.title.rendered }} />
                </div>
                {!isPrev && (
                    <div className="nav-thumb">
                        {thumbnail ? (
                            <Image 
                                src={thumbnail} 
                                alt={project.title.rendered} 
                                width={150} 
                                height={150} 
                                className="img-fluid"
                                unoptimized
                            />
                        ) : (
                            <div className="nav-thumb-placeholder d-flex align-items-center justify-content-center bg-dark text-white-50">
                                <small>No Image</small>
                            </div>
                        )}
                    </div>
                )}
            </Link>
        );
    };

    return (
        <section id="pd-next-prev-nav" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="nav-wrapper-modern">
                            {previous ? renderNavContent(previous, 'prev') : <div className="nav-item-modern placeholder-nav" />}
                            {next ? renderNavContent(next, 'next') : <div className="nav-item-modern placeholder-nav" />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectNav;
