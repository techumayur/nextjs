import React from 'react';
import Image from 'next/image';

interface FAQItem {
    question: string;
    answer: string;
}

interface TipsFAQProps {
    faqs?: FAQItem[];
    subHeading?: string;
    heading?: string;
    description?: string;
}

const TipsFAQ: React.FC<TipsFAQProps> = ({
    faqs = [],
    subHeading = "FAQ'S",
    heading = 'Common <span class="highlight">Questions</span>',
    description = "Everything you need to know about this project. Can't find the answer you're looking for? Feel free to reach out directly."
}) => {
    if (!faqs || faqs.length === 0) return null;

    return (
        <section id="pd-faq" className="faq section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <picture>
                                        <Image src="/images/user-2.svg" alt="Techu Mayur" width={20} height={20} loading="lazy" className="img-fluid" />
                                    </picture>
                                </div>
                                {subHeading}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: heading }} />
                            <div className="section-para-center">
                                <div dangerouslySetInnerHTML={{ __html: description }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="faq-accordion-wrapper">
                            <div id="faqAccordion">
                                <div className="row g-4">
                                    <div className="col-lg-6">
                                        {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
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
                                                                <Image src="/images/home/faq.svg" alt="Techu Mayur" width={30} height={30} loading="lazy" className="img-fluid" />
                                                            </picture>
                                                        </div>
                                                        <span>{faq.question}</span>
                                                    </button>
                                                </h3>
                                                <div id={`faq${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                    <div className="accordion-body">
                                                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-lg-6">
                                        {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => {
                                            const actualIndex = index + Math.ceil(faqs.length / 2);
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
                                                                    <Image src="/images/home/faq.svg" alt="Techu Mayur" width={30} height={30} loading="lazy" className="img-fluid" />
                                                                </picture>
                                                            </div>
                                                            <span>{faq.question}</span>
                                                        </button>
                                                    </h3>
                                                    <div id={`faq${actualIndex}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                        <div className="accordion-body">
                                                            <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
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

export default TipsFAQ;
