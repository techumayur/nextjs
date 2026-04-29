import { WPBlogPost } from "@/types/acf";
import { WPBlogPostExtended } from "@/types/blogs";
import { wpFetch } from "./wpUtils";

export async function getBlogs(): Promise<WPBlogPost[]> {
    const items = await wpFetch<WPBlogPost[]>('/wp-json/wp/v2/posts', {
        params: { per_page: 6, _embed: '' },
        fields: ['id', 'slug', 'title', 'date', 'excerpt', 'acf', '_links', '_embedded']
    });
    return items || [];
}

/**
 * Fetch a single blog post by its slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<WPBlogPostExtended | null> {
    const posts = await wpFetch<WPBlogPostExtended[]>('/wp-json/wp/v2/posts', {
        params: { slug, _embed: '' }
    });
    return posts && posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch adjacent blog posts for navigation.
 */
export async function getAdjacentBlogPosts(postId: number): Promise<{ previous: WPBlogPost | null; next: WPBlogPost | null }> {
    const posts = await wpFetch<WPBlogPost[]>('/wp-json/wp/v2/posts', {
        params: { per_page: 100, _embed: '' },
        fields: ['id', 'slug', 'title', 'featured_media', '_links', '_embedded']
    });

    if (!posts) return { previous: null, next: null };

    const currentIndex = posts.findIndex(p => p.id === postId);

    return {
        previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
        next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
}
