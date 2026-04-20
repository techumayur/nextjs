"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import './RelatedBlogs.css';
import type { WPBlogPostExtended } from '@/types/blogs';

interface RelatedBlogsProps {
    posts: WPBlogPostExtended[];
}

const RelatedBlogs = ({ posts }: RelatedBlogsProps) => {
    if (!posts || posts.length === 0) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getPrimaryCategory = (post: WPBlogPostExtended) => {
        if (post._embedded && post._embedded['wp:term']) {
            const categories = post._embedded['wp:term'].flat().filter(term => term && term.taxonomy === 'category');
            if (categories.length > 0) return categories[0].name;
        }
        return 'Tools';
    };

    const getImageUrl = (post: WPBlogPostExtended) => {
        if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
            return post._embedded['wp:featuredmedia'][0].source_url;
        }
        return 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=500&fit=crop';
    };

    return (
        <section id="related-blogs" className="related-blogs-section section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                        <div className="related-blogs-header">
                            <span className="sub-heading-tag-1">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                Insights & Knowledge
                            </span>
                            <h2>Related <span className="highlight">Blogs</span></h2>
                        </div>
                    </div>
                </div>

                <div className="blog-slider-container">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1.2}
                        spaceBetween={20}
                        grabCursor={true}
                        pagination={{
                            el: '.blog-swiper-pagination',
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            576: { slidesPerView: 1.5, spaceBetween: 24 },
                            768: { slidesPerView: 2, spaceBetween: 30 },
                            1200: { slidesPerView: 3, spaceBetween: 40 }
                        }}
                        className="blog-swiper"
                    >
                        {posts.map((post) => (
                            <SwiperSlide key={post.id}>
                                <article className="modern-blog-card">
                                    <Link href={`/blog/${post.slug}`}>
                                        <div className="modern-blog-image-wrapper">
                                            <span className="modern-blog-date-badge">{formatDate(post.date)}</span>
                                            <Image 
                                                className="modern-blog-image" 
                                                src={getImageUrl(post)} 
                                                alt={post.title.rendered} 
                                                width={800} 
                                                height={500} 
                                                unoptimized
                                            />
                                            <div className="curve-overlay"></div>
                                        </div>
                                        <div className="modern-blog-tags">
                                            <span className="tag">{getPrimaryCategory(post)}</span>
                                        </div>
                                        <div className="modern-blog-content">
                                            <h3 className="modern-blog-title" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                                            <div className="modern-blog-meta">
                                                <span className="meta-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg> {post._embedded?.author?.[0]?.name || 'Techu Mayur'}
                                                </span>
                                                <span className="separator">|</span>
                                                <span className="meta-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg> 5 Min Read
                                                </span>
                                            </div>
                                            <div className="modern-blog-footer">
                                                <div className="primary-btn">
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
                                        </div>
                                    </Link>
                                </article>
                            </SwiperSlide>
                        ))}
                        <div className="swiper-pagination blog-swiper-pagination"></div>
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default RelatedBlogs;

