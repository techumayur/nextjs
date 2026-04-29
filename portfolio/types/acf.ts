export type ACFImage = string | number | { url: string };
export type ACFLink = { title: string; url: string; target: string; };

export interface ACFSlider1 {
  acf_fc_layout: 'slide_1';
  sub_heading: string;
  heading: string;
  content: string;
  skills_slider: {
    skills_icon: ACFImage;
  }[];
  primary_button_link: string;
  primary_button_label: string;
  secondory_button_link: string;
  secondory_button_label: string;
  desktop_link: string;
  ipad_link: string;
  mobile_link: string;
}

export interface ACFSlider2 {
  acf_fc_layout: 'slide_2';
  sub_heading: string;
  heading: string;
  content: string;
  counter: {
    number: string;
    counter_text: string;
  }[];
  primary_button_link: string;
  primary_button_label: string;
  secondory_button_link: string;
  secondory_button_label: string;
  banner_right: {
    indexhtml: string;
    stylecss: string;
    scriptjs: string;
  };
}

export interface ACFSlider3 {
  acf_fc_layout: 'slide_3';
  sub_heading: string;
  heading: string;
  content: string;
  counter: {
    number: string;
    counter_text: string;
  }[];
  primary_button_link: string;
  primary_button_label: string;
  secondory_button_link: string;
  secondory_button_label: string;
  creative_card: {
    icon: ACFImage;
    heading: string;
    content: string;
    tag: string;
  }[];
}

export interface ACFSlider4 {
  acf_fc_layout: 'slide_4';
  sub_heading: string;
  heading: string;
  content: string;
  features: {
    icon: ACFImage;
    feature_text: string;
  }[];
  primary_button_link: string;
  primary_button_label: string;
  secondory_button_link: string;
  secondory_button_label: string;
  creative_card: {
    icon: string | number | { url: string };
    heading: string;
    sub_heading: string;
  }[];
  right_image: ACFImage;
}

export type BannerSlide = ACFSlider1 | ACFSlider2 | ACFSlider3 | ACFSlider4;

export interface ACFSkill {
  name: string;
  icon: string | number | { url: string };
}

export interface ACFAboutUs {
  sub_heading: string;
  profile_image: ACFImage;
  name: string;
  designation: string;
  description: string;
  features: {
    icon: ACFImage;
    title: string;
  }[];
  primary_button_label: string;
  primary_button_link: string;
  secondary_button_label: string;
  secondary_button_link: string;
  terminal_role: string;
  terminal_name: string;
  terminal_experience: string;
  terminal_location: string;
  terminal_email: string;
  terminal_skills: {
    skill: string;
  }[];
}

export interface ACFStats {
  sub_heading: string;
  heading: string;
  description: string;
  stats_items: {
    icon: ACFImage;
    number: number;
    suffix: string;
    title: string;
    stat_description: string;
  }[];
}

export interface ACFResume {
  badge_text: string;
  title: string;
  subtitle: string;
  stats: {
    number: number;
    suffix: string;
    label: string;
  }[];
  right_icon: ACFImage;
  right_heading: string;
  right_text: string;
  primary_btn_label: string;
  primary_btn_link: string;
  secondary_btn_label: string;
  secondary_btn_link: string;
  features: {
    icon: ACFImage;
    text: string;
  }[];
}

export interface ACFPortfolio {
  sub_heading: string;
  heading: string;
  description: string;
  button_label: string;
  button_link: string;
  filter_title: string;
  filter_subtitle: string;
}

