"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './CTA.css';
import { ACFFaqPage, ACFImage } from '@/types/acf';

interface CTAProps {
    data: ACFFaqPage['cta'];
}

const CTA = ({ data }: CTAProps) => {
    if (!data) return null;

    const getImageUrl = (img: ACFImage | undefined): string => {
        if (!img) return "";
        if (typeof img === 'string') return img;
        if (typeof img === 'object' && img && 'url' in img) return img.url || "";
        return "";
    };

    const renderIcon = (icon: ACFImage | undefined, defaultIcon: string, size: number = 20) => {
        if (typeof icon === 'string' && icon.startsWith('<svg')) {
            return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: icon }} />;
        }
        const url = getImageUrl(icon) || defaultIcon;
        return (
            <Image
                src={url}
                alt="Icon"
                width={size}
                height={size}
                className="img-fluid"
                unoptimized
            />
        );
    };

    return (
        <section id="faq-cta" className="cta section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="home-cta-wrapper">
                            <div className="home-cta-container">
                                <div className="home-cta-content">
                                    <div className="home-cta-icon-wrapper">
                                        {renderIcon(data.badge_icon || data.badge_image, "/images/home/cta-icon.svg", 50)}
                                    </div>
                                    <h3 className="home-cta-title" dangerouslySetInnerHTML={{ __html: data.title }} />
                                    <p className="home-cta-text">{data.description}</p>
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
                                    {data.info_items?.map((item, index) => (
                                        <div key={index} className="home-cta-info-item">
                                            <div className="home-cta-info-icon">
                                                {renderIcon(item.icon, '/images/home/clock-icon.svg', 20)}
                                            </div>
                                            <div className="home-cta-info-text">
                                                <span className="home-cta-info-label">{item.label}</span>
                                                <span className="home-cta-info-value">{item.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
