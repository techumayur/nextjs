import React from 'react';
import Image from 'next/image';
import './Hero.css';

interface ContactHeroProps {
    badge_text?: string;
    badge_icon?: string;
    title?: string;
    description?: string;
    feature_pills?: { label: string, icon_type: string, pill_type: 'teal' | 'orange' }[];
    info_cards?: { title: string, description: string, icon_svg: string, badge?: string, link?: string }[];
}

const ContactHero = ({
    badge_text,
    badge_icon,
    title,
    description,
    feature_pills = [],
    info_cards = []
}: ContactHeroProps) => {

    const renderPillIcon = (icon: string, label: string) => {
        if (!icon) return null;
        
        if (icon.startsWith('<svg')) {
            return <div className="d-inline-flex" dangerouslySetInnerHTML={{ __html: icon }} />;
        }
        
        return (
            <Image 
                src={icon} 
                alt={label} 
                width={14} 
                height={14} 
                className="pill-icon-img"
                unoptimized
            />
        );
    };

    return (
        <section id="contact-hero" className="section-spacing">
            <div className="container">
                <div className="row align-items-center gx-5">
                    <div className="col-lg-6">
                        <div className="home-banner-content">
                            <span className="sub-heading-tag-1 justify-content-center mx-auto mb-3">
                                <div className="sub-heading-image">
                                    {(badge_icon && badge_icon.startsWith('<svg')) ? (
                                        <div dangerouslySetInnerHTML={{ __html: badge_icon }} />
                                    ) : (
                                        <Image 
                                            src={badge_icon || "/images/user-1.svg"} 
                                            alt="User Icon" 
                                            width={20} 
                                            height={20} 
                                            loading="lazy" 
                                            className="img-fluid"
                                            unoptimized
                                        />
                                    )}
                                </div>
                                {badge_text}
                            </span>
                            {title && /<h[1-6][^>]*>/i.test(title) ? (
                                <div className="hero-title-wrapper" dangerouslySetInnerHTML={{ __html: title }}></div>
                            ) : (
                                <h2 dangerouslySetInnerHTML={{ __html: title || "" }}></h2>
                            )}
                            <p>{description}</p>
                            <div className="feature-pills mb-5">
                                {feature_pills.map((pill, idx) => (
                                    <div key={idx} className={`pill pill-${pill.pill_type}`}>
                                        {renderPillIcon(pill.icon_type, pill.label)}
                                        <span>{pill.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="visual-container contact-info-grid">
                            {info_cards.map((card, idx) => (
                                <div key={idx} className={`creative-card card-${idx + 1}`}>
                                    <div className={`card-icon-wrapper ${idx % 2 === 1 ? 'alt' : ''}`}>
                                        {card.icon_svg && card.icon_svg.startsWith('<svg') ? (
                                            <div dangerouslySetInnerHTML={{ __html: card.icon_svg }} />
                                        ) : (
                                            card.icon_svg && (
                                                <Image 
                                                    src={card.icon_svg} 
                                                    alt={card.title} 
                                                    width={20} 
                                                    height={20} 
                                                    className="img-fluid"
                                                    unoptimized
                                                />
                                            )
                                        )}
                                    </div>
                                    <h3 className="card-title">{card.title}</h3>
                                    <p className="card-description">{card.description}</p>
                                    {card.badge && (
                                        card.link ? (
                                            <a href={card.link} target="_blank" rel="noopener noreferrer" className="card-badge">
                                                {card.badge}
                                            </a>
                                        ) : (
                                            <span className="card-badge">{card.badge}</span>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default ContactHero;
