"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ACFBlogsSection, WPBlogPost } from '@/types/acf';

interface BlogsProps {
    sectionData: ACFBlogsSection | null;
    blogs: WPBlogPost[];
}

const Blogs = ({ sectionData, blogs }: BlogsProps) => {
    // If no blogs are found, we can return null or a message, but usually we expect blogs
    if (!blogs || blogs.length === 0) return null;

    // Split blogs for the grid layout: 1 Featured, 3 Middle, 2 Right (Total 6)
    const featuredBlog = blogs[0];
    const middleBlogs = blogs.slice(1, 4);
    const rightBlogs = blogs.slice(4, 6);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getFeaturedImage = (blog: WPBlogPost) => {
        return blog._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";
    };

    const getCategory = (blog: WPBlogPost) => {
        // Attempt to get the first category name
        return blog._embedded?.['wp:term']?.[0]?.find(term => term.taxonomy === 'category')?.name || "";
    };

    const getAuthor = (blog: WPBlogPost) => {
        return blog._embedded?.author?.[0]?.name || "";
    };

    const getViews = (blog: WPBlogPost) => {
        return blog.acf?.views_count || "";
    };

    const sectionSubHeading = sectionData?.sub_heading;
    const sectionSubHeadingImage = typeof sectionData?.sub_heading_image === 'string' ? sectionData.sub_heading_image : "";
    const sectionTitle = sectionData?.title || "";
    const sectionDescription = sectionData?.description;
    const viewAllLink = sectionData?.button_link || "/blogs";
    const viewAllLabel = sectionData?.button_label || "View All Blogs";

    return (
        <React.Fragment>
            {/* Blogs Section Start */}
            <section id="home-blog" className="blog section-spacing">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8">
                            <div className="section-title">
                                <span className="sub-heading-tag-1">
                                    <div className="sub-heading-image">
                                        <picture>
                                        <Image 
                                            src={(typeof sectionData?.sub_heading_icon === 'string' && sectionData.sub_heading_icon !== "") 
                                                ? sectionData.sub_heading_icon 
                                                : sectionSubHeadingImage || "/images/user-1.svg"} 
                                            alt="Icon" 
                                            width={20} 
                                            height={20} 
                                            loading="lazy" 
                                            className="img-fluid" 
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                        </picture>
                                    </div>
                                    {sectionSubHeading}
                                </span>
                                <h2 dangerouslySetInnerHTML={{ __html: sectionTitle }} />
                                <div className="section-para-left">
                                    <p>{sectionDescription}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 text-md-end d-none d-lg-block">
                            <Link href={viewAllLink} className="primary-btn">
                                <span className="primary-btn-icon">
                                    <svg
                                        width="10"
                                        className="primary-btn-svg-after"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 15">
                                        <path
                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg
                                        className="primary-btn-svg-before"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        fill="none"
                                        viewBox="0 0 14 15">
                                        <path
                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                {viewAllLabel}
                            </Link>
                        </div>
                    </div>
                    <div className="row g-4 mt-4 mt-md-2">
                        {/* Left Featured */}
                        {featuredBlog && (
                            <div className="col-lg-6 col-xl-4">
                                <article className="featured-card h-100">
                                    <Link href={`/blogs/${featuredBlog.slug}`}>
                                        <Image 
                                            src={getFeaturedImage(featuredBlog)} 
                                            alt={featuredBlog.title.rendered} 
                                            width={600} 
                                            height={400} 
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                        <div className="featured-content">
                                            <span className="featured-badge">{getCategory(featuredBlog)}</span>
                                            <h3 className="featured-title" dangerouslySetInnerHTML={{ __html: featuredBlog.title.rendered }} />
                                            <div className="featured-meta">
                                                <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg> {formatDate(featuredBlog.date)}</span>
                                                <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg> {getAuthor(featuredBlog)}</span>
                                                <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg> {getViews(featuredBlog)} Views</span>
                                            </div>
                                            <div className="primary-btn mt-4">
                                                <span className="primary-btn-icon">
                                                    <svg
                                                        width="10"
                                                        className="primary-btn-svg-after"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 14 15">
                                                        <path
                                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                    <svg
                                                        className="primary-btn-svg-before"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="10"
                                                        fill="none"
                                                        viewBox="0 0 14 15">
                                                        <path
                                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                                    </svg>
                                                </span>
                                                Read More
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            </div>
                        )}

                        {/* Middle Column */}
                        <div className="col-lg-6 col-xl-4 d-flex flex-column gap-4">
                            {middleBlogs.map((blog) => (
                                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="small-blog-card d-flex align-items-start p-3">
                                    <div className="small-icon me-3">
                                        <Image 
                                            src={getFeaturedImage(blog)} 
                                            alt={blog.title.rendered} 
                                            width={80} 
                                            height={80} 
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <span className="small-category">{getCategory(blog)}</span>
                                        <h3 className="small-title" dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                                        <div className="small-date"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg> {formatDate(blog.date)}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Right Column */}
                        <div className="col-xl-4 d-flex flex-column flex-lg-row flex-xl-column gap-3">
                            {rightBlogs.map((blog) => (
                                <article key={blog.id} className="large-blog-card position-relative h-100">
                                    <Link href={`/blogs/${blog.slug}`}>
                                        <Image 
                                            src={getFeaturedImage(blog)} 
                                            className="w-100" 
                                            alt={blog.title.rendered} 
                                            width={400} 
                                            height={250} 
                                            style={{ height: 'auto' }}
                                            unoptimized
                                        />
                                        <div className="large-card-content">
                                            <span className="large-badge">{getCategory(blog)}</span>
                                            <h3 className="large-title" dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-4 text-center d-block d-lg-none">
                            <Link href={viewAllLink} className="primary-btn ">
                                <span className="primary-btn-icon">
                                    <svg
                                        width="10"
                                        className="primary-btn-svg-after"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 15">
                                        <path
                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg
                                        className="primary-btn-svg-before"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        fill="none"
                                        viewBox="0 0 14 15">
                                        <path
                                            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                {viewAllLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Blogs Section End */}
        </React.Fragment>
    );
};

export default Blogs;
