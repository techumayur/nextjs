import React from 'react';
import Script from 'next/script';

import FaqBanner from '@/app/components/FAQ/Banner/Banner';
import FaqBreadcrumb from '@/app/components/FAQ/Breadcrumb/Breadcrumb';
import FaqIntro from '@/app/components/FAQ/Intro/Intro';
import FaqAccordion from '@/app/components/FAQ/Accordion/Accordion';
import RelatedBlogs from '@/app/components/Toolbox/RelatedBlogs/RelatedBlogs';
import FaqCTA from '@/app/components/FAQ/CTA/CTA';
import { getBlogs } from '@/app/lib/getBlogs';
import { getFaqData } from '@/app/lib/getFaq';

export const metadata = {
    title: 'FAQ | Techu Mayur - Web Development & SEO Insights',
    description: 'Find answers about modern web development, technical SEO, and scalable digital solutions.',
};

const FaqPage = async () => {
    // 🔥 Fetch dynamic content from WordPress
    const blogPosts = await getBlogs();
    const dynamicFaq = await getFaqData();
    const acf = dynamicFaq.acf;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": dynamicFaq.categories.flatMap(cat => cat.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        })))
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.techumayur.in" },
            { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://www.techumayur.in/faq" }
        ]
    };

    return (
        <>
            <Script
                id="faq-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            

            <main className="main-content">
                {acf?.banner && <FaqBanner data={acf.banner} />}
                <FaqBreadcrumb />
                {acf?.intro && <FaqIntro data={acf.intro} />}
                {/* 🔥 Use Dynamic Categories from WordPress */}
                <FaqAccordion categories={dynamicFaq.categories} />
                <RelatedBlogs posts={blogPosts} />
                {acf?.cta && <FaqCTA data={acf.cta} />}
            </main>
        </>
    );
};

export default FaqPage;

