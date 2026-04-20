'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/components/NotFound/NotFound.css';

interface ServerErrorProps {
  reset?: () => void;
  data?: {
    illustration?: string;
    error_code?: string;
    sub_heading_icon?: string;
    sub_heading?: string;
    title?: string;
    description?: string;
    primary_button_label?: string;
    primary_button_link?: string;
    secondary_button_label?: string;
    secondary_button_link?: string;
    quick_links?: {
      label?: string;
      quick_links: string;
      icon?: string | number | { url: string };
    }[];
  }
}

export default function ServerErrorComponent({ reset, data: initialData }: ServerErrorProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!initialData) {
      // Fetch dynamic theme data if not provided
      fetch('/api/theme')
        .then(res => res.json())
        .then(theme => {
          if (theme) {
            setData({
              illustration: theme["500_svg_code"],
              error_code: theme["500_error_code"],
              sub_heading_icon: theme["500_sub_heading_icon"],
              sub_heading: theme["500_sub_heading"],
              title: theme["500_title"],
              description: theme["500_description"],
              primary_button_label: theme["500_primary_button_label"],
              primary_button_link: theme["500_primary_button_link"],
              secondary_button_label: theme["500_secondary_button_label"],
              secondary_button_link: theme["500_secondary_button_link"],
              quick_links: theme["500_quick_links"],
            });
          }
        });
    }
  }, [initialData]);

  const illustration = data?.illustration;
  const errorCode = data?.error_code;
  const subHeadingIcon = data?.sub_heading_icon;
  const subHeading = data?.sub_heading;
  const title = data?.title;
  const description = data?.description;
  const primaryBtnLabel = data?.primary_button_label;
  const secondaryBtnLabel = data?.secondary_button_label;
  const secondaryBtnLink = data?.secondary_button_link;
  const quickLinks = data?.quick_links;

  return (
    <section id="error-page">
      {/* Animated background blobs */}
      <div className="error-blob error-blob--teal"></div>
      <div className="error-blob error-blob--orange"></div>
      <div className="error-blob error-blob--teal-sm"></div>

      {/* Floating particles */}
      <div className="error-particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => <span key={i} className="error-particle"></span>)}
      </div>

      {/* Main content */}
      <div className="error-content">
        {/* SVG Illustration */}
        <div className="error-illustration" aria-hidden="true">
          {illustration && (
            <div dangerouslySetInnerHTML={{ __html: illustration }} />
          )}
        </div>

        {/* Error code */}
        {errorCode && (
          <div className="error-code" aria-label={errorCode}>{errorCode}</div>
        )}

        {/* Badge */}
        {(subHeading || subHeadingIcon) && (
          <div className="error-tag" role="status" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
            {subHeadingIcon && (
              <div className="sub-heading-image d-inline-block me-2">
                {subHeadingIcon.startsWith('<svg') ? (
                  <div dangerouslySetInnerHTML={{ __html: subHeadingIcon }} />
                ) : (subHeadingIcon.includes('/') || subHeadingIcon.includes('.') ? (
                  <Image
                    src={subHeadingIcon}
                    alt={subHeading || "icon"}
                    width={20}
                    height={20}
                    className="img-fluid"
                    unoptimized
                  />
                ) : (
                  <span className="icon-text">{subHeadingIcon}</span>
                ))}
              </div>
            )}
            {subHeading}
          </div>
        )}

        {/* Heading */}
        {title && <h1 className="error-heading" dangerouslySetInnerHTML={{ __html: title }} />}

        {/* Description */}
        {description && <div className="error-desc" dangerouslySetInnerHTML={{ __html: description }} />}

        {/* Buttons */}
        <div className="error-actions" style={{ marginTop: '20px' }}>
          {primaryBtnLabel && (
            <button onClick={() => reset ? reset() : window.location.reload()} className="primary-btn">
              <span className="primary-btn-icon">
                <svg className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
              </span>
              {primaryBtnLabel}
            </button>
          )}
          {secondaryBtnLabel && secondaryBtnLink && (
            <Link href={secondaryBtnLink} className="secondary-btn">
              <span>{secondaryBtnLabel}</span>
              <svg width="15px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </Link>
          )}
        </div>

        {/* Quick links */}
        {quickLinks && quickLinks.length > 0 && (
          <nav className="error-links" aria-label="Quick navigation">
            <span>OR EXPLORE →</span>
            {quickLinks.map((link, index) => {
              if (!link.quick_links) return null;
              const url = link.quick_links;
              const label = link.label || url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || url;
              const iconData = link.icon;
              const isSvg = typeof iconData === 'string' && iconData.startsWith('<svg');
              const iconUrl = typeof iconData === 'string'
                ? iconData
                : (iconData && typeof iconData === 'object' && 'url' in iconData ? iconData.url : "");

              return (
                <Link key={index} href={url}>
                  {iconData && (
                    <div className="d-inline-flex align-items-center me-1">
                      {isSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: iconData }} />
                      ) : (iconUrl ? (
                        <Image
                          src={iconUrl}
                          alt={label}
                          width={14}
                          height={14}
                          unoptimized
                        />
                      ) : null)}
                    </div>
                  )}
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}
