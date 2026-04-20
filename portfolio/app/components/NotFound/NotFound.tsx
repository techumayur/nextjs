import Image from 'next/image';
import Link from 'next/link';
import './NotFound.css';

interface NotFoundProps {
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

export default function NotFoundComponent({ data }: NotFoundProps) {
  const illustration = data?.illustration;
  const errorCode = data?.error_code;
  const subHeadingIcon = data?.sub_heading_icon;
  const subHeading = data?.sub_heading;
  const title = data?.title;
  const description = data?.description;
  const primaryBtnLabel = data?.primary_button_label;
  const primaryBtnLink = data?.primary_button_link;
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
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
        <span className="error-particle"></span>
      </div>

      {/* Main content */}
      <div className="error-content">
        {/* SVG Illustration */}
        {illustration && (
          <div className="error-illustration" aria-hidden="true" dangerouslySetInnerHTML={{ __html: illustration }} />
        )}

        {/* Error code */}
        {errorCode && (
          <div className="error-code" aria-label={errorCode}>{errorCode}</div>
        )}

        {/* Badge */}
        {(subHeading || subHeadingIcon) && (
          <div className="error-tag" role="status">
            {subHeadingIcon && (
              <div className="sub-heading-image d-inline-block me-2">
                  {subHeadingIcon.startsWith('<svg') ? (
                      <div dangerouslySetInnerHTML={{ __html: subHeadingIcon }} />
                  ) : (subHeadingIcon.includes('/') || subHeadingIcon.includes('.') ? (
                      <Image 
                        src={subHeadingIcon} 
                        alt={subHeading || "Icon"} 
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
          {primaryBtnLabel && primaryBtnLink && (
            <Link href={primaryBtnLink} className="primary-btn">
              <span className="primary-btn-icon">
                <svg className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
                <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path></svg>
              </span>
              {primaryBtnLabel}
            </Link>
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
              const iconData = link.icon;
              const isSvg = typeof iconData === 'string' && iconData.startsWith('<svg');
              const iconUrl = typeof iconData === 'string' 
                ? iconData 
                : (iconData && typeof iconData === 'object' && 'url' in iconData ? iconData.url : "");
              
              const url = link.quick_links;
              const label = link.label || (url ? url.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') : "") || url || "";

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
