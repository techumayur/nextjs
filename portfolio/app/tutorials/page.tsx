import React from 'react';
import { getTutorials, getTutorialTaxonomies, getTutorialTags } from '../lib/getTutorials';
import { getTutorialsPage } from '../lib/getTutorialsPage';
import { ACFTutorialsPage } from '@/types/acf';
import TutorialsClient from './TutorialsClient';
import './tutorials.css';

export const metadata = {
    title: 'Tutorials | Techu Mayur',
    description: 'Master the modern web with premium tutorials, bootcamps, and quick tips by Techu Mayur.',
};

export default async function TutorialsPage() {
    // Fetch all data server-side
    const [pageData, tutorials, taxonomies, tags] = await Promise.all([
        getTutorialsPage(),
        getTutorials(),
        getTutorialTaxonomies(),
        getTutorialTags()
    ]);

    // Fallback data if API fails or page not found
    const defaultPageData: ACFTutorialsPage = {
        banner: {
            sub_heading: "Techu Mayur's Masterclasses",
            sub_heading_icon: "/images/home/youtube-icon.svg",
            heading: "Premium Web <span class='text-gradient-teal'>Tutorials</span> & <span class='highlight-text text-gradient-orange'>Bootcamps</span>",
            description: "Master modern web development through high-quality video tutorials, deep-dive articles, and hands-on project sequences built for real-world impact.",
            background_image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1600&h=900&fit=crop"
        },
        video_tutorials: {
            sub_heading: "Comprehensive Lessons",
            title: "Expert Video Tutorials",
            description: "Deep dive into complex topics with step-by-step guidance."
        },
        quick_shorts: {
            sub_heading: "Bite-sized Learning",
            title: "Quick Shorts",
            description: "Master concepts in under 60 seconds."
        },
        instagram_reels: {
            sub_heading: "Creative Spikes",
            title: "Instagram Reels",
            description: "Visual tips and developer lifestyle content."
        }
    };

    // Robust merge with defaults to prevent "Cannot read properties of undefined"
    // This ensures that even if pageData exists but is missing specific sections (like banner), 
    // the application won't crash.
    const mergedPageData: ACFTutorialsPage = {
        ...defaultPageData,
        ...(pageData || {}),
        banner: { 
            ...defaultPageData.banner, 
            ...(pageData?.banner || {}) 
        },
        video_tutorials: { 
            ...defaultPageData.video_tutorials, 
            ...(pageData?.video_tutorials || {}) 
        },
        quick_shorts: { 
            ...defaultPageData.quick_shorts, 
            ...(pageData?.quick_shorts || {}) 
        },
        instagram_reels: { 
            ...defaultPageData.instagram_reels, 
            ...(pageData?.instagram_reels || {}) 
        }
    };

    return (
        <TutorialsClient 
            pageData={mergedPageData} 
            tutorials={tutorials || []} 
            taxonomies={{ 
                categories: taxonomies || [],
                tags: tags || []
            }} 
        />
    );
}
