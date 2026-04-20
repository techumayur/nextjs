"use client";

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface KeyFeaturesProps {
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  features?: {
    title: string;
    description: string;
    icon_type: 'svg' | 'image';
    icon_svg: string;
    icon_image: string | number | { url: string };
    glow_class: string;
  }[];
}

const getImageUrl = (image: string | number | { url: string } | undefined): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return "";
};

const KeyFeatures: React.FC<KeyFeaturesProps> = ({
  subHeading,
  heading,
  highlightText,
  description,
  features
}) => {
  const safeFeatures = Array.isArray(features) ? features : [];
  const validFeatures = safeFeatures.filter(f =>
    (f.icon_type === 'svg' && typeof f.icon_svg === 'string' && f.icon_svg.trim() !== '') ||
    (f.icon_type === 'image' && getImageUrl(f.icon_image) !== '')
  );

  if (!heading && !subHeading && !description && validFeatures.length === 0) return null;

  return (
    <section className="pd-key-features section-spacing" id="key-features">
      <div className="container">
        {/* Section Title */}
        <div className="row mb-3">
          <div className="col-12 text-center">
            <div className="section-title section-title-center">
              <span className="sub-heading-tag-2">
                <div className="sub-heading-image">
                  <picture>
                    <Image src="/images/user-2.svg" alt="Features" width={20} height={20} loading="lazy" fetchPriority="high" className="img-fluid" />
                  </picture>
                </div>
                {subHeading}
              </span>
              <h2>{heading}<span className="highlight">{highlightText}</span></h2>
              <div className="section-para-center">
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section: Dual View */}
        {validFeatures.length > 0 && (
          <div itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="name" content="Key Features of the Project" />

            {/* Desktop/Tablet View: Standard Grid */}
            <div className="row g-4 justify-content-center d-none d-md-flex">
              {validFeatures.map((feature, index) => (
                <div key={index} className="col-lg-4 col-md-6" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <div className="feature-card bento-item h-100" itemProp="item" itemScope itemType="https://schema.org/Thing">
                    <div className={`feature-icon-wrapper ${feature.glow_class}`}>
                      {feature.icon_type === 'svg' ? (
                        <div dangerouslySetInnerHTML={{ __html: feature.icon_svg }} />
                      ) : (
                        <Image src={getImageUrl(feature.icon_image)} alt={feature.title} width={30} height={30} />
                      )}
                    </div>
                    <h3 itemProp="name">{feature.title}</h3>
                    <p itemProp="description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View: Swiper Slider */}
            <div className="d-md-none">
              <Swiper
                modules={[Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="key-features-container"
              >
                {validFeatures.map((feature, index) => (
                  <SwiperSlide key={index}>
                    <div className="feature-card bento-item h-100">
                      <div className={`feature-icon-wrapper ${feature.glow_class}`}>
                        {feature.icon_type === 'svg' ? (
                          <div dangerouslySetInnerHTML={{ __html: feature.icon_svg }} />
                        ) : (
                          <Image src={getImageUrl(feature.icon_image)} alt={feature.title} width={24} height={24} />
                        )}
                      </div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default KeyFeatures;
