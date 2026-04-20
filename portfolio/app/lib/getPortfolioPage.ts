import { ACFPortfolioPage, PortfolioPageData } from "@/types/acf";

export async function getPortfolioPage() {
  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const portfolioPageId = 948; // Portfolio Page ID from ACF location

  if (!wpApiUrl) {
    console.error("WP API URL is not defined");
    return getDefaultPortfolioData();
  }

  // Attempt to fetch via wp/v2
  const res = await fetch(`${wpApiUrl}/wp-json/wp/v2/pages/${portfolioPageId}?acf_format=standard`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    console.warn("Failed to fetch Portfolio page from standard API, falling back to default data.");
    return getDefaultPortfolioData();
  }

  const data: PortfolioPageData = await res.json();
  const acf = data.acf;

  // Fallback to ACF v3 if v2 is empty
  if (!acf || Object.keys(acf).length === 0) {
    const fallbackRes = await fetch(`${wpApiUrl}/wp-json/acf/v3/pages/${portfolioPageId}`, { next: { revalidate: 3600 } });
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData.acf) {
        return resolveMedia(fallbackData.acf, wpApiUrl);
      }
    }
    return getDefaultPortfolioData();
  }

  return resolveMedia(acf, wpApiUrl);
}

async function resolveMedia(acf: ACFPortfolioPage, wpApiUrl: string): Promise<ACFPortfolioPage> {
  const mediaIds: number[] = [];

  // Collect media IDs
  if (acf.intro && typeof acf.intro.sub_heading_icon === "number") {
    mediaIds.push(acf.intro.sub_heading_icon);
  }
  if (acf.banner && typeof acf.banner.background_image === "number") {
    mediaIds.push(acf.banner.background_image);
  }
  if (acf.banner && typeof acf.banner.sub_heading_icon === "number") {
    mediaIds.push(acf.banner.sub_heading_icon);
  }
  
  if (acf.cta && typeof acf.cta.sub_heading_icon === "number") {
    mediaIds.push(acf.cta.sub_heading_icon);
  }
  if (Array.isArray(acf.cta?.stats_grid)) {
    acf.cta.stats_grid.forEach(s => { if (typeof s.icon === "number") mediaIds.push(s.icon); });
  }
  if (Array.isArray(acf.cta?.seo_links)) {
    acf.cta.seo_links.forEach(l => { if (typeof l.icon === "number") mediaIds.push(l.icon); });
  }
  if (acf.our_valued_partners && typeof acf.our_valued_partners.sub_heading_icon === "number") {
    mediaIds.push(acf.our_valued_partners.sub_heading_icon);
  }
  if (Array.isArray(acf.our_valued_partners?.marquee_row_1)) {
    acf.our_valued_partners.marquee_row_1.forEach(b => { if (typeof b.logo === "number") mediaIds.push(b.logo); });
  }
  if (Array.isArray(acf.our_valued_partners?.marquee_row_2)) {
    acf.our_valued_partners.marquee_row_2.forEach(b => { if (typeof b.logo === "number") mediaIds.push(b.logo); });
  }

  // Resolve all media IDs in parallel
  const mediaMap = new Map<number, string>();
  if (mediaIds.length > 0) {
    await Promise.all(mediaIds.map(async (id) => {
      try {
        const mRes = await fetch(`${wpApiUrl}/wp-json/wp/v2/media/${id}`, { next: { revalidate: 3600 } });
        if (mRes.ok) {
          const mData = await mRes.json();
          mediaMap.set(id, mData.source_url);
        }
      } catch (err) {
        console.error(`Error resolving media ID ${id}:`, err);
      }
    }));
  }

  // Apply resolved URLs and clean HTML
  const resolve = (field: string | number | { url?: string } | null | undefined): string => {
    if (typeof field === "number") return mediaMap.get(field) || "";
    if (field && typeof field === "object" && "url" in field) return (field as { url?: string }).url || "";
    return typeof field === "string" ? field : "";
  };

  const clean = (html: unknown): string => {
    if (typeof html !== "string") return "";
    return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
  };

  return {
    ...acf,
    intro: acf.intro ? {
      ...acf.intro,
      sub_heading_icon: resolve(acf.intro.sub_heading_icon),
      heading: clean(acf.intro.heading),
      sub_heading: clean(acf.intro.sub_heading)
    } : undefined,
    banner: acf.banner ? {
      ...acf.banner,
      background_image: resolve(acf.banner.background_image),
      sub_heading_icon: resolve(acf.banner.sub_heading_icon),
      heading: clean(acf.banner.heading),
      sub_heading: clean(acf.banner.sub_heading),
      description: clean(acf.banner.description)
    } : { sub_heading: "", sub_heading_icon: "", heading: "", description: "", background_image: "" },
    all_projects: acf.all_projects ? {
      ...acf.all_projects,
      title: clean(acf.all_projects.title),
      sub_heading: clean(acf.all_projects.sub_heading),
      description: clean(acf.all_projects.description)
    } : undefined,
    cta: acf.cta ? {
      ...acf.cta,
      title: clean(acf.cta.title),
      sub_heading: clean(acf.cta.sub_heading),
      sub_heading_icon: resolve(acf.cta.sub_heading_icon),
      stats_grid: Array.isArray(acf.cta.stats_grid) ? acf.cta.stats_grid.map(s => ({ ...s, icon: resolve(s.icon) })) : [],
      seo_links: Array.isArray(acf.cta.seo_links) ? acf.cta.seo_links.map(l => ({ ...l, icon: resolve(l.icon) })) : [],
    } : undefined,
    our_valued_partners: acf.our_valued_partners ? {
      ...acf.our_valued_partners,
      heading: clean(acf.our_valued_partners.heading),
      sub_heading: clean(acf.our_valued_partners.sub_heading),
      sub_heading_icon: resolve(acf.our_valued_partners.sub_heading_icon),
      marquee_row_1: Array.isArray(acf.our_valued_partners.marquee_row_1) ? acf.our_valued_partners.marquee_row_1.map(b => ({ ...b, logo: resolve(b.logo) })) : [],
      marquee_row_2: Array.isArray(acf.our_valued_partners.marquee_row_2) ? acf.our_valued_partners.marquee_row_2.map(b => ({ ...b, logo: resolve(b.logo) })) : [],
    } : undefined
  } as ACFPortfolioPage;
}

