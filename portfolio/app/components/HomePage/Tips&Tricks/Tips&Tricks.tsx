'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ACFTipsSection, WPBlogPost } from '@/types/acf';

interface TipsTricksProps {
    sectionData: ACFTipsSection | null;
    tips: WPBlogPost[];
}

const TipsTricks = ({ sectionData, tips }: TipsTricksProps) => {
    useEffect(() => {
        if (typeof window === "undefined" || !tips || tips.length === 0) return;

        const swiper = new Swiper(".tipsTricksSwiper", {
            modules: [Pagination, Autoplay],
            slidesPerView: 1,
            spaceBetween: 20,
            loop: tips.length > 1,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                }
            }
        });

        return () => {
            if (swiper) swiper.destroy();
        };
    }, [tips]);

    if (!tips || tips.length === 0) return null;

    const featuredTip = tips[0];
    const sideTips = tips.slice(1, 3);

    const getFeaturedImage = (post: WPBlogPost) => {
        return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";
    };

    const sectionSubHeading = sectionData?.sub_heading;
    const sectionSubHeadingImage = typeof sectionData?.sub_heading_image === 'string' ? sectionData.sub_heading_image : "";
    const sectionTitle = sectionData?.title || "";
    const sectionDescription = sectionData?.description;
    const viewAllLink = sectionData?.button_link || "/blogs";
    const viewAllLabel = sectionData?.button_label || "View All Tips and Tricks";

    return (
        <React.Fragment>
            {/* Tips and Tricks Section Start */}
            <section id="home-tips-tricks" className="tips-tricks section-spacing overflow-hidden">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 text-center">
                            <div className="section-title">
                                <span className="sub-heading-tag-2">
                                    <div className="sub-heading-image">
                                        <picture>
                                            <img
                                                src={(typeof sectionData?.sub_heading_icon === 'string' && sectionData.sub_heading_icon !== "")
                                                    ? sectionData.sub_heading_icon
                                                    : sectionSubHeadingImage || "/images/user-2.svg"}
                                                alt="Icon" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid"
                                            />
                                        </picture>
                                    </div>
                                    {sectionSubHeading}
                                </span>
                                <h2 dangerouslySetInnerHTML={{ __html: sectionTitle }} />
                                <div className="section-para-center">
                                    <p>{sectionDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="row py-5 g-4 d-none d-lg-flex">
                        <div className="col-xl-6">
                            <article className="h-100">
                                <Link href={`/blogs/${featuredTip.slug}`} className="card border-0 h-100">
                                    <div className="card-image h-100">
                                        <img src={getFeaturedImage(featuredTip)} alt={featuredTip.title.rendered} className="img-fluid  object-fit-cover" />
                                    </div>
                                    <span className="tip-card-badge">FEATURED</span>
                                    <div className="card-img-overlay">
                                        <span className="tip-card-number">01</span>
                                        <h3 dangerouslySetInnerHTML={{ __html: featuredTip.title.rendered }} />
                                        <div dangerouslySetInnerHTML={{ __html: featuredTip.excerpt?.rendered || "" }} className="excerpt-text" />
                                        <div className="primary-btn mt-3">
                                            <span className="primary-btn-icon">
                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                </svg>
                                            </span>
                                            Read More
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        </div>
                        <div className="col-xl-6 right-column d-flex flex-column justify-content-between gap-4">
                            {sideTips.map((tip, index) => (
                                <article key={tip.id} className="h-100">
                                    <Link href={`/blogs/${tip.slug}`} className="card h-100">
                                        <div className="row g-0 h-100">
                                            <div className="col-md-5 position-relative">
                                                <div className="card-image h-100">
                                                    <img src={getFeaturedImage(tip)} alt={tip.title.rendered} className="img-fluid object-fit-cover" />
                                                </div>
                                                <span className="tip-card-number">0{index + 2}</span>
                                            </div>
                                            <div className="col-md-7">
                                                <div className="card-body">
                                                    <h3 dangerouslySetInnerHTML={{ __html: tip.title.rendered }} />
                                                    <div dangerouslySetInnerHTML={{ __html: tip.excerpt?.rendered || "" }} className="excerpt-text mb-3" />
                                                    <div className="secondary-btn">
                                                        <span>Read More</span>
                                                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                                                            <path d="M1,5 L11,5"></path>
                                                            <polyline points="8 1 12 5 8 9"></polyline>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* Mobile View (Swiper) */}
                    <div className="row py-3 g-4 d-block d-lg-none">
                        <div className="col-12">
                            <div className="swiper tipsTricksSwiper">
                                <div className="swiper-wrapper">
                                    {tips.map((tip, index) => (
                                        <div className="swiper-slide mb-4" key={tip.id}>
                                            <article>
                                                <Link href={`/blogs/${tip.slug}`} className="card border-0">
                                                    <div className="card-image">
                                                        <img src={getFeaturedImage(tip)} alt={tip.title.rendered} className="img-fluid w-100" />
                                                    </div>
                                                    <span className="tip-card-badge">FEATURED</span>
                                                    <div className="card-body">
                                                        <span className="tip-card-number">0{index + 1}</span>
                                                        <h3 dangerouslySetInnerHTML={{ __html: tip.title.rendered }} />
                                                        <div dangerouslySetInnerHTML={{ __html: tip.excerpt?.rendered || "" }} className="excerpt-text mb-3" />
                                                        <div className="primary-btn mt-3">
                                                            <span className="primary-btn-icon">
                                                                <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                                </svg>
                                                                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                                    <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                                </svg>
                                                            </span>
                                                            Read More
                                                        </div>
                                                    </div>
                                                </Link>
                                            </article>
                                        </div>
                                    ))}
                                </div>
                                <div className="swiper-pagination mt-2 position-relative bottom-0"></div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 text-center mt-3 mt-md-0">
                            <Link href={viewAllLink} className="primary-btn ">
                                <span className="primary-btn-icon">
                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                {viewAllLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Tips and Tricks Section End */}
        </React.Fragment>
    );
};

export default TipsTricks;
