import React from 'react';
import type { ACFBlogPageSettings } from '@/types/blogs';
import { parseHtml } from '@/app/lib/parseHtml';

interface BlogBannerProps {
  data?: ACFBlogPageSettings | null;
}

const BlogBanner = ({ data }: BlogBannerProps) => {
  const bannerImage = typeof data?.banner_image === 'string' ? data.banner_image : '';
  const subHeadingIcon = typeof data?.sub_heading_icon === 'string' ? data.sub_heading_icon : '';

  const bgStyle = bannerImage ? {
    background: `linear-gradient(135deg, rgba(11,102,106,0.92), rgba(11,102,106,0.82)), url('${bannerImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : { background: 'var(--primary-color)' };

  if (!data) return null;

  return (
    <section id="blog-banner" className="inner-banner section-spacing" style={bgStyle}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="banner-content-wrapper text-center">
              {data.sub_heading && (
                <span className="sub-heading-tag-1">
                  {subHeadingIcon && (
                    <div className="sub-heading-image">
                      <picture>
                        <img src={subHeadingIcon} alt="Icon" width="20" height="20" loading="eager" />
                      </picture>
                    </div>
                  )}
                  {data.sub_heading}
                </span>
              )}
              <h1 dangerouslySetInnerHTML={{ __html: parseHtml(data.heading) }} className="mb-4" />
              {data.content && <p className="mb-0 banner-desc">{data.content}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="banner-scroll-indicator">
        <div className="scroll-mouse"></div>
      </div>
    </section>
  );
};

export default BlogBanner;
