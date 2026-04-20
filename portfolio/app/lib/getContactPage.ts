import { ACFContactPage, ContactPageData } from "@/types/acf";

export async function getContactPage() {
  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const contactPageId = process.env.CONTACT_PAGE_ID || 1406; // Standard practice to put ID in env or use a known one.

  if (!wpApiUrl) {
    console.error("WP API URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${wpApiUrl}/wp-json/wp/v2/pages/${contactPageId}?acf_format=standard`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
        console.warn(`Contact Page ID ${contactPageId} not found, falling back to slug: contact`);
        // Fallback to slug-based fetch if ID fails
        const slugs = ['contact', 'contact-me', 'get-in-touch'];
        for (const slug of slugs) {
            const slugRes = await fetch(`${wpApiUrl}/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`, {
                next: { revalidate: 3600 }
            });
            if (slugRes.ok) {
                const list = await slugRes.json();
                if (list.length > 0) {
                    return resolveMedia(list[0].acf || {}, wpApiUrl);
                }
            }
        }
        console.error("Contact page not found by ID or Slug.");
        
        // Help the developer find the correct page by listing all pages
        try {
            const allPagesRes = await fetch(`${wpApiUrl}/wp-json/wp/v2/pages?_fields=id,slug,title`, { next: { revalidate: 3600 } });
            if (allPagesRes.ok) {
                const pages = await allPagesRes.json();
                
                // pages.forEach((p: { id: number; slug: string; title?: { rendered: string } }) => {
                //     console.log(`- ${p.title?.rendered || p.slug} (ID: ${p.id})`);
                // });
                
                
            }
        } catch {
            console.error("Failed to list pages for debugging.");
        }

        return null;
    }

    const data: ContactPageData = await res.json();
    const acf = data.acf;

    if (!acf || Object.keys(acf).length === 0) {
        console.warn("Contact page ACF is empty.");
        return null;
    }

    return resolveMedia(acf, wpApiUrl);
  } catch (error) {
    console.error("Error fetching Contact page data:", error);
    return null;
  }
}

async function resolveMedia(acf: ACFContactPage, wpApiUrl: string): Promise<ACFContactPage> {
  const mediaIds: number[] = [];
  
  if (acf.contact_banner && typeof acf.contact_banner.background_image === "number") {
    mediaIds.push(acf.contact_banner.background_image);
  }

  const mediaMap = new Map<number, string>();
  if (mediaIds.length > 0) {
    await Promise.all(mediaIds.map(async (id) => {
      try {
        const mRes = await fetch(`${wpApiUrl}/wp-json/wp/v2/media/${id}`, { next: { revalidate: 3600 } });
        if (mRes.ok) {
          const mData = await mRes.json();
          mediaMap.set(id, mData.source_url);
        }
      } catch (err) {
        console.error(`Error resolving media ID ${id}:`, err);
      }
    }));
  }

  const resolve = (field: string | number | { url?: string } | null | undefined): string => {
    if (typeof field === "number") return mediaMap.get(field) || "";
    if (field && typeof field === "object" && "url" in field) return (field as { url?: string }).url || "";
    return typeof field === "string" ? field : "";
  };

  const clean = (html: unknown): string => {
    if (typeof html !== "string") return "";
    return html
      .replace(/^<p>/, "").replace(/<\/p>\s*$/, "")
      .replace(/^<h[1-6][^>]*>/, "").replace(/<\/h[1-6]>\s*$/, "")
      .trim();
  };

  return {
    ...acf,
    contact_banner: acf.contact_banner ? {
      ...acf.contact_banner,
      sub_heading: clean(acf.contact_banner.sub_heading),
      heading: clean(acf.contact_banner.heading),
      description: clean(acf.contact_banner.description),
      background_image: resolve(acf.contact_banner.background_image)
    } : undefined,
    contact_hero: acf.contact_hero ? {
        ...acf.contact_hero,
        badge_icon: resolve(acf.contact_hero.badge_icon || acf.contact_hero.sub_heading_icon || acf.contact_hero.sub_heading_image),
        title: clean(acf.contact_hero.title),
        description: clean(acf.contact_hero.description),
        feature_pills: Array.isArray(acf.contact_hero.feature_pills) ? acf.contact_hero.feature_pills.map(pill => ({
            ...pill,
            icon_type: resolve(pill.icon_type)
        })) : [],
        info_cards: Array.isArray(acf.contact_hero.info_cards) ? acf.contact_hero.info_cards.map(card => ({
            ...card,
            icon_svg: resolve(card.icon_svg),
            title: clean(card.title),
            description: clean(card.description)
        })) : []
    } : undefined,
    contact_form: acf.contact_form ? {
        ...acf.contact_form,
        sub_heading: clean(acf.contact_form.sub_heading),
        title: clean(acf.contact_form.title),
        description: clean(acf.contact_form.description)
    } : undefined,
    social_buzz: (acf.social_buzz || acf.contact_social_buzz) ? {
        ...(acf.social_buzz || acf.contact_social_buzz),
        sub_heading: (acf.social_buzz || acf.contact_social_buzz)!.sub_heading,
        sub_heading_icon: resolve((acf.social_buzz || acf.contact_social_buzz)!.sub_heading_icon || (acf.social_buzz || acf.contact_social_buzz)!.sub_heading_image),
        title: clean((acf.social_buzz || acf.contact_social_buzz)!.title),
        description: clean((acf.social_buzz || acf.contact_social_buzz)!.description),
        social_links: Array.isArray((acf.social_buzz || acf.contact_social_buzz)!.social_links)
            ? (acf.social_buzz || acf.contact_social_buzz)!.social_links.map((link: { platform: string; url: string; icon_svg?: string; icon?: string | number | { url?: string } }) => ({
                ...link,
                icon: resolve(link.icon)
            })) : []
    } : undefined,
    cta: (acf.cta || acf.contact_cta) ? {
        ...(acf.cta || acf.contact_cta),
        sub_heading_icon: resolve((acf.cta || acf.contact_cta)!.sub_heading_icon || (acf.cta || acf.contact_cta)!.sub_heading_image),
        title: clean((acf.cta || acf.contact_cta)!.title),
        description: clean((acf.cta || acf.contact_cta)!.description),
        stats_grid: Array.isArray((acf.cta || acf.contact_cta)!.stats_grid) 
            ? (acf.cta || acf.contact_cta)!.stats_grid!.map((s: { icon: string | number | { url?: string } }) => ({ ...s, icon: resolve(s.icon) })) : [],
        seo_links: Array.isArray((acf.cta || acf.contact_cta)!.seo_links) 
            ? (acf.cta || acf.contact_cta)!.seo_links!.map((l: { icon: string | number | { url?: string } }) => ({ ...l, icon: resolve(l.icon) })) : [],
    } : undefined
  } as ACFContactPage;
}
