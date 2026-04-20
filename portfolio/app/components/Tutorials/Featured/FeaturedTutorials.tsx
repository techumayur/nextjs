import React from 'react';
import './FeaturedTutorials.css';

const FeaturedTutorials: React.FC = () => {
    return (
        <section id="featured-tutorials" className="section-spacing">
            <div className="container">
                <div className="row g-4">
                    {/* Large Featured Card */}
                    <div className="col-lg-6">
                        <div className="tutorial-card tutorial-card--featured h-100">
                            <a href="https://www.youtube.com/watch?v=BLcg4uQiqy4" className="tutorial-card__link h-100 d-flex flex-column" data-fancybox>
                                <div className="tutorial-card__image-wrap">
                                    <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop" alt="Next.js 15 Mastery" className="tutorial-card__image" />
                                    <div className="tutorial-card__badge">FEATURED BOOTCAMP</div>
                                    <div className="tutorial-card__overlay">
                                        <div className="play-btn-circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="tutorial-card__content flex-grow-1 d-flex flex-column">
                                    <div className="tutorial-card__meta">
                                        <span className="tutorial-card__tag">Next.js</span>
                                        <span className="tutorial-card__duration">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg> 12 Hours Content
                                        </span>
                                    </div>
                                    <h3 className="tutorial-card__title">Mastering Next.js 15: The Ultimate App Router Bootcamp</h3>
                                    <p className="tutorial-card__excerpt">Take your React skills to the next level with a deep dive into Server Components, Server Actions, and the latest Next.js 15 features.</p>
                                    <div className="tutorial-card__footer mt-auto">
                                        <span className="tutorial-card__author">
                                            <img src="/images/user-1.svg" alt="Techu Mayur" />
                                            By Techu Mayur
                                        </span>
                                        <div className="primary-btn primary-btn--sm">
                                            <span className="primary-btn-icon">
                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                            </span>
                                            Watch Now
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/* Side Featured Items */}
                    <div className="col-lg-6 d-grid gap-4 h-100">
                        {/* Mini Card 1 */}
                        <div className="tutorial-card tutorial-card--mini h-100">
                            <a href="https://www.youtube.com/watch?v=BLcg4uQiqy4" className="tutorial-card__link d-flex align-items-center" data-fancybox>
                                <div className="tutorial-card__image-mini-wrap">
                                    <img src="https://images.unsplash.com/photo-1550439062-609e1531270e?w=400&h=400&fit=crop" alt="CSS Animations" className="tutorial-card__image-mini" />
                                    <div className="play-btn-mini">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <div className="tutorial-card__content-mini">
                                    <span className="tutorial-card__tag tutorial-card__tag--sm">CSS Design</span>
                                    <h4 className="tutorial-card__title-mini">Advanced CSS Animations for Modern Web Design</h4>
                                    <div className="tutorial-card__meta-mini">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg> Pro Level
                                        </span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg> 4h 30m
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        {/* Mini Card 2 */}
                        <div className="tutorial-card tutorial-card--mini h-100">
                            <a href="https://www.youtube.com/watch?v=BLcg4uQiqy4" className="tutorial-card__link d-flex align-items-center" data-fancybox>
                                <div className="tutorial-card__image-mini-wrap">
                                    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop" alt="Node.js TypeScript" className="tutorial-card__image-mini" />
                                    <div className="play-btn-mini">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <div className="tutorial-card__content-mini">
                                    <span className="tutorial-card__tag tutorial-card__tag--sm">Backend</span>
                                    <h4 className="tutorial-card__title-mini">Scalable APIs with Node.js and TypeScript</h4>
                                    <div className="tutorial-card__meta-mini">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg> Advanced
                                        </span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg> 8h 15m
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        {/* Mini Card 3 */}
                        <div className="tutorial-card tutorial-card--mini h-100">
                            <a href="https://www.youtube.com/watch?v=BLcg4uQiqy4" className="tutorial-card__link d-flex align-items-center" data-fancybox>
                                <div className="tutorial-card__image-mini-wrap">
                                    <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop" alt="Clean Code JS" className="tutorial-card__image-mini" />
                                    <div className="play-btn-mini">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <div className="tutorial-card__content-mini">
                                    <span className="tutorial-card__tag tutorial-card__tag--sm">Best Practices</span>
                                    <h4 className="tutorial-card__title-mini">The Art of Clean Code: JavaScript Edition</h4>
                                    <div className="tutorial-card__meta-mini">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg> All Levels
                                        </span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg> 5h 45m
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        {/* Mini Card 4 */}
                        <div className="tutorial-card tutorial-card--mini h-100">
                            <a href="https://www.youtube.com/watch?v=BLcg4uQiqy4" className="tutorial-card__link d-flex align-items-center" data-fancybox>
                                <div className="tutorial-card__image-mini-wrap">
                                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" alt="Web Performance" className="tutorial-card__image-mini" />
                                    <div className="play-btn-mini">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="feather feather-play">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                    </div>
                                </div>
                                <div className="tutorial-card__content-mini">
                                    <span className="tutorial-card__tag tutorial-card__tag--sm">Performance</span>
                                    <h4 className="tutorial-card__title-mini">High-Performance Web Apps: Tips & Tricks</h4>
                                    <div className="tutorial-card__meta-mini">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg> Intermediate
                                        </span>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg> 3h 20m
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedTutorials;

