import { ACFTipsPage, ACFImage } from "@/types/acf";

interface WPMedia {
  id: number;
  source_url: string;
}

export async function getTipsPage(): Promise<ACFTipsPage | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  try {
    // Fetch page by slug 'tips-and-tricks'
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=tips-and-tricks&_fields=acf`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const pages = await res.json();
    if (!pages || pages.length === 0) return null;

    const pageAcf: ACFTipsPage = pages[0].acf;

    // Return null if pageAcf is falsy or unexpectedly not an object
    if (!pageAcf || typeof pageAcf !== 'object' || Array.isArray(pageAcf)) {
        return null;
    }

    // Media Collection
    const mediaIds: number[] = [];
    if (pageAcf.banner) {
        if (typeof pageAcf.banner.sub_heading_image === 'number') mediaIds.push(pageAcf.banner.sub_heading_image);
        if (typeof pageAcf.banner.background_image === 'number') mediaIds.push(pageAcf.banner.background_image);
    }
    if (pageAcf.heading_section) {
        if (typeof pageAcf.heading_section.sub_heading_image === 'number') mediaIds.push(pageAcf.heading_section.sub_heading_image);
    }
    if (pageAcf.tips_section) {
        if (typeof pageAcf.tips_section.sub_heading_image === 'number') mediaIds.push(pageAcf.tips_section.sub_heading_image);
    }

    // Resolve Media
    if (mediaIds.length > 0) {
        const uniqueIds = [...new Set(mediaIds)];
        const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
            next: { revalidate: 3600 },
        });

        if (mediaRes.ok) {
            const mediaData: WPMedia[] = await mediaRes.json();
            const mediaMap: Record<number, string> = {};
            mediaData.forEach(m => { mediaMap[m.id] = m.source_url; });

            // Apply back
            if (pageAcf.banner) {
                if (typeof pageAcf.banner.sub_heading_image === 'number' && mediaMap[pageAcf.banner.sub_heading_image]) {
                    pageAcf.banner.sub_heading_image = mediaMap[pageAcf.banner.sub_heading_image];
                }
                if (typeof pageAcf.banner.background_image === 'number' && mediaMap[pageAcf.banner.background_image]) {
                    pageAcf.banner.background_image = mediaMap[pageAcf.banner.background_image];
                }
            }
            if (pageAcf.heading_section) {
                if (typeof pageAcf.heading_section.sub_heading_image === 'number' && mediaMap[pageAcf.heading_section.sub_heading_image]) {
                    pageAcf.heading_section.sub_heading_image = mediaMap[pageAcf.heading_section.sub_heading_image];
                }
            }
            if (pageAcf.tips_section) {
                if (typeof pageAcf.tips_section.sub_heading_image === 'number' && mediaMap[pageAcf.tips_section.sub_heading_image]) {
                    pageAcf.tips_section.sub_heading_image = mediaMap[pageAcf.tips_section.sub_heading_image];
                }
            }
        }
    }

    // Normalize Images
    const normalizeImage = (img: ACFImage | string | number | { url: string } | undefined): string => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object' && 'url' in img) return img.url;
        return '';
    };

    if (pageAcf.banner) {
        pageAcf.banner.sub_heading_image = normalizeImage(pageAcf.banner.sub_heading_image);
        pageAcf.banner.background_image = normalizeImage(pageAcf.banner.background_image);
    }
    if (pageAcf.heading_section) {
        pageAcf.heading_section.sub_heading_image = normalizeImage(pageAcf.heading_section.sub_heading_image);
    }
    if (pageAcf.tips_section) {
        pageAcf.tips_section.sub_heading_image = normalizeImage(pageAcf.tips_section.sub_heading_image);
    }

    return pageAcf;
  } catch (error) {
    console.error("Error fetching Tips and Tricks Page ACF:", error);
    return null;
  }
}