function getDefaultPortfolioData(): ACFPortfolioPage {
  return {
    intro: {
      sub_heading: "Optimized for Performance",
      sub_heading_icon: "",
      heading: "The Perfect Blend of <span class=\"text-orange\">Design</span> and <span class=\"text-orange\">SEO</span>",
      description: "Implementing cutting-edge SEO strategies integrated seamlessly into performance-driven web architectures.",
      features: [
        { icon_type: 'seo', title: 'SEO First', description: 'Built for visibility.' },
        { icon_type: 'dev', title: 'Modern Stack', description: 'Clean, scalable code.' },
        { icon_type: 'delivery', title: 'Fast Execution', description: 'Optimized for Core Web Vitals.' }
      ],
      primary_button_label: "Start a Project",
      primary_button_link: "/contact-me",
      secondary_button_label: "View All Projects",
      secondary_button_link: "/portfolio",
      trust_label: "Trusted by Industry Leaders",
      trust_badges: [
        { icon: "🛡️", text: "Security Certified" },
        { icon: "🚀", text: "Performance Driven" },
        { icon: "⚡", text: "Fast Delivery" }
      ],
      stats: [
        { icon_type: 'seo', value: '500+', label: 'Global Projects', target_number: 500 },
        { icon_type: 'dev', value: '100+', label: 'Trusted Clients', target_number: 100 },
        { icon_type: 'delivery', value: '98%', label: 'CSAT Score', target_number: 98 },
        { icon_type: 'custom', value: '1M+', label: 'Lines of Code', target_number: 1000000 }
      ]
    },
    banner: {
      sub_heading: "Explore My Work",
      sub_heading_icon: "",
      heading: "Showcasing Professional <span class=\"highlight\">Portfolios</span>",
      description: "A collection of high-impact digital solutions that bridge code and performance.",
      background_image: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&h=800&fit=crop"
    },
    all_projects: {
      sub_heading: "My Projects",
      title: "All <span class=\"highlight\">Projects</span>",
      description: "Dive into my full range of work, from experiments to production-grade applications.",
      show_filters: true,
      default_category: "",
      per_page: 6,
      empty_text: "No projects found.",
      loader_text: "Loading more projects..."
    },
    cta: {
      sub_heading: "Partnership Opportunity",
      title: "Want to Grow with <span class=\"highlight\">My Expertise?</span>",
      description: "Let's transform your digital presence together. I offer expert SEO consulting and cutting-edge web development services.",
      primary_button_label: "Free Consultation",
      primary_button_link: "#",
      secondary_button_label: "Lets Connect",
      secondary_button_link: "#",
      stats_grid: [
        { icon: "/images/home/seo-icon.svg", title: "SEO Excellence", text: "Data-driven strategies for top rankings" },
        { icon: "/images/home/web-dev.svg", title: "Web Development", text: "Modern solutions with cutting-edge tech" },
        { icon: "/images/home/growth-icon.svg", title: "Growth Strategy", text: "Scale your business effectively" }
      ],
      seo_links: [
        { label: "SEO Consultation", link: "#seo-consultation", icon: "/images/home/seo-icon.svg" },
        { label: "Web Development Services", link: "#web-development", icon: "/images/home/website-development.svg" },
        { label: "Digital Strategy", link: "#digital-strategy", icon: "/images/home/digital-strategy-icon.svg" }
      ]
    },
    our_valued_partners: {
      sub_heading: "Valued Partners",
      heading: "Our Valued <span class=\"highlight\">Partners</span>",
      marquee_row_1: [
        { logo: "https://placehold.co/150x80/eef2f5/2c3e50?text=Brand+1", name: "Brand 1" },
        { logo: "https://placehold.co/150x80/eef2f5/2c3e50?text=Brand+2", name: "Brand 2" },
      ],
      marquee_row_2: [
        { logo: "https://placehold.co/150x80/eef2f5/2c3e50?text=Brand+7", name: "Brand 7" },
        { logo: "https://placehold.co/150x80/eef2f5/2c3e50?text=Brand+8", name: "Brand 8" },
      ]
    },
    my_latest_blogs: {
      sub_heading: "My Blogs",
      heading: "My Latest <span class=\"highlight\">Blogs</span>",
      description: "Insights from years of experience in the digital world.",
      button_label: "View All Blogs",
      button_link: "/blogs"
    }
  };
}
