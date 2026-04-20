"use client";

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCreative } from 'swiper/modules';
import './Gallery.css';
import { ACFImage } from '@/types/acf';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';

interface GallerySlide {
    image: ACFImage;
    caption?: string;
}

interface GalleryProps {
    data?: {
        sub_heading?: string;
        sub_heading_icon?: ACFImage;
        bg_text?: string;
        heading?: string;
        highlight_text?: string;
        description?: string;
        gallery_items?: GallerySlide[];
    };
}

const Gallery: React.FC<GalleryProps> = ({ data }) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHoveringArrows, setIsHoveringArrows] = useState(false);
    
    // Robust check for gallery items (handles both Repeater and Gallery field types)
    const rawItems = data?.gallery_items || (data as Record<string, unknown>)?.gallery || [];
    const galleryItems = Array.isArray(rawItems) && rawItems.length > 0 
        ? rawItems.map((item: unknown) => {
            // If it's the repeater format { image: ..., caption: ... }
            if (typeof item === 'object' && item !== null && 'image' in item) {
                const galleryItem = item as { image: ACFImage; caption?: string };
                return {
                    image: galleryItem.image,
                    caption: galleryItem.caption || "PROJECT VIEW"
                };
            }
            // If it's a simple image URL or object (from Gallery field)
            return {
                image: item as ACFImage,
                caption: "PROJECT VIEW"
            };
        })
        : [];

    const getImageUrl = (image?: ACFImage): string | undefined => {
        if (!image) return undefined;
        if (typeof image === 'string') return image;
        if (typeof image === 'object' && 'url' in image) return image.url;
        return undefined;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cursorRef.current || isHoveringArrows) return;
        const area = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - area.left;
        const y = e.clientY - area.top;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
        cursorRef.current.style.opacity = '1';
    };

    const handleMouseLeave = () => {
        if (!cursorRef.current) return;
        cursorRef.current.style.opacity = '0';
    };

    if (!data && galleryItems.length === 0) return null;

    return (
        <section className="pd-gallery-section pd-gallery-2026 position-relative section-spacing" id="sc-gallery">
            {data?.bg_text && <div className="brutalist-bg-text">{data.bg_text}</div>}
            <div className="container position-relative z-1">
                <div className="row mb-3">
                    <div className="col-12 text-center">
                        <div className="section-title">
                             <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                                 <div className="sub-heading-image">
                                     {data?.sub_heading_icon ? (
                                         (typeof data.sub_heading_icon === 'string' && data.sub_heading_icon.trim().startsWith('<svg')) ? (
                                             <div className="dynamic-svg-wrapper" dangerouslySetInnerHTML={{ __html: data.sub_heading_icon }} />
                                         ) : (
                                             <picture>
                                                 <img
                                                     src={getImageUrl(data.sub_heading_icon) || '/images/home/brand-strategy.svg'}
                                                     alt="Icon"
                                                     width="14"
                                                     height="14"
                                                     className="img-fluid"
                                                 />
                                             </picture>
                                         )
                                     ) : (
                                         <picture>
                                             <img
                                                 src="/images/home/brand-strategy.svg"
                                                 alt="Icon"
                                                 width="14"
                                                 height="14"
                                                 className="img-fluid"
                                             />
                                         </picture>
                                     )}
                                 </div>
                                 {data?.sub_heading || "PROJECT GALLERY"}
                             </span>
                            {(data?.heading || data?.highlight_text) && (
                                <h2>
                                    {data?.heading}{" "}
                                    {data?.highlight_text && <span className="highlight">{data?.highlight_text}</span>}
                                </h2>
                            )}
                            {data?.description && (
                                <div 
                                    className="mt-3 text-muted"
                                    dangerouslySetInnerHTML={{ __html: data.description }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {galleryItems.length > 0 && (
                    <div className="row justify-content-center">
                        <div className="col-12 position-relative">
                            <div className="brutalist-nav-wrapper">
                                <div className="swiper-button-prev brutalist-prev" onMouseEnter={() => setIsHoveringArrows(true)} onMouseLeave={() => setIsHoveringArrows(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                </div>
                                <div className="swiper-button-next brutalist-next" onMouseEnter={() => setIsHoveringArrows(true)} onMouseLeave={() => setIsHoveringArrows(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </div>
                            </div>

                            <div className="cards-interactive-area d-flex justify-content-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                                <div className="custom-drag-cursor" ref={cursorRef} style={{ opacity: isHoveringArrows ? 0 : undefined }}>DRAG</div>
                                
                                <Swiper
                                    modules={[Navigation, EffectCreative]}
                                    effect={'creative'}
                                    grabCursor={false}
                                    centeredSlides={true}
                                    slidesPerView={'auto'}
                                    speed={800}
                                    loop={galleryItems.length > 1}
                                    navigation={{ nextEl: '.brutalist-next', prevEl: '.brutalist-prev' }}
                                    creativeEffect={{
                                        limitProgress: 3,
                                        prev: { shadow: true, translate: ['-12%', 0, -60], rotate: [0, 0, -4], scale: 0.95, opacity: 1 },
                                        next: { shadow: true, translate: ['12%', 0, -60], rotate: [0, 0, 4], scale: 0.95, opacity: 1 },
                                    }}
                                    className="cards-slider-2026"
                                >
                                    {galleryItems.map((item: GallerySlide, index: number) => (
                                        <SwiperSlide key={index} className="brutalist-card">
                                            <div className="card-inner-wrap">
                                                <picture>
                                                    <img 
                                                        src={getImageUrl(item.image)} 
                                                        alt={item.caption || `Gallery Item ${index + 1}`} 
                                                        className="img-fluid" 
                                                        loading="lazy" 
                                                    />
                                                </picture>
                                                <div className="card-caption">
                                                    <span className="step-num">{index + 1 < 10 ? `0${index + 1}` : index + 1}.</span>
                                                    <span className="step-text">{item.caption || "PROJECT VIEW"}</span>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
