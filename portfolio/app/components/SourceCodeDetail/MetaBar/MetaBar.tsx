import React from 'react';
import './MetaBar.css';
import { WPSourceCodeItem } from '@/types/acf';

interface MetaBarProps {
    createdBy?: string;
    releaseDate?: string;
    techStack?: string[];
    license?: NonNullable<WPSourceCodeItem['acf']>['license_section'] | string;
    liveDemoLink?: string;
    downloadLink?: string;
}

const MetaBar: React.FC<MetaBarProps> = ({
    createdBy,
    releaseDate,
    techStack,
    license,
    liveDemoLink,
    downloadLink
}) => {
    // Safety check: pull links from license object if not provided directly
    const viewLink = liveDemoLink || (typeof license !== 'string' ? license?.view_link : undefined);
    const zipLink = downloadLink || (typeof license !== 'string' ? license?.download_link : undefined);

    return (
        <section id="sc-meta-info" className="pt-3 pb-3">
            <div className="container">
                <div className="sc-meta-bar">
                    <div className="sc-meta-item">
                        <span className="sc-meta-label">Created By</span>
                        <span className="sc-meta-value">{createdBy}</span>
                    </div>
                    <div className="sc-meta-item">
                        <span className="sc-meta-label">Release Date</span>
                        <span className="sc-meta-value">{releaseDate}</span>
                    </div>
                    {techStack && techStack.length > 0 && (
                        <div className="sc-meta-item">
                            <span className="sc-meta-label">Tech Stack</span>
                            <div className="sc-meta-techs">
                                {techStack.map((tech, index) => (
                                    <span key={index} className="sc-tech-pill">{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="sc-meta-item">
                        <span className="sc-meta-label">License</span>
                        <span className="sc-meta-value">
                            {typeof license === 'string' ? license : license?.type}
                        </span>
                    </div>
                    <div className="sc-meta-actions btn-group-hero m-0 p-0" style={{ gap: '15px' }}>
                        {viewLink && (
                            <a href={viewLink} className="primary-btn m-0" style={{ padding: '12px 28px' }} target="_blank" rel="noopener noreferrer">
                                <span className="primary-btn-icon">
                                    <svg width="10" className="primary-btn-svg-after" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                    <svg className="primary-btn-svg-before" xmlns="http://www.w3.org/2000/svg" width="10" fill="none" viewBox="0 0 14 15">
                                        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"></path>
                                    </svg>
                                </span>
                                Live Demo
                            </a>
                        )}
                        {zipLink && (
                            <a href={zipLink} className="secondary-btn m-0" style={{ padding: '12px 28px' }}>
                                <span>Download Zip</span>
                                <svg width="15px" height="10px" viewBox="0 0 13 10">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MetaBar;
