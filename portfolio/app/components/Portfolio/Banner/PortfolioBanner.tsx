import React from 'react';
import { ACFPortfolioPage } from "@/types/acf";

interface PortfolioBannerProps {
  data: ACFPortfolioPage['banner'];
}

const PortfolioBanner: React.FC<PortfolioBannerProps> = ({ data }) => {
  if (!data) return null;

  const bgStyle = {
    background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${data.background_image || 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&h=800&fit=crop'}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const cleanHeading = (html: string) => {
    if (!html) return "";
    return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "").trim();
  };

  return (
    <section id="portfolio-banner" className="inner-banner section-spacing" style={bgStyle}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-content-wrapper text-center">
              <span className="sub-heading-tag-1">
                {data.sub_heading_icon && (
                  <img 
                    src={typeof data.sub_heading_icon === 'string' ? data.sub_heading_icon : (data.sub_heading_icon as { url: string }).url} 
                    alt="icon" 
                    className="me-2"
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                  />
                )}
                <span dangerouslySetInnerHTML={{ __html: data.sub_heading }} />
              </span>
              <h1 dangerouslySetInnerHTML={{ __html: cleanHeading(data.heading) }} />
              <p dangerouslySetInnerHTML={{ __html: cleanHeading(data.description) }} />
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

export default PortfolioBanner;
