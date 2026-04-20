import { WPTutorial, WPTutorialTaxonomy } from "@/types/acf";

export async function getTutorials(): Promise<WPTutorial[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  const res = await fetch(`${baseUrl}/wp-json/wp/v2/tutorial?_embed&per_page=100`, {
        next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const tutorials: WPTutorial[] = await res.json();
  
  // Resolve featured media for thumbnail if ACF thumbnail is missing
  tutorials.forEach(tutorial => {
      // Ensure acf exists and is an object
      if (!tutorial.acf || Array.isArray(tutorial.acf)) {
          tutorial.acf = {} as WPTutorial['acf'];
      }
      
      const acf = tutorial.acf;
      if (!acf.thumbnail) {
          const featuredMedia = (tutorial as unknown as { _embedded?: { 'wp:featuredmedia'?: { source_url: string }[] } })._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          if (featuredMedia) {
              acf.thumbnail = featuredMedia;
          }
      } else if (typeof acf.thumbnail === 'object' && acf.thumbnail && (acf.thumbnail as { url: string }).url) {
          acf.thumbnail = (acf.thumbnail as { url: string }).url;
      }
  });

  return tutorials;
}

export async function getTutorialTaxonomies(): Promise<WPTutorialTaxonomy[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  const res = await fetch(`${baseUrl}/wp-json/wp/v2/tutorials-taxonomy?per_page=100`, {
        next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const taxonomies: WPTutorialTaxonomy[] = await res.json();

  // Resolve ACF icons
  taxonomies.forEach(tax => {
    if (tax.acf?.icon && typeof tax.acf.icon === 'object' && tax.acf.icon && (tax.acf.icon as { url: string }).url) {
        tax.acf.icon = (tax.acf.icon as { url: string }).url;
    }
  });

  return taxonomies;
}

export async function getTutorialTags(): Promise<WPTutorialTaxonomy[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  // Fetch 'tutorials-tag' taxonomy
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/tutorials-tag?per_page=100`, {
        next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const tags: WPTutorialTaxonomy[] = await res.json();
  return tags;
}
