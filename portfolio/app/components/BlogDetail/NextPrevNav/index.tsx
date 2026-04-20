import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WPBlogPost } from '@/types/acf';
import './css/NextPrevNav.css';

interface NextPrevNavProps {
    previous: WPBlogPost | null;
    next: WPBlogPost | null;
}

const NextPrevNav: React.FC<NextPrevNavProps> = ({ previous, next }) => {
    const getThumbnail = (post: WPBlogPost) => {
        const media = post._embedded?.['wp:featuredmedia']?.[0];
        return media?.source_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop";
    };

    return (
        <section id="pd-next-prev-nav" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="nav-wrapper-modern">
                            {/* Previous Project */}
                            {previous ? (
                                <Link href={`/blog/${previous.slug}`} className="nav-item-modern prev-project">
                                    <div className="nav-thumb">
                                        <Image 
                                            src={getThumbnail(previous)} 
                                            alt={previous.title.rendered} 
                                            width={150}
                                            height={150}
                                            className="img-fluid"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="nav-content">
                                        <span className="nav-label">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                                <polyline points="12 19 5 12 12 5"></polyline>
                                            </svg> PREVIOUS
                                        </span>
                                        <h4 className="nav-title" dangerouslySetInnerHTML={{ __html: previous.title.rendered }} />
                                    </div>
                                </Link>
                            ) : (
                                <div className="nav-item-modern prev-project disabled" style={{ opacity: 0.3, pointerEvents: 'none' }}>
                                    {/* Empty space or placeholder */}
                                </div>
                            )}

                            {/* Next Project */}
                            {next ? (
                                <Link href={`/blog/${next.slug}`} className="nav-item-modern next-project text-end">
                                    <div className="nav-content">
                                        <span className="nav-label">
                                            NEXT <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </span>
                                        <h4 className="nav-title" dangerouslySetInnerHTML={{ __html: next.title.rendered }} />
                                    </div>
                                    <div className="nav-thumb">
                                        <Image 
                                            src={getThumbnail(next)} 
                                            alt={next.title.rendered} 
                                            width={150}
                                            height={150}
                                            className="img-fluid"
                                            unoptimized
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <div className="nav-item-modern next-project text-end disabled" style={{ opacity: 0.3, pointerEvents: 'none' }}>
                                    {/* Empty space or placeholder */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NextPrevNav;
