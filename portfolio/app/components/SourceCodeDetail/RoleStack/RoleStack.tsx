"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoleStack.css';

gsap.registerPlugin(ScrollTrigger);

import { ACFImage } from '@/types/acf';

interface RoleItem {
    year: string;
    title: string;
    iconUrl?: string;
    iconHtml?: string;
    company: string;
    description: string;
}

interface RoleStackProps {
    sub_heading?: string;
    sub_heading_icon?: ACFImage;
    subHeadingText?: string;
    subHeadingImageUrl?: string;
    subHeadingImageHtml?: string;
    heading?: string;
    highlightText?: string;
    description?: string;
    items?: RoleItem[];
}

const RoleStack: React.FC<RoleStackProps> = ({
    items,
    heading,
    highlightText,
    description,
    sub_heading,
    sub_heading_icon,
    subHeadingText,
    subHeadingImageUrl,
    subHeadingImageHtml
}) => {
    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!items || items.length === 0) return;

        const timeout = setTimeout(() => {
            const cards = gsap.utils.toArray('.stack-item') as HTMLElement[];
            const stackContainer = containerRef.current;

            if (cards.length > 0 && stackContainer) {
                let mm = gsap.matchMedia();

                // Desktop 
                mm.add("(min-width: 992px)", () => {
                    const headerOffset = 100;
                    const stepOffset = 50; // Visible offset for "tags"

                    // Pin header
                    ScrollTrigger.create({
                        trigger: ".sc-role-sticky-header",
                        start: `top ${headerOffset}px`,
                        endTrigger: stackContainer,
                        end: "bottom bottom",
                        pin: true,
                        pinSpacing: false,
                        invalidateOnRefresh: true,
                    });

                    // Stepped Stack
                    cards.forEach((card, index) => {
                        const isLast = index === cards.length - 1;
                        ScrollTrigger.create({
                            trigger: card,
                            start: `top ${headerOffset + (index * stepOffset)}px`,
                            endTrigger: stackContainer,
                            end: `bottom +=${cards.length * stepOffset}`, // Use relative end for tight space
                            pin: true,
                            pinSpacing: isLast,
                            scrub: 1,
                            invalidateOnRefresh: true,
                            anticipatePin: 1,
                        });
                    });
                });

                // Mobile
                mm.add("(max-width: 991px)", () => {
                    const mobileHeaderOffset = 80;
                    const mobileStepOffset = 40;

                    cards.forEach((card, index) => {
                        const isLast = index === cards.length - 1;
                        ScrollTrigger.create({
                            trigger: card,
                            start: `top ${mobileHeaderOffset + (index * mobileStepOffset)}px`,
                            endTrigger: stackContainer,
                            end: `bottom +=${cards.length * mobileStepOffset}`,
                            pin: true,
                            pinSpacing: isLast,
                            scrub: 1,
                            invalidateOnRefresh: true,
                            anticipatePin: 1,
                        });
                    });
                });

                return () => mm.revert();
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [items]);

    if (!items || items.length === 0) return null;

    return (
        <section id="sc-my-role" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-12">
                        <div className="sc-role-sticky-header">
                            <div className="section-title section-title-left">
                                <span className="sub-heading-tag-2">
                                    <div className="sub-heading-image">
                                        {sub_heading_icon ? (
                                            (typeof sub_heading_icon === 'string' && sub_heading_icon.trim().startsWith('<svg')) ? (
                                                <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: sub_heading_icon }} />
                                            ) : (
                                                <picture>
                                                    <img
                                                        src={getImageUrl(sub_heading_icon) || '/images/user-2.svg'}
                                                        alt="Icon"
                                                        width="14"
                                                        height="14"
                                                        className="img-fluid"
                                                    />
                                                </picture>
                                            )
                                        ) : subHeadingImageUrl ? (
                                            <picture>
                                                <img
                                                    src={subHeadingImageUrl}
                                                    alt={subHeadingText || "Icon"}
                                                    width={20}
                                                    height={20}
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        ) : subHeadingImageHtml ? (
                                            <div dangerouslySetInnerHTML={{ __html: subHeadingImageHtml }} />
                                        ) : (
                                            <picture>
                                                <img
                                                    src="/images/user-2.svg"
                                                    alt="My Role"
                                                    width={20}
                                                    height={20}
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        )}
                                    </div>
                                    {sub_heading || subHeadingText || "My Contributions"}
                                </span>
                                {heading ? (
                                    <h2 dangerouslySetInnerHTML={{ __html: heading }} />
                                ) : (
                                    <h2>My <span className="highlight">Role</span></h2>
                                )}
                                {description ? (
                                    <p
                                        className="section-para"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                ) : (
                                    <p>A comprehensive breakdown of my responsibilities and technical impact on this project.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-12">
                        <div className="stack-container sc-role-stack" ref={containerRef}>
                            <div className="card-container">
                                {items.map((item, index) => (
                                    <div className="stack-item" key={index}>
                                        <span className="stack-year">{item.year}</span>
                                        <div className="stack-content">
                                            <div className="stack-icon">
                                                {item.iconUrl ? (
                                                    <Image
                                                        src={item.iconUrl}
                                                        alt={item.title}
                                                        width={20}
                                                        height={20}
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                ) : item.iconHtml ? (
                                                    <div dangerouslySetInnerHTML={{ __html: item.iconHtml }} />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-monitor"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                                )}
                                            </div>
                                            <div className="stack-text">
                                                <h3>{item.title}</h3>
                                                <div className="stack-company">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-git-branch"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
                                                    <span>{item.company}</span>
                                                </div>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoleStack;
