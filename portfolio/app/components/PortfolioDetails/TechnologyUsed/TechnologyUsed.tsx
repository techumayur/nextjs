"use client";

import React from 'react';
import Image from 'next/image';

interface TechItem {
  name: string;
  logo: string | number | { url: string };
  glow_class: string;
}

interface TechnologyUsedProps {
  technologies?: TechItem[];
  subHeading?: string;
  heading?: string;
  description?: string;
  subHeadingIcon?: string;
}

const getImageUrl = (image: string | number | { url: string } | undefined): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return "";
};

const TechnologyUsed: React.FC<TechnologyUsedProps> = ({
  technologies,
  subHeading,
  heading,
  description,
  subHeadingIcon = "/images/user-1.svg"
}) => {
  // Robust check for different ACF data structures
  const safeTech = Array.isArray(technologies) ? technologies : [];
  const validTech = safeTech.map((t: TechItem) => {
    if (!t) return null;
    const logoUrl = getImageUrl(t.logo);
    return {
      ...t,
      logo: logoUrl
    };
  }).filter((t): t is { name: string; logo: string; glow_class: string } => 
    !!t && typeof t.logo === 'string' && t.logo.trim() !== ''
  );

  if (validTech.length === 0 && !heading && !subHeading && !description) return null;

  const marqueeItems = [...validTech, ...validTech, ...validTech, ...validTech];

  // Logic to handle split heading
  const headingWords = heading?.split(' ') || [];
  const headingPart1 = headingWords.length > 1 ? headingWords.slice(0, -1).join(' ') : headingWords[0];
  const headingPart2 = headingWords.length > 1 ? headingWords[headingWords.length - 1] : "";

  return (
    <section className="section-spacing" id="technology-used">
      <div className="container-fluid px-0 overflow-hidden">
        <div className="row mb-3">
          <div className="col-12 text-center">
            <div className="section-title section-title-center mb-0">
              <span className="sub-heading-tag-1">
                <div className="sub-heading-image">
                  <picture>
                    <Image
                      src={subHeadingIcon}
                      alt="Tech Stack"
                      width={20}
                      height={20}
                      loading="lazy"
                      fetchPriority="high"
                      className="img-fluid"
                      unoptimized={subHeadingIcon.toLowerCase().endsWith('.svg') || subHeadingIcon.includes('.svg?')}
                    />
                  </picture>
                </div>
                {subHeading}
              </span>
              <h2>{headingPart1} <span className="highlight">{headingPart2}</span></h2>
              <div className="section-para-center mb-0">
                <div dangerouslySetInnerHTML={{ __html: description || "" }} />
              </div>
            </div>
          </div>
        </div>

        {validTech.length > 0 && (
          <div className="tech-marquee-container">
            <div className="tech-marquee-track">
              {marqueeItems.map((tech, index) => (
                <div key={index} className="tech-pill">
                  <div className={`tech-icon-box ${tech.glow_class}`}>
                    <Image
                      src={tech.logo}
                      alt={`${tech.name} Logo`}
                      width={45}
                      height={45}
                      className={tech.name === "Next.js" ? "nextjs-icon" : ""}
                      unoptimized={tech.logo.toLowerCase().endsWith('.svg') || tech.logo.includes('.svg?')}
                    />
                  </div>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechnologyUsed;
