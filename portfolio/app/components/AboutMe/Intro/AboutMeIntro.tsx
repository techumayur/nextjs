'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import './AboutMeIntro.css';
import { ACFAboutPage } from "@/types/acf";
import { parseHtml, wpAutop } from '@/app/lib/parseHtml';

interface AboutMeIntroProps {
    data: ACFAboutPage['intro'];
}

const AboutMeIntro: React.FC<AboutMeIntroProps> = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const extraParaRef = useRef<HTMLDivElement>(null);

    const toggleReadMore = () => {
        if (!expanded) {
            gsap.to(extraParaRef.current, {
                display: "block",
                height: "auto",
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        } else {
            gsap.to(extraParaRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set(extraParaRef.current, { display: "none" });
                }
            });
        }
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (extraParaRef.current) {
            gsap.set(extraParaRef.current, {
                height: 0,
                opacity: 0,
                display: "none"
            });
        }
    }, []);

    if (!data) return null;

    return (
        <section id="about-me-intro" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <Image 
                                        src={(data.sub_heading_icon as string) || "/images/user-1.svg"} 
                                        alt={data.sub_heading || "About Me Icon"} 
                                        width={20} 
                                        height={20} 
                                        className="img-fluid" 
                                        priority
                                        unoptimized
                                    />
                                </div>
                                {data.sub_heading}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: parseHtml(data.title) }} />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bento-grid">
                            {/* Profile Card */}
                            <div className="bento-card bento-medium">
                                <div className="profile-image-wrapper">
                                    <Image 
                                        src={(data.profile_image as string) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"} 
                                        alt={data.profile_name} 
                                        width={200} 
                                        height={200} 
                                        className="profile-image"
                                        unoptimized
                                    />
                                    <div className="profile-status"></div>
                                </div>
                                <div className="profile-info">
                                    <h3 className="profile-name" dangerouslySetInnerHTML={{ __html: parseHtml(data.profile_name) }} />
                                    <div className="profile-role" dangerouslySetInnerHTML={{ __html: parseHtml(data.profile_role) }} />
                                    <div className="profile-social py-4 py-xl-0 mb-5">
                                        {data.social_links && data.social_links.map((link, index) => (
                                            <Link 
                                                key={index} 
                                                href={link.link || "#"} 
                                                className={`social-icon ${link.is_white ? 'white-image' : ''}`}
                                                aria-label={link.label}
                                                title={link.label}
                                            >
                                                <Image 
                                                    src={link.icon as string} 
                                                    alt={link.label} 
                                                    width={20} 
                                                    height={20} 
                                                    className="img-fluid" 
                                                    unoptimized
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                    <Link href={data.resume_button_link || "#"} className="primary-btn d-none d-lg-inline-flex">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        {data.resume_button_label}
                                    </Link>
                                </div>
                            </div>
                            {/* Main Introduction */}
                            <div className="bento-card bento-large">
                                <h3 className="content-heading">
                                    <Image 
                                        src={(data.story_icon as string) || "/images/about-me/profile.svg"} 
                                        alt={data.story_title} 
                                        width={30} 
                                        height={30} 
                                        className="img-fluid" 
                                        unoptimized
                                    />
                                    <span dangerouslySetInnerHTML={{ __html: parseHtml(data.story_title) }} />
                                </h3>
                                <div className="content-wrapper">
                                    <div className="content-text" id="aboutText">
                                         <div dangerouslySetInnerHTML={{ __html: wpAutop(data.story_content) }} />
                                        <div className="extra-content" ref={extraParaRef}>
                                            <div className="extra" dangerouslySetInnerHTML={{ __html: wpAutop(data.story_extra) }} />
                                        </div>
                                    </div>
                                    <button className="read-toggle" onClick={toggleReadMore}>
                                        {expanded ? 'Read Less' : 'Read More'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMeIntro;
