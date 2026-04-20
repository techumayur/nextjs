"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./MySkills.css";
import { WPSkill, WPSkillTaxonomy, ACFSkillsSection, ACFImage } from "@/types/acf";

interface MySkillsProps {
  skills: WPSkill[];
  taxonomies: WPSkillTaxonomy[];
  sectionData: ACFSkillsSection | null;
}

export default function MySkills({ skills, taxonomies, sectionData }: MySkillsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState<number | "all">("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesCategory = currentCategoryId === "all" || skill["my-skill-taxonomy"]?.includes(currentCategoryId);
      const matchesSearch = !searchTerm || 
        skill.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.acf?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.acf?.tags?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, currentCategoryId, searchTerm]);

  // Use exactly 2 for the top section
  const topTwoSkills = useMemo(() => {
    const featured = filteredSkills.filter(skill => skill.acf?.featured);
    if (featured.length >= 2) return featured.slice(0, 2);
    // If less than 2 featured, fill with others
    const others = filteredSkills.filter(skill => !skill.acf?.featured);
    return [...featured, ...others].slice(0, 2);
  }, [filteredSkills]);

  const activeCategory = useMemo(() => {
    if (currentCategoryId === "all") return { name: "All Skills", description: "Browse through my complete tech stack and tools" };
    const cat = taxonomies.find(t => t.id === currentCategoryId);
    return { 
        name: cat?.name || "All Skills", 
        description: `Explore my ${cat?.name} expertise and tools`
    };
  }, [currentCategoryId, taxonomies]);

  const getSkillIcon = (icon: ACFImage | undefined): string => {
    if (!icon) return ""; 
    if (typeof icon === 'string') return icon;
    if (typeof icon === 'object' && 'url' in icon) return icon.url || "";
    return "";
  };

  const getCategoryIcon = (tax: WPSkillTaxonomy) => {
    if (tax.acf?.icon) {
        return typeof tax.acf.icon === 'string' ? tax.acf.icon : tax.acf.icon.url;
    }
    const fallbackMap: Record<string, string> = {
        'frontend': '/images/home/frontend-skill.svg',
        'backend': '/images/home/backend-skill.svg',
        'database': '/images/home/database-skill.svg',
        'tools': '/images/home/tools-skill.svg'
    };
    return fallbackMap[tax.slug] || '/images/home/all-skill.svg';
  };

  const getSkillDescription = (skill: WPSkill) => {
    return skill.acf?.description || 
           skill.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || 
           "";
  };

  return (
    <section id="home-skills-store" className="skill-store section-spacing position-relative" data-theme={theme}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Animated Background */}
            <div className={`sky-background ${theme}`}>
                <div className={`sun ${theme === 'light' ? 'visible' : ''}`}></div>
                <div className={`cloud cloud-1 ${theme === 'light' ? 'visible' : ''}`}></div>
                <div className={`cloud cloud-2 ${theme === 'light' ? 'visible' : ''}`}></div>
                <div className={`cloud cloud-3 ${theme === 'light' ? 'visible' : ''}`}></div>
                <div className={`moon ${theme === 'dark' ? 'visible' : ''}`}></div>
                <div className={`stars-container ${theme === 'dark' ? 'visible' : ''}`}>
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="star"></div>
                    ))}
                </div>
            </div>

            <div className="skill-store-wrapper">
              <div className="store-header">
                <div className="section-title">
                  <span className="sub-heading-tag-2">
                    <div className="sub-heading-image">
                        <picture>
                            <Image 
                                src={getSkillIcon(sectionData?.sub_heading_image || sectionData?.sub_heading_icon) || "/images/user-2.svg"} 
                                alt="Icon" 
                                width={20} 
                                height={20} 
                                className="img-fluid" 
                            />
                        </picture>
                    </div>
                    {sectionData?.sub_heading || "Skills"}
                  </span>
                  <h2 dangerouslySetInnerHTML={{ __html: sectionData?.title || "My Skill <span class=\"highlight\">Store</span>" }} />
                  <p className="store-subtitle">
                    {sectionData?.subtitle || "Explore my technical expertise and tools"}
                  </p>
                </div>
              </div>

              <div className="main-container">
                <aside className="sidebar">
                  <div className="search-container">
                    <div className="search-icon">
                        <picture>
                            <Image src="/images/home/search-icon.svg" alt="Search" width={20} height={20} className="img-fluid" />
                        </picture>
                    </div>
                    <input 
                      type="text" 
                      className="search-input" 
                      id="searchInput"
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="categories-header">Categories</div>
                  <div 
                    className={`skill-category-dropdown-container ${isCategoryOpen ? "open" : ""}`}
                    data-selected={searchTerm ? "Search Results" : activeCategory.name.replace(/&amp;/g, '&')}
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    ref={categoryRef}
                  >
                    <div className="category-list-wrapper">
                      <ul className="category-list" id="categoryList">
                        <li 
                          className={`category-item ${currentCategoryId === "all" ? "active" : ""}`} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCategoryId("all");
                            setIsCategoryOpen(false);
                          }}
                        >
                          <picture>
                            <Image src="/images/home/all-skill.svg" alt="All" width={20} height={20} className="img-fluid" />
                          </picture>
                          <span>All</span>
                        </li>
                        {taxonomies.map(tax => (
                          <li 
                            key={tax.id}
                            className={`category-item ${currentCategoryId === tax.id ? "active" : ""}`} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentCategoryId(tax.id);
                              setIsCategoryOpen(false);
                            }}
                          >
                            <picture>
                              <Image src={getCategoryIcon(tax)} alt={tax.name.replace(/&amp;/g, '&')} width={20} height={20} className="img-fluid" />
                            </picture>
                            <span dangerouslySetInnerHTML={{ __html: tax.name }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="profile-section" ref={profileRef}>
                    <div className="profile-card" id="profileCard" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                      <div className="profile-avatar">{sectionData?.profile_name?.substring(0, 2).toUpperCase() || "TM"}</div>
                      <div className="profile-info">
                        <div className="profile-name">{sectionData?.profile_name || "Techu Mayur"}</div>
                        <div className="profile-role">{sectionData?.profile_role || "Full Stack Developer"}</div>
                      </div>
                      <picture>
                        <Image src="/images/home/chevron-down.svg" alt="Chevron" width={20} height={20} className="img-fluid" />
                      </picture>
                    </div>
                    
                    <div className={`profile-dropdown ${isProfileOpen ? "show" : ""}`} id="profileDropdown">
                      <div className="dropdown-item">
                        <picture>
                          <Image src="/images/home/view-profile.svg" alt="Profile" width={20} height={20} className="img-fluid" />
                        </picture>
                        <span>View Profile</span>
                      </div>
                      <div className="dropdown-item">
                        <picture>
                          <Image src="/images/home/settings.svg" alt="Settings" width={20} height={20} className="img-fluid" />
                        </picture>
                        <span>Settings</span>
                      </div>
                      <div className="dropdown-item">
                        <picture>
                          <Image src="/images/home/logout.svg" alt="Logout" width={20} height={20} className="img-fluid" />
                        </picture>
                        <span>Logout</span>
                      </div>
                      <div className="theme-toggle">
                        <div className="d-flex align-items-center gap-2">
                          <picture>
                            <Image src="/images/home/mode.svg" alt="Mode" width={20} height={20} className="img-fluid" />
                          </picture>
                          <span id="themeLabel">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                        </div>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            id="themeToggle"
                            checked={theme === "dark"}
                            onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </aside>

                <main className="content-area">
                  <div className="content-header">
                    <h2 className="content-title" id="categoryTitle" dangerouslySetInnerHTML={{ __html: searchTerm ? "Search Results" : activeCategory.name }} />
                    <p className="content-description" id="categoryDescription" dangerouslySetInnerHTML={{ __html: searchTerm 
                        ? `Found ${filteredSkills.length} results matching "${searchTerm}"` 
                        : activeCategory.description }} />
                  </div>

                  {topTwoSkills.length > 0 && (
                    <div className="featured-section" id="featuredSection">
                        <div className="featured-grid" id="featuredGrid">
                            {topTwoSkills.map(skill => (
                                <div key={skill.id} className="featured-skill-card" data-category={skill.slug} data-tags={skill.acf?.tags}>
                                    <div className="skill-badge">{skill.acf?.badge || "Featured"}</div>
                                    <h3 className="featured-skill-title" dangerouslySetInnerHTML={{ __html: skill.title.rendered }} />
                                    <p className="featured-skill-desc">{getSkillDescription(skill)}</p>
                                    <div className="featured-icon-container">
                                        <picture>
                                            <Image 
                                                src={getSkillIcon(skill.acf?.icon) || "/images/menu/html-css-js.svg"} 
                                                alt={skill.title.rendered.replace(/&amp;/g, '&')} 
                                                width={60} 
                                                height={60} 
                                                className="img-fluid" 
                                            />
                                        </picture>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

                  <div id="skillsListSection" style={{ display: filteredSkills.length > 0 ? "block" : "none" }}>
                    <h3 className="skills-section-title" id="skillsListTitle">
                        All
                    </h3>
                    <div className="swiper mySkillsSwiper">
                        <Swiper
                            modules={[Pagination]}
                            spaceBetween={20}
                            pagination={{ 
                                clickable: true,
                                dynamicBullets: true
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                992: { slidesPerView: 2 }
                            }}
                            key={`${currentCategoryId}-${searchTerm}`}
                        >
                            {filteredSkills.map(skill => (
                                <SwiperSlide key={skill.id}>
                                    <div className="skill-list-item" data-category={skill.slug} data-tags={skill.acf?.tags}>
                                        <div className="skill-icon-box">
                                            <picture>
                                                <Image 
                                                    src={getSkillIcon(skill.acf?.icon) || "/images/menu/html-css-js.svg"} 
                                                    alt={skill.title.rendered.replace(/&amp;/g, '&')} 
                                                    width={30} 
                                                    height={30} 
                                                    className="img-fluid" 
                                                />
                                            </picture>
                                        </div>
                                        <div className="skill-content">
                                            <h4 dangerouslySetInnerHTML={{ __html: skill.title.rendered }} />
                                            <p>{getSkillDescription(skill)}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                  </div>

                  <div className="no-results" id="noResults" style={{ display: filteredSkills.length === 0 ? "flex" : "none" }}>
                    <picture>
                      <Image src="/images/menu/html-css-js.svg" alt="No Results" width={20} height={20} className="img-fluid" />
                    </picture>
                    <h3>No skills found</h3>
                    <p>Try searching with different keywords</p>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
