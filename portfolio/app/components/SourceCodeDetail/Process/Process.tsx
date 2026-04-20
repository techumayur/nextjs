"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ACFImage } from '@/types/acf';

import 'swiper/css';
import 'swiper/css/pagination';
import './Process.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface ProcessStep {
    number: string;
    icon?: ACFImage;
    title: string;
    description: string;
}

interface ProcessProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        heading?: string;
        description?: string;
        steps?: ProcessStep[];
    };
}

const defaultIcons = [
    <svg key="icon-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-git-pull-request"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>,
    <svg key="icon-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-code"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    <svg key="icon-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-2.91a2.18 2.18 0 0 0-3.09-.09z"></path><path d="M12 15l-3-3m1.35-7.13C12.19 2.19 15.42 2 18.5 2c.3 0 .5.2.5.5.1 3.08-.2 6.31-2.87 8.98l-5.08 5.08c-2.11 2.11-5.51 2.11-7.62 0-2.11-2.11-2.11-5.51 0-7.62l5.08-5.08z"></path><circle cx="14.5" cy="9.5" r="1"></circle></svg>
];

const getImageUrl = (image?: ACFImage): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && 'url' in image) return image.url;
    return undefined;
};

const Process: React.FC<ProcessProps> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const steps = useMemo(() => data?.steps || [], [data?.steps]);

    const heading = data?.heading;
    const subHeading = data?.sub_heading;
    const description = data?.description;

    useEffect(() => {
        if (steps.length === 0) return;

        const mm = gsap.matchMedia();
        const motionContainer = containerRef.current;

        if (motionContainer) {
            mm.add("(min-width: 992px)", () => {
                const pathActive = motionContainer.querySelector('#process-path-active') as SVGPathElement;
                const pathBg = motionContainer.querySelector('#process-path-bg') as SVGPathElement;
                const rocket = motionContainer.querySelector('#sc-motion-rocket') as HTMLDivElement;

                if (pathActive && pathBg && rocket) {
                    const pathLength = pathActive.getTotalLength();

                    gsap.set(pathActive, {
                        strokeDasharray: pathLength,
                        strokeDashoffset: pathLength
                    });

                    gsap.set(rocket, {
                        motionPath: {
                            path: "#process-path-bg",
                            align: "#process-path-bg",
                            alignOrigin: [0.5, 0.5],
                            autoRotate: true,
                            start: 0,
                            end: 0
                        }
                    });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: motionContainer,
                            start: "top center",
                            end: "bottom center",
                            scrub: 1,
                        }
                    });

                    tl.to(pathActive, {
                        strokeDashoffset: 0,
                        ease: "none",
                        duration: 1
                    }, 0);

                    tl.to(rocket, {
                        motionPath: {
                            path: "#process-path-bg",
                            align: "#process-path-bg",
                            alignOrigin: [0.5, 0.5],
                            autoRotate: true,
                            start: 0,
                            end: 1
                        },
                        ease: "none",
                        duration: 1
                    }, 0);
                }

                const nodes = gsap.utils.toArray(motionContainer.querySelectorAll('.process-node')) as HTMLElement[];
                nodes.forEach((node) => {
                    gsap.fromTo(node,
                        { y: 120 },
                        {
                            y: -40,
                            ease: "none",
                            scrollTrigger: {
                                trigger: node,
                                start: "top 95%",
                                end: "bottom top",
                                scrub: 1
                            }
                        }
                    );

                    ScrollTrigger.create({
                        trigger: node,
                        start: "top 75%",
                        toggleClass: "active-node",
                        once: false
                    });
                });

                ScrollTrigger.refresh();
            });
        }
        return () => mm.revert();
    }, [steps]);

    if (steps.length === 0) return null;

    return (
        <section id="sc-process" className="section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="sc-content-section position-relative">
                            <div className="section-title text-center">
                                {subHeading && (
                                    <span className="sub-heading-tag-2 mx-auto mb-3">
                                        <div className="sub-heading-image">
                                            {data?.sub_heading_icon ? (
                                                (typeof data.sub_heading_icon === 'string' && data.sub_heading_icon.trim().startsWith('<svg')) ? (
                                                    <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: data.sub_heading_icon }} />
                                                ) : (
                                                    <picture>
                                                        <img
                                                            src={getImageUrl(data.sub_heading_icon) || '/images/user-1.svg'}
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
                                                        alt="Project Process"
                                                        width="20"
                                                        height="20"
                                                        className="img-fluid"
                                                    />
                                                </picture>
                                            )}
                                        </div>
                                        {subHeading}
                                    </span>
                                )}
                                {heading && <h2 dangerouslySetInnerHTML={{ __html: heading }} />}
                                {description && (
                                    <div
                                        className="section-para-center"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                )}
                            </div>

                            <div className="process-motion-container position-relative mt-4" ref={containerRef}>
                                <div className="process-svg-wrapper d-none d-lg-flex">
                                    <svg className="process-svg" viewBox="0 0 1000 1200" preserveAspectRatio="xMidYMax meet">
                                        <path id="process-path-bg" d="M 500,0 C 500,300 200,300 200,600 C 200,900 800,900 800,1200" fill="none" stroke="var(--border-color)" strokeWidth="4" strokeDasharray="8 8" />
                                        <path id="process-path-active" d="M 500,0 C 500,300 200,300 200,600 C 200,900 800,900 800,1200" fill="none" stroke="var(--theme-color)" strokeWidth="6" />
                                    </svg>
                                </div>
                                <div className="motion-rocket d-none d-lg-flex" id="sc-motion-rocket">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </div>

                                <Swiper
                                    modules={[Pagination]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    loop={steps.length > 1}
                                    pagination={{ el: '.process-mobile-pagination', clickable: true }}
                                    breakpoints={{
                                        992: {
                                            allowTouchMove: false,
                                            slidesPerView: 1
                                        }
                                    }}
                                    className="process-nodes-wrapper process-mobile-swiper"
                                >
                                    {steps.map((step, index) => {
                                        const isEven = index % 2 === 0;
                                        const stepNumber = index + 1;
                                        const nodeClass = `node-${stepNumber}`;
                                        const iconUrl = getImageUrl(step.icon);

                                        return (
                                            <SwiperSlide key={index} className={`process-node ${nodeClass} pr-card`} data-step={stepNumber}>
                                                <div className={`process-premium-card process-motion-card ${!isEven ? 'text-end' : ''}`}>
                                                    <div
                                                        className="card-bg-number"
                                                        style={!isEven ? { left: '-10px', right: 'auto' } : {}}
                                                    >
                                                        {step.number || `0${stepNumber}`}
                                                    </div>
                                                    <div className="card-content-wrap">
                                                        <span className="step-label">Phase {step.number || `0${stepNumber}`}</span>
                                                        <div className={`step-icon-flat mb-4 ${!isEven ? 'ms-auto' : ''}`}>
                                                            {iconUrl ? (
                                                                <picture><img src={iconUrl} alt={step.title} width="24" height="24" /></picture>
                                                            ) : (
                                                                defaultIcons[index] || defaultIcons[defaultIcons.length - 1]
                                                            )}
                                                        </div>
                                                        <h4>{step.title}</h4>
                                                        <p>{step.description}</p>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                <div className="swiper-pagination process-mobile-pagination d-lg-none mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
