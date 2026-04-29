import { AboutPageData, ACFAboutPage } from "@/types/acf";
import { wpFetch, fetchMediaMap, resolveMedia } from "./wpUtils";

export async function getAbout(): Promise<ACFAboutPage | null> {
  // Fetch Page 208 which contains our About Me ACF fields
  const data = await wpFetch<AboutPageData>('/wp-json/wp/v2/pages/208', { fields: ['acf'] });

  if (!data) return null;

  let acf = data.acf;

  // Fallback: If acf is an empty array
  if (!acf || (Array.isArray(acf) && acf.length === 0)) {
    const fallbackData = await wpFetch<any>('/wp-json/acf/v3/pages/208');
    if (fallbackData?.acf) {
      acf = fallbackData.acf;
    }
  }

  if (!acf || (Array.isArray(acf) && acf.length === 0)) {
    console.error("ACF data is missing or empty for page 208");
    return {} as ACFAboutPage;
  }

  // Collect all potential media IDs
  const mediaIds: number[] = [];

  if (acf.banner) {
    if (typeof acf.banner.sub_heading_icon === "number") mediaIds.push(acf.banner.sub_heading_icon);
    if (typeof acf.banner.background_image === "number") mediaIds.push(acf.banner.background_image);
  }

  if (acf.intro) {
    if (typeof acf.intro.sub_heading_icon === "number") mediaIds.push(acf.intro.sub_heading_icon);
    if (typeof acf.intro.profile_image === "number") mediaIds.push(acf.intro.profile_image);
    if (typeof acf.intro.story_icon === "number") mediaIds.push(acf.intro.story_icon);
    acf.intro.social_links?.forEach(link => { if (typeof link.icon === "number") mediaIds.push(link.icon); });
  }

  if (acf.core_values) {
    if (typeof acf.core_values.sub_heading_icon === "number") mediaIds.push(acf.core_values.sub_heading_icon);
    acf.core_values.values?.forEach(v => { if (typeof v.icon === "number") mediaIds.push(v.icon); });
  }

  if (acf.work_with_me) {
    if (typeof acf.work_with_me.sub_heading_icon === "number") mediaIds.push(acf.work_with_me.sub_heading_icon);
    acf.work_with_me.items?.forEach(item => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
  }

  if (acf.cta) {
    if (typeof acf.cta.sub_heading_icon === "number") mediaIds.push(acf.cta.sub_heading_icon);
    if (typeof acf.cta.icon === "number") mediaIds.push(acf.cta.icon);
  }

  if (acf.technical_skills) {
    if (typeof acf.technical_skills.sub_heading_icon === "number") mediaIds.push(acf.technical_skills.sub_heading_icon);
    ['frontend_skills', 'backend_skills', 'content_skills', 'seo_skills'].forEach(key => {
      (acf.technical_skills as any)[key]?.forEach((skill: any) => { if (typeof skill.icon === "number") mediaIds.push(skill.icon); });
    });
  }

  const certsSection = acf["certifications_&_achievements"];
  if (certsSection) {
    if (typeof certsSection.sub_heading_icon === "number") mediaIds.push(certsSection.sub_heading_icon);
    certsSection.certifications?.forEach(cert => { if (typeof cert.icon === "number") mediaIds.push(cert.icon); });
  }

  if (acf.career_timeline) {
    if (typeof acf.career_timeline.sub_heading_icon === "number") mediaIds.push(acf.career_timeline.sub_heading_icon);
    acf.career_timeline.timeline_items?.forEach(item => {
      if (typeof item.icon === "number") mediaIds.push(item.icon);
      if (typeof item.company_icon === "number") mediaIds.push(item.company_icon);
    });
  }

  // Resolve IDs to URLs
  const mediaMap = await fetchMediaMap(mediaIds);

  // Apply URLs back
  if (acf.banner) {
    acf.banner.sub_heading_icon = resolveMedia(acf.banner.sub_heading_icon, mediaMap);
    acf.banner.background_image = resolveMedia(acf.banner.background_image, mediaMap);
  }

  if (acf.intro) {
    acf.intro.sub_heading_icon = resolveMedia(acf.intro.sub_heading_icon, mediaMap);
    acf.intro.profile_image = resolveMedia(acf.intro.profile_image, mediaMap);
    acf.intro.story_icon = resolveMedia(acf.intro.story_icon, mediaMap);
    acf.intro.social_links?.forEach(link => { link.icon = resolveMedia(link.icon, mediaMap); });
  }

  if (acf.core_values) {
    acf.core_values.sub_heading_icon = resolveMedia(acf.core_values.sub_heading_icon, mediaMap);
    acf.core_values.values?.forEach(v => { v.icon = resolveMedia(v.icon, mediaMap); });
  }

  if (acf.work_with_me) {
    acf.work_with_me.sub_heading_icon = resolveMedia(acf.work_with_me.sub_heading_icon, mediaMap);
    acf.work_with_me.items?.forEach(item => { item.icon = resolveMedia(item.icon, mediaMap); });
  }

  if (acf.cta) {
    acf.cta.sub_heading_icon = resolveMedia(acf.cta.sub_heading_icon, mediaMap);
    acf.cta.icon = resolveMedia(acf.cta.icon, mediaMap);
  }

  if (acf.technical_skills) {
    acf.technical_skills.sub_heading_icon = resolveMedia(acf.technical_skills.sub_heading_icon, mediaMap);
    ['frontend_skills', 'backend_skills', 'content_skills', 'seo_skills'].forEach(key => {
      (acf.technical_skills as any)[key]?.forEach((skill: any) => { skill.icon = resolveMedia(skill.icon, mediaMap); });
    });
  }

  if (certsSection) {
    certsSection.sub_heading_icon = resolveMedia(certsSection.sub_heading_icon, mediaMap);
    certsSection.certifications?.forEach(cert => { cert.icon = resolveMedia(cert.icon, mediaMap); });
  }

  if (acf.career_timeline) {
    acf.career_timeline.sub_heading_icon = resolveMedia(acf.career_timeline.sub_heading_icon, mediaMap);
    acf.career_timeline.timeline_items?.forEach(item => {
      item.icon = resolveMedia(item.icon, mediaMap);
      item.company_icon = resolveMedia(item.company_icon, mediaMap);
    });
  }

  return acf;
}