export interface WPTaxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface ACFPortfolioDetails {
  banner_image?: ACFImage;
  heading__content?: {
    sub_heading: string;
    heading: string;
    highlight_text: string;
    description: string;
    my_role?: {
      contribution: string;
      technologies: string;
      deliverables: string;
    };
    live_link: string;
    terminal?: {
      title: string;
      lines: {
        text: string;
        type: 'info' | 'command' | 'output';
      }[];
      placeholder: string;
      commands: {
        command: string;
        output: string;
      }[];
    };
  };
  project_overview?: {
    sub_heading: string;
    heading: string;
    highlight_text: string;
    description?: string;
    my_role?: {
      contribution: string;
      technologies: string;
      deliverables: string;
    };
    live_link: string;
    terminal?: {
      title: string;
      lines: {
        text: string;
        type: 'info' | 'command' | 'output';
      }[];
      placeholder: string;
      commands: {
        command: string;
        output: string;
      }[];
    };
  };
  execution_process?: {
    sub_heading: string;
    heading: string;
    highlight_text: string;
    description: string;
    steps: {
      number: string;
      title: string;
      description: string;
      icon_type: 'svg' | 'image';
      icon_svg: string;
      icon_image: ACFImage;
    }[];
  };
  key_features?: {
    sub_heading: string;
    heading: string;
    highlight_text: string;
    description: string;
    features: {
      title: string;
      description: string;
      icon_type: 'svg' | 'image';
      icon_svg: string;
      icon_image: string | number | { url: string };
      glow_class: string;
    }[];
  };
  gallery?: {
    sub_heading?: string;
    heading?: string;
    highlight_text?: string;
    description?: string;
    slides?: {
      image: ACFImage;
      caption?: string;
      step?: string;
    }[];
  } | {
    image: string | number | { url: string };
    caption?: string;
    step?: string;
  }[];
  project_gallery?: {
    sub_heading?: string;
    heading?: string;
    highlight_text?: string;
    description?: string;
    slides?: {
      image: ACFImage;
      caption?: string;
      step?: string;
    }[];
  } | {
    image: string | number | { url: string };
    caption?: string;
    step?: string;
  }[];
  technology_used?: {
    sub_heading?: string;
    heading?: string;
    description?: string;
    technologies?: {
      name: string;
      logo: string | number | { url: string };
      glow_class: string;
    }[];
  } | {
    name: string;
    logo: string | number | { url: string };
    glow_class: string;
  }[];
  project_technology?: {
    sub_heading?: string;
    heading?: string;
    description?: string;
    technologies?: {
      name: string;
      logo: string | number | { url: string };
      glow_class: string;
    }[];
  } | {
    name: string;
    logo: string | number | { url: string };
    glow_class: string;
  }[];
  brand_guidelines?: {
    sub_heading: string;
    sub_heading_icon: string;
    heading: string;
    highlight_text: string;
    description: string;
    brand_guidelines_pdf: ACFImage;
    download_text: string;
    settings?: {
      enable_sound: boolean;
      auto_sound: boolean;
      show_controls: boolean;
    };
  };
  cta?: {
    badge_text: string;
    badge_icon?: ACFImage;
    heading: string;
    highlight_text: string;
    description: string;
    buttons?: {
      primary_text: string;
      primary_link: string;
      secondary_text: string;
      secondary_link: string;
    };
    cards: {
      title: string;
      text: string;
      icon: ACFImage;
      style: string;
    }[];
  };
  taxonomies?: {
    project_focus: string;
    keywords: {
      text: string;
      link: string;
    }[];
    stats?: {
      number: string;
      text: string;
    };
  };
  faq?: {
    sub_heading?: string;
    sub_heading_icon?: string;
    heading?: string;
    highlight_text?: string;
    description?: string;
    faqs?: {
      question: string;
      answer: string;
      icon: string;
    }[];
  };
  faqs?: {
    sub_heading?: string;
    sub_heading_icon?: string;
    heading?: string;
    highlight_text?: string;
    description?: string;
    faqs?: {
      question: string;
      answer: string;
      icon: string;
    }[];
  };
}

export interface WPPortfolioItem {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  'portfolio-taxonomy'?: number[];
  content?: { rendered: string };
  excerpt?: { rendered: string };
  acf?: ACFPortfolioDetails;
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          [key: string]: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
    }[];
    'wp:term'?: WPTerm[][];
  };
}

export interface WPSkill {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  acf: {
    icon: string | { url: string };
    badge?: string;
    description: string;
    featured?: boolean;
    tags?: string;
  };
  'my-skill-taxonomy'?: number[];
  content?: { rendered: string };
  excerpt?: { rendered: string };
}

export interface WPSkillTaxonomy {
  id: number;
  name: string;
  slug: string;
  acf?: {
    icon?: string | { url: string };
  };
}

