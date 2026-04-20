import { WPBlogPost } from "@/types/acf";
import { WPBlogPostExtended } from "@/types/blogs";

export async function getBlogs(): Promise<WPBlogPost[]> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

    if (!baseUrl) {
        console.error("WP API URL not defined in .env");
        return [];
    }

    try {
        const res = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=6&_embed&_fields=id,slug,title,date,excerpt,acf,_links,_embedded`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("Blogs fetch error:", err);
        return [];
    }
}

/**
 * Fetch a single blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<WPBlogPostExtended | null> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    if (!baseUrl) throw new Error("WP API URL not defined in .env");

    const res = await fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const posts: WPBlogPostExtended[] = await res.json();
    return posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch adjacent blog posts for navigation.
 */
export async function getAdjacentBlogPosts(postId: number): Promise<{ previous: WPBlogPost | null; next: WPBlogPost | null }> {
    const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,title,featured_media,_links,_embedded&_embed`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) return { previous: null, next: null };

    const posts: WPBlogPost[] = await res.json();
    const currentIndex = posts.findIndex(p => p.id === postId);

    return {
        previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
        next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
}
