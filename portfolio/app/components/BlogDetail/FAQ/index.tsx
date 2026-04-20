import React from 'react';
import './css/FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQProps {
  data?: {
    sub_heading?: string;
    title?: string;
    description?: string;
    faq_items?: FAQItem[];
  };
  faqs?: FAQItem[];
}

const BlogFAQ: React.FC<BlogFAQProps> = ({ data, faqs }) => {
  const faq_items = data?.faq_items || faqs;
  if (!faq_items || faq_items.length === 0) return null;

  const { sub_heading, title, description } = data || {};

  return (
    <section id="pd-faq" className="faq section-spacing">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="section-title section-title-center">
              <span className="sub-heading-tag-2">
                <div className="sub-heading-image">
                  <picture>
                    <img src="/images/user-2.svg" alt="Techu Mayur" width="20" height="20" loading="lazy" fetchPriority="high" className="img-fluid" />
                  </picture>
                </div>
                {sub_heading || "FAQ'S"}
              </span>
              <h2 dangerouslySetInnerHTML={{ __html: title || "Common Questions" }} />
              <div className="section-para-center">
                <p>{description}</p>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="faq-accordion-wrapper">
              <div id="faqAccordion">
                <div className="row g-4">
                  <div className="col-lg-6">
                    {faq_items.slice(0, Math.ceil(faq_items.length / 2)).map((faq, index) => (
                      <div className="accordion-item" key={index}>
                        <div className="faq-number">{`0${index + 1}`.slice(-2)}</div>
                        <h3 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#faq${index}`}
                            aria-expanded="false"
                            aria-controls={`faq${index}`}
                          >
                            <div className="faq-icon-box">
                              <picture>
                                <img src="/images/home/faq.svg" alt="Techu Mayur" width="30" height="30" loading="lazy" className="img-fluid" />
                              </picture>
                            </div>
                            <span>{faq.question}</span>
                          </button>
                        </h3>
                        <div id={`faq${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-6">
                    {faq_items.slice(Math.ceil(faq_items.length / 2)).map((faq, index) => {
                      const actualIndex = index + Math.ceil(faq_items.length / 2);
                      return (
                        <div className="accordion-item" key={actualIndex}>
                          <div className="faq-number">{`0${actualIndex + 1}`.slice(-2)}</div>
                          <h3 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#faq${actualIndex}`}
                              aria-expanded="false"
                              aria-controls={`faq${actualIndex}`}
                            >
                              <div className="faq-icon-box">
                                <picture>
                                  <img src="/images/home/faq.svg" alt="Techu Mayur" width="30" height="30" loading="lazy" className="img-fluid" />
                                </picture>
                              </div>
                              <span>{faq.question}</span>
                            </button>
                          </h3>
                          <div id={`faq${actualIndex}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFAQ;
