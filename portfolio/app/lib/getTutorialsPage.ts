import { TutorialsPageData, ACFTutorialsPage, ACFImage } from "@/types/acf";

interface WPMedia {
  id: number;
  source_url: string;
}

export async function getTutorialsPage(): Promise<ACFTutorialsPage | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  try {
    // Fetch page by slug 'tutorials'
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=tutorials&_fields=acf`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const pages = await res.json();
    if (!pages || pages.length === 0) return null;

    const data: TutorialsPageData = pages[0];
    const pageAcf: ACFTutorialsPage = data.acf;

    // Return null if pageAcf is falsy or unexpectedly not an object
    if (!pageAcf || typeof pageAcf !== 'object' || Array.isArray(pageAcf)) {
        return null;
    }

    // Media Collection
    const mediaIds: number[] = [];
    if (pageAcf.banner) {
        if (typeof pageAcf.banner.sub_heading_icon === 'number') mediaIds.push(pageAcf.banner.sub_heading_icon);
        if (typeof pageAcf.banner.background_image === 'number') mediaIds.push(pageAcf.banner.background_image);
    }
    if (pageAcf.sidebar_cards) {
        pageAcf.sidebar_cards.forEach((card: { icon: string | number | { url: string } }) => {
            if (typeof card.icon === 'number') mediaIds.push(card.icon);
        });
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
                if (typeof pageAcf.banner.sub_heading_icon === 'number' && mediaMap[pageAcf.banner.sub_heading_icon]) {
                    pageAcf.banner.sub_heading_icon = mediaMap[pageAcf.banner.sub_heading_icon];
                }
                if (typeof pageAcf.banner.background_image === 'number' && mediaMap[pageAcf.banner.background_image]) {
                    pageAcf.banner.background_image = mediaMap[pageAcf.banner.background_image];
                }
            }
            if (pageAcf.sidebar_cards) {
                pageAcf.sidebar_cards.forEach((card: { icon: string | number | { url: string } }) => {
                   if (typeof card.icon === 'number' && mediaMap[card.icon]) {
                       card.icon = mediaMap[card.icon];
                   }
                });
            }
        }
    }

    // Normalize Images
    const normalizeImage = (img: ACFImage): string => {
        if (typeof img === 'string') return img;
        if (img && typeof img === 'object' && 'url' in img) return img.url;
        return '';
    };

    if (pageAcf.banner) {
        pageAcf.banner.sub_heading_icon = normalizeImage(pageAcf.banner.sub_heading_icon);
        pageAcf.banner.background_image = normalizeImage(pageAcf.banner.background_image);
    }

    return pageAcf;
  } catch (error) {
    console.error("Error fetching Tutorials Page ACF:", error);
    return null;
  }
}
