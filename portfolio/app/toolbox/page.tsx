import React from 'react';
import Script from 'next/script';

import ToolboxBanner from '@/app/components/Toolbox/Banner/Banner';
import ToolboxBreadcrumb from '@/app/components/Toolbox/Breadcrumb/Breadcrumb';
import DevStack from '@/app/components/Toolbox/DevStack/DevStack';
import DesignTools from '@/app/components/Toolbox/DesignTools/DesignTools';
import ProductivityTools from '@/app/components/Toolbox/ProductivityTools/ProductivityTools';
import HostingDeployment from '@/app/components/Toolbox/HostingDeployment/HostingDeployment';
import BonusTools from '@/app/components/Toolbox/BonusTools/BonusTools';
import RelatedBlogs from '@/app/components/Toolbox/RelatedBlogs/RelatedBlogs';
import ToolboxCTA from '@/app/components/Toolbox/CTA/CTA';
import { getToolboxData } from '@/app/lib/getToolbox';
import { getBlogs } from '@/app/lib/getBlogs';

export const metadata = {
    title: 'Toolbox | Techu Mayur - Web Developer & SEO Expert',
    description: 'Explore the tools and technologies I use to build scaleable web applications and optimize digital presence.',
};

const ToolboxPage = async () => {
    // Fetch data from WordPress
    const toolboxData = await getToolboxData();
    const blogPosts = await getBlogs();

    // Fallback if no data is found (optional, or show 404)
    if (!toolboxData) {
        console.warn('Toolbox page data not found in WordPress. Using fallback/static values if available.');
    }

    const acf = toolboxData?.acf;

    // If no ACF data, we can return null or a basic layout. 
    // Here we'll return the main content only if acf is available.
    if (!acf) {
        return (
            <>
                
                <main className="main-content">
                    <div className="container py-5 text-center">
                        <h2>Content coming soon...</h2>
                        <p>The toolbox data is being updated. Please check back later.</p>
                    </div>
                </main>
            </>
        );
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://techumayur.com" },
            { "@type": "ListItem", "position": 2, "name": "Toolbox", "item": "https://techumayur.com/toolbox" }
        ]
    };

    return (
        <>
            <Script
                id="breadcrumb-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            

            <main className="main-content">
                {/* Dynamically pass data to components */}
                <ToolboxBanner data={acf.banner} />
                <ToolboxBreadcrumb />
                <DevStack data={acf.development_stack} />
                <DesignTools data={acf.design_creativity} />
                <ProductivityTools data={acf.productivity_collaboration} />
                <HostingDeployment data={acf.hosting_deployment} />
                <BonusTools data={acf.bonus_tools} />
                {acf.cta && <ToolboxCTA data={acf.cta} />}
                <RelatedBlogs posts={blogPosts} />
            </main>

        </>
    );
};

export default ToolboxPage;

