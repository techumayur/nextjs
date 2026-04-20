import { WPSourceCodeItem, WPSourceCodeTaxonomy } from "@/types/acf";

export async function getSourceCode(): Promise<WPSourceCodeItem[]> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return [];

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code?per_page=100&_embed&acf_format=standard`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Error fetching source code:", error);
    }
    return [];
}

export async function getSourceCodeTaxonomies(): Promise<WPSourceCodeTaxonomy[]> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return [];

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code-taxonomy?per_page=100`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Error fetching source code taxonomies:", error);
    }
    return [];
}

export async function getSourceCodeTags(): Promise<WPSourceCodeTaxonomy[]> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return [];

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code-tag?per_page=100`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Error fetching source code tags:", error);
    }
    return [];
}
export async function getSourceCodeBySlug(slug: string): Promise<WPSourceCodeItem | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return null;

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code?slug=${slug}&_embed&acf_format=standard`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            const data = await res.json();
            if (data[0]) return data[0];
        }

        // Fallback: Check if it's a "page" instead of "source-code"
        const pageRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=${slug}&_embed&acf_format=standard`, {
            next: { revalidate: 60 }
        });
        if (pageRes.ok) {
            const pageData = await pageRes.json();
            return pageData[0] || null;
        }
    } catch (error) {
        console.error(`Error fetching source code by slug ${slug}:`, error);
    }
    return null;
}

export async function getAdjacentSourceCodes(id: number) {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) return { previous: null, next: null };

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code?per_page=100`, {
            next: { revalidate: 86400 } // Revalidate once a day
        });
        
        if (res.ok) {
            const allItems: WPSourceCodeItem[] = await res.json();
            const index = allItems.findIndex(item => item.id === id);
            
            if (index !== -1) {
                return {
                    previous: index > 0 ? allItems[index - 1] : null,
                    next: index < allItems.length - 1 ? allItems[index + 1] : null
                };
            }
        }
    } catch (error) {
        console.error("Error fetching adjacent source codes:", error);
    }
    return { previous: null, next: null };
}

export async function getRelatedSourceCode(currentId: number, categoryIds: number[]): Promise<WPSourceCodeItem[]> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl || categoryIds.length === 0) return [];

    try {
        const categories = categoryIds.join(',');
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/source-code?source-code-taxonomy=${categories}&per_page=4&exclude=${currentId}&_embed&acf_format=standard`, {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Error fetching related source code:", error);
    }
    return [];
}
