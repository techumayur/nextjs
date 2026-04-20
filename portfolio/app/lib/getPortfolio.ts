import { WPPortfolioItem, WPTaxonomy } from '@/types/acf';

export async function getPortfolioItems(page: number = 1, perPage: number = 6, taxonomyId?: number): Promise<WPPortfolioItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) return [];

  let url = `${baseUrl}/wp-json/wp/v2/portfolio?_embed&per_page=${perPage}&page=${page}&acf_format=standard`;
  if (taxonomyId) {
    url += `&portfolio-taxonomy[]=${taxonomyId}`;
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      if (res.status === 400) return []; 
      return [];
    }
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getPortfolioTaxonomies(): Promise<WPTaxonomy[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) return [];

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/portfolio-taxonomy?per_page=100`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function getTaxonomyBySlug(slug: string): Promise<WPTaxonomy | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) return null;

  const res = await fetch(`${baseUrl}/wp-json/wp/v2/portfolio-taxonomy?slug=${slug}`, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    console.error("Failed to fetch taxonomy by slug", res.status, res.statusText);
    return null;
  }
  const taxonomies = await res.json();
  return taxonomies.length > 0 ? taxonomies[0] : null;
}

export async function getPortfolioItemBySlug(slug: string): Promise<WPPortfolioItem | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined in .env");

  const url = `${baseUrl}/wp-json/wp/v2/portfolio?_embed&slug=${slug}&acf_format=standard`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    console.error("Failed to fetch portfolio item by slug", res.status, res.statusText);
    return null;
  }
  const items = await res.json();
  if (items.length === 0) return null;

  const item = items[0];
  // SERVER-SIDE MEDIA RESOLUTION: Resolve all media IDs into URLs
  return resolveAllPortfolioMedia(item, baseUrl);
}

async function resolveAllPortfolioMedia(item: WPPortfolioItem, baseUrl: string): Promise<WPPortfolioItem> {
  const mediaIds = new Set<number>();

  const acf = item.acf;
  if (!acf) return item;

  // 1. Brand Guidelines PDF
  if (typeof acf.brand_guidelines?.brand_guidelines_pdf === "number") mediaIds.add(acf.brand_guidelines.brand_guidelines_pdf);
  
  // 1.1 Banner Image
  if (typeof acf.banner_image === "number") mediaIds.add(acf.banner_image);

  // 2. Gallery Slides
  if (acf.gallery) {
    if (Array.isArray(acf.gallery)) {
      acf.gallery.forEach((s) => { if (typeof s.image === "number") mediaIds.add(s.image); });
    } else if (Array.isArray(acf.gallery.slides)) {
      acf.gallery.slides.forEach((s) => { if (typeof s.image === "number") mediaIds.add(s.image); });
    }
  }

  // 3. Technology Logos
  if (acf.technology_used) {
    if (Array.isArray(acf.technology_used)) {
      acf.technology_used.forEach((t) => { if (typeof t.logo === "number") mediaIds.add(t.logo); });
    } else if (Array.isArray(acf.technology_used.technologies)) {
      acf.technology_used.technologies.forEach((t) => { if (typeof t.logo === "number") mediaIds.add(t.logo); });
    }
  }

  // 4. Execution Steps
  if (Array.isArray(acf.execution_process?.steps)) {
    acf.execution_process.steps.forEach((s) => { if (typeof s.icon_image === "number") mediaIds.add(s.icon_image); });
  }

  // 5. Key Features Icons
  if (Array.isArray(acf.key_features?.features)) {
    acf.key_features.features.forEach((f) => { if (typeof f.icon_image === "number") mediaIds.add(f.icon_image); });
  }
  
  // 6. CTA Icons
  if (acf.cta) {
    if (typeof acf.cta.badge_icon === "number") mediaIds.add(acf.cta.badge_icon);
    if (Array.isArray(acf.cta.cards)) {
      acf.cta.cards.forEach((c) => { if (typeof c.icon === "number") mediaIds.add(c.icon); });
    }
  }

  // Resolve all discovered IDs in bulk
  const mediaMap = new Map<number, string>();
  if (mediaIds.size > 0) {
    try {
      const uniqueIds = Array.from(mediaIds).join(",");
      const mRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds}&per_page=100`, { next: { revalidate: 3600 } });
      if (mRes.ok) {
        const mData = await mRes.json();
        mData.forEach((m: any) => mediaMap.set(m.id, m.source_url));
      }
    } catch (e) {
      console.error(`Failed to resolve media in bulk:`, e);
    }
  }

  // Inject URLs back into the ACF object
  const getString = (val: string | number | null | undefined) => (typeof val === "number" ? mediaMap.get(val) || "" : (typeof val === "string" ? val : ""));

  if (item.acf) {
    if (typeof acf.brand_guidelines?.brand_guidelines_pdf === "number") acf.brand_guidelines.brand_guidelines_pdf = getString(acf.brand_guidelines.brand_guidelines_pdf);
    if (typeof acf.banner_image === "number") acf.banner_image = getString(acf.banner_image);
    
    if (acf.gallery) {
      if (Array.isArray(acf.gallery)) {
        acf.gallery = acf.gallery.map((s) => (typeof s.image === "number" ? { ...s, image: getString(s.image) } : s));
      } else if (Array.isArray(acf.gallery.slides)) {
        acf.gallery.slides = acf.gallery.slides.map((s) => (typeof s.image === "number" ? { ...s, image: getString(s.image) } : s));
      }
    }

    if (acf.technology_used) {
      if (Array.isArray(acf.technology_used)) {
        acf.technology_used = acf.technology_used.map((t) => (typeof t.logo === "number" ? { ...t, logo: getString(t.logo) } : t));
      } else if (Array.isArray(acf.technology_used.technologies)) {
        acf.technology_used.technologies = acf.technology_used.technologies.map((t) => (typeof t.logo === "number" ? { ...t, logo: getString(t.logo) } : t));
      }
    }

    if (Array.isArray(acf.execution_process?.steps)) {
      acf.execution_process.steps = acf.execution_process.steps.map((s) => (typeof s.icon_image === "number" ? { ...s, icon_image: getString(s.icon_image) } : s));
    }
    if (Array.isArray(acf.key_features?.features)) {
      acf.key_features.features = acf.key_features.features.map((f) => (typeof f.icon_image === "number" ? { ...f, icon_image: getString(f.icon_image) } : f));
    }

    if (acf.cta) {
      if (typeof acf.cta.badge_icon === "number") acf.cta.badge_icon = getString(acf.cta.badge_icon);
      if (Array.isArray(acf.cta.cards)) {
        acf.cta.cards = acf.cta.cards.map((c) => (typeof c.icon === "number" ? { ...c, icon: getString(c.icon) } : c));
      }
    }
  }

  return item;
}

export async function getAdjacentProjects(currentId: number): Promise<{ previous: WPPortfolioItem | null; next: WPPortfolioItem | null }> {
  const allProjects = await getPortfolioItems(1, 100); // Fetch a large batch to find neighbors
  const currentIndex = allProjects.findIndex(p => p.id === currentId);

  if (currentIndex === -1) return { previous: null, next: null };

  const previous = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const next = currentIndex > 0 ? allProjects[currentIndex - 1] : null;

  return { previous, next };
}
