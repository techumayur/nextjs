"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './HostingDeployment.css';
import { ToolboxPageData } from '@/types/toolbox';

interface HostingDeploymentProps {
    data: ToolboxPageData['acf']['hosting_deployment'];
}

const HostingDeployment = ({ data }: HostingDeploymentProps) => {
    if (!data) return null;

    return (
        <section id="hosting-tools" className="section-spacing pt-0 toolbox-section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-header mb-4">
                            <div className="section-title">
                                <h2 dangerouslySetInnerHTML={{ __html: data.title || 'Hosting & <span className="highlight">Deployment</span>' }} />
                                <p dangerouslySetInnerHTML={{ __html: data.description || 'Platforms and infrastructure used to deploy and scale web applications.' }} />
                            </div>
                            <div className="hosting-nav-arrows">
                                <div className="hosting-prev"></div>
                                <div className="hosting-next"></div>
                            </div>
                        </div>

                        <div className="hosting-slider-wrapper">
                            <Swiper
                                modules={[Navigation]}
                                slidesPerView={1.2}
                                spaceBetween={20}
                                grabCursor={true}
                                navigation={{
                                    nextEl: '.hosting-next',
                                    prevEl: '.hosting-prev',
                                }}
                                breakpoints={{
                                    576: { slidesPerView: 2, spaceBetween: 20 },
                                    768: { slidesPerView: 2, spaceBetween: 20 },
                                    992: { slidesPerView: 3, spaceBetween: 20 },
                                    1200: { slidesPerView: 4, spaceBetween: 20 }
                                }}
                                className="hosting-swiper"
                            >
                                {data.platforms?.map((platform, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="hosting-block">
                                            <div className="hosting-block-header">
                                                <div className="hosting-block-icon">
                                                    {((typeof platform.icon === 'string' && platform.icon) || (typeof platform.icon === 'object' && (platform.icon as { url: string })?.url)) ? (
                                                        <img src={typeof platform.icon === 'string' ? platform.icon : (platform.icon as { url: string })?.url} alt={platform.name} className="hosting-block-logo" loading="lazy" />
                                                    ) : (
                                                        <img src="/images/home/clean-code.svg" alt={platform.name} className="hosting-block-logo" loading="lazy" />
                                                    )}
                                                </div>
                                                <span className={`hosting-block-badge ${platform.status}`}>{platform.status}</span>
                                            </div>
                                            <div className="hosting-block-info">
                                                <h3 className="hosting-block-title">{platform.name}</h3>
                                                <div className="hosting-block-desc" dangerouslySetInnerHTML={{ __html: platform.description }} />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HostingDeployment;
