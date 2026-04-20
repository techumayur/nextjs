import React from 'react';
import Image from 'next/image';

interface PortfolioDetailsBannerProps {
  title: string;
  description: string;
  backgroundImage?: string;
  subHeadingIcon?: string;
}

const PortfolioDetailsBanner: React.FC<PortfolioDetailsBannerProps> = ({
  title,
  description,
  backgroundImage,
  subHeadingIcon = '/images/user-1.svg'
}) => {
  const bgStyle = {
    backgroundImage: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${backgroundImage || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&h=800&fit=crop'}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section id="portfolio-details-banner" className="inner-banner section-spacing" style={bgStyle}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-content-wrapper text-center">
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
                Portfolio Details
              </span>
              <h1 dangerouslySetInnerHTML={{ __html: title }} />
              <p dangerouslySetInnerHTML={{ __html: description }} />
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

export default PortfolioDetailsBanner;
