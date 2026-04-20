"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ACFCTA, ACFImage } from '@/types/acf';
import './CTA.css';

interface CTAProps {
    data: ACFCTA | null;
}

const CTA = ({ data }: CTAProps) => {
    if (!data) return null;

    const getImageUrl = (image: ACFImage | undefined): string => {
        if (!image) return "";
        if (typeof image === "string") return image;
        if (typeof image === "object" && "url" in image) return image.url || "";
        return "";
    };

    const mainIconUrl = getImageUrl(data.sub_heading_icon || data.icon) || "/images/home/fast-load.svg";

    return (
        <React.Fragment>
            <section id="home-cta" className="project-cta cta section-spacing">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* New Modern CTA Design */}
                            <div className="home-cta-wrapper">
                                <div className="home-cta-container">
                                    <div className="home-cta-content">
                                        {(data.sub_heading_icon || data.icon_label) && (
                                            <span className="sub-heading-tag-1 mb-4">
                                                <div className="sub-heading-image">
                                                    {(() => {
                                                        const icon = data.sub_heading_icon;
                                                        const iconUrl = getImageUrl(icon);
                                                        if (typeof icon === 'string' && icon.startsWith('<svg')) {
                                                            return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: icon }} />;
                                                        }
                                                        return (
                                                            <Image 
                                                                src={iconUrl || "/images/home/fast-load.svg"} 
                                                                alt="Icon" 
                                                                width={20} 
                                                                height={20} 
                                                                className="img-fluid" 
                                                                unoptimized
                                                            />
                                                        );
                                                    })()}
                                                </div>
                                                {data.icon_label || "Get Started"}
                                            </span>
                                        )}
                                        <div className="home-cta-icon-wrapper">
                                            <Image
                                                src={mainIconUrl}
                                                alt="CTA Icon"
                                                width={50} height={50} loading="lazy" className="img-fluid"
                                                unoptimized
                                            />
                                        </div>
                                        <h3 className="home-cta-title" dangerouslySetInnerHTML={{ __html: data.heading || data.title || "" }} />
                                        <div className="home-cta-text" dangerouslySetInnerHTML={{ __html: data.content || data.description || "" }} />
                                        <div className="home-cta-actions">
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
                                    <div className="home-cta-info">
                                        {data.info_items?.map((item, index) => {
                                            return (
                                                <div className="home-cta-info-item" key={index}>
                                                    <div className="home-cta-info-icon">
                                                        <Image
                                                            src={getImageUrl(item.icon) || `/images/home/${index === 0 ? 'fast-load' : index === 1 ? 'check' : 'star'}.svg`}
                                                            alt="Icon"
                                                            width={20}
                                                            height={20}
                                                            loading="lazy"
                                                            className="img-fluid"
                                                            onError={(e) => { (e.target as HTMLImageElement).src = "/images/home/fast-load.svg" }}
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="home-cta-info-text">
                                                        <span className="home-cta-info-label">{item.label}</span>
                                                        <span className="home-cta-info-value" dangerouslySetInnerHTML={{ __html: item.value }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default CTA;
