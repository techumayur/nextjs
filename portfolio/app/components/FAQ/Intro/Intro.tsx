"use client";

import React from 'react';
import Image from 'next/image';
import './Intro.css';
import { ACFFaqPage } from '@/types/acf';

interface IntroProps {
    data: ACFFaqPage['intro'];
}

const Intro = ({ data }: IntroProps) => {
    if (!data) return null;

    return (
        <section id="faq-intro" className="faq-intro-section section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 text-center">
                        <div className="section-title">
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
                            <h2 className="reveal-item" dangerouslySetInnerHTML={{ __html: data.title }} />

                            <div className="section-para-center reveal-item">
                                <p dangerouslySetInnerHTML={{ __html: data.description }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Intro;

