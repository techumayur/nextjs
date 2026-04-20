import React from 'react';
import Image from 'next/image';
import './SocialBuzz.css';

interface SocialBuzzProps {
    sub_heading?: string;
    sub_heading_icon?: string;
    title?: string;
    description?: string;
    social_links?: { 
        platform: string; 
        url: string; 
        icon_svg?: string | { url?: string }; 
        icon?: string | number | { url?: string }; 
    }[];
}

const SocialBuzz = ({
    sub_heading,
    sub_heading_icon,
    title,
    description,
    social_links = []
}: SocialBuzzProps) => {
    return (
        <section id="social-buzz" className="section-spacing">
            <div className="container">
                <div className="section-title section-title-center">
                    <span className="sub-heading-tag-2">
                        <div className="sub-heading-image">
                            {sub_heading_icon && sub_heading_icon.startsWith('<svg') ? (
                                <div dangerouslySetInnerHTML={{ __html: sub_heading_icon }} />
                            ) : (
                                <Image 
                                    src={sub_heading_icon || "/images/user-2.svg"} 
                                    alt="Icon" 
                                    width={20} 
                                    height={20} 
                                    className="img-fluid" 
                                    unoptimized
                                />
                            )}
                        </div>
                        {sub_heading}
                    </span>
                    <h2 dangerouslySetInnerHTML={{ __html: title || "" }}></h2>
                    {description && <p className="mt-3">{description}</p>}
                </div>
                <div className="contact-social-links">
                    {social_links.map((social, idx) => (
                        <a key={idx} href={social.url} className="contact-social-link" target="_blank" rel="noopener noreferrer" title={social.platform}>
                            <div className="contact-social-icon">
                                {(() => {
                                    const rawSvg = social.icon_svg;
                                    const svgSrc = typeof rawSvg === 'string' ? rawSvg.trim() : (rawSvg as { url?: string })?.url || '';
                                    const rawIcon = social.icon;
                                    const iconUrl = typeof rawIcon === 'string' ? rawIcon : (rawIcon as { url?: string } | undefined)?.url || '';
                                    const imgSrc = iconUrl || (svgSrc && !svgSrc.startsWith('<') ? svgSrc : '');
                                    
                                    if (svgSrc && svgSrc.startsWith('<')) {
                                        return <div dangerouslySetInnerHTML={{ __html: svgSrc }} className="icon-svg-wrapper"></div>;
                                    }
                                    if (imgSrc) {
                                        return (
                                            <Image 
                                                src={imgSrc} 
                                                alt={social.platform} 
                                                width={22} 
                                                height={22} 
                                                className="img-fluid" 
                                                unoptimized
                                            />
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                            <span>{social.platform}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialBuzz;
