import React from 'react';
import './Banner.css';

interface ContactBannerProps {
    sub_heading?: string;
    heading?: string;
    description?: string;
    background_image?: string;
}

const ContactBanner = ({
    sub_heading,
    heading,
    description,
    background_image
}: ContactBannerProps) => {
    return (
        <section id="contact-banner" className="inner-banner section-spacing" style={{
            background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${background_image}')`
        }}>
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
                            {heading && /<h[1-6][^>]*>/i.test(heading) ? (
                                <div className="banner-title-wrapper" dangerouslySetInnerHTML={{ __html: heading }}></div>
                            ) : (
                                <h1 dangerouslySetInnerHTML={{ __html: heading || "" }}></h1>
                            )}
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

export default ContactBanner;
