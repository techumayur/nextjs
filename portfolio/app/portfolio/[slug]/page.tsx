import React from 'react';
import { notFound } from "next/navigation";
import PortfolioDetailsBanner from "@/app/components/PortfolioDetails/Banner/PortfolioDetailsBanner";
import Masterpiece from "@/app/components/PortfolioDetails/Masterpiece/Masterpiece";
import Overview from "@/app/components/PortfolioDetails/Overview/Overview";
import Execution from "@/app/components/PortfolioDetails/Execution/Execution";
import Gallery from "@/app/components/PortfolioDetails/Gallery/Gallery";
import KeyFeatures from "@/app/components/PortfolioDetails/KeyFeatures/KeyFeatures";
import BrandGuidelines from "@/app/components/PortfolioDetails/BrandGuidelines/BrandGuidelinesWrapper";
import Taxonomies from "@/app/components/PortfolioDetails/Taxonomies/Taxonomies";
import AuthorBox from "@/app/components/PortfolioDetails/AuthorBox/AuthorBox";
import TechnologyUsed from "@/app/components/PortfolioDetails/TechnologyUsed/TechnologyUsed";
import Breadcrumb, { BreadcrumbItem } from "@/app/components/Common/Breadcrumb";
import PortfolioCTA from "@/app/components/PortfolioDetails/CTA/PortfolioCTA";
import ProjectNav from "@/app/components/PortfolioDetails/ProjectNav/ProjectNav";
import PortfolioFAQ from "@/app/components/PortfolioDetails/FAQ/PortfolioFAQ";
import SocialShare from "@/app/components/PortfolioDetails/SocialShare/SocialShare";
import RelatedProjects from "@/app/components/PortfolioDetails/RelatedProjects/RelatedProjects";
import { getPortfolioItemBySlug, getPortfolioItems, getAdjacentProjects } from "@/app/lib/getPortfolio";
import { Metadata } from 'next';
import { WPPortfolioItem } from '@/types/acf';

interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const project = await getPortfolioItemBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const plainDescription = project.excerpt?.rendered
        .replace(/<[^>]*>?/gm, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim() || `Explore the details of the custom solution: ${project.title.rendered}`;

    return {
        title: `${project.title.rendered} | Portfolio | Techu Mayur`,
        description: plainDescription,
        keywords: project._embedded?.['wp:term']?.[0]?.map(term => term.name).join(', ') || 'portfolio, web development, seo',
        openGraph: {
            title: `${project.title.rendered} | Techu Mayur`,
            description: plainDescription,
            images: project._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [project._embedded?.['wp:featuredmedia']?.[0]?.source_url] : [],
        },
        alternates: {
            canonical: `/portfolio/${slug}`,
        }
    };
}

