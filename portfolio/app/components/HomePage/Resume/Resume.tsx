"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ACFResume } from '@/types/acf';

export type ResumeData = ACFResume;

const Resume = ({ data }: { data: ResumeData }) => {
    useEffect(() => {
        const counters = document.querySelectorAll('.resume-counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target as HTMLElement;
                    const target = +(counter.getAttribute('data-target') || 0);
                    const duration = 2000; // 2 seconds duration
                    const increment = target / (duration / 16); // ~ 60 frames per second
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toString();
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter); // Only animate once
                }
            });
        }, { threshold: 0.2 });

        counters.forEach(counter => observer.observe(counter));
    }, []);

    if (!data) return null;

    return (
        <section id="home-resume" className="resume-cta-section resume-cta section-spacing">
            <div className="container cta-container">
                <div className="row g-0 cta-row">
                    {/* Left Side */}
                    <div className="col-xl-6 d-flex">
                        <div className="cta-left w-100">
                            <div className="cta-badge">
                                <div className="sub-heading-image">
                                    <picture>
                                        <Image src="/images/user-1.svg" alt={data.badge_text} width={20} height={20} priority className="img-fluid" />
                                    </picture>
                                </div>
                                {data.badge_text}
                            </div>
                            <h2 className="cta-title">{data.title}</h2>
                            <div className="cta-subtitle" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                            <div className="cta-stats">
                                {data.stats?.map((stat, index) => (
                                    <div className="stat-item" key={index}>
                                        <div className="stat-number">
                                            <span className="resume-counter" data-target={stat.number}>0</span>
                                            {stat.suffix}
                                        </div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="col-xl-6 d-flex">
                        <div className="cta-right w-100">
                            <div className="cta-icon-box">
                                <picture>
                                    { (typeof data.right_icon === 'string' ? data.right_icon : '') && (
                                      <Image 
                                          src={typeof data.right_icon === 'string' ? data.right_icon : ""} 
                                          alt={data.right_heading} 
                                          width={40} 
                                          height={40} 
                                          priority 
                                          className="img-fluid" 
                                      />
                                    )}
                                </picture>
                            </div>
                            <h3 className="cta-heading">{data.right_heading}</h3>
                            <div className="cta-text" dangerouslySetInnerHTML={{ __html: data.right_text }} />
                            <div className="resume-btn-group pt-3">
                                {data.primary_btn_label && (
                                    <Link href={data.primary_btn_link || "#"} className="primary-btn">
                                        <span className="primary-btn-icon">
                                            <svg
                                                width="10"
                                                className="primary-btn-svg-after"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 14 15">
                                                <path
                                                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg
                                                className="primary-btn-svg-before"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="10"
                                                fill="none"
                                                viewBox="0 0 14 15">
                                                <path
                                                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        {data.primary_btn_label}
                                    </Link>
                                )}
                                {data.secondary_btn_label && (
                                    <Link href={data.secondary_btn_link || "#"} className="secondary-btn">
                                        <span>{data.secondary_btn_label}</span>
                                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                                            <path d="M1,5 L11,5"></path>
                                            <polyline points="8 1 12 5 8 9"></polyline>
                                        </svg>
                                    </Link>
                                )}
                            </div>
                            <div className="cta-features">
                                {data.features?.map((feature, idx) => (
                                    <div className="feature-tag" key={idx}>
                                        <picture>
                                            { (typeof feature.icon === 'string' ? feature.icon : '') && (
                                              <Image 
                                                  src={typeof feature.icon === 'string' ? feature.icon : ""} 
                                                  alt={feature.text} 
                                                  width={15} 
                                                  height={15} 
                                                  priority 
                                                  className="img-fluid" 
                                              />
                                            )}
                                        </picture>
                                        <span>{feature.text}</span>
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

export default Resume;