export interface ACFSkillsSection {
  sub_heading?: string;
  sub_heading_image?: string | number | { url: string };
  sub_heading_icon?: string | number | { url: string };
  title?: string;
  subtitle?: string;
  profile_name?: string;
  profile_role?: string;
}

export interface ACFCTA {
  icon?: ACFImage;
  icon_label?: string;
  heading?: string;
  content?: string;
  primary_button_label?: string;
  primary_button_link?: string;
  secondary_button_label?: string;
  secondary_button_link?: string;
  info_items?: {
    icon?: ACFImage;
    value: string;
    label: string;
  }[];
  right_side_subtitle?: string;
  right_side_title?: string;
  right_side_description?: string;
  
  // Backward compatibility fallbacks if needed
  title?: string;
  description?: string;
  sub_heading?: string;
  sub_heading_icon?: ACFImage;
}

export interface ACFBlogsSection {
  sub_heading?: string;
  sub_heading_image?: ACFImage;
  sub_heading_icon?: ACFImage;
  title?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
}

export interface WPBlogPost {
  id: number;
  date: string;
  modified: string;
  link: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  'tips-and-trick-taxonomy'?: number[];
  'tips-and-trick-tags'?: number[];
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          [key: string]: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
    }[];
    author?: {
      name: string;
      avatar_urls?: Record<string, string>;
    }[];
    'wp:term'?: WPTerm[][];
  };
  acf?: {
    views_count?: string;
    banner_section?: {
      sub_heading?: string;
      title?: string;
      description?: string;
    };
    meta_section?: {
      author_role?: string;
      reading_time?: string;
      level?: string;
    };
    content_heading?: string;
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
}

export interface ACFTipsSection {
  sub_heading?: string;
  sub_heading_image?: ACFImage;
  sub_heading_icon?: ACFImage;
  title?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
}

export interface ACFCTA2 {
  sub_heading?: string;
  sub_heading_image?: string | number | { url: string };
  sub_heading_icon?: string | number | { url: string };
  sub_heading_text?: string;
  title?: string;
  description?: string;
  primary_button_label?: string;
  primary_button_link?: string;
  secondary_button_label?: string;
  secondary_button_link?: string;
  stats_grid?: {
    icon: string | number | { url: string };
    title: string;
    text: string;
  }[];
  seo_links?: {
    icon: ACFImage;
    label: string;
    link: string;
  }[];
}

export interface ACFTutorialsSection {
  sub_heading?: string;
  sub_heading_image?: string | number | { url: string };
  sub_heading_icon?: string | number | { url: string };
  title?: string;
  description?: string;
  sidebar_cards?: {
    title: string;
    icon: string | number | { url: string };
    stat_value: string;
    stat_label: string;
  }[];
}

export interface WPTutorial {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
  acf: {
    tutorial?: {
      links?: string;
      views?: string;
      likes?: string;
    };
    home_page?: {
      links?: string;
      views?: string;
      likes?: string;
    };
    video_url: string;
    links?: string | { url: string; views?: string; likes?: string; time_ago?: string; };
    thumbnail: ACFImage;
    duration?: string;
    level?: string;
    category?: string;
    views?: string;
    likes?: string;
    time_ago?: string;
    description?: string;
  };
  "tutorials-taxonomy"?: number[];
  "tutorials_taxonomy"?: number[];
  "tutorials-tag"?: number[];
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text: string;
    }[];
  };
}

export interface ACFContactSection {
  sub_heading?: string;
  sub_heading_image?: ACFImage;
  sub_heading_icon?: ACFImage;
  title?: string;
  description?: string;
  form_heading?: string;
  form_paragraph?: string;
  contact_info_heading?: string;
  contact_info_paragraph?: string;
  contact_info?: {
    icon: ACFImage;
    title: string;
    details: string;
    link?: string;
  }[];
  social_links?: {
    icon: ACFImage;
    label: string;
    link: string;
  }[];
}

export interface WPTutorialTaxonomy {
  id: number;
  name: string;
  slug: string;
  count?: number;
  acf?: {
    icon?: ACFImage;
    platform_label?: string;
  };
}

