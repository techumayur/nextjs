import React from 'react';
import './Intro.css';
import { ACFSourceCodePage } from '@/types/acf';

interface IntroProps {
    data: ACFSourceCodePage['intro_section'];
}

const Intro: React.FC<IntroProps> = ({ data }) => {
    return (
        <section id="tips-heading" className="section-spacing text-center">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-header">
                            <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    <picture>
                                        <img src="/images/user-1.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                                    </picture>
                                </div>
                                {data.sub_heading || "Insights & Knowledge"}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: data.title || '<span class="highlight">Web Development Tips</span> & SEO Tricks' }}></h2>
                            <div className="section-para-center mx-auto" style={{ maxWidth: '800px' }}>
                                <p className="fs-5 mt-3">{data.description || "Explore my curated tips and tricks for coding, SEO, and content creation."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Intro;
