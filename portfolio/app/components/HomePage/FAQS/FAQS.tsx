"use client";

import Image from 'next/image';
import { ACFFaqSection } from '@/types/acf';

interface FAQSProps {
    sectionData: ACFFaqSection | null;
}

export default function FAQS({ sectionData }: FAQSProps) {
    if (!sectionData) return null;

    const { sub_heading, sub_heading_image, sub_heading_icon, title, description, faq_items } = sectionData;

    // Split faq_items into two columns if it's available
    const leftColItems = faq_items?.filter((_, index) => index % 2 === 0) || [];
    const rightColItems = faq_items?.filter((_, index) => index % 2 !== 0) || [];

    const iconSrc = (typeof sub_heading_icon === 'string' && sub_heading_icon !== "") 
        ? sub_heading_icon 
        : (typeof sub_heading_image === 'string' && sub_heading_image !== "")
            ? sub_heading_image
            : "";

    return (
        <section id="home-faq" className="faq-section section-spacing">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title section-title-center">
                            <span className="sub-heading-tag-2">
                                <div className="sub-heading-image">
                                    {iconSrc && (
                                        <picture>
                                            <Image 
                                                src={iconSrc} 
                                                alt="Sub Heading Icon" 
                                                width={20} 
                                                height={20} 
                                                loading="lazy" 
                                                className="img-fluid" 
                                            />
                                        </picture>
                                    )}
                                </div>
                                {sub_heading}
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: title || "" }} />
                            {description && (
                                <div className="section-para-center">
                                    <p>{description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="faq-accordion-wrapper">
                            <div id="faqAccordion">
                                <div className="row g-4">
                                    <div className="col-lg-6">
                                        {leftColItems.map((item, idx) => (
                                            <div key={`faq-left-${idx}`} className="accordion-item">
                                                <div className="faq-number">{(idx * 2 + 1).toString().padStart(2, '0')}</div>
                                                <h3 className="accordion-header">
                                                    <button 
                                                        className="accordion-button collapsed" 
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#faq-l-${idx}`}
                                                        aria-expanded="false"
                                                        aria-controls={`faq-l-${idx}`}
                                                        data-bs-parent="#faqAccordion"
                                                    >
                                                        <div className="faq-icon-box">
                                                            <Image 
                                                                src="/images/home/faq.svg" 
                                                                alt="FAQ Icon" 
                                                                width={30} 
                                                                height={30} 
                                                                loading="lazy" 
                                                                className="img-fluid" 
                                                            />
                                                        </div>
                                                        <span>{item.question}</span>
                                                    </button>
                                                </h3>
                                                <div 
                                                    id={`faq-l-${idx}`} 
                                                    className="accordion-collapse collapse" 
                                                    data-bs-parent="#faqAccordion"
                                                >
                                                    <div className="accordion-body">
                                                        <p>{item.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-lg-6">
                                        {rightColItems.map((item, idx) => (
                                            <div key={`faq-right-${idx}`} className="accordion-item">
                                                <div className="faq-number">{(idx * 2 + 2).toString().padStart(2, '0')}</div>
                                                <h3 className="accordion-header">
                                                    <button 
                                                        className="accordion-button collapsed" 
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#faq-r-${idx}`}
                                                        aria-expanded="false"
                                                        aria-controls={`faq-r-${idx}`}
                                                        data-bs-parent="#faqAccordion"
                                                    >
                                                        <div className="faq-icon-box">
                                                            <Image 
                                                                src="/images/home/faq.svg" 
                                                                alt="FAQ Icon" 
                                                                width={30} 
                                                                height={30} 
                                                                loading="lazy" 
                                                                className="img-fluid" 
                                                            />
                                                        </div>
                                                        <span>{item.question}</span>
                                                    </button>
                                                </h3>
                                                <div 
                                                    id={`faq-r-${idx}`} 
                                                    className="accordion-collapse collapse" 
                                                    data-bs-parent="#faqAccordion"
                                                >
                                                    <div className="accordion-body">
                                                        <p>{item.answer}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
