import Link from 'next/link';
import { WPBlogPost } from '@/types/acf';
import './TipsFeatured.css';

interface TipsFeaturedProps {
    data: {
        sub_heading?: string;
        sub_heading_image?: string | number | { url: string };
        title?: string;
        description?: string;
    };
    tips: WPBlogPost[];
}

export default function TipsFeatured({ data, tips }: TipsFeaturedProps) {
  const subHeadingImg = typeof data.sub_heading_image === 'string' ? data.sub_heading_image : "";
  
  // Display up to 3 featured tips (or just the latest 3)
  const featuredTips = tips.slice(0, 3);
  const topTip = featuredTips[0];
  const sideTips = featuredTips.slice(1, 3);

  const getImageUrl = (tip: WPBlogPost) => {
      if (tip._embedded && tip._embedded['wp:featuredmedia']) {
          return tip._embedded['wp:featuredmedia'][0].source_url;
      }
      return "";
  };

  return (
    <section id="featured-tips-tricks" className="tips-tricks section-spacing">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-12 text-center">
                    <div className="section-title">
                        <span className="sub-heading-tag-2">
                            {subHeadingImg && (
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src={subHeadingImg} alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                            )}
                            {data.sub_heading}
                        </span>
                        <h2 dangerouslySetInnerHTML={{ __html: data.title || "" }}></h2>
                        <div className="section-para-center">
                            {data.description && <div dangerouslySetInnerHTML={{ __html: data.description }}></div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row py-5 g-4">
                {topTip && (
                <div className="col-xl-6">
                    <article>
                        <Link href={`/tips-and-tricks/${topTip.slug}`} className="card border-0">
                            <div className="card-image">
                                <img src={getImageUrl(topTip)} alt={topTip.title.rendered} className="img-fluid" />
                            </div>
                            <span className="tip-card-badge">FEATURED</span>
                            <div className="card-img-overlay">
                                <span className="tip-card-number">01</span>
                                <h3 dangerouslySetInnerHTML={{ __html: topTip.title.rendered }}></h3>
                                <div dangerouslySetInnerHTML={{ __html: topTip.excerpt.rendered }}></div>
                                <div className="primary-btn mt-3">
                                    <span className="primary-btn-icon">
                                        <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                        <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                            <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                        </svg>
                                    </span>
                                    Read More
                                </div>
                            </div>
                        </Link>
                    </article>
                </div>
                )}
                
                <div className="col-xl-6 right-column d-flex flex-column flex-lg-row flex-xl-column justify-content-between gap-4">
                    {sideTips.map((tip, idx) => (
                    <article key={tip.id}>
                        <Link href={`/tips-and-tricks/${tip.slug}`} className="card">
                            <div className="row g-0">
                                <div className="col-md-5 position-relative">
                                    <div className="card-image">
                                        <img src={getImageUrl(tip)} alt={tip.title.rendered} className="img-fluid" />
                                    </div>
                                    <span className="tip-card-number">0{idx + 2}</span>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body">
                                        <h3 dangerouslySetInnerHTML={{ __html: tip.title.rendered }}></h3>
                                        <div dangerouslySetInnerHTML={{ __html: tip.excerpt.rendered }}></div>
                                        <div className="secondary-btn mt-3">
                                            <span>Read More</span>
                                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                                <path d="M1,5 L11,5"></path>
                                                <polyline points="8 1 12 5 8 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </article>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
