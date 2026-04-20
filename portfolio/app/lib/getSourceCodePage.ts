import { ACFSourceCodePage } from "@/types/acf";

interface WPMedia {
    id: number;
    source_url: string;
}

export async function getSourceCodePage(): Promise<ACFSourceCodePage | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return null;

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=source-code&_embed`, {
            next: { revalidate: 3600 }
        });
        if (res.ok) {
            const pages = await res.json();
            if (pages.length > 0) {
                const pageAcf = pages[0].acf;
                const mediaIds: number[] = [];

                // Collect Media IDs from fields
                if (pageAcf.banner) {
                    if (typeof pageAcf.banner.bg_image === 'number') mediaIds.push(pageAcf.banner.bg_image);
                    if (typeof pageAcf.banner.background_image === 'number') mediaIds.push(pageAcf.banner.background_image);
                    if (typeof pageAcf.banner.sub_heading_image === 'number') mediaIds.push(pageAcf.banner.sub_heading_image);
                    if (typeof pageAcf.banner.banner_image === 'number') mediaIds.push(pageAcf.banner.banner_image);
                }

                if (pageAcf.intro_section && typeof pageAcf.intro_section.sub_heading_image === 'number') {
                    mediaIds.push(pageAcf.intro_section.sub_heading_image);
                }
                if (pageAcf.featured_section && typeof pageAcf.featured_section.sub_heading_image === 'number') {
                    mediaIds.push(pageAcf.featured_section.sub_heading_image);
                }

                // Resolve Media IDs if any
                if (mediaIds.length > 0) {
                    const uniqueIds = [...new Set(mediaIds)];
                    const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
                        next: { revalidate: 3600 },
                    });
                    if (mediaRes.ok) {
                        const mediaData: WPMedia[] = await mediaRes.json();
                        const mediaMap: Record<number, string> = {};
                        mediaData.forEach(m => { mediaMap[m.id] = m.source_url; });

                        // Apply URLs back
                        if (pageAcf.banner) {
                            if (typeof pageAcf.banner.bg_image === 'number') pageAcf.banner.bg_image = mediaMap[pageAcf.banner.bg_image] || "";
                            if (typeof pageAcf.banner.background_image === 'number') pageAcf.banner.background_image = mediaMap[pageAcf.banner.background_image] || "";
                            if (typeof pageAcf.banner.sub_heading_image === 'number') pageAcf.banner.sub_heading_image = mediaMap[pageAcf.banner.sub_heading_image] || "";
                            if (typeof pageAcf.banner.banner_image === 'number') pageAcf.banner.banner_image = mediaMap[pageAcf.banner.banner_image] || "";
                        }
                        if (pageAcf.intro_section && typeof pageAcf.intro_section.sub_heading_image === 'number') {
                            pageAcf.intro_section.sub_heading_image = mediaMap[pageAcf.intro_section.sub_heading_image] || "";
                        }
                        if (pageAcf.featured_section && typeof pageAcf.featured_section.sub_heading_image === 'number') {
                            pageAcf.featured_section.sub_heading_image = mediaMap[pageAcf.featured_section.sub_heading_image] || "";
                        }
                    }
                }

                return pageAcf as ACFSourceCodePage;
            }
        }
    } catch (error) {
        console.error("Error fetching Source Code page data:", error);
    }
    return null;
}
