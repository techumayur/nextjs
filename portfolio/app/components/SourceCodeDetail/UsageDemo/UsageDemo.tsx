import React from 'react';
import Link from 'next/link';
import './UsageDemo.css';
import { ACFImage } from '@/types/acf';

interface UsageDemoProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        highlight_text?: string;
        description?: string;
        preview_image?: ACFImage;
        view_link_text?: string;
        live_link_button_link?: string;
    };
    previewImage?: string;
}

const UsageDemo: React.FC<UsageDemoProps> = ({ 
    data, 
    previewImage: fallbackPreviewImage = "/images/featured-source-code-project.jpg" 
}) => {
    const demoUrl = data?.live_link_button_link;

    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const finalPreviewImage = getImageUrl(data?.preview_image) || fallbackPreviewImage;

    if (!data && !fallbackPreviewImage) return null;

    return (
        <section id="sc-demo" className="section-spacing pt-0">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="section-title">
                             <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
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
                                         <picture>
                                             <img
                                                 src="/images/home/brand-strategy.svg"
                                                 alt="Icon"
                                                 width="14"
                                                 height="14"
                                                 className="img-fluid"
                                             />
                                         </picture>
                                     )}
                                 </div>
                                 {data?.sub_heading || "LIVE PREVIEW"}
                             </span>
                            {(data?.heading || data?.highlight_text) && (
                                <h2>
                                    {data?.heading}{" "}
                                    {data?.highlight_text && <span className="highlight">{data?.highlight_text}</span>}
                                </h2>
                            )}
                            {data?.description && (
                                <div 
                                    className="mt-3 text-muted"
                                    dangerouslySetInnerHTML={{ __html: data.description }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="demo-fullwidth-card">
                            <div className="demo-preview-wrapper shadow-premium">
                                <picture>
                                    <img src={finalPreviewImage} alt="Project Demo Preview" className="img-fluid demo-screenshot" />
                                </picture>
                                {demoUrl && (
                                    <div className="demo-overlay">
                                        <Link href={demoUrl} target="_blank" className="primary-btn demo-btn">
                                            <span className="primary-btn-icon">
                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                            </span>
                                            {data?.view_link_text || "Visit Live Preview"}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UsageDemo;
