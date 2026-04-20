"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Execution.css';

interface ExecutionProps {
  subHeading?: string;
  heading?: string;
  highlightText?: string;
  description?: string;
  subHeadingIcon?: string;
  steps?: {
    number: string;
    title: string;
    description: string;
    icon_type: 'svg' | 'image';
    icon_svg: string;
    icon_image: string | number | { url: string };
  }[];
}

const getImageUrl = (image: string | number | { url: string } | undefined): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return "";
};

const Execution: React.FC<ExecutionProps> = ({
  subHeading,
  heading,
  highlightText,
  description,
  subHeadingIcon = "/images/user-1.svg",
  steps
}) => {
  useEffect(() => {
    if (!steps || steps.length === 0) return;

    const swiperSelector = "#process-flow-slider";
    const swiperElement = document.querySelector(swiperSelector);

    if (!swiperElement) return;

    const processSwiper = new Swiper(swiperSelector, {
      modules: [Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
          autoplay: false,
        }
      }
    });

    return () => {
      processSwiper.destroy();
    };
  }, [steps]);

  const safeSteps = Array.isArray(steps) ? steps : [];
  const validSteps = safeSteps.filter(s =>
    (s.icon_type === 'svg' && typeof s.icon_svg === 'string' && s.icon_svg.trim() !== '') ||
    (s.icon_type === 'image' && getImageUrl(s.icon_image) !== '')
  );

  if (!heading && !subHeading && !description && validSteps.length === 0) return null;

  return (
    <section className="pd-execution-process section-spacing">
      <div className="container overflow-hidden">
        <div className="row">
          <div className="col-12">
            <div className="process-flow-section">
              <div className="section-title section-title-center">
                <span className="sub-heading-tag-1">
                  <div className="sub-heading-image">
                    <picture>
                      <Image
                        src={subHeadingIcon}
                        alt="Techu Mayur"
                        width={20}
                        height={20}
                        loading="lazy"
                        fetchPriority="high"
                        className="img-fluid"
                      />
                    </picture>
                  </div>
                  {subHeading}
                </span>
                <h2>{heading}<span className="highlight">{highlightText}</span></h2>
                <div className="section-para-center">
                  <div dangerouslySetInnerHTML={{ __html: description || "" }} />
                </div>
              </div>

              {validSteps.length > 0 && (
                <div id="process-flow-slider" className="overflow-hidden swiper process-flow-container">
                  <div className="swiper-wrapper">
                    {validSteps.map((step, index) => (
                      <div key={index} className="swiper-slide process-node">
                        <div className="node-icon-wrapper">
                          {step.icon_type === 'svg' ? (
                            <div dangerouslySetInnerHTML={{ __html: step.icon_svg }} />
                          ) : (
                            <Image src={getImageUrl(step.icon_image)} alt={step.title} width={24} height={24} />
                          )}
                        </div>
                        <div className="node-content">
                          <h2>{step.number}. {step.title}</h2>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="swiper-pagination"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Execution;
