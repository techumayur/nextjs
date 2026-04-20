import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ACFBlogLatestSection, WPBlogPostExtended } from '@/types/blogs';
import { parseHtml } from '@/app/lib/parseHtml';

interface LatestBlogsProps {
    data?: ACFBlogLatestSection | null;
    posts?: WPBlogPostExtended[];
}

const LatestBlogs = ({ data, posts = [] }: LatestBlogsProps) => {
    if (!data) return null;

    const { sub_heading, heading, description, button_label, button_link } = data;
    const buttonLink = button_link || "/blogs";
    const iconSrc = typeof data.sub_heading_icon === 'string' ? data.sub_heading_icon : "/images/user-1.svg";

    // Grab up to 6 posts for the specific grid layout
    const displayedPosts = posts.slice(0, 6);
    const featuredBlog = displayedPosts[0];
    const middleBlogs = displayedPosts.slice(1, 4);
    const rightBlogs = displayedPosts.slice(4, 6);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getPrimaryCategory = (post: WPBlogPostExtended) => {
        if (post._embedded && post._embedded['wp:term']) {
            const categories = post._embedded['wp:term'].flat().filter(term => term && term.taxonomy === 'category');
            if (categories.length > 0) return categories[0].name;
        }
        return 'General';
    };

    const getImageUrl = (post: WPBlogPostExtended) => {
        if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
            return post._embedded['wp:featuredmedia'][0].source_url;
        }
        if (post.acf?.featured_image) {
            const acfImage = post.acf.featured_image;
            return typeof acfImage === 'string' ? acfImage : (acfImage.url ?? '/images/blogs/blogs-banner-mayur.jpg');
        }
        return '/images/blogs/blogs-banner-mayur.jpg';
    };

    const getViews = (post: WPBlogPostExtended) => post.acf?.views_count || '1K+';
    const getAuthor = (post: WPBlogPostExtended) => post._embedded?.author?.[0]?.name || 'Techu Mayur';

    return (
        <React.Fragment>
            {/* Blogs Section Start */}
            <section id="home-blog" className="blog section-spacing">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8">
                            <div className="section-title">
                                {sub_heading && (
                                    <span className="sub-heading-tag-2">
                                        <div className="sub-heading-image">
                                            <picture>
                                                <img src={iconSrc} alt="Icon" width="20" height="20" loading="lazy" className="img-fluid" />
                                            </picture>
                                        </div>
                                        {sub_heading}
                                    </span>
                                )}
                                <h2 dangerouslySetInnerHTML={{ __html: parseHtml(heading) }} />
                                {description && (
                                    <div className="section-para-left">
                                        <p>{description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4 text-md-end d-none d-lg-block">
                            <Link href={buttonLink} className="primary-btn">
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
                                {button_label || "View All Blogs"}
                            </Link>
                        </div>
                    </div>
                    <div className="row g-4 mt-4 mt-md-2">
                        {/* Left Featured */}
                        {featuredBlog && (
                            <div className="col-lg-6 col-xl-4">
                                <article className="featured-card h-100">
                                    <Link href={`/blogs/${featuredBlog.slug}`}>
                                        <div className="featured-image-wrapper">
                                            <Image
                                                src={getImageUrl(featuredBlog)}
                                                alt={featuredBlog.title.rendered}
                                                width={800}
                                                height={600}
                                                className="img-fluid"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="featured-content">
                                            <span className="featured-badge">{getPrimaryCategory(featuredBlog)}</span>
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
                                            src={getImageUrl(blog)}
                                            alt={blog.title.rendered}
                                            width={100}
                                            height={100}
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <span className="small-category">{getPrimaryCategory(blog)}</span>
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
                                            src={getImageUrl(blog)}
                                            className="w-100"
                                            alt={blog.title.rendered}
                                            width={600}
                                            height={400}
                                            unoptimized
                                        />
                                        <div className="large-card-content">
                                            <span className="large-badge">{getPrimaryCategory(blog)}</span>
                                            <h3 className="large-title" dangerouslySetInnerHTML={{ __html: blog.title.rendered }} />
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-4 text-center d-block d-lg-none">
                            <Link href={buttonLink} className="primary-btn ">
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
                                {button_label || "View All Blogs"}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Blogs Section End */}
        </React.Fragment>
    );
};

export default LatestBlogs;

