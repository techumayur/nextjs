"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


import { ACFImage } from "@/types/acf";

interface PortfolioCTAProps {
  data?: {
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
}

const PortfolioCTA: React.FC<PortfolioCTAProps> = ({ data }) => {
  if (!data) return null;

  const badgeText = data.badge_text;
  const badgeIcon = typeof data.badge_icon === 'string' 
    ? data.badge_icon 
    : (typeof data.badge_icon === 'object' && data.badge_icon !== null && 'url' in data.badge_icon ? data.badge_icon.url : undefined);
  
  const heading = data.heading;
  const highlightPart = data.highlight_text;
  const description = data.description;
  
  const primaryBtnText = data.buttons?.primary_text;
  const primaryBtnLink = data.buttons?.primary_link;
  const secondaryBtnText = data.buttons?.secondary_text;
  const secondaryBtnLink = data.buttons?.secondary_link;

  const safeCards = Array.isArray(data?.cards) ? data.cards : [];
  const validCards = safeCards.map(c => {
    if (!c) return null;
    const iconUrl = typeof c.icon === 'string' 
      ? c.icon 
      : (typeof c.icon === 'object' && c.icon !== null && 'url' in c.icon ? c.icon.url : undefined);
    
    return {
      title: c.title,
      text: c.text,
      icon: iconUrl || "",
      style: c.style || ""
    };
  }).filter((c): c is { title: string; text: string; icon: string; style: string } => 
    !!c && typeof c.icon === 'string' && c.icon.trim() !== ''
  );

  if (!heading && !badgeText && validCards.length === 0) return null;

  return (
    <section className="pd-cta-section section-spacing">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div className="custom-pd-cta-card">
              {/* Left: Text Content */}
              <div className="cta-left-content">
                {/* Badge */}
                {badgeText && (
                  <div className="d-inline-flex align-items-center gap-2 mb-4 cta-badge-wrapper border rounded-pill px-3 py-1 bg-light">
                    {badgeIcon ? (
                      <div className="cta-badge-icon">
                        <Image src={badgeIcon} alt={badgeText} width={16} height={16} className="img-fluid" unoptimized={false} />
                      </div>
                    ) : (
                      <span className="cta-status-dot"></span>
                    )}
                    <span className="text-uppercase fw-bold small text-muted letter-spacing-1">
                      {badgeText}
                    </span>
                  </div>
                )}

                {/* Heading */}
                <h2 className="cta-heading mb-4">
                  {(() => {
                    if (!highlightPart) return heading;
                    const parts = heading.split(highlightPart);
                    return (
                      <>
                        {parts[0]}
                        <span className="cta-highlight-box">{highlightPart}</span>
                        {parts[1]}
                      </>
                    );
                  })()}
                </h2>

                {/* Description */}
                {description && <div className="cta-description mb-5" dangerouslySetInnerHTML={{ __html: description }} />}

                {/* Buttons */}
                <div className="d-flex flex-wrap gap-3">
                  {primaryBtnText && (
                    <Link href={primaryBtnLink || "#"} className="primary-btn">
                      <span className="primary-btn-icon">
                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                          <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                        </svg>
                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                          <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                        </svg>
                      </span>
                      {primaryBtnText}
                    </Link>
                  )}
                  {secondaryBtnText && (
                    <Link href={secondaryBtnLink || "#"} className="secondary-btn">
                      <span>{secondaryBtnText}</span>
                      <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                      </svg>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right: Visual Cards */}
              <div className="cta-right-visuals">
                {validCards.map((card, idx) => (
                  <div key={idx} className={`flat-visual-card ${card.style}`}>
                    <div className="cta-visual-icon-box">
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={28}
                        height={28}
                        className="img-fluid"
                        unoptimized={false}
                      />
                    </div>
                    <div>
                      <strong className="visual-card-title">{card.title}</strong>
                      <span className="visual-card-text">{card.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioCTA;
