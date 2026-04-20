"use client";

import Image from 'next/image';
import { ACFBrands } from "@/types/acf";
import "./PortfolioBrands.css";

interface PortfolioBrandsProps {
    data: ACFBrands | null;
}

const PortfolioBrands = ({ data }: PortfolioBrandsProps) => {
    if (!data) return null;

    const subHeading = data.sub_heading || "Valued Partners";
    const subHeadingIcon = typeof data.sub_heading_icon === 'string' ? data.sub_heading_icon : 
                          (typeof data.sub_heading_icon === 'object' && data.sub_heading_icon?.url ? data.sub_heading_icon.url : '');
    const heading = data.heading || "Our Valued <span class=\"highlight\">Partners</span>";

    const row1 = data.marquee_row_1 || [];
    const row2 = data.marquee_row_2 || [];

    // Combine for smooth infinite scroll (duplicate for seamless loop)
    const renderMarqueeItems = (items: { logo: string | number | { url: string }; name: string }[]) => {
        // Triple the items to ensure it fills the width and loops seamlessly
        const tripledItems = [...items, ...items, ...items];
        return tripledItems.map((item, index) => {
            const logoUrl = typeof item.logo === 'string' ? item.logo : "/images/brand-placeholder.svg";
            return (
                <div className="brand-item" key={index}>
                    <img src={logoUrl} alt={item.name} loading="lazy" />
                </div>
            );
        });
    };

    return (
        <section id="portfolio-brands" className="section-spacing overflow-hidden bg-white">
            <div className="container-fluid">
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <div className="section-title text-center">
                            <span className="sub-heading-tag-2">
                                {subHeadingIcon && (
                                    <div className="sub-heading-image">
                                        <Image
                                            src={subHeadingIcon}
                                            alt="Partners Icon"
                                            width={20}
                                            height={20}
                                            className="img-fluid"
                                        />
                                    </div>
                                )}
                                <span dangerouslySetInnerHTML={{ __html: subHeading }} />
                            </span>
                            <h2 dangerouslySetInnerHTML={{ __html: heading }} />
                        </div>
                    </div>
                </div>

                <div className="marquee-wrapper">
                    {/* Row 1: Left to Right */}
                    {row1.length > 0 && (
                        <div className="marquee-row scroll-left">
                            <div className="marquee-content">
                                {renderMarqueeItems(row1)}
                            </div>
                        </div>
                    )}

                    {/* Row 2: Right to Left */}
                    {row2.length > 0 && (
                        <div className="marquee-row scroll-right mt-4">
                            <div className="marquee-content">
                                {renderMarqueeItems(row2)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PortfolioBrands;
