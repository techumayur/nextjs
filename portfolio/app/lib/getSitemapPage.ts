import { SitemapPageData, ACFImage } from "@/types/acf";

interface DynamicLink {
    name: string;
    url: string;
    is_primary?: boolean;
    preview_style: 'hero' | 'profile' | 'form' | 'lines' | 'grid' | 'masonry' | 'acc' | 'blog' | 'tags' | 'code';
}

interface DynamicCategory {
    title: string;
    icon_svg: string;
    links: DynamicLink[];
    count: string | number;
}

export async function getSitemapPage(): Promise<SitemapPageData['acf'] | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) {
        console.error("WP API URL is missing");
        return null;
    }

    try {
        // 1. Fetch the base Sitemap page data for the banner/intro
        const sitemapRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=sitemap&_embed`, {
            next: { revalidate: 3600 }
        });

        if (!sitemapRes.ok) {
            console.error("Failed to fetch sitemap page data");
            return null;
        }

        const sitemapData = await sitemapRes.json();
        if (!sitemapData || sitemapData.length === 0) return null;

        const acf = sitemapData[0].acf as SitemapPageData['acf'];
        
        // --- Media Resolution ---
        const mediaIds: number[] = [];
        if (acf.sitemap_banner) {
            if (typeof acf.sitemap_banner.background_image === 'number') mediaIds.push(acf.sitemap_banner.background_image);
            if (typeof acf.sitemap_banner.sub_heading_icon === 'number') mediaIds.push(acf.sitemap_banner.sub_heading_icon as number);
            if (typeof acf.sitemap_banner.sub_heading_image === 'number') mediaIds.push(acf.sitemap_banner.sub_heading_image as number);
        }
        if (acf.sitemap_intro) {
            if (typeof acf.sitemap_intro.badge_icon === 'number') mediaIds.push(acf.sitemap_intro.badge_icon as number);
        }

        const mediaMap: Record<number, string> = {};
        if (mediaIds.length > 0) {
            try {
                const uniqueIds = [...new Set(mediaIds)];
                const mRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(',')}&per_page=100`, { next: { revalidate: 3600 } });
                if (mRes.ok) {
                    const mData = await mRes.json();
                    mData.forEach((m: { id: number; source_url: string }) => {
                        mediaMap[m.id] = m.source_url;
                    });
                }
            } catch (e) {
                console.error("Sitemap media resolution failed:", e);
            }
        }

        const resolve = (img: ACFImage | string | number | undefined): string => {
            if (!img) return "";
            if (typeof img === 'number') return mediaMap[img] || "";
            if (typeof img === 'string') return img;
            if (typeof img === 'object' && img && 'url' in img) return img.url || "";
            return "";
        };

        if (acf.sitemap_banner) {
            acf.sitemap_banner.background_image = resolve(acf.sitemap_banner.background_image);
            acf.sitemap_banner.sub_heading_icon = resolve(acf.sitemap_banner.sub_heading_icon || acf.sitemap_banner.sub_heading_image);
        }
        if (acf.sitemap_intro) {
            acf.sitemap_intro.badge_icon = resolve(acf.sitemap_intro.badge_icon);
        }

        // --- Dynamic Content Aggregation ---
        // Fetch items and counts in parallel
        const [
            pagesRes,
            portfolioRes,
            postsRes,
            tutorialsRes,
            sourceRes,
            tipsRes,
            toolboxRes,
            faqRes
        ] = await Promise.all([
            fetch(`${baseUrl}/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r.ok ? r.json() : []),
            fetch(`${baseUrl}/wp-json/wp/v2/portfolio?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/tutorial?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/source-code?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/tips-and-trick?per_page=100&_fields=id,slug,title,link`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=toolbox`, { next: { revalidate: 3600 } }).then(r => r),
            fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=faq`, { next: { revalidate: 3600 } }).then(r => r)
        ]);

        const getHeaderTotal = (r: Response) => r?.headers.get('X-WP-Total') || "0";
        const getItems = async (r: Response) => r.ok ? await r.json() : [];

        const portfolioItems = await getItems(portfolioRes);
        const postItems = await getItems(postsRes);
        const tutorialItems = await getItems(tutorialsRes);
        const sourceItems = await getItems(sourceRes);
        const tipsItems = await getItems(tipsRes);

        // 2. Build Categories
        const dynamicCategories: DynamicCategory[] = [];

        // --- PAGES ---
        const pageLinks: DynamicLink[] = [
            { name: "Home", url: "/", is_primary: true, preview_style: 'hero' }
        ];
        
        // Map CMS pages
        pagesRes.forEach((page: { title: { rendered: string }; slug: string }) => {
            // Discard 'home' slug as we already have manual 'Home' link
            if (page.slug === 'home' || page.slug === 'sitemap') return;

            // Determine preview style based on slug
            let style: DynamicLink['preview_style'] = 'lines';
            if (page.slug === 'about-me') style = 'profile';
            else if (page.slug.includes('contact')) style = 'form';
            else if (page.slug === 'sitemap') style = 'grid';
            else if (page.slug === 'faq') style = 'acc';
            else if (page.slug === 'portfolio' || page.slug === 'blogs') style = 'blog';
            
            pageLinks.push({ 
                name: page.title.rendered.replace(/&amp;/g, '&'), 
                url: `/${page.slug}`, 
                preview_style: style 
            });
        });

        dynamicCategories.push({
            title: "Pages",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
            links: pageLinks,
            count: pageLinks.length
        });

        // --- PORTFOLIO ---
        const portfolioLinks: DynamicLink[] = [
            { name: "All Projects", url: "/portfolio", is_primary: true, preview_style: 'masonry' }
        ];
        portfolioItems.forEach((item: { title: { rendered: string }; slug: string }) => {
            portfolioLinks.push({ name: item.title.rendered, url: `/portfolio/${item.slug}`, preview_style: 'masonry' });
        });

        dynamicCategories.push({
            title: "Portfolio",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
            links: portfolioLinks,
            count: getHeaderTotal(portfolioRes)
        });

        // --- BLOGS ---
        const blogLinks: DynamicLink[] = [
            { name: "All Blogs", url: "/blogs", is_primary: true, preview_style: 'blog' }
        ];
        postItems.forEach((item: { title: { rendered: string }; slug: string }) => {
            blogLinks.push({ name: item.title.rendered, url: `/blogs/${item.slug}`, preview_style: 'blog' });
        });

        dynamicCategories.push({
            title: "Blogs",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
            links: blogLinks,
            count: getHeaderTotal(postsRes)
        });

        // --- TIPS & TRICKS ---
        const tipsLinks: DynamicLink[] = [
            { name: "All Tips & Tricks", url: "/blogs?category=tips", is_primary: true, preview_style: 'blog' }
        ];
        tipsItems.forEach((item: { title: { rendered: string }; slug: string }) => {
            tipsLinks.push({ name: item.title.rendered, url: `/blogs/${item.slug}`, preview_style: 'blog' });
        });

        dynamicCategories.push({
            title: "Tips & Tricks",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
            links: tipsLinks,
            count: getHeaderTotal(tipsRes)
        });

        // --- TUTORIALS ---
        const tutorialLinks: DynamicLink[] = [
            { name: "All Tutorials", url: "/blogs?category=tutorials", is_primary: true, preview_style: 'blog' }
        ];
        tutorialItems.forEach((item: { title: { rendered: string }; slug: string }) => {
            tutorialLinks.push({ name: item.title.rendered, url: `/blogs/${item.slug}`, preview_style: 'blog' });
        });
        dynamicCategories.push({
            title: "Tutorials",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
            links: tutorialLinks,
            count: getHeaderTotal(tutorialsRes)
        });

        // --- SOURCE CODE ---
        const sourceLinks: DynamicLink[] = [
            { name: "All Source Code", url: "/blogs?category=source-code", is_primary: true, preview_style: 'code' }
        ];
        sourceItems.forEach((item: { title: { rendered: string }; slug: string }) => {
            sourceLinks.push({ name: item.title.rendered, url: `/blogs/${item.slug}`, preview_style: 'code' });
        });
        dynamicCategories.push({
            title: "Source Code",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
            links: sourceLinks,
            count: getHeaderTotal(sourceRes)
        });

        // --- TOOLBOX ---
        const toolboxLinks: DynamicLink[] = [
            { name: "All Tools", url: "/toolbox", is_primary: true, preview_style: 'tags' },
            { name: "Dev Stack", url: "/toolbox#development-stack", preview_style: 'tags' },
            { name: "Design Tools", url: "/toolbox#design-tools", preview_style: 'tags' },
            { name: "Productivity", url: "/toolbox#productivity-tools", preview_style: 'tags' },
            { name: "Hosting & Deploy", url: "/toolbox#hosting-tools", preview_style: 'tags' }
        ];
        dynamicCategories.push({
            title: "Toolbox",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
            links: toolboxLinks,
            count: getHeaderTotal(toolboxRes)
        });

        // --- FAQ ---
        const faqLinks: DynamicLink[] = [
            { name: "FAQ Page", url: "/faq", is_primary: true, preview_style: 'acc' },
            { name: "General FAQs", url: "/faq#general", preview_style: 'acc' },
            { name: "Services FAQs", url: "/faq#services", preview_style: 'acc' }
        ];
        dynamicCategories.push({
            title: "FAQ",
            icon_svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            links: faqLinks,
            count: getHeaderTotal(faqRes)
        });

        // 3. Update the ACF object with dynamic categories
        acf.sitemap_categories = dynamicCategories;

        return acf;

    } catch (error) {
        console.error("Error fetching sitemap page:", error);
        return null;
    }
}
