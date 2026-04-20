import { PageData, BannerSlide, ACFSkill, ACFAboutUs, ACFStats, ACFResume, ACFPortfolio, ACFCTA, ACFSkillsSection, ACFBlogsSection, ACFTipsSection, ACFCTA2, ACFTutorialsSection, ACFContactSection, ACFSourceCodeSection, WPSourceCodeItem, ACFFaqSection } from "@/types/acf";

interface WPMedia {
  id: number;
  source_url: string;
}

export async function getHome(): Promise<{ banner: BannerSlide[], skills: ACFSkill[], about_us: ACFAboutUs | null, stats: ACFStats | null, resume: ACFResume | null, portfolio: ACFPortfolio | null, cta: ACFCTA | null, cta1: ACFCTA | null, my_skills: ACFSkillsSection | null, blogs_section: ACFBlogsSection | null, tips_section: ACFTipsSection | null, cta_2: ACFCTA2 | null, tutorials_section: ACFTutorialsSection | null, contact_section: ACFContactSection | null, source_code_section: ACFSourceCodeSection | null, faq_section: ACFFaqSection | null, source_projects: WPSourceCodeItem[] }> {
  const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!baseUrl) {
    throw new Error("WP API URL not defined in .env");
  }

  try {
    // Fetch Page 2 which contains our ACF fields
    const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages/2?_fields=acf`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch page data:", res.status);
      return { banner: [], skills: [], about_us: null, stats: null, resume: null, portfolio: null, cta: null, cta1: null, my_skills: null, blogs_section: null, tips_section: null, cta_2: null, tutorials_section: null, contact_section: null, source_code_section: null, faq_section: null, source_projects: [] };
    }

    const data: PageData = await res.json();
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

  // Fetch Source Code Projects
  let sourceProjects: WPSourceCodeItem[] = [];
  try {
    const projectsRes = await fetch(`${baseUrl}/wp-json/wp/v2/source-code?_embed&per_page=100`, {
      next: { revalidate: 3600 },
    });
    if (projectsRes.ok) {
      sourceProjects = await projectsRes.json();
    }
  } catch (err) {
    console.error("Error fetching source code projects:", err);
  }

  // Collect all potential media IDs
  const mediaIds: number[] = [];
  
  banner.forEach((slide) => {
    if (slide.acf_fc_layout === "slide_1" && slide.skills_slider) {
      slide.skills_slider.forEach((s) => {
        if (typeof s.skills_icon === "number") mediaIds.push(s.skills_icon);
      });
    }
    if (slide.acf_fc_layout === "slide_3" && slide.creative_card) {
      slide.creative_card.forEach((c) => {
        if (typeof c.icon === "number") mediaIds.push(c.icon);
      });
    }
    if (slide.acf_fc_layout === "slide_4") {
      if (typeof slide.right_image === "number") mediaIds.push(slide.right_image);
      if (slide.features) {
        slide.features.forEach((f) => {
          if (typeof f.icon === "number") mediaIds.push(f.icon);
        });
      }
      if (slide.creative_card) {
        slide.creative_card.forEach((c) => {
          if (typeof c.icon === "number") mediaIds.push(c.icon);
        });
      }
    }
  });

  // Collect from Skills Repeater
  skills.forEach((s) => {
    if (typeof s.icon === "number") mediaIds.push(s.icon);
  });

  // Collect from About Us
  if (aboutUsData) {
    if (typeof aboutUsData.profile_image === "number") mediaIds.push(aboutUsData.profile_image);
    if (aboutUsData.features) {
      aboutUsData.features.forEach((f) => {
        if (typeof f.icon === "number") mediaIds.push(f.icon);
      });
    }
  }

  // Collect from Stats
  if (statsData?.stats_items) {
    statsData.stats_items.forEach(item => {
      if (typeof item.icon === "number") mediaIds.push(item.icon);
    });
  }

  // Collect from Resume
  if (resumeData) {
    if (typeof resumeData.right_icon === "number") mediaIds.push(resumeData.right_icon);
    if (resumeData.features) {
      resumeData.features.forEach((f) => {
        if (typeof f.icon === "number") mediaIds.push(f.icon);
      });
    }
  }

  // Collect from CTA
  if (ctaData) {
    if (typeof ctaData.sub_heading_icon === "number") mediaIds.push(ctaData.sub_heading_icon as number);
    if (typeof ctaData.icon === "number") mediaIds.push(ctaData.icon as number);
    if (ctaData.info_items) {
      ctaData.info_items.forEach(item => {
        if (typeof item.icon === "number") mediaIds.push(item.icon as number);
      });
    }
  }

  if (cta1Data) {
    if (typeof cta1Data.sub_heading_icon === "number") mediaIds.push(cta1Data.sub_heading_icon as number);
    if (typeof cta1Data.icon === "number") mediaIds.push(cta1Data.icon as number);
    if (cta1Data.info_items) {
      cta1Data.info_items.forEach(item => {
        if (typeof item.icon === "number") mediaIds.push(item.icon as number);
      });
    }
  }
  // Collect from Blogs Section
  if (blogsSection) {
    if (typeof blogsSection.sub_heading_image === "number") mediaIds.push(blogsSection.sub_heading_image);
    if (typeof blogsSection.sub_heading_icon === "number") mediaIds.push(blogsSection.sub_heading_icon as number);
  }

  // Collect from Skills Store Section
  if (mySkills) {
    if (typeof mySkills.sub_heading_image === "number") mediaIds.push(mySkills.sub_heading_image as number);
    if (typeof mySkills.sub_heading_icon === "number") mediaIds.push(mySkills.sub_heading_icon as number);
  }
  // Collect from Tips Section
  if (tipsSection) {
    if (typeof tipsSection.sub_heading_image === "number") mediaIds.push(tipsSection.sub_heading_image);
    if (typeof tipsSection.sub_heading_icon === "number") mediaIds.push(tipsSection.sub_heading_icon as number);
  }

  // Collect from CTA2
  if (cta2Data) {
    if (typeof cta2Data.sub_heading_image === "number") mediaIds.push(cta2Data.sub_heading_image);
    if (cta2Data.stats_grid) {
      cta2Data.stats_grid.forEach((item) => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
      });
    }
    if (cta2Data.seo_links) {
      cta2Data.seo_links.forEach((item) => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
      });
    }
  }

  // Collect from Tutorials Section
  if (tutorialsSection) {
    if (typeof tutorialsSection.sub_heading_image === "number") mediaIds.push(tutorialsSection.sub_heading_image);
    if (typeof tutorialsSection.sub_heading_icon === "number") mediaIds.push(tutorialsSection.sub_heading_icon as number);
    if (tutorialsSection.sidebar_cards) {
      tutorialsSection.sidebar_cards.forEach((card) => {
        if (typeof card.icon === "number") mediaIds.push(card.icon);
      });
    }
  }

  // Collect from Contact Section
  if (contactSection) {
    if (typeof contactSection.sub_heading_image === "number") mediaIds.push(contactSection.sub_heading_image);
    if (typeof contactSection.sub_heading_icon === "number") mediaIds.push(contactSection.sub_heading_icon as number);
    if (contactSection.contact_info) {
      contactSection.contact_info.forEach((item) => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
      });
    }
    if (contactSection.social_links) {
      contactSection.social_links.forEach((item) => {
        if (typeof item.icon === "number") mediaIds.push(item.icon);
      });
    }
  }

  // Collect from Source Code Section
  if (sourceCodeSection) {
    if (typeof sourceCodeSection.sub_heading_image === "number") mediaIds.push(sourceCodeSection.sub_heading_image as number);
    if (typeof sourceCodeSection.sub_heading_icon === "number") mediaIds.push(sourceCodeSection.sub_heading_icon as number);
    if (typeof sourceCodeSection.cta_badge_icon === "number") mediaIds.push(sourceCodeSection.cta_badge_icon);
    if (sourceCodeSection.cta_features) {
      sourceCodeSection.cta_features.forEach((feature) => {
        if (typeof feature.icon === "number") mediaIds.push(feature.icon);
      });
    }
  }
  
  if (faqSection) {
    if (typeof faqSection.sub_heading_image === "number") mediaIds.push(faqSection.sub_heading_image);
    if (typeof faqSection.sub_heading_icon === "number") mediaIds.push(faqSection.sub_heading_icon as number);
  }

  // Collect from Source Projects
  sourceProjects.forEach((project) => {
    if (project.acf && typeof project.acf.thumbnail === "number") {
      mediaIds.push(project.acf.thumbnail);
    }
    if (project.featured_media && typeof project.featured_media === "number") {
      mediaIds.push(project.featured_media);
    }
  });

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

      // Apply URLs back to banner
      banner.forEach((slide) => {
        if (slide.acf_fc_layout === "slide_1" && slide.skills_slider) {
          slide.skills_slider.forEach((s) => {
            if (typeof s.skills_icon === "number" && mediaMap[s.skills_icon]) {
              s.skills_icon = mediaMap[s.skills_icon];
            }
          });
        }
        if (slide.acf_fc_layout === "slide_3" && slide.creative_card) {
          slide.creative_card.forEach((c) => {
            if (typeof c.icon === "number" && mediaMap[c.icon]) {
              c.icon = mediaMap[c.icon];
            }
          });
        }
        if (slide.acf_fc_layout === "slide_4") {
          if (typeof slide.right_image === "number" && mediaMap[slide.right_image]) {
            slide.right_image = mediaMap[slide.right_image as number];
          }
          if (slide.features) {
            slide.features.forEach((f) => {
              if (typeof f.icon === "number" && mediaMap[f.icon]) {
                f.icon = mediaMap[f.icon];
              }
            });
          }
          if (slide.creative_card) {
            slide.creative_card.forEach((c) => {
              if (typeof c.icon === "number" && mediaMap[c.icon]) {
                c.icon = mediaMap[c.icon];
              }
            });
          }
        }
      });

      // Apply URLs back to skills repeater
      skills.forEach((s) => {
        if (typeof s.icon === "number" && mediaMap[s.icon]) {
          s.icon = mediaMap[s.icon];
        } else if (typeof s.icon === 'object' && s.icon.url) {
          s.icon = s.icon.url;
        }
      });

      // Apply URLs back to about us
      if (aboutUsData) {
        if (typeof aboutUsData.profile_image === "number" && mediaMap[aboutUsData.profile_image]) {
          aboutUsData.profile_image = mediaMap[aboutUsData.profile_image];
        } else if (typeof aboutUsData.profile_image === 'object' && aboutUsData.profile_image.url) {
          aboutUsData.profile_image = aboutUsData.profile_image.url;
        }

        if (aboutUsData.features) {
          aboutUsData.features.forEach((f) => {
            if (typeof f.icon === "number" && mediaMap[f.icon]) {
              f.icon = mediaMap[f.icon];
            } else if (typeof f.icon === 'object' && f.icon.url) {
              f.icon = f.icon.url;
          }
          });
        }
      }

      // Apply URLs back to stats
      if (statsData?.stats_items) {
        statsData.stats_items.forEach((item) => {
          if (typeof item.icon === "number" && mediaMap[item.icon]) {
            item.icon = mediaMap[item.icon];
          } else if (typeof item.icon === 'object' && item.icon.url) {
            item.icon = item.icon.url;
          }
        });
      }

      // Apply URLs back to resume
      if (resumeData) {
        if (typeof resumeData.right_icon === "number" && mediaMap[resumeData.right_icon]) {
          resumeData.right_icon = mediaMap[resumeData.right_icon];
        } else if (typeof resumeData.right_icon === 'object' && resumeData.right_icon.url) {
          resumeData.right_icon = resumeData.right_icon.url;
        }

        if (resumeData.features) {
          resumeData.features.forEach((f) => {
            if (typeof f.icon === "number" && mediaMap[f.icon]) {
              f.icon = mediaMap[f.icon];
            } else if (typeof f.icon === 'object' && f.icon.url) {
              f.icon = f.icon.url;
            }
          });
        }
      }

      // Apply URLs back to CTA
      if (ctaData) {
        if (typeof ctaData.sub_heading_icon === "number" && mediaMap[ctaData.sub_heading_icon as number]) {
          ctaData.sub_heading_icon = mediaMap[ctaData.sub_heading_icon as number];
        } else if (typeof ctaData.sub_heading_icon === 'object' && ctaData.sub_heading_icon && (ctaData.sub_heading_icon as { url: string }).url) {
          ctaData.sub_heading_icon = (ctaData.sub_heading_icon as { url: string }).url;
        }
        
        if (typeof ctaData.icon === "number" && mediaMap[ctaData.icon as number]) {
          ctaData.icon = mediaMap[ctaData.icon as number];
        } else if (typeof ctaData.icon === 'object' && ctaData.icon && (ctaData.icon as { url: string }).url) {
          ctaData.icon = (ctaData.icon as { url: string }).url;
        }

        if (ctaData.info_items) {
          ctaData.info_items.forEach(item => {
            if (typeof item.icon === "number" && mediaMap[item.icon as number]) {
              item.icon = mediaMap[item.icon as number];
            } else if (typeof item.icon === 'object' && item.icon && (item.icon as { url: string }).url) {
              item.icon = (item.icon as { url: string }).url;
            }
          });
        }
      }

      if (cta1Data) {
        if (typeof cta1Data.sub_heading_icon === 'number' && mediaMap[cta1Data.sub_heading_icon as number]) {
          cta1Data.sub_heading_icon = mediaMap[cta1Data.sub_heading_icon as number];
        } else if (typeof cta1Data.sub_heading_icon === 'object' && cta1Data.sub_heading_icon && (cta1Data.sub_heading_icon as { url: string }).url) {
          cta1Data.sub_heading_icon = (cta1Data.sub_heading_icon as { url: string }).url;
        }

        if (typeof cta1Data.icon === 'number' && mediaMap[cta1Data.icon as number]) {
          cta1Data.icon = mediaMap[cta1Data.icon as number];
        } else if (typeof cta1Data.icon === 'object' && cta1Data.icon && (cta1Data.icon as { url: string }).url) {
          cta1Data.icon = (cta1Data.icon as { url: string }).url;
        }

        if (cta1Data.info_items) {
          cta1Data.info_items.forEach(item => {
            if (typeof item.icon === "number" && mediaMap[item.icon as number]) {
              item.icon = mediaMap[item.icon as number];
            } else if (typeof item.icon === 'object' && item.icon && (item.icon as { url: string }).url) {
              item.icon = (item.icon as { url: string }).url;
            }
          });
        }
      }

      // Apply URLs back to Skills Store Section
      if (mySkills) {
        if (typeof mySkills.sub_heading_image === "number" && mediaMap[mySkills.sub_heading_image as number]) {
          mySkills.sub_heading_image = mediaMap[mySkills.sub_heading_image as number];
        } else if (typeof mySkills.sub_heading_image === 'object' && mySkills.sub_heading_image && (mySkills.sub_heading_image as { url: string }).url) {
          mySkills.sub_heading_image = (mySkills.sub_heading_image as { url: string }).url;
        }

        if (typeof mySkills.sub_heading_icon === "number" && mediaMap[mySkills.sub_heading_icon as number]) {
          mySkills.sub_heading_icon = mediaMap[mySkills.sub_heading_icon as number];
        } else if (typeof mySkills.sub_heading_icon === 'object' && mySkills.sub_heading_icon && (mySkills.sub_heading_icon as { url: string }).url) {
          mySkills.sub_heading_icon = (mySkills.sub_heading_icon as { url: string }).url;
        }
      }
      // Apply URLs back to Blogs Section
      if (blogsSection) {
        if (typeof blogsSection.sub_heading_image === "number" && mediaMap[blogsSection.sub_heading_image as number]) {
          blogsSection.sub_heading_image = mediaMap[blogsSection.sub_heading_image as number];
        } else if (typeof blogsSection.sub_heading_image === 'object' && blogsSection.sub_heading_image.url) {
          blogsSection.sub_heading_image = blogsSection.sub_heading_image.url;
        }

        if (typeof blogsSection.sub_heading_icon === "number" && mediaMap[blogsSection.sub_heading_icon as number]) {
          blogsSection.sub_heading_icon = mediaMap[blogsSection.sub_heading_icon as number];
        } else if (typeof blogsSection.sub_heading_icon === 'object' && blogsSection.sub_heading_icon && (blogsSection.sub_heading_icon as { url: string }).url) {
          blogsSection.sub_heading_icon = (blogsSection.sub_heading_icon as { url: string }).url;
        }
      }
      // Apply URLs back to Tips Section
      if (tipsSection) {
        if (typeof tipsSection.sub_heading_image === "number" && mediaMap[tipsSection.sub_heading_image as number]) {
          tipsSection.sub_heading_image = mediaMap[tipsSection.sub_heading_image as number];
        } else if (typeof tipsSection.sub_heading_image === 'object' && tipsSection.sub_heading_image.url) {
          tipsSection.sub_heading_image = tipsSection.sub_heading_image.url;
        }

        if (typeof tipsSection.sub_heading_icon === "number" && mediaMap[tipsSection.sub_heading_icon as number]) {
          tipsSection.sub_heading_icon = mediaMap[tipsSection.sub_heading_icon as number];
        } else if (typeof tipsSection.sub_heading_icon === 'object' && tipsSection.sub_heading_icon && (tipsSection.sub_heading_icon as { url: string }).url) {
          tipsSection.sub_heading_icon = (tipsSection.sub_heading_icon as { url: string }).url;
        }
      }
      // Apply URLs back to blogs if it's there
      if (data.acf?.blogs) {
        if (typeof data.acf.blogs.sub_heading_image === "number" && mediaMap[data.acf.blogs.sub_heading_image as number]) {
          data.acf.blogs.sub_heading_image = mediaMap[data.acf.blogs.sub_heading_image as number];
        } else if (typeof data.acf.blogs.sub_heading_image === 'object' && data.acf.blogs.sub_heading_image.url) {
          data.acf.blogs.sub_heading_image = data.acf.blogs.sub_heading_image.url;
        }
      }
      // Apply URLs back to CTA2
      if (cta2Data) {
        if (typeof cta2Data.sub_heading_image === "number" && mediaMap[cta2Data.sub_heading_image as number]) {
          cta2Data.sub_heading_image = mediaMap[cta2Data.sub_heading_image as number];
        } else if (typeof cta2Data.sub_heading_image === 'object' && cta2Data.sub_heading_image.url) {
          cta2Data.sub_heading_image = cta2Data.sub_heading_image.url;
        }

        if (cta2Data.stats_grid) {
          cta2Data.stats_grid.forEach((item) => {
            if (typeof item.icon === "number" && mediaMap[item.icon]) {
              item.icon = mediaMap[item.icon];
            } else if (typeof item.icon === 'object' && item.icon.url) {
              item.icon = item.icon.url;
            }
          });
        }

        if (cta2Data.seo_links) {
          cta2Data.seo_links.forEach((item) => {
            if (typeof item.icon === "number" && mediaMap[item.icon]) {
              item.icon = mediaMap[item.icon];
            } else if (typeof item.icon === 'object' && item.icon.url) {
              item.icon = item.icon.url;
            }
          });
        }
      }

      // Apply URLs back to Tutorials
      if (tutorialsSection) {
        if (typeof tutorialsSection.sub_heading_image === "number" && mediaMap[tutorialsSection.sub_heading_image as number]) {
          tutorialsSection.sub_heading_image = mediaMap[tutorialsSection.sub_heading_image as number];
        } else if (typeof tutorialsSection.sub_heading_image === 'object' && tutorialsSection.sub_heading_image.url) {
          tutorialsSection.sub_heading_image = tutorialsSection.sub_heading_image.url;
        }

        if (typeof tutorialsSection.sub_heading_icon === "number" && mediaMap[tutorialsSection.sub_heading_icon as number]) {
          tutorialsSection.sub_heading_icon = mediaMap[tutorialsSection.sub_heading_icon as number];
        } else if (typeof tutorialsSection.sub_heading_icon === 'object' && tutorialsSection.sub_heading_icon && (tutorialsSection.sub_heading_icon as { url: string }).url) {
          tutorialsSection.sub_heading_icon = (tutorialsSection.sub_heading_icon as { url: string }).url;
        }

        if (tutorialsSection.sidebar_cards) {
          tutorialsSection.sidebar_cards.forEach((card) => {
            if (typeof card.icon === "number" && mediaMap[card.icon]) {
              card.icon = mediaMap[card.icon];
            } else if (typeof card.icon === 'object' && card.icon.url) {
              card.icon = card.icon.url;
            }
          });
        }
      }

      // Apply URLs back to Contact
      if (contactSection) {
        if (typeof contactSection.sub_heading_image === "number" && mediaMap[contactSection.sub_heading_image as number]) {
          contactSection.sub_heading_image = mediaMap[contactSection.sub_heading_image as number];
        } else if (typeof contactSection.sub_heading_image === 'object' && contactSection.sub_heading_image && (contactSection.sub_heading_image as { url: string }).url) {
          contactSection.sub_heading_image = (contactSection.sub_heading_image as { url: string }).url;
        }

        if (typeof contactSection.sub_heading_icon === "number" && mediaMap[contactSection.sub_heading_icon as number]) {
          contactSection.sub_heading_icon = mediaMap[contactSection.sub_heading_icon as number];
        } else if (typeof contactSection.sub_heading_icon === 'object' && contactSection.sub_heading_icon && (contactSection.sub_heading_icon as { url: string }).url) {
          contactSection.sub_heading_icon = (contactSection.sub_heading_icon as { url: string }).url;
        }

        if (contactSection.contact_info) {
          contactSection.contact_info.forEach((item) => {
            if (typeof item.icon === "number" && mediaMap[item.icon]) {
              item.icon = mediaMap[item.icon];
            } else if (typeof item.icon === 'object' && item.icon.url) {
              item.icon = item.icon.url;
            }
          });
        }

        if (contactSection.social_links) {
          contactSection.social_links.forEach((item) => {
            if (typeof item.icon === "number" && mediaMap[item.icon]) {
              item.icon = mediaMap[item.icon];
            } else if (typeof item.icon === 'object' && item.icon.url) {
              item.icon = item.icon.url;
            }
          });
        }
      }

      // Apply URLs back to Source Code Section
      if (sourceCodeSection) {
        if (typeof sourceCodeSection.sub_heading_image === "number" && mediaMap[sourceCodeSection.sub_heading_image as number]) {
          sourceCodeSection.sub_heading_image = mediaMap[sourceCodeSection.sub_heading_image as number];
        } else if (typeof sourceCodeSection.sub_heading_image === 'object' && sourceCodeSection.sub_heading_image && (sourceCodeSection.sub_heading_image as { url: string }).url) {
          sourceCodeSection.sub_heading_image = (sourceCodeSection.sub_heading_image as { url: string }).url;
        }

        if (typeof sourceCodeSection.sub_heading_icon === "number" && mediaMap[sourceCodeSection.sub_heading_icon as number]) {
          sourceCodeSection.sub_heading_icon = mediaMap[sourceCodeSection.sub_heading_icon as number];
        } else if (typeof sourceCodeSection.sub_heading_icon === 'object' && sourceCodeSection.sub_heading_icon && (sourceCodeSection.sub_heading_icon as { url: string }).url) {
          sourceCodeSection.sub_heading_icon = (sourceCodeSection.sub_heading_icon as { url: string }).url;
        }

        if (typeof sourceCodeSection.cta_badge_icon === "number" && mediaMap[sourceCodeSection.cta_badge_icon]) {
          sourceCodeSection.cta_badge_icon = mediaMap[sourceCodeSection.cta_badge_icon];
        } else if (typeof sourceCodeSection.cta_badge_icon === 'object' && sourceCodeSection.cta_badge_icon.url) {
          sourceCodeSection.cta_badge_icon = sourceCodeSection.cta_badge_icon.url;
        }

        if (sourceCodeSection.cta_features) {
          sourceCodeSection.cta_features.forEach((feature) => {
            if (typeof feature.icon === "number" && mediaMap[feature.icon]) {
              feature.icon = mediaMap[feature.icon];
            } else if (typeof feature.icon === 'object' && feature.icon.url) {
              feature.icon = feature.icon.url;
            }
          });
        }
      }
      
      if (faqSection) {
        if (typeof faqSection.sub_heading_image === "number" && mediaMap[faqSection.sub_heading_image as number]) {
          faqSection.sub_heading_image = mediaMap[faqSection.sub_heading_image as number];
        } else if (typeof faqSection.sub_heading_image === 'object' && faqSection.sub_heading_image && (faqSection.sub_heading_image as { url: string }).url) {
          faqSection.sub_heading_image = (faqSection.sub_heading_image as { url: string }).url;
        }

        if (typeof faqSection.sub_heading_icon === "number" && mediaMap[faqSection.sub_heading_icon as number]) {
          faqSection.sub_heading_icon = mediaMap[faqSection.sub_heading_icon as number];
        } else if (typeof faqSection.sub_heading_icon === 'object' && faqSection.sub_heading_icon && (faqSection.sub_heading_icon as { url: string }).url) {
          faqSection.sub_heading_icon = (faqSection.sub_heading_icon as { url: string }).url;
        }
      }

    }
  }

  // Always normalize source projects (even if media resolution skipped or failed)
  sourceProjects.forEach((project) => {
    // Ensure acf is a valid object. WP API sometimes returns [] for empty ACF.
    const hasValidAcf = project.acf && typeof project.acf === 'object' && !Array.isArray(project.acf);

    if (!hasValidAcf) {
      project.acf = { 
        thumbnail: '',
        difficulty_level: '',
        description: '',
        view_link: '',
        download_link: '',
        downloads: '',
        rating: ''
      };
    } 

    // Now project.acf is guaranteed to be a valid object (either original or defaults)
    const acf = project.acf!; 

    // Fill in missing properties for UI
    if (!acf.downloads) acf.downloads = '';
    if (!acf.rating) acf.rating = '';
    if (!acf.difficulty_level) acf.difficulty_level = '';
    if (!acf.view_link) acf.view_link = '';
    if (!acf.download_link) acf.download_link = '';

    // Find the best image source (WP Featured Image first)
    const featuredUrl = (project.featured_media && mediaMap[project.featured_media]) || 
                        project._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    if (featuredUrl) {
      acf.thumbnail = featuredUrl;
    } else if (acf.thumbnail) {
      // Fallback to ACF thumbnail resolution if no featured image is set
      if (typeof acf.thumbnail === "number" && mediaMap[acf.thumbnail]) {
        acf.thumbnail = mediaMap[acf.thumbnail];
      } else if (typeof acf.thumbnail === 'object' && acf.thumbnail && 'url' in acf.thumbnail) {
        acf.thumbnail = (acf.thumbnail as { url: string }).url;
      }
    }
  });

  return { banner, skills, about_us: aboutUsData, stats: statsData, resume: resumeData, portfolio: portfolioData, cta: ctaData, cta1: cta1Data, my_skills: mySkills, blogs_section: blogsSection, tips_section: tipsSection, cta_2: cta2Data, tutorials_section: tutorialsSection, contact_section: contactSection, source_code_section: sourceCodeSection, faq_section: faqSection, source_projects: sourceProjects };
} catch (err) {
  console.error("getHome fetch error:", err);
  return { banner: [], skills: [], about_us: null, stats: null, resume: null, portfolio: null, cta: null, cta1: null, my_skills: null, blogs_section: null, tips_section: null, cta_2: null, tutorials_section: null, contact_section: null, source_code_section: null, faq_section: null, source_projects: [] };
}
}
