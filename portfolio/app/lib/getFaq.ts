import { ACFFaqPage, ACFImage } from "@/types/acf";

export interface WPFaqPost {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    "faq-taxonomy": number[]; // Array of category IDs
    acf?: Record<string, unknown>;
}

export interface WPFaqCategory {
    id: number;
    name: string;
    description: string;
    slug: string;
    count: number;
    acf?: {
        icon_svg?: string;
    }
}

export interface FaqDynamicData {
    categories: {
        id: number;
        title: string;
        icon_svg: string;
        faqs: {
            id: number;
            question: string;
            answer: string;
        }[];
    }[];
    acf?: ACFFaqPage;
}

interface WPMedia {
    id: number;
    source_url: string;
}

function resolveMedia(val: ACFImage | undefined, mediaMap: Record<number, string>): ACFImage {
    if (typeof val === 'number') return mediaMap[val] ?? '';
    if (typeof val === 'object' && val !== null && 'url' in val) return val.url;
    if (typeof val === 'string') return val;
    return '';
}

export async function getFaqData(): Promise<FaqDynamicData> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) throw new Error("WP API URL not defined");

    try {
        // 1. Fetch the FAQ page (for Banner, Intro, CTA)
        const pageRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=faq&_embed`, { next: { revalidate: 3600 } });
        const pages = await pageRes.json();
        const pageAcf = pages?.[0]?.acf as ACFFaqPage;

        // 2. Fetch all FAQ categories (faq-taxonomy)
        const catRes = await fetch(`${baseUrl}/wp-json/wp/v2/faq-taxonomy?per_page=100`, { next: { revalidate: 3600 } });
        const categories: WPFaqCategory[] = catRes.ok ? await catRes.json() : [];

        // 3. Fetch all FAQ posts
        const postRes = await fetch(`${baseUrl}/wp-json/wp/v2/faq?per_page=100`, { next: { revalidate: 3600 } });
        const faqPosts: WPFaqPost[] = postRes.ok ? await postRes.json() : [];

        // 4. Resolve Media IDs in page ACF if needed
        let resolvedAcf = pageAcf;
        if (pageAcf) {
            const mediaIds: number[] = [];
            if (typeof pageAcf.banner?.background_image === 'number') mediaIds.push(pageAcf.banner.background_image);
            if (typeof pageAcf.banner?.sub_heading_icon === 'number') mediaIds.push(pageAcf.banner.sub_heading_icon as number);
            if (typeof pageAcf.banner?.sub_heading_image === 'number') mediaIds.push(pageAcf.banner.sub_heading_image as number);
            
            if (typeof pageAcf.intro?.sub_heading_icon === 'number') mediaIds.push(pageAcf.intro.sub_heading_icon as number);
            if (typeof pageAcf.intro?.sub_heading_image === 'number') mediaIds.push(pageAcf.intro.sub_heading_image as number);

            if (typeof pageAcf.cta?.badge_icon === 'number') mediaIds.push(pageAcf.cta.badge_icon as number);
            if (typeof pageAcf.cta?.badge_image === 'number') mediaIds.push(pageAcf.cta.badge_image as number);

            pageAcf.cta?.info_items?.forEach(item => {
                if (typeof item.icon === 'number') mediaIds.push(item.icon);
            });

            if (mediaIds.length > 0) {
                const uniqueIds = [...new Set(mediaIds)];
                try {
                    const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, { next: { revalidate: 3600 } });
                    if (mediaRes.ok) {
                        const mediaData: WPMedia[] = await mediaRes.json();
                        const mediaMap: Record<number, string> = {};
                        mediaData.forEach(m => mediaMap[m.id] = m.source_url);

                        resolvedAcf = {
                            ...pageAcf,
                            banner: {
                                ...pageAcf.banner,
                                background_image: resolveMedia(pageAcf.banner.background_image, mediaMap) as any,
                                sub_heading_icon: resolveMedia(pageAcf.banner.sub_heading_icon || pageAcf.banner.sub_heading_image, mediaMap) as any
                            },
                            intro: pageAcf.intro ? {
                                ...pageAcf.intro,
                                sub_heading_icon: resolveMedia(pageAcf.intro.sub_heading_icon || pageAcf.intro.sub_heading_image, mediaMap) as any
                            } : undefined as any,
                            cta: pageAcf.cta ? {
                                ...pageAcf.cta,
                                badge_icon: resolveMedia(pageAcf.cta.badge_icon || pageAcf.cta.badge_image, mediaMap) as any,
                                info_items: pageAcf.cta.info_items?.map(item => ({
                                    ...item,
                                    icon: resolveMedia(item.icon, mediaMap)
                                }))
                            } : undefined as any
                        };
                    }
                } catch (e) { console.error("Error resolving FAQ media:", e); }
            }
        }

        // 5. Map posts to categories
        const dynamicCategories = categories
            .filter(cat => cat.count > 0 || cat.acf?.icon_svg) // Show categories with items or specific icons
            .map(cat => {
                const categoryPosts = faqPosts.filter(post => 
                    post["faq-taxonomy"]?.includes(cat.id)
                );

                return {
                    id: cat.id,
                    title: cat.name,
                    icon_svg: cat.acf?.icon_svg || `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
                    faqs: categoryPosts.map(post => ({
                        id: post.id,
                        question: post.title.rendered,
                        answer: post.content.rendered
                    }))
                };
            });

        return { 
            categories: dynamicCategories,
            acf: resolvedAcf
        };
    } catch (error) {
        console.error("Error fetching FAQ data:", error);
        return { categories: [] };
    }
}
