import React from 'react';
import Link from 'next/link';

interface TipsBannerProps {
    data: {
        sub_heading?: string;
        sub_heading_image?: string | number | { url: string };
        title?: string;
        description?: string;
        background_image?: string | number | { url: string };
    };
}

export default function TipsBanner({ data }: TipsBannerProps) {
    const bgImg = typeof data.background_image === 'string' ? data.background_image : "";
    const subHeadingImg = typeof data.sub_heading_image === 'string' ? data.sub_heading_image : "";

    return (
        <>
            {/* Portfolio Banner Start */}
            <section
                id="portfolio-banner"
                className="inner-banner section-spacing"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${bgImg || '/images/banner-bg.png'}')`,
                    backgroundColor: "rgba(11, 102, 106, 0.95)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="banner-content-wrapper text-center">
                                <span className="sub-heading-tag-1">
                                    {subHeadingImg && (
                                        <div className="sub-heading-image">
                                            <picture>
                                                <img src={subHeadingImg} alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                            </picture>
                                        </div>
                                    )}
                                    {data.sub_heading}
                                </span>
                                <h1 dangerouslySetInnerHTML={{ __html: data.title || "" }}></h1>
                                {data.description && <p dangerouslySetInnerHTML={{ __html: data.description }}></p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banner-scroll-indicator">
                    <div className="scroll-mouse"></div>
                </div>
            </section>

            {/* Breadcrumb Start */}
            <section id="breadcrumb" className="section-spacing">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb-modern" itemScope itemType="https://schema.org/BreadcrumbList">
                                    <li className="breadcrumb-item-modern" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <Link href="/" itemProp="item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                            <span itemProp="name">Home</span>
                                        </Link>
                                        <meta itemProp="position" content="1" />
                                        <span className="separator">/</span>
                                    </li>
                                    <li className="breadcrumb-item-modern active" aria-current="page" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                                        <span itemProp="name">Tips & Tricks</span>
                                        <meta itemProp="position" content="2" />
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
