import React from 'react';
import './TutorialsBanner.css';

const TutorialsBanner: React.FC = () => {
    return (
        <section id="tutorials-banner" className="inner-banner section-spacing" style={{ background: "linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=800&fit=crop')" }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="banner-content-wrapper text-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                Knowledge for Everyone
                            </span>
                            <h1>Tutorials &ndash; <br />Master the Modern Web</h1>
                            <p>Free, comprehensive guides designed to take you from zero to mastery in tech.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-scroll-indicator">
                <div className="scroll-mouse"></div>
            </div>
        </section>
    );
};

export default TutorialsBanner;
