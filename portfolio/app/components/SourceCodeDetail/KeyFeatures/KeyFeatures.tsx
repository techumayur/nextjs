import React from 'react';
import './KeyFeatures.css';

interface FeatureItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    glowClass: string;
}

const features: FeatureItem[] = [
    {
        title: "Fast Loading",
        description: "Optimized assets and clean code ensure lightning-fast performance across all platforms.",
        glowClass: "pulse-glow-1",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    },
    {
        title: "Fully Responsive",
        description: "A mobile-first approach ensures the project looks and works great on any device or screen size.",
        glowClass: "pulse-glow-2",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
    },
    {
        title: "SEO Ready",
        description: "Built with technical SEO best practices to help your content rank higher in search results.",
        glowClass: "pulse-glow-3",
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zoom-in"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
    }
];

const KeyFeatures = () => {
    return (
        <section className="pd-key-features section-spacing bg-light-alt" id="sc-key-features">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="section-title">
                            <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star theme-text" style={{ fontSize: '0.9rem' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </div>
                                CAPABILITIES
                            </span>
                            <h2>Key <span className="highlight">Features</span></h2>
                            <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                <p>Explore the core functionalities and highlights that make this project standout in terms of performance and user experience.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {features.map((feature, index) => (
                        <div className="col-lg-4 col-md-6" key={index}>
                            <div className="feature-card bento-item h-100">
                                <div className={`feature-icon-wrapper ${feature.glowClass}`}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyFeatures;
