import React from 'react';
import './HeadingContent.css';
import { ACFImage, WPSourceCodeItem } from '@/types/acf';

const getImageUrl = (image?: ACFImage): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && 'url' in image) return image.url;
    return undefined;
};

interface HeadingContentProps {
    data?: NonNullable<WPSourceCodeItem['acf']>['heading_content'];
    fallbackTitle?: string;
    fallbackFeaturedImage?: string;
}

const HeadingContent: React.FC<HeadingContentProps> = ({ data, fallbackTitle, fallbackFeaturedImage }) => {
    return (
        <section id="pd-intro-hero" className="section-spacing pt-0">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-12">
                        <div className="pd-intro-content">
                            <span className="sub-heading-tag-1 mb-3">
                                <div className="sub-heading-image">
                                    {data?.sub_heading_icon ? (
                                        (typeof data.sub_heading_icon === 'string' && data.sub_heading_icon.trim().startsWith('<svg')) ? (
                                            <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: data.sub_heading_icon }} />
                                        ) : (
                                            <picture>
                                                <img
                                                    src={getImageUrl(data.sub_heading_icon) || '/images/home/brand-strategy.svg'}
                                                    alt="Icon"
                                                    width="14"
                                                    height="14"
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        )
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap theme-text" style={{ fontSize: '0.9rem' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                    )}
                                </div>
                                {data?.sub_heading}
                            </span>
                            <h2 className="main-heading">
                                {data?.title} <span className="highlight">{data?.highlight_text || fallbackTitle}</span>
                            </h2>
                            <div className="sub-text" dangerouslySetInnerHTML={{ __html: data?.description || '' }} />
                        </div>
                    </div>
                    {(() => {
                        const imageUrl = (typeof data?.featured_image === 'string' && data.featured_image)
                            ? data.featured_image 
                            : (data?.featured_image && typeof data.featured_image === 'object' && 'url' in data.featured_image)
                                ? (data.featured_image as { url: string }).url
                                : fallbackFeaturedImage || null;

                        if (!imageUrl) return null;

                        return (
                            <div className="col-lg-12">
                                <div className="pd-intro-visual">
                                    <div className="visual-glow"></div>
                                    <div className="device-mockup">
                                        <picture>
                                            <img
                                                src={imageUrl}
                                                alt="Project Preview"
                                                width="1200"
                                                height="600"
                                                loading="lazy"
                                                className="img-fluid"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
};

export default HeadingContent;
