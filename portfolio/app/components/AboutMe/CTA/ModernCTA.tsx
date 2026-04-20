'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './ModernCTA.css';
import { ACFAboutPage } from "@/types/acf";

interface ModernCTAProps {
    data: ACFAboutPage['cta'];
}

const ModernCTA: React.FC<ModernCTAProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="modern-cta-section" className="section-spacing">
            <div className="container cta-modern-container">
                <div id="cta-pattern-left" />
                <div id="cta-pattern-right" />
                <div id="decorative-square-1" />
                <div id="decorative-square-2" />
                <div id="cta-modern-content">
                    <div id="cta-icon-modern">
                        <Image 
                            src={(data.icon as string) || "/images/about-me/coder.svg"} 
                            alt="CTA Icon" 
                            width={50} 
                            height={50} 
                            className="img-fluid" 
                            priority
                            unoptimized
                        />
                    </div>
                    <h2 id="cta-modern-heading" dangerouslySetInnerHTML={{ __html: data.heading }} />
                    <p id="cta-modern-text" dangerouslySetInnerHTML={{ __html: data.description }} />
                    <div id="cta-button-wrapper">
                        <Link href={data.primary_button_link || "#"} className="primary-btn">
                            <span className="primary-btn-icon">
                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                </svg>
                            </span>
                            {data.primary_button_label}
                        </Link>
                        <Link href={data.secondary_button_link || "#"} className="secondary-btn">
                            <span>{data.secondary_button_label}</span>
                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModernCTA;
