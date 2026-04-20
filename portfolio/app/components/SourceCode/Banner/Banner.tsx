import React from 'react';
import './Banner.css';
import { ACFSourceCodePage } from '@/types/acf';
import { parseHtml } from '@/app/lib/parseHtml';

interface BannerProps {
    data: ACFSourceCodePage['banner'];
}

const Banner: React.FC<BannerProps> = ({ data }) => {
    return (
        <section
            id="source-code-banner"
            className="inner-banner section-spacing"
            style={{
                background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${typeof data.background_image === 'string' ? data.background_image : "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&h=800&fit=crop"}') center/cover no-repeat`
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
                                <div dangerouslySetInnerHTML={{ __html: parseHtml(data.sub_heading || "Welcome to My Journey") }} />
                            </span>
                            <h1 dangerouslySetInnerHTML={{ __html: parseHtml(data.title || "source-code Mayur,<br>Web Developer & SEO Expert") }}></h1>
                            <p dangerouslySetInnerHTML={{ __html: parseHtml(data.description || "Passionate about building digital experiences that matter") }}></p>
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
