import { WPBlogPost, WPTutorialTaxonomy, WPTutorial } from "@/types/acf";

export async function getTips(): Promise<WPBlogPost[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    throw new Error("WP API URL not defined in .env");
  }

  try {
      const res = await fetch(`${baseUrl}/wp-json/wp/v2/tips-and-trick?per_page=100&_embed`, {
        next: { revalidate: 3600 },
      });

      if (!res.ok) return [];
      return await res.json();
  } catch (error) {
      console.error("Error fetching tips-and-trick:", error);
      return [];
  }
}

export async function getTipBySlug(slug: string): Promise<WPBlogPost | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/tips-and-trick?slug=${slug}&_embed`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const tips = await res.json();
    return tips.length > 0 ? tips[0] : null;
  } catch (err) {
    console.error("Error fetching tip by slug:", err);
    return null;
  }
}

export async function getTutorials(): Promise<WPTutorial[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) return [];

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/tutorial?_embed&per_page=100`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (err) {
    console.error("Error fetching tutorials:", err);
    return [];
  }
}

export async function getTipsTaxonomies(): Promise<WPTutorialTaxonomy[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined");

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/tips-and-trick-taxonomy?per_page=100`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching tips taxonomies:", err);
    return [];
  }
}

export async function getTipsTags(): Promise<WPTutorialTaxonomy[]> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) return [];

  try {
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/tips-and-trick-tags?per_page=100`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching tips tags:", err);
    return [];
  }
}

export async function getAdjacentTips(currentId: number): Promise<{ previous: WPBlogPost | null; next: WPBlogPost | null }> {
    const allTips = await getTips();
    const currentIndex = allTips.findIndex(tip => tip.id === currentId);
    
    return {
        previous: currentIndex > 0 ? allTips[currentIndex - 1] : null,
        next: currentIndex < allTips.length - 1 ? allTips[currentIndex + 1] : null
    };
}
