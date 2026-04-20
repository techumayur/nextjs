'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CareerTimeline.css';
import { ACFAboutPage } from "@/types/acf";
import { wpAutop } from '@/app/lib/parseHtml';

interface CareerTimelineProps {
    data: ACFAboutPage['career_timeline'];
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ data }) => {
    
    useEffect(() => {
        if (!data || !data.timeline_items) return;
        
        gsap.registerPlugin(ScrollTrigger);

        // Standard Next.js / GSAP practice: wait a small frame for DOM to settle
        const timer = setTimeout(() => {
            const cards = gsap.utils.toArray('.stack-item');

            // SIGNIFICANTLY TIGHTER SPACING
            // stepSpacing = 75px ensures the year badges and headings align vertically
            const headerHeight = 50;
            const stepSpacing = 75; // Balanced spacing for consistent look

            cards.forEach((card: any, index: number) => {
                const isLast = index === cards.length - 1;
                // Pinning logic
                ScrollTrigger.create({
                    trigger: card,
                    start: `top-=${headerHeight + (index * stepSpacing)} top`,
                    endTrigger: ".card-container",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: isLast, // Only the last card pushes the following content
                    scrub: 1,
                    invalidateOnRefresh: true,
                });
            });

            ScrollTrigger.refresh();
        }, 300);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [data]);

    if (!data) return null;

    return (
        <section id="timeline" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <picture>
                                        <Image
                                            src={(data.sub_heading_icon as string) || "/images/user-2.svg"}
                                            alt={data.sub_heading || "Timeline Icon"}
                                            width={20}
                                            height={20}
                                            className="img-fluid"
                                            unoptimized
                                            priority
                                        />
                                    </picture>
                                </div>
                                {data.sub_heading || "My Journey"}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: data.title || 'Career <span class="highlight">Timeline</span>' }} />
                            <div className="section-para-center">
                                <p>{data.description || "Explore my professional evolution through stacked milestones"}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-12">
                        <div className="stack-container">
                            <div className="card-container">
                                {data.timeline_items && data.timeline_items.map((item, index) => (
                                    <div key={index} className="stack-item">
                                        <span className="stack-year">{item.year}</span>
                                        <div className="stack-content">
                                            <div className="stack-icon">
                                                {typeof item.icon === 'string' && item.icon.trim().startsWith('<svg') ? (
                                                    <div className="svg-wrapper" dangerouslySetInnerHTML={{ __html: item.icon }} />
                                                ) : (
                                                    <Image
                                                        src={item.icon as string || "/images/about-me/profile.svg"}
                                                        alt={item.title}
                                                        width={40}
                                                        height={40}
                                                        className="img-fluid"
                                                        unoptimized
                                                    />
                                                )}
                                            </div>
                                            <div className="stack-text">
                                                <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
                                                <div className="stack-company">
                                                    {typeof item.company_icon === 'string' && item.company_icon.trim().startsWith('<svg') ? (
                                                        <div className="svg-wrapper" dangerouslySetInnerHTML={{ __html: item.company_icon }} />
                                                    ) : (
                                                        <Image
                                                            src={item.company_icon as string || "/images/about-me/experience.svg"}
                                                            alt={item.company}
                                                            width={18}
                                                            height={18}
                                                            className="img-fluid icon-sepia"
                                                            unoptimized
                                                        />
                                                    )}
                                                    <span dangerouslySetInnerHTML={{ __html: item.company }} />
                                                </div>
                                                <div className="timeline-desc" dangerouslySetInnerHTML={{ __html: wpAutop(item.description) }} />
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

export default CareerTimeline;
