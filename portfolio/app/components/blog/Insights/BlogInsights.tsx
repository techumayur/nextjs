import React from 'react';
import Image from 'next/image';
import type { ACFBlogInsightsSection } from '@/types/blog';
import { parseHtml } from '@/app/lib/parseHtml';

interface BlogInsightsProps {
  data?: ACFBlogInsightsSection | null;
}

const BlogInsights = ({ data }: BlogInsightsProps) => {
  if (!data) return null;

  const { sub_heading, heading, description } = data;
  const iconSrc = typeof data.sub_heading_icon === 'string' ? data.sub_heading_icon : '';

  return (
    <section className="section-spacing pb-0">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 text-center">
            <div className="section-title section-title-center">
              {sub_heading && (
                <span className="sub-heading-tag-1">
                  {iconSrc && (
                    <div className="sub-heading-image">
                       <picture>
                          <img src={iconSrc} alt="Icon" width="20" height="20" loading="lazy" />
                       </picture>
                    </div>
                  )}
                  {sub_heading}
                </span>
              )}
              <h2 dangerouslySetInnerHTML={{ __html: parseHtml(heading) }} />
              {description && (
                <div className="section-para-center">
                  <p dangerouslySetInnerHTML={{ __html: parseHtml(description) }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogInsights;
