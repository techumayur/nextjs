import React from 'react';
import Link from 'next/link';
import { WPSourceCodeItem } from '@/types/acf';
import './ProjectNavigation.css';

interface ProjectNavigationProps {
    previous: WPSourceCodeItem | null;
    next: WPSourceCodeItem | null;
}

export default function ProjectNavigation({ previous, next }: ProjectNavigationProps) {
    if (!previous && !next) return null;

    return (
        <section id="pd-next-prev-nav" className="section-spacing pt-0">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="nav-wrapper-modern shadow-premium">
                            {/* Previous Project */}
                            {previous ? (
                                <Link href={`/source-code/${previous.slug}`} className="nav-item-modern prev-project">
                                    <div className="nav-thumb">
                                        <img 
                                            src={previous._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop"} 
                                            alt={previous.title.rendered} 
                                        />
                                    </div>
                                    <div className="nav-content">
                                        <span className="nav-label">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                                <polyline points="12 19 5 12 12 5"></polyline>
                                            </svg> 
                                            PREVIOUS
                                        </span>
                                        <h4 className="nav-title">{previous.title.rendered}</h4>
                                    </div>
                                </Link>
                            ) : <div className="nav-item-modern empty-nav d-none d-lg-flex"></div>}

                            {/* Next Project */}
                            {next ? (
                                <Link href={`/source-code/${next.slug}`} className="nav-item-modern next-project text-end">
                                    <div className="nav-content">
                                        <span className="nav-label">
                                            NEXT 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </span>
                                        <h4 className="nav-title">{next.title.rendered}</h4>
                                    </div>
                                    <div className="nav-thumb">
                                        <img 
                                            src={next._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop"} 
                                            alt={next.title.rendered} 
                                        />
                                    </div>
                                </Link>
                            ) : <div className="nav-item-modern empty-nav d-none d-lg-flex"></div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
