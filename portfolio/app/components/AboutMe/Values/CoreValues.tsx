'use client';

import React from 'react';
import Image from 'next/image';
import './CoreValues.css';
import { ACFAboutPage } from "@/types/acf";

interface CoreValuesProps {
    data: ACFAboutPage['core_values'];
}

const CoreValues: React.FC<CoreValuesProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="core-values" className="section-spacing">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <Image 
                                        src={(data.sub_heading_icon as string) || "/images/user-2.svg"} 
                                        alt={data.sub_heading || "Core Values Icon"} 
                                        width={20} 
                                        height={20} 
                                        className="img-fluid" 
                                        priority
                                        unoptimized
                                    />
                                </div>
                                {data.sub_heading}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
                        </div>
                        <div className="row">
                            {data.values && data.values.map((value, index) => (
                                <div key={index} className={value.col_class || "col-md-4 mb-4"}>
                                    <div className="value-card">
                                        <div className="value-icon">
                                            <Image
                                                src={value.icon as string}
                                                alt={value.title}
                                                width={40}
                                                height={40}
                                                className="img-fluid"
                                                unoptimized
                                            />
                                        </div>
                                        <h4 dangerouslySetInnerHTML={{ __html: value.title }} />
                                        <p dangerouslySetInnerHTML={{ __html: value.description }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CoreValues;
