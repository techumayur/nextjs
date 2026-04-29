import Image from 'next/image';
import { ACFAboutPage } from "@/types/acf";
import { parseHtml } from "@/app/lib/parseHtml";

interface AboutBannerProps {
  data: ACFAboutPage['banner'];
}

const AboutBanner: React.FC<AboutBannerProps> = ({ data }) => {
  if (!data) return null;

  const bgStyle = {
    background: `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)),  url('${data.background_image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <section id="about-banner" className="inner-banner section-spacing" style={bgStyle}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner-content-wrapper text-center">
              {data.sub_heading && (
                <span className="sub-heading-tag-1 d-inline-flex align-items-center mb-3">
                  {data.sub_heading_icon && (
                    <div className="sub-heading-image d-inline-block me-2">
                      <Image 
                        src={data.sub_heading_icon} 
                        alt={data.sub_heading} 
                        width={20} 
                        height={20} 
                        className="img-fluid"
                        style={{ height: 'auto' }}
                        priority
                        unoptimized
                      />
                    </div>
                  )}
                  <span dangerouslySetInnerHTML={{ __html: parseHtml(data.sub_heading) }} />
                </span>
              )}
              {data.heading && (
                <h1 dangerouslySetInnerHTML={{ __html: parseHtml(data.heading) }} />
              )}
              {data.description && (
                <p dangerouslySetInnerHTML={{ __html: parseHtml(data.description) }} />
              )}
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

export default AboutBanner;
