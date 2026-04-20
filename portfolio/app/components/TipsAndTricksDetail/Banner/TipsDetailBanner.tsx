import React from 'react';
import Image from 'next/image';

interface TipsDetailBannerProps {
    subHeading?: string;
    title: string;
    description?: string;
    backgroundImage?: string;
}

const TipsDetailBanner: React.FC<TipsDetailBannerProps> = ({
    subHeading,
    title,
    description,
    backgroundImage
}) => {
    return (
        <section id="tips-detail-banner" className="inner-banner section-spacing" style={{
            background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('/images/banner-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="banner-content-wrapper text-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <Image src="/images/user-1.svg" alt="Techu Mayur" width={20} height={20} priority className="img-fluid" />
                                </div>
                                {subHeading || 'Expert Insights & Guides'}
                            </span>
                            <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
                            {description && <p dangerouslySetInnerHTML={{ __html: description }}></p>}
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

export default TipsDetailBanner;
