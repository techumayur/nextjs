import { ACFImage } from "@/types/acf";

export interface LegalPageData {
    acf: {
        banner_sub_heading_image: ACFImage;
        banner_sub_heading: string;
        banner_heading: string;
        banner_content: string;
        last_updated: string;
        background_image: ACFImage;
        content: string;
    };
    title: { rendered: string };
    slug: string;
}

interface WPMedia {
    id: number;
    source_url: string;
}

function resolveMedia(val: ACFImage | undefined, mediaMap: Record<number, string>): string {
    if (typeof val === "number") return mediaMap[val] ?? "";
    if (typeof val === "object" && val !== null && "url" in val) return val.url;
    if (typeof val === "string") return val;
    return "";
}

export async function getLegalPage(slug: string): Promise<LegalPageData | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) throw new Error("WP API URL is missing");

    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=${slug}&_embed`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const pages = await res.json();
    if (!pages || pages.length === 0) return null;

    const page = pages[0] as LegalPageData;
    const acf = page.acf;

    if (!acf) return page;

    // Collect Media IDs
    const mediaIds: number[] = [];
    if (typeof acf.banner_sub_heading_image === "number") mediaIds.push(acf.banner_sub_heading_image);
    if (typeof acf.background_image === "number") mediaIds.push(acf.background_image);

    // Resolve Media
    const mediaMap: Record<number, string> = {};
    if (mediaIds.length > 0) {
        const uniqueIds = [...new Set(mediaIds)];
        try {
            const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}`, { next: { revalidate: 3600 } });
            if (mediaRes.ok) {
                const mediaData: WPMedia[] = await mediaRes.json();
                mediaData.forEach(m => mediaMap[m.id] = m.source_url);
            }
        } catch (e) {
            console.error("Error resolving legal page media:", e);
        }
    }

    // Apply resolved URLs
    acf.banner_sub_heading_image = resolveMedia(acf.banner_sub_heading_image, mediaMap);
    acf.background_image = resolveMedia(acf.background_image, mediaMap);

    return page;
}