export interface ACFSourceCodeSection {
  sub_heading?: string;
  sub_heading_image?: string | number | { url: string };
  sub_heading_icon?: string | number | { url: string };
  title?: string;
  description?: string;
  cta_badge_text?: string;
  cta_badge_icon?: ACFImage;
  cta_title?: string;
  cta_description?: string;
  cta_button_label?: string;
  cta_button_link?: string;
  cta_stats?: {
    number: string;
    label: string;
  }[];
  cta_features?: {
    icon: ACFImage;
    title: string;
    description: string;
  }[];
}

export interface WPSourceCodeItem {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  featured_media?: number;
  'source-code-taxonomy'?: number[];
  'source-code-tag'?: number[];
  'source_code_taxonomy'?: number[];
  'source_code_tag'?: number[];
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text: string;
    }[];
    'wp:term'?: {
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
    }[][];
    author?: {
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls?: { [key: string]: string };
    }[];
  };
  acf?: {
    // Section Groups
    banner_section?: {
      difficulty_level: string;
      sub_heading: string;
      description: string;
      bg_image: string | number | { url: string };
      background_image?: string | number | { url: string };
    };
    heading_content?: {
      sub_heading: string;
      sub_heading_icon?: ACFImage;
      title: string;
      highlight_text: string;
      description: string;
      featured_image: string | number | { url: string };
    };
    license_section?: {
      type: string;
      view_link: string;
      download_link: string;
    };
    overview_section?: {
      title: string;
      content: string;
      detailed_content: string;
    };
    tech_bricks_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      heading: string;
      highlight_text: string;
      description: string;
      technologies: {
        name: string;
        tag: string;
        icon: ACFImage;
      }[];
    };
    architecture_section?: {
      grid: {
        title: string;
        subtitle: string;
        icon: string;
        size: 'small' | 'medium' | 'large';
      }[];
    };
    role_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      sub_heading_text: string;
      sub_heading_image: ACFImage;
      heading: string;
      highlight_text?: string;
      description: string;
      items: {
        year: string;
        title: string;
        icon: ACFImage;
        company: string;
        description: string;
      }[];
      contribution?: string;
      technologies?: string;
      deliverables?: string;
    };
    process_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      heading?: string;
      description?: string;
      steps: {
        number: string;
        title: string;
        description: string;
        icon?: ACFImage;
      }[];
    };
    features_section?: {
      sub_heading?: string;
      sub_heading_icon?: string;
      heading?: string;
      highlight_text?: string;
      description?: string;
      features: {
        title: string;
        description: string;
        icon_svg?: string;
        icon?: string;
      }[];
    };
    source_code_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      heading?: string;
      highlight_text?: string;
      description?: string;
      download_zip: string;
      github_url: string;
      entry_file_name?: string;
      entry_file_content?: string;
      readme_content?: string;
      editor_height?: string;
      stackblitz_template?: 'javascript' | 'typescript' | 'angular-cli' | 'create-react-app' | 'vue-cli' | 'node';
    };
    setup_section?: {
      steps: {
        title: string;
        description: string;
        code: string;
      }[];
    };
    usage_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      heading?: string;
      highlight_text?: string;
      description?: string;
      preview_image?: ACFImage;
      view_link_text?: string;
      live_link_button_link?: string;
    };
    gallery_section?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      bg_text?: string;
      heading?: string;
      highlight_text?: string;
      description?: string;
      gallery_items?: {
        image: ACFImage;
        caption?: string;
      }[];
      gallery?: number[]; // Backward compatibility for simple gallery fields
    };
    branding?: {
      sub_heading?: string;
      sub_heading_icon?: ACFImage;
      heading?: string;
      highlight_text?: string;
      description?: string;
      pdf_file?: ACFImage;
    };
    cta1?: ACFCTA;
    cta?: ACFCTA;
    cta_section?: ACFCTA;
    taxonomies_section?: {
      focus_text?: string;
      optimization_level?: string;
      edition?: string;
      highlight_title?: string;
    };

    // Fallbacks / Old fields
    heading?: string;
    sub_heading_text?: string;
    sub_heading_image?: ACFImage;
    items?: {
      year: string;
      title: string;
      icon: ACFImage;
      company: string;
      description: string;
    }[];
    contribution?: string;
    technologies?: string | { name: string; }[];
    deliverables?: string;
    thumbnail?: ACFImage;
    bg_image?: ACFImage;
    background_image?: ACFImage;
    difficulty_level?: string;
    description?: string;
    downloads?: string;
    download_count?: string;
    rating?: string;
    view_link?: string;
    download_link?: string;
    download_button?: string;
    banner_bg_image?: ACFImage;
    is_featured?: boolean;
    bento_size?: 'large' | 'medium' | 'small';
  };
}

