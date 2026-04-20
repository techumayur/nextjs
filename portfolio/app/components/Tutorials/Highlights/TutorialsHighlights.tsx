import React, { useEffect } from 'react';
import './TutorialsHighlights.css';

const TutorialsHighlights: React.FC = () => {
    useEffect(() => {
        const animateCounter = (element: HTMLElement, target: number, suffix = '') => {
            let current = 0;
            const increment = target / 50; // Speed of animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = Math.floor(target) + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statValues = entry.target.querySelectorAll('.stat-value');
                    statValues.forEach(stat => {
                        const t = stat.getAttribute('data-target');
                        if (t) animateCounter(stat as HTMLElement, parseInt(t), '+');
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const cards = document.querySelectorAll('.sidebar-card');
        cards.forEach(card => statsObserver.observe(card));

        return () => statsObserver.disconnect();
    }, []);

    return (
        <section id="tutorials-highlights" className="section-spacing pt-0">
            <div className="container">
                <div className="row g-4">
                    {/* Video Tutorials */}
                    <div className="col-12 col-md-4">
                        <div className="sidebar-card h-100">
                            <h3 className="sidebar-title">
                                <picture>
                                    <img src="/images/home/youtube-icon.svg" className="img-fluid" alt="YouTube" height="25" width="25" />
                                </picture>
                                Video Tutorials
                            </h3>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <picture>
                                        <img src="/images/home/youtube-icon.svg" className="img-fluid" alt="YouTube" height="25" width="25" />
                                    </picture>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value" data-target="150">0+</div>
                                    <div className="stat-label">Full Length Tutorials</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Shorts */}
                    <div className="col-12 col-md-4">
                        <div className="sidebar-card h-100">
                            <h3 className="sidebar-title">
                                <picture>
                                    <img src="/images/home/youtubeshorts.svg" className="img-fluid" alt="YouTube Shorts" height="25" width="25" />
                                </picture>
                                Quick Shorts
                            </h3>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <picture>
                                        <img src="/images/home/youtubeshorts.svg" className="img-fluid" alt="YouTube Shorts" height="25" width="25" />
                                    </picture>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value" data-target="200">0+</div>
                                    <div className="stat-label">Short Format Videos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Instagram Reels */}
                    <div className="col-12 col-md-4">
                        <div className="sidebar-card h-100">
                            <h3 className="sidebar-title">
                                <picture>
                                    <img src="/images/home/camera-reels.svg" className="img-fluid" alt="Instagram Reels" height="25" width="25" />
                                </picture>
                                Instagram Reels
                            </h3>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <picture>
                                        <img src="/images/home/instagram.svg" className="img-fluid" alt="Instagram Reels" height="25" width="25" />
                                    </picture>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value" data-target="85">0+</div>
                                    <div className="stat-label">Creative Reels</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TutorialsHighlights;

