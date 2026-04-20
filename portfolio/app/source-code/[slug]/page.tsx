import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import Banner from '@/app/components/SourceCodeDetail/Banner/Banner';
import HeadingContent from '@/app/components/SourceCodeDetail/HeadingContent/HeadingContent';
import MetaBar from '@/app/components/SourceCodeDetail/MetaBar/MetaBar';
import Overview from '@/app/components/SourceCodeDetail/Overview/Overview';
import TechBricks from '@/app/components/SourceCodeDetail/TechBricks/TechBricks';
import RoleStack from '@/app/components/SourceCodeDetail/RoleStack/RoleStack';
import Process from '@/app/components/SourceCodeDetail/Process/Process';
import SourceCode from '@/app/components/SourceCodeDetail/SourceCode/SourceCode';
import SetupInstructions from '@/app/components/SourceCodeDetail/SetupInstructions/SetupInstructions';
import UsageDemo from '@/app/components/SourceCodeDetail/UsageDemo/UsageDemo';
import Gallery from '@/app/components/SourceCodeDetail/Gallery/Gallery';
import Branding from '@/app/components/SourceCodeDetail/Branding/BrandingWrapper';
import SourceCodeCTA from '@/app/components/SourceCodeDetail/SourceCodeCTA/SourceCodeCTA';
import SocialShare from '@/app/components/SourceCodeDetail/SocialShare/SocialShare';
import ProjectTaxonomies from '@/app/components/SourceCodeDetail/ProjectTaxonomies/ProjectTaxonomies';
import AuthorBox from '@/app/components/SourceCodeDetail/AuthorBox/AuthorBox';
import ProjectNavigation from '@/app/components/SourceCodeDetail/ProjectNavigation/ProjectNavigation';
import ProjectFeatures from '@/app/components/SourceCodeDetail/ProjectFeatures/ProjectFeatures';
import RelatedProjects from '@/app/components/SourceCodeDetail/RelatedProjects/RelatedProjects';
import Breadcrumb from '@/app/components/Common/Breadcrumb';
import { getSourceCodeBySlug, getAdjacentSourceCodes, getRelatedSourceCode } from '@/app/lib/getSourceCode';
import { ACFImage } from '@/types/acf';


