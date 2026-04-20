import { ACFImage } from "@/types/acf";
import type {
  BlogPageData,
  ACFBlogPageSettings,
  ACFBlogInsightsSection,
  ACFBlogLatestSection,
  ACFBlogListSection,
  WPBlogPostExtended,
} from "@/types/blogs";

interface WPMedia {
  id: number;
  source_url: string;
}

// ─── Resolve media ID / object / string → URL string ────────────────────────
function resolveMedia(
  val: string | number | { url: string } | undefined,
  mediaMap: Record<number, string>
): string {
  if (typeof val === "number") return mediaMap[val] ?? "";
  if (typeof val === "object" && val !== null && "url" in val) return val.url;
  if (typeof val === "string") return val;
  return "";
}

// ─── Main fetcher ────────────────────────────────────────────────────────────
export async function getBlogsPage(): Promise<{
  pageData: BlogPageData;
  posts: WPBlogPostExtended[];
  categories: { id: number; name: string; slug: string; count: number }[];
  tags: { id: number; name: string; slug: string; count: number }[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (!baseUrl) throw new Error("WP API URL not defined in .env");

  // ── 1. Fetch the blogs page ACF — groups are nested under their group field names ──
  // ACF Group-type field structure: acf.banner_section.banner_title, acf.insights_section.heading etc.
  const pageRes = await fetch(
    `${baseUrl}/wp-json/wp/v2/pages?slug=blogs&_fields=acf`,
    { next: { revalidate: 3600 } }
  );

  let rawAcf: Record<string, unknown> = {};
  if (pageRes.ok) {
    const pages: { acf?: Record<string, unknown> }[] = await pageRes.json();
    rawAcf = pages?.[0]?.acf ?? {};
  }

  // Each section is a nested object under its group field name
  const bannerRaw   = (rawAcf.banner_section        ?? {}) as Record<string, unknown>;
  const insightsRaw = (rawAcf.insights_section       ?? {}) as Record<string, unknown>;
  const latestRaw   = (rawAcf.latest_blogs_section   ?? {}) as Record<string, unknown>;
  const listRaw     = (rawAcf.blog_list_section       ?? {}) as Record<string, unknown>;

  // ── 2. Fetch posts, categories, and tags in parallel ───────────────────────
  const [postsRes, catsRes, tagsRes] = await Promise.all([
    fetch(
      `${baseUrl}/wp-json/wp/v2/posts?per_page=100&_embed&_fields=id,date,slug,link,title,excerpt,content,categories,featured_media,_embedded,acf,_links`,
      { next: { revalidate: 3600 } }
    ),
    fetch(
      `${baseUrl}/wp-json/wp/v2/categories?per_page=100&_fields=id,name,slug,count`,
      { next: { revalidate: 3600 } }
    ),
    fetch(
      `${baseUrl}/wp-json/wp/v2/tags?per_page=100&_fields=id,name,slug,count`,
      { next: { revalidate: 3600 } }
    ),
  ]);

  const posts: WPBlogPostExtended[] = postsRes.ok ? await postsRes.json() : [];
  const categories: { id: number; name: string; slug: string; count: number }[] =
    catsRes.ok ? await catsRes.json() : [];
  const tags: { id: number; name: string; slug: string; count: number }[] =
    tagsRes.ok ? await tagsRes.json() : [];

  // ── 3. Collect media IDs for batch resolution ────────────────────────────
  const mediaIds: number[] = [];
  [bannerRaw, insightsRaw, latestRaw].forEach(raw => {
    if (typeof raw.banner_image === "number") mediaIds.push(raw.banner_image);
    if (typeof raw.sub_heading_icon === "number") mediaIds.push(raw.sub_heading_icon);
  });

  // ── 4. Batch-resolve media ───────────────────────────────────────────────
  const mediaMap: Record<number, string> = {};
  if (mediaIds.length > 0) {
    const uniqueIds = [...new Set(mediaIds)];
    const mediaRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`,
      { next: { revalidate: 3600 } }
    );
    if (mediaRes.ok) {
      const mediaData: WPMedia[] = await mediaRes.json();
      mediaData.forEach((m) => { mediaMap[m.id] = m.source_url; });
    }
  }

  // ── 5. Compose typed page data ───────────────────────────────────────────
  const pageData: BlogPageData = {
    // acf.banner_section.*
    banner_section: {
      sub_heading_icon: resolveMedia(bannerRaw.sub_heading_icon as ACFImage, mediaMap),
      sub_heading:      bannerRaw.sub_heading      as string | undefined,
      banner_image:      resolveMedia(bannerRaw.banner_image as ACFImage, mediaMap),
      heading:           bannerRaw.heading           as string | undefined,
      content:           bannerRaw.content           as string | undefined,
    },

    // acf.insights_section.*
    insights_section: {
      sub_heading_icon: resolveMedia(insightsRaw.sub_heading_icon as ACFImage, mediaMap),
      sub_heading:      insightsRaw.sub_heading       as string | undefined,
      heading:          insightsRaw.heading           as string | undefined,
      description:      insightsRaw.description       as string | undefined,
    },

    // acf.latest_blogs_section.*
    latest_blogs_section: {
      sub_heading_icon: resolveMedia(latestRaw.sub_heading_icon as ACFImage, mediaMap),
      sub_heading:      latestRaw.sub_heading       as string | undefined,
      heading:          latestRaw.heading           as string | undefined,
      description:      latestRaw.description       as string | undefined,
      button_label:     latestRaw.button_label      as string | undefined,
      button_link:      latestRaw.button_link       as string | undefined,
    },

    // acf.blog_list_section.*
    blog_list_section: {
      posts_per_page:   listRaw.posts_per_page   as number | undefined,
      load_more_batch:  listRaw.load_more_batch  as number | undefined,
    },
  };

  return { pageData, posts, categories, tags };
}