export default async function ProjectDetailPage({ params }: Params) {
    const { slug } = await params;
    const project = await getPortfolioItemBySlug(slug);

    if (!project) {
        notFound();
    }

    const { previous, next } = await getAdjacentProjects(project.id);

    const featuredMedia = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const categories = project._embedded?.['wp:term']?.find(terms => terms[0]?.taxonomy === 'portfolio-taxonomy');
    const category = categories?.[0];

    // Fetch related projects based on category
    let relatedProjects: WPPortfolioItem[] = [];
    if (category) {
        const allInCategory = await getPortfolioItems(1, 4, category.id);
        relatedProjects = allInCategory.filter(p => p.id !== project.id).slice(0, 3);
    }

    // FALLBACK: If no related projects in the same category, fetch latest projects
    if (relatedProjects.length === 0) {
        // console.log("No related projects found in category, fetching latest projects as fallback.");
        const latestProjects = await getPortfolioItems(1, 4);
        relatedProjects = latestProjects.filter(p => p.id !== project.id).slice(0, 3);
    }

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: "Home", url: "/" },
        { label: "Portfolio", url: "/portfolio" }
    ];

    if (category) {
        breadcrumbItems.push({
            label: category.name,
            url: `/portfolio?category=${category.id}`
        });
    }

    breadcrumbItems.push({ label: project.title.rendered, active: true });

    const cleanExcerpt = (html: string) => {
        if (!html) return "";
        return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
    };

    return (
        <main id="portfolio-details-page" className="main-content">
            <PortfolioDetailsBanner
                title={project.title.rendered}
                description={cleanExcerpt(project.excerpt?.rendered || "")}
                backgroundImage={(() => {
                    const bannerImg = project.acf?.banner_image;
                    if (bannerImg) {
                        if (typeof bannerImg === 'string') return bannerImg;
                        if (typeof bannerImg === 'object' && bannerImg !== null && 'url' in bannerImg) {
                            return (bannerImg as { url: string }).url;
                        }
                    }
                    return featuredMedia;
                })()}
            />
            <Breadcrumb items={breadcrumbItems} />
            <Masterpiece
                subHeading={project.acf?.heading__content?.sub_heading || project.acf?.project_overview?.sub_heading}
                heading={project.acf?.heading__content?.heading || project.acf?.project_overview?.heading}
                highlightText={project.acf?.heading__content?.highlight_text || project.acf?.project_overview?.highlight_text}
                description={project.acf?.heading__content?.description || project.acf?.project_overview?.description}
            />
            <Overview
                key={project.id}
                subHeading={project.acf?.project_overview?.sub_heading}
                heading={project.acf?.project_overview?.heading}
                highlightText={project.acf?.project_overview?.highlight_text}
                myRole={project.acf?.project_overview?.my_role}
                liveLink={project.acf?.project_overview?.live_link}
                terminal={project.acf?.project_overview?.terminal || project.acf?.heading__content?.terminal}
            />
            <Execution
                subHeading={project.acf?.execution_process?.sub_heading}
                heading={project.acf?.execution_process?.heading}
                highlightText={project.acf?.execution_process?.highlight_text}
                description={project.acf?.execution_process?.description}
                steps={project.acf?.execution_process?.steps}
            />
            <KeyFeatures
                subHeading={project.acf?.key_features?.sub_heading}
                heading={project.acf?.key_features?.heading}
                highlightText={project.acf?.key_features?.highlight_text}
                description={project.acf?.key_features?.description}
                features={project.acf?.key_features?.features}
            />

            {(() => {
                const g = project.acf?.gallery;
                const pg = project.acf?.project_gallery;
                const t = project.acf?.technology_used;
                const pt = project.acf?.project_technology;

                return (
                    <>
                        {/* <Gallery 
                            subHeading={(g && !Array.isArray(g) ? g.sub_heading : undefined) || (pg && !Array.isArray(pg) ? pg.sub_heading : undefined)}
                            heading={(g && !Array.isArray(g) ? g.heading : undefined) || (pg && !Array.isArray(pg) ? pg.heading : undefined)}
                            highlightText={(g && !Array.isArray(g) ? g.highlight_text : undefined) || (pg && !Array.isArray(pg) ? pg.highlight_text : undefined)}
                            description={(g && !Array.isArray(g) ? g.description : undefined) || (pg && !Array.isArray(pg) ? pg.description : undefined)}
                            slides={(Array.isArray(g) ? g : (g && !Array.isArray(g) ? g.slides : undefined)) || (Array.isArray(pg) ? pg : (pg && !Array.isArray(pg) ? pg.slides : undefined))}
                        /> */}

                        <TechnologyUsed
                            subHeading={(t && !Array.isArray(t) ? t.sub_heading : undefined) || (pt && !Array.isArray(pt) ? pt.sub_heading : undefined)}
                            heading={(t && !Array.isArray(t) ? t.heading : undefined) || (pt && !Array.isArray(pt) ? pt.heading : undefined)}
                            description={(t && !Array.isArray(t) ? t.description : undefined) || (pt && !Array.isArray(pt) ? pt.description : undefined)}
                            technologies={(Array.isArray(t) ? t : (t && !Array.isArray(t) ? t.technologies : undefined)) || (Array.isArray(pt) ? pt : (pt && !Array.isArray(pt) ? pt.technologies : undefined))}
                        />
                    </>
                );
            })()}
            <BrandGuidelines project={project} />
            <PortfolioCTA data={project.acf?.cta} />
            <SocialShare />
            <Taxonomies project={project} />
            <AuthorBox />
            <RelatedProjects projects={relatedProjects} />
            <PortfolioFAQ
                subHeading={project.acf?.faqs?.sub_heading}
                heading={project.acf?.faqs?.heading}
                highlightText={project.acf?.faqs?.highlight_text}
                description={project.acf?.faqs?.description}
                faqs={project.acf?.faqs?.faqs}
            />
            <ProjectNav previous={previous} next={next} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What was the main objective of this project?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The primary goal was to create a high-performance, responsive digital solution that addresses core user needs while maintaining a premium aesthetic and seamless user experience."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What technologies were used?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "I utilized a modern stack including React, PHP, and custom-tailored CSS, along with advanced animation libraries to ensure a robust and interactive performance."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How long did the implementation take?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The project was completed within a focused timeframe, following an agile methodology to ensure rapid development without compromising on quality or attention to detail."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is the project fully responsive?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Absolutely. The architecture follows a mobile-first approach, ensuring that all features and layouts translate perfectly across desktops, tablets, and smartphones."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Did you handle the SEO optimization?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, SEO best practices were integrated from the start, including semantic HTML structure, optimized meta tags, fast loading speeds, and structured data for enhanced visibility."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is the source code available?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Portions of the implementation logic are available in my open-source repositories for learning purposes, while the core business logic remains exclusive to the project."
                                }
                            }
                        ]
                    })
                }}
            />
        </main>
    );
}
