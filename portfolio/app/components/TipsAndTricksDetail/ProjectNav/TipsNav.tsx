import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WPBlogPost } from '@/types/acf';

interface TipsNavProps {
    previous: WPBlogPost | null;
    next: WPBlogPost | null;
}

const TipsNav: React.FC<TipsNavProps> = ({ previous, next }) => {
    if (!previous && !next) return null;

    const getThumbnail = (post: WPBlogPost) => {
        const media = post._embedded?.['wp:featuredmedia']?.[0];
        if (!media) return null;
        
        return media.media_details?.sizes?.['thumbnail']?.source_url || 
               media.media_details?.sizes?.['medium']?.source_url || 
               media.source_url || 
               null;
    };

    const renderNavContent = (post: WPBlogPost, direction: 'prev' | 'next') => {
        const thumbnail = getThumbnail(post);
        const isPrev = direction === 'prev';
        
        return (
            <Link href={`/tips-and-tricks/${post.slug}`} className={`nav-item-modern ${isPrev ? 'prev-project' : 'next-project text-end'}`}>
                {isPrev && (
                    <div className="nav-thumb">
                        {thumbnail ? (
                            <Image 
                                src={thumbnail} 
                                alt={post.title.rendered} 
                                width={120} 
                                height={120} 
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
                            <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg> PREVIOUS</>
                        ) : (
                            <>NEXT <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg></>
                        )}
                    </span>
                    <h4 className="nav-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </div>
                {!isPrev && (
                    <div className="nav-thumb">
                        {thumbnail ? (
                            <Image 
                                src={thumbnail} 
                                alt={post.title.rendered} 
                                width={120} 
                                height={120} 
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

export default TipsNav;
