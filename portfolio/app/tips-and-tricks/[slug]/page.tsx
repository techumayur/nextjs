import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Image from 'next/image';

// Lib
import { getTipBySlug, getAdjacentTips, getTipsTaxonomies, getTipsTags, getTips } from "@/app/lib/getTips";

// Components
import TipsSidebar from "@/app/components/TipsAndTricksDetail/Sidebar/TipsSidebar";
import TipsDetailBanner from "@/app/components/TipsAndTricksDetail/Banner/TipsDetailBanner";
import ArchitectMeta from "@/app/components/TipsAndTricksDetail/Meta/ArchitectMeta";
import TOC from "@/app/components/TipsAndTricksDetail/TOC/TOC";
import TipsFAQ from "@/app/components/TipsAndTricksDetail/FAQ/TipsFAQ";
import TipsNav from "@/app/components/TipsAndTricksDetail/ProjectNav/TipsNav";
import Breadcrumb, { BreadcrumbItem } from "@/app/components/Common/Breadcrumb";
import SocialShare from "@/app/components/PortfolioDetails/SocialShare/SocialShare";

// CSS
import "../../tutorials/tutorials.css"; // Reusing tutorial styles as they are identical in structure
import "./tips-detail.css";

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const tip = await getTipBySlug(slug);

    if (!tip) {
        return { title: "Tip Not Found" };
    }

    const plainDescription = tip.excerpt?.rendered
        .replace(/<[^>]*>?/gm, '')
        .trim() || `Read our latest tip: ${tip.title.rendered}`;

    return {
        title: `${tip.title.rendered} | Tips & Tricks | Techu Mayur`,
        description: plainDescription,
        openGraph: {
            title: `${tip.title.rendered} | Techu Mayur`,
            description: plainDescription,
            images: tip._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [tip._embedded?.['wp:featuredmedia']?.[0]?.source_url] : [],
        },
        alternates: {
            canonical: `/tips-and-tricks/${slug}`,
        }
    };
}

export default async function TipDetailPage({ params }: Params) {
    const { slug } = await params;
    const tip = await getTipBySlug(slug);

    if (!tip) {
        notFound();
    }

    const { previous, next } = await getAdjacentTips(tip.id);
    const taxonomies = await getTipsTaxonomies();
    const tags = await getTipsTags();
    const allTips = await getTips();
    const recentTips = allTips.filter(t => t.id !== tip.id).slice(0, 4);
    
    // Get category info
    const catIds = tip['tips-and-trick-taxonomy'] || [];
    const category = taxonomies.find(c => catIds.includes(c.id));
    
    const featuredMedia = tip._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const author = tip._embedded?.author?.[0];

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Home", url: "/" },
        { label: "Tips & Tricks", url: "/tips-and-tricks" },
        { label: tip.title.rendered, active: true }
    ];

    // ACF Fields mapping
    const bannerData = tip.acf?.banner_section || {};
    const metaData = tip.acf?.meta_section || {};
    const faqData = tip.acf?.faqs || {};

    return (
        <main id="tips-details-page" className="main-content">
            <TipsDetailBanner
                title={bannerData.title || tip.title.rendered}
                subHeading={bannerData.sub_heading}
                description={bannerData.description || tip.excerpt?.rendered.replace(/<[^>]*>?/gm, '')}
                backgroundImage={featuredMedia}
            />

            <Breadcrumb items={breadcrumbItems} />

            <section className="section-spacing featured-image-section pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title mb-5">
                                <h2 dangerouslySetInnerHTML={{ __html: tip.acf?.content_heading || tip.title.rendered }}></h2>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="blog-featured-image-wrapper">
                                <picture>
                                    <Image 
                                        src={tip._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200&h=630&fit=crop"} 
                                        alt={tip.title.rendered} 
                                        width={1200}
                                        height={630}
                                        className="img-fluid blog-featured-image" 
                                        unoptimized
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ArchitectMeta 
                author={{
                    name: author?.name || "Techu Mayur",
                    role: metaData.author_role || "Editorial Lead",
                    avatar: author?.avatar_urls?.['96'] || "/assets/images/user-1.svg"
                }}
                date={new Date(tip.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                readingTime={metaData.reading_time || "5 Min Read"}
                level={metaData.level || "Intermediate"}
                category={category ? { name: category.name, slug: category.slug } : undefined}
            />

            <TOC />

            <section id="blog-body" className="section-spacing pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <article className="bd-article" id="blog-article" dangerouslySetInnerHTML={{ __html: tip.content.rendered }}>
                            </article>
                        </div>
                        {/* Desktop Sidebar */}
                        <div className="col-lg-4 d-none d-lg-block">
                             <TipsSidebar 
                                categories={taxonomies}
                                tags={tags}
                                recentTips={recentTips}
                                allTips={allTips}
                             />
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Offcanvas */}
                <div className="offcanvas offcanvas-end bd-sidebar-offcanvas d-lg-none" tabIndex={-1} id="tipsSidebarOffcanvas" aria-labelledby="tipsSidebarOffcanvasLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="tipsSidebarOffcanvasLabel">Explore More</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <TipsSidebar 
                            categories={taxonomies}
                            tags={tags}
                            recentTips={recentTips}
                            allTips={allTips}
                        />

                    </div>
                </div>
            </section>

            <TipsFAQ 
                faqs={faqData.faq_items || []}
                heading={faqData.title}
                subHeading={faqData.sub_heading}
                description={faqData.description}
            />

            <SocialShare />

            <TipsNav previous={previous} next={next} />

            {/* SEO JSON-LD for FAQ */}
            {faqData.faq_items && faqData.faq_items.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqData.faq_items.map((f) => ({
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
