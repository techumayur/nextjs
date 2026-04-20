"use client";

import React from 'react';
import Image from 'next/image';
import './Banner.css';
import { ACFFaqPage } from '@/types/acf';

interface BannerProps {
    data: ACFFaqPage['banner'];
}

const Banner = ({ data }: BannerProps) => {
    if (!data) return null;

    // Get background image URL
    const bgUrl = typeof data.background_image === 'string' ? data.background_image : (data.background_image as { url: string })?.url;

    return (
        <section id="faq-banner" className="inner-banner section-spacing" style={bgUrl ? { backgroundImage: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${bgUrl}')` } : {}}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="banner-content-wrapper text-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    {(() => {
                                        const icon = data.sub_heading_icon || data.sub_heading_image;
                                        if (typeof icon === 'string' && icon.startsWith('<svg')) {
                                            return <div className="icon-svg-wrapper" dangerouslySetInnerHTML={{ __html: icon }} />;
                                        }
                                        const iconUrl = typeof icon === 'string' ? icon : (typeof icon === 'object' && icon && 'url' in icon) ? icon.url : "";
                                        return (
                                            <Image
                                                src={iconUrl || "/images/user-1.svg"}
                                                alt="Techu Mayur"
                                                width={20}
                                                height={20}
                                                className="img-fluid"
                                                unoptimized
                                            />
                                        );
                                    })()}
                                </div>
                                {data.sub_heading}
                            </span>
                            <h1 dangerouslySetInnerHTML={{ __html: data.title }} />
                            <p dangerouslySetInnerHTML={{ __html: data.description }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="banner-scroll-indicator">
                <div className="scroll-mouse"></div>
            </div>
        </section>
    );
};

export default Banner;
