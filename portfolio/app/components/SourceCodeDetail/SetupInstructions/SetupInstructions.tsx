"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import gsap from 'gsap';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './SetupInstructions.css';

import { ACFImage } from '@/types/acf';
import type { Swiper as SwiperClass } from 'swiper/types';

interface SetupStep {
    title: string;
    description: string;
    code: string;
    icon?: ACFImage;
}

interface SetupInstructionsProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        highlight_text?: string;
        description?: string;
        steps: SetupStep[];
    };
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({ data }) => {
    const steps = data?.steps || [];

    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const copyToClipboard = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        const originalHTML = btn.innerHTML;
        navigator.clipboard.writeText(text).then(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        });
    };

    const animateSlides = (swiper: SwiperClass) => {
        swiper.slides.forEach((slide) => {
            const card = slide.querySelector('.setup-step-card');
            if (card) {
                gsap.to(card, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power2.out" });
            }
        });
    };

    return (
        <section id="sc-setup-instructions" className="section-spacing overflow-hidden">
            <div className="container">
                <div className="row mb-5 justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="section-title">
                            {data?.sub_heading && (
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
                                {data?.sub_heading || "GETTING STARTED"}
                            </span>
                            )}
                            {(data?.heading || data?.highlight_text) && (
                                <h2>
                                    {data?.heading || "Installation /"}{" "}
                                    <span className="highlight">{data?.highlight_text || "Setup"}</span>
                                </h2>
                            )}
                            <div className="section-para-center mx-auto mt-3" style={{ maxWidth: '800px' }}>
                                <div className="text-muted" dangerouslySetInnerHTML={{ __html: data?.description || "Follow these step-by-step instructions to get the project up and running on your local machine." }} />
                            </div>
                        </div>
                    </div>
                </div>

                {steps.length > 0 && (
                    <div className="setup-timeline-wrapper">
                        <Swiper
                            modules={[Pagination, Navigation]}
                            slidesPerView={1}
                            spaceBetween={20}
                            pagination={{ el: '#setupDots', clickable: true }}
                            navigation={{ nextEl: '#setupNextBtn', prevEl: '#setupPrevBtn' }}
                            breakpoints={{
                                768: { slidesPerView: 2 },
                                992: { slidesPerView: 3 }
                            }}
                            onInit={animateSlides}
                            onSlideChangeTransitionStart={animateSlides}
                            className="setupSwiper"
                        >
                            {steps.map((step: SetupStep, index: number) => (
                                <SwiperSlide key={index}>
                                    <div className="setup-step-card">
                                        <span className="step-number">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                                        <div className="step-icon">
                                            {(typeof step.icon === 'string' && step.icon.trim().startsWith('<svg')) ? (
                                                <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: step.icon }} />
                                            ) : step.icon ? (
                                                <picture>
                                                    <img
                                                        src={getImageUrl(step.icon)}
                                                        alt="Icon"
                                                        width="40"
                                                        height="40"
                                                        className="img-fluid"
                                                    />
                                                </picture>
                                            ) : null}
                                        </div>
                                        <h3>{step.title}</h3>
                                        <p>{step.description}</p>
                                        {step.code && (
                                            <div className="code-editor-ui">
                                                <div className="editor-header">
                                                    <div className="editor-dots">
                                                        <span className="dot red"></span>
                                                        <span className="dot yellow"></span>
                                                        <span className="dot green"></span>
                                                    </div>
                                                    <div className="editor-title">setup.sh</div>
                                                    <button className="copy-snippet-btn ms-auto" onClick={(e) => copyToClipboard(step.code, e)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    </button>
                                                </div>
                                                <div className="code-snippet-flat">
                                                    <code>{step.code}</code>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="setup-nav-container mt-4">
                            <div className="setup-nav-btn" id="setupPrevBtn">&larr;</div>
                            <div className="setup-dots" id="setupDots"></div>
                            <div className="setup-nav-btn" id="setupNextBtn">&rarr;</div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default SetupInstructions;
