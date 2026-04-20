import React from 'react';
import Image from 'next/image';

interface FAQItem {
    question: string;
    answer: string;
    icon?: string;
}

interface PortfolioFAQProps {
    subHeading?: string;
    heading?: string;
    highlightText?: string;
    description?: string;
    faqs?: FAQItem[];
}

const PortfolioFAQ: React.FC<PortfolioFAQProps> = ({
    subHeading,
    heading,
    highlightText,
    description,
    faqs
}) => {
    const safeFaqs = Array.isArray(faqs) ? faqs : [];
    if (safeFaqs.length === 0 && !heading && !subHeading && !description) return null;

    const half = Math.ceil(safeFaqs.length / 2);
    const firstCol = safeFaqs.slice(0, half);
    const secondCol = safeFaqs.slice(half);

    const formatNumber = (num: number) => (num + 1).toString().padStart(2, '0');

    return (
        <section id="home-faq" className="faq-section section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    <picture>
                                        <Image
                                            src="/images/user-2.svg"
                                            alt="Techu Mayur"
                                            width={20}
                                            height={20}
                                            loading="lazy"
                                            fetchPriority="high"
                                            className="img-fluid"
                                        />
                                    </picture>
                                </div>
                                {subHeading}
                            </span>
                            <h2>{heading}<span className="highlight">{highlightText}</span></h2>
                            <div className="section-para-center">
                                {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
                            </div>
                        </div>
                    </div>
                    {faqs && faqs.length > 0 && (
                        <div className="col-12">
                            <div className="faq-accordion-wrapper">
                                <div id="faqAccordion">
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            {firstCol.map((faq, idx) => {
                                                const faqId = `faq-${idx}`;
                                                return (
                                                    <div className="accordion-item" key={faqId}>
                                                        <div className="faq-number">{formatNumber(idx)}</div>
                                                        <h3 className="accordion-header">
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#${faqId}`}
                                                                aria-expanded="false"
                                                                aria-controls={faqId}
                                                                data-bs-parent="#faqAccordion"
                                                            >
                                                                <div className="faq-icon-box">
                                                                    <picture>
                                                                        <Image
                                                                            src={faq.icon && typeof faq.icon === 'string' && faq.icon.trim() !== '' ? faq.icon : "/images/home/faq.svg"}
                                                                            alt="FAQ Icon"
                                                                            width={30}
                                                                            height={30}
                                                                            loading="lazy"
                                                                            fetchPriority="high"
                                                                            className="img-fluid"
                                                                        />
                                                                    </picture>
                                                                </div>
                                                                <span>{faq.question}</span>
                                                            </button>
                                                        </h3>
                                                        <div
                                                            id={faqId}
                                                            className="accordion-collapse collapse"
                                                            data-bs-parent="#faqAccordion"
                                                        >
                                                            <div className="accordion-body">
                                                                <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="col-lg-6">
                                            {secondCol.map((faq, idx) => {
                                                const actualIdx = idx + half;
                                                const faqId = `faq-${actualIdx}`;
                                                return (
                                                    <div className="accordion-item" key={faqId}>
                                                        <div className="faq-number">{formatNumber(actualIdx)}</div>
                                                        <h3 className="accordion-header">
                                                            <button
                                                                className="accordion-button collapsed"
                                                                type="button"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target={`#${faqId}`}
                                                                aria-expanded="false"
                                                                aria-controls={faqId}
                                                                data-bs-parent="#faqAccordion"
                                                            >
                                                                <div className="faq-icon-box">
                                                                    <picture>
                                                                        <Image
                                                                            src={faq.icon && typeof faq.icon === 'string' && faq.icon.trim() !== '' ? faq.icon : "/images/home/faq.svg"}
                                                                            alt="FAQ Icon"
                                                                            width={30}
                                                                            height={30}
                                                                            loading="lazy"
                                                                            fetchPriority="high"
                                                                            className="img-fluid"
                                                                        />
                                                                    </picture>
                                                                </div>
                                                                <span>{faq.question}</span>
                                                            </button>
                                                        </h3>
                                                        <div
                                                            id={faqId}
                                                            className="accordion-collapse collapse"
                                                            data-bs-parent="#faqAccordion"
                                                        >
                                                            <div className="accordion-body">
                                                                <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioFAQ;
