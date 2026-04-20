"use client";

import React from 'react';
import './TutorialsGrid.css';

interface TutorialsGridProps {
    viewMode: 'grid' | 'list';
}

const TutorialsGrid: React.FC<TutorialsGridProps> = ({ viewMode }) => {
    // Demo tutorials
    const tutorials = [
        {
            id: 1,
            title: "Complete Guide to Modern Responsive Web Design",
            category: "Web Development",
            thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
            views: "24.5K",
            likes: "2.8K",
            time: "1 week",
            duration: "18:45"
        },
        {
            id: 2,
            title: "JavaScript ES6+: Advanced Patterns & Best Practices",
            category: "JavaScript",
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
            views: "32.1K",
            likes: "4.2K",
            time: "5 days",
            duration: "25:30"
        },
        {
            id: 3,
            title: "Building High-Performance React Applications",
            category: "React JS",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
            views: "15.8K",
            likes: "1.5K",
            time: "2 days",
            duration: "32:15"
        }
    ];

    return (
        <section id="tutorials-grid-section" className="section-spacing">
            <div className="container">
                <div id="tutorials-feed" className={`tutorials-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                    {tutorials.map((tutorial) => (
                        <div key={tutorial.id} className="video-item" data-fancybox data-src="https://www.youtube.com/watch?v=BLcg4uQiqy4">
                            <div className="video-thumb-wrapper">
                                <img src={tutorial.thumbnail} alt={tutorial.title} />
                                <div className="video-overlay">
                                    <div className="play-btn-large">
                                        <picture>
                                            <img src="/images/home/play-btn.svg" className="img-fluid" alt="Play" height="16" width="16" />
                                        </picture>
                                    </div>
                                </div>
                                <span className="platform-label youtube">
                                    <picture>
                                        <img src="/images/home/youtube-icon.svg" className="img-fluid" alt="YouTube" height="13" width="13" />
                                    </picture>
                                    YouTube
                                </span>
                                <span className="time-badge">{tutorial.duration}</span>
                            </div>
                            <div className="video-info">
                                <span className="video-category">{tutorial.category}</span>
                                <h3 className="video-heading">{tutorial.title}</h3>
                                <p className="video-text">Learn industry-standard benchmarks and optimization techniques for modern development.</p>
                                <div className="video-metrics">
                                    <span className="metric">
                                        <picture><img src="/images/home/view.svg" className="img-fluid" alt="Views" height="18" width="18" /></picture>
                                        {tutorial.views}
                                    </span>
                                    <span className="metric">
                                        <picture><img src="/images/home/heart.svg" className="img-fluid" alt="Likes" height="18" width="18" /></picture>
                                        {tutorial.likes}
                                    </span>
                                    <span className="metric">
                                        <picture><img src="/images/home/clock.svg" className="img-fluid" alt="Time" height="18" width="18" /></picture>
                                        {tutorial.time}
                                    </span>
                                </div>
                                <div className="video-buttons">
                                    <div className="primary-btn">
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
                                    <button className="btn-share" aria-label="btn share">
                                        <picture>
                                            <img src="/images/home/share.svg" className="img-fluid" alt="Share" height="20" width="20" />
                                        </picture>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Infinite Scroll Sentinel */}
                <div id="tutorials-infinite-scroll-sentinel-wrap" className="mt-5">
                    <div id="tutorials-infinite-scroll-spinner" className="is-spinner" aria-label="Loading more tutorials" hidden>
                        <div className="tutorials-skeleton-container" id="tutorials-skeletons"></div>
                    </div>
                    <div id="tutorials-infinite-scroll-sentinel" style={{ height: "20px" }}></div>
                </div>
            </div>
        </section>
    );
};

export default TutorialsGrid;

