import React from 'react';
import './LegalPage.css';
import Breadcrumb, { BreadcrumbItem } from '@/app/components/Common/Breadcrumb';

export interface LegalSection {
    body: React.ReactNode;
}

interface LegalPageProps {
    pageId: string;
    badge: string;
    title: React.ReactNode;
    subtitle: string;
    lastUpdated: string;
    backgroundImage: string;
    breadcrumbs: BreadcrumbItem[];
    children: React.ReactNode;
}

const LegalPage = ({
    pageId,
    badge,
    badgeIcon,
    title,
    subtitle,
    lastUpdated,
    backgroundImage,
    breadcrumbs,
    children,
}: LegalPageProps & { badgeIcon?: string }) => {
    return (
        <main className="main-content">
            {/* Banner */}
            <section
                id={`${pageId}-banner`}
                className="inner-banner section-spacing"
                style={{
                    background: backgroundImage
                        ? `linear-gradient(135deg, rgb(11 102 106 / 64%), rgb(11 102 106 / 70%)), url('${backgroundImage}')`
                        : `var(--footer-bg)`,
                }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="banner-content-wrapper text-center">
                                <span className="sub-heading-tag-1">
                                    {badgeIcon && (
                                        <div className="sub-heading-image">
                                            <picture>
                                                <img
                                                    src={badgeIcon}
                                                    alt={badge || "Legal"}
                                                    width="20"
                                                    height="20"
                                                    loading="lazy"
                                                    className="img-fluid"
                                                />
                                            </picture>
                                        </div>
                                    )}
                                    {badge}
                                </span>
                                {typeof title === 'string' ? (
                                    <h1 dangerouslySetInnerHTML={{ __html: title }} />
                                ) : (
                                    <h1>{title}</h1>
                                )}
                                {typeof subtitle === 'string' && subtitle && (
                                    <p
                                        className="banner-desc"
                                        dangerouslySetInnerHTML={{ __html: subtitle }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbs} />

            {/* Policy Content */}
            <section className="policy-content-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="policy-card">
                                <div className="policy-text-wrapper">
                                    {lastUpdated && <span className="last-updated">Last Updated: {lastUpdated}</span>}
                                    <div className="policy-text">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default LegalPage;

