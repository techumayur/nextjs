import React from 'react';

interface TipsHeaderProps {
    data: {
        sub_heading?: string;
        sub_heading_image?: string | number | { url: string };
        title?: string;
        description?: string;
    };
}

export default function TipsHeader({ data }: TipsHeaderProps) {
  const subHeadingImg = typeof data.sub_heading_image === 'string' ? data.sub_heading_image : "";

  return (
    <section id="tips-heading" className="section-spacing text-center">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="section-header">
                        <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
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
                        <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                            {data.description && <div className="fs-5 mt-3" dangerouslySetInnerHTML={{ __html: data.description }}></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
