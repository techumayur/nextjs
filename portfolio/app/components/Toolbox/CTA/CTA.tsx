import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './CTA.css';
import { ToolboxPageData } from '@/types/toolbox';

interface CTAProps {
    data: ToolboxPageData['acf']['cta'];
}

const ToolboxCTA = ({ data }: CTAProps) => {
    if (!data) return null;

    return (
        <section id="toolbox-cta" className="section-spacing pt-0">
            <div className="reveal-item">
                <div className="container">
                    <div className="cta-card toolbox-modern-cta">
                        <div className="cta-pattern"></div>
                        <div className="cta-content-wrapper">
                            <div className="cta-left">
                                <div className="cta-badge">
                                    {((typeof data.badge_icon === 'string' && data.badge_icon) || (typeof data.badge_icon === 'object' && (data.badge_icon as { url: string }).url)) && (
                                        <picture>
                                            <img src={typeof data.badge_icon === 'string' ? data.badge_icon : (data.badge_icon as { url: string }).url} alt="Elite Tools" width="15" height="15" loading="lazy" fetchPriority="high" className="img-fluid" />
                                        </picture>
                                    )}
                                    <span>{data.badge_text}</span>
                                </div>
                                <h2 dangerouslySetInnerHTML={{ __html: data.title }} />
                                <div dangerouslySetInnerHTML={{ __html: data.description }} />

                                <div className="cta-stats-grid">
                                    {data.stats?.map((stat, index) => (
                                        <div key={index} className="cta-stat-box">
                                            <strong>{stat.value}</strong>
                                            <span>{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="cta-buttons-group">
                                    <Link href={data.primary_button?.url || "#"} className="primary-btn">
                                        <span className="primary-btn-icon">
                                            <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                            <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                            </svg>
                                        </span>
                                        <span className="btn-text">{data.primary_button?.title}</span>
                                    </Link>
                                    <Link href={data.secondary_button?.url || "#"} className="secondary-btn">
                                        <span>{data.secondary_button?.title}</span>
                                        <svg width="15px" height="10px" viewBox="0 0 13 10">
                                            <polyline points="8 1 12 5 8 9"></polyline>
                                            <path d="M1,5 L11,5"></path>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="cta-right">
                                <div className="cta-visual-grid">
                                    {data.visual_cards?.map((card, index) => (
                                        <div key={index} className="cta-visual-card">
                                            <div className="cta-visual-icon" style={card.bg_color ? { background: card.bg_color } : undefined}>
                                                <picture>
                                                    {((typeof card.icon === 'string' && card.icon) || (typeof card.icon === 'object' && (card.icon as { url: string }).url)) && (
                                                        <Image src={typeof card.icon === 'string' ? card.icon : (card.icon as { url: string }).url} alt={card.title} width="30" height="30" loading="lazy" />
                                                    )}
                                                </picture>
                                            </div>
                                            <div className="cta-visual-text">
                                                <strong>{card.title}</strong>
                                                <span>{card.subtitle}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ToolboxCTA;
