import React from 'react';
import TipsBanner from '../components/TipsAndTricks/Banner/TipsBanner';
import TipsHeader from '../components/TipsAndTricks/Intro/TipsHeader';
import TipsFeatured from '../components/TipsAndTricks/Featured/TipsFeatured';
import TipsFilterBar from '../components/TipsAndTricks/FilterBar/TipsFilterBar';
import TipsGrid from '../components/TipsAndTricks/Grid/TipsGrid';
import TipsLogic from './TipsLogic';
import { getTipsPage } from '../lib/getTipsPage';
import { getTips, getTipsTaxonomies, getTipsTags } from '../lib/getTips';
import { ACFTipsPage } from '@/types/acf';

export const metadata = {
    title: "Tips & Tricks - Techu Mayur | Full-Stack Developer",
    description: "Explore curated tips, tricks, and tutorials on Web Development, SEO, and Design by Techu Mayur.",
    openGraph: {
        title: "Tips & Tricks - Techu Mayur",
        description: "Explore curated tips, tricks, and tutorials on Web Development, SEO, and Design by Techu Mayur.",
        url: "https://techumayur.com/tips-and-tricks",
        type: "website",
    },
};

export default async function TipsAndTricksPage() {
    const [pageData, tips, taxonomies, tags] = await Promise.all([
        getTipsPage(),
        getTips(),
        getTipsTaxonomies(),
        getTipsTags()
    ]);

    // Use dynamic CMS data with safe object extraction
    const data = {
        banner: pageData?.banner || {},
        heading_section: pageData?.heading_section || {},
        tips_section: pageData?.tips_section || {}
    };

    return (
        <main>
            <TipsBanner data={data.banner} />
            <TipsHeader data={data.heading_section} />
            <TipsFeatured data={data.tips_section} tips={tips || []} />
            <TipsFilterBar tips={tips || []} taxonomies={{ categories: taxonomies || [], tags: tags || [] }} />
            <TipsGrid tips={tips || []} taxonomies={{ categories: taxonomies || [], tags: tags || [] }} />
            <TipsLogic />
        </main>
    );
}