export interface WPSourceCodeTaxonomy {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface ACFTipsPage {
  banner: {
    sub_heading?: string;
    sub_heading_image?: string | number | { url: string };
    title?: string;
    description?: string;
    background_image?: string | number | { url: string };
  };
  heading_section: {
    sub_heading?: string;
    sub_heading_image?: string | number | { url: string };
    title?: string;
    description?: string;
  };
  tips_section: {
    sub_heading?: string;
    sub_heading_image?: string | number | { url: string };
    title?: string;
    description?: string;
  };
}

export interface ACFFaqSection {
  sub_heading?: string;
  sub_heading_image?: string | number | { url: string };
  sub_heading_icon?: string | number | { url: string };
  title?: string;
  description?: string;
  faq_items?: {
    question: string;
    answer: string;
  }[];
}

export interface PageData {
  acf: {
    banner: BannerSlide[];
    skills: ACFSkill[];
    about_us?: ACFAboutUs;
    stats?: ACFStats;
    resume?: ACFResume;
    portfolio?: ACFPortfolio;
    cta?: ACFCTA;
    cta1?: ACFCTA;
    my_skills?: ACFSkillsSection;
    blogs_section?: ACFBlogsSection;
    blogs?: ACFBlogsSection;
    tips_section?: ACFTipsSection;
    tips?: ACFTipsSection;
    "tips_&_tricks"?: ACFTipsSection;
    cta2?: ACFCTA2;
    cta_2?: ACFCTA2;
    tutorials_section?: ACFTutorialsSection;
    tutorials?: ACFTutorialsSection;
    contact_section?: ACFContactSection;
    contact?: ACFContactSection;
    source_code_section?: ACFSourceCodeSection;
    source_code?: ACFSourceCodeSection;
    faq?: ACFFaqSection;
    faqs?: ACFFaqSection;
    faq_section?: ACFFaqSection;
  };
}

export interface ACFAboutPage {
  banner: {
    sub_heading_icon: string | number | { url: string };
    sub_heading: string;
    heading: string;
    description: string;
    background_image: ACFImage;
  };
  intro: {
    sub_heading_icon: ACFImage;
    sub_heading: string;
    title: string;
    profile_image: ACFImage;
    profile_name: string;
    profile_role: string;
    social_links: {
      label: string;
      icon: ACFImage;
      link: string;
      is_white: boolean;
    }[];
    resume_button_label: string;
    resume_button_link: string;
    story_icon: ACFImage;
    story_title: string;
    story_content: string;
    story_extra: string;
  };
  core_values: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    title: string;
    values: {
      icon: ACFImage;
      title: string;
      description: string;
      col_class: string;
    }[];
  };
  work_with_me: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    title: string;
    description: string;
    items: {
      icon: ACFImage;
      title: string;
      description: string;
      list: { text: string }[];
      size: 'bento-large' | 'bento-medium' | 'bento-small';
    }[];
    primary_button_label: string;
    primary_button_link: string;
    secondary_button_label: string;
    secondary_button_link: string;
  };
  cta: {
    sub_heading_icon?: ACFImage;
    icon: ACFImage;
    heading: string;
    description: string;
    primary_button_label: string;
    primary_button_link: string;
    secondary_button_label: string;
    secondary_button_link: string;
  };
  technical_skills: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    title: string;
    frontend_skills: {
      name: string;
      icon: ACFImage;
      level: string;
      color: string;
    }[];
    backend_skills: {
      name: string;
      icon: ACFImage;
      level: string;
      color: string;
    }[];
    seo_skills: {
      name: string;
      icon?: ACFImage;
      percentage: number;
      color: string;
      bg: string;
    }[];
    content_skills: {
      name: string;
      icon: ACFImage;
      level: string;
      color: string;
    }[];
    stats: {
      number: string;
      label: string;
    }[];
  };
  "certifications_&_achievements": {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    title: string;
    description: string;
    certifications: {
      type: 'large' | 'medium' | 'small';
      icon: string | number | { url: string };
      provider: string;
      year: string;
      title: string;
      description: string;
    }[];
  };
  career_timeline: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    title: string;
    description: string;
    timeline_items: {
      year: string;
      title: string;
      company: string;
      description: string;
      icon: ACFImage;
      company_icon: ACFImage;
    }[];
  };
}

