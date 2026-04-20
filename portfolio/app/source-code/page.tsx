import React from 'react';
import type { Metadata } from 'next';
import Banner from '@/app/components/SourceCode/Banner/Banner';
import Breadcrumb from '@/app/components/Common/Breadcrumb';
import Intro from '@/app/components/SourceCode/Intro/Intro';
import Featured from '@/app/components/SourceCode/Featured/Featured';
import FilterBar from '@/app/components/SourceCode/FilterBar/FilterBar';
import Grid from '@/app/components/SourceCode/Grid/Grid';
import SourceCodeLogic from '@/app/components/SourceCode/SourceCodeLogic';
import { getSourceCode, getSourceCodeTaxonomies, getSourceCodeTags } from '@/app/lib/getSourceCode';
import { getSourceCodePage } from '@/app/lib/getSourceCodePage';
import { ACFSourceCodePage } from '@/types/acf';

export const metadata: Metadata = {
    title: 'Source Code | Techu Mayur',
    description: 'Explore my curated collection of open-source projects, landing pages, dashboards, and plugins. Clean code, real-world architecture, and production-ready standards.',
    keywords: 'source code, open source, nextjs, react, php, javascript, dashboards, landing pages, portfolio'
};

export default async function SourceCodePage() {
    const pageData: ACFSourceCodePage | null = await getSourceCodePage();
    const [projects, taxonomies, tags] = await Promise.all([
        getSourceCode(),
        getSourceCodeTaxonomies(),
        getSourceCodeTags()
    ]);

    // DEBUG: If you see this on screen, it means your ACF is returning different keys!
    // );


    // Final data merge from CMS - Handles field name discrepancies (label vs sub_heading, etc.)
    const mergedPageData: ACFSourceCodePage = {
        banner: {
            title: pageData?.banner?.title,
            sub_heading: pageData?.banner?.sub_heading,
            description: pageData?.banner?.description,
            sub_heading_image: pageData?.banner?.sub_heading_image,
            background_image: pageData?.banner?.background_image || pageData?.banner?.bg_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&h=800&fit=crop",
            banner_image: pageData?.banner?.banner_image,
        },
        intro_section: {
            sub_heading: pageData?.intro_section?.sub_heading || pageData?.intro_section?.label,
            sub_heading_image: pageData?.intro_section?.sub_heading_image,
            title: pageData?.intro_section?.title || pageData?.intro_section?.heading,
            description: pageData?.intro_section?.description || pageData?.intro_section?.content,
        },
        featured_section: {
            sub_heading: pageData?.featured_section?.sub_heading || pageData?.featured_section?.label,
            sub_heading_image: pageData?.featured_section?.sub_heading_image,
            title: pageData?.featured_section?.title || pageData?.featured_section?.heading,
            description: pageData?.featured_section?.description || pageData?.featured_section?.content,
        },
        grid_section: {
            sub_heading: pageData?.grid_section?.sub_heading || pageData?.grid_section?.label,
            title: pageData?.grid_section?.title || pageData?.grid_section?.heading,
            description: pageData?.grid_section?.description || pageData?.grid_section?.content,
        }
    };

    const breadcrumbItems = [
        { label: 'Home', url: '/' },
        { label: 'Source Code', active: true }
    ];

    return (
        <main className="source-code-page">
            <Banner data={mergedPageData.banner} />

            <Breadcrumb items={breadcrumbItems} />

            <Intro data={mergedPageData.intro_section} />

            <Featured data={mergedPageData.featured_section} projects={projects || []} tags={tags || []} taxonomies={taxonomies || []} />

            <FilterBar projects={projects || []} taxonomies={taxonomies || []} tags={tags || []} />

            <Grid projects={projects || []} taxonomies={taxonomies || []} tags={tags || []} data={mergedPageData.grid_section} />

            <SourceCodeLogic />

        </main>
    );
}
