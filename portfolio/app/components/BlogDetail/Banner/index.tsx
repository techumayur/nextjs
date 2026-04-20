import React from 'react';
import './css/Banner.css';

interface BlogDetailBannerProps {
  title: string;
  excerpt: string;
  categoryName?: string;
  authorImage?: string;
}

const BlogDetailBanner: React.FC<BlogDetailBannerProps> = ({ title, excerpt, categoryName, authorImage }) => {
  return (
    <section id="blog-detail-banner" className="inner-banner section-spacing">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-content-wrapper text-center">
              <span className="sub-heading-tag-1">
                <div className="sub-heading-image">
                  <picture>
                    <img
                      src={"/images/user-1.svg"}
                      alt="Techu Mayur"
                      width="20"
                      height="20"
                      loading="lazy"
                      fetchPriority="high"
                      className="img-fluid"
                    />
                  </picture>
                </div>
                {categoryName ? `${categoryName} – Mayur's Insights` : "Mayur's Insights"}
              </span>
              <h1 dangerouslySetInnerHTML={{ __html: title }} />
              <p dangerouslySetInnerHTML={{ __html: excerpt }} />
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

export default BlogDetailBanner;
