import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
// import "@/app/blog-detail.css";

// Libs
import { getBlogPostBySlug, getAdjacentBlogPosts, getBlogs } from "@/app/lib/getBlogs";
import { getBlogsPage } from "@/app/lib/getBlogsPage";

// Components
import BlogDetailBanner from "@/app/components/BlogDetail/Banner";
import BlogMetaInfo from "@/app/components/BlogDetail/MetaInfo";
import BlogFeaturedImage from "@/app/components/BlogDetail/FeaturedImage";
import BlogTOC from "@/app/components/BlogDetail/TOC";
import BlogArticle from "@/app/components/BlogDetail/Article";
import BlogSidebar from "@/app/components/BlogDetail/Sidebar";
import BlogFAQ from "@/app/components/BlogDetail/FAQ";
import SocialShare from "@/app/components/BlogDetail/SocialShare";
import NextPrevNav from "@/app/components/BlogDetail/NextPrevNav";
import Breadcrumb, { BreadcrumbItem } from "@/app/components/Common/Breadcrumb";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    const plainDescription = post.excerpt?.rendered
        .replace(/<[^>]*>?/gm, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim() || `Read ${post.title.rendered} on Techu Mayur's Blog`;

    return {
        title: `${post.title.rendered} | Blogs | Techu Mayur`,
        description: plainDescription,
        openGraph: {
            title: `${post.title.rendered} | Techu Mayur`,
            description: plainDescription,
            images: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [post._embedded?.['wp:featuredmedia']?.[0]?.source_url] : [],
        },
        alternates: {
            canonical: `/blogs/${slug}`,
        }
    };
}

interface BlogFAQItem {
    question: string;
    answer: string;
}

export default async function BlogDetailPage({ params }: Params) {
    const { slug } = await params;

    // Fetch individual post data, adjacent posts for nav, and common blog data for sidebar
    const [post, blogsPageData] = await Promise.all([
        getBlogPostBySlug(slug),
        getBlogsPage()
    ]);

    if (!post) {
        notFound();
    }

    const { previous, next } = await getAdjacentBlogPosts(post.id);
    const category = post._embedded?.['wp:term']?.[0]?.[0];
    const recentPosts = await getBlogs(); // Or slice from blogsPageData.posts if you want more

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Home", url: "/" },
        { label: "Blogs", url: "/blogs" }
    ];

    if (category) {
        breadcrumbItems.push({
            label: category.name,
            url: `/blogs?category=${category.slug}`
        });
    }

    breadcrumbItems.push({ label: post.title.rendered, active: true });

    const cleanExcerpt = (html: string) => {
        if (!html) return "";
        return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
    };

    const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`;

    return (
        <main id="blog-detail-page" className="main-content">
            <BlogDetailBanner
                title={post.title.rendered}
                excerpt={cleanExcerpt(post.excerpt?.rendered || "")}
                categoryName={category?.name}
                authorImage={post._embedded?.author?.[0]?.avatar_urls?.['96']}
            />

            <Breadcrumb items={breadcrumbItems} />

            <BlogFeaturedImage
                title={post.title.rendered}
                image={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ""}
            />

            <BlogMetaInfo post={post} />

            <BlogTOC />

            <section id="blog-body" className="section-spacing pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <BlogArticle content={post.content.rendered} />
                        </div>

                        {/* Desktop Sidebar */}
                        <div className="col-lg-4 d-none d-lg-block">
                            <BlogSidebar
                                categories={blogsPageData.categories}
                                recentPosts={recentPosts}
                                tags={["Web Design", "UI / UX", "Development", "React", "Next.js", "GSAP", "SEO", "Tailwind", "JavaScript"]}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Offcanvas */}
                <div className="offcanvas offcanvas-end bd-sidebar-offcanvas d-lg-none" tabIndex={-1} id="blogSidebarOffcanvas" aria-labelledby="blogSidebarOffcanvasLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="blogSidebarOffcanvasLabel">Blog Sidebar</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <BlogSidebar
                            categories={blogsPageData.categories}
                            recentPosts={recentPosts}
                            tags={["Web Design", "UI / UX", "Development", "React", "Next.js", "GSAP", "SEO", "Tailwind", "JavaScript"]}
                        />
                    </div>
                </div>
            </section>

            {post.acf?.faqs?.faq_items && post.acf.faqs.faq_items.length > 0 && (
                <BlogFAQ
                    faqs={post.acf.faqs.faq_items.map((f: BlogFAQItem) => ({ question: f.question, answer: f.answer }))}
                />
            )}

            <SocialShare url={currentUrl} title={post.title.rendered} />

            <NextPrevNav previous={previous} next={next} />

            {/* SEO JSON-LD for FAQ if applicable */}
            {post.acf?.faqs?.faq_items && post.acf.faqs.faq_items.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": post.acf.faqs.faq_items.map((f: BlogFAQItem) => ({
                                "@type": "Question",
                                "name": f.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": f.answer
                                }
                            }))
                        })
                    }}
                />
            )}
        </main>
    );
}
