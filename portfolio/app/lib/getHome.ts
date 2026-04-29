import { PageData, BannerSlide, ACFSkill, ACFAboutUs, ACFStats, ACFResume, ACFPortfolio, ACFCTA, ACFSkillsSection, ACFBlogsSection, ACFTipsSection, ACFCTA2, ACFTutorialsSection, ACFContactSection, ACFSourceCodeSection, WPSourceCodeItem, ACFFaqSection } from "@/types/acf";
import { wpFetch, fetchMediaMap, resolveMedia } from "./wpUtils";

export async function getHome(): Promise<{ banner: BannerSlide[], skills: ACFSkill[], about_us: ACFAboutUs | null, stats: ACFStats | null, resume: ACFResume | null, portfolio: ACFPortfolio | null, cta: ACFCTA | null, cta1: ACFCTA | null, my_skills: ACFSkillsSection | null, blogs_section: ACFBlogsSection | null, tips_section: ACFTipsSection | null, cta_2: ACFCTA2 | null, tutorials_section: ACFTutorialsSection | null, contact_section: ACFContactSection | null, source_code_section: ACFSourceCodeSection | null, faq_section: ACFFaqSection | null, source_projects: WPSourceCodeItem[] }> {
  
  const [data, sourceProjectsData] = await Promise.all([
    wpFetch<PageData>('/wp-json/wp/v2/pages/2', { fields: ['acf'] }),
    wpFetch<WPSourceCodeItem[]>('/wp-json/wp/v2/source-code', { params: { _embed: '', per_page: 100 } })
  ]);

  if (!data) {
    return { banner: [], skills: [], about_us: null, stats: null, resume: null, portfolio: null, cta: null, cta1: null, my_skills: null, blogs_section: null, tips_section: null, cta_2: null, tutorials_section: null, contact_section: null, source_code_section: null, faq_section: null, source_projects: [] };
  }
  
  const banner: BannerSlide[] = data.acf?.banner || [];
  const skills: ACFSkill[] = data.acf?.skills || [];
  const aboutUsData: ACFAboutUs | null = data.acf?.about_us || null;
  const statsData: ACFStats | null = data.acf?.stats || null;
  const resumeData: ACFResume | null = data.acf?.resume || null;
  const portfolioData: ACFPortfolio | null = data.acf?.portfolio || null;
  const ctaData: ACFCTA | null = data.acf?.cta || null;
  const cta1Data: ACFCTA | null = data.acf?.cta1 || null;
  const mySkills: ACFSkillsSection | null = data.acf?.my_skills || null;
  const blogsSection: ACFBlogsSection | null = data.acf?.blogs_section || data.acf?.blogs || null;
  const tipsSection: ACFTipsSection | null = data.acf?.["tips_&_tricks"] || data.acf?.tips_section || data.acf?.tips || null;
  const cta2Data: ACFCTA2 | null = data.acf?.cta2 || data.acf?.cta_2 || null;
  const tutorialsSection: ACFTutorialsSection | null = data.acf?.tutorials_section || data.acf?.tutorials || null;
  const contactSection: ACFContactSection | null = data.acf?.contact_section || data.acf?.contact || null;
  const sourceCodeSection: ACFSourceCodeSection | null = data.acf?.source_code_section || data.acf?.source_code || null;
  const faqSection: ACFFaqSection | null = data.acf?.faq_section || data.acf?.faq || data.acf?.faqs || null;
  const sourceProjects = sourceProjectsData || [];

  // Collect all potential media IDs
  const mediaIds: number[] = [];
  
  banner.forEach((slide) => {
    if (slide.acf_fc_layout === "slide_1" && slide.skills_slider) {
      slide.skills_slider.forEach((s) => { if (typeof s.skills_icon === "number") mediaIds.push(s.skills_icon); });
    }
    if (slide.acf_fc_layout === "slide_3" && slide.creative_card) {
      slide.creative_card.forEach((c) => { if (typeof c.icon === "number") mediaIds.push(c.icon); });
    }
    if (slide.acf_fc_layout === "slide_4") {
      if (typeof slide.right_image === "number") mediaIds.push(slide.right_image);
      slide.features?.forEach((f) => { if (typeof f.icon === "number") mediaIds.push(f.icon); });
      slide.creative_card?.forEach((c) => { if (typeof c.icon === "number") mediaIds.push(c.icon); });
    }
  });

  skills.forEach((s) => { if (typeof s.icon === "number") mediaIds.push(s.icon); });
  if (aboutUsData) {
    if (typeof aboutUsData.profile_image === "number") mediaIds.push(aboutUsData.profile_image);
    aboutUsData.features?.forEach((f) => { if (typeof f.icon === "number") mediaIds.push(f.icon); });
  }
  statsData?.stats_items?.forEach(item => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
  if (resumeData) {
    if (typeof resumeData.right_icon === "number") mediaIds.push(resumeData.right_icon);
    resumeData.features?.forEach((f) => { if (typeof f.icon === "number") mediaIds.push(f.icon); });
  }
  [ctaData, cta1Data].forEach(cta => {
    if (cta) {
      if (typeof cta.sub_heading_icon === "number") mediaIds.push(cta.sub_heading_icon as number);
      if (typeof cta.icon === "number") mediaIds.push(cta.icon as number);
      cta.info_items?.forEach(item => { if (typeof item.icon === "number") mediaIds.push(item.icon as number); });
    }
  });
  if (blogsSection) {
    if (typeof blogsSection.sub_heading_image === "number") mediaIds.push(blogsSection.sub_heading_image);
    if (typeof blogsSection.sub_heading_icon === "number") mediaIds.push(blogsSection.sub_heading_icon as number);
  }
  if (mySkills) {
    if (typeof mySkills.sub_heading_image === "number") mediaIds.push(mySkills.sub_heading_image as number);
    if (typeof mySkills.sub_heading_icon === "number") mediaIds.push(mySkills.sub_heading_icon as number);
  }
  if (tipsSection) {
    if (typeof tipsSection.sub_heading_image === "number") mediaIds.push(tipsSection.sub_heading_image);
    if (typeof tipsSection.sub_heading_icon === "number") mediaIds.push(tipsSection.sub_heading_icon as number);
  }
  if (cta2Data) {
    if (typeof cta2Data.sub_heading_image === "number") mediaIds.push(cta2Data.sub_heading_image);
    cta2Data.stats_grid?.forEach((item) => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
    cta2Data.seo_links?.forEach((item) => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
  }
  if (tutorialsSection) {
    if (typeof tutorialsSection.sub_heading_image === "number") mediaIds.push(tutorialsSection.sub_heading_image);
    if (typeof tutorialsSection.sub_heading_icon === "number") mediaIds.push(tutorialsSection.sub_heading_icon as number);
    tutorialsSection.sidebar_cards?.forEach((card) => { if (typeof card.icon === "number") mediaIds.push(card.icon); });
  }
  if (contactSection) {
    if (typeof contactSection.sub_heading_image === "number") mediaIds.push(contactSection.sub_heading_image);
    if (typeof contactSection.sub_heading_icon === "number") mediaIds.push(contactSection.sub_heading_icon as number);
    contactSection.contact_info?.forEach((item) => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
    contactSection.social_links?.forEach((item) => { if (typeof item.icon === "number") mediaIds.push(item.icon); });
  }
  if (sourceCodeSection) {
    if (typeof sourceCodeSection.sub_heading_image === "number") mediaIds.push(sourceCodeSection.sub_heading_image as number);
    if (typeof sourceCodeSection.sub_heading_icon === "number") mediaIds.push(sourceCodeSection.sub_heading_icon as number);
    if (typeof sourceCodeSection.cta_badge_icon === "number") mediaIds.push(sourceCodeSection.cta_badge_icon);
    sourceCodeSection.cta_features?.forEach((feature) => { if (typeof feature.icon === "number") mediaIds.push(feature.icon); });
  }
  if (faqSection) {
    if (typeof faqSection.sub_heading_image === "number") mediaIds.push(faqSection.sub_heading_image);
    if (typeof faqSection.sub_heading_icon === "number") mediaIds.push(faqSection.sub_heading_icon as number);
  }
  sourceProjects.forEach((project) => {
    if (project.acf && typeof project.acf.thumbnail === "number") mediaIds.push(project.acf.thumbnail);
    if (project.featured_media && typeof project.featured_media === "number") mediaIds.push(project.featured_media);
  });

  // Resolve IDs to URLs in bulk
  const mediaMap = await fetchMediaMap(mediaIds);

  // Apply URLs back
  banner.forEach((slide) => {
    if (slide.acf_fc_layout === "slide_1") slide.skills_slider?.forEach((s) => { s.skills_icon = resolveMedia(s.skills_icon, mediaMap); });
    if (slide.acf_fc_layout === "slide_3") slide.creative_card?.forEach((c) => { c.icon = resolveMedia(c.icon, mediaMap); });
    if (slide.acf_fc_layout === "slide_4") {
      slide.right_image = resolveMedia(slide.right_image, mediaMap);
      slide.features?.forEach((f) => { f.icon = resolveMedia(f.icon, mediaMap); });
      slide.creative_card?.forEach((c) => { c.icon = resolveMedia(c.icon, mediaMap); });
    }
  });

  skills.forEach((s) => { s.icon = resolveMedia(s.icon, mediaMap); });
  if (aboutUsData) {
    aboutUsData.profile_image = resolveMedia(aboutUsData.profile_image, mediaMap);
    aboutUsData.features?.forEach((f) => { f.icon = resolveMedia(f.icon, mediaMap); });
  }
  statsData?.stats_items?.forEach((item) => { item.icon = resolveMedia(item.icon, mediaMap); });
  if (resumeData) {
    resumeData.right_icon = resolveMedia(resumeData.right_icon, mediaMap);
    resumeData.features?.forEach((f) => { f.icon = resolveMedia(f.icon, mediaMap); });
  }
  [ctaData, cta1Data].forEach(cta => {
    if (cta) {
      cta.sub_heading_icon = resolveMedia(cta.sub_heading_icon, mediaMap);
      cta.icon = resolveMedia(cta.icon, mediaMap);
      cta.info_items?.forEach(item => { item.icon = resolveMedia(item.icon, mediaMap); });
    }
  });
  if (blogsSection) {
    blogsSection.sub_heading_image = resolveMedia(blogsSection.sub_heading_image, mediaMap);
    blogsSection.sub_heading_icon = resolveMedia(blogsSection.sub_heading_icon, mediaMap);
  }
  if (mySkills) {
    mySkills.sub_heading_image = resolveMedia(mySkills.sub_heading_image, mediaMap);
    mySkills.sub_heading_icon = resolveMedia(mySkills.sub_heading_icon, mediaMap);
  }
  if (tipsSection) {
    tipsSection.sub_heading_image = resolveMedia(tipsSection.sub_heading_image, mediaMap);
    tipsSection.sub_heading_icon = resolveMedia(tipsSection.sub_heading_icon, mediaMap);
  }
  if (cta2Data) {
    cta2Data.sub_heading_image = resolveMedia(cta2Data.sub_heading_image, mediaMap);
    cta2Data.stats_grid?.forEach((item) => { item.icon = resolveMedia(item.icon, mediaMap); });
    cta2Data.seo_links?.forEach((item) => { item.icon = resolveMedia(item.icon, mediaMap); });
  }
  if (tutorialsSection) {
    tutorialsSection.sub_heading_image = resolveMedia(tutorialsSection.sub_heading_image, mediaMap);
    tutorialsSection.sub_heading_icon = resolveMedia(tutorialsSection.sub_heading_icon, mediaMap);
    tutorialsSection.sidebar_cards?.forEach((card) => { card.icon = resolveMedia(card.icon, mediaMap); });
  }
  if (contactSection) {
    contactSection.sub_heading_image = resolveMedia(contactSection.sub_heading_image, mediaMap);
    contactSection.sub_heading_icon = resolveMedia(contactSection.sub_heading_icon, mediaMap);
    contactSection.contact_info?.forEach((item) => { item.icon = resolveMedia(item.icon, mediaMap); });
    contactSection.social_links?.forEach((item) => { item.icon = resolveMedia(item.icon, mediaMap); });
  }
  if (sourceCodeSection) {
    sourceCodeSection.sub_heading_image = resolveMedia(sourceCodeSection.sub_heading_image, mediaMap);
    sourceCodeSection.sub_heading_icon = resolveMedia(sourceCodeSection.sub_heading_icon, mediaMap);
    sourceCodeSection.cta_badge_icon = resolveMedia(sourceCodeSection.cta_badge_icon, mediaMap);
    sourceCodeSection.cta_features?.forEach((feature) => { feature.icon = resolveMedia(feature.icon, mediaMap); });
  }
  if (faqSection) {
    faqSection.sub_heading_image = resolveMedia(faqSection.sub_heading_image, mediaMap);
    faqSection.sub_heading_icon = resolveMedia(faqSection.sub_heading_icon, mediaMap);
  }

  sourceProjects.forEach((project) => {
    if (!project.acf || Array.isArray(project.acf)) {
      project.acf = { thumbnail: '', difficulty_level: '', description: '', view_link: '', download_link: '', downloads: '', rating: '' };
    }
    const acf = project.acf!;
    acf.thumbnail = resolveMedia(acf.thumbnail, mediaMap) || project._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  });

  return { banner, skills, about_us: aboutUsData, stats: statsData, resume: resumeData, portfolio: portfolioData, cta: ctaData, cta1: cta1Data, my_skills: mySkills, blogs_section: blogsSection, tips_section: tipsSection, cta_2: cta2Data, tutorials_section: tutorialsSection, contact_section: contactSection, source_code_section: sourceCodeSection, faq_section: faqSection, source_projects: sourceProjects };
}

