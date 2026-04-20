import { ToolboxPageData } from "@/types/toolbox";
import { ACFImage } from "@/types/acf";

interface WPMedia {
  id: number;
  source_url: string;
}

function resolveMedia(
  val: ACFImage | undefined,
  mediaMap: Record<number, string>
): ACFImage {
  if (typeof val === "number") return mediaMap[val] ?? "";
  if (typeof val === "object" && val !== null && "url" in val) return val.url;
  if (typeof val === "string") return val;
  return "";
}

export async function getToolboxData(): Promise<ToolboxPageData | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) throw new Error("WP API URL not defined in .env");

    // Fetch the page with slug 'toolbox' and include ACF fields
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=toolbox&_embed`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const pages: ToolboxPageData[] = await res.json();
    if (pages.length === 0) return null;

    const page = pages[0];
    const acf = page.acf;

    if (!acf) return page;

    // Collect Media IDs for batch resolution
    const mediaIds: number[] = [];
    
    if (typeof acf.banner?.background_image === 'number') {
        mediaIds.push(acf.banner.background_image);
    }

    if (typeof acf.banner?.sub_heading_icon === 'number') {
        mediaIds.push(acf.banner.sub_heading_icon);
    }
    
    acf.development_stack?.tools?.forEach(tool => {
        if (typeof tool.icon === 'number') mediaIds.push(tool.icon);
    });
    
    acf.design_creativity?.tools?.forEach(tool => {
        if (typeof tool.icon === 'number') mediaIds.push(tool.icon);
    });
    
    acf.productivity_collaboration?.tools?.forEach(tool => {
        if (typeof tool.icon === 'number') mediaIds.push(tool.icon);
    });
    
    acf.hosting_deployment?.platforms?.forEach(platform => {
        if (typeof platform.icon === 'number') mediaIds.push(platform.icon);
    });
    
    acf.bonus_tools?.tools?.forEach(tool => {
        if (typeof tool.icon === 'number') mediaIds.push(tool.icon);
    });

    if (typeof acf.cta?.badge_icon === 'number') {
        mediaIds.push(acf.cta.badge_icon);
    }
    acf.cta?.visual_cards?.forEach(card => {
        if (typeof card.icon === 'number') mediaIds.push(card.icon);
    });

    // Batch resolve media IDs to URLs
    const mediaMap: Record<number, string> = {};
    if (mediaIds.length > 0) {
        const uniqueIds = [...new Set(mediaIds)];
        try {
            const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
                next: { revalidate: 3600 },
            });
            if (mediaRes.ok) {
                const mediaData: WPMedia[] = await mediaRes.json();
                mediaData.forEach((m) => {
                    mediaMap[m.id] = m.source_url;
                });
            }
        } catch (error) {
            console.error("Error batch resolving toolbox media:", error);
        }
    }

    // Apply resolved URLs back to the ACF object
    if (acf.banner) {
        acf.banner.background_image = resolveMedia(acf.banner.background_image, mediaMap);
        acf.banner.sub_heading_icon = resolveMedia(acf.banner.sub_heading_icon, mediaMap);
    }
    
    acf.development_stack?.tools?.forEach(tool => {
        tool.icon = resolveMedia(tool.icon, mediaMap);
    });
    
    acf.design_creativity?.tools?.forEach(tool => {
        tool.icon = resolveMedia(tool.icon, mediaMap);
    });
    
    acf.productivity_collaboration?.tools?.forEach(tool => {
        tool.icon = resolveMedia(tool.icon, mediaMap);
    });
    
    acf.hosting_deployment?.platforms?.forEach(platform => {
        platform.icon = resolveMedia(platform.icon, mediaMap);
    });
    
    if (acf.cta) {
        acf.cta.badge_icon = resolveMedia(acf.cta.badge_icon, mediaMap);
        acf.cta.visual_cards?.forEach(card => {
            card.icon = resolveMedia(card.icon, mediaMap);
        });
    }

    acf.bonus_tools?.tools?.forEach(tool => {
        tool.icon = resolveMedia(tool.icon, mediaMap);
    });

    return page;
}
