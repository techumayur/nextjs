'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { ACFImage } from '@/types/acf';

import 'swiper/css';
import 'swiper/css/pagination';
import './ProjectFeatures.css';

const getImageUrl = (image?: ACFImage): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && 'url' in image) return image.url;
    return undefined;
};

interface FeatureItem {
    title: string;
    description: string;
    icon?: string;
    icon_svg?: string;
    iconUrl?: string; // Legacy
    iconHtml?: string; // Legacy
}

interface FeatureCardProps extends FeatureItem {
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, icon_svg, iconUrl, iconHtml, title, description, index }) => {
    const finalIconUrl = iconUrl || icon;
    const finalIconHtml = iconHtml || icon_svg;
    const isSvg = finalIconHtml && finalIconHtml.trim().startsWith('<svg');

    return (
        <div className="feature-detail-card h-100">
            <div className="card-glow"></div>
            <div className="feature-index">{(index + 1).toString().padStart(2, '0')}</div>
            <div className="feature-icon">
                <div className="icon-glow"></div>
                {isSvg ? (
                    <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: finalIconHtml }} />
                ) : (
                    <picture>
                        <img
                            src={finalIconUrl || "/images/home/brand-strategy.svg"}
                            alt={title}
                            width="28"
                            height="28"
                            className="img-fluid"
                        />
                    </picture>
                )}
            </div>
            <h3>{title}</h3>
            <div className="feature-desc" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
};

interface ProjectFeaturesProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        highlight_text?: string;
        description?: string;
        features: FeatureItem[];
    };
}

const ProjectFeatures: React.FC<ProjectFeaturesProps> = ({ data }) => {
    const features = data?.features || [];

    if (features.length === 0 && !data?.heading) return null;

    return (
        <section id="sc-features" className="section-spacing overflow-hidden">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-12 text-center">
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
                                                    alt="Features"
                                                    width="20"
                                                    height="20"
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        )
                                    ) : (
                                        <picture>
                                            <img
                                                src="/images/home/brand-strategy.svg"
                                                alt="Features"
                                                width="20"
                                                height="20"
                                                className="img-fluid"
                                            />
                                        </picture>
                                    )}
                                </div>
                                {data?.sub_heading || "CAPABILITIES"}
                            </span>
                            <h2>
                                {data?.heading || "Project"}{" "}
                                <span className="highlight">{data?.highlight_text || "Features"}</span>
                            </h2>
                            <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                <div dangerouslySetInnerHTML={{ __html: data?.description || "A detailed breakdown of the features and capabilities this project provides." }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="feature-cards-slider-container">
                    {features.length > 0 ? (
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            breakpoints={{
                                768: { slidesPerView: 2, spaceBetween: 24 },
                                1024: { slidesPerView: 3, spaceBetween: 30 }
                            }}
                            className="features-swiper"
                        >
                            {features.map((feature: FeatureItem, index: number) => (
                                <SwiperSlide key={index}>
                                    <FeatureCard
                                        icon={feature.icon}
                                        icon_svg={feature.icon_svg}
                                        title={feature.title}
                                        description={feature.description}
                                        index={index}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No specific features listed for this project yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProjectFeatures;

