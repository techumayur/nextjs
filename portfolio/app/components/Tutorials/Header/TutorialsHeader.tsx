import React from 'react';
import './TutorialsHeader.css';

const TutorialsHeader: React.FC = () => {
    return (
        <section id="tutorials-heading" className="section-spacing text-center pb-0">
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
                                Step-by-Step Learning
                            </span>
                            <h2>Premium <span className="highlight">Web Tutorials</span> & Bootcamps</h2>
                            <div className="section-para-center mx-auto" style={{ maxWidth: "800px" }}>
                                <p className="fs-5 mt-3">Curated paths and deep-dive tutorials focusing on performance, scalability, and modern best practices.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TutorialsHeader;