interface Params {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const project = await getSourceCodeBySlug(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const plainDescription = project.excerpt?.rendered
        .replace(/<[^>]*>?/gm, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')
        .trim() || `Explore the source code of ${project.title.rendered} by Techu Mayur`;

    return {
        title: `${project.title.rendered} | Source Code | Techu Mayur`,
        description: plainDescription,
        keywords: project._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'source-code-tag').map(term => term.name).join(', ') || 'source code, web development',
        openGraph: {
            title: `${project.title.rendered} | Techu Mayur`,
            description: plainDescription,
            images: project._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [project._embedded?.['wp:featuredmedia']?.[0]?.source_url] : [],
        },
        alternates: {
            canonical: `/source-code/${slug}`,
        }
    };
}

export default async function SourceCodeDetailPage({ params }: Params) {
    const { slug } = await params;
    const project = await getSourceCodeBySlug(slug);

    if (!project) {
        notFound();
    }

    // Fetch navigation and related data
    const { previous, next } = await getAdjacentSourceCodes(project.id);
    const relatedProjects = await getRelatedSourceCode(project.id, project['source-code-taxonomy'] || project.source_code_taxonomy || []);

    const breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: 'Source Code', url: '/source-code' },
        { label: project.title.rendered, active: true }
    ];

    const acf = project.acf;

    return (
        <main className="source-code-detail-page">
            <Banner
                title={project.title.rendered}
                subHeading={acf?.banner_section?.sub_heading || acf?.difficulty_level}
                description={acf?.banner_section?.description || project.excerpt?.rendered.replace(/<[^>]*>?/gm, '').trim()}
                backgroundImage={(() => {
                    // Try to find the image in any of these ACF locations
                    const bg = acf?.banner_section?.bg_image || acf?.banner_section?.background_image || acf?.bg_image || acf?.background_image;

                    // Extract URL from ACF result
                    const acfUrl = typeof bg === 'string' ? bg : (bg && typeof bg === 'object' && 'url' in bg) ? (bg as { url: string }).url : undefined;

                    // Final fallback to the WordPress post Featured Image
                    const featuredImage = project._embedded?.['wp:featuredmedia']?.[0]?.source_url;

                    return acfUrl || featuredImage;
                })()}
            />
            <Breadcrumb items={breadcrumbItems} />

            <HeadingContent
                data={acf?.heading_content}
                fallbackTitle={project.title.rendered}
                fallbackFeaturedImage={project._embedded?.['wp:featuredmedia']?.[0]?.source_url}
            />

            <MetaBar
                createdBy={project._embedded?.author?.[0]?.name}
                releaseDate={new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                techStack={project._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'source-code-tag').map(term => term.name) || []}
                liveDemoLink={acf?.license_section?.view_link}
                downloadLink={acf?.license_section?.download_link}
                license={acf?.license_section}
            />


            <Overview
                data={acf?.overview_section}
                fallbackContent={project.content.rendered}
            />

            <TechBricks
                sub_heading={acf?.tech_bricks_section?.sub_heading}
                sub_heading_icon={acf?.tech_bricks_section?.sub_heading_icon}
                heading={acf?.tech_bricks_section?.heading}
                highlightText={acf?.tech_bricks_section?.highlight_text}
                description={acf?.tech_bricks_section?.description}
                technologies={Array.isArray(acf?.tech_bricks_section?.technologies) ? acf.tech_bricks_section.technologies.map(tech => {
                    // Try multiple field names just in case of ACF naming variations
                    const techData = tech as unknown as Record<string, unknown>;
                    const icon = techData.icon || techData.logo || techData.image || techData.icon_image;

                    const isSvg = typeof icon === 'string' && icon.trim().startsWith('<svg');

                    // Robust URL extraction
                    let url = undefined;
                    if (typeof icon === 'string') {
                        url = icon;
                    } else if (icon && typeof icon === 'object') {
                        // Try typical ACF and WordPress media object properties
                        const iconObj = icon as Record<string, unknown>;
                        url = (iconObj.url || iconObj.source_url) as string | undefined;
                    }

                    return {
                        name: (techData.name as string) || '',
                        tag: (techData.tag as string) || '',
                        iconUrl: isSvg ? undefined : url,
                        iconHtml: isSvg ? (icon as string) : undefined
                    };
                }) : []}
            />

            <RoleStack
                sub_heading={acf?.role_section?.sub_heading}
                sub_heading_icon={acf?.role_section?.sub_heading_icon}
                heading={acf?.role_section?.heading || acf?.heading}
                highlightText={acf?.role_section?.highlight_text}
                description={acf?.role_section?.description || acf?.description}
                subHeadingText={acf?.role_section?.sub_heading_text || acf?.sub_heading_text}
                subHeadingImageUrl={(() => {
                    const icon = acf?.role_section?.sub_heading_image || acf?.sub_heading_image;
                    const isSvg = typeof icon === 'string' && icon.trim().startsWith('<svg');
                    return isSvg ? undefined : (typeof icon === 'string' ? icon : (icon && typeof icon === 'object' && 'url' in icon) ? (icon as { url: string }).url : undefined);
                })()}
                subHeadingImageHtml={(() => {
                    const icon = acf?.role_section?.sub_heading_image || acf?.sub_heading_image;
                    return typeof icon === 'string' && icon.trim().startsWith('<svg') ? icon : undefined;
                })()}
                items={(() => {
                    interface RoleItem {
                        year: string;
                        title: string;
                        icon: ACFImage;
                        company: string;
                        description: string;
                    }

                    interface RoleSource {
                        items?: RoleItem[];
                        contribution?: string;
                        technologies?: string | { name: string; }[] | null;
                        deliverables?: string;
                        my_role?: RoleSource;
                        role_section?: RoleSource;
                        heading_content?: { my_role?: RoleSource };
                        heading__content?: { my_role?: RoleSource };
                        project_overview?: { my_role?: RoleSource };
                    }

                    // Search for role data in multiple possible locations
                    const typedAcf = acf as RoleSource | undefined;

                    const sources = [
                        { name: 'role_section', data: typedAcf?.role_section },
                        { name: 'my_role', data: typedAcf?.my_role },
                        { name: 'heading_content.my_role', data: typedAcf?.heading_content?.my_role },
                        { name: 'heading__content.my_role', data: typedAcf?.heading__content?.my_role },
                        { name: 'project_overview.my_role', data: typedAcf?.project_overview?.my_role },
                        { name: 'top-level acf', data: typedAcf }
                    ].filter(s => s.data && Object.keys(s.data).length > 0);

                    // Find first source with items, or first source with ANY data
                    const bestSource = sources.find(s => Array.isArray(s.data?.items) && s.data.items.length > 0)
                        || sources.find(s => s.data?.contribution || s.data?.technologies || s.data?.deliverables)
                        || sources[0];

                    const roleSource = bestSource?.data;
                    const items = roleSource?.items;

                    if (Array.isArray(items) && items.length > 0) {
                        return items.map((item: RoleItem) => {
                            const icon = item.icon;
                            const isSvg = typeof icon === 'string' && icon.trim().startsWith('<svg');
                            const url = typeof icon === 'string' ? icon : (icon && typeof icon === 'object' && 'url' in icon) ? (icon as { url: string }).url : undefined;

                            return {
                                year: item.year,
                                title: item.title,
                                company: item.company,
                                description: item.description,
                                iconUrl: isSvg ? undefined : url,
                                iconHtml: isSvg ? (icon as string) : undefined
                            };
                        });
                    }

                    return [];
                })()}
            />

            <Process data={acf?.process_section} />

            <ProjectFeatures data={acf?.features_section} />


            <SourceCode data={acf?.source_code_section} title={project.title.rendered} />

            <SetupInstructions data={acf?.setup_section} />

            <UsageDemo data={acf?.usage_section} previewImage={project._embedded?.['wp:featuredmedia']?.[0]?.source_url} />

            {/* <Gallery data={acf?.gallery_section} /> */}

            <Branding data={acf?.branding} />
            <SourceCodeCTA data={acf?.cta1 || acf?.cta || acf?.cta_section} />

            <ProjectTaxonomies
                categories={project._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'source-code-taxonomy').map(term => term.name) || []}
                tags={project._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'source-code-tag').map(term => term.name) || []}
                data={acf?.taxonomies_section}
            />

            <AuthorBox />
            <SocialShare />
            <ProjectNavigation previous={previous} next={next} />

            <RelatedProjects projects={relatedProjects} />




        </main>
    );
}
