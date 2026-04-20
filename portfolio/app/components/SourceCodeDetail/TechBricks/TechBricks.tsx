"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './TechBricks.css';
import { ACFImage } from '@/types/acf';

interface TechItem {
    name: string;
    tag: string;
    iconHtml?: string;
    iconUrl?: string;
}

interface TechBricksProps {
    sub_heading?: string;
    sub_heading_icon?: ACFImage;
    heading?: string;
    highlightText?: string;
    description?: string;
    technologies?: TechItem[];
}

const TechBricks: React.FC<TechBricksProps> = ({
    sub_heading,
    sub_heading_icon,
    heading,
    highlightText,
    description,
    technologies
}) => {
    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    if (!technologies || technologies.length === 0) return null;

    return (
        <section id="sc-tech" className="section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12 text-center">
                        <div className="sc-content-section">
                            <div className="section-title mb-4">
                                <span className="sub-heading-tag-2 justify-content-center mx-auto mb-3">
                                    <div className="sub-heading-image">
                                        {sub_heading_icon ? (
                                            (typeof sub_heading_icon === 'string' && sub_heading_icon.trim().startsWith('<svg')) ? (
                                                <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: sub_heading_icon }} />
                                            ) : (
                                                <picture>
                                                    <img
                                                        src={getImageUrl(sub_heading_icon) || '/images/user-1.svg'}
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
                                                    src="/images/user-1.svg"
                                                    alt="Tech Stack"
                                                    width="20"
                                                    height="20"
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        )}
                                    </div>
                                    {sub_heading || "Specialized Stack"}
                                </span>
                                <h3>{heading || "Tech"} <span className="highlight">{highlightText || "Bricks"}</span></h3>
                                {description && <div className="section-para-center" dangerouslySetInnerHTML={{ __html: description }}></div>}
                            </div>

                            <div className="sc-tech-swiper-container position-relative">
                                <Swiper
                                    modules={[Autoplay, Pagination, Navigation]}
                                    slidesPerView={1}
                                    spaceBetween={20}
                                    loop={technologies.length > 1}
                                    autoplay={technologies.length > 1 ? { delay: 4000, disableOnInteraction: false } : false}
                                    pagination={{ el: '.tech-pagination', clickable: true }}
                                    navigation={{
                                        nextEl: '.tech-next',
                                        prevEl: '.tech-prev',
                                    }}
                                    breakpoints={{
                                        640: { slidesPerView: Math.min(technologies.length, 2), spaceBetween: 20 },
                                        1024: { slidesPerView: Math.min(technologies.length, 3), spaceBetween: 24 },
                                        1280: { slidesPerView: Math.min(technologies.length, 5), spaceBetween: 24 }
                                    }}
                                    className="sc-tech-swiper"
                                >
                                    {technologies.map((tech, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="sc-tech-card-modern">
                                                <div className="sc-tech-icon">
                                                    {tech.iconUrl ? (
                                                        <img src={tech.iconUrl} alt={tech.name} />
                                                    ) : tech.iconHtml ? (
                                                        <div dangerouslySetInnerHTML={{ __html: tech.iconHtml }} />
                                                    ) : null}
                                                </div>
                                                <div className="sc-tech-info text-start">
                                                    <h4>{tech.name}</h4>
                                                    <span className="sc-tech-tag">{tech.tag}</span>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    {technologies.length > 1 && <div className="swiper-pagination tech-pagination mt-4"></div>}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechBricks;
