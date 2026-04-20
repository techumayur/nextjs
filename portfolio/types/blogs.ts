import { WPBlogPost, ACFImage } from "@/types/acf";

// ─── ACF group: banner_section ─────────────────────────────────────────────
export interface ACFBlogPageSettings {
  sub_heading_icon?: ACFImage;
  sub_heading?: string;
  banner_image?: ACFImage;
  heading?: string;
  content?: string;
}

// ─── ACF group: insights_section ───────────────────────────────────────────
export interface ACFBlogInsightsSection {
  sub_heading_icon?: ACFImage;
  sub_heading?: string;
  heading?: string;
  description?: string;
}

// ─── ACF group: latest_blogs_section ───────────────────────────────────────
export interface ACFBlogLatestSection {
  sub_heading_icon?: ACFImage;
  sub_heading?: string;
  heading?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
}

// ─── ACF group: blog_list_section ──────────────────────────────────────────
export interface ACFBlogListSection {
  posts_per_page?: number;
  load_more_batch?: number;
}

// ─── Composed blog page data ────────────────────────────────────────────────
export interface BlogPageData {
  banner_section: ACFBlogPageSettings | null;
  insights_section: ACFBlogInsightsSection | null;
  latest_blogs_section: ACFBlogLatestSection | null;
  blog_list_section: ACFBlogListSection | null;
}

// ─── Extended WPBlogPost with extra ACF fields ──────────────────────────────
export interface WPBlogPostExtended extends WPBlogPost {
  acf?: {
    views_count?: string;
    read_time?: string;
    tag_code?: string;
    is_featured?: boolean;
    featured_image?: string | { url: string };
    faqs?: {
      sub_heading?: string;
      title?: string;
      description?: string;
      faq_items?: {
        question: string;
        answer: string;
      }[];
    };
  };
  categories?: number[];
}
