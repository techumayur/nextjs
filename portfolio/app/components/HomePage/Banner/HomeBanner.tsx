'use client';

import React, { useEffect } from 'react';
import { parseHtml, wpAutop } from '@/app/lib/parseHtml';
import Image from 'next/image';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './home-banner.css';
import { BannerSlide } from '@/types/acf';

interface HomeBannerProps {
  bannerData: BannerSlide[];
}

function HomeBanner({ bannerData }: HomeBannerProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !bannerData || bannerData.length === 0) return;

    // ==========================
    // Home Banner Swiper Initialization
    // ==========================
    const nextBtn = document.querySelector(".swiper-button-next") as HTMLElement;
    const prevBtn = document.querySelector(".swiper-button-prev") as HTMLElement;

    if (nextBtn && prevBtn) {
      [nextBtn, prevBtn].forEach((btn) => {
        btn.addEventListener("click", () => {
          nextBtn.classList.remove("swiper-button-active");
          prevBtn.classList.remove("swiper-button-active");
          btn.classList.add("swiper-button-active");
        });
      });
    }

    const homeBannerSwiper = new Swiper(".HomeBannerSwiper", {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 0,
      allowTouchMove: true,
      noSwiping: true,
      noSwipingClass: 'swiper-no-swiping',
      loop: bannerData && bannerData.length > 1, // Safe loop check
      speed: 700,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      pagination: {
        el: ".home-banner-pagination",
        clickable: true,
      },
      autoHeight: true,
      on: {
        slideChangeTransitionEnd: function () {
          const activeSlide = document.querySelector(".swiper-slide-active");
          if (activeSlide) {
            updatePreview(activeSlide);
            loadSlideIframes(activeSlide);
          }
        },
      },
    });

    // Handle initial slide content update
    const firstSlide = document.querySelector(".HomeBannerSwiper .swiper-slide-active");
    if (firstSlide) {
      updatePreview(firstSlide);
    }

    // Hide arrows & show dots on mobile
    if (window.innerWidth <= 768) {
      const navButtons = document.querySelectorAll(
        ".HomeBannerSwiper .swiper-button-next, .HomeBannerSwiper .swiper-button-prev"
      );
      navButtons.forEach((btn) => ((btn as HTMLElement).style.display = "none"));
    }

    // ==========================
    // Tab Switching
    // ==========================
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = (btn as HTMLElement).dataset.tab;

        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        tabContents.forEach((content) => {
          content.classList.remove("active");
          if ((content as HTMLElement).dataset.content === tabName) {
            content.classList.add("active");
          }
        });
      });
    });

    // ==========================
    // Counter Animation
    // ==========================
    const animateCounters = () => {
      const counters = document.querySelectorAll(".home-banner-number[data-target]");
      counters.forEach((counter) => {
        const targetStr = (counter as HTMLElement).dataset.target || "0";
        const target = parseInt(targetStr);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            counter.childNodes[0].nodeValue = Math.floor(current).toString();
            requestAnimationFrame(update);
          } else {
            counter.childNodes[0].nodeValue = target.toString();
          }
        };
        update();
      });
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsList = document.querySelector(".home-banner-stats-list");
    if (statsList) counterObserver.observe(statsList);

    // ==========================
    // Tab Switching Logic
    // ==========================
    const initTabs = () => {
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const wrapper = btn.closest(".editor-side");
          if (!wrapper) return;

          const tabName = (btn as HTMLElement).dataset.tab;

          // Update buttons
          wrapper.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          // Update content
          wrapper.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
          const activeContent = wrapper.querySelector(`.tab-content[data-content="${tabName}"]`);
          if (activeContent) {
            activeContent.classList.add("active");
            // Highlight preview for current slide
            const slide = btn.closest(".swiper-slide");
            if (slide) updatePreview(slide);
          }
        });
      });
    };

    initTabs();

    // ==========================
    // Live Preview Update
    // ==========================
    function updatePreview(slide: Element) {
      const wrappers = slide.querySelectorAll(".comparison-wrapper");

      wrappers.forEach(wrapper => {
        const htmlEditor = wrapper.querySelector(".html-editor") as HTMLTextAreaElement;
        const cssEditor = wrapper.querySelector(".css-editor") as HTMLTextAreaElement;
        const jsEditor = wrapper.querySelector(".js-editor") as HTMLTextAreaElement;
        const previewFrame = wrapper.querySelector(".preview-frame") as HTMLIFrameElement;

        if (htmlEditor && cssEditor && jsEditor && previewFrame) {
          try {
            const html = htmlEditor.value;
            const css = `<style>${cssEditor.value}</style>`;
            const js = `<script>${jsEditor.value}<\/script>`;

            // Construct a proper document if html doesn't contain a head/body
            let previewContent = html;
            if (!html.toLowerCase().includes('<html')) {
              previewContent = `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    ${css}
                  </head>
                  <body>
                    ${html}
                    ${js}
                  </body>
                </html>
              `;
            } else {
              // Append css/js if possible
              if (html.includes('</body>')) {
                previewContent = html.replace('</body>', `${css}${js}</body>`);
              } else {
                previewContent = `${html}${css}${js}`;
              }
            }

            const doc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
            if (doc) {
              doc.open();
              doc.write(previewContent);
              doc.close();
            }
          } catch (err) {
            console.error("Preview update failed:", err);
          }
        }
      });
    }

    // Attach listeners to all editors
    document.querySelectorAll(".code-editor").forEach(editor => {
      editor.addEventListener("input", () => {
        const slide = editor.closest(".swiper-slide");
        if (slide) updatePreview(slide);
      });
    });

    // ==========================
    // Comparison Slider Initialization
    // ==========================
    const initComparisonSliders = () => {
      document.querySelectorAll(".comparison-container").forEach((container) => {
        const sliderHandle = container.querySelector(".slider-handle") as HTMLElement;
        const previewSide = container.querySelector(".preview-side") as HTMLElement;

        if (!sliderHandle || !previewSide) return;

        let isDragging = false;

        const updatePosition = (x: number) => {
          const rect = container.getBoundingClientRect();
          let position = ((x - rect.left) / rect.width) * 100;
          position = Math.max(0, Math.min(100, position));
          sliderHandle.style.left = `${position}%`;
          previewSide.style.clipPath = `inset(0 0 0 ${position}%)`;
        };

        const onStart = (e: MouseEvent | TouchEvent) => {
          e.stopPropagation();
          isDragging = true;
          container.classList.add("dragging");
          // Prevent browser default behavior
          if (e.cancelable && e.type === 'touchstart') e.preventDefault();
        };

        const onEnd = () => {
          isDragging = false;
          container.classList.remove("dragging");
        };

        const onMove = (e: MouseEvent | TouchEvent) => {
          if (!isDragging) return;
          e.stopPropagation();
          const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
          updatePosition(x);
        };

        sliderHandle.addEventListener("mousedown", onStart);
        sliderHandle.addEventListener("touchstart", onStart, { passive: false });
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("mouseup", onEnd);
        window.addEventListener("touchend", onEnd);

        // Clicks on container to jump
        container.addEventListener("click", (e: Event) => {
          const me = e as MouseEvent;
          const target = me.target as HTMLElement;
          if (!target.closest(".editor-tabs") && !target.closest(".code-editor") && target !== sliderHandle) {
            e.stopPropagation();
            updatePosition(me.clientX);
          }
        });
      });
    };

    initComparisonSliders();

    // ==========================
    // Auto-remove indentation
    // ==========================
    const fixIndentation = () => {
      document.querySelectorAll(".code-editor").forEach((editorElement: Element) => {
        const editor = editorElement as HTMLTextAreaElement;
        const text = editor.value;
        if (!text) return;

        // 1. Normalize line endings and trim start/end newlines
        const lines = text.replace(/\r\n/g, "\n").replace(/\t/g, "    ").split("\n");

        // 2. Find the first non-empty line to determine base indentation
        const firstLineIndex = lines.findIndex(l => l.trim().length > 0);
        if (firstLineIndex === -1) return;

        const firstLine = lines[firstLineIndex];
        const match = firstLine.match(/^(\s*)/);
        const baseIndent = match ? match[1].length : 0;

        // 3. Subtract base indentation from all lines, but don't go below 0
        const cleanedLines = lines.slice(firstLineIndex).map(line => {
          if (line.trim().length === 0) return "";
          const currentIndentMatch = line.match(/^(\s*)/);
          const currentIndent = currentIndentMatch ? currentIndentMatch[1].length : 0;
          const shave = Math.min(baseIndent, currentIndent);
          return line.slice(shave);
        });

        // 4. Update the editor and trim the result
        editor.value = cleanedLines.join("\n").trim();
      });
    };

    fixIndentation();

    // Set initial previews for both mobile and desktop wrappers
    setTimeout(() => {
      document.querySelectorAll(".swiper-slide").forEach(slide => updatePreview(slide));
    }, 1000);

    // ==========================
    // Mobile Swiper
    // ==========================
    let mobileSwiperInstance: Swiper | null = null;

    function initResponsiveSwiper() {
      const containers = document.querySelectorAll(".visual-container") as NodeListOf<HTMLElement>;
      const screenWidth = window.innerWidth;

      containers.forEach(container => {
        if (screenWidth < 1024 && !mobileSwiperInstance && container) {
          const wrapper = document.createElement("div");
          wrapper.classList.add("swiper-wrapper");

          const slides = Array.from(container.children);

          slides.forEach((card: Element) => {
            card.classList.add("swiper-slide");
            wrapper.appendChild(card);
          });

          container.classList.add("swiper");
          container.appendChild(wrapper);

          // Instantiate Swiper without Pagination
          mobileSwiperInstance = new Swiper(container, {
            modules: [Autoplay, Navigation],
            slidesPerView: 1.2,
            spaceBetween: 16,
            loop: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            breakpoints: {
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            },
          });
        } else if (screenWidth >= 1024 && mobileSwiperInstance && container) {
          mobileSwiperInstance.destroy(true, true);
          mobileSwiperInstance = null;

          const wrapper = container.querySelector(".swiper-wrapper");
          if (!wrapper) return;

          const slides = Array.from(wrapper.children);

          slides.forEach((slide: Element) => {
            slide.classList.remove("swiper-slide");
            container.appendChild(slide);
          });

          wrapper.remove();
          container.classList.remove("swiper");
        }
      });
    }

    window.addEventListener("load", initResponsiveSwiper);
    window.addEventListener("resize", initResponsiveSwiper);

    // Skills Slider Banner Initialization
    if (document.querySelectorAll(".skills-banner-slider .swiper-slide").length > 0) {
      new Swiper(".skills-banner-slider", {
        modules: [Autoplay, Pagination],
        slidesPerView: 4,
        spaceBetween: 20,
        loop: document.querySelectorAll(".skills-banner-slider .swiper-slide").length >= 4,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".skills-banner-pagination",
          clickable: true,
        },
        breakpoints: {
          320: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        },
      });
    }

    // Load iframes for current slide only - DEFERRED to avoid TBT
    const loadSlideIframes = (slide: Element) => {
      slide.querySelectorAll<HTMLIFrameElement>("iframe[data-src]").forEach((iframe) => {
        if (iframe.dataset.src && iframe.src !== iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
        }
      });
    };

    // Use interaction or idle time to load initial iframes
    const idleLoad = () => {
      const initialActiveSlide = document.querySelector(".HomeBannerSwiper .swiper-slide-active");
      if (initialActiveSlide) loadSlideIframes(initialActiveSlide);
      
      // Cleanup
      window.removeEventListener('scroll', idleLoad);
      window.removeEventListener('mousemove', idleLoad);
      window.removeEventListener('touchstart', idleLoad);
    };

    // More aggressive deferral to beat TBT
    window.addEventListener('scroll', idleLoad, { once: true, passive: true });
    window.addEventListener('mousemove', idleLoad, { once: true, passive: true });
    window.addEventListener('touchstart', idleLoad, { once: true, passive: true });
    
    // Fallback for PageSpeed insights which might not trigger events
    const timer = setTimeout(idleLoad, 3000); 

    // Mark containers as loaded
    document.querySelectorAll(".mockup-container-staged").forEach((container) => {
      (container as HTMLElement).setAttribute("data-iframes-loaded", "true");
    });

    return () => {
      if (homeBannerSwiper) homeBannerSwiper.destroy();
      if (mobileSwiperInstance) mobileSwiperInstance.destroy();
    };
  }, [bannerData]);

  if (!bannerData || bannerData.length === 0) return null;

  const getImageUrl = (image: string | number | { url: string } | undefined | null): string => {
    if (!image) return '';

    // Handle Numeric IDs (usually means ACF Return Format is set to "ID")
    if (typeof image === 'number') {
      console.warn(`ACF returned an Image ID (${image}) instead of a URL. Please change the ACF return format for this field to "Image URL" or "Image Object" in the WordPress admin.`);
      // return a placeholder or attempt a guess if possible
      return '';
    }

    const imgUrl = typeof image === 'string' ? image : image.url;
    if (!imgUrl) return '';

    // Handle relative URLs returned by ACF in some configurations
    if (imgUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_WP_API_URL?.split('/wp-json')[0] || '';
      return `${baseUrl}${imgUrl}`;
    }

    return imgUrl;
  };

  const isSvg = (url: string) => url.toLowerCase().endsWith('.svg') || url.includes('.svg?');


  return (
    <section id="home-banner" className="banner-section pt-4 position-relative">
      <div className="container p-0">
        <div className="row align-items-center g-0">
          <div className="col-12">
            <div className="swiper HomeBannerSwiper">
              <div className="swiper-wrapper">
                {bannerData.map((slide, index) => {
                  return (
                    <div className="swiper-slide" key={index}>
                      <div className="row w-100 gx-5 align-items-center">
                        <div className="col-lg-6 ps-lg-0">
                          <div className="home-banner-content">
                            {slide.sub_heading && (
                              <span className="home-banner-content-tag">
                                {slide.sub_heading}
                              </span>
                            )}
                            <h1 dangerouslySetInnerHTML={{ __html: parseHtml(slide.heading) }}></h1>
                            <div className="home-banner-main-content" dangerouslySetInnerHTML={{ __html: wpAutop(slide.content) }}></div>

                            {/* Slider-specific logic */}
                            {slide.acf_fc_layout === 'slide_1' && (
                              <>
                                <div className="swiper skills-banner-slider mb-md-3">
                                  <div className="swiper-wrapper">
                                    {slide.skills_slider?.map((skill, sIndex) => {
                                      const skillImg = getImageUrl(skill.skills_icon);
                                      // If it's a number, we might want to show a placeholder instead of nothing
                                      const displayImg = skillImg || '/images/home/all-skill.svg';

                                      return (
                                        <div className="swiper-slide" key={sIndex}>
                                          <div className="skills-row">
                                            <picture>
                                              <Image
                                                src={displayImg}
                                                alt="Skill Icon"
                                                className="img-fluid"
                                                width="50"
                                                height="50"
                                                priority={sIndex < 6}
                                                style={{ height: 'auto' }}
                                                unoptimized={isSvg(displayImg)}

                                              />
                                            </picture>
                                            {/* If we have IDs, we should probably inform the user why images are default */}
                                            {typeof skill.skills_icon === 'number' && (
                                              <span className="d-none">ID: {skill.skills_icon}</span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                {/* Mobile Mockups */}
                                <div className="mockup-container-staged d-block d-lg-none" data-iframes-loaded="false">
                                  <div className="device-frame desktop-frame" style={{ backgroundImage: 'url(/images/home/imac.png)' }}>
                                    <iframe data-src={slide.desktop_link || ''} className="device-screen desktop-screen" sandbox="allow-scripts allow-forms allow-popups" title="Desktop Project" loading="lazy"></iframe>
                                  </div>
                                  <div className="device-frame tablet-frame" style={{ backgroundImage: 'url(/images/home/ipad.png)' }}>
                                    <iframe data-src={slide.ipad_link || ''} className="device-screen tablet-screen" sandbox="allow-scripts allow-forms allow-popups" title="Tablet Project" loading="lazy"></iframe>
                                  </div>
                                  <div className="device-frame mobile-frame">
                                    <iframe data-src={slide.mobile_link || ''} className="device-screen mobile-screen" sandbox="allow-scripts allow-forms allow-popups" title="Mobile Project" loading="lazy"></iframe>
                                  </div>
                                </div>
                              </>
                            )}

                            {slide.acf_fc_layout === 'slide_2' && (
                              <>
                                {/* Mobile Comparison */}
                                <div className="comparison-wrapper d-block d-lg-none swiper-no-swiping">
                                  <div className="comparison-container swiper-no-swiping">
                                    <div className="editor-side">
                                      <div className="window-controls">
                                        <div className="control-btn control-red"></div>
                                        <div className="control-btn control-yellow"></div>
                                        <div className="control-btn control-green"></div>
                                      </div>
                                      <div className="editor-tabs">
                                        <button className="tab-btn active" data-tab="html">index.html</button>
                                        <button className="tab-btn" data-tab="css">style.css</button>
                                        <button className="tab-btn" data-tab="js">init.js</button>
                                      </div>
                                      <div className="editor-content">
                                        <div className="tab-content active" data-content="html">
                                          <textarea className="code-editor html-editor" defaultValue={slide.banner_right?.indexhtml} />
                                        </div>
                                        <div className="tab-content" data-content="css">
                                          <textarea className="code-editor css-editor" defaultValue={slide.banner_right?.stylecss} />
                                        </div>
                                        <div className="tab-content" data-content="js">
                                          <textarea className="code-editor js-editor" defaultValue={slide.banner_right?.scriptjs} />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="preview-side">
                                      <iframe className="preview-frame" title="Preview"></iframe>
                                    </div>
                                    <div className="slider-handle">
                                      <div className="slider-line"></div>
                                      <div className="slider-button"><span className="slider-arrows">⟷</span></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="home-banner-stats-list">
                                  {slide.counter?.map((stat, sIndex) => (
                                    <div className="home-banner-stat-box" key={sIndex}>
                                      <div className="home-banner-number" data-target={stat.number}>0<span>+</span></div>
                                      <span className="home-banner-label">{stat.counter_text}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Slide 3 Layout Content Logic */}
                            {slide.acf_fc_layout === 'slide_3' && (
                              <>
                                <div className="visual-container d-grid d-lg-none">
                                  {slide.creative_card?.map((card, cIndex) => {
                                    const cardIcon = getImageUrl(card.icon);
                                    if (!cardIcon) return null;
                                    return (
                                      <div className={`creative-card card-${cIndex + 1}`} key={cIndex}>
                                        <div className={`card-icon-wrapper ${cIndex % 2 !== 0 ? 'alt' : ''}`}>
                                          <picture>
                                            <Image
                                              src={cardIcon}
                                              alt={card.heading}
                                              width={20} height={20} className="img-fluid" loading="lazy"
                                              style={{ height: 'auto' }}
                                              unoptimized={false}
                                            />
                                          </picture>
                                        </div>
                                        <h3 className="card-title">{card.heading}</h3>
                                        <div className="card-description" dangerouslySetInnerHTML={{ __html: wpAutop(card.content) }}></div>
                                        {card.tag && <span className="card-badge">{card.tag}</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="stats-container">
                                  {slide.counter?.map((stat, sIndex) => (
                                    <div className="stat-card" key={sIndex}>
                                      <span className="stat-number">{stat.number}</span>
                                      <span className="stat-label">{stat.counter_text}</span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Slide 4 Layout Content Logic */}
                            {slide.acf_fc_layout === 'slide_4' && (
                              <>
                                <div className="visual-area d-block d-lg-none">
                                  <div className="workspace-scene">
                                    <div className="desk-surface">
                                      <picture>
                                        {getImageUrl(slide.right_image) && (
                                          <Image src={getImageUrl(slide.right_image)} alt="Techu Mayur" width={400} height={400} className="img-fluid" priority style={{ height: 'auto' }} unoptimized={false} />
                                        )}
                                      </picture>
                                    </div>
                                    {slide.creative_card?.map((card, cIndex) => {
                                      const cardIcon = getImageUrl(card.icon);
                                      if (!cardIcon) return null;
                                      return (
                                        <div className={`ui-card ${cIndex === 0 ? 'card-top-left' : cIndex === 1 ? 'card-top-right' : 'card-bottom-right'}`} key={cIndex}>
                                          <div className={`card-icon-circle ${cIndex === 1 ? 'orange' : ''}`}>
                                            <picture>
                                              <Image src={cardIcon} alt={card.heading} width={30} height={30} className="img-fluid" loading="lazy" style={{ height: 'auto' }} unoptimized={isSvg(cardIcon)} />
                                            </picture>
                                          </div>
                                          <div className="card-heading">{card.heading}</div>
                                          <p className="card-subtext">{card.sub_heading}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="feature-pills">
                                  {slide.features?.map((feature, fIndex) => {
                                    const featureIcon = getImageUrl(feature.icon);
                                    if (!featureIcon) return null;
                                    return (
                                      <div className={`pill ${fIndex % 2 !== 0 ? 'pill-orange' : 'pill-teal'}`} key={fIndex}>
                                        <picture>
                                          <Image src={featureIcon} alt={feature.feature_text} width={20} height={20} className="img-fluid" loading="lazy" style={{ height: 'auto' }} unoptimized={false} />
                                        </picture>
                                        <span>{feature.feature_text}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}

                            <div className="btn-group-hero">
                              {slide.primary_button_label && (
                                <a href={slide.primary_button_link || '#'} className="primary-btn">
                                  <span className="primary-btn-icon">
                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                  </span>
                                  {slide.primary_button_label}
                                </a>
                              )}
                              {slide.secondory_button_label && (
                                <a href={slide.secondory_button_link || '#'} className="secondary-btn">
                                  <span>{slide.secondory_button_label}</span>
                                  <svg width="15px" height="10px" viewBox="0 0 13 10">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6 pe-lg-0">
                          {/* Desktop Visual Logic */}
                          {slide.acf_fc_layout === 'slide_1' && (
                            <div className="mockup-container-staged d-none d-lg-block" data-iframes-loaded="false">
                              <div className="device-frame desktop-frame" style={{ backgroundImage: 'url(/images/home/imac.png)' }}>
                                <iframe data-src={slide.desktop_link || ''} className="device-screen desktop-screen" sandbox="allow-scripts allow-same-origin" title="Desktop Project" loading="lazy"></iframe>
                              </div>
                              <div className="device-frame tablet-frame" style={{ backgroundImage: 'url(/images/home/ipad.png)' }}>
                                <iframe data-src={slide.ipad_link || ''} className="device-screen tablet-screen" sandbox="allow-scripts allow-same-origin" title="Tablet Project" loading="lazy"></iframe>
                              </div>
                              <div className="device-frame mobile-frame">
                                <iframe data-src={slide.mobile_link || ''} className="device-screen mobile-screen" sandbox="allow-scripts allow-same-origin" title="Mobile Project" loading="lazy"></iframe>
                              </div>
                            </div>
                          )}

                          {slide.acf_fc_layout === 'slide_2' && (
                            <div className="comparison-wrapper d-none d-lg-block swiper-no-swiping">
                              <div className="comparison-container swiper-no-swiping">
                                <div className="editor-side">
                                  <div className="window-controls">
                                    <div className="control-btn control-red"></div>
                                    <div className="control-btn control-yellow"></div>
                                    <div className="control-btn control-green"></div>
                                  </div>
                                  <div className="editor-tabs">
                                    <button className="tab-btn active" data-tab="html">index.html</button>
                                    <button className="tab-btn" data-tab="css">style.css</button>
                                    <button className="tab-btn" data-tab="js">init.js</button>
                                  </div>
                                  <div className="editor-content">
                                    <div className="tab-content active" data-content="html">
                                      <textarea className="code-editor html-editor" defaultValue={slide.banner_right?.indexhtml} />
                                    </div>
                                    <div className="tab-content" data-content="css">
                                      <textarea className="code-editor css-editor" defaultValue={slide.banner_right?.stylecss} />
                                    </div>
                                    <div className="tab-content" data-content="js">
                                      <textarea className="code-editor js-editor" defaultValue={slide.banner_right?.scriptjs} />
                                    </div>
                                  </div>
                                </div>
                                <div className="preview-side">
                                  <iframe className="preview-frame" title="Preview"></iframe>
                                </div>
                                <div className="slider-handle">
                                  <div className="slider-line"></div>
                                  <div className="slider-button"><span className="slider-arrows">⟷</span></div>
                                </div>
                              </div>
                            </div>
                          )}

                          {slide.acf_fc_layout === 'slide_3' && (
                            <div className="visual-container d-none d-lg-grid">
                              {slide.creative_card?.map((card, cIndex) => {
                                const cardIcon = getImageUrl(card.icon);
                                if (!cardIcon) return null;
                                return (
                                  <div className={`creative-card card-${cIndex + 1}`} key={cIndex}>
                                    <div className={`card-icon-wrapper ${cIndex % 2 !== 0 ? 'alt' : ''}`}>
                                      <picture>
                                        <Image
                                          src={cardIcon}
                                          alt={card.heading}
                                          width="20" height="20" className="img-fluid" loading="lazy"
                                          style={{ height: 'auto' }}
                                          unoptimized={isSvg(cardIcon)}
                                        />
                                      </picture>
                                    </div>
                                    <h3 className="card-title">{card.heading}</h3>
                                    <div className="card-description" dangerouslySetInnerHTML={{ __html: wpAutop(card.content) }}></div>
                                    {card.tag && <span className="card-badge">{card.tag}</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {slide.acf_fc_layout === 'slide_4' && (
                            <div className="visual-area d-none d-lg-block">
                              <div className="workspace-scene">
                                <div className="desk-surface">
                                  <picture>
                                    {getImageUrl(slide.right_image) && (
                                      <Image src={getImageUrl(slide.right_image)} alt="Techu Mayur" width={400} height={400} className="img-fluid" priority style={{ height: 'auto' }} unoptimized={false} />
                                    )}
                                  </picture>
                                </div>
                                {slide.creative_card?.map((card, cIndex) => {
                                  const cardIcon = getImageUrl(card.icon);
                                  if (!cardIcon) return null;
                                  return (
                                    <div className={`ui-card ${cIndex === 0 ? 'card-top-left' : cIndex === 1 ? 'card-top-right' : 'card-bottom-right'}`} key={cIndex}>
                                      <div className={`card-icon-circle ${cIndex === 1 ? 'orange' : ''}`}>
                                        <picture>
                                          <Image src={cardIcon} alt={card.heading} width={30} height={30} className="img-fluid" loading="lazy" style={{ height: 'auto' }} unoptimized={false} />
                                        </picture>
                                      </div>
                                      <div className="card-heading">{card.heading}</div>
                                      <div className="card-subtext">{card.sub_heading}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="swiper-pagination home-banner-pagination d-lg-none"></div>
            </div>
            {bannerData.length > 1 && (
              <div className="swiper-navigation d-none d-lg-block">
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeBanner;
