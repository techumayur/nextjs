'use client';

import React from 'react';
import Image from 'next/image';
import './Certifications.css';
import { ACFAboutPage } from "@/types/acf";

interface CertificationsProps {
    data: ACFAboutPage['certifications_&_achievements'];
}

const Certifications: React.FC<CertificationsProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="cert-section" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <Image 
                                        src={(data.sub_heading_icon as string) || "/images/user-1.svg"} 
                                        alt={data.sub_heading || "Certifications Icon"} 
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
                    </div>
                </div>

                <div className="cert-bento-grid">
                    {data.certifications && data.certifications.map((cert, index) => (
                        <div key={index} className={`cert-item cert-item-${cert.type || 'medium'}`}>
                            <div className="cert-icon-modern">
                                {typeof cert.icon === 'string' && cert.icon.trim().startsWith('<svg') ? (
                                    <div dangerouslySetInnerHTML={{ __html: cert.icon }} />
                                ) : (
                                    <Image 
                                        src={cert.icon as string} 
                                        alt={cert.title} 
                                        width={24} 
                                        height={24} 
                                        className="img-fluid" 
                                        unoptimized
                                    />
                                )}
                            </div>
                            <div className="cert-meta">
                                <span className="cert-provider-tag">{cert.provider}</span>
                                <span className="cert-year-tag">{cert.year}</span>
                            </div>
                            <h3 dangerouslySetInnerHTML={{ __html: cert.title }} />
                            <p dangerouslySetInnerHTML={{ __html: cert.description }} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
