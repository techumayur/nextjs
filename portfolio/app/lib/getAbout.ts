import { AboutPageData, ACFAboutPage } from "@/types/acf";

interface WPMedia {
  id: number;
  source_url: string;
}

export async function getAbout(): Promise<ACFAboutPage | null> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    throw new Error("WP API URL not defined in .env");
  }

  // Fetch Page 208 which contains our About Me ACF fields
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages/208?_fields=acf`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }

  const data: AboutPageData = await res.json();
  let acf = data.acf;

  // Fallback: If acf is an empty array (which some WP setups return when disabled in V2)
  // try the dedicated ACF API endpoint if available.
  if (!acf || (Array.isArray(acf) && acf.length === 0)) {
    
    const fallbackRes = await fetch(`${baseUrl}/wp-json/acf/v3/pages/208`, {
      next: { revalidate: 3600 },
    });
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData && fallbackData.acf) {
        acf = fallbackData.acf;
      }
    }
  }

  if (!acf || (Array.isArray(acf) && acf.length === 0)) {
    console.error("ACF data is missing or empty for page 208");
    return {} as ACFAboutPage;
  }

  // Debug: Log the keys of ACF to see if they match expected names


  // Collect all potential media IDs
  const mediaIds: number[] = [];

  // Banner
  if (acf.banner) {
    if (typeof acf.banner.sub_heading_icon === "number") mediaIds.push(acf.banner.sub_heading_icon);
    if (typeof acf.banner.background_image === "number") mediaIds.push(acf.banner.background_image);
  }

  // Intro
  if (acf.intro) {
    if (typeof acf.intro.sub_heading_icon === "number") mediaIds.push(acf.intro.sub_heading_icon);
    if (typeof acf.intro.profile_image === "number") mediaIds.push(acf.intro.profile_image);
    if (typeof acf.intro.story_icon === "number") mediaIds.push(acf.intro.story_icon);
    if (acf.intro.social_links) {
      acf.intro.social_links.forEach(link => {
        if (typeof link.icon === "number") mediaIds.push(link.icon);
      });
    }
  }

  // Core Values
  if (acf.core_values) {
    if (typeof acf.core_values.sub_heading_icon === "number") mediaIds.push(acf.core_values.sub_heading_icon);
    if (acf.core_values.values) {
      acf.core_values.values.forEach(v => {
        if (typeof v.icon === "number") mediaIds.push(v.icon);
      });
    }
  }

  // Work With Me
  if (acf.work_with_me) {
    if (typeof acf.work_with_me.sub_heading_icon === "number") mediaIds.push(acf.work_with_me.sub_heading_icon);
    if (acf.work_with_me.items) {
      acf.work_with_me.items.forEach(item => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
      });
    }
  }

  // CTA
  if (acf.cta) {
    if (typeof acf.cta.sub_heading_icon === "number") mediaIds.push(acf.cta.sub_heading_icon);
    if (typeof acf.cta.icon === "number") mediaIds.push(acf.cta.icon);
  }

  // Technical Skills
  if (acf.technical_skills) {
    if (typeof acf.technical_skills.sub_heading_icon === "number") mediaIds.push(acf.technical_skills.sub_heading_icon);
    
    ['frontend_skills', 'backend_skills', 'content_skills', 'seo_skills'].forEach(key => {
      const skills = (acf.technical_skills as any)[key];
      if (skills) {
        skills.forEach((skill: any) => {
          if (typeof skill.icon === "number") mediaIds.push(skill.icon);
        });
      }
    });
  }

  // Certifications
  const certsSection = acf["certifications_&_achievements"];
  if (certsSection) {
    if (typeof certsSection.sub_heading_icon === "number") mediaIds.push(certsSection.sub_heading_icon);
    if (certsSection.certifications) {
      certsSection.certifications.forEach(cert => {
        if (typeof cert.icon === "number") mediaIds.push(cert.icon);
      });
    }
  }

  // Career Timeline
  if (acf.career_timeline) {
    if (typeof acf.career_timeline.sub_heading_icon === "number") mediaIds.push(acf.career_timeline.sub_heading_icon);
    if (acf.career_timeline.timeline_items) {
      acf.career_timeline.timeline_items.forEach(item => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
        if (typeof item.company_icon === "number") mediaIds.push(item.company_icon);
      });
    }
  }

  // Resolve IDs to URLs
  const mediaMap: Record<number, string> = {};
  if (mediaIds.length > 0) {
    const uniqueIds = [...new Set(mediaIds)];
    const mediaRes = await fetch(`${baseUrl}/wp-json/wp/v2/media?include=${uniqueIds.join(",")}&per_page=100`, {
      next: { revalidate: 3600 },
    });

    if (mediaRes.ok) {
      const mediaData: WPMedia[] = await mediaRes.json();
      mediaData.forEach((m) => { mediaMap[m.id] = m.source_url; });
    }
  }

  // Apply URLs back (Always run this so objects are resolved even if mediaIds was empty)
  // Banner
  if (acf.banner) {
    if (typeof acf.banner.sub_heading_icon === "number") acf.banner.sub_heading_icon = mediaMap[acf.banner.sub_heading_icon] || "";
    else if (typeof acf.banner.sub_heading_icon === "object") acf.banner.sub_heading_icon = acf.banner.sub_heading_icon.url;

    if (typeof acf.banner.background_image === "number") acf.banner.background_image = mediaMap[acf.banner.background_image] || "";
    else if (typeof acf.banner.background_image === "object") acf.banner.background_image = acf.banner.background_image.url;
  }

  // Intro
  if (acf.intro) {
    if (typeof acf.intro.sub_heading_icon === "number") acf.intro.sub_heading_icon = mediaMap[acf.intro.sub_heading_icon] || "";
    else if (typeof acf.intro.sub_heading_icon === "object") acf.intro.sub_heading_icon = acf.intro.sub_heading_icon.url;

    if (typeof acf.intro.profile_image === "number") acf.intro.profile_image = mediaMap[acf.intro.profile_image] || "";
    else if (typeof acf.intro.profile_image === "object") acf.intro.profile_image = acf.intro.profile_image.url;

    if (typeof acf.intro.story_icon === "number") acf.intro.story_icon = mediaMap[acf.intro.story_icon] || "";
    else if (typeof acf.intro.story_icon === "object") acf.intro.story_icon = acf.intro.story_icon.url;

    if (acf.intro.social_links) {
      acf.intro.social_links.forEach(link => {
        if (typeof link.icon === "number") link.icon = mediaMap[link.icon] || "";
        else if (typeof link.icon === "object") link.icon = link.icon.url;
      });
    }
  }

  // Core Values
  if (acf.core_values) {
    if (typeof acf.core_values.sub_heading_icon === "number") acf.core_values.sub_heading_icon = mediaMap[acf.core_values.sub_heading_icon] || "";
    else if (typeof acf.core_values.sub_heading_icon === "object") acf.core_values.sub_heading_icon = acf.core_values.sub_heading_icon.url;

    if (acf.core_values.values) {
      acf.core_values.values.forEach(v => {
        if (typeof v.icon === "number") v.icon = mediaMap[v.icon] || "";
        else if (typeof v.icon === "object") v.icon = v.icon.url;
      });
    }
  }

  // Work With Me
  if (acf.work_with_me) {
    if (typeof acf.work_with_me.sub_heading_icon === "number") acf.work_with_me.sub_heading_icon = mediaMap[acf.work_with_me.sub_heading_icon] || "";
    else if (typeof acf.work_with_me.sub_heading_icon === "object") acf.work_with_me.sub_heading_icon = acf.work_with_me.sub_heading_icon.url;

    if (acf.work_with_me.items) {
      acf.work_with_me.items.forEach(item => {
        if (typeof item.icon === "number") item.icon = mediaMap[item.icon] || "";
        else if (typeof item.icon === "object") item.icon = item.icon.url;
      });
    }
  }

  // CTA
  if (acf.cta) {
    if (typeof acf.cta.sub_heading_icon === "number") acf.cta.sub_heading_icon = mediaMap[acf.cta.sub_heading_icon] || "";
    else if (typeof acf.cta.sub_heading_icon === "object") acf.cta.sub_heading_icon = acf.cta.sub_heading_icon.url;

    if (typeof acf.cta.icon === "number") acf.cta.icon = mediaMap[acf.cta.icon] || "";
    else if (typeof acf.cta.icon === "object") acf.cta.icon = acf.cta.icon.url;
  }

  // Technical Skills
  if (acf.technical_skills) {
    if (typeof acf.technical_skills.sub_heading_icon === "number") acf.technical_skills.sub_heading_icon = mediaMap[acf.technical_skills.sub_heading_icon] || "";
    else if (typeof acf.technical_skills.sub_heading_icon === "object") acf.technical_skills.sub_heading_icon = acf.technical_skills.sub_heading_icon.url;

    ['frontend_skills', 'backend_skills', 'content_skills', 'seo_skills'].forEach(key => {
      const skills = (acf.technical_skills as any)[key];
      if (skills) {
        skills.forEach((skill: any) => {
          if (typeof skill.icon === "number") skill.icon = mediaMap[skill.icon] || "";
          else if (typeof skill.icon === "object") skill.icon = skill.icon.url;
        });
      }
    });
  }

  // Certifications
  if (certsSection) {
    if (typeof certsSection.sub_heading_icon === "number") certsSection.sub_heading_icon = mediaMap[certsSection.sub_heading_icon] || "";
    else if (typeof certsSection.sub_heading_icon === "object") certsSection.sub_heading_icon = certsSection.sub_heading_icon.url;

    if (certsSection.certifications) {
      certsSection.certifications.forEach(cert => {
        if (typeof cert.icon === "number") cert.icon = mediaMap[cert.icon] || "";
        else if (typeof cert.icon === "object") cert.icon = cert.icon.url;
      });
    }
  }

  // Career Timeline
  if (acf.career_timeline) {
    if (typeof acf.career_timeline.sub_heading_icon === "number") acf.career_timeline.sub_heading_icon = mediaMap[acf.career_timeline.sub_heading_icon] || "";
    else if (typeof acf.career_timeline.sub_heading_icon === "object") acf.career_timeline.sub_heading_icon = acf.career_timeline.sub_heading_icon.url;

    if (acf.career_timeline.timeline_items) {
      acf.career_timeline.timeline_items.forEach(item => {
        if (typeof item.icon === "number") item.icon = mediaMap[item.icon] || "";
        else if (typeof item.icon === "object") item.icon = item.icon.url;

        if (typeof item.company_icon === "number") item.company_icon = mediaMap[item.company_icon] || "";
        else if (typeof item.company_icon === "object") item.company_icon = item.company_icon.url;
      });
    }
  }

  return acf;
}
