import { WPPortfolioItem, WPTaxonomy } from '@/types/acf';
import { wpFetch, fetchMediaMap, resolveMedia } from './wpUtils';

export async function getPortfolioItems(page: number = 1, perPage: number = 6, taxonomyId?: number): Promise<WPPortfolioItem[]> {
  const params: Record<string, string | number> = {
    _embed: '',
    per_page: perPage,
    page: page,
    acf_format: 'standard'
  };

  if (taxonomyId) {
    params['portfolio-taxonomy[]'] = taxonomyId;
  }

  const items = await wpFetch<WPPortfolioItem[]>('/wp-json/wp/v2/portfolio', {
    params,
    fields: ['id', 'slug', 'title', 'acf', '_links', '_embedded']
  });

  return items || [];
}

export async function getPortfolioTaxonomies(): Promise<WPTaxonomy[]> {
  const taxonomies = await wpFetch<WPTaxonomy[]>('/wp-json/wp/v2/portfolio-taxonomy', {
    params: { per_page: 100 },
    fields: ['id', 'name', 'slug', 'count']
  });
  return taxonomies || [];
}

export async function getTaxonomyBySlug(slug: string): Promise<WPTaxonomy | null> {
  const taxonomies = await wpFetch<WPTaxonomy[]>('/wp-json/wp/v2/portfolio-taxonomy', {
    params: { slug }
  });
  return taxonomies && taxonomies.length > 0 ? taxonomies[0] : null;
}

export async function getPortfolioItemBySlug(slug: string): Promise<WPPortfolioItem | null> {
  const items = await wpFetch<WPPortfolioItem[]>('/wp-json/wp/v2/portfolio', {
    params: { slug, _embed: '', acf_format: 'standard' }
  });
  
  if (!items || items.length === 0) return null;

  return resolveAllPortfolioMedia(items[0]);
}

async function resolveAllPortfolioMedia(item: WPPortfolioItem): Promise<WPPortfolioItem> {
  const mediaIds: number[] = [];
  const acf = item.acf;
  if (!acf) return item;

  if (typeof acf.brand_guidelines?.brand_guidelines_pdf === "number") mediaIds.push(acf.brand_guidelines.brand_guidelines_pdf);
  if (typeof acf.banner_image === "number") mediaIds.push(acf.banner_image);

  if (acf.gallery) {
    const slides = Array.isArray(acf.gallery) ? acf.gallery : acf.gallery.slides;
    slides?.forEach((s: any) => { if (typeof s.image === "number") mediaIds.push(s.image); });
  }

  if (acf.technology_used) {
    const techs = Array.isArray(acf.technology_used) ? acf.technology_used : acf.technology_used.technologies;
    techs?.forEach((t: any) => { if (typeof t.logo === "number") mediaIds.push(t.logo); });
  }

  acf.execution_process?.steps?.forEach((s: any) => { if (typeof s.icon_image === "number") mediaIds.push(s.icon_image); });
  acf.key_features?.features?.forEach((f: any) => { if (typeof f.icon_image === "number") mediaIds.push(f.icon_image); });
  
  if (acf.cta) {
    if (typeof acf.cta.badge_icon === "number") mediaIds.push(acf.cta.badge_icon);
    acf.cta.cards?.forEach((c: any) => { if (typeof c.icon === "number") mediaIds.push(c.icon); });
  }

  const mediaMap = await fetchMediaMap(mediaIds);

  if (acf.brand_guidelines) acf.brand_guidelines.brand_guidelines_pdf = resolveMedia(acf.brand_guidelines.brand_guidelines_pdf, mediaMap);
  acf.banner_image = resolveMedia(acf.banner_image, mediaMap);
  
  if (acf.gallery) {
    if (Array.isArray(acf.gallery)) {
      acf.gallery.forEach((s: any) => { s.image = resolveMedia(s.image, mediaMap); });
    } else if (acf.gallery.slides) {
      acf.gallery.slides.forEach((s: any) => { s.image = resolveMedia(s.image, mediaMap); });
    }
  }

  if (acf.technology_used) {
    if (Array.isArray(acf.technology_used)) {
      acf.technology_used.forEach((t: any) => { t.logo = resolveMedia(t.logo, mediaMap); });
    } else if (acf.technology_used.technologies) {
      acf.technology_used.technologies.forEach((t: any) => { t.logo = resolveMedia(t.logo, mediaMap); });
    }
  }

  acf.execution_process?.steps?.forEach((s: any) => { s.icon_image = resolveMedia(s.icon_image, mediaMap); });
  acf.key_features?.features?.forEach((f: any) => { f.icon_image = resolveMedia(f.icon_image, mediaMap); });

  if (acf.cta) {
    acf.cta.badge_icon = resolveMedia(acf.cta.badge_icon, mediaMap);
    acf.cta.cards?.forEach((c: any) => { c.icon = resolveMedia(c.icon, mediaMap); });
  }

  return item;
}

export async function getAdjacentProjects(currentId: number): Promise<{ previous: WPPortfolioItem | null; next: WPPortfolioItem | null }> {
  const allProjects = await getPortfolioItems(1, 100);
  const currentIndex = allProjects.findIndex(p => p.id === currentId);

  if (currentIndex === -1) return { previous: null, next: null };

  return {
    previous: currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null,
    next: currentIndex > 0 ? allProjects[currentIndex - 1] : null,
  };
}
