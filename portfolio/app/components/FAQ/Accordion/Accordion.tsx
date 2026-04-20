"use client";
import React from 'react';
import './Accordion.css';
import { FaqDynamicData } from '@/app/lib/getFaq';

interface AccordionProps {
    categories: FaqDynamicData['categories'];
}

const Accordion = ({ categories }: AccordionProps) => {
    if (!categories || categories.length === 0) return null;

    return (
        <section id="faq-content" className="faq-content-section section-spacing pt-0">
            <div className="container">
                {categories.map((category) => (
                    <div key={category.id} className="faq-category-wrapper mb-5">
                        <div className="category-header">
                            <div dangerouslySetInnerHTML={{ __html: category.icon_svg }} />
                            <h3 dangerouslySetInnerHTML={{ __html: category.title }} />
                        </div>
                        <div className="faq-accordion-wrapper accordion" id={`faq-accordion-${category.id}`}>
                            <div className="row g-4">
                                {category.faqs.map((faq, faqIndex) => (
                                    <div key={faq.id} className="col-lg-6">
                                        <div className="accordion-item reveal-item">
                                            <div className="faq-number">{(faqIndex + 1).toString().padStart(2, '0')}</div>
                                            <h3 className="accordion-header">
                                                <button 
                                                    className="accordion-button collapsed" 
                                                    type="button" 
                                                    data-bs-toggle="collapse" 
                                                    data-bs-target={`#faq-item-${faq.id}`} 
                                                    aria-expanded="false"
                                                    aria-controls={`faq-item-${faq.id}`}
                                                >
                                                    <div className="faq-icon-box">
                                                        <picture>
                                                            <img src="/images/home/faq.svg" alt="FAQ Icon" width="30" height="30" loading="lazy" fetchPriority="high" className="img-fluid" />
                                                        </picture>
                                                    </div>
                                                    <span dangerouslySetInnerHTML={{ __html: faq.question }} />
                                                </button>
                                            </h3>
                                            <div id={`faq-item-${faq.id}`} className="accordion-collapse collapse" data-bs-parent={`#faq-accordion-${category.id}`}>
                                                <div className="accordion-body">
                                                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Accordion;

