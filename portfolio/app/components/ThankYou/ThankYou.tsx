import Image from 'next/image';
import Link from 'next/link';
import './ThankYou.css';

interface ThankYouProps {
  data?: {
    sub_heading_svg?: string;
    sub_heading_icon?: string;
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

export default function ThankYouComponent({ data }: ThankYouProps) {
  const subHeadingSvg = data?.sub_heading_svg;
  const subHeadingIcon = data?.sub_heading_icon;
  const title = data?.title;
  const description = data?.description;
  const primaryBtnLabel = data?.primary_button_label;
  const primaryBtnLink = data?.primary_button_link;
  const secondaryBtnLabel = data?.secondary_button_label;
  const secondaryBtnLink = data?.secondary_button_link;
  const quickLinks = data?.quick_links;

  return (
    <section id="ty-dribbble-clean">
      <div className="container h-100 position-relative">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-lg-10">
            {/* Clean Centered Card Layout matches Dribbble portfolio trends */}
            <div className="ty-glass-card text-center">
              
              {/* Decorative Icon matching Home Page style */}
              {(subHeadingSvg || subHeadingIcon) && (
                <div className="ty-icon-wrapper mx-auto mb-4">
                     {subHeadingSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: subHeadingSvg }} />
                    ) : (subHeadingIcon && subHeadingIcon.startsWith('<svg') ? (
                        <div dangerouslySetInnerHTML={{ __html: subHeadingIcon }} />
                    ) : (subHeadingIcon && (subHeadingIcon.includes('/') || subHeadingIcon.includes('.')) ? (
                        <Image 
                          src={subHeadingIcon} 
                          alt="Icon" 
                          width={32} 
                          height={32} 
                          className="img-fluid" 
                          unoptimized 
                        />
                    ) : (
                        <span className="icon-text">{subHeadingIcon}</span>
                    )))}
                </div>
              )}

              {/* Clean Typography imitating "home-banner-heading" */}
              {title && <h1 className="ty-heading-clean mb-3" dangerouslySetInnerHTML={{ __html: title }} />}
              
              {description && <div className="ty-para-clean mx-auto mb-5" dangerouslySetInnerHTML={{ __html: description }} />}

              {/* Matching Buttons exactly from index.php */}
              <div className="ty-actions d-flex justify-content-center gap-3 flex-wrap mb-5">
                {primaryBtnLabel && primaryBtnLink && (
                  <Link href={primaryBtnLink} className="primary-btn m-0">
                    <span className="primary-btn-icon">
                      <svg className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                      <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                      </svg>
                    </span>
                    {primaryBtnLabel}
                  </Link>
                )}
                {secondaryBtnLabel && secondaryBtnLink && (
                  <Link href={secondaryBtnLink} className="secondary-btn m-0">
                    <span>{secondaryBtnLabel}</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                      <path d="M1,5 L11,5"></path>
                      <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                  </Link>
                )}
              </div>
              
              {/* Clean Divider */}
              <div className="ty-divider mx-auto mb-4"></div>

              {/* Minimalist Quick Links */}
              {quickLinks && quickLinks.length > 0 && (
                <div className="ty-quick-links d-flex justify-content-center gap-4 flex-wrap">
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
                      <Link key={index} href={url} className="ty-link">
                         {iconData && (
                          <div className="d-inline-flex align-items-center me-2">
                            {isSvg ? (
                              <div dangerouslySetInnerHTML={{ __html: iconData }} />
                            ) : (iconUrl ? (
                              <Image 
                                src={iconUrl} 
                                alt={label} 
                                width={16} 
                                height={16} 
                                unoptimized 
                              />
                            ) : null)}
                          </div>
                        )}
                        {label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
