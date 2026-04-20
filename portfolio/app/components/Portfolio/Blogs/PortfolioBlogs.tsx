"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ACFBlogs } from "@/types/acf";
import { WPBlogPostExtended } from '@/types/blogs';

interface PortfolioBlogsProps {
    data: ACFBlogs | null;
    blogs: WPBlogPostExtended[];
}

const PrimaryBtnIcon = () => (
    <span className="primary-btn-icon">
        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
        </svg>
        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
        </svg>
    </span>
);

const PortfolioBlogs = ({ data, blogs }: PortfolioBlogsProps) => {
    if (!data) return null;

    const subHeading = data.sub_heading || "My Blogs";
    const heading = data.heading || "My Latest <span class=\"highlight\">Blogs</span>";
    const description = data.description || "";
    const buttonLabel = data.button_label || "View All Blogs";
    const buttonLink = data.button_link || "/blogs";

    // Format blogs for UI
    const formattedBlogs = blogs.map(blog => {
        let image = blog._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";

        // Check ACF fallback if _embedded is missing
        if (!image && blog.acf?.featured_image) {
            const acfImage = blog.acf.featured_image;
            image = typeof acfImage === 'string' ? acfImage : (acfImage.url || "");
        }

        if (!image) {
            image = "/images/blogs/blogs-banner-mayur.jpg";
        }

        return {
            title: blog.title.rendered,
            category: blog._embedded?.['wp:term']?.[0]?.[0]?.name || "Article",
            date: new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            author: blog._embedded?.author?.[0]?.name || "Techu Mayur",
            views: blog.acf?.views_count || "0 Views",
            image,
            link: `/blogs/${blog.slug}`
        };
    });

    const featured = formattedBlogs[0];
    const smallBlogs = formattedBlogs.slice(1, 4);
    const largeBlogs = formattedBlogs.slice(4, 6);

    const renderSVGIcon = (type: 'calendar' | 'user' | 'eye') => {
        switch (type) {
            case 'calendar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                );
            case 'user':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                );
            case 'eye':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                );
        }
    };

    const clean = (html: string) => {
        if (!html) return "";
        return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
    };

    return (
        <section id="home-blog" className="pt-5 blog section-spacing">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-8">
                        <div className="section-title">
                            <span className="sub-heading-tag-1" dangerouslySetInnerHTML={{ __html: clean(subHeading) }} />
                            <h2 dangerouslySetInnerHTML={{ __html: clean(heading) }} />
                            {description && (
                                <div className="section-para-left">
                                    <p dangerouslySetInnerHTML={{ __html: clean(description) }} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4 text-md-end d-none d-lg-block">
                        <Link href={buttonLink} className="primary-btn ">
                            <PrimaryBtnIcon />
                            {buttonLabel}
                        </Link>
                    </div>
                </div>

                <div className="row g-4 mt-4 mt-md-2">
                    {/* Left Featured */}
                    {featured && (
                        <div className="col-lg-6 col-xl-4">
                            <article className="featured-card h-100">
                                <Link href={featured.link}>
                                    <Image src={featured.image} alt={featured.title} width={800} height={1000} className="w-100 h-100 object-fit-cover" unoptimized />
                                    <div className="featured-content">
                                        <span className="featured-badge">{featured.category}</span>
                                        <h3 className="featured-title">{featured.title}</h3>
                                        <div className="featured-meta">
                                            <span>{renderSVGIcon('calendar')} {featured.date}</span>
                                            <span>{renderSVGIcon('user')} {featured.author}</span>
                                            <span>{renderSVGIcon('eye')} {featured.views}</span>
                                        </div>
                                        <div className="primary-btn">
                                            <PrimaryBtnIcon />
                                            Read More
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        </div>
                    )}

                    {/* Middle Column */}
                    <div className="col-lg-6 col-xl-4 d-flex flex-column gap-4">
                        {smallBlogs.map((blog, idx) => (
                            <Link href={blog.link} className="small-blog-card d-flex align-items-start p-3" key={idx}>
                                <div className="small-icon me-3">
                                    <Image src={blog.image} alt={blog.title} width={100} height={100} className="object-fit-cover" unoptimized />
                                </div>
                                <div>
                                    <span className="small-category">{blog.category}</span>
                                    <h3 className="small-title">{blog.title}</h3>
                                    <div className="small-date">
                                        {renderSVGIcon('calendar')} {blog.date}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="col-xl-4 d-flex flex-column flex-lg-row flex-xl-column gap-3">
                        {largeBlogs.map((blog, idx) => (
                            <article className="large-blog-card position-relative h-100" key={idx}>
                                <Link href={blog.link}>
                                    <Image src={blog.image} className="w-100 h-100 object-fit-cover" alt={blog.title} width={600} height={400} unoptimized />
                                    <div className="large-card-content">
                                        <span className="large-badge">{blog.category}</span>
                                        <h3 className="large-title">{blog.title}</h3>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 mt-4 text-center d-block d-lg-none">
                        <Link href={buttonLink} className="primary-btn ">
                            <PrimaryBtnIcon />
                            {buttonLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioBlogs;

