import { ACFResumePage, ACFImage } from "@/types/acf";

export async function getResume(): Promise<ACFResumePage> {
  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  const slug = 'resume';

  if (!wpApiUrl) {
    console.error("WP API URL is not defined");
    return getDefaultResumeData();
  }

  try {
    // Attempt to fetch page by slug
    const res = await fetch(`${wpApiUrl}/wp-json/wp/v2/pages?slug=${slug}&acf_format=standard`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.warn(`Failed to fetch Resume page by slug '${slug}'`);
      return getDefaultResumeData();
    }

    const pages = await res.json();
    if (!pages || pages.length === 0) {
      console.warn(`No page found with slug '${slug}'`);
      return getDefaultResumeData();
    }

    const acf = pages[0].acf;
    if (!acf || Object.keys(acf).length === 0) {
      return getDefaultResumeData();
    }

    return resolveResumeMedia(acf, wpApiUrl);
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return getDefaultResumeData();
  }
}

async function resolveResumeMedia(acf: ACFResumePage, wpApiUrl: string): Promise<ACFResumePage> {
  const mediaIds: number[] = [];

  // Collect media IDs
  if (acf.banner && typeof acf.banner.background_image === "number") {
    mediaIds.push(acf.banner.background_image);
  }

  if (acf.flipbook && typeof acf.flipbook.pdf_url === "number") {
    mediaIds.push(acf.flipbook.pdf_url);
  }

  if (acf.intro && typeof acf.intro.primary_button_url === "number") {
    mediaIds.push(acf.intro.primary_button_url);
  }

  // Resolve all media IDs
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

  const resolve = (field: ACFImage | undefined): string => {
    if (typeof field === "number") return mediaMap.get(field) || "";
    if (field && typeof field === "object" && field.url) return field.url;
    return typeof field === "string" ? field : "";
  };

  return {
    ...acf,
    banner: acf.banner ? {
      ...acf.banner,
      background_image: resolve(acf.banner.background_image)
    } : { sub_heading: "", title: "", highlight_text: "", description: "", background_image: "" },
    flipbook: acf.flipbook ? {
      ...acf.flipbook,
      pdf_url: resolve(acf.flipbook.pdf_url)
    } : { pdf_url: "" },
    intro: acf.intro ? {
      ...acf.intro,
      primary_button_url: resolve(acf.intro.primary_button_url),
      stats: Array.isArray(acf.intro.stats) ? acf.intro.stats : [],
      features: Array.isArray(acf.intro.features) ? acf.intro.features : []
    } : {
      badge_text: "",
      title: "",
      subtitle: "",
      stats: [],
      cta_heading: "",
      cta_text: "",
      primary_btn_text: "",
      primary_button_url: "",
      secondary_btn_text: "",
      secondary_btn_url: "",
      features: []
    }
  };
}

export function getDefaultResumeData(): ACFResumePage {
  return {
    banner: {
      sub_heading: "",
      title: "",
      highlight_text: "",
      description: "",
      background_image: ""
    },
    flipbook: {
      pdf_url: ""
    },
    intro: {
      badge_text: "",
      title: "",
      subtitle: "",
      stats: [],
      cta_heading: "",
      cta_text: "",
      primary_btn_text: "",
      primary_button_url: "",
      secondary_btn_text: "",
      secondary_btn_url: "",
      features: []
    }
  };
}
