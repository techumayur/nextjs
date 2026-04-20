import React from 'react';
import './Banner.css';

interface ResumeBannerProps {
    sub_heading?: string;
    title?: string;
    highlight_text?: string;
    description?: string;
    background_image?: string;
}

const ResumeBanner = ({
    sub_heading = "Professional Journey",
    title = "Interactive",
    highlight_text = "Resume",
    description = "Flip through my experience, education, and technical skills",
    background_image = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1920&h=800&fit=crop"
}: ResumeBannerProps) => {
    return (
        <section id="resume-banner" className="inner-banner section-spacing" style={{ background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${background_image}')` }}>
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
                                {sub_heading}
                            </span>
                            <h1>{title} <span className="highlight">{highlight_text}</span></h1>
                            <p>{description}</p>
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

export default ResumeBanner;
