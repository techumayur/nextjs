import React from 'react';

interface BannerProps {
    title: string;
    subHeading?: string;
    description?: string;
    backgroundImage?: string;
}

const Banner: React.FC<BannerProps> = ({
    title,
    subHeading,
    description,
    backgroundImage
}) => {
    return (
        <section
            id="source-code-banner"
            className="inner-banner section-spacing"
            style={{
                background: (backgroundImage && backgroundImage !== 'undefined')
                    ? `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${backgroundImage}') center/cover no-repeat`
                    : 'rgba(11, 102, 106, 0.95)'
            }}
        >
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
                                {subHeading}
                            </span>
                            <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
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

export default Banner;