export interface ACFResumePage {
  banner: {
    sub_heading: string;
    title: string;
    highlight_text: string;
    description: string;
    background_image: ACFImage;
  };
  flipbook: {
    pdf_url: string | number | { url: string };
  };
  intro: {
    badge_text: string;
    title: string;
    subtitle: string;
    stats: {
      value: string;
      label: string;
    }[];
    cta_heading: string;
    cta_text: string;
    primary_btn_text: string;
    primary_button_url?: string | number | { url: string };
    secondary_btn_text: string;
    secondary_btn_url: string;
    features: {
      feature_text: string;
    }[];
  };
}

export interface ResumePageData {
  acf: ACFResumePage;
}

export interface ACFPortfolioPage {
  intro: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    heading: string;
    description: string;
    features: {
      icon_type: 'seo' | 'dev' | 'delivery' | 'custom';
      title: string;
      description: string;
    }[];
    primary_button_label: string;
    primary_button_link: string;
    secondary_button_label: string;
    secondary_button_link: string;
    trust_label: string;
    trust_badges: {
      icon: string;
      text: string;
    }[];
    stats: {
      icon_type: 'seo' | 'dev' | 'delivery' | 'custom';
      target_number: number;
      value: string;
      label: string;
    }[];
  };
  banner: {
    sub_heading: string;
    sub_heading_icon: ACFImage;
    heading: string;
    description: string;
    background_image: string | number | { url: string };
  };
  all_projects: {
    sub_heading: string;
    title: string;
    description: string;
    show_filters: boolean;
    default_category: string | number;
    per_page: number;
    empty_text: string;
    loader_text: string;
  };
  cta: ACFCTA2;
  our_valued_partners: ACFBrands;
  my_latest_blogs: ACFBlogs;
}

export interface PortfolioPageData {
  acf: ACFPortfolioPage;
}

export interface ACFBrands {
  sub_heading?: string;
  sub_heading_icon?: ACFImage;
  heading?: string;
  marquee_row_1?: {
    logo: ACFImage;
    name: string;
  }[];
  marquee_row_2?: {
    logo: ACFImage;
    name: string;
  }[];
}

export interface ACFBlogItem {
  title: string;
  category: string;
  date: string;
  author: string;
  views: string;
  image: ACFImage;
  link: string;
}

export interface ACFBlogs {
  sub_heading?: string;
  heading?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
}

export interface ACFFaqPage {
  banner: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    sub_heading_image?: ACFImage;
    title: string;
    description: string;
    background_image: ACFImage;
  };
  intro: {
    sub_heading: string;
    sub_heading_icon?: ACFImage;
    sub_heading_image?: ACFImage;
    title: string;
    description: string;
  };
  cta: {
    badge_icon?: ACFImage;
    badge_image?: ACFImage;
    title: string;
    description: string;
    primary_button_label: string;
    primary_button_link: string;
    secondary_button_label: string;
    secondary_button_link: string;
    info_items?: {
      label: string;
      value: string;
      icon: ACFImage;
    }[];
  };
}

export interface FaqPageData {
  acf: ACFFaqPage;
}

export interface AboutPageData {
  acf: ACFAboutPage;
}

export interface ContactPageData {
  acf: ACFContactPage;
}

