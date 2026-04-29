import { WPTutorial, WPTutorialTaxonomy } from "@/types/acf";
import { wpFetch, resolveMedia } from "./wpUtils";

export async function getTutorials(): Promise<WPTutorial[]> {
  const tutorials = await wpFetch<WPTutorial[]>('/wp-json/wp/v2/tutorial', {
    params: { _embed: '', per_page: 100 }
  });

  if (!tutorials) return [];
  
  // Resolve featured media for thumbnail if ACF thumbnail is missing
  tutorials.forEach(tutorial => {
      if (!tutorial.acf || Array.isArray(tutorial.acf)) {
          tutorial.acf = {} as WPTutorial['acf'];
      }
      
      const acf = tutorial.acf;
      if (!acf.thumbnail) {
          const featuredMedia = (tutorial as unknown as { _embedded?: { 'wp:featuredmedia'?: { source_url: string }[] } })._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          if (featuredMedia) {
              acf.thumbnail = featuredMedia;
          }
      } else {
          acf.thumbnail = resolveMedia(acf.thumbnail, {});
      }
  });

  return tutorials;
}

export async function getTutorialTaxonomies(): Promise<WPTutorialTaxonomy[]> {
  const taxonomies = await wpFetch<WPTutorialTaxonomy[]>('/wp-json/wp/v2/tutorials-taxonomy', {
    params: { per_page: 100 }
  });

  if (!taxonomies) return [];

  // Resolve ACF icons
  taxonomies.forEach(tax => {
    if (tax.acf?.icon) {
        tax.acf.icon = resolveMedia(tax.acf.icon, {});
    }
  });

  return taxonomies;
}

export async function getTutorialTags(): Promise<WPTutorialTaxonomy[]> {
  const tags = await wpFetch<WPTutorialTaxonomy[]>('/wp-json/wp/v2/tutorials-tag', {
    params: { per_page: 100 }
  });
  return tags || [];
}
