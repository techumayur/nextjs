import React from 'react';
import Sitemap from '@/app/components/Sitemap/Sitemap';
import type { Metadata } from 'next';
import { getSitemapPage } from '@/app/lib/getSitemapPage';

export async function generateMetadata(): Promise<Metadata> {
    const data = await getSitemapPage();
    const banner = data?.sitemap_banner;
    
    return {
        title: banner?.title || 'HTML Sitemap | Techu Mayur Portfolio',
        description: banner?.description || 'A complete list of all pages, projects, blogs, and resources on the Techu Mayur portfolio website.',
    };
}

export default async function SitemapPage() {
    const data = await getSitemapPage();

    if (!data) {
        return <div>Loading Sitemap...</div>; // Simple loading or 404
    }

    return (
        <>
            <Sitemap data={data} />
            {/* SiteNavigationElement Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": data.sitemap_banner?.title || "Techu Mayur Sitemap",
                        "url": "https://www.techumayur.in/sitemap",
                        "itemListElement": data.sitemap_categories?.map((cat, idx) => ({
                            "@type": "ListItem",
                            "position": idx + 1,
                            "item": {
                                "@type": "ItemList",
                                "name": cat.title,
                                "itemListElement": cat.links?.map((link, lIdx) => ({
                                    "@type": "SiteNavigationElement",
                                    "position": lIdx + 1,
                                    "name": link.name,
                                    "url": `https://www.techumayur.in${link.url}`
                                }))
                            }
                        }))
                    })
                }}
            />
        </>
    );
}
