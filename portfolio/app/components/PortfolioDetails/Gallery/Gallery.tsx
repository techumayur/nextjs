"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Swiper from 'swiper';
import { Navigation, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';


interface GallerySlide {
  image: string | number | { url: string };
  caption?: string;
  step?: string;
}

interface DisplaySlide {
  image: string;
  caption: string;
  step: string;
}

interface GalleryProps {
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  slides?: GallerySlide[];
}



const Gallery: React.FC<GalleryProps> = ({ 
  subHeading,
  heading,
  highlightText,
  description,
  slides
}) => {
  // Robust check for different ACF data structures (Gallery field vs Repeater field)
  const safeSlides = Array.isArray(slides) ? slides : [];
  const processedSlides = safeSlides.map((s, index) => {
    if (!s) return null;
    
    // 1. If it's a repeater item with an image subfield
    if (typeof s === 'object' && 'image' in s) {
      const item = s as GallerySlide;
      const url = typeof item.image === 'string' ? item.image : (item.image as { url: string })?.url;
      return {
        image: url || "",
        caption: item.caption || "",
        step: item.step || `0${index + 1}.`
      };
    }
    // 2. If it's a gallery item directly (image object from ACF Gallery field)
    if (typeof s === 'object' && 'url' in s) {
      const item = s as { url: string; caption?: string; title?: string; alt?: string };
      return {
        image: item.url,
        caption: item.caption || item.title || item.alt || "",
        step: `0${index + 1}.`
      };
    }
    // 3. If it's a simple URL string
    if (typeof s === 'string') {
      return {
        image: s,
        caption: "",
        step: `0${index + 1}.`
      };
    }
    return null;
  }).filter((s): s is DisplaySlide => 
    !!s && typeof s.image === 'string' && s.image.trim() !== ''
  );

  useEffect(() => {
    if (processedSlides.length === 0) return;

    const gallerySwiper = new Swiper(".cards-slider-2026", {
      modules: [Navigation, EffectCards],
      effect: "cards",
      grabCursor: true,
      navigation: {
        nextEl: ".brutalist-next",
        prevEl: ".brutalist-prev",
      },
      cardsEffect: {
        slideShadows: false,
        rotate: true,
        perSlideRotate: 4,
        perSlideOffset: 12
      }
    });

    // Custom Drag Cursor logic
    const interactiveArea = document.querySelector('.cards-interactive-area');
    const customCursor = document.querySelector('.custom-drag-cursor') as HTMLElement;

    if (interactiveArea && customCursor) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = interactiveArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        customCursor.style.left = `${x}px`;
        customCursor.style.top = `${y}px`;
      };

      const handleMouseEnter = () => customCursor.classList.add('active');
      const handleMouseLeave = () => customCursor.classList.remove('active');

      interactiveArea.addEventListener('mousemove', handleMouseMove as (e: Event) => void);
      interactiveArea.addEventListener('mouseenter', handleMouseEnter);
      interactiveArea.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        interactiveArea.removeEventListener('mousemove', handleMouseMove as (e: Event) => void);
        interactiveArea.removeEventListener('mouseenter', handleMouseEnter);
        interactiveArea.removeEventListener('mouseleave', handleMouseLeave);
        gallerySwiper.destroy();
      };
    }

    return () => gallerySwiper.destroy();
  }, [processedSlides.length]);

  if (processedSlides.length === 0 && !heading && !subHeading && !description) return null;

  return (
    <section className="pd-gallery-section pd-gallery-2026 position-relative section-spacing" style={{ backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>
      {/* Massive Background Typography */}
      <div className="brutalist-bg-text">VISUALS</div>

      <div className="container position-relative z-1">
        {/* Standard Homepage-Matched Section Title */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="section-title section-title-center">
              <span className="sub-heading-tag-2">
                <div className="sub-heading-image">
                  <picture>
                    <Image src="/images/user-2.svg" alt="Techu Mayur" width={20} height={20} loading="lazy" fetchPriority="high" className="img-fluid" unoptimized={false} />
                  </picture>
                </div>
                {subHeading}
              </span>
              <h2>{heading}<span className="highlight">{highlightText}</span></h2>
              <div className="section-para-center">
                <div dangerouslySetInnerHTML={{ __html: description || "" }} />
              </div>
            </div>
          </div>
        </div>

        {processedSlides.length > 0 && (
          <div className="row justify-content-center">
            <div className="col-12 position-relative">
              {/* Navigation Arrows (Outer) */}
              <div className="brutalist-nav-wrapper">
                <div className="swiper-button-prev brutalist-prev">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
                <div className="swiper-button-next brutalist-next">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>

              {/* Cards Swiper Area */}
              <div className="cards-interactive-area d-flex justify-content-center">
                {/* Custom Cursor */}
                <div className="custom-drag-cursor">DRAG</div>

                {/* Cards Swiper */}
                <div className="swiper cards-slider-2026">
                  <div className="swiper-wrapper">
                    {processedSlides.map((slide, index) => (
                      <div key={index} className="swiper-slide brutalist-card">
                        <a href={slide.image} data-fancybox="gallery" data-caption={slide.caption} className="card-inner-wrap d-block">
                          <picture>
                            <Image
                              src={slide.image}
                              alt={slide.caption}
                              width={1600}
                              height={1200}
                              className="img-fluid"
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              loading="lazy"
                              unoptimized={false}
                            />
                          </picture>
                          <div className="card-caption">
                            <span className="step-num">{slide.step}</span>
                            <span className="step-text">{slide.caption}</span>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