export interface ACFContactPage {
  contact_banner?: {
    sub_heading: string;
    heading: string;
    description: string;
    background_image: string;
  };
  contact_hero?: {
    badge_text: string;
    badge_icon?: string;
    sub_heading_icon?: ACFImage;
    sub_heading_image?: ACFImage;
    title: string;
    description: string;
    feature_pills: {
      label: string;
      icon_type: string;
      pill_type: 'teal' | 'orange';
    }[];
    info_cards: {
      title: string;
      description: string;
      icon_svg: string;
      badge?: string;
      link?: string;
    }[];
  };
  contact_form?: {
    sub_heading: string;
    title: string;
    description: string;
  };
  contact_map?: {
    map_iframe: string;
    map_link: string;
  };
  social_buzz?: {
    sub_heading?: string;
    sub_heading_icon?: string;
    sub_heading_image?: string;
    title: string;
    description: string;
    social_links: {
      platform: string;
      url: string;
      icon_svg?: string;
      icon?: string | number | { url?: string };
    }[];
  };
  /** ACF sometimes returns this under the prefixed key */
  contact_social_buzz?: ACFContactPage['social_buzz'];
  cta?: ACFCTA2;
  /** ACF sometimes returns this under the prefixed key */
  contact_cta?: ACFCTA2;
}

export interface ACFSitemapPage {
  sitemap_banner: {
    sub_heading: string;
    sub_heading_icon: ACFImage;
    sub_heading_image: ACFImage;
    title: string;
    description: string;
    background_image: ACFImage;
  };
  sitemap_intro: {
    badge_text: string;
    badge_icon: ACFImage;
    title: string;
    description: string;
  };
  sitemap_categories: {
    title: string;
    icon_svg: string;
    count?: string | number;
    links: {
      name: string;
      url: string;
      is_primary?: boolean;
      preview_style: 'hero' | 'profile' | 'form' | 'lines' | 'grid' | 'masonry' | 'acc' | 'blog' | 'tags' | 'code';
    }[];
  }[];
}

export interface SitemapPageData {
  acf: ACFSitemapPage;
}

export interface ACFTutorialsPage {
  banner: {
    sub_heading: string;
    sub_heading_icon: ACFImage;
    heading: string;
    description: string;
    background_image: ACFImage;
  };
  featured_tutorials?: {
    sub_heading: string;
    title: string;
    description: string;
  };
  highlights?: {
    sub_heading: string;
    title: string;
    description: string;
  };
  video_tutorials: {
    sub_heading: string;
    title: string;
    description: string;
  };
  quick_shorts: {
    sub_heading: string;
    title: string;
    description: string;
  };
  instagram_reels: {
    sub_heading: string;
    title: string;
    description: string;
  };
  sidebar_cards?: {
    title: string;
    icon: ACFImage;
    stat_value: string;
    stat_label: string;
  }[];
  cta?: ACFCTA2;
}

export interface TutorialsPageData {
  acf: ACFTutorialsPage;
}

export interface ACFSourceCodePage {
  banner: {
    sub_heading?: string;
    sub_heading_image?: string | number | { url: string };
    title?: string;
    description?: string;
    background_image?: string | number | { url: string };
    bg_image?: string | number | { url: string }; // Actual field in CMS
    banner_image?: string | number | { url: string };
  };
  intro_section: {
    sub_heading?: string;
    label?: string; // Actual field in CMS
    sub_heading_image?: string | number | { url: string };
    title?: string;
    heading?: string; // Actual field in CMS
    description?: string;
    content?: string; // Actual field in CMS
  };
  featured_section: {
    sub_heading?: string;
    label?: string; // Actual field in CMS
    sub_heading_image?: string | number | { url: string };
    title?: string;
    heading?: string; // Actual field in CMS
    description?: string;
    content?: string; // Actual field in CMS
  };
  grid_section?: {
    sub_heading?: string;
    label?: string; // Actual field in CMS
    title?: string;
    heading?: string; // Actual field in CMS
    description?: string;
    content?: string; // Actual field in CMS
  };
}

export interface SourceCodePageData {
  acf: ACFSourceCodePage;
}

