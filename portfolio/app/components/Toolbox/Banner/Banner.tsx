import React from 'react';
import './Banner.css';
import { ToolboxPageData } from '@/types/toolbox';

interface BannerProps {
    data: ToolboxPageData['acf']['banner'];
}

const ToolboxBanner = ({ data }: BannerProps) => {
    // Get background image URL
    const bgUrl = typeof data.background_image === 'string' ? data.background_image : (data.background_image as { url: string })?.url || '';

    return (
        <section id="toolbox-banner" className="inner-banner section-spacing" style={{ background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${bgUrl}')` }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="banner-content-wrapper text-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src={(data.sub_heading_icon as string) || "/images/user-1.svg"} alt={data.sub_heading || "Techu Mayur"} width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                {data.sub_heading || "Welcome to My Journey"}
                            </span>
                            <h1>{data.title || "Toolbox Mayur,"}<br />{data.title ? "" : "Web Developer & SEO Expert"}</h1>
                            <p dangerouslySetInnerHTML={{ __html: data.description || "Passionate about building digital experiences that matter" }} />
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

export default ToolboxBanner;
