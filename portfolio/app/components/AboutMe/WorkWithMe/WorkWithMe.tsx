'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './WorkWithMe.css';
import { ACFAboutPage } from "@/types/acf";

interface WorkWithMeProps {
    data: ACFAboutPage['work_with_me'];
}

const WorkWithMe: React.FC<WorkWithMeProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="work-with-me" className="section-spacing">
            <div className="container">
                <div className="section-title section-title-center">
                    <span className="sub-heading-tag-1">
                        <div className="sub-heading-image">
                            <Image 
                                src={(data.sub_heading_icon as string) || "/images/user-1.svg"} 
                                alt={data.sub_heading || "Work With Me Icon"} 
                                width={20} 
                                height={20} 
                                className="img-fluid" 
                                unoptimized
                            />
                        </div>
                        {data.sub_heading}
                    </span>
                    <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
                    <p dangerouslySetInnerHTML={{ __html: data.description }} />
                </div>
                <div className="bento-grid">
                    {data.items && data.items.map((item, index) => (
                        <div key={index} className={`bento-box ${item.size || 'bento-medium'}`}>
                            <div className="bento-icon">
                                <Image 
                                    src={item.icon as string} 
                                    alt={item.title} 
                                    width={40} 
                                    height={40} 
                                    className="img-fluid" 
                                    unoptimized
                                />
                            </div>
                            <h3 className="bento-title" dangerouslySetInnerHTML={{ __html: item.title }} />
                            <p className="bento-description" dangerouslySetInnerHTML={{ __html: item.description }} />
                            {item.list && item.list.length > 0 && (
                                <ul className="bento-list">
                                    {item.list.map((li, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: li.text }} />
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <div className="work-cta-buttons">
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
        </section>
    );
};

export default WorkWithMe;
